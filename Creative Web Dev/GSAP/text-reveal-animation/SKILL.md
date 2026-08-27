---
name: text-reveal-animation
description: |
  Implement high-performance, staggered character-level text reveal animations using
  SplitType, GSAP (GreenSock), and CSS clip-path masking.
  Use when building page-load headlines, animated logos, UI card hovers, or hero text reveals.
  Triggers: text reveal animation, split text animation, gsap text reveal, character stagger reveal,
  kinetic typography, clip-path text reveal.
---

# Text Reveal Animation

Implement staggered kinetic text reveals by splitting typography into discrete character nodes, masking the parent boundary via CSS `clip-path`, and animating character transforms using GSAP.

For domain terminology, see [terminology.md](references/terminology.md).
For complete implementation templates and variants, see [examples.md](references/examples.md).

## Phase 1: Environment & Markup Setup

Structure the target HTML element and import the required animation and splitting engines.

1. Create the semantic container element (`<h1>`, `<h2>`, or `<div>`) and assign a unique ID or selector.
2. Import GSAP 3 core and SplitType into your project runtime:
   - **CDN**:
     ```html
     <script src="https://unpkg.com/split-type"></script>
     <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.2/gsap.min.js"></script>
     ```
   - **NPM / ESM**:
     ```javascript
     import gsap from 'gsap';
     import SplitType from 'split-type';
     ```

### Completion gate
- [ ] Target element is defined in DOM with an explicit selector.
- [ ] `gsap` and `SplitType` are loaded without console errors.

---

## Phase 2: Parent Masking & Character Offsetting

Establish the clipping window and set the initial hidden state for character elements.

1. Apply a 4-point polygon clipping path to the parent text element:
   ```css
   .reveal-target {
     clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
     line-height: 0.85em; /* Calibrate tightly to cap-height */
   }
   ```
2. Define the starting translation on character elements:
   ```css
   .char {
     transform: translateY(115px);
     transition: transform 0.5s;
   }
   ```

### Decision Points:
- **Bottom-up Reveal**: Set `.char { transform: translateY(115px); }` (positive offset).
- **Top-down Reveal**: Set `.char { transform: translateY(-115px); }` (negative offset).
- **Custom Angular Reveal**: Adjust `clip-path: polygon(...)` coordinates to create angled masks.

### Completion gate
- [ ] Parent element has an active `clip-path` bounding box.
- [ ] Parent `line-height` is reduced to eliminate dead space between font and mask border.
- [ ] `.char` starting transform moves characters completely outside the clipping mask.

---

## Phase 3: Character Splitting & GSAP Execution

Segment text into individual character DOM nodes and trigger the staggered GSAP tween.

1. Instantiate `SplitType` on the target selector:
   ```javascript
   const textInstance = new SplitType('#target-element', { types: 'lines,words,chars' });
   ```
2. Trigger the GSAP tween targeting the generated `.char` class:
   ```javascript
   gsap.to('.char', {
     y: 0,
     stagger: 0.05,
     delay: 0.2,
     duration: 0.1,
     ease: 'power2.out'
   });
   ```

### Completion gate
- [ ] `SplitType` successfully inserts `.char` wrappers with `display: inline-block`.
- [ ] GSAP tween resets `y` translation to `0` in sequential order.
- [ ] Characters are visible only when inside the parent `clip-path` boundaries.
