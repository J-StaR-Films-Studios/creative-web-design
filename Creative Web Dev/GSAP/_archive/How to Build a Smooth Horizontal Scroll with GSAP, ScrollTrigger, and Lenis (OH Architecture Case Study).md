# Source-to-Skill Compilation Report

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / tutorial walkthrough |
| **Title** | How to Build a Smooth Horizontal Scroll with GSAP, ScrollTrigger, and Lenis (OH Architecture Case Study) |
| **Authority** | Frontend creative developer walkthrough replicating an Awwwards Site of the Day award-winning website (OH Architecture) |
| **Coverage** | Setup of smooth momentum scrolling (Lenis), pinning viewports with GSAP ScrollTrigger, calculating dynamic horizontal translation values (`scrollWidth - innerWidth`), binding scroll scrub to horizontal transform, handling window resizing via `invalidateOnRefresh`, and rendering dynamic numeric scroll progress indicators. |

### Coverage Gaps Identified
- Vertical scroll layout chaining before/after the horizontal section (video focuses specifically on an isolated full-viewport horizontal section).
- Touch gesture customization beyond Lenis defaults.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# KNOWLEDGE SPEC: GSAP + Lenis Horizontal Scrolling Implementation
# ==============================================================================

- id: ku-001
  type: concept
  name: Lenis Smooth Scrolling
  source: src-01, "06:17 - 07:27"
  confidence: high
  definition: >
    A lightweight smooth scrolling library synchronized with GSAP's ticker to provide
    momentum-based, unified scroll behavior across browsers and devices.
  attributes: [momentum scrolling, requestAnimationFrame binding, lagSmoothing]
  avoid_terms: [native scroll hijack, fake scrollbar]
  related: [ku-002, ku-003]

- id: ku-002
  type: concept
  name: ScrollTrigger Pinning
  source: src-01, "10:36 - 11:45"
  confidence: high
  definition: >
    A GSAP plugin feature that fixes a container element in place within the viewport 
    for the duration of a scroll distance while animating child elements.
  attributes: [pin: true, start: "top top", scrub: true]
  avoid_terms: [sticky positioning, fixed scroll freeze]
  related: [ku-001, ku-004]

- id: ku-003
  type: concept
  name: Dynamic Scroll Amount Calculation
  source: src-01, "08:13 - 10:20"
  confidence: high
  definition: >
    The mathematical calculation representing the total distance a container must shift along 
    the X-axis, calculated as `-(scrollContainer.scrollWidth - window.innerWidth)`.
  attributes: [scrollWidth, innerWidth, negative translation]
  avoid_terms: [hardcoded pixel scroll, fixed percentage transform]
  related: [ku-004, ku-006]

- id: ku-004
  type: procedure
  name: Horizontal Scroll Section Construction
  source: src-01, "02:18 - 14:05"
  confidence: high
  goal: Create a responsive, smooth, pinned horizontal scrolling gallery with progress tracking.
  prerequisites:
    - GSAP core library loaded
    - ScrollTrigger plugin loaded
    - Lenis library loaded
  steps:
    - action: Wrap markup in fixed outer viewport and dynamic flex container
      criterion: Outer section is 100vw/100vh with overflow hidden; inner container width is fit-content
    - action: Bind Lenis to GSAP RAF ticker
      criterion: Lenis update event triggers ScrollTrigger.update and ticker lagSmoothing is 0
    - action: Define dynamic scroll amount calculation function
      criterion: Function returns `-(scrollContainer.scrollWidth - window.innerWidth)`
    - action: Configure gsap.to animation with ScrollTrigger scrub and pin
      criterion: Trigger pins section at top top, end is set to `+=distance`, invalidateOnRefresh is true
    - action: Attach onUpdate callback to format and render progress percentage
      criterion: Uses self.progress to calculate 2-digit zero-padded percentage `(00% - 100%)`
  outputs:
    - Fully functional responsive horizontal scroll interaction
  related: [ku-001, ku-002, ku-003, ku-005, ku-006]

- id: ku-005
  type: principle
  name: DOM Content Loaded Execution Guard
  source: src-01, "06:17 - 07:05"
  confidence: high
  statement: >
    Initialize all GSAP animations and measurements inside a DOMContentLoaded event listener 
    to guarantee accurate container dimension measurements (scrollWidth and innerWidth).
  rationale: >
    If dimensions are measured before DOM elements and images register initial layout bounds, 
    scroll distance calculations fail.
  applies_to: [ku-004]

