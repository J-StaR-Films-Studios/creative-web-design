# Source-to-Skill Compilation Report

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-tutorial / screencast |
| **Title** | Fanta Scroll Animation Landing Page with GSAP & ScrollTrigger |
| **Authority** | Gravity Coding (Frontend & Creative Web Developer / Instructor) |
| **Coverage** | Multi-section scroll-driven product landing page using HTML5, CSS3, Vanilla JS, GSAP 3 Timelines, GSAP ScrollTrigger plugin, SVG shape generation (Blobmaker), web icon integration (Remix Icon), and custom typography. |

### Coverage Gaps Identified
- Mobile responsiveness / responsive media queries across tablet and phone breakpoints (tutorial focuses on desktop layout using viewport units `vw`/`vh`).
- Touch-gesture optimization for touch-based mobile browsers.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# KNOWLEDGE SPECIFICATION: Scroll-Driven Creative Web Animation
# ==============================================================================

# --- CONCEPTS ---

- id: ku-001
  type: concept
  name: Scroll-Linked Timeline
  source: src-01, "54:00 - 57:30"
  confidence: high
  definition: >
    A GSAP animation timeline whose playhead progress is directly bound to the page
    scroll position through the ScrollTrigger plugin's scrub property.
  attributes: [gsap.timeline, scrollTrigger, scrub, markers]
  avoid_terms: [scroll listener, window onscroll animation]
  related: [ku-002, ku-011]

- id: ku-002
  type: concept
  name: Scrubbing
  source: src-01, "43:35, 57:48"
  confidence: high
  definition: >
    The mechanism linking animation progress directly to the scrollbar scroll position,
    enabling bidirectional (forward and reverse) playback as the user scrolls.
  attributes: [scrub: true, bidirectional playback, smooth deceleration]
  avoid_terms: [scroll event throttling]
  related: [ku-001, ku-012]

- id: ku-003
  type: concept
  name: ScrollTrigger Trigger & Thresholds
  source: src-01, "55:50 - 57:20"
  confidence: high
  definition: >
    The element boundaries (`trigger`) and percentage coordinates (`start`, `end`)
    determining when a scroll-driven timeline begins and concludes execution.
  attributes: [trigger element, element coordinate %, viewport coordinate %]
  avoid_terms: [scroll offset, pixel watcher]
  related: [ku-001, ku-023]

- id: ku-004
  type: concept
  name: Timeline Alignment Label (Position Parameter)
  source: src-01, "60:40 - 61:30"
  confidence: high
  definition: >
    A named string identifier passed to GSAP timeline tween calls that forces multiple
    independent tweens to execute concurrently at the same timestamp.
  attributes: [synchronous tweens, position label, named timeline anchor]
  avoid_terms: [animation grouping tag]
  related: [ku-023, ku-024]

# --- PRINCIPLES ---

- id: ku-010
  type: principle
  name: Full-Viewport Section Partitioning
  source: src-01, "18:30, 27:00, 39:40"
  confidence: high
  statement: >
    Structure multi-stage scroll animations into distinct full-viewport sections (100vw x 100vh)
    with fixed or absolute layers so coordinates remain deterministic across scroll passes.
  rationale: >
    Variable height containers create non-linear scroll distances that cause multi-element
    spatial transforms to misalign or clip.
  applies_to: [ku-020, ku-021]

- id: ku-011
  type: principle
  name: Single Moving Anchor Strategy
  source: src-01, "20:45, 50:00, 60:00"
  confidence: high
  statement: >
    Keep hero elements (e.g., product can, main asset) in the top-level or primary section
    in absolute/fixed positioning, and animate their absolute coordinates down across subsequent
    sections rather than duplicating elements per section.
  rationale: >
    Re-rendering or swapping elements across DOM nodes breaks visual continuity and leads to jump cuts.
  applies_to: [ku-021, ku-023, ku-024]

