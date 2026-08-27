# Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / tutorial transcript |
| **Title** | Split-Card Scroll Animation with GSAP, ScrollTrigger, and Lenis (Codegrid / Redo Media Recreation) |
| **Authority** | Codegrid (Web animation & creative front-end engineering specialist) |
| **Coverage** | Multi-phase scroll-driven image-to-card splitting and 3D flipping, Lenis smooth scrolling integration, GSAP timeline scrubbing via `onUpdate` with state flags, responsive breakpoint strategy using `gsap.matchMedia`, image asset slicing mathematics. |

### Coverage Gaps Identified
- Server-side rendering (SSR) / framework hydration specifics (Next.js/Nuxt) are not detailed; the source covers vanilla modern ES module JavaScript with bundler/CDN imports.
- Dynamic card counts (e.g., arbitrary $N$ cards) beyond 3 cards are not explicitly parameterized in the video, though the logic generalizes.

---

# Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
source: src-01

knowledge_units:
  # CONCEPTS
  - id: ku-001
    type: concept
    name: Sliced Image Panel Technique
    source: src-01, "01:23 - 02:39"
    confidence: high
    definition: >
      A performance and layout pattern where a single hero image is pre-sliced into N equal 
      vertical aspect-ratio crops rather than dynamically calculated with CSS background offsets.
    attributes: [aspect-ratio matching, zero CSS background drift, seamless initial state]
    avoid_terms: [CSS background shifting, image masking hacks]

  - id: ku-002
    type: concept
    name: State-Guarded Scroll Scrubbing
    source: src-01, "09:20 - 09:45, 14:35 - 15:55"
    confidence: high
    definition: >
      A pattern pairing continuous continuous-scrub mapping with discrete one-shot tween triggers 
      guarded by boolean completion flags inside a ScrollTrigger onUpdate callback.
    attributes: [idempotence, bidirectional reversal, prevents tween recreation per tick]
    avoid_terms: [stateless onUpdate, raw tick triggers]

  - id: ku-003
    type: concept
    name: 3D Preserve Card Container
    source: src-01, "05:40 - 06:40"
    confidence: high
    definition: >
      A CSS 3D rendering context where parent perspective and child preserve-3d allow paired 
      front/back elements with hidden backface visibility to flip 180 degrees.
    attributes: [perspective, preserve-3d, backface-visibility, transform-origin: top]
    avoid_terms: [2D flip emulation, opacity swap]

  # PRINCIPLES
  - id: ku-010
    type: principle
    name: Normalized Scroll Segmentation
    source: src-01, "12:20 - 13:30"
    confidence: high
    statement: >
      Segment a single pinned scroll duration (0.0 to 1.0) into discrete chronological thresholds 
      using gsap.utils.mapRange for continuous interpolations and threshold bounds for discrete steps.
    rationale: >
      Prevents overlapping state collisions and ensures bidirectional scrub accuracy when scrolling 
      both forwards and backwards.

  - id: ku-011
    type: principle
    name: Desktop Pinning, Mobile Fallback
    source: src-01, "06:55 - 07:40, 11:00 - 11:35"
    confidence: high
    statement: >
      Complex spatial scroll transformations must be scoped exclusively to desktop screens via 
      gsap.matchMedia; mobile screens must gracefully degrade to vertical flow layout with animations disabled.
    rationale: >
      Complex 3D card expansions and pinning cause severe layout distortion and touch-scroll conflicts 
      on narrow mobile viewports.

  # PROCEDURES
  - id: ku-020
    type: procedure
    name: Aspect Ratio Asset Preparation
    source: src-01, "01:50 - 02:39"
    confidence: high
    goal: Generate seamless sliced image assets for multi-card split animation.
    steps:
      - action: Determine individual card aspect ratio (e.g., 5:7).
        criterion: Target card proportions defined.
      - action: Calculate total canvas dimension as (CardWidth * N) x CardHeight (e.g., 15:7 or 1500x700px for 3 cards).
        criterion: Canvas aspect ratio perfectly equals the sum of unspaced cards.
      - action: Place the hero graphic on the canvas and split into N equal vertical slices.
        criterion: N separate image files exported with identical heights and widths.
    outputs: [image assets with zero alignment offset]

  - id: ku-021
    type: procedure
    name: Scroll Lifecycle & Smooth-Scroll Initialization
    source: src-01, "08:10 - 09:05, 10:05 - 10:30"
    confidence: high
    goal: Bind Lenis smooth scroll to GSAP ticker and register ScrollTrigger plugin with resize debouncing.
    steps:
      - action: Register ScrollTrigger with gsap.
        criterion: gsap.registerPlugin(ScrollTrigger) executed.
      - action: Instantiate Lenis and bind its scroll listener to ScrollTrigger.update.
        criterion: Lenis update events propagate to ScrollTrigger.
      - action: Add Lenis requestAnimationFrame hook to gsap.ticker with lag smoothing disabled (0).
        criterion: GSAP ticker drives Lenis RAF loop synchronously.
      - action: Add a debounced window resize listener (250ms) that kills triggers and reinits.
        criterion: Layout and scroll distances recalculate cleanly on resize.
    outputs: [Synchronized smooth-scroll and animation ticker runtime]

  - id: ku-022
    type: procedure
    name: Choreograph Multi-Stage Split-Card Scrub Sequence
    source: src-01, "11:40 - 17:25"
    confidence: high
    goal: Implement progressive pinned scroll animation over 4 dynamic phases.
    steps:
      - action: Pin the sticky section over a multi-viewport scroll distance (e.g., window.innerHeight * 4).
        criterion: ScrollTrigger created with pin: true and scrub: 1.
      - action: Map progress [0.10, 0.25] to header translateY and opacity.
        criterion: Header slides up and fades in smoothly.
      - action: Map progress [0.00, 0.25] to card-container width expansion.
        criterion: Card container widens smoothly from compact to open width.
      - action: Trigger Gap and Border-Radius expansion at progress >= 0.35 with state flag.
        criterion: Flex gap widens from 0px to target gap and outer border-radii normalize; reverses on < 0.35.
      - action: Trigger 3D Y-Axis Flip with Z-rotation/Y-translation at progress >= 0.70 with state flag.
        criterion: Cards rotateY(180deg) with stagger; outer cards tilt and drop; reverses on < 0.70.
    outputs: [Fully interactive, reversible split-card scroll sequence]

  # CONSTRAINTS
  - id: ku-030
    type: constraint
    name: Backface Visibility & 3D Nesting
    source: src-01, "06:15 - 06:45"
    confidence: high
    rule: >
      Every .card must have `transform-style: preserve-3d`, and both `.card-front` and `.card-back` 
      must have `backface-visibility: hidden` and `position: absolute`. `.card-back` must have 
      initial `transform: rotateY(180deg)`.
    scope: CSS layout for 3D cards
    consequence: Cards flicker or show mirrored front content instead of revealing back content during flip.
    enforced_by: CSS declarations.

  - id: ku-031
    type: constraint
    name: Flag-Guarded State Idempotency
    source: src-01, "09:20 - 09:40, 15:10 - 15:55"
    confidence: high
    rule: >
      Do not invoke `gsap.to()` on discrete threshold actions without checking and setting a boolean flag.
    scope: JavaScript onUpdate callback
    consequence: Calling tweens every frame creates memory churn, interrupts in-flight easing, and breaks scrub stability.
    enforced_by: Boolean flags (`isGapAnimationCompleted`, `isFlipAnimationCompleted`).
