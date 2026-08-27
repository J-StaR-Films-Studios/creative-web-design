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
