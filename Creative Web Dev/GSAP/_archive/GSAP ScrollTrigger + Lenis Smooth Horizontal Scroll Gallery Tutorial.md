Here is the compiled operational agent skill extracted and synthesized from the video tutorial using the **Source-to-Skill** pipeline.

---

# Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / coding-tutorial |
| **Title** | *GSAP ScrollTrigger + Lenis Smooth Horizontal Scroll Gallery Tutorial* |
| **Authority** | Frontend Developer & Creative Web Specialist (Web Development / Creative Interaction) |
| **Coverage** | Lenis smooth scroll setup with GSAP Ticker sync, multi-layer horizontal scroll DOM architecture, pinned ScrollTrigger calculation via dynamic functional values (`scrollWidth`), scrubbed track translation, card reveal animations, and GSAP timeline hero choreography. |

### Coverage Gaps Identified
- Touch/mobile gestures & accessibility optimizations for horizontal scroll sections are not covered in the tutorial source.
- Framework-specific setups (React/Next.js/Vue) are not covered (source uses vanilla HTML/CSS/JS with CDNs).

---

# Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# -------------------------------------------------------------
# KNOWLEDGE SPECIFICATION: GSAP + Lenis Horizontal Smooth Scroll
# -------------------------------------------------------------

# CONCEPTS
- id: ku-001
  type: concept
  name: Lenis Smooth Scroll
  source: src-01, "00:00 - 01:10, 14:50 - 16:40"
  confidence: high
  definition: >
    A lightweight, robust, open-source smooth scrolling library designed to normalize wheel/trackpad inputs and provide fluid page gliding without hijacking native accessibility.
  avoid_terms: [scroll blocker, fake scroller]
  related: [ku-002, ku-003]

- id: ku-002
  type: concept
  name: GSAP ScrollTrigger
  source: src-01, "13:20 - 14:40"
  confidence: high
  definition: >
    A GSAP plugin that binds GSAP tweens and timelines directly to page scroll positions, viewports, and pinning states.
  related: [ku-003, ku-005]

- id: ku-003
  type: concept
  name: Ticker Synchronization
  source: src-01, "15:50 - 16:25"
  confidence: high
  definition: >
    The synchronization mechanism where Lenis's requestAnimationFrame (RAF) loop is driven by GSAP's internal ticker to prevent frame desynchronization and jitter between smooth scrolling and ScrollTrigger updates.
  attributes: [gsap.ticker.add, lagSmoothing(0), lenis.on('scroll', ScrollTrigger.update)]
  related: [ku-001, ku-002]

