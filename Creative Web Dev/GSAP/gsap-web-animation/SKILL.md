---
name: gsap-web-animation
description: |
  Construct, choreograph, and debug high-performance web animations using GSAP 3 (GreenSock Animation Platform).
  Use when: creating DOM tweens (to, from, fromTo, set), building multi-step timelines,
  controlling playback (play, pause, restart), implementing stagger effects, or configuring
  scroll-driven animations with ScrollTrigger (pinning, scrubbing, toggleActions).
  Triggers: gsap, greensock, animate with gsap, scrolltrigger, scroll animation, gsap timeline, web animation.
---

# GSAP Web Animation

Construct reliable, hardware-accelerated web animations with GSAP 3 and ScrollTrigger.

## Workflow

```
Script Setup → Select Tween Method → Choreograph / Timeline → Control & Scroll Binding → Validate
```

---

## Phase 1: Environment & Plugin Registration

1. Include the GSAP 3 Core library and any required plugin scripts (e.g., ScrollTrigger) before your custom scripts:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
   ```
2. Register external plugins at the top of your JavaScript file before any animation code:
   ```javascript
   gsap.registerPlugin(ScrollTrigger);
   ```

### Completion Gate
- [ ] GSAP script loads before custom JavaScript execution.
- [ ] All external plugins are registered via `gsap.registerPlugin()`.

---

## Phase 2: Tween Construction & State Definition

Select the appropriate method based on the starting and ending state requirements:

| Method | When to Use | Syntax Signature |
|---|---|---|
| `gsap.to()` | Animate from current CSS values to new values | `gsap.to(target, { vars })` |
| `gsap.from()` | Animate from specified values to current CSS values | `gsap.from(target, { vars })` |
| `gsap.fromTo()` | Animate between two explicitly defined states | `gsap.fromTo(target, { fromVars }, { toVars })` |
| `gsap.set()` | Immediately apply values with zero duration | `gsap.set(target, { vars })` |

### Tween Rules & Properties
1. **CamelCase Properties**: Convert all hyphenated CSS properties to camelCase (e.g., `backgroundColor`, `borderRadius`, `transformOrigin`).
2. **Transforms**: Use GSAP shorthand transforms (`x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY`, `skewX`, `skewY`) instead of CSS strings.
3. **Timing Placement in `fromTo`**: Place `duration`, `ease`, `repeat`, and `yoyo` strictly inside the second object (`toVars`):
   ```javascript
   gsap.fromTo(".ball", { x: -500, opacity: 0 }, { x: 0, opacity: 1, duration: 2, ease: "power2.out" });
   ```
4. **Stagger**: When selecting multiple elements with one selector, offset their start times:
   ```javascript
   gsap.to(".card", { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 });
   ```
5. **Looping & Reversal**: Set `repeat: -1` for infinite loops, and `yoyo: true` to alternate direction smoothly.

For standard terms and property definitions, see [terminology.md](references/terminology.md).

### Completion Gate
- [ ] Multi-word CSS properties use camelCase formatting.
- [ ] In `gsap.fromTo()`, timing properties are located solely in the `toVars` parameter.
- [ ] Numeric pixel values are defined without string units (e.g., `x: 300`, not `x: "300px"`).

---

## Phase 3: Timeline Sequencing

Use `gsap.timeline()` when coordinating two or more tweens in sequence.

1. Instantiate the timeline container:
   ```javascript
   const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });
   ```
2. Chain tweens directly onto the timeline instance:
   ```javascript
   tl.from(".heading", { x: -200, opacity: 0 })
     .from(".paragraph", { x: 200, opacity: 0 })
     .from(".cta-button", { y: 50, opacity: 0 });
   ```
3. Do not use manual `delay` calculations to sequence animations.

For comprehensive code patterns and worked examples, see [examples.md](references/examples.md).

### Completion Gate
- [ ] Sequential animations are structured as chained timeline calls rather than manual delay offsets.
- [ ] Shared defaults (e.g., `duration`, `ease`) are placed in the timeline constructor.

---

## Phase 4: Playback Controls & User Interaction

To create interactive UI controls (play, pause, reverse, restart):

1. Store the tween or timeline instance in a variable:
   ```javascript
   const anim = gsap.to(".element", { rotation: 360, duration: 2, paused: true });
   ```
2. Bind control methods to DOM event listeners:
   ```javascript
   document.querySelector("#play-btn").addEventListener("click", () => anim.play());
   document.querySelector("#pause-btn").addEventListener("click", () => anim.pause());
   document.querySelector("#restart-btn").addEventListener("click", () => anim.restart());
   ```

### Completion Gate
- [ ] Animation instance reference is preserved in a accessible scope.
- [ ] UI triggers reliably toggle the corresponding animation state.
