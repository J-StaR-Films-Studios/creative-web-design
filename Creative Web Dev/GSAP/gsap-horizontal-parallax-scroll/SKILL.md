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
