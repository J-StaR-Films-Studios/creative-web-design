Here is the complete extraction, synthesis, and compilation of the video into a production-grade agent skill following the **Source-to-Skill** pipeline.

---

# Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Video Tutorial / Screen-recording walkthrough |
| **Title** | Horizontal Scroll Slider & Parallax Effect with GSAP and ScrollTrigger (Codegrid) |
| **Authority** | Codegrid (Specialized web development & creative animation channel) |
| **Coverage** | Horizontal viewport scrolling pinned to vertical scroll, dynamic differential parallax transforms on floating media cards, DOM layout setup, CSS architecture for ultra-wide wrappers, responsive adjustments, GSAP ScrollTrigger pinning and scrub integration. |

### Coverage Gaps Identified
- Accessibility handling (e.g., `prefers-reduced-motion` media queries).
- Dynamic card calculation for arbitrary numbers of elements without hardcoding CSS positions.

---

# Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
conflicts: []

knowledge_units:
  # Concepts
  - id: ku-001
    type: concept
    name: Horizontal Viewport Pinning Track
    source: src-01, "00:35 - 03:20"
    confidence: high
    definition: >
      A structural pattern where an ultra-tall vertical container (e.g., 1200vh)
      provides scroll distance while pinning a wide horizontal viewport wrapper (e.g., 400vw)
      at the top of the viewport.
    attributes: [virtual scroll track, pin track, viewport unit scaling]
    avoid_terms: [native horizontal scroll, carousel]

  - id: ku-002
    type: concept
    name: Differential Translation Parallax
    source: src-01, "05:15 - 08:05"
    confidence: high
    definition: >
      An animation technique where floating elements within a moving track are translated
      at independent horizontal rates and rotations relative to the parent track's movement.
    attributes: [relative translation, scrub synchronization, rotational drift]
    avoid_terms: [static parallax, background parallax]

  # Principles
  - id: ku-010
    type: principle
    name: Scroll Track Decoupling
    source: src-01, "03:00 - 05:50"
    confidence: high
    statement: >
      Separate the scroll timeline distance (container height in vh) from the visual
      wrapper width (wrapper width in vw) to precisely tune the scroll friction and pacing.
    rationale: >
      Hardcoding scroll duration to element width prevents natural scroll velocity control.
      Using vertical height as a proxy allows smooth scrub interpolation.
    applies_to: [ku-020, ku-021]

  - id: ku-011
    type: principle
    name: Hardware Acceleration on Transforming Canvases
    source: src-01, "03:25 - 03:35"
    confidence: high
    statement: >
      Apply will-change: transform to ultra-wide horizontal wrappers prior to ScrollTrigger binding.
    rationale: >
      Prevents browser paint recalculation spikes across multi-viewport composite layers.
    applies_to: [ku-020]

  # Procedures
  - id: ku-020
    type: procedure
    name: Horizontal Scroll DOM & CSS Architecture
    source: src-01, "00:35 - 04:55"
    confidence: high
    goal: Construct an HTML/CSS layout capable of pinned horizontal translation
    prerequisites: []
    steps:
      - action: Create a tall root container with height matching total desired scroll distance (e.g., 1200vh)
        criterion: Container height accommodates horizontal translation and following sections
      - action: Create an absolute wrapper with multi-viewport width (e.g., 400vw, height 100vh) and will-change: transform
        criterion: Wrapper clips child overflow without triggering horizontal document scrollbars
      - action: Position cards absolutely across the horizontal wrapper percentage coordinates
        criterion: Card placement spans along the extended width beyond initial viewport
      - action: Position outro section offset down the vertical track (e.g., top: 150vh)
        criterion: Outro is inaccessible until horizontal sequence resolves
    outputs: [Scrollable HTML skeleton, CSS styling rules]

  - id: ku-021
    type: procedure
    name: GSAP ScrollTrigger Pinning & Parallax Binding
    source: src-01, "05:02 - 08:05"
    confidence: high
    goal: Animate horizontal track movement and card parallax driven by scroll progress
    prerequisites: [GSAP and ScrollTrigger loaded in DOM, ku-020 completed]
    steps:
      - action: Register ScrollTrigger plugin with GSAP
        criterion: gsap.registerPlugin(ScrollTrigger) executed
      - action: Initialize primary ScrollTrigger on the horizontal wrapper with pin: true and scrub: 1
        criterion: Wrapper locks at top: 0 and updates x translation proportionally to progress
      - action: Define distinct endTranslateX and rotate parameters per card ID
        criterion: Configuration array maps each card selector to target transform deltas
      - action: Bind individual ScrollTriggers per card to apply eased gsap.to transforms onUpdate
        criterion: Cards translate and rotate at varying velocities during scroll
    outputs: [Configured GSAP ScrollTrigger animations]

  # Constraints
  - id: ku-030
    type: constraint
    name: Overflow-X Restriction
    source: src-01, "02:05 - 02:15"
    confidence: high
    rule: >
      html and body must enforce overflow-x: hidden to suppress native browser horizontal scrollbars.
    scope: Global styles
    consequence: Native scrollbar causes dual-axis scroll collision and broken pin tracking.
    enforced_by: CSS global reset