```

---

# Phase 3: Methodology Synthesis

### Stage 1: Asset & Dimensional Geometry
- **INPUT**: 1 master hero image, target card count ($N=3$), target card aspect ratio (5:7).
- **STEPS**:
  1. Calculate master canvas ratio: $(N \times \text{width}) : \text{height} = 15:7$.
  2. Crop and slice canvas into $N$ equal vertical panels.
  3. Export slices (`card_cover_1.jpg`, `card_cover_2.jpg`, `card_cover_3.jpg`).
- **OUTPUT**: $N$ perfectly aligned raster assets.
- **VALIDATION**: Side-by-side unspaced assets visually recreate the original single image with zero seam lines.

### Stage 2: 3D DOM & CSS Construction
- **INPUT**: Sliced images, card copy, color palette.
- **STEPS**:
  1. Create 3 sections: `section.intro`, `section.sticky`, `section.outro`.
  2. In `section.sticky`, create `.sticky-header` (`h1`) and `.card-container`.
  3. Inside `.card-container`, create $N$ `.card` elements with `#card-1`..`#card-N`.
  4. In each `.card`, nest `.card-front` (`img`) and `.card-back` (`span.index`, `p.description`).
  5. Apply CSS: `.card-container` with `perspective: 1000px`, `.card` with `transform-style: preserve-3d` and un-split border radii on outer elements (`#card-1`: top-left/bottom-left; `#card-3`: top-right/bottom-right).
  6. Set `.card-front` and `.card-back` to `position: absolute`, `backface-visibility: hidden`. Set `.card-back` initial transform to `rotateY(180deg)`.
  7. Define `@media (max-width: 1000px)` breakpoint resetting flex directions to column, removing perspective/transforms, and restoring regular block flow.