- id: ku-004
  type: concept
  name: Multi-Layer Horizontal DOM Hierarchy
  source: src-01, "07:00 - 08:25"
  confidence: high
  definition: >
    A 3-tier DOM architecture consisting of a Pin Section container, an Overflow Hidden Wrapper, and a Flex Track element that translates horizontally across the screen.
  attributes: [Pin Section (#horizontal-scroll), Overflow Wrapper (.horizontal-scroll-wrapper), Flex Track (.horizontal)]
  related: [ku-005, ku-021]

# PRINCIPLES
- id: ku-010
  type: principle
  name: Functional Value Evaluation for Dynamic Dimensions
  source: src-01, "17:40 - 18:15, 19:40 - 19:55"
  confidence: high
  statement: >
    Pass target translation coordinates (x) and scroll distances (end) as functions (e.g., `() => -(scrollWidth - innerWidth)`) and enable `invalidateOnRefresh: true`.
  rationale: >
    Static values break on window resize or dynamic content loading. Functional values recalculate dynamically whenever ScrollTrigger refreshes.
  applies_to: [ku-022]

- id: ku-011
  type: principle
  name: Pin Outer Container, Animate Inner Track
  source: src-01, "20:05 - 20:45"
  confidence: high
  statement: >
    Never pin the track element being transformed (`x`); pin the outer parent container section (`#horizontal-scroll`).
  rationale: >
    Pinning the element that undergoes CSS translation causes transform coordinate collisions and severe visual jumping.
  applies_to: [ku-022]

# PROCEDURES
- id: ku-020
  type: procedure
  name: Lenis + GSAP Environment Integration
  source: src-01, "13:25 - 16:40"
  confidence: high
  goal: Initialize Lenis smooth scrolling and couple it tightly with GSAP ScrollTrigger.
  steps:
    - action: Include Lenis CSS, Lenis JS, GSAP core, and ScrollTrigger CDNs.
      criterion: All 4 resources loaded in the DOM before script execution.
    - action: Register ScrollTrigger plugin via `gsap.registerPlugin(ScrollTrigger)`.
      criterion: Plugin registered inside `DOMContentLoaded`.
    - action: Instantiate Lenis and bind `lenis.on('scroll', ScrollTrigger.update)`.
      criterion: Scroll events dispatched to ScrollTrigger on each scroll increment.
    - action: Pipe Lenis RAF updates into `gsap.ticker.add((time) => lenis.raf(time * 1000))`.
      criterion: GSAP ticker drives Lenis frame updates.
    - action: Disable GSAP lag smoothing via `gsap.ticker.lagSmoothing(0)`.
      criterion: Zero lag latency between scroll position and animation timeline.
  outputs: [Synchronized smooth scrolling rendering pipeline]

- id: ku-021
  type: procedure
  name: Horizontal DOM & CSS Layout Setup
  source: src-01, "06:50 - 12:48, 12:55 - 13:18"
  confidence: high
  goal: Build the structural markup and stylesheet required for horizontal track translation.
  steps:
    - action: Set `body { overflow-x: hidden; }`.
      criterion: Native horizontal scrollbar suppressed.
    - action: Create outer section (`#horizontal-scroll`) with vertical padding (e.g., `160px 0`).
      criterion: Breathing space above and below horizontal section.
    - action: Create wrapper (`.horizontal-scroll-wrapper`) with `overflow: hidden; height: 55vh;`.
      criterion: Constrained viewport window masking off-screen cards.
    - action: Create track (`.horizontal`) with `display: flex; align-items: center; height: 100%; padding-left: 45vw;`.
      criterion: Flex container sized to fit content with initial offset.
    - action: Create cards (`.card`) with fixed viewport relative width (e.g., `28vw`) and margins.
      criterion: Cards uniformly rendered in a horizontal row.
  outputs: [Responsive horizontal gallery layout]

- id: ku-022
  type: procedure
  name: Horizontal Tween & ScrollTrigger Configuration
  source: src-01, "16:55 - 20:45"
  confidence: high
  goal: Translate the flex track along the X-axis proportionally to vertical scroll distance.
  steps:
    - action: Query `.horizontal` element reference.
      criterion: Element reference stored in variable.
    - action: Create `gsap.to(".horizontal", {...})` tween.
      criterion: Tween targets horizontal track.
    - action: Define dynamic translation `x: () => -(horizontalSection.scrollWidth - window.innerWidth)`.
      criterion: Track translates exactly enough for the last card to dock.
    - action: Configure ScrollTrigger object with `trigger: ".horizontal"`, `pin: "#horizontal-scroll"`, `start: "center center"`, `end: () => "+=" + horizontalSection.scrollWidth`, `scrub: 1`, and `invalidateOnRefresh: true`.
      criterion: Page pins vertically while scrolling drives track horizontally from left to right.
  outputs: [Operational horizontal scroll interaction]

- id: ku-023
  type: procedure
  name: Secondary Choreography (Hero Timeline & Card Reveals)
  source: src-01, "20:50 - 25:30"
  confidence: high
  goal: Add intro hero entrance timeline and scroll-triggered card entrance transforms.
  steps:
    - action: Build `gsap.timeline()` for hero title and paragraph with overlapping offset (`"-=0.8"`).
      criterion: Cohesive intro reveal on page load.
    - action: Iterate over all `.card` elements and attach a `gsap.from(card, { x: 250, scrollTrigger: { trigger: card, start: "top bottom", toggleActions: "play none none reverse" } })`.
      criterion: Individual cards slide into position dynamically when scrolled into view.
  outputs: [Fully animated interactive experience]

# CONSTRAINTS
- id: ku-030
  type: constraint
  name: Overflow Boundary Safety
  source: src-01, "12:50 - 13:18"
  confidence: high
  rule: Set `overflow-x: hidden` on `body` instead of global `overflow: hidden`.
  consequence: Global `overflow: hidden` kills vertical page scrolling completely, breaking ScrollTrigger.
```

---

# Phase 3: Methodology Synthesis

```
STAGE 1: Environment & Engine Coupling
INPUT: Target webpage requiring smooth horizontal scroll interactions.
STEPS:
  1. Load Lenis CSS & JS, GSAP core, and ScrollTrigger plugin CDNs.
  2. Instantiate Lenis smooth scroll engine.
  3. Bind Lenis scroll events to ScrollTrigger updates.
  4. Pass Lenis RAF callback into GSAP Ticker loop.
  5. Disable GSAP lag smoothing (`gsap.ticker.lagSmoothing(0)`).
OUTPUT: Unified smooth scroll + animation tick pipeline.
VALIDATION:
  [ ] Smooth inertial scroll functions on mouse wheel / trackpad.
  [ ] No scroll stuttering or frame tearing.

STAGE 2: Multi-Tier DOM & Layout Construction
INPUT: Unified scroll pipeline.
STEPS:
  1. Set `body { overflow-x: hidden; }` to prevent horizontal layout blowout.
  2. Build Pin Section container (`#horizontal-scroll`) with vertical breathing room.
  3. Build Overflow Mask wrapper (`.horizontal-scroll-wrapper`) with constrained height.
  4. Build Flex Track (`.horizontal`) with `display: flex` and initial `padding-left`.
  5. Populate Flex Track with `.card` items using viewport relative widths (`vw`).
OUTPUT: Well-formed HTML structure and CSS track.
VALIDATION:
  [ ] Horizontal track extends naturally past viewport width.
  [ ] Content is neatly masked inside the wrapper without native horizontal scrollbars.

STAGE 3: Dynamic ScrollTrigger Track Translation
INPUT: Formed DOM hierarchy.
STEPS:
  1. Attach `gsap.to(".horizontal", {...})` tween.
  2. Set `x` translation function: `() => -(track.scrollWidth - window.innerWidth)`.
  3. Attach ScrollTrigger with `trigger: ".horizontal"` and `pin: "#horizontal-scroll"`.
  4. Set `start: "center center"` and `end: () => "+=" + track.scrollWidth`.
  5. Set `scrub: 1` (or `true`) and `invalidateOnRefresh: true`.
OUTPUT: Scrubbed horizontal showcase pinned during vertical scroll.
VALIDATION:
  [ ] Section pins when center reaches viewport center.
  [ ] Track translates horizontally until last card is visible.
  [ ] Page unpins and continues vertical scroll immediately after track completes.

STAGE 4: Micro-Interactions & Choreography
INPUT: Operational horizontal track.
STEPS:
  1. Create `gsap.timeline()` for hero entrance typography.
  2. Attach directional entrance tween to individual cards via `querySelectorAll('.card').forEach(...)`.
  3. Bind card trigger with `toggleActions: "play none none reverse"`.
OUTPUT: Polished micro-interactions on load and during horizontal scroll.
VALIDATION:
  [ ] Hero elements smoothly fade/slide up on page load.
  [ ] Cards slide into relative track positions as they enter the screen.
```

---

# Phase 4: Skill Compilation

Below is the compiled agent skill, following the target directory structure and writing guidelines.

```
gsap-lenis-horizontal-scroll/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── code-snippets.md
    └── examples.md
```

---

### File: `gsap-lenis-horizontal-scroll/SKILL.md`

```markdown
---
name: gsap-lenis-horizontal-scroll
description: |
  Implement high-performance smooth horizontal scroll galleries, showcases, and pinned card sections
  using GSAP ScrollTrigger and Lenis Smooth Scroll.
  Triggers: horizontal scroll, gsap horizontal, lenis smooth scroll, scrolltrigger pin gallery,
  horizontal showcase, smooth scroll card slider, lenis gsap integration.
---

# GSAP + Lenis Horizontal Smooth Scroll

Construct silky-smooth horizontal showcase sections inside vertically scrolling web layouts by synchronizing the Lenis smooth scroll engine with GSAP ScrollTrigger.

## Phase 1: Environment & Engine Coupling

Load core dependencies and synchronize the rendering ticker to prevent frame lag and jitter.

1. **Include Libraries**: Load Lenis CSS/JS along with GSAP Core and ScrollTrigger.
2. **Register Plugin**: Call `gsap.registerPlugin(ScrollTrigger)` inside `DOMContentLoaded`.
3. **Synchronize Ticker**: Pipe Lenis's requestAnimationFrame (RAF) into GSAP's ticker, update ScrollTrigger on scroll, and zero out lag smoothing.

```javascript
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

### Completion Gate
- [ ] Lenis CSS and JS CDN/packages imported.
- [ ] ScrollTrigger registered with GSAP.
- [ ] Lenis frame updates locked to `gsap.ticker`.
- [ ] `gsap.ticker.lagSmoothing(0)` active.

For complete CDN scripts and imports, see [code-snippets.md](references/code-snippets.md).

---

## Phase 2: Multi-Tier DOM & CSS Architecture

Build a three-tier DOM structure that isolates overflow masking, pinning context, and track translation.

```
[#horizontal-scroll]           <- Pin Container (vertical padding)
  └── [.horizontal-scroll-wrapper] <- Overflow Mask (overflow: hidden, fixed height)
        └── [.horizontal]            <- Flex Track (display: flex, padding-left)
              ├── [.card]
              ├── [.card]
              └── [.card]
```

1. **Suppress Native Horizontal Scroll**: Apply `overflow-x: hidden;` to `body`. Do not use global `overflow: hidden` on `body` as it blocks vertical scrolling.
2. **Pin Container (`#horizontal-scroll`)**: Set vertical padding (e.g. `160px 0`) to provide entrance and exit buffers.
3. **Overflow Mask (`.horizontal-scroll-wrapper`)**: Set `overflow: hidden;` and assign fixed viewport height (e.g. `55vh`).
4. **Flex Track (`.horizontal`)**: Set `display: flex; align-items: center; height: 100%;`. Add `padding-left: 45vw;` so the first card enters with aesthetic offset.
5. **Card Items (`.card`)**: Set fixed proportional dimensions (e.g. `width: 28vw;`) and horizontal margins/padding (`0 4vw`).

### Completion Gate
- [ ] `body` has `overflow-x: hidden`.
- [ ] 3-tier hierarchy built (`#horizontal-scroll` > `.horizontal-scroll-wrapper` > `.horizontal`).
- [ ] `.horizontal-scroll-wrapper` has `overflow: hidden`.
- [ ] Cards display in a single horizontal flex line extending beyond viewport width.

For domain terms and layout vocabulary, see [terminology.md](references/terminology.md).

---

## Phase 3: Dynamic ScrollTrigger Track Translation

Animate the flex track along the X-axis using dynamic functional expressions.

1. **Reference Track**: Query the track DOM element (`const track = document.querySelector(".horizontal")`).
2. **Define Translation Tween**: Create a `gsap.to(".horizontal", {...})` tween.
3. **Set Dynamic Distance**: Compute `x: () => -(track.scrollWidth - window.innerWidth)` to guarantee the track translates precisely until the final element docks.
4. **Configure ScrollTrigger**:
   - `trigger`: Set to `".horizontal"`.
   - `pin`: Set to outer parent `"#horizontal-scroll"`.
   - `start`: Set to `"center center"` (triggers when container center meets screen center).
   - `end`: Set dynamically via functional value `() => "+=" + track.scrollWidth`.
   - `scrub`: Set to `1` (or `true`) for direct momentum scrubbing.
   - `invalidateOnRefresh`: Set to `true` to recalculate values on viewport resize.

```javascript
const horizontalSection = document.querySelector(".horizontal");

gsap.to(".horizontal", {
  x: () => -(horizontalSection.scrollWidth - window.innerWidth),
  scrollTrigger: {
    trigger: ".horizontal",
    pin: "#horizontal-scroll",
    start: "center center",
    end: () => "+=" + horizontalSection.scrollWidth,
    scrub: 1,
    invalidateOnRefresh: true,
  }
});
```

### Completion Gate
- [ ] Outer section (`#horizontal-scroll`) pins securely during scroll.
- [ ] Track translates horizontally from right to left smoothly.
- [ ] End calculation matches full scroll width without cutting off cards.
- [ ] Layout dynamically adapts on window resize without refresh bugs.

---

## Phase 4: Micro-Interactions & Intro Choreography

Enhance visual fidelity with intro entrance timelines and per-card directional scroll reveals.

1. **Intro Hero Entrance**: Build a `gsap.timeline()` for load-time typography animations using `power4.out` / `power3.out` eases and negative timeline offsets.
2. **Per-Card Reveal Tweens**: Loop through all `.card` elements and assign a directional offset tween triggered when each card enters the viewport.

```javascript
document.querySelectorAll(".card").forEach((card) => {
  gsap.from(card, {
    x: 250,
    duration: 0.6,
    scrollTrigger: {
      trigger: card,
      start: "top bottom",
      toggleActions: "play none none reverse"
    }
  });
});
```

### Completion Gate
- [ ] Hero text reveals smoothly on page load.
- [ ] Cards animate inward smoothly as they enter the screen during horizontal scrub.
- [ ] Animations reverse cleanly when scrolling back upward.

For full worked layouts and production implementations, see [examples.md](references/examples.md).
```

---

### File: `gsap-lenis-horizontal-scroll/references/terminology.md`

```markdown
# Terminology

**Lenis**:
An open-source smooth scroll library created by Darkroom Engineering / Studio Freight that normalizes input delta and provides buttery-smooth inertia without breaking native browser accessibility or scroll anchors.
_Avoid_: scroll hijacker, fake scroll, virtual scroller

**ScrollTrigger**:
The industry-standard GSAP plugin that translates page scroll position into animation progress, viewport-relative triggers, and CSS pin states.
_Avoid_: scroll listener, scroll watcher

**Ticker Synchronization**:
The technique of linking an animation engine's frame loop (GSAP Ticker) directly with an inertia scroll loop (Lenis RAF) so both execute on identical frame timestamps.
_Avoid_: dual requestAnimationFrame, independent render loops

**Pin Container**:
The static parent HTML section targeted by ScrollTrigger's `pin` property, keeping the section fixed in the viewport while child elements animate.
_Avoid_: fixed element, sticky div

**Flex Track**:
The inner horizontally expanding container element (`display: flex`) that receives `transform: translateX(...)` values during vertical scroll.
_Avoid_: slider list, carousel wrapper

**Functional Value (GSAP)**:
A property defined as a callback function (e.g. `x: () => value`) evaluated dynamically on every ScrollTrigger refresh/resize rather than computed once at runtime.
_Avoid_: hardcoded offset, static pixel value
```

---

### File: `gsap-lenis-horizontal-scroll/references/code-snippets.md`

```markdown
# Code Snippets & Boilerplates

## CDN Bundle Imports

```html
<!-- Lenis Smooth Scroll CSS -->
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.8/dist/lenis.css">

<!-- GSAP Core & ScrollTrigger Plugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>

<!-- Lenis Smooth Scroll JS -->
<script src="https://unpkg.com/lenis@1.3.8/dist/lenis.min.js"></script>
```

## HTML Structure

```html
<!-- Intro / Hero Section -->
<section class="intro">
  <h1 class="heading"><span>Horizontal</span> Smooth Scroll</h1>
  <div class="content">
    <p>Experience <span>smooth scrolling</span> like never before.</p>
    <p>Dive into a horizontal showcase powered by <span>GSAP</span> + <span>Lenis</span>.</p>
  </div>
</section>

<!-- Horizontal Showcase Section -->
<section id="horizontal-scroll">
  <div class="horizontal-scroll-wrapper">
    <div class="horizontal">
      <div class="card"><div class="count">01</div><h2>Design Bold.</h2></div>
      <div class="card"><div class="count">02</div><h2>Code Smart.</h2></div>
      <div class="card"><div class="count">03</div><h2>Animate Fluid.</h2></div>
      <div class="card"><div class="count">04</div><h2>Scroll Seamless.</h2></div>
      <div class="card"><div class="count">05</div><h2>Build Creative.</h2></div>
      <div class="card"><div class="count">06</div><h2>Experience Different.</h2></div>
    </div>
  </div>
</section>

<!-- Footer Section -->
<footer>
  <h2 class="heading">So we build<br><span>web scrolling</span></h2>
  <div class="content">
    <div class="heading">as it should be</div>
  </div>
</footer>
```

## CSS Core Rules

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #121200;
  color: #ffffff;
  font-family: 'Oswald', sans-serif;
  overflow-x: hidden;
}

.intro, footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rem;
  height: 100vh;
}

#horizontal-scroll {
  padding: 160px 0;
}