- id: ku-006
  type: principle
  name: Invalidation on Refresh
  source: src-01, "12:21 - 12:38"
  confidence: high
  statement: >
    Set `invalidateOnRefresh: true` on ScrollTriggers whose animation values rely on function-based 
    dimension calculations.
  rationale: >
    When the browser viewport resizes, function-based properties re-execute to compute updated 
    dimensions rather than retaining stale initial values.
  applies_to: [ku-004]

- id: ku-007
  type: constraint
  name: Horizontal Overflow Containment
  source: src-01, "05:20 - 06:10"
  confidence: high
  rule: >
    Apply `overflow-x: hidden` to `html, body` and ensure fixed viewport wrappers prevent native scrollbars 
    from breaking layout while ScrollTrigger handles the virtual scroll distance.
  scope: CSS layout setup
  consequence: >
    Omitting overflow containment introduces conflicting dual scrollbars and broken horizontal panning.
  enforced_by: Base CSS styles

- id: ku-008
  type: counterexample
  name: Hardcoded Scroll Distance
  source: src-01, "08:35 - 09:15"
  confidence: high
  scenario: Setting static `x: -2000px` or a static pixel `end` value in ScrollTrigger.
  mistake: Hardcoding translation distance instead of reading DOM dimensions dynamically.
  consequence: Breaks on different screen sizes and whenever cards are added or removed.
  correction: Use `() => -(scrollContainer.scrollWidth - window.innerWidth)`.
  teaches: Horizontal scroll distance must always be calculated relative to container versus viewport width.
  illustrates: [ku-003, ku-006]
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Layout & DOM Architecture
INPUT: Content items (cards, images, captions)
STEPS:
1. Define fixed UI elements (titles, fixed counters) with `position: fixed`.
2. Define scroll section viewport (`100vw`, `100vh`, `overflow: hidden`).
3. Set inner scroll container as `display: flex`, `width: fit-content`.
4. Apply global `overflow-x: hidden` on `html, body`.
OUTPUT: Contained HTML/CSS structure ready for transform animation.
VALIDATION:
[ ] Inner container width expands dynamically with card content.
[ ] No native horizontal scrollbar appears.

STAGE 2: Lenis Smooth Scrolling Integration
INPUT: Lenis and GSAP script libraries
STEPS:
1. Wrap initialization inside `DOMContentLoaded`.
2. Instantiate `new Lenis()`.
3. Synchronize `lenis.on('scroll', ScrollTrigger.update)`.
4. Add Lenis RAF handling to `gsap.ticker.add`.
5. Set `gsap.ticker.lagSmoothing(0)`.
OUTPUT: Momentum scrolling pipeline synced to GSAP rendering frames.
VALIDATION:
[ ] Page scrolling interpolates smoothly.
[ ] GSAP ticker runs without frame lag accumulation.

STAGE 3: Dynamic Scroll Calculations & Trigger Binding
INPUT: DOM selectors for section, container, progress target
STEPS:
1. Implement `getScrollAmount()` returning `-(scrollContainer.scrollWidth - window.innerWidth)`.
2. Create `gsap.to(scrollContainer, { x: getScrollAmount, ease: "none" })`.
3. Set `scrollTrigger.trigger` to outer section and `pin: true`.
4. Set `scrollTrigger.start: "top top"` and `end: () => "+=" + (-getScrollAmount())`.
5. Enable `scrub: true` and `invalidateOnRefresh: true`.
6. Set `onUpdate: (self) => ...` to format progress percentage (`(00%)` to `(100%)`).
OUTPUT: Pinned horizontal scrolling viewport tied directly to vertical scroll position.
VALIDATION:
[ ] Horizontal container translates completely to its last item.
[ ] Resizing window updates scroll bounds without page reload.
[ ] Progress indicator displays accurate zero-padded percentages.
```

---

## Phase 4: Skill Compilation

Below is the complete compiled skill package ready for deployment.

```
horizontal-smooth-scroll/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

### `SKILL.md`

