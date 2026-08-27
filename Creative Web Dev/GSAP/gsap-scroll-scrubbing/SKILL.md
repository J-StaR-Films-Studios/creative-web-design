---
name: gsap-scroll-scrubbing
description: |
  Implement and optimize scroll-synchronized animations using GSAP ScrollTrigger's scrub property.
  Use when: creating interactive product tours, binding 3D models/rotations to scroll,
  building smooth viewport zoom/reveal effects, or creating path-following scroll indicators.
  Triggers: gsap scrub, scroll scrubbing, scroll trigger scrub, bind animation to scrollbar,
  smooth scroll animation gsap, interactive scroll progress.
---

# GSAP ScrollTrigger Scrubbing

Synchronize GSAP animation progress directly to viewport scroll position, providing lockstep bi-directional playback and momentum-based smoothing.

## Workflow Overview

```
Register Plugin → Configure Bounds → Define Tween → Apply Scrub (Boolean or Numeric) → Validate & Tune
```

---

## Phase 1: Scroll Boundary Calibration

Define the vertical/horizontal scroll window that dictates the animation playhead.

1. **Register the plugin**: Ensure `ScrollTrigger` is registered with GSAP before initializing tweens.
   ```javascript
   gsap.registerPlugin(ScrollTrigger);
   ```
2. **Define trigger element and bounds**: Set explicit `start` and `end` boundary positions.
   - Format: `"[element-edge] [viewport-edge]"` (e.g., `"top 80%"`, `"bottom 20%"`).
   - Use `markers: true` during development to visualize trigger planes.
3. **Calibrate scroll distance**: Adjust the gap between `start` and `end` to control perceived animation playback speed.
   - *Wider gap* $\rightarrow$ Slower, more deliberate progress per pixel scrolled.
   - *Narrower gap* $\rightarrow$ Faster, more responsive progress per pixel scrolled.

### Completion Gate
- [ ] `ScrollTrigger` registered without console warnings
- [ ] Trigger element exists in DOM
- [ ] `start` occurs before `end` in scroll sequence

---

## Phase 2: Scrub Mode Implementation

Attach the tween to the scroll position using either lockstep or inertial dampening.

For domain definitions and concepts, see [terminology.md](references/terminology.md).

### Mode A: Direct Lockstep Scrub (`scrub: true`)
Use when absolute 1:1 synchronization is required (e.g., technical diagrams, precise coordinate mapping).

```javascript
gsap.to(".target-element", {
  x: 500,
  rotation: 360,
  scrollTrigger: {
    trigger: ".target-element",
    start: "top 80%",
    end: "top 20%",
    scrub: true,
    markers: false
  }
});
```

### Mode B: Damped Inertial Scrub (`scrub: <number>`)
Use when natural momentum, fluidity, and smoothing are required (e.g., 3D object rotation, camera zooming, floating visual elements).

```javascript
gsap.to(".target-element", {
  x: 500,
  rotation: 360,
  scrollTrigger: {
    trigger: ".target-element",
    start: "top 80%",
    end: "top 20%",
    scrub: 1.5, // 1.5 seconds of catch-up smoothing
    markers: false
  }
});
```

### Scrub Tuning Heuristics
- **`0.5` – `1.0` seconds**: Snappy, modern interactive feel with subtle edge-softening.
- **`1.5` – `2.5` seconds**: Heavier, cinematic inertia; ideal for large imagery or 3D canvas objects.
- **`> 3.0` seconds**: Dreamy/floaty aesthetic; verify usability on fast mouse-wheel scrolls before keeping.

### Completion Gate
- [ ] `scrub` property assigned either `true` or a positive float/integer
- [ ] Redundant `toggleActions` removed (scrub overrides trigger action events)
- [ ] Animation moves forward on down-scroll and in reverse on up-scroll

---

## Phase 3: Validation & Interaction Audit

Verify the behavior under various scrolling inputs and screen constraints.

For real-world architectural patterns and case studies, see [examples.md](references/examples.md).

1. **Verify reverse playback**: Scroll upward past the start trigger to ensure the element restores its initial state without jump cuts.
2. **Inspect boundary clipping**: Check whether rapid scroll throws the playhead past bounds cleanly without getting stuck in intermediate tween states.
3. **Assess input device feel**: Test on both continuous-scroll devices (Mac trackpads, smooth touchscreens) and notched mouse wheels. If notched wheels cause jarring steps, increase numeric `scrub` smoothing value.

### Completion Gate
- [ ] Bi-directional playback functions cleanly
- [ ] No layout jitter or scroll lag on mobile/touch interfaces
- [ ] Debug `markers` set to `false` prior to production release