```

---

# Phase 3: Methodology Synthesis

```
STAGE 1: DOM & Layout Scaffolding
INPUT:
- List of visual cards/images and primary display typography
STEPS:
1. Build `.container` wrapper with fixed nav, wide `.wrapper-404`, and absolute `.outro` section.
2. Embed `.card` elements with dedicated IDs inside the wide wrapper.
OUTPUT: Semantic HTML structure with GSAP/ScrollTrigger imports.
VALIDATION:
[ ] All card elements have unique identifiers.
[ ] GSAP and ScrollTrigger scripts are loaded.

STAGE 2: Coordinate & Overflow Styling
INPUT:
- DOM structure from Stage 1.
STEPS:
1. Set `html, body` to `overflow-x: hidden; width: 100%; height: 100%;`.
2. Set `.container` height to `1200vh` and `.wrapper-404` to `width: 400vw; height: 100vh; position: absolute; will-change: transform;`.
3. Distribute `.card` positions across percentage intervals (`left: 20%`, `40%`, `60%`, `80%`).
4. Set `.outro` to `position: absolute; top: 150vh;`.
OUTPUT: Cross-browser responsive stylesheet.
VALIDATION:
[ ] Document has vertical scroll only, no horizontal scrollbars.
[ ] Elements positioned out of initial viewport are reachable via DOM tree.

STAGE 3: GSAP ScrollTrigger Motion Engineering
INPUT:
- Styled DOM with active classes and IDs.
STEPS:
1. Register `ScrollTrigger`.
2. Construct parent `ScrollTrigger.create` on `.wrapper-404` with `pin: true`, `start: "top top"`, `end: "+=900vh"`, and `scrub: 1`.
3. Inside `onUpdate`, translate the wrapper across X using `gsap.to(..., { x: -350 * progress + "vw", ease: "power3.out" })`.
4. Iterate over card config array and bind individual `ScrollTrigger` instances with varied `endTranslateX` and `rotate` multipliers.
OUTPUT: Synchronized horizontal scrub animation with differential parallax.
VALIDATION:
[ ] Track pins upon entering viewport.
[ ] Cards move at differential speeds and rotate smoothly.
[ ] Scroll cleanly transitions to `.outro` after horizontal pass.
```

---

# Phase 4 & Delivery: Compiled Skill Package

Below is the compiled agent skill ready for installation.

```
gsap-horizontal-parallax-scroll/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

### `SKILL.md`