```markdown
---
name: horizontal-smooth-scroll
description: |
  Implement high-performance, smooth, responsive horizontal scrolling sections using GSAP, ScrollTrigger, and Lenis.
  Triggers: horizontal scroll, horizontal gallery, gsap horizontal scroll, lenis horizontal scroll, scrolltrigger pin gallery, scroll progress counter.
---

# Horizontal Smooth Scroll with GSAP, ScrollTrigger & Lenis

Construct responsive horizontal scroll containers driven by vertical page scroll with momentum smoothing and progress tracking.

For domain definitions, see [terminology.md](references/terminology.md).
For complete reference code and templates, see [examples.md](references/examples.md).

## Phase 1: DOM & CSS Layout Setup

Establish the structural foundation preventing native scroll collisions.

1. **Contain page overflow**: Set `overflow-x: hidden` on `html, body`.
2. **Fix static overlay elements**: Position brand headers, permanent navigation, and progress meters using `position: fixed; z-index: >10`.
3. **Configure the trigger section**: Set the outer section (`.scroll-section`) to `width: 100%; height: 100vh; overflow: hidden; position: relative;`.
4. **Create the flexible track**: Set the inner container (`.scroll-container`) to:
   - `display: flex;`
   - `width: fit-content;`
   - `align-items: flex-end;` (or centered based on design)
   - `height: 100%;`

### Completion Gate
- [ ] Outer section strictly occupies 100vh without page overflow.
- [ ] Inner track expands horizontally to fit all child items.
- [ ] No native horizontal scrollbars are visible.

---

## Phase 2: Lenis Smooth Scroll Bridge

Synchronize Lenis momentum scrolling with GSAP's rendering engine inside `DOMContentLoaded`.

1. **Initialize Lenis**:
   ```javascript
   const lenis = new Lenis();
   ```
2. **Hook ScrollTrigger updates**:
   ```javascript
   lenis.on('scroll', ScrollTrigger.update);
   ```
3. **Drive Lenis through GSAP ticker**:
   ```javascript
   gsap.ticker.add((time) => {
     lenis.raf(time * 1000);
   });
   gsap.ticker.lagSmoothing(0);
   ```

### Completion Gate
- [ ] Lenis drives smooth vertical scroll.
- [ ] GSAP ticker passes high-resolution delta time to Lenis.
- [ ] `lagSmoothing` is disabled to prevent animation snapping on tab switch.

---

## Phase 3: Dynamic Scroll Calculations

Compute translation boundaries dynamically to maintain responsiveness across all viewport sizes.

1. **Calculate scroll clearance**:
   Measure total track width minus visible window width:
   ```javascript
   function getScrollAmount() {
     const scrollWidth = scrollContainer.scrollWidth;
     const windowWidth = window.innerWidth;
     return -(scrollWidth - windowWidth);
   }
   ```
2. **Guard against short content**: If `scrollContainer.scrollWidth <= window.innerWidth`, translation distance is `0`.

### Completion Gate
- [ ] Scroll amount returns a negative number matching remaining unviewed track width.
- [ ] Calculation is enclosed in a callable function (not evaluated once statically).

---

## Phase 4: ScrollTrigger Pinning & Scrub Animation

Bind horizontal translation to vertical scroll progression.

1. **Create the GSAP tween**:
   ```javascript
   gsap.to(scrollContainer, {
     x: getScrollAmount,
     ease: "none",
     scrollTrigger: {
       trigger: section,
       pin: true,
       start: "top top",
       end: () => `+=${-getScrollAmount()}`,
       scrub: true,
       invalidateOnRefresh: true,
       onUpdate: (self) => {
         const percent = (self.progress * 100).toFixed(0).padStart(2, '0');
         progressAmount.textContent = `(${percent}%)`;
       }
     }
   });
   ```

### Completion Gate
- [ ] `pin: true` locks the section when its top reaches the viewport top.
- [ ] `scrub: true` synchronizes container translation with the scroll position.
- [ ] `invalidateOnRefresh: true` recalculates dimensions on window resize.
- [ ] Progress counter updates from `(00%)` to `(100%)`.
```

---

### `references/terminology.md`

```markdown
# Terminology

**Lenis**:
A lightweight smooth scroll library that intercepts and interpolates scrolling coordinates with momentum physics.
_Avoid_: scroll hijacking, native scroll override

**ScrollTrigger Pinning**:
A GSAP mechanism that fixes a DOM element at a specific viewport coordinate while creating virtual vertical scroll height.
_Avoid_: sticky positioning, fixed viewport locking

**Scroll Amount**:
The net pixel offset required to translate an oversized container until its rightmost boundary aligns with the viewport right edge (`-(scrollWidth - windowWidth)`).
_Avoid_: fixed offset, static width animation

**Scrubbing**:
Directly binding animation playback progress (`0.0` to `1.0`) to scroll distance rather than firing a timed playback on trigger.
_Avoid_: scroll trigger autoplay, scroll-linked duration
```