- **OUTPUT**: CSS 3D structure ready for GSAP manipulation.
- **VALIDATION**: `.card-back` is completely hidden; cards placed at `gap: 0` visually form a unified single rounded panel.

### Stage 3: Scroll Runtime & Animation Choreography
- **INPUT**: GSAP, ScrollTrigger, Lenis libraries.
- **STEPS**:
  1. Register ScrollTrigger and configure Lenis smooth scroll ticker binding.
  2. Instantiate `gsap.matchMedia()`.
  3. In mobile query (`max-width: 999px`), reset inline styles on card elements and exit.
  4. In desktop query (`min-width: 1000px`), initialize completion flags: `isGapAnimationCompleted = false`, `isFlipAnimationCompleted = false`.
  5. Create pinned `ScrollTrigger` on `.sticky` spanning `+=400vh` scrubbed at `1` second.
  6. In `onUpdate(self)`:
     - Track `progress = self.progress`.
     - *Phase A (Header Slide/Fade)*: Interpolate between $0.10 \le \text{progress} \le 0.25$ via `gsap.utils.mapRange` to modulate `translateY(40px → 0px)` and `opacity(0 → 1)`.
     - *Phase B (Container Width)*: Interpolate between $0.00 \le \text{progress} \le 0.25$ to expand `.card-container` width (e.g. from initial width to 60%).
     - *Phase C (Split & Gap Expansion)*: If $\text{progress} \ge 0.35$ and `!isGapAnimationCompleted`, tween `gap: 20px` and uniform `border-radius: 20px`; set flag `true`. If $\text{progress} < 0.35$ and `isGapAnimationCompleted`, tween `gap: 0px` and restore outer border-radii; set flag `false`.
     - *Phase D (3D Card Flip & Spatial Fan)*: If $\text{progress} \ge 0.70$ and `!isFlipAnimationCompleted`, tween `.card` `rotateY(180deg)` with stagger ($0.1\text{s}$), tween outer cards `#card-1` ($y: 30, \text{rotateZ}: -15^\circ$) and `#card-3` ($y: 30, \text{rotateZ}: 15^\circ$); set flag `true`. If $\text{progress} < 0.70$ and `isFlipAnimationCompleted`, reverse card rotations to $0^\circ$ and outer offsets with reversed stagger; set flag `false`.
  7. Bind debounced `resize` handler to re-run trigger calculations.
