---
name: gsap-web-animation
description: |
  Architect, build, and debug high-performance web animations using GreenSock Animation Platform (GSAP v3).
  Use when designing interactive UI animations, scroll-driven web experiences, kinetic typography, 
  timeline choreography, SVG clipping/morphing, smooth scrolling, or anchor navigation.
  Triggers: gsap, web animation, scroll trigger, scroll animation, greensock, smooth scroll, ui animation, parallax effect.
---

# GSAP Web Animation

Construct smooth, cross-browser web animations using GSAP v3 core methods, timelines, and specialized plugins (ScrollTrigger, ScrollTo, ScrollSmoother, EasePack).

## Core Principles

- **Performance-First Transforms**: Animate CSS transforms (`x`, `y`, `scale`, `rotation`, `skew`) and `autoAlpha`/`opacity` instead of layout properties (`left`, `top`, `width`, `height`, `margin`) to prevent layout recalculation and repaint costs.
- **Synchronized DOM Lifecycle**: Always instantiate animations inside a `DOMContentLoaded` event listener or frontend framework mount hook (`useEffect`, `onMounted`).
- **Single Timeline Authority**: Sequence complex or dependent multi-step animations in a single `gsap.timeline()` rather than managing manual `delay` math across disconnected tweens.
- **Intentional UX**: Provide visual feedback and interface orientation. Keep durations between `0.2s` and `1.2s` for standard micro-interactions; use longer durations primarily for scroll-scrubbed sequences.

---

## Phase 1: Environment Setup & Plugin Registration

Load the GSAP core library and required plugins via CDN, NPM, or bundle imports.

1. **Include GSAP Core and Plugins**:
   - For CDN scripts, include `gsap.min.js` before all plugin scripts.
   - For NPM/ES modules:
     ```javascript
     import { gsap } from "gsap";
     import { ScrollTrigger } from "gsap/ScrollTrigger";
     import { ScrollToPlugin } from "gsap/ScrollToPlugin";
     import { ScrollSmoother } from "gsap/ScrollSmoother";
     ```
2. **Register Plugins**:
   Explicitly register all imported plugins before invoking any animation:
   ```javascript
   gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother);
   ```
3. **Mount Protection**:
   Wrap vanilla JavaScript initialization in a lifecycle listener:
   ```javascript
   document.addEventListener("DOMContentLoaded", () => {
     // Animation logic here
   });
   ```

### Completion Gate
- [ ] GSAP core and target plugin scripts are correctly referenced.
- [ ] `gsap.registerPlugin(...)` called before any tween or timeline instantiation.
- [ ] DOM is fully parsed prior to selector querying.

---

## Phase 2: Tween Construction (`to`, `from`, `fromTo`)

Select the appropriate tween method based on the relationship between CSS initial values and desired target values.

For standard CSS property shorthands, consult [terminology.md](references/terminology.md).

### Method Selection Rule
- Use `gsap.to(target, vars)` when the element starts at its native CSS layout state and animates **TO** a new state.
- Use `gsap.from(target, vars)` when the element should start from an offset/hidden state and animate **BACK TO** its native CSS state.
- Use `gsap.fromTo(target, fromVars, toVars)` when you must explicitly enforce both arbitrary starting values and arbitrary ending values independent of stylesheet defaults.

### Syntax Rules
```javascript
// gsap.to example
gsap.to(".card", {
  x: 100,
  autoAlpha: 1,
  duration: 0.8,
  ease: "power2.out"
});

// gsap.from example
gsap.from(".hero-title", {
  y: 60,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

// gsap.fromTo example (duration & ease go in toVars)
gsap.fromTo(".badge", 
  { scale: 0, rotation: -45 }, 
  { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" }
);
```

### Completion Gate
- [ ] Method selected matches the CSS declaration model (`to`, `from`, or `fromTo`).
- [ ] Duration and ease parameters are defined inside the final `vars` configuration.
- [ ] Target selectors uniquely match intended DOM elements.

---

## Phase 3: Timeline Sequencing & Playback Controls

Sequence multiple animations and attach interactive controls without manual delay tracking.

1. **Instantiate Timeline**:
   ```javascript
   const tl = gsap.timeline({
     paused: false,
     defaults: { duration: 0.6, ease: "power2.out" }
   });
   ```
2. **Chain Tweens & Position Parameters**:
   - **Direct Sequence**: `.to(...)` runs immediately after the preceding tween finishes.
   - **Simultaneous Alignment (Labels)**: Passing identical string labels runs tweens together:
     ```javascript
     tl.to(".box", { x: 200 }, "sync")
       .to(".circle", { scale: 1.5 }, "sync");
     ```
   - **Relative Offset**:
     - `"<"`: Starts at the same time as the previous tween.
     - `"-=0.5"`: Overlaps previous tween by 0.5 seconds.
     - `"+=1"`: Inserts a 1-second gap before running.
3. **Bind UI Controls**:
   ```javascript
   document.querySelector("#playBtn").addEventListener("click", () => tl.play());
   document.querySelector("#pauseBtn").addEventListener("click", () => tl.pause());
   document.querySelector("#reverseBtn").addEventListener("click", () => tl.reverse());
   document.querySelector("#restartBtn").addEventListener("click", () => tl.restart());
   ```

### Completion Gate
- [ ] No hardcoded manual arithmetic used for sequence timing.
- [ ] Position parameters (`<`, labels, offsets) orchestrate overlapping actions.
- [ ] Global timeline defaults configured to avoid redundant tween declarations.

---

## Phase 4: Easing, Loops, and Staggering

Calibrate physics, repetitive movement, and multi-element grid animations.

### Easing Selection
- **Smooth Entry/Exit**: `"power1.out"`, `"power2.out"`, `"power3.out"`, `"power4.out"`.
- **Spring/Bounce**: `"bounce.out"`, `"elastic.out(1, 0.3)"`, `"back.out(1.7)"`.
- **Linear/Custom**: `"none"`, `"slow(0.7, 0.7, false)"`.
- For ease visual curves and plugins, see [plugins-guide.md](references/plugins-guide.md).

### Looping and Oscillations
```javascript
gsap.to(".ball", {
  y: -200,
  duration: 1,
  ease: "power1.inOut",
  repeat: -1, // Infinite loop (-1) or positive integer (e.g. 2 for 3 total plays)
  yoyo: true  // Alternates forward and backward
});
```

### Staggered Grid Orchestration
Animate arrays of elements sequentially or from a specific origin point:
```javascript
gsap.from(".skill-chip", {
  opacity: 0,
  y: 30,
  filter: "blur(5px)",
  duration: 0.8,
  stagger: {
    amount: 1.2,          // Total time distributed across all items
    grid: [3, 3],         // [rows, columns]
    from: "center",       // "start" | "end" | "center" | "edges" | "random"
    axis: "x"             // "x" | "y" (staggers along axis)
  }
});
```

### Completion Gate
- [ ] Appropriate ease assigned to match material physics.
- [ ] `yoyo: true` paired with `repeat >= 1` or `repeat: -1`.
- [ ] Stagger configured with either numeric seconds or advanced grid object.
