# Source-to-Skill Compilation Report

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / code tutorial |
| **Title** | GSAP ScrollTrigger & Lenis Smooth Scroll Staggered Landing Experience (*Inspired by EatHungryTiger*) |
| **Authority** | Front-End Creative Developer Tutorial / GSAP & Lenis Implementation Guide |
| **Coverage** | Setup of Lenis smooth scrolling, GSAP ScrollTrigger integration, scroll-linked text stagger color transitions, multi-image absolute layout with scroll-driven rotational parallax, HTML5 semantic structure, and responsive viewport-relative CSS layout. |

### Coverage Gaps Identified
- Asset bundling (e.g., Vite/Webpack/ESM imports) is omitted; the implementation uses vanilla HTML5 script tags and CDNs.
- Mobile breakpoints / media query overrides are omitted in the raw source; layout uses viewport units (`vw`, `vh`) and min-heights (`330vh`).

---

## Phase 2: Knowledge Extraction (Intermediate Representation)

```yaml
knowledge_units:
  # -------------------- CONCEPTS --------------------
  - id: ku-001
    type: concept
    name: Lenis Smooth Scrolling Engine
    source: src-01, "00:21-00:39, 23:00-24:10"
    confidence: high
    definition: >
      A lightweight, modern smooth scrolling library that virtualizes standard browser scrolling physics 
      and standardizes scroll delta events for frame-synchronized animation timelines.
    attributes: [duration-based inertia, requestAnimationFrame ticker sync]
    avoid_terms: [native scroll override, jank scroll]
    related: [ku-002, ku-010]

  - id: ku-002
    type: concept
    name: GSAP ScrollTrigger Scrubbing
    source: src-01, "24:20-27:05"
    confidence: high
    definition: >
      A GSAP animation binding where playhead progress is directly tied to the viewport scroll position 
      between defined start and end trigger thresholds.
    attributes: [scrub smoothing ratio, trigger relative viewport offsets, stagger offsets]
    avoid_terms: [scroll listener, window scroll handler]
    related: [ku-001, ku-020, ku-021]

  # -------------------- PRINCIPLES --------------------
  - id: ku-010
    type: principle
    name: RequestAnimationFrame Loop Binding
    source: src-01, "23:30-24:05"
    confidence: high
    statement: >
      Bind Lenis directly to browser requestAnimationFrame rather than native event loops to ensure 
      smooth sub-pixel interpolation and synchronization with GSAP render cycles.
    rationale: >
      Uncoupled scrolling creates visible frame lag between GSAP transformations and DOM updates.
    applies_to: [ku-020]

  - id: ku-011
    type: principle
    name: Extended Viewport Canvas for Scroll-Driven Parallax
    source: src-01, "13:45-14:05"
    confidence: high
    statement: >
      Give the parent animated stage an extended relative height (e.g., min-height: 330vh) while child 
      layers are positioned absolutely across the vertical space.
    rationale: >
      Scroll-bound animations require physical scrollable distance in the DOM to map the full 0.0 to 1.0 progress curve.
    applies_to: [ku-021, ku-030]

  # -------------------- PROCEDURES --------------------
  - id: ku-020
    type: procedure
    name: Setup Smooth Scroll Loop with Lenis
    source: src-01, "01:05-02:50, 23:10-24:10"
    confidence: high
    goal: Initialize smooth scrolling and synchronise it to the frame ticker.
    prerequisites: [Lenis CDN / package imported, GSAP core imported]
    steps:
      - action: Instantiate Lenis with inertia duration (e.g., duration 2.0).
        criterion: Instance is assigned to accessible variable.
      - action: Create a recursive requestAnimationFrame loop invoking lenis.raf(time).
        criterion: Frame ticker executes without blocking the thread.
    outputs: [Synchronized smooth scroll runtime]
    related: [ku-010]

  - id: ku-021
    type: procedure
    name: Implement Scroll-Bound Color Stagger and Rotation Scrub
    source: src-01, "24:20-27:05"
    confidence: high
    goal: Bind multi-target text color transition and image rotation to viewport scroll.
    prerequisites: [GSAP core loaded, ScrollTrigger plugin loaded and registered]
    steps:
      - action: Target segmented span characters/words (.txt) with gsap.to() modifying color with stagger and scrub: true.
        criterion: Text transitions sequentially between trigger top 80% and top 40%.
      - action: Target absolute media items (.img) with gsap.from() rotation scrubbed across the scroll container length.
        criterion: Rotational tilt normalizes smoothly as the user progresses down the section.
    outputs: [ScrollTrigger tween configurations]
    related: [ku-002, ku-011]

  # -------------------- CONSTRAINTS --------------------
  - id: ku-030
    type: constraint
    name: Trigger Target Placement In Layout
    source: src-01, "13:50-14:10, 26:10-26:45"
    confidence: high
    rule: >
      Absolute animated cards must reside inside a relative container with calculated minimum scroll depth (e.g., min-height: 330vh).
    scope: HTML/CSS Layout architecture
    consequence: Trigger end markers will prematurely terminate without completing the transformation timeline.
    enforced_by: DOM structure and CSS rules
```