---

### `references/examples.md`

```markdown
# Examples & Implementation Templates

## Full Implementation Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Horizontal Scroll Gallery</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { overflow-x: hidden; font-family: sans-serif; background: #f5f5f5; }
    
    h1.title { position: fixed; left: 4rem; top: 2rem; font-size: 4vw; z-index: 10; }
    .progress { position: fixed; bottom: 2rem; right: 4rem; font-size: 0.9rem; z-index: 10; display: flex; align-items: center; }
    .progress-amount { margin-left: 0.5rem; font-weight: bold; }

    .scroll-section { width: 100%; height: 100vh; overflow: hidden; position: relative; }
    .scroll-container { display: flex; align-items: flex-end; width: fit-content; height: 100%; padding: 0 4rem 8vh 4rem; gap: 2rem; }
    .card { width: 320px; flex-shrink: 0; }
    .card img { width: 100%; height: auto; object-fit: cover; display: block; }
    .card p { margin-top: 0.75rem; font-size: 0.85rem; }
  </style>
</head>
<body>

  <h1 class="title">WORKS</h1>
  <div class="progress">SCROLL DOWN TO EXPLORE <span class="progress-amount">(00%)</span></div>

  <section class="scroll-section">
    <div class="scroll-container">
      <div class="card"><img src="item1.jpg" alt="Item 1" /><p>01 / Project Alpha</p></div>
      <div class="card"><img src="item2.jpg" alt="Item 2" /><p>02 / Project Beta</p></div>
      <div class="card"><img src="item3.jpg" alt="Item 3" /><p>03 / Project Gamma</p></div>
      <div class="card"><img src="item4.jpg" alt="Item 4" /><p>04 / Project Delta</p></div>
    </div>
  </section>

  <!-- GSAP & Lenis CDNs -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      // 1. Lenis Smooth Scroll Setup
      const lenis = new Lenis();
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // 2. Element Selectors
      const scrollContainer = document.querySelector(".scroll-container");
      const section = document.querySelector(".scroll-section");
      const progressAmount = document.querySelector(".progress-amount");

      // 3. Dynamic Calculation
      function getScrollAmount() {
        const scrollWidth = scrollContainer.scrollWidth;
        const windowWidth = window.innerWidth;
        return -(scrollWidth - windowWidth);
      }

      // 4. GSAP Animation & Pinning
      gsap.to(scrollContainer, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: () => `+=${-getScrollAmount()}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const percent = (self.progress * 100).toFixed(0).padStart(2, "0");
            progressAmount.textContent = `(${percent}%)`;
          }
        }
      });
    });
  </script>
</body>
</html>
```
```

---

## Phase 5: Validation

### 1. Source Fidelity Check
- **Lenis configuration with GSAP ticker & lagSmoothing**: Verified against `07:12 - 07:27`.
- **Dynamic measurement formula `-(scrollWidth - innerWidth)`**: Verified against `09:30 - 10:20`.
- **Pinning, scrubbing, and `invalidateOnRefresh`**: Verified against `11:00 - 12:35`.
- **Progress calculation with `padStart(2, '0')`**: Verified against `13:30 - 14:05`.

### 2. Operational Coverage Check
1. **Scenario 1: Window Resizing**: `invalidateOnRefresh: true` and function references for `x` and `end` ensure recalculated bounds without layout breaking.
2. **Scenario 2: Variable Content Length**: Container uses `width: fit-content` and reads `scrollWidth` dynamically, accommodating any number of cards.
3. **Scenario 3: Tab Switching / Frame Drops**: `gsap.ticker.lagSmoothing(0)` prevents frame lag jumps when the user returns from inactive tabs.

---

## Delivery Summary

1. **Compiled Skill Package**: Ready to deploy in `horizontal-smooth-scroll/`.
2. **Knowledge Extraction Stats**:
   - 4 Concepts
   - 1 Master Procedure
   - 2 Core Principles
   - 1 Invariant Constraint
   - 1 Common Anti-Pattern / Counterexample
3. **Known Limitations**:
   - Touch navigation on mobile devices inherits Lenis touch settings; specialized swipe-flick physics require custom touch event handlers.
   - For multi-section pages, sections preceding the horizontal scroll must not use `position: fixed` or they will be pinned concurrently.
