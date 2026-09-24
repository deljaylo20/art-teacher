/*
  ARTWORK LIST — the only file you edit to change what shows on the site.

  For each piece:
    src       path to the full-size web image, e.g. "images/art/river-light.jpg"  (leave "" to show a placeholder)
              A 900px copy with the same name in images/art/thumbs/ is used in grids; the full image opens in the viewer.
    title     title of the work
    year      e.g. "2024"
    medium    e.g. "Oil on canvas"
    size      e.g. "24 × 30 in"
    category  used for the Gallery filters (e.g. "Painting", "Drawing", "Mixed Media")
    status    "Available", "Sold", "Private collection", or "" to hide
    ratio     width / height of the image (e.g. 0.8 for portrait 4:5, 1.25 for landscape) — keeps the grid tidy
    featured  true = rotates in the full-width slideshow at the top of the home page, in this order.
              The first 4 (or 6, once there are 6+) also fill "From the studio".
    focus     optional. Which part of the painting stays in view when the slideshow crops it to a wide band,
              as "x% y%" (e.g. "40% 45%"). Default is the center. The gallery always shows the whole painting.

  Source files are full-size originals in images/art/originals/ (Padlet export, by board section).
  Titles come from the original file names where they named the piece. Where the file had no usable
  name (e.g. IMG_2803.jpg), the title is a short description of the painting — a working title for
  Susan to confirm or replace. Years come only from signatures visible on the work. Categories are working
  labels for her Padlet board sections. House portraits are numbered; the owners' names in the
  original file names are deliberately left off the site.
  Held back pending Susan's OK (people / personalised pieces): Section_3 wedding trees,
  Section_8 IMG_2815 and Muddy_Skylar.
  With no image (src: ""), a piece shows a generated color-field placeholder and uses "hue" for its colors.
*/
// Order of the Gallery filter buttons. Categories not listed here are added after these.
window.CATEGORIES = ["Landscapes", "Trucks", "Figures & Animals", "Still Life & Florals", "House Portraits", "Holiday", "Abstract"];