- **OUTPUT**: Complete, reversible split-card scroll experience.
- **VALIDATION**: Forward scroll expands, splits, and flips cards with fan tilt; reverse scroll seamlessly packs cards back into a single unspaced hero image.

---

# Phase 4: Skill Compilation

```
split-card-scroll-animation/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── examples.md
    └── gsap-scroll-recipes.md
```

### `split-card-scroll-animation/SKILL.md`

```markdown
---
name: split-card-scroll-animation
description: |
  Construct a high-end scroll-driven split-card expansion and 3D flip animation sequence using GSAP, 
  ScrollTrigger, Lenis, and modern CSS 3D transforms.
  Triggers: split card animation, scroll driven card flip, gsap image to cards split, redo media scroll animation, 
  image slice scroll animation, 3D card flip scroll.
---

# Split-Card Scroll Animation

Build a scroll-driven hero sequence where a single unified image scales in, splits into distinct aspect-ratio panels via flexbox gap/radius transitions, and performs a 3D flip revealing content cards with spatial fan-out tilts.

## Architecture Overview

```
[Pinned Viewport Container (400vh)]
   ├── Progress 0.00 - 0.25: Container expands width; Sticky Header translates Y & fades in
   ├── Progress 0.35: Gap expands (0px → 20px); Border radius normalizes (Unified → Individual)
   └── Progress 0.70: 3D Flip (rotateY 0° → 180°); Outer cards tilt (rotateZ ±15°) & drop (Y +30px)
```

For domain terms and structural constraints, see [terminology.md](references/terminology.md).

---

## Phase 1: Asset Preparation & Ratio Slicing

1. Define target card aspect ratio (e.g., $5:7$).
2. Compute combined master canvas dimensions for $N$ cards without spacing:
   $$\text{Canvas Width} = N \times \text{Card Width}, \quad \text{Canvas Height} = \text{Card Height}$$
   *(Example: 3 cards @ $5:7 \implies 15:7$ ratio, e.g., $1500\text{px} \times 700\text{px}$).*
3. Place master artwork across the canvas in your design tool and slice into $N$ equal vertical sections.
4. Export slices as individual image assets (`card_cover_1.jpg`, `card_cover_2.jpg`, `card_cover_3.jpg`).

### Completion gate
- [ ] $N$ slices exported with identical pixel dimensions.
- [ ] Unspaced side-by-side placement of all slices forms the continuous original image with zero seams.

---

## Phase 2: HTML & 3D CSS Layout

1. Build 3 sequential document sections:
   - `section.intro` (100vh spacer)
   - `section.sticky` (pinned animation container)
   - `section.outro` (100vh spacer)
2. Inside `section.sticky`, construct `.sticky-header` with an `h1` and `.card-container` containing $N$ `.card` elements (`#card-1` through `#card-N`).
3. Structure each `.card` with dual faces:
   ```html
   <div class="card" id="card-1">
     <div class="card-front"><img src="card_cover_1.jpg" alt="..." /></div>
     <div class="card-back"><span>01 / 03</span><p>Card Content</p></div>
   </div>
   ```
4. Style 3D context in CSS:
   - `.card-container`: `display: flex`, `perspective: 1000px`, `transform: translateY(40px)`, `will-change: width`.
   - `.card`: `flex: 1`, `aspect-ratio: 5 / 7`, `transform-style: preserve-3d`, `transform-origin: top`.
   - Outer border-radii on un-split state: `#card-1` (`20px 0 0 20px`), `#card-3` (`0 20px 20px 0`), `#card-2` (`0px`).
   - `.card-front`, `.card-back`: `position: absolute`, `width: 100%`, `height: 100%`, `backface-visibility: hidden`, `border-radius: inherit`, `overflow: hidden`.
   - `.card-back`: `transform: rotateY(180deg)`.
5. Establish responsive degradation in `@media (max-width: 1000px)`:
   - Convert `.sticky` and `.card-container` to `flex-direction: column`.
   - Reset `transform: none`, `perspective: none`, and set standard `gap` and `border-radius: 20px !important`.