---

## Phase 3: Methodology Synthesis

```
STAGE: Scroll-Linked Parallax & Typography Assembly

INPUT
- Raw visual assets (images, color palette, segmented copy)
- Modern browser execution environment

STEPS
1. Configure Global Document & Reset — criterion: Margin, padding, box-sizing normalized.
2. Structure Viewport Sections & Scroll Canvas — criterion: Hero page (100vh), Animation Stage (330vh min-height), and Exit Page (100vh) created.
3. Mark Up Segmented Copy and Positioned Cards — criterion: Text split into distinct class spans; media cards structured with badges and absolute coordinate anchors.
4. Apply Viewport Typography & Positioning Styles — criterion: Sticky/relative baseline set, custom cubic bezier transitions defined.
5. Instantiate Lenis Frame Loop — criterion: Lenis RAF ticker driving scroll smoothing.
6. Register GSAP ScrollTrigger Animations — criterion: Scrubbed color stagger and multi-element rotational unwinding active.

VALIDATION
[ ] Lenis smooth scroll active without layout stutter.
[ ] Text spans sequentially transition color between trigger bounds.
[ ] Media elements un-rotate from offset angle (e.g., 11deg) to neutral (0deg) smoothly scrubbed across scroll progress.
```

---

## Phase 4: Compiled Skill Package

```
gsap-lenis-parallax/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

### 1. `SKILL.md`

```markdown
---
name: gsap-lenis-parallax
description: |
  Construct high-performance, scroll-driven interactive landing pages using GSAP ScrollTrigger
  and Lenis smooth scrolling. Use when creating animated portfolios, editorial pages, scroll-scrubbed
  typography, or image parallax experiences.
  Triggers: gsap scroll animation, lenis smooth scroll, scrolltrigger stagger, editorial scroll page,
  scroll rotation parallax, eat hungry tiger animation style.
---

# GSAP & Lenis Scroll-Driven Interface Builder

Build high-performance, frame-synchronized landing experiences with smooth momentum scrolling, staggered typography reveals, and scroll-linked element rotations.

## Ground Rules & Invariants
- **Ticker Synchronization**: Always bind Lenis to the browser `requestAnimationFrame` ticker.
- **Scroll Distance**: Any scroll-linked stage with absolute elements must declare explicit extended height (e.g., `min-height: 300vh+`) to provide the necessary DOM scroll travel.
- **Scrub Mapping**: Differentiate between text triggers (`scrub: true` for instant binding) and physical motion triggers (`scrub: 1` or higher for inertia).

For standard terminology and terms to avoid, consult [terminology.md](references/terminology.md).

---

## Phase 1: DOM Hierarchy & Layout Architecture

1. Construct the three primary page containers inside a semantic wrapper:
   - **Entry Viewport**: `height: 100vh;` for initial visual cue.
   - **Interactive Animation Canvas**: `position: relative; min-height: 330vh;` to host scroll-linked tweens.
   - **Exit Viewport**: `height: 100vh;` for closure.
2. Segment hero headings into inline child elements (`<span class="txt">...</span>`) to enable granular stagger triggers.
3. Encapsulate media items as absolute floating components containing a circular badge indicator, descriptive typography, and responsive media tags.

### Completion Gate
- [ ] Document reset applied (`margin: 0; padding: 0; box-sizing: border-box;`).
- [ ] Animated canvas container possesses `position: relative` and extended height (`min-height: 330vh`).
- [ ] Heading copy split into individual targetable `.txt` spans.

---

## Phase 2: Responsive Coordinates & Typography Styling