- id: ku-012
  type: principle
  name: Bezier Smoothing Integration
  source: src-01, "54:50 - 55:55, 60:00"
  confidence: high
  statement: >
    Pair GSAP scroll scrubbing with cubic-bezier transition curves on animated CSS targets
    to eliminate frame judder and impart physical weight to assets.
  rationale: >
    Raw scroll scrubbing can feel mechanical; micro-transitions damp rapid wheel inputs.
  applies_to: [ku-023, ku-024]

# --- PROCEDURES ---

- id: ku-020
  type: procedure
  name: Asset Extraction and Layout Setup
  source: src-01, "03:00 - 10:55"
  confidence: high
  goal: Prepare clean transparent assets and project structure for layered web animation.
  prerequisites: [Project folder created, code editor ready]
  steps:
    - action: Create directory tree (`Assets/`, `Fonts/`, `index.html`, `style.css`, `script.js`).
      criterion: 3 code files and 2 asset folders exist.
    - action: Extract high-resolution transparent PNG/WebP assets for hero products and decorative props.
      criterion: Backgrounds are completely transparent with no matte artifacts.
    - action: Configure CSS reset and typography (`Product Sans` @font-face, `margin: 0`, `box-sizing: border-box`).
      criterion: Canvas has zero default margins and consistent box-sizing.
  outputs: [Structured project folder with assets and CSS baseline]
  related: [ku-010]

- id: ku-021
  type: procedure
  name: Multi-Section DOM Layering
  source: src-01, "11:00 - 45:00"
  confidence: high
  goal: Construct 3 full-height stacked visual sections with explicit z-indexing.
  prerequisites: [ku-020]
  steps:
    - action: Build fixed navigation header with high z-index (`z-index: 99`).
      criterion: Navigation stays visible over all scrolling sections.
    - action: Construct Section 1 (`.one`) with linear gradient, giant background title, centered hero product (`#fanta`), and props (`#orange-cut`, `#orange`, `#leaf`, `#leaf2`).
      criterion: Section 1 occupies 100vw/100vh with absolutely positioned layered assets.
    - action: Construct Section 2 (`.two`) with split flexbox layout, organic SVG blob shape on left, and copy on right.
      criterion: Section 2 provides destination drop zone for hero product can.
    - action: Construct Section 3 (`.three`) containing 3 product showcase cards with background decorative slices and call-to-action buttons.
      criterion: 3 balanced cards aligned horizontally with target positions for Fanta, Coke, and Pepsi cans.
  outputs: [Complete 3-section static DOM layout ready for animation]
  related: [ku-010, ku-011]

- id: ku-022
  type: procedure
  name: Animation Library Integration
  source: src-01, "52:50 - 53:40"
  confidence: high
  goal: Load GSAP core and ScrollTrigger plugin via CDN.
  prerequisites: [HTML document structure complete]
  steps:
    - action: Insert GSAP 3.x core script tag before `script.js`.
      criterion: `window.gsap` is available in global scope.
    - action: Insert ScrollTrigger plugin script tag before `script.js`.
      criterion: `window.ScrollTrigger` is registered and available.
  outputs: [GSAP-enabled HTML runtime]
  related: [ku-001]

- id: ku-023
  type: procedure
  name: Section 1 to Section 2 Timeline Animation
  source: src-01, "54:00 - 63:35"
  confidence: high
  goal: Animate Section 1 elements into Section 2 upon scroll.
  prerequisites: [ku-021, ku-022]
  steps:
    - action: Initialize timeline `tl` triggered by `.two` with `scrub: true`, `start: "0% 95%"`, `end: "70% 50%"`.
      criterion: Timeline progress tracks scroll distance between triggers.
    - action: Tween `#fanta` top coordinate to `120%` and left coordinate to `0%` using position label `'orange'`.
      criterion: Can drops smoothly from Section 1 center to Section 2 left blob.
    - action: Tween `#orange-cut` to `160%` top and `23%` left using position label `'orange'`.
      criterion: Cut orange slice follows can to Section 2.
    - action: Tween `#orange` group to `160%` top and `10%` right with size reduction (`width: 15%`).
      criterion: Whole oranges shift to Section 2 right copy block.
    - action: Tween `#leaf` and `#leaf2` with rotational shifts (`rotate: 130deg`) into flanking positions.
      criterion: Leaves drift naturally during scroll transition.
  outputs: [Synchronized Section 1-to-2 scroll transition]
  related: [ku-001, ku-002, ku-004, ku-012]