### Completion gate
- [ ] Back faces are hidden by default; no mirroring or DOM overlap artifacts.
- [ ] Side-by-side un-split cards display seamless full artwork with rounded outer borders.
- [ ] Mobile breakpoint displays readable vertical column with transforms deactivated.

---

## Phase 3: Runtime Synchronization & State-Guarded GSAP

For code recipes and ScrollTrigger configurations, see [gsap-scroll-recipes.md](references/gsap-scroll-recipes.md).

1. Import and register dependencies:
   ```javascript
   import gsap from "gsap";
   import ScrollTrigger from "gsap/ScrollTrigger";
   import Lenis from "lenis";

   gsap.registerPlugin(ScrollTrigger);
   ```
2. Initialize Lenis smooth scroll and synchronize with the GSAP ticker:
   ```javascript
   const lenis = new Lenis();
   lenis.on("scroll", ScrollTrigger.update);
   gsap.ticker.add((time) => lenis.raf(time * 1000));
   gsap.ticker.lagSmoothing(0);
   ```
3. Instantiate `gsap.matchMedia()` and declare boolean state flags for desktop (`min-width: 1000px`):
   ```javascript
   let isGapAnimationCompleted = false;
   let isFlipAnimationCompleted = false;
   ```
4. Create pinned `ScrollTrigger`:
   - `trigger`: `".sticky"`
   - `start`: `"top top"`
   - `end`: `() => "+=" + (window.innerHeight * 4) + "px"`
   - `pin`: `true`
   - `scrub`: `1`
5. Implement state-guarded `onUpdate(self)` handler:
   - **Header & Width Scrub (Progress 0.00 – 0.25)**:
     Use `gsap.utils.mapRange` to linearly interpolate header translateY/opacity and container width.
   - **Split & Gap Trigger (Threshold 0.35)**:
     - If `progress >= 0.35 && !isGapAnimationCompleted`: Tween `.card-container` `gap` to `20px` and all `.card` elements `borderRadius` to `20px` (duration `0.5s`, ease `power3.out`). Set `isGapAnimationCompleted = true`.
     - Else if `progress < 0.35 && isGapAnimationCompleted`: Tween `gap` to `0px` and restore specific outer border radii. Set `isGapAnimationCompleted = false`.
   - **3D Flip & Spatial Tilt Trigger (Threshold 0.70)**:
     - If `progress >= 0.70 && !isFlipAnimationCompleted`: Tween `.card` `rotationY: 180` (duration `0.75s`, stagger `0.1s`). Tween `#card-1` (`y: 30, rotationZ: -15`) and `#card-3` (`y: 30, rotationZ: 15`). Set `isFlipAnimationCompleted = true`.
     - Else if `progress < 0.70 && isFlipAnimationCompleted`: Tween `.card` `rotationY: 0` with reverse stagger (`stagger: -0.1`). Tween outer cards `y: 0, rotationZ: 0`. Set `isFlipAnimationCompleted = false`.
6. Attach a 250ms debounced window `resize` event listener that kills active triggers and re-executes initialization.

### Completion gate
- [ ] Forward and backward scrolling smoothly executes all 4 phases without tween thrashing.
- [ ] Rapid scrubbing maintains flag integrity and does not leave cards partially rotated or offset.
- [ ] Resizing the browser recalibrates pinning bounds cleanly.

---

## Phase 4: Validation & Tuning

For complete before-and-after implementation patterns, see [examples.md](references/examples.md).

1. Validate scroll smoothness with Lenis enabled vs native wheel scroll.
2. Confirm 3D depth perspective ($1000\text{px}$) does not clip through viewport bounds on standard displays.
3. Test edge-case directional reversal at progress thresholds ($0.34 \leftrightarrow 0.36$ and $0.69 \leftrightarrow 0.71$).