.horizontal-scroll-wrapper {
  overflow: hidden;
  height: 55vh;
}

.horizontal {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 45vw;
}

.horizontal > div,
.horizontal .card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 28vw;
  padding: 50px 40px;
  border: 2px solid #ffffff;
  margin: 0 4vw;
  flex-shrink: 0;
}

.card .count {
  font-size: 7vw;
  font-weight: bold;
  color: #bbbb4f;
  line-height: 1.4;
}

.card h2 {
  font-size: 3vw;
  font-weight: 300;
}
```
```

---

### File: `gsap-lenis-horizontal-scroll/references/examples.md`

```markdown
# Worked Examples

## Example 1: Standard Horizontal Showcase Implementation

**Scenario**: A portfolio showcase requiring a pinned 6-card horizontal gallery between a hero and footer section.

**JavaScript Setup**:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Initialize & Sync Lenis
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Intro Animation Timeline
  const tl = gsap.timeline();
  tl.from(".intro .heading", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out"
  })
  .from(".intro .content p", {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  }, "-=0.8");

  // 3. Pinned Horizontal Track Translation
  const horizontalSection = document.querySelector(".horizontal");
  gsap.to(".horizontal", {
    x: () => -(horizontalSection.scrollWidth - window.innerWidth),
    scrollTrigger: {
      trigger: ".horizontal",
      pin: "#horizontal-scroll",
      start: "center center",
      end: () => "+=" + horizontalSection.scrollWidth,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  // 4. Individual Card Reveal Transitions
  document.querySelectorAll(".card").forEach((card) => {
    gsap.from(card, {
      x: 250,
      duration: 0.6,
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        toggleActions: "play none none reverse"
      }
    });
  });
});
```