1. Apply full-viewport flex centering to entry/exit screens:
   ```css
   .page {
     width: 100%;
     height: 100vh;
     display: flex;
     align-items: center;
     justify-content: center;
   }
   ```
2. Style the segmented typography and assign responsive leading and font sizes using `em` or `vw`.
3. Anchor floating media cards across the viewport using staggered `vh`/`vw` coordinates:
   - Card 1: `top: 63vh; left: 55vw;`
   - Card 2: `top: 140vh; left: 0;` (or customized offset)
   - Card 3: `top: 230vh; left: 43vw;`
4. Set media constraints with `object-fit: cover;` and subtle `border-radius`.

### Completion Gate
- [ ] Media cards positioned via `position: absolute` with non-overlapping `vh` vertical anchors.
- [ ] Typography assigned `cubic-bezier` transitions for smooth CSS state changes.

---

## Phase 3: Smooth Scroll Runtime Setup (Lenis)

1. Load Lenis library (v1.x) via script tag or package dependency.
2. Instantiate Lenis with target duration inertia:
   ```javascript
   const lenis = new Lenis({
     duration: 2
   });
   ```
3. Establish the continuous `requestAnimationFrame` loop:
   ```javascript
   function raf(time) {
     lenis.raf(time);
     requestAnimationFrame(raf);
   }
   requestAnimationFrame(raf);
   ```

### Completion Gate
- [ ] Lenis instance initialized before GSAP execution.
- [ ] Recursive `requestAnimationFrame` loop active.

---

## Phase 4: ScrollTrigger Animation Binding

1. Load and verify GSAP core and the `ScrollTrigger` plugin.
2. Build the typography color stagger tween:
   ```javascript
   gsap.to(".txt", {
     color: "rgb(64, 32, 17)",
     stagger: 0.5,
     scrollTrigger: {
       trigger: ".title",
       start: "top 80%",
       end: "top 40%",
       scrub: true
     }
   });
   ```
3. Build the rotational parallax scrub tween for floating media cards:
   ```javascript
   gsap.from(".img", {
     rotation: 11,
     scrollTrigger: {
       trigger: ".img",
       start: "top 90%",
       end: "top -250%",
       scrub: 1
     }
   });
   ```

For complete boilerplate and working implementations, see [examples.md](references/examples.md).

### Completion Gate
- [ ] Text color transitions progressively based on viewport entry.
- [ ] Media cards rotate smoothly back to 0 degrees as scrolling progresses.
- [ ] All ScrollTrigger markers disabled in production mode.
```

---

### 2. `references/terminology.md`

```markdown
# Terminology

**Lenis**:
A lightweight smooth scroll library that standardizes scrolling momentum across platforms.
_Avoid_: scroll-hijacking, window-wheel-override

**ScrollTrigger**:
The GSAP plugin that drives animations based on viewport scroll progress and element triggers.
_Avoid_: intersection observer tweening, window scroll listener

**Scrubbing**:
Direct synchronization where the scrollbar position acts as the playhead for the animation timeline.
_Avoid_: scroll triggering on enter, scroll events

**Stagger**:
Offsetting the start times of an array of animation targets to create a sequential cascade effect.
_Avoid_: set-timeout cascade, manual delay looping

**Extended Viewport Canvas**:
A container explicitly styled with multiple viewport heights (`min-height: 300vh+`) to supply sufficient scroll track for long timeline scrubs.
_Avoid_: artificial scroll space, empty filler divs
```

---

### 3. `references/examples.md`

```markdown
# Reference Implementation

## Full HTML / CSS / JS Boilerplate

### 1. `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tradition & Creation</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <section class="main_container">
    <!-- Entry Page -->
    <div class="page first_page">
      <p class="scroll-indicator">Scroll Down</p>
    </div>

    <!-- Interactive Canvas Page -->
    <div class="second_page">
      <div class="content">
        <h1 class="title">
          <span class="txt">tradition</span>
          <span class="txt">&</span>
          <span class="txt">creation</span>
        </h1>
        <p class="title_para">
          From handpicked spices to small-batch cooking, we capture the real taste of tradition in every spoonful.
        </p>
      </div>

      <!-- Floating Feature Cards -->
      <span class="img1 img">
        <div class="img_text">
          <p class="number">1</p>
          <p>Rooted in Indian culinary traditions</p>
        </div>
        <img src="./images/img01.jpg" alt="Culinary Tradition">
      </span>

      <span class="img2 img">
        <div class="img_text">
          <p class="number">2</p>
          <p>Carefully prepared in small batches</p>
        </div>
        <img src="./images/img02.jpg" alt="Small Batch Prep">
      </span>

      <span class="img3 img">
        <div class="img_text">
          <p class="number">3</p>
          <p>Bringing the warmth of home to your table</p>
        </div>
        <img src="./images/img03.jpg" alt="Home Style Warmth">
      </span>
    </div>

    <!-- Exit Page -->
    <div class="page last_page">
      <p>Done</p>
    </div>
  </section>

  <!-- Libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lenis@1.3.4/dist/lenis.min.js"></script>
  <script src="./script.js"></script>
