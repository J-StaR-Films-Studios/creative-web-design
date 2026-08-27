# Source-to-Skill Compilation Report: GSAP Animation Development

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-tutorial |
| **Title** | Complete GSAP (GreenSock Animation Platform) Full Course / Tutorial |
| **Authority** | Practical Web Development Tutorial Instructor |
| **Coverage** | GSAP 3 core fundamentals, installation, Tweens (`to`, `from`, `fromTo`), Tween controls, Timelines (`gsap.timeline()`), position parameters/labels, CSS property animation, transform aliases/units, and major plugins (`Draggable`, `TextPlugin`, `ScrollTrigger`). |

---

## Phase 2: Knowledge Extraction Summary

- **Knowledge Units Extracted**: 28 total
  - **Procedures**: Setup & Installation, Creating Tweens, Controlling Tween Playback, Constructing Timelines, Positioning Timeline Items, Configuring Draggable, Text Animation with TextPlugin, Scroll-Driven Animation with ScrollTrigger.
  - **Principles**: Start from DOMContentLoaded, Model/Chain via Timelines rather than isolated delays, Use Built-in Transform Aliases (`xPercent`, `scale`, `rotation`), Leverage Debug Markers for ScrollTrigger tuning.
  - **Constraints**: Script loading order (Core GSAP + Plugins before application scripts), Container sizing prerequisites for ScrollTrigger & bounded dragging.
  - **Concepts**: Tweens, Timelines, Ease, Scrub, Trigger, Markers, Position Parameter.
  - **Examples**: Tween playback controls, Multi-element sequence timeline, Progress bar with `ScrollTrigger` scrub.

---

## Phase 3 & 4: Compiled Skill Package

```
gsap-animation/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── plugins.md
    └── examples.md
```

---

### `gsap-animation/SKILL.md`

```markdown
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
```

---

### `gsap-animation/references/terminology.md`

```markdown
# GSAP Terminology

**Tween**:
The single animation unit in GSAP that manipulates an object's properties over a duration from a start state to an end state.
_Avoid_: CSS animation, transition block, keyframe script

**Timeline**:
A container object that stores and orchestrates multiple Tweens along a shared temporal sequence.
_Avoid_: animation chain, callback queue, delay list

**Position Parameter**:
An optional argument in Timeline methods defining exactly when a Tween inserts relative to the timeline sequence or other labels.
_Avoid_: manual offset, setTimeout chain

**Scrub**:
A ScrollTrigger property that ties an animation's execution progress directly to the user's scrollbar position.
_Avoid_: scroll listener, scroll-jacking

**Trigger**:
The DOM element whose position in the viewport determines when a ScrollTrigger animation activates.
_Avoid_: scroll target, scroll observer

**Ease**:
A mathematical timing function that controls the acceleration and deceleration curve of an animated property.
_Avoid_: speed curve, transition timing
```

---

### `gsap-animation/references/plugins.md`

```markdown
# GSAP Plugins Reference

## Plugin CDNs

```html
<!-- Draggable Plugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Draggable.min.js"></script>

<!-- TextPlugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/TextPlugin.min.js"></script>

<!-- ScrollTrigger Plugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
```

---

## Draggable Configuration

| Property | Type | Description |
|---|---|---|
| `type` | string | Movement axis: `"x"`, `"y"`, `"x,y"`, or `"rotation"`. |
| `bounds` | selector / element | Constrains draggable area to target container selector or viewport. |

---

## TextPlugin Configuration

| Property | Type | Description |
|---|---|---|
| `text` | string / object | Target string to type out or replace with typewriter animation. |
| `duration` | number | Duration in seconds for text generation. |

---

## ScrollTrigger Configuration

| Property | Type | Description |
|---|---|---|
| `trigger` | selector / element | Element that triggers animation when scrolled into viewport. |
| `start` | string | Trigger point: `"[trigger-edge] [scroller-edge]"` (e.g. `"top bottom"`, `"top 80%"`). |
| `end` | string | End point: `"[trigger-edge] [scroller-edge]"` (e.g. `"bottom top"`, `"bottom 20%"`). |
| `scrub` | boolean / number | `true` links progress to scrollbar; number (e.g. `2`, `3`) adds smooth catch-up delay. |
| `markers` | boolean | Set `true` to render visual trigger/start/end debug markers. |
```

---

### `gsap-animation/references/examples.md`

```markdown
# GSAP Code Examples

## 1. Controlled Tween with Callback

**Scenario**: Animate an element with rotation and color change, controllable via HTML buttons.

```javascript
const boxTween = gsap.to(".box", {
  x: 300,
  rotation: 360,
  backgroundColor: "red",
  duration: 3,
  ease: "elastic",
  onComplete: () => console.log("Animation Completed")
});

document.querySelector("#play").onclick = () => boxTween.play();
document.querySelector("#pause").onclick = () => boxTween.pause();
document.querySelector("#resume").onclick = () => boxTween.resume();
document.querySelector("#reverse").onclick = () => boxTween.reverse();
document.querySelector("#restart").onclick = () => boxTween.restart();
```

---

## 2. Timeline with Overlapping Labels and Position Parameters

**Scenario**: Orchestrate three sequential elements where Box 3 starts concurrently with Box 1.

```javascript
const tl = gsap.timeline({ delay: 1 });

tl.to(".box1", { x: 400, opacity: 0.2, duration: 3 }, "startPoint")
  .to(".box2", { x: 400, rotation: 360, duration: 2 }, "+=1") // 1s after box1 ends
  .to(".box3", { x: 400, y: 200, duration: 2, ease: "power3.out" }, "startPoint+=1"); // 1s after startPoint label
```

---

## 3. Scroll-Linked Progress Bar with ScrollTrigger

**Scenario**: Horizontal reading progress bar filling up as user scrolls the page.

```html
<div class="progress-bar" style="position:fixed; top:0; left:0; height:8px; width:0; background:greenyellow;"></div>
```

```javascript
gsap.to(".progress-bar", {
  width: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1 // Smooth catch-up
  }
});
```
```

---

## Phase 5: Validation & Verification

- [x] **Source Fidelity**: All constructs introduced in the video (`gsap.to`, `gsap.from`, `gsap.fromTo`, `timeline`, `position parameter`, `Draggable`, `TextPlugin`, `ScrollTrigger`, `scrub`, `markers`, transform aliases) are operationalized.
- [x] **Imperative Style**: All phases written with clear, direct actions and checklist completion gates.
- [x] **Progressive Disclosure**: SKILL.md body is kept under 500 lines, delegating terminology, plugin details, and code samples to dedicated `references/` files.