- id: ku-024
  type: procedure
  name: Section 2 to Section 3 Card Insertion Animation
  source: src-01, "64:00 - 78:50"
  confidence: high
  goal: Animate hero product into center card while bringing in side products and props.
  prerequisites: [ku-023]
  steps:
    - action: Initialize timeline `tl2` triggered by `.three` with `scrub: true`, `start: "0% 95%"`, `end: "20% 50%"`.
      criterion: Second timeline initiates as Section 3 enters viewport.
    - action: Tween `#fanta` top to `210%`, left to `33%`, and width to `35%` using label `'ca'`.
      criterion: Fanta can docks directly onto middle card (`Fanta`).
    - action: Tween `#orange-cut` top to `204%`, left to `42%`, and width to `18%` behind Fanta can.
      criterion: Orange slice frames the center card can.
    - action: Animate left card elements (`.lemon1`, `#cocacola`) from outside left (`left: -100%`, `rotate: -90deg`) into position using `tl2.from()`.
      criterion: Coke can and lemon slice enter dynamically from offscreen left.
    - action: Animate right card elements (`.lemon2`, `#pepsi`) from outside right (`left: 100%`, `rotate: 90deg`) into position using `tl2.from()`.
      criterion: Pepsi can and lemon slice enter dynamically from offscreen right.
  outputs: [Complete multi-product 3D-feel card transition]
  related: [ku-001, ku-004, ku-011]

# --- CONSTRAINTS ---

- id: ku-030
  type: constraint
  name: Global Coordinate Stability
  source: src-01, "22:35, 40:05, 59:00"
  confidence: high
  rule: >
    All traveling animation elements must use absolute positioning relative to `#main`
    container, with percentage-based `top` offsets exceeding 100% (e.g., 120%, 210%) to traverse sections.
  scope: CSS and GSAP tween definition
  consequence: Elements placed inside sub-containers get clipped when containers have `overflow: hidden`.
  enforced_by: DOM structure and positioning rules in Phase 2 & 3

- id: ku-031
  type: constraint
  name: Scrollbar Removal for Clean Canvas
  source: src-01, "91:15 - 92:45"
  confidence: high
  rule: >
    Disable visible WebKit scrollbars (`body::-webkit-scrollbar { display: none; }`)
    while maintaining document scrollability to prevent visual width shifts during animation.
  scope: Global stylesheet
  consequence: Native scrollbars obstruct full-bleed decorative props and trigger horizontal jitter.
  enforced_by: Global CSS reset
```

---

## Phase 3: Methodology Synthesis

### Dependency Graph of Operational Stages

```
Stage 1: Environment & Asset Pipeline (ku-020, ku-031)
   ↓
Stage 2: Layered DOM & Viewport Architecture (ku-010, ku-021, ku-030)
   ↓
Stage 3: Typography & Visual Styling (ku-020, ku-021)
   ↓
Stage 4: GSAP Core & ScrollTrigger Binding (ku-001, ku-002, ku-003, ku-022)
   ↓
Stage 5: Phase 1 Transition Orchestration (ku-004, ku-011, ku-012, ku-023)
   ↓
Stage 6: Phase 2 Card Showcase Orchestration (ku-004, ku-011, ku-024)
   ↓
Stage 7: Polish & Kinetic Damping (ku-012, ku-031)
```

---

## Phase 4: Skill Compilation

Below is the compiled skill directory ready for installation.

---

### File Structure

```
scroll-driven-landing-page/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── examples.md
    └── gsap-scrolltrigger-patterns.md
```

---

### `scroll-driven-landing-page/SKILL.md`

```markdown
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