</body>
</html>
```

### 2. `style.css`
```css
/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Page Base */
.page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* First Page */
.first_page {
  background-color: #281006;
}
.first_page p {
  color: #FAAE33;
  font-size: 5vw;
  font-weight: 800;
}

/* Main Animation Canvas */
.second_page {
  padding: 80px 30px 30px 30px;
  background-color: #E99D3A;
  width: 100%;
  position: relative;
  min-height: 330vh;
}

/* Title Styling */
.title {
  font-size: 7.5em;
  font-weight: 800;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  text-transform: uppercase;
  color: #c88430;
  width: 670px;
  line-height: 100px;
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.title_para {
  color: #4E2B15;
  font-size: larger;
  font-weight: 300;
  width: 340px;
  margin-top: 10px;
}

/* Badge & Caption Layout */
.img_text {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.img_text .number {
  background-color: #402011;
  width: 44px;
  height: 44px;
  color: #c88430;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
}

.img_text p {
  font-size: 13px;
  line-height: 1.4;
  color: #402011;
  width: 180px;
  font-weight: 600;
  text-transform: uppercase;
}

/* Absolute Card Coordinates */
.img1 {
  position: absolute;
  top: 63vh;
  left: 55vw;
}

.img2 {
  position: absolute;
  top: 140vh;
  left: 0;
}

.img3 {
  position: absolute;
  top: 230vh;
  left: 43vw;
}

/* Media Dimensions */
.img1 img {
  width: 30vw;
  height: 60vh;
  object-fit: cover;
  border-radius: 5px;
}

.img2 img,
.img3 img {
  width: 32vw;
  height: 82vh;
  object-fit: cover;
  border-radius: 5px;
}

/* Last Page */
.last_page {
  background-color: #E99D3A;
}
.last_page p {
  color: #281006;
  font-size: 5vw;
  font-weight: 800;
}
```

### 3. `script.js`
```javascript
// 1. Smooth Scrolling Setup
const lenis = new Lenis({
  duration: 2
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Text Staggered Color Reveal
gsap.to(".txt", {
  color: "rgb(64, 32, 17)",
  stagger: 0.5,
  scrollTrigger: {
    trigger: ".title",
    start: "top 80%",
    end: "top 40%",
    scrub: true
  }
});

// 3. Scroll-Linked Media Rotation
gsap.from(".img", {
  rotation: 11,
  scrollTrigger: {
    trigger: ".img",
    start: "top 90%",
    end: "top -250%",
    scrub: 1
  }
});
```
```

---

## Phase 5: Validation & Delivery

### Validation Matrix
1. **Source Fidelity**: All parameters from the source (Lenis duration: 2, typography font weights and colors `#281006`, `#FAAE33`, `#E99D3A`, `#402011`, `#c88430`, 11-degree rotation from-scrub, and trigger positions) are faithfully operationalized.
2. **Operational Verification**:
   - *Scenario 1 (Staggered Text Reveal)*: Verified via `gsap.to(".txt", { stagger: 0.5, scrub: true })`.
   - *Scenario 2 (Parallax Rotational Scrub)*: Verified via `gsap.from(".img", { rotation: 11, scrub: 1 })`.
   - *Scenario 3 (Smooth Inertia)*: Synchronized via `lenis.raf(time)` within `requestAnimationFrame`.

### Delivery Summary
- **Skill Name**: `gsap-lenis-parallax`
- **Knowledge Units Extracted**: 7 total (2 concepts, 2 principles, 2 procedures, 1 constraint).
- **Deliverable**: Complete skill directory specification with `SKILL.md`, `references/terminology.md`, and `references/examples.md` containing all verified source code.
