---
name: gsap-web-animation
description: |
  Architect, construct, and optimize professional web animations using GreenSock Animation Platform (GSAP 3).
  Use when building interactive web animations, UI transitions, staggered component reveals,
  controllable playback sequences, and timeline-driven landing pages.
  Triggers: gsap animation, web animation, create tween, animate elements, gsap timeline,
  stagger animation, greensock animation, animate landing page.
---

# GSAP Web Animation

Construct high-performance, frame-accurate web animations using GSAP 3. This skill guides the complete workflow from environment initialization to tween construction, multi-element staggering, playback controls, and timeline orchestration.

## Ground Rules

1. **Seconds, Never Milliseconds**: Specify all `duration`, `delay`, and `stagger` values as numbers in seconds (e.g., `duration: 1.5`, not `1500` or `"1.5s"`).
2. **Transform Shorthands**: Use GSAP-optimized aliases (`x`, `y`, `scale`, `rotate`, `borderRadius`) instead of raw CSS `transform` strings.
3. **CamelCase Properties**: Map all CSS style keys to camelCase (e.g., `backgroundColor`, `borderBottomWidth`).
4. **Timelines Over Delays**: Never chain multi-step animations using cumulative `delay` values. Use `gsap.timeline()`.

For canonical terms and anti-synonyms, see [terminology.md](references/terminology.md).

---

## Phase 1: Environment Setup & Target Discovery

Load the GSAP core library and inspect target DOM structures.

1. Include GSAP 3 core via CDN script tag or package installation:
   - CDN: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>`
   - NPM: `npm install gsap` then `import { gsap } from "gsap";`
2. Inspect target DOM elements. Verify unique classes, IDs, or grouped selectors.
3. Establish whether elements need zero-duration initial state setup to prevent FOUC (Flash of Unstyled Content). Use `gsap.set()`:
   ```javascript
   gsap.set(".box", { opacity: 0, y: 50, scale: 0.8 });
   ```

### Completion Gate
- [ ] GSAP library accessible in the global scope or module bundle.
- [ ] Target elements queryable via CSS selectors.
- [ ] Initial off-screen or transparent states initialized without layout shifts.

---

## Phase 2: Tween Construction & State Control

Animate single or grouped targets using the appropriate tween method.

1. Select the tween method based on state requirements:
   - **`gsap.to(target, vars)`**: Animates from current state to destination values.
   - **`gsap.from(target, vars)`**: Animates from specified values to the element's natural CSS state.
   - **`gsap.fromTo(target, fromVars, toVars)`**: Explicitly defines both start and end states.
2. Define motion coordinates and visual properties in the vars object:
   ```javascript
   gsap.to(".circle", {
     x: 200,
     y: -50,
     backgroundColor: "#ff5722",
     borderRadius: "50%",
     duration: 1.5,
     ease: "power2.out"
   });
   ```
3. Configure animation repetition and alternation where needed:
   - Infinite loop: `repeat: -1`
   - Ping-pong alternation: `yoyo: true`
   - Repeat delay: `repeatDelay: 0.5`

For full easing options, curves, and visualizer parameters, see [easing-reference.md](references/easing-reference.md).

### Completion Gate
- [ ] Tween method matches lifecycle intent (`to`, `from`, or `fromTo`).
- [ ] Properties use camelCase and transform shorthands.
- [ ] Easing curve configured and verified.

---

## Phase 3: Staggered Multi-Element Animations

Animate multiple targets with distributed start times using the `stagger` property.

1. Target grouped elements with a shared class or selector query.
2. Apply simple numeric staggering for linear delays:
   ```javascript
   gsap.from(".card", {
     y: 100,
     opacity: 0,
     duration: 0.8,
     stagger: 0.15,
     ease: "power3.out"
   });
   ```
3. Use an advanced stagger configuration object for precise origin and grid control:
   ```javascript
   gsap.to(".grid-item", {
     scale: 1,
     opacity: 1,
     duration: 1,
     stagger: {
       amount: 1.5,         // Total duration distributed across all elements
       from: "center",      // Origin: "start", "center", "end", "edges", "random", or index
       grid: [4, 6],        // [rows, columns] for 2D coordinate calculation
       axis: "y",           // Stagger direction along a specific axis
       ease: "power1.inOut" // Distribution curve
     }
   });
   ```

### Completion Gate
- [ ] Multi-element selector matches 2+ nodes.
- [ ] Stagger property set as either numeric interval or advanced object.
- [ ] Origin point (`from`) anchors the visual focal point.

---

## Phase 4: Playback Control Implementation

Bind tweens and timelines to UI controls and user interaction events.

1. Assign the animation instance to a reference variable:
   ```javascript
   const tween = gsap.to(".hero-box", {
     x: 300,
     rotation: 360,
     duration: 2,
     paused: true // Optional: hold execution until triggered
   });
   ```
2. Attach event listeners to trigger elements:
   ```javascript
   document.querySelector(".btn-play").addEventListener("click", () => tween.play());
   document.querySelector(".btn-pause").addEventListener("click", () => tween.pause());
   document.querySelector(".btn-restart").addEventListener("click", () => tween.restart());
   ```

### Completion Gate
- [ ] Animation instance stored in a distinct variable.
- [ ] Control methods (`play()`, `pause()`, `restart()`, `reverse()`) respond immediately to user input.