**Output**: Production-ready, fully responsive split-card 3D scroll interaction.
```

---

### `split-card-scroll-animation/references/terminology.md`

```markdown
# Terminology & Constraints

**Aspect Ratio Canvas Slicing**:
The process of dividing a single master graphic into $N$ equal vertical raster slices whose combined widths match the master aspect ratio.
_Avoid_: CSS background position shifting, dynamic clip-path masks.

**State-Guarded Scrubbing**:
Combining continuous scroll position mapping with discrete threshold-triggered GSAP tweens protected by boolean flags.
_Avoid_: Triggering unconditional `gsap.to()` tweens inside an `onUpdate` tick.

**Preserve-3D Stacking**:
A CSS rendering configuration where children of an element exist in shared 3D space (`transform-style: preserve-3d`) enabling 180-degree backface concealment (`backface-visibility: hidden`).
_Avoid_: Opacity fading to emulate 3D flipping, flat 2D layer swaps.

**Lag Smoothing**:
A GSAP setting that prevents jumps when the CPU lags. Set to `0` when using Lenis so smooth-scroll ticker deltas remain strictly synchronized.
_Avoid_: Default lag smoothing with virtual scroll engines.
```

---

### `split-card-scroll-animation/references/examples.md`

```markdown
# Examples & Implementation Reference

## Full Desktop ScrollTrigger Implementation

**Scenario**: 3-card split sequence with a 15:7 sliced hero graphic and sticky header.

```javascript
mm.add("(min-width: 1000px)", () => {
  let isGapAnimationCompleted = false;
  let isFlipAnimationCompleted = false;

  ScrollTrigger.create({
    trigger: ".sticky",
    start: "top top",
    end: () => "+=" + (window.innerHeight * 4) + "px",
    scrub: 1,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      const progress = self.progress;

      // 1. Header Animation (0.10 to 0.25)
      if (progress >= 0.1 && progress <= 0.25) {
        const headerProgress = gsap.utils.mapRange(0.1, 0.25, 0, 1, progress);
        const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
        const opacityValue = gsap.utils.mapRange(0, 1, 0, 1, headerProgress);
        gsap.set(stickyHeader, { y: yValue, opacity: opacityValue });
      } else if (progress < 0.1) {
        gsap.set(stickyHeader, { y: 40, opacity: 0 });
      } else if (progress > 0.25) {
        gsap.set(stickyHeader, { y: 0, opacity: 1 });
      }

      // 2. Container Width Scrub (0.00 to 0.25)
      if (progress <= 0.25) {
        const widthPercentage = gsap.utils.mapRange(0, 0.25, 75, 60, progress);
        gsap.set(cardContainer, { width: `${widthPercentage}%` });
      } else {
        gsap.set(cardContainer, { width: "60%" });
      }

      // 3. Gap & Border Radius Split (Threshold 0.35)
      if (progress >= 0.35 && !isGapAnimationCompleted) {
        gsap.to(cardContainer, { gap: "20px", duration: 0.5, ease: "power3.out" });
        gsap.to(["#card-1", "#card-2", "#card-3"], {
          borderRadius: "20px",
          duration: 0.5,
          ease: "power3.out",
        });
        isGapAnimationCompleted = true;
      } else if (progress < 0.35 && isGapAnimationCompleted) {
        gsap.to(cardContainer, { gap: "0px", duration: 0.5, ease: "power3.out" });
        gsap.to("#card-1", { borderRadius: "20px 0 0 20px", duration: 0.5, ease: "power3.out" });
        gsap.to("#card-2", { borderRadius: "0px", duration: 0.5, ease: "power3.out" });
        gsap.to("#card-3", { borderRadius: "0 20px 20px 0", duration: 0.5, ease: "power3.out" });
        isGapAnimationCompleted = false;
      }

      // 4. 3D Card Flip & Fan Out (Threshold 0.70)
      if (progress >= 0.7 && !isFlipAnimationCompleted) {
        gsap.to(".card", {
          rotationY: 180,
          duration: 0.75,
          ease: "power3.inOut",
          stagger: 0.1,
        });
        gsap.to(["#card-1", "#card-3"], {
          y: 30,
          rotationZ: (i) => [-15, 15][i],
          duration: 0.75,
          ease: "power3.inOut",
        });
        isFlipAnimationCompleted = true;
      } else if (progress < 0.7 && isFlipAnimationCompleted) {
        gsap.to(".card", {
          rotationY: 0,
          duration: 0.75,
          ease: "power3.inOut",
          stagger: -0.1,
        });
        gsap.to(["#card-1", "#card-3"], {
          y: 0,
          rotationZ: 0,
          duration: 0.75,
          ease: "power3.inOut",
        });
        isFlipAnimationCompleted = false;
      }
    },
  });
});
```
```

---

### `split-card-scroll-animation/references/gsap-scroll-recipes.md`

```markdown
# GSAP & Lenis Scroll Recipes

