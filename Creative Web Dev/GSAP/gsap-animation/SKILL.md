---
name: gsap-animation
description: |
  Implement and control web animations using the GreenSock Animation Platform (GSAP 3).
  Use when building UI transitions, complex animation sequences, scroll-driven interactions,
  draggable elements, or typewriter text effects in HTML/CSS/JavaScript.
  Triggers: gsap, greensock, animate with gsap, scrolltrigger, gsap timeline, gsap tween,
  draggable gsap, textplugin gsap, create web animation.
---

# GSAP Animation Methodology

Build performant, declarative web animations using GreenSock Animation Platform (GSAP 3).

## Ground Rules
- Wait for full DOM initialization (`DOMContentLoaded`) before executing GSAP code.
- Prefer GSAP transform shorthands (`x`, `y`, `xPercent`, `yPercent`, `rotation`, `scale`) over CSS `transform` strings for cross-browser hardware acceleration.
- Use Timelines (`gsap.timeline()`) for sequenced animations instead of calculating chained `delay` values on individual Tweens.
- Always load GSAP core before any GSAP plugins, and load all GSAP assets before custom application scripts.

---

## Phase 1: Project Setup & Initialization

Set up the HTML environment and load GSAP libraries.

1. Include GSAP 3 core via CDN script tag or package manager (`npm install gsap` / `yarn add gsap`):
   ```html
   <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
   ```
2. If using GSAP plugins (e.g., `ScrollTrigger`, `Draggable`, `TextPlugin`), include their respective scripts directly after the core GSAP script.
3. Link your application JavaScript file (`script.js`) beneath all GSAP script tags.
4. Wrap all GSAP animation calls in a `DOMContentLoaded` event listener:
   ```javascript
   document.addEventListener("DOMContentLoaded", (event) => {
     // Animation code here
   });
   ```

For definitions and terminology, see [terminology.md](references/terminology.md).

### Completion Gate
- [ ] GSAP core and required plugin scripts are linked in proper order
- [ ] Application script executes inside `DOMContentLoaded` callback

---

## Phase 2: Tween Construction & Playback Control

Construct basic animations targeting DOM elements using `gsap.to()`, `gsap.from()`, or `gsap.fromTo()`.

1. Choose the appropriate Tween constructor:
   - **`gsap.to(target, vars)`**: Animates elements from their current state to the specified target values.
   - **`gsap.from(target, vars)`**: Animates elements from specified starting values to their current DOM state.
   - **`gsap.fromTo(target, fromVars, toVars)`**: Explicitly defines both initial and terminal states.
2. Specify targets using CSS selectors (`".box"`, `"#hero"`), DOM elements, or arrays of elements.
3. Configure common Tween variables in the `vars` object:
   - `duration`: Duration in seconds (default is 0.5s).
   - `x`, `y`: Relative coordinate translation in pixels or custom unit strings (`"20vw"`, `"50%"`).
   - `rotation`: Degree values (e.g., `360`, `120`).
   - `ease`: Easing function (e.g., `"power2.out"`, `"back"`, `"elastic"`, `"sine.out"`).
   - `delay`: Time in seconds to wait before animation starts.
   - `repeat`: Number of iterations (`-1` for infinite looping).
   - `runBackwards`: Set to `true` to invert tween direction.
   - `onComplete`: Callback function triggered when animation finishes.
4. Assign the Tween instance to a variable if playback control is required:
   ```javascript
   const myTween = gsap.to(".box", { x: 300, duration: 2 });
   ```
5. Attach playback methods to UI triggers (e.g., buttons):
   - `myTween.play()` — Plays animation forward from current position.
   - `myTween.pause()` — Pauses animation at current frame.
   - `myTween.resume()` — Resumes animation after a pause.
   - `myTween.reverse()` — Plays animation in reverse.
   - `myTween.restart()` — Restarts animation from the beginning.

For detailed Tween examples and syntax patterns, see [examples.md](references/examples.md).

### Completion Gate
- [ ] Target selector correctly matches intended DOM element(s)
- [ ] Appropriate constructor (`to`, `from`, or `fromTo`) is selected
- [ ] Desired easing and duration are defined
- [ ] Callback and playback controls operate as expected

---

## Phase 3: Timeline Orchestration & Sequencing

Group multiple Tweens into coordinated, sequenced timelines.

1. Instantiate a Timeline container:
   ```javascript
   const tl = gsap.timeline({
     delay: 0,
     onStart: () => console.log("Started"),
     onComplete: () => console.log("Finished")
   });
   ```
2. Chain Tweens to the timeline instance using `.to()`, `.from()`, or `.fromTo()`:
   ```javascript
   tl.to(".box1", { x: 300, duration: 2 })
     .to(".box2", { x: 300, rotation: 360, duration: 1 })
     .to(".box3", { x: 300, y: 200, duration: 2 });
   ```
3. Control the timing and overlap of individual Tweens using the **Position Parameter**:
   - **Relative Offset**: `"+=1"` (starts 1s after previous tween ends) or `"-=1"` (starts 1s before previous tween ends).
   - **Percentage Offset**: `"+=50%"` (adds gap equal to 50% of inserting tween duration) or `"-=25%"` (overlaps by 25%).
   - **Absolute Timestamp**: A fixed number (e.g., `3`) placing the tween at exactly that second on the timeline.
   - **Labels**: Insert a label marker (`"myLabel"`) and anchor other tweens relative to it (`"myLabel"`, `"myLabel+=1.5"`).

### Completion Gate
- [ ] Timeline instance created with optional global callbacks/config
- [ ] Sequence order validated across child tweens
- [ ] Position parameters tuned without hardcoded manual tween delays

---

## Phase 4: Plugin Integration

Extend GSAP capabilities with specialized plugins.

For plugin installation links and full option sets, see [plugins.md](references/plugins.md).

### Sub-Phase 4A: Draggable Plugin
1. Include `Draggable.min.js`.
2. Initialize draggable interaction on the target:
   ```javascript
   Draggable.create(".box", {
     type: "x,y", // Options: "x", "y", "x,y", "rotation"
     bounds: ".container" // Restricts dragging inside parent container
   });
   ```

### Sub-Phase 4B: TextPlugin
1. Include `TextPlugin.min.js`.
2. Animate heading or paragraph content:
   ```javascript
   gsap.to("h1", {
     duration: 2,
     text: "New Text Inserted",
     ease: "none"
   });
   ```

### Sub-Phase 4C: ScrollTrigger Plugin
1. Include `ScrollTrigger.min.js`.
2. Attach `scrollTrigger` configuration inside a Tween or Timeline:
   ```javascript
   gsap.to(".box", {
     x: 300,
     rotation: 360,
     duration: 2,
     scrollTrigger: {
       trigger: ".box",
       start: "top 80%",  // When top of trigger hits 80% of viewport
       end: "bottom 20%", // When bottom of trigger hits 20% of viewport
       scrub: true,       // Smoothly links animation progress to scroll bar (or number for lag)
       markers: true      // Shows visual start/end trigger lines during development
     }
   });
   ```
3. Disable `markers` (`markers: false`) before production deployment.

### Completion Gate
- [ ] Plugin script loaded after GSAP core
- [ ] Plugin configured with valid options (`bounds`, `text`, or `scrollTrigger`)
- [ ] ScrollTrigger trigger boundaries visually verified with `markers: true`

---

## Final Validation Checklist

- [ ] All animations perform at 60fps without layout jank
- [ ] Transform properties use GSAP aliases (`x`, `y`, `scale`, `rotation`)
- [ ] No race conditions between DOM rendering and animation scripts
- [ ] Debug markers (`markers: true`) removed from production code