window.ARTWORKS = [
  { src: "images/art/sea-turtle.jpg", title: "Turtle", year: "2020", medium: "", size: "", category: "Figures & Animals", status: "", ratio: 1.348, featured: true, focus: "45% 45%" },
  { src: "images/art/adobe-bell-tower.jpg", title: "Adobe Bell Tower", year: "", medium: "", size: "", category: "Landscapes", status: "", ratio: 1.276, featured: true, focus: "50% 45%" },
  { src: "images/art/truck-in-las-cruces.jpg", title: "Truck in Las Cruces", year: "", medium: "", size: "", category: "Trucks", status: "", ratio: 1.671, featured: true, focus: "60% 50%" },
  { src: "images/art/winter-in-wyoming.jpg", title: "Winter in Wyoming", year: "", medium: "", size: "", category: "Holiday", status: "", ratio: 1.258, featured: true, focus: "50% 50%" },
  { src: "images/art/lake-and-mountains.jpg", title: "Mountain Lake", year: "2019", medium: "", size: "", category: "Landscapes", status: "", ratio: 1.55, featured: true, focus: "50% 50%" },
  { src: "images/art/santa-barbara.jpg", title: "Santa Barbara", year: "", medium: "", size: "", category: "Landscapes", status: "", ratio: 0.996, featured: true, focus: "50% 62%" },
  { src: "images/art/socialism-in-the-chinese-landscape.jpg", title: "Socialism in the Chinese Landscape", year: "", medium: "", size: "", category: "Figures & Animals", status: "", ratio: 1.337, featured: false, focus: "50% 40%" },
  { src: "images/art/home-with-the-armadillo.jpg", title: "Home with the Armadillo", year: "", medium: "", size: "", category: "Trucks", status: "", ratio: 2.006, featured: false, focus: "50% 50%" },
  { src: "images/art/green-truck.jpg", title: "Old Green Truck", year: "", medium: "", size: "", category: "Trucks", status: "", ratio: 1.595, featured: false, focus: "50% 50%" },
  { src: "images/art/black-truck.jpg", title: "Black Pickup Under a Rainbow", year: "", medium: "", size: "", category: "Trucks", status: "", ratio: 1.534, featured: false, focus: "50% 50%" },
  { src: "images/art/santa-claus-is-coming-to-town.jpg", title: "Santa Claus Is Coming to Town", year: "", medium: "", size: "", category: "Holiday", status: "", ratio: 0.759, featured: false, focus: "50% 50%" },
  { src: "images/art/koala-santa-hat.jpg", title: "Koala", year: "", medium: "", size: "", category: "Holiday", status: "", ratio: 0.722, featured: false, focus: "50% 50%" },
  { src: "images/art/deer-with-ornament.jpg", title: "Buck with Ornament", year: "", medium: "", size: "", category: "Holiday", status: "", ratio: 0.75, featured: false, focus: "50% 50%" },
  { src: "images/art/ornament.jpg", title: "Hanging the Ornament", year: "", medium: "", size: "", category: "Holiday", status: "", ratio: 0.664, featured: false, focus: "50% 50%" },
  { src: "images/art/koala.jpg", title: "Koala in the Eucalyptus", year: "", medium: "", size: "", category: "Figures & Animals", status: "", ratio: 0.65, featured: false, focus: "50% 50%" },
  { src: "images/art/cat.jpg", title: "Tabby Cat", year: "", medium: "", size: "", category: "Figures & Animals", status: "", ratio: 0.75, featured: false, focus: "50% 50%" },
  { src: "images/art/mountain-water.jpg", title: "Purple Mountains Over Water", year: "2019", medium: "", size: "", category: "Landscapes", status: "", ratio: 1.508, featured: false, focus: "50% 45%" },
  { src: "images/art/fields-and-palms.jpg", title: "Palms Over the Fields", year: "", medium: "", size: "", category: "Landscapes", status: "", ratio: 1.447, featured: false, focus: "50% 40%" },
  { src: "images/art/tree-and-farmhouse.jpg", title: "Farmhouse and Lone Tree", year: "", medium: "", size: "", category: "Landscapes", status: "", ratio: 1.292, featured: false, focus: "50% 50%" },
  { src: "images/art/overgrown-car.jpg", title: "Overgrown", year: "", medium: "", size: "", category: "Landscapes", status: "", ratio: 1.564, featured: false, focus: "50% 50%" },
  { src: "images/art/adobe-window.jpg", title: "Adobe Window with Blue Pot", year: "", medium: "", size: "", category: "Landscapes", status: "", ratio: 0.742, featured: false, focus: "50% 50%" },
  { src: "images/art/sailboats.jpg", title: "Sailboats at Anchor", year: "", medium: "", size: "", category: "Landscapes", status: "", ratio: 0.646, featured: false, focus: "50% 50%" },
  { src: "images/art/flowers.jpg", title: "Flowers", year: "", medium: "", size: "", category: "Still Life & Florals", status: "", ratio: 0.792, featured: false, focus: "50% 50%" },
  { src: "images/art/squash.jpg", title: "Squash", year: "", medium: "", size: "", category: "Still Life & Florals", status: "", ratio: 1.333, featured: false, focus: "50% 50%" },
  { src: "images/art/cosmos.jpg", title: "Cosmos", year: "", medium: "", size: "", category: "Still Life & Florals", status: "", ratio: 0.75, featured: false, focus: "50% 50%" },
  { src: "images/art/apple.jpg", title: "Cut Apple", year: "", medium: "", size: "", category: "Still Life & Florals", status: "", ratio: 0.75, featured: false, focus: "50% 50%" },
  { src: "images/art/house-portrait-1.jpg", title: "House Portrait I", year: "", medium: "", size: "", category: "House Portraits", status: "", ratio: 1.266, featured: false, focus: "50% 50%" },
  { src: "images/art/house-portrait-2.jpg", title: "House Portrait II", year: "", medium: "", size: "", category: "House Portraits", status: "", ratio: 1.353, featured: false, focus: "50% 50%" },
  { src: "images/art/house-portrait-3.jpg", title: "House Portrait III", year: "", medium: "", size: "", category: "House Portraits", status: "", ratio: 1.401, featured: false, focus: "50% 50%" },
  { src: "images/art/house-portrait-4.jpg", title: "House Portrait IV", year: "2022", medium: "", size: "", category: "House Portraits", status: "", ratio: 1.333, featured: false, focus: "50% 50%" },
  { src: "images/art/house-portrait-5.jpg", title: "House Portrait V", year: "2024", medium: "", size: "", category: "House Portraits", status: "", ratio: 1.286, featured: false, focus: "50% 50%" },
  { src: "images/art/golden-portal.jpg", title: "Golden Portal", year: "", medium: "", size: "", category: "Abstract", status: "", ratio: 0.42, featured: false, focus: "50% 50%" }
];