## 1. Lenis + GSAP Ticker Connection
```javascript
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

## 2. Linear Interpolation via `mapRange`
Convert sub-progress ranges to bounded CSS values:
```javascript
// Map progress from [0.10, 0.25] down to [40px, 0px]
const yOffset = gsap.utils.mapRange(0.10, 0.25, 40, 0, currentProgress);
```

## 3. Debounced Trigger Recalculation
Prevent layout shift bugs during window resize:
```javascript
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initAnimations();
  }, 250);
});
```
```

---

# Phase 5: Validation

### 1. Source Fidelity Verification
- Sliced Image Asset ratio mathematics (5:7 per card $\rightarrow$ 15:7 canvas) $\rightarrow$ Encoded in Phase 1 & `terminology.md`.
- HTML structure with dual `.card-front`/`.card-back` and CSS 3D configuration $\rightarrow$ Encoded in Phase 2.
- GSAP + ScrollTrigger + Lenis lifecycle with `lagSmoothing(0)` $\rightarrow$ Encoded in Phase 3 & `gsap-scroll-recipes.md`.
- State-guarded `isGapAnimationCompleted` and `isFlipAnimationCompleted` flags $\rightarrow$ Encoded in Phase 3 & `examples.md`.
- Multi-phase threshold choreography (Header 0.10–0.25, Width 0.00–0.25, Gap 0.35, Flip 0.70) $\rightarrow$ Fully preserved with exact easing parameters (`power3.out`, `power3.inOut`).
- Responsive degradation strategy with `gsap.matchMedia` $\rightarrow$ Encoded in Phase 2 & Phase 3.

### 2. Operational Coverage Walkthrough
- **Scenario A (Rapid bi-directional scroll)**: User scrolls forward fast and snaps back. State flags prevent mid-flight tween collision and reset `.card` rotation and outer `border-radius` to exact original values.
- **Scenario B (Mobile screen access)**: Viewport width $<1000\text{px}$ matches media query fallback; GSAP trigger logic skips execution, card layout converts to standard column flow.
- **Scenario C (Window resize mid-scroll)**: Debounced resize handler kills all ScrollTriggers (`ScrollTrigger.getAll().forEach(t => t.kill())`) and resets Lenis/trigger offsets cleanly.

---

# Delivery Package Summary

1. **Compiled Skill Directory**: Complete `split-card-scroll-animation/` package with `SKILL.md` (under 500 lines), `references/terminology.md`, `references/examples.md`, and `references/gsap-scroll-recipes.md`.
2. **Knowledge Extraction Summary**: 3 Concepts (`ku-001`–`ku-003`), 2 Principles (`ku-010`–`ku-011`), 3 Procedures (`ku-020`–`ku-022`), 2 Constraints (`ku-030`–`ku-031`).
3. **Known Limitations**: Optimized for 3 cards; arbitrary $N$ cards require dynamic aspect ratio calculation in Phase 1 and dynamic rotation index mapping in Phase 3.