```markdown
---
name: gsap-horizontal-parallax-scroll
description: |
  Construct horizontal scrolling sections with dynamic multi-element parallax and pinning
  using GSAP and ScrollTrigger. Use when building 404 pages, interactive portfolios, image
  galleries, or storytelling sections that translate horizontally driven by vertical scroll.
  Triggers: horizontal scroll, gsap horizontal scroll, scrolltrigger parallax, pinned horizontal track,
  differential scroll animation, 404 animated page.
---

# GSAP Horizontal Parallax Scroll

Build high-performance, pinned horizontal scroll sections with differential card parallax and smooth scrub controls.

## Ground Rules

1. **Decouple Track Height from Wrapper Width**: Drive the scroll progress using a tall vertical scroll track (`1200vh`) rather than binding 1:1 to horizontal pixel widths.
2. **Strict Document Clipping**: Lock `overflow-x: hidden` on root documents to prevent browser-native scroll collisions.
3. **Hardware Acceleration**: Always specify `will-change: transform` on ultra-wide translation containers.

For definitions of canonical terms, see [terminology.md](references/terminology.md).

---

## Phase 1: Layout & DOM Construction

Construct the structural hierarchy separating the scroll viewport, translation wrapper, and following sections.

1. Create a root `.container` holding the entire experience.
2. Insert a fixed navigation bar if global navigation must remain persistent across the scrub.
3. Create the main animation wrapper (`.wrapper-404` or `.horizontal-wrapper`).
4. Place the large typographic heading (`<h1>`) inside the wrapper.
5. Create card elements (`.card`) inside the wrapper, assigning each a distinct ID (`#card-1`, `#card-2`, etc.) and an inner `<img>` or media element.
6. Create an `.outro` section outside the horizontal wrapper for post-scroll content.
7. Include CDN or local script tags for `gsap.min.js` and `ScrollTrigger.min.js`.

### Completion Gate
- [ ] Every moving card has a unique CSS selector.
- [ ] Outro is structurally separated from the translating wrapper.
- [ ] GSAP and ScrollTrigger libraries are imported.

---

## Phase 2: CSS Architecture & Positioning

Establish the coordinate canvas and enforce overflow containment.

1. **Global Reset**:
   ```css
   * { margin: 0; padding: 0; box-sizing: border-box; }
   html, body { width: 100%; height: 100%; background: #000; overflow-x: hidden; }
   img { width: 100%; height: 100%; object-fit: cover; }
   ```

2. **Container & Track Sizing**:
   ```css
   .container { width: 100%; height: 1200vh; }
   .wrapper-404 {
     position: absolute;
     top: 0;
     width: 400vw;
     height: 100vh;
     will-change: transform;
   }
   ```

3. **Typography & Cards**:
   - Size the main text to fill viewports: `font-size: 48vw; text-align: center;`.
   - Style cards with fixed dimensional bounds and absolute positioning:
     ```css
     .card {
       position: absolute;
       width: 300px;
       height: 300px;
       border-radius: 20px;
       overflow: hidden;
     }
     ```
   - Stagger card anchors horizontally across the wrapper (e.g., `left: 20%`, `40%`, `60%`, `80%`) and varied vertical offsets (`top: 15%` to `50%`).

4. **Outro Section**:
   - Position below the primary animation trigger zone: `position: absolute; top: 150vh; width: 100%; height: 100vh;`.

5. **Responsive Fallbacks**:
   - Adjust top padding for mobile screens under `900px` to maintain typographic centering.

### Completion Gate
- [ ] No horizontal scrollbars appear on the root window.
- [ ] Floating elements are distributed along the extended multi-viewport width.

---

## Phase 3: GSAP Motion & ScrollTrigger Engineering

Bind vertical scroll progress to horizontal translation and differential parallax transforms.

For worked code patterns, see [examples.md](references/examples.md).

1. Register the ScrollTrigger plugin:
   ```javascript
   gsap.registerPlugin(ScrollTrigger);
   ```

2. Define the individual card configuration array with distinct translation offsets and rotations:
   ```javascript
   const cards = [
     { id: "#card-1", endTranslateX: -2000, rotate: 45 },
     { id: "#card-2", endTranslateX: -1000, rotate: -30 },
     { id: "#card-3", endTranslateX: -2000, rotate: 45 },
     { id: "#card-4", endTranslateX: -1500, rotate: -30 },
   ];
   ```

