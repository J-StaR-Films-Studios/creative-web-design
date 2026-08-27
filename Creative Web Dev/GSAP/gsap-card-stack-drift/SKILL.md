---
name: gsap-card-stack-drift
description: |
  Implement high-performance scroll-driven card stacking with organic diagonal drift animations using GSAP, ScrollTrigger, and Lenis.
  Triggers: card stacking animation, scroll-driven cards, diagonal drift cards, GSAP stacked cards, Lenis scrollTrigger cards, sticky card deck animation.
---

# GSAP Card Stack & Diagonal Drift Animation

Engineers a smooth, scroll-driven interactive card deck where cards rise sequentially from off-screen, stack in the center with organic rotations, and drift diagonally upwards-left to reveal subsequent cards.

## Principles & Invariants

1. **Ticker Unification**: Lenis smooth scroll must drive the GSAP ticker with `lagSmoothing(0)` to prevent frame mismatch and jitter.
2. **Absolute Center Anchoring**: All stackable cards share an identical anchor (`top: 50%; left: 50%; transform: translate(-50%, -50%)`).
3. **Zero-Duration Updates**: All continuous scroll transformations inside `onUpdate` must apply via `gsap.to(element, { duration: 0, ease: "none" })` to ensure 1:1 hardware scroll binding.
4. **Terminal Card Retention**: The last card in the stack must never execute diagonal exit drift.

For technical domain concepts and terminology, see [terminology.md](references/terminology.md).

---

## Phase 1: DOM & CSS Layout Setup

Establish the coordinate space and stack layering.

1. **Construct Container and Cards**:
   - Wrap all cards in a container (`.sticky-cards`).
   - Give each `.card` an inner media wrapper (`.card-img`) and text container (`.card-content`).

2. **Define Styles**:
   - Set `.sticky-cards` to `position: relative; width: 100vw; height: 100vh; overflow: hidden;`.
   - Set `.card` to:
     ```css
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     will-change: transform;
     ```
   - Add media queries scaling max card width down for viewports `< 900px`.

### Completion Gate
- [ ] Container occupies `100vw` by `100vh` with hidden overflow.
- [ ] All `.card` elements center-aligned and stacked directly over each other.
- [ ] Hardware acceleration hint `will-change: transform` declared on cards.

---

## Phase 2: Engine Initialization & Ticker Hookup

Synchronize the smooth scrolling engine with GSAP's rendering cycles.

1. **Register Plugins**:
   ```javascript
   gsap.registerPlugin(ScrollTrigger);
   ```

2. **Initialize Lenis and Bind Ticker**:
   ```javascript
   const lenis = new Lenis();
   lenis.on("scroll", ScrollTrigger.update);

   gsap.ticker.add((time) => {
     lenis.raf(time * 1000);
   });
   gsap.ticker.lagSmoothing(0);
   ```

### Completion Gate
- [ ] Lenis instance initialized.
- [ ] `ScrollTrigger.update` called on Lenis scroll events.
- [ ] `gsap.ticker.lagSmoothing(0)` active.

---

## Phase 3: Initial Card State & Rotation Staging

Set initial off-screen positioning and rotation offsets.

1. **Collect Elements & Define Angles**:
   ```javascript
   const cards = gsap.utils.toArray(".card");
   const rotations = [-1, 3, -5, 5, -2]; // Custom organic angles per card index
   ```

2. **Stage Initial Off-Screen Coordinates**:
   ```javascript
   cards.forEach((card, index) => {
     gsap.set(card, {
       rotate: rotations[index] || 0,
       y: window.innerHeight,
       x: 0
     });
   });
   ```

### Completion Gate
- [ ] Cards converted to an array.
- [ ] Each card initialized at `y = window.innerHeight` with distinct rotation angle.

---

## Phase 4: ScrollTrigger Track Configuration

Establish the pinning duration and scrub timing.

1. **Instantiate ScrollTrigger**:
   ```javascript
   ScrollTrigger.create({
     trigger: ".sticky-cards",
     start: "top top",
     end: "+=" + (window.innerHeight * 4) + "px",
     pin: true,
     pinSpacing: true,
     scrub: 1,
     onUpdate: (self) => updateCardPositions(self.progress, cards)
   });
   ```

### Completion Gate
- [ ] Section pins when top hits viewport top.
- [ ] Pin duration set to proportional height multiplier (e.g. `innerHeight * 4`).
- [ ] `scrub: 1` enabled for smooth inertia response.