**Outcome**:
- Inertial smooth scrolling across the entire page.
- Clean hero animation on load.
- Pinning occurs seamlessly when the gallery enters view.
- Track scrolls horizontally based on user scroll velocity and unpins as soon as the final card aligns.
```

---

# Phase 5: Validation & Delivery

### Source Fidelity & Verification
- **Lenis + GSAP Sync (`src-01` 13:20–16:40)**: Fully accounted for with Ticker registration and zero lag smoothing.
- **HTML/CSS 3-Tier Layout (`src-01` 06:50–13:18)**: Fully structured into pin container, overflow mask, and flex track.
- **ScrollTrigger Math (`src-01` 16:55–20:45)**: Encoded with `scrollWidth - innerWidth` dynamic function and `invalidateOnRefresh: true`.
- **Card and Hero Micro-Tweens (`src-01` 20:50–25:30)**: Encoded with timeline offsets and toggleActions.

### Delivery Summary
1. **Skill Name**: `gsap-lenis-horizontal-scroll`
2. **Structure**: `SKILL.md` (compact operational workflow under 250 lines), accompanied by `references/terminology.md`, `references/code-snippets.md`, and `references/examples.md`.
3. **Artifacts**: Complete boilerplate code, CSS properties, math calculations, and lifecycle synchronization ready for production deployment.