3. Initialize the Master ScrollTrigger for the horizontal canvas:
   - Target `.wrapper-404` as the trigger.
   - Set `start: "top top"`, `end: "+=900vh"`, `scrub: 1`, and `pin: true`.
   - In `onUpdate(self)`, calculate translation: `x = -350 * self.progress + "vw"`.
   - Apply smooth translation with `gsap.to(".wrapper-404", { x: ..., duration: 0.5, ease: "power3.out" })`.

4. Initialize Card-Level Parallax Triggers:
   - Iterate through `cards.forEach(card => { ... })`.
   - Create a `ScrollTrigger.create` instance for each card targeting `card.id`.
   - Set `start: "top top"`, `end: "+=1200vh"`, and `scrub: 1`.
   - In `onUpdate(self)`, compute delta X (`card.endTranslateX * self.progress`) and rotation (`card.rotate * self.progress * 2`).
   - Execute `gsap.to(card.id, { x: ..., rotate: ..., duration: 0.5, ease: "power3.out" })`.

### Completion Gate
- [ ] Horizontal wrapper pins firmly upon reaching top of viewport.
- [ ] Wrapper translates across X axis smoothly with scrub interpolation.
- [ ] Cards move at distinct speeds creating multi-layer depth.
- [ ] Scroll releases cleanly into the outro section upon scrub completion.
```

---

### `references/terminology.md`

```markdown
# Terminology

**Pinning**:
Locking a target element in the viewport during scroll while creating virtual scroll track space.
_Avoid_: sticky positioning, fixed hijacking

**Scrub**:
Linking the playhead progress of an animation directly to the scrollbar scroll position.
_Avoid_: scroll listener, scroll trigger callback

**Differential Parallax**:
Applying differing translation speeds and rotational deltas to child elements within a moving parent track to simulate visual depth.
_Avoid_: background parallax, standard parallax

**Scroll Track**:
The total vertical scroll height assigned to a parent element (`1200vh`) used to drive scrubbed timelines.
_Avoid_: document height, scroll distance
```

---

### `references/examples.md`

```markdown
# Implementation Examples

## Example 1: Full Implementation Template

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const cards = [
    { id: "#card-1", endTranslateX: -2000, rotate: 45 },
    { id: "#card-2", endTranslateX: -1000, rotate: -30 },
    { id: "#card-3", endTranslateX: -2000, rotate: 45 },
    { id: "#card-4", endTranslateX: -1500, rotate: -30 },
  ];

  // 1. Primary Track Pinned Horizontal Scroll
  ScrollTrigger.create({
    trigger: ".wrapper-404",
    start: "top top",
    end: "+=900vh",
    scrub: 1,
    pin: true,
    onUpdate: (self) => {
      gsap.to(".wrapper-404", {
        x: `${-350 * self.progress}vw`,
        duration: 0.5,
        ease: "power3.out",
      });
    },
  });

  // 2. Differential Parallax on Child Cards
  cards.forEach((card) => {
    ScrollTrigger.create({
      trigger: card.id,
      start: "top top",
      end: "+=1200vh",
      scrub: 1,
      onUpdate: (self) => {
        gsap.to(card.id, {
          x: `${card.endTranslateX * self.progress}px`,
          rotate: `${card.rotate * self.progress * 2}`,
          duration: 0.5,
          ease: "power3.out",
        });
      },
    });
  });
});
```
```

---

# Phase 5: Validation & Verification

1. **Source Fidelity Check**:
   - Layout architecture (Container `1200vh`, Wrapper `400vw`, Outro `150vh`) matched.
   - GSAP ScrollTrigger creation with `pin: true`, `scrub: 1`, `power3.out` easing matched.
   - Distinct X-translation and rotational multipliers per card matched.
2. **Operational Coverage**:
   - Scenario A: 404 Error page animation with floating photography.
   - Scenario B: Creative portfolio case study horizontal showcase.
   - Scenario C: Storytelling timeline with differential foreground cards.
3. **Known Limitations**:
   - Hardcoded translations require manual adjustment if wrapper width is altered from `400vw`.
