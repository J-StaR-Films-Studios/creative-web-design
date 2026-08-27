---
name: scroll-driven-landing-page
description: |
  Build interactive, multi-section scroll-driven landing pages with GSAP Timelines
  and ScrollTrigger. Use when creating product showcase websites, animated landing pages,
  parallax scrolling effects, or compiling scroll-linked visual storytelling in HTML/CSS/JS.
  Triggers: build scroll animation, create GSAP scroll page, animated landing page,
  product scroll website, ScrollTrigger timeline, fanta scroll animation.
---

# Scroll-Driven Landing Page Engineering

Construct high-performance, multi-section scroll-animated web experiences using HTML5, CSS3, Vanilla JavaScript, GSAP Timelines, and GSAP ScrollTrigger.

## Core Architecture

Follow the progressive 7-phase implementation pipeline:

```
Setup → Viewport Architecture → Layer Styling → GSAP Initialization → Section-1-to-2 Tweening → Section-2-to-3 Card Docking → Polish
```

For canonical vocabulary, see [terminology.md](references/terminology.md).
For syntax blueprints, see [gsap-scrolltrigger-patterns.md](references/gsap-scrolltrigger-patterns.md).

---

## Phase 1: Project Setup & Asset Pipeline

1. Initialize workspace directory layout:
   ```
   project/
   ├── Assets/          # Transparent PNG/WebP product & prop images
   ├── Fonts/           # Custom web fonts (.ttf / .woff2)
   ├── index.html
   ├── style.css
   └── script.js
   ```
2. Place cutout assets in `Assets/`:
   - Hero product can (e.g., `fanta.png`)
   - Complementary product cans (e.g., `cocacola.png`, `pepsi.png`)
   - Slice props (e.g., `orange-cut.png`, `lemon.png`)
   - Group props (e.g., `orange.webp`)
   - Environmental foliage (e.g., `leaf.webp`, `leaf2.png`, `coconutleaf.png`)
3. Load libraries via CDN in `index.html`:
   - Remix Icon stylesheet (`remixicon.css`) in `<head>`
   - GSAP core (`gsap.min.js`) before closing `</body>`
   - GSAP ScrollTrigger plugin (`ScrollTrigger.min.js`) after GSAP core
   - Main script (`script.js`) after plugins

### Completion Gate
- [ ] Directory tree initialized
- [ ] Transparent cutout assets present in `Assets/`
- [ ] GSAP and ScrollTrigger CDN script tags loaded in correct execution order

---

## Phase 2: Viewport Architecture & DOM Layering

Structure the document as a master `#main` wrapper containing three vertically stacked, full-viewport sections (each `100vw` × `100vh`).

```html
<div id="main">
  <nav><!-- Fixed Navigation --></nav>

  <!-- Section 1: Hero Stage -->
  <div class="one">
    <h1>FANTA</h1>
    <img id="orange-cut" src="Assets/orange2.png" alt="Orange Slice">
    <img id="fanta" src="Assets/fanta.png" alt="Fanta Can">
    <img id="orange" src="Assets/orange.webp" alt="Oranges">
    <img id="leaf" src="Assets/leaf.webp" alt="Leaf">
    <img id="leaf2" src="Assets/leaf2.png" alt="Leaf 2">
    <img id="leaf3" src="Assets/coconoutleaf.png" alt="Foliage">
  </div>

  <!-- Section 2: Product Narrative -->
  <div class="two">
    <div class="lft-two">
      <!-- SVG Blob Graphic -->
    </div>
    <div class="rght-two">
      <h1>Flavour Updated</h1>
      <p>Lorem ipsum dolor sit amet...</p>
    </div>
  </div>

  <!-- Section 3: Product Showcase -->
  <div class="three">
    <div class="card">
      <img class="lemon lemon1" src="Assets/lemon.webp" alt="Lemon">
      <img id="cocacola" src="Assets/cocacola.png" alt="Coca Cola">
      <h1>CocaCola</h1>
      <button>Buy Now</button>
    </div>
    <div class="card">
      <h1>Fanta</h1>
      <button>Buy Now</button>
    </div>
    <div class="card">
      <img class="lemon lemon2" src="Assets/lemon.webp" alt="Lemon">
      <img id="pepsi" src="Assets/pepsi.png" alt="Pepsi">
      <h1>Pepsi</h1>
      <button>Buy Now</button>
    </div>
  </div>
</div>
```

### Critical Rules
- **Traveling Anchors**: Elements that animate across sections (`#fanta`, `#orange-cut`, `#orange`, `#leaf`, `#leaf2`) must live inside `.one` as direct children, positioned with `position: absolute`.
- **Fixed Nav**: `<nav>` must use `position: fixed` with `z-index: 99`.

### Completion Gate
- [ ] 3 distinct sections defined with `100vh` minimum height each
- [ ] Traveling assets exist in Section 1 and are not duplicated in Sections 2 or 3
- [ ] Section 3 contains 3 `.card` containers with side cans and lemons present

---

## Phase 3: CSS Reset, Typography & Layout Styling

1. Apply baseline reset:
   ```css
   * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
     font-family: 'Product Sans', sans-serif;
   }
   html, body {
     width: 100%;
     height: 100%;
   }
   body::-webkit-scrollbar {
     display: none;
   }
   #main {
     width: 100%;
     background-color: orangered;
   }
   ```
2. Configure typography:
   - Import regular and bold font variants using `@font-face`.
   - Set Section 1 background title `h1` to `25vw` font-size, centered with `color: #fff`.
3. Style Section 1 (`.one`):
   - Gradient background: `linear-gradient(150deg, rgb(255, 166, 0), rgb(255, 94, 0))`.
   - Center hero elements with `display: flex; align-items: center; justify-content: center;`.
   - Set initial coordinates for traveling props using `top`, `left`, `right`, and `z-index`.
4. Style Section 2 (`.two`):
   - Background: dark contrasting tone (e.g., `#4d231c`).
   - `display: flex;` splitting `.lft-two` and `.rght-two` to `50%` width each.
   - Insert SVG blob inside `.lft-two` scaled to `70% - 80%` width.
5. Style Section 3 (`.three`):
   - Background: matching brand gradient or dark tone.
   - `display: flex; align-items: center; justify-content: center; gap: 5vw;`.
   - Style `.card`: `width: 25vw; height: 70vh; background: #fff; border-radius: 20px;`.
   - Card button: pill-shaped (`border-radius: 50px;`), brand background, clean padding.

### Completion Gate
- [ ] Viewport scrollbar hidden without breaking vertical scroll
- [ ] Hero Fanta can vertically and horizontally centered in Section 1
- [ ] Section 2 flex split renders SVG blob on left and copy on right
- [ ] Section 3 renders three white cards side-by-side with padding and rounded corners

---

## Phase 4: ScrollTrigger Timeline Initialization

In `script.js`, instantiate two sequential GSAP timelines bound to page scroll.

```javascript
// Timeline 1: Section 1 -> Section 2
var tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".two",
    start: "0% 95%",
    end: "70% 50%",
    scrub: true,
    markers: false
  }
});

// Timeline 2: Section 2 -> Section 3
var tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".three",
    start: "0% 95%",
    end: "70% 50%",
    scrub: true,
    markers: false
  }
});
```

For deep configuration of `start`, `end`, and `scrub` parameters, consult [gsap-scrolltrigger-patterns.md](references/gsap-scrolltrigger-patterns.md).
