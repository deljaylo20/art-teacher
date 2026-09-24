/*
  SITE SETTINGS — fill these in before launch.
    formEndpoint        URL that receives the Contact form (e.g. a GoHighLevel / Formspree / Pages Function endpoint). POSTs JSON.
    newsletterEndpoint  URL that receives newsletter sign-ups. POSTs JSON.
    email               Susan's public email. Used as a mailto fallback if an endpoint is blank.
*/
window.SITE = {
  formEndpoint: "",
  newsletterEndpoint: "",
  email: ""
};

(function () {
  const works = window.ARTWORKS || [];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Generated color-field placeholder, used until a real image is added.
  function placeholder(w) {
    const [a, b, c] = w.hue || [30, 20, 200];
    return `<div class="ph" aria-hidden="true" style="background:
      radial-gradient(120% 70% at 30% 20%, hsl(${a} 38% 72% / .95), transparent 60%),
      radial-gradient(90% 80% at 80% 90%, hsl(${b} 30% 38% / .9), transparent 65%),
      linear-gradient(160deg, hsl(${c} 18% 86%), hsl(${b} 22% 58%))"></div>`;
  }
  function artHTML(w, opts = {}) {
    const alt = esc(w.title + (w.medium ? ", " + w.medium : ""));
    const inner = w.src ? `<img src="${esc(thumb(w.src))}" alt="${alt}" loading="${opts.eager ? "eager" : "lazy"}" decoding="async" class="fade">` : placeholder(w);
    const style = opts.ratio ? ` style="aspect-ratio:${w.ratio || 1}"` : "";
    return `<div class="art"${style}${w.src ? "" : ` role="img" aria-label="${alt} (placeholder)"`}>${inner}</div>`;
  }
  const slug = (w) => (w.src ? w.src.split("/").pop().replace(/\.[^.]+$/, "") : "art-" + works.indexOf(w));
  const thumb = (src) => src.replace(/\/([^/]+)$/, "/thumbs/$1");
  const detail = (w) => [w.year, w.medium, w.size].filter(Boolean).join(" · ");

  const no = (i) => String(i + 1).padStart(2, "0");
  function tile(w, i, opts) {
    const right = [w.medium, w.year, w.status].filter(Boolean).join(" · ");
    return `<button class="item" type="button" data-i="${i}" aria-label="View ${esc(w.title)}">
      ${artHTML(w, opts)}
      <div class="meta"><span class="n">${no(i)}</span><span class="t">${esc(w.title)}</span><span class="r">${esc(right)}</span></div>
    </button>`;
  }

  // ---------- Viewer (dark, zoomable, deep-linkable, with related works) ----------
  let list = [], pos = 0, lastFocus = null, zoomed = false;
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Artwork viewer");
  lb.innerHTML = `<div class="lb-stage"></div>
    <div class="lb-info"><div class="lb-caption" aria-live="polite"></div><div class="lb-related"></div></div>
    <button class="lb-btn lb-close" aria-label="Close">&times;</button>
    <button class="lb-btn lb-zoom" aria-label="Zoom in" aria-pressed="false">+</button>
    <button class="lb-btn lb-prev" aria-label="Previous">&#8592;</button>
    <button class="lb-btn lb-next" aria-label="Next">&#8594;</button>`;
  document.body.appendChild(lb);
  const stage = lb.querySelector(".lb-stage"), cap = lb.querySelector(".lb-caption"), rel = lb.querySelector(".lb-related"), zoomBtn = lb.querySelector(".lb-zoom");

  function setZoom(on, e) {
    const img = stage.querySelector("img"); if (!img) return;
    zoomed = on; stage.classList.toggle("zoomed", on);
    zoomBtn.textContent = on ? "\u2212" : "+"; zoomBtn.setAttribute("aria-pressed", on); zoomBtn.setAttribute("aria-label", on ? "Zoom out" : "Zoom in");
    if (on && e) pan(e); else img.style.transformOrigin = "50% 50%";
  }
  function pan(e) {
    const img = stage.querySelector("img"); if (!img || !zoomed) return;
    const r = img.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100;
    img.style.transformOrigin = `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`;
  }
  stage.addEventListener("mousemove", pan);
  stage.addEventListener("click", (e) => { if (e.target.tagName === "IMG") setZoom(!zoomed, e); else if (!zoomed) close(); });
  zoomBtn.addEventListener("click", () => setZoom(!zoomed));

  function show() {
    const i = list[pos], w = works[i];
    setZoom(false); stage.classList.remove("zoomed");
    stage.innerHTML = w.src ? `<img src="${esc(w.src)}" alt="${esc(w.title)}" class="fade">` : `<div class="art" style="aspect-ratio:${w.ratio || 1};height:100%;max-height:100%">${placeholder(w)}</div>`;
    zoomBtn.hidden = !w.src;
    const d = detail(w);
    cap.innerHTML = `<span class="n">No. ${no(i)}${w.category ? " &middot; " + esc(w.category) : ""}</span><span class="t">${esc(w.title)}</span>${esc(d)}${d && w.status ? " · " : ""}${esc(w.status || "")}
      <a class="link" href="contact.html?piece=${encodeURIComponent(w.title)}">Inquire</a>`;
    // related: same collection, excluding this one
    const more = works.map((x, k) => k).filter((k) => k !== i && w.category && works[k].category === w.category).slice(0, 8);
    rel.innerHTML = more.length ? `<p class="lb-rel-h">More in ${esc(w.category)}</p><div class="lb-rel-row">${more.map((k) =>
      `<button type="button" data-k="${k}" aria-label="View ${esc(works[k].title)}"><img src="${esc(thumb(works[k].src))}" alt="" loading="lazy" class="fade"></button>`).join("")}</div>` : "";
    lb.querySelector(".lb-prev").hidden = lb.querySelector(".lb-next").hidden = list.length < 2;
    if (history.replaceState) history.replaceState(null, "", "#" + slug(w));
  }
  rel.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-k]"); if (!b) return;
    const k = +b.dataset.k; if (!list.includes(k)) list = works.map((_, n) => n);
    pos = list.indexOf(k); show();
  });
  function open(indices, i) {
    list = indices; pos = Math.max(0, indices.indexOf(i));
    lastFocus = document.activeElement;
    show(); lb.classList.add("open"); document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }
  function close() {
    lb.classList.remove("open"); document.body.style.overflow = ""; setZoom(false);
    if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    lastFocus && lastFocus.focus();
  }
  const step = (d) => { pos = (pos + d + list.length) % list.length; show(); };
  lb.querySelector(".lb-close").onclick = close;
  lb.querySelector(".lb-prev").onclick = () => step(-1);
  lb.querySelector(".lb-next").onclick = () => step(1);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") { zoomed ? setZoom(false) : close(); }
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
    if (e.key === "z" || e.key === "Z") setZoom(!zoomed);
    if (e.key === "Tab") { // keep focus inside the viewer
      const f = [...lb.querySelectorAll("button:not([hidden]), a")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let tx = null;
  lb.addEventListener("touchstart", (e) => { tx = e.touches.length === 1 && !zoomed ? e.touches[0].clientX : null; }, { passive: true });
  lb.addEventListener("touchend", (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); tx = null; });
  window.openArtwork = (s) => { const k = works.findIndex((w) => slug(w) === s); if (k >= 0) open(works.map((_, n) => n), k); return k >= 0; };

  // Images fade in once loaded.
  document.addEventListener("load", (e) => { if (e.target.tagName === "IMG") e.target.classList.add("in"); }, true);
  const settle = () => document.querySelectorAll("img").forEach((im) => { if (im.complete && im.naturalWidth) im.classList.add("in"); });

  function bind(container, indices) {
    container.addEventListener("click", (e) => {
      const b = e.target.closest(".item"); if (b) open(indices, +b.dataset.i);
    });
  }

  // ---------- Home page ----------
  const slidesEl = document.getElementById("hero-slides");
  const featured = works.map((w, i) => (w.featured ? i : -1)).filter((i) => i >= 0);
  if (slidesEl && featured.length) {
    const capEl = document.getElementById("hero-caption"), dotsEl = document.getElementById("hero-dots"), pauseEl = document.getElementById("hero-pause");
    slidesEl.innerHTML = featured.map((i, n) => {
      const w = works[i];
      const img = w.src ? `<img src="${esc(w.src)}" alt="${esc(w.title)}" style="object-position:${esc(w.focus || "center")}" ${n ? 'loading="lazy"' : 'fetchpriority="high"'}>` : placeholder(w);
      return `<button type="button" class="slide${n ? "" : " on"}" data-i="${i}" aria-label="View ${esc(w.title)}" ${n ? 'tabindex="-1"' : ""}>${img}</button>`;
    }).join("");
    dotsEl.innerHTML = featured.map((_, n) => `<button type="button" aria-label="Show painting ${n + 1}"${n ? "" : ' aria-current="true"'}></button>`).join("");
    const slides = [...slidesEl.children], dots = [...dotsEl.children];
    let cur = 0, timer = null;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let playing = !reduce && featured.length > 1;
    function go(n) {
      slides[cur].classList.remove("on"); slides[cur].tabIndex = -1; dots[cur].removeAttribute("aria-current");
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add("on"); slides[cur].tabIndex = 0; dots[cur].setAttribute("aria-current", "true");
      const w = works[featured[cur]];
      capEl.innerHTML = `<em>${esc(w.title)}</em>${detail(w) ? " &middot; " + esc(detail(w)) : ""}`;
    }
    function tick() { clearInterval(timer); if (playing) timer = setInterval(() => go(cur + 1), 6000); }
    function setPlaying(p) { playing = p; pauseEl.textContent = p ? "Pause" : "Play"; pauseEl.setAttribute("aria-label", p ? "Pause slideshow" : "Play slideshow"); tick(); }
    slidesEl.addEventListener("click", (e) => { const s = e.target.closest(".slide"); if (s) open(featured, +s.dataset.i); });
    dotsEl.addEventListener("click", (e) => { const d = dots.indexOf(e.target); if (d >= 0) { go(d); tick(); } });
    pauseEl.addEventListener("click", () => setPlaying(!playing));
    if (featured.length < 2) { dotsEl.hidden = pauseEl.hidden = true; }
    go(0); setPlaying(playing);
  }
  // Artwork of the day: a different painting each calendar day (same for every visitor that day).
  const aotd = document.getElementById("aotd");
  const withImg = works.map((w, i) => i).filter((i) => works[i].src);
  if (aotd && withImg.length) {
    const d = new Date(), day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
    const i = withImg[day % withImg.length], w = works[i];
    aotd.innerHTML = `<button type="button" class="aotd-art" aria-label="View ${esc(w.title)}">${artHTML(w, { ratio: true })}</button>
      <div class="aotd-text">
        <p class="eyebrow">Artwork of the day &middot; ${d.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</p>
        <h2><em>${esc(w.title)}</em></h2>
        <p class="muted">${esc([w.year, w.medium, w.size].filter(Boolean).join(" · ") || "Susan Tadlock Bond")}${w.category ? `<br>From the collection <a href="gallery.html?c=${encodeURIComponent(w.category)}">${esc(w.category)}</a>` : ""}</p>
        <p class="aotd-links"><button type="button" class="link aotd-open">Look closer</button> <a class="link" href="gallery.html#${esc(slug(w))}">In the gallery</a></p>
      </div>`;
    aotd.querySelectorAll(".aotd-art, .aotd-open").forEach((el) => el.addEventListener("click", () => open(withImg, i)));
  }

  // Collections: expanding picture panels (after Google Arts & Culture's "Today's top picks").
  // The active panel widens to show more of its painting; the rest narrow and dim. Panels slide in,
  // staggered, when the row scrolls into view. On phones it becomes a swipeable row.
  const railEl = document.getElementById("collections");
  if (railEl) {
    const order = window.CATEGORIES || [];
    const present = [...new Set(works.map((w) => w.category).filter(Boolean))];
    const cats = [...order.filter((c) => present.includes(c)), ...present.filter((c) => !order.includes(c))];
    railEl.innerHTML = cats.map((c, n) => {
      const members = works.filter((w) => w.category === c), cover = members.find((w) => w.featured) || members[0];
      const names = members.slice(0, 3).map((w) => w.title).join(", ") + (members.length > 3 ? "…" : "");
      return `<a class="pick${n ? "" : " on"}" href="gallery.html?c=${encodeURIComponent(c)}" style="--d:${Math.min(n, 4) * 0.12}s">
        ${cover.src ? `<img src="${esc(cover.src)}" alt="" loading="lazy" class="fade" style="object-position:${esc(cover.focus || "center")}">` : placeholder(cover)}
        <span class="pick-dim" aria-hidden="true"></span>
        <span class="pick-txt"><span class="pick-t">${esc(c)}</span><span class="pick-s">${members.length} ${members.length === 1 ? "work" : "works"} &middot; ${esc(names)}</span></span>
      </a>`;
    }).join("");
    const picks = [...railEl.children];
    let active = 0;
    const activate = (n) => { active = (n + picks.length) % picks.length; picks.forEach((p, k) => p.classList.toggle("on", k === active)); };
    picks.forEach((p, k) => { p.addEventListener("mouseenter", () => activate(k)); p.addEventListener("focus", () => activate(k)); });
    const wrap = railEl.closest(".rail-wrap");
    wrap && wrap.querySelectorAll(".rail-btn").forEach((btn) => btn.addEventListener("click", () => {
      if (matchMedia("(max-width: 860px)").matches) railEl.scrollBy({ left: (btn.dataset.dir === "next" ? 1 : -1) * railEl.clientWidth * 0.8, behavior: "smooth" });
      else activate(active + (btn.dataset.dir === "next" ? 1 : -1));
    }));
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { railEl.classList.add("shown"); io.disconnect(); } }), { threshold: 0.25 });
      io.observe(railEl);
    } else railEl.classList.add("shown");
  }

  // ---------- Gallery page ----------
  const galEl = document.getElementById("gallery");
  if (galEl) {
    const filEl = document.getElementById("filters");
    const present = new Set(works.map((w) => w.category).filter(Boolean));
    const cats = [...(window.CATEGORIES || []).filter((c) => present.has(c)), ...[...present].filter((c) => !(window.CATEGORIES || []).includes(c))];
    const want = new URLSearchParams(location.search).get("c");
    let current = want && cats.includes(want) ? want : "All";
    function render() {
      const idx = works.map((w, i) => i).filter((i) => current === "All" || works[i].category === current);
      galEl.innerHTML = idx.map((i) => tile(works[i], i, { ratio: true })).join("");
      galEl._indices = idx;
    }
    galEl.addEventListener("click", (e) => { const b = e.target.closest(".item"); if (b) open(galEl._indices, +b.dataset.i); });
    if (filEl && cats.length > 1) {
      filEl.innerHTML = ["All", ...cats].map((c) => `<button type="button" aria-pressed="${c === current}">${esc(c)}</button>`).join("");
      filEl.addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        current = b.textContent;
        filEl.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
        if (history.replaceState) history.replaceState(null, "", current === "All" ? location.pathname : "?c=" + encodeURIComponent(current));
        render(); settle();
      });
    }
    render();
  }

  // ---------- Forms ----------
  async function submit(form, endpoint, subject) {
    const status = form.querySelector(".form-status");
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return; // honeypot
    const say = (m) => { if (status) status.textContent = m; };
    if (endpoint) {
      say("Sending…");
      try {
        const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
        form.reset(); say(form.dataset.success || "Thank you — your message is on its way.");
      } catch (err) { say("Something went wrong. Please try again, or email directly."); }
    } else if (window.SITE.email) {
      const body = Object.entries(data).filter(([k]) => k !== "website").map(([k, v]) => `${k}: ${v}`).join("\n");
      location.href = `mailto:${window.SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      say("This form isn't connected yet. (Site owner: set formEndpoint / newsletterEndpoint / email in assets/site.js.)");
    }
  }
  document.querySelectorAll("form[data-form]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const kind = f.dataset.form;
      submit(f, kind === "newsletter" ? window.SITE.newsletterEndpoint : window.SITE.formEndpoint, kind === "newsletter" ? "Newsletter sign-up" : "Website inquiry");
    });
  });

  // Pre-fill the contact form when arriving from "Inquire" on a piece.
  const piece = new URLSearchParams(location.search).get("piece");
  const msg = document.getElementById("message"), type = document.getElementById("inquiry");
  if (piece && msg) {
    msg.value = `I'm interested in "${piece}". `;
    if (type) type.value = "Purchasing a piece";
  }

  // Statement that fills in word by word as it scrolls into view.
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    const text = el.textContent.trim(), words = text.split(/\s+/);
    el.innerHTML = `<span class="sr-only">${esc(text)}</span>` + words.map((w) => `<span class="w" aria-hidden="true">${esc(w)} </span>`).join("");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("done"); return; }
    const spans = [...el.querySelectorAll(".w")];
    let ticking = false;
    function update() {
      ticking = false;
      const r = el.getBoundingClientRect(), vh = innerHeight;
      // 0 when the text top is 90% down the screen, fully lit by the time it reaches 40%
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.5)));
      const lit = Math.round(p * spans.length);
      spans.forEach((s, k) => s.classList.toggle("on", k < lit));
    }
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener("resize", update);
    update();
  });

  // Studio local time in the footer.
  const clock = document.getElementById("local-time");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" });
    const set = () => { const d = new Date(); clock.textContent = fmt.format(d); clock.dateTime = d.toISOString(); };
    set(); setInterval(set, 30000);
  }

  // Open a painting straight from a shared link, e.g. gallery.html#winter-in-wyoming
  if (location.hash.length > 1) window.openArtwork(decodeURIComponent(location.hash.slice(1)));
  settle();

  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
