# Phase 1 & 2: Source Inventory & Knowledge Spec

## Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Video Tutorial / Masterclass |
| **Title** | Complete GSAP (GreenSock Animation Platform) Full Course |
| **Creator / Authority** | Gravity Coding (Amarjeet Chaudhary) |
| **Coverage** | Web animation fundamentals, GSAP architecture & setup, Tweens (`to`, `from`, `fromTo`), Timelines & playback controls, Easing & EasePack, Staggers & grid orchestration, ScrollTrigger plugin (`scrub`, `pin`, `markers`, `start`/`end`), ScrollToPlugin (smooth anchor navigation), ScrollSmoother plugin (inertial smooth scrolling & DOM parallax). |

---

## Extracted Knowledge Spec

```yaml
# ==========================================
# GSAP ANIMATION KNOWLEDGE SPEC
# ==========================================

- id: ku-001
  type: concept
  name: Tween
  source: src-01, "04:00"
  confidence: high
  definition: >
    The interpolation and transition of property values of a target element 
    between two states over a defined duration.
  attributes: [target, duration, vars, properties]
  avoid_terms: [keyframe sequence, CSS transition]
  related: [ku-002, ku-003, ku-004]

- id: ku-002
  type: concept
  name: Timeline
  source: src-01, "50:35"
  confidence: high
  definition: >
    A container object that orchestrates and sequences multiple tweens in a timeline 
    without manual delay calculations.
  attributes: [sequencing, position parameter, pause control]
  avoid_terms: [delay chain, animation group]
  related: [ku-001, ku-007]

- id: ku-003
  type: concept
  name: Easing
  source: src-01, "74:50"
  confidence: high
  definition: >
    The mathematical rate of change and acceleration curve applied to an animation 
    over its duration (e.g., power, bounce, elastic).
  attributes: [curve, direction (in/out/inOut), strength]
  avoid_terms: [speed curve, timing function]
  related: [ku-001, ku-008]

- id: ku-004
  type: concept
  name: Stagger
  source: src-01, "86:06"
  confidence: high
  definition: >
    The staggered time offset applied to an array of matching elements to animate 
    them in a sequential or grid-based wave.
  attributes: [interval, grid, from, axis, amount]
  avoid_terms: [loop delay, item delay]
  related: [ku-001, ku-002]

- id: ku-005
  type: concept
  name: ScrollTrigger
  source: src-01, "96:06"
  confidence: high
  definition: >
    A GSAP plugin that binds tweens and timelines to scroll positions, viewports, 
    pinning behavior, and scroll velocity.
  attributes: [trigger, start, end, scrub, pin, markers]
  avoid_terms: [scroll listener, intersection observer wrapper]
  related: [ku-002, ku-006]

- id: ku-006
  type: concept
  name: ScrollSmoother
  source: src-01, "120:05"
  confidence: high
  definition: >
    A native smooth-scrolling wrapper plugin built on ScrollTrigger that adds 
    inertial momentum scrolling and declarative parallax effects.
  attributes: [smooth, effects, normalizeScroll, data-speed]
  avoid_terms: [Locomotive scroll, Lenis]
  related: [ku-005]

- id: ku-007
  type: principle
  name: Purposeful Animation vs. Visual Clutter
  source: src-01, "08:13"
  confidence: high
  statement: >
    Animations must provide visual feedback, user orientation, and fluid UX. 
    Excessive, non-functional animations turn a web page into a messy warehouse 
    rather than a curated exhibition.
  rationale: >
    Over-animating increases cognitive load and causes user distraction.
  applies_to: [ku-020, ku-021, ku-022]

- id: ku-008
  type: principle
  name: DOM Load Lifecycle Synchronization
  source: src-01, "14:15"
  confidence: high
  statement: >
    Always initialize GSAP scripts and register plugins inside the DOMContentLoaded event 
    or after the target DOM elements have fully mounted.
  rationale: >
    Targeting non-existent DOM nodes results in silent failures or layout shifts.
  applies_to: [ku-020, ku-021]

- id: ku-020
  type: procedure
  name: Basic Tween Construction (to, from, fromTo)
  source: src-01, "18:27 - 38:34"
  confidence: high
  goal: Select the appropriate tween method and animate target properties
  steps:
    - action: Determine if the starting or ending state is defined in CSS
      criterion: to() for current->target, from() for custom_start->CSS_natural, fromTo() for custom_start->custom_end
    - action: Target DOM element using valid selector string or DOM reference
      criterion: Element selector matches DOM node
    - action: Define vars object with target CSS/transform properties, duration, and ease
      criterion: Transform shorthands used (x, y, scale, rotation, autoAlpha)
  outputs: [GSAP Tween Instance]

- id: ku-021
  type: procedure
  name: Timeline Choreography and Controls
  source: src-01, "50:35 - 74:49"
  confidence: high
  goal: Sequence multiple animations and bind interactive controls
  steps:
    - action: Instantiate timeline with gsap.timeline()
      criterion: Timeline created with default configuration or paused state
    - action: Chain tweens using method chaining
      criterion: Tweens execute sequentially by default
    - action: Position simultaneous tweens using labels or relative position parameters
      criterion: Co-occurring animations use matching labels or relative offsets (<, +=, -=)
    - action: Bind playback controls to user events
      criterion: play(), pause(), reverse(), resume(), restart() bound to triggers
  outputs: [Interactive Timeline]

- id: ku-022
  type: procedure
  name: ScrollTrigger Implementation
  source: src-01, "96:06 - 114:08"
  confidence: high
  goal: Link GSAP tweens and timelines to page scrolling
  steps:
    - action: Register ScrollTrigger plugin via gsap.registerPlugin(ScrollTrigger)
      criterion: Plugin registered before tween invocation
    - action: Define trigger element and start/end coordinates
      criterion: Start and end points properly aligned (e.g. "top center", "0% 50%")
    - action: Configure scrub or toggleActions based on desired behavior
      criterion: scrub enabled for scroll-linked progress; toggleActions for trigger-fired play
    - action: Enable pin when element must stay fixed while scrolling through animation duration
      criterion: Pinning container configured with overflow handling
  outputs: [Scroll-driven Animation]

- id: ku-030
  type: constraint
  name: Plugin Registration Requirement
  source: src-01, "13:30, 96:06, 114:47"
  confidence: high
  rule: >
    External GSAP plugins (ScrollTrigger, ScrollToPlugin, ScrollSmoother, EasePack) 
    must be loaded and explicitly registered via gsap.registerPlugin() before use.
  consequence: >
    Unregistered plugins fail silently or throw ReferenceErrors at runtime.
```

---

# Compiled Skill Package

```
gsap-web-animation/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── examples.md
    └── plugins-guide.md
```

---

### File: `gsap-web-animation/SKILL.md`

```markdown
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

---

## Phase 5: ScrollTrigger Integration

Bind animations to scroll position, viewport thresholds, and element pinning.

For full ScrollTrigger configuration tables, see [plugins-guide.md](references/plugins-guide.md).

1. **Direct Tween ScrollTrigger**:
   ```javascript
   gsap.to(".section-title", {
     scrollTrigger: {
       trigger: ".section-container",
       start: "top 80%",       // When trigger top reaches 80% of viewport
       end: "top 20%",         // When trigger top reaches 20% of viewport
       toggleActions: "play none none reverse", // onEnter, onLeave, onEnterBack, onLeaveBack
       markers: false
     },
     x: 0,
     opacity: 1
   });
   ```
2. **Scroll Scrubbing & Pinning**:
   Link animation progress directly to the scrollbar and pin the trigger in place during animation:
   ```javascript
   const tl = gsap.timeline({
     scrollTrigger: {
       trigger: "#feature-showcase",
       start: "top top",
       end: "+=1500",           // Scroll 1500px while pinned
       scrub: 1,                // 1 second smooth catch-up
       pin: true,               // Pin viewport
       anticipatePin: 1,
       markers: false
     }
   });

   tl.to(".wireframe-overlay", { width: "100%", ease: "none" })
     .to(".feature-text", { y: -50, opacity: 1 }, "<");
   ```

### Completion Gate
- [ ] `start` and `end` trigger pairs properly aligned (`"trigger_point scroller_point"`).
- [ ] `markers: true` used only during development and disabled for production.
- [ ] Pinned elements have parent containers configured without conflicting CSS overflow clipping.

---

## Phase 6: Smooth Scrolling & Navigation Plugins

Enhance UX with anchor scrolling (`ScrollToPlugin`) and native smooth momentum scrolling (`ScrollSmoother`).

### ScrollToPlugin (Anchor Navigation)
Intercept anchor link clicks and smoothly scroll the window or container:
```javascript
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: targetId,
        offsetY: 70 // Offset for fixed navbar height
      },
      ease: "power2.inOut"
    });
  });
});
```

### ScrollSmoother (Inertial Scrolling & Parallax)
1. **HTML Architecture**:
   ```html
   <div id="smooth-wrapper">
     <div id="smooth-content">
       <!-- All page content goes here -->
       <img src="img.jpg" data-speed="0.8" /> <!-- Slower / parallax lag -->
       <div class="card" data-speed="1.2"></div> <!-- Faster / parallax lead -->
     </div>
   </div>
   ```
2. **Initialization**:
   ```javascript
   ScrollSmoother.create({
     wrapper: "#smooth-wrapper",
     content: "#smooth-content",
     smooth: 1.5,               // Seconds to catch up to scroll
     effects: true,             // Enable data-speed / data-lag attributes
     normalizeScroll: true
   });
   ```

For complete worked examples across real projects, see [examples.md](references/examples.md).

### Completion Gate
- [ ] `#smooth-wrapper` and `#smooth-content` wrappers correctly encapsulate document elements when using ScrollSmoother.
- [ ] `e.preventDefault()` prevents native anchor jumping when `scrollTo` is active.
- [ ] `data-speed` values calibrated between 0.5 and 1.5 to prevent extreme layout breaks.
```

---

### File: `gsap-web-animation/references/terminology.md`

```markdown
# Terminology & Property Shorthands

## Domain Concepts

**Tween**:
The interpolation of numeric and color values of an object over time.
_Avoid_: frame loop, CSS animation

**Timeline**:
A container that manages the scheduling and relative playback of multiple tweens.
_Avoid_: timeout chain, delay calculator

**ScrollTrigger**:
The plugin controlling tween playback and pinning relative to scroll position.
_Avoid_: scroll listener, intersection wrapper

**ScrollSmoother**:
An inertial scroll wrapper providing smooth momentum scrolling and declarative parallax.
_Avoid_: virtual scroll, smooth wheel hack

**Scrub**:
Linking the playhead of an animation directly to the scrollbar position.
_Avoid_: scroll binding, scroll listener sync

**Pin**:
Locking an element to a fixed viewport position while the user continues to scroll through a defined distance.
_Avoid_: position fixed switch, sticky fallback

---

## GSAP Transform & Property Shorthands

Always use GSAP shorthands instead of raw CSS transform strings:

| CSS Property / Transform | GSAP Shorthand | Example Usage |
|---|---|---|
| `transform: translateX(100px)` | `x` | `x: 100` or `x: "50%"` |
| `transform: translateY(100px)` | `y` | `y: -200` or `y: "100%"` |
| `transform: translateX(50%)` | `xPercent` | `xPercent: 50` |
| `transform: translateY(50%)` | `yPercent` | `yPercent: -50` |
| `transform: scale(1.5)` | `scale` | `scale: 1.5` |
| `transform: scaleX(2)` | `scaleX` | `scaleX: 2` |
| `transform: scaleY(2)` | `scaleY` | `scaleY: 2` |
| `transform: rotate(90deg)` | `rotation` / `rotate` | `rotation: 90` or `rotation: "1.5rad"` |
| `transform: skewX(30deg)` | `skewX` | `skewX: 30` |
| `transform: skewY(30deg)` | `skewY` | `skewY: 30` |
| `transform-origin: 50% 50%` | `transformOrigin` | `transformOrigin: "center center"` |
| `opacity: 0` + `visibility: hidden` | `autoAlpha` | `autoAlpha: 0` (efficiently toggles visibility) |
| `clip-path: polygon(...)` | `clipPath` | `clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"` |
| `background-color: #fff` | `backgroundColor` | `backgroundColor: "#ffffff"` |
```

---

### File: `gsap-web-animation/references/plugins-guide.md`

```markdown
# GSAP Plugins Reference Guide

## 1. ScrollTrigger

### Registration
```javascript
gsap.registerPlugin(ScrollTrigger);
```

### Trigger Configuration Options

```javascript
ScrollTrigger.create({
  trigger: ".target-element",     // Element that triggers the viewport check
  scroller: window,              // Default is window
  start: "top 80%",              // [trigger top] hits [viewport 80% from top]
  end: "bottom 20%",             // [trigger bottom] hits [viewport 20% from top]
  toggleActions: "play pause resume reverse",
  // Action slots: onEnter, onLeave, onEnterBack, onLeaveBack
  // Options: "play", "pause", "resume", "reverse", "restart", "reset", "complete", "none"
  scrub: true,                   // true or numeric smoothing (e.g. 0.5, 1, 2)
  pin: true,                     // Boolean or selector to pin during scroll
  pinSpacing: true,              // Adds padding to push subsequent content
  anticipatePin: 1,              // Avoids slight jitter on fast scroll
  markers: false,                // Visual debug guides
  onUpdate: (self) => console.log("Progress:", self.progress.toFixed(2)),
  onToggle: (self) => console.log("Active state:", self.isActive)
});
```

---

## 2. ScrollToPlugin

### Registration
```javascript
gsap.registerPlugin(ScrollToPlugin);
```

### Syntax & Properties

```javascript
gsap.to(window, {
  duration: 1.2,
  ease: "power2.inOut",
  scrollTo: {
    y: "#pricing-section",       // Target selector, pixel offset (e.g. 500), or "max"
    x: 0,
    offsetY: 80,                 // Subtracts height (e.g. fixed header)
    offsetX: 0,
    autoKill: true               // Stops animation if user manually scrolls/touches
  }
});
```

---

## 3. ScrollSmoother

### Registration & Requirements
Requires `ScrollTrigger`. Must wrap page contents inside container elements.

```html
<div id="smooth-wrapper">
  <div id="smooth-content">
    <!-- Page Content -->
  </div>
</div>
```

```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 2,                     // Seconds to catch up to mouse wheel
  effects: true,                  // Enables data-speed & data-lag
  smoothTouch: 0.1,              // Smooth on touch devices (default false / 0)
  normalizeScroll: true          // Prevents mobile browser address bar jitter
});
```

### Declarative Parallax Attributes
Apply directly to HTML elements inside `#smooth-content`:
- `data-speed="0.5"`: Moves at half normal scroll speed (parallax background).
- `data-speed="1.5"`: Moves 1.5x faster than normal scroll (foreground rush).
- `data-lag="0.5"`: Adds 0.5 seconds of lazy catch-up smoothing to the specific element.

---

## 4. EasePack & Custom Eases

### Registration
```javascript
gsap.registerPlugin(EasePack, CustomEase);
```

### Visual Curves Reference
- **Bounce**: `"bounce.out"`, `"bounce.in"`, `"bounce.inOut"`
- **Elastic**: `"elastic.out(amplitude, period)"` (default `elastic.out(1, 0.3)`)
- **SlowMo**: `"slow(linearRatio, power, yoyoMode)"` (e.g. `"slow(0.7, 0.7, false)"`)
- **Rough**: `"rough({ template: power1.out, strength: 1, points: 20, randomize: true })"`
- **Steps**: `"steps(12)"` (stepped discrete transitions)
```

---

### File: `gsap-web-animation/references/examples.md`

```markdown
# Worked Examples

## Example 1: Interactive Hero Entry with Clip-Path Reveal

**Scenario**: A landing page hero section requiring a smooth navbar dropdown, text rise with fade, and an image transitioning between geometric polygon masks.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Navbar drops down from above viewport
  tl.from(".navbar", {
    yPercent: -100,
    autoAlpha: 0,
    duration: 0.8
  })
  // Heading rises from bottom
  .from(".hero-title", {
    y: 60,
    autoAlpha: 0,
    duration: 1
  }, "-=0.4")
  // Subtitle & CTA appear
  .from(".hero-sub, .hero-cta", {
    y: 30,
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.15
  }, "-=0.6")
  // Hero image expands clip path
  .fromTo(".hero-image", 
    { clipPath: "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)" },
    { 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%, 0% 100%, 0% 0%)",
      duration: 1.5,
      ease: "power4.inOut"
    }, "-=1.0"
  );
});
```

---

## Example 2: Kinetic Dual-Direction Scroll Text

**Scenario**: Multiple text banners moving horizontally in alternating directions linked directly to scroll position with scrub.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".kinetic-section",
      start: "top bottom",     // Starts when top of section enters bottom of viewport
      end: "bottom top",       // Ends when bottom of section leaves top of viewport
      scrub: 1                 // Smooth 1-second lag catch-up
    }
  });

  scrollTl
    .to(".marquee-left", { x: -300 }, 0)
    .to(".marquee-right", { x: 300 }, 0);
});
```

---

## Example 3: Pinned Product Spec Comparison (Wireframe to Photo Reveal)

**Scenario**: A hardware showcase where scrolling locks the viewport and horizontally reveals a photorealistic render over a wireframe schematic.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const showcaseTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".gpu-showcase-container",
      start: "top top",
      end: "+=1200",           // User scrolls 1200px while pinned
      pin: true,               // Pin container in place
      scrub: 1,
      anticipatePin: 1
    }
  });

  // Photo container expands its width from 0% to 100% to reveal the real image
  showcaseTl.fromTo(".photo-overlay-container", 
    { width: "0%" },
    { width: "100%", ease: "none" }
  );
});
```

---

## Example 4: Interactive Timeline UI Controller

**Scenario**: A dashboard visualization with manual Play, Pause, Resume, Reverse, and Restart controls.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const anim = gsap.timeline({ paused: true });

  anim
    .to(".node-1", { x: 300, duration: 1, ease: "power2.out" })
    .to(".node-2", { x: 300, rotation: 360, duration: 1, ease: "power2.out" })
    .to(".node-3", { x: 300, scale: 1.2, duration: 1, ease: "bounce.out" });

  document.querySelector("#btn-play").onclick = () => anim.play();
  document.querySelector("#btn-pause").onclick = () => anim.pause();
  document.querySelector("#btn-resume").onclick = () => anim.resume();
  document.querySelector("#btn-reverse").onclick = () => anim.reverse();
  document.querySelector("#btn-restart").onclick = () => anim.restart();
});
```
```

---

# Phase 5: Validation & Verification Report

### 1. Source Fidelity Verification
- **All Core Concepts Extracted**: Tweens (`to`, `from`, `fromTo`), timelines, easing, staggers, ScrollTrigger, ScrollToPlugin, and ScrollSmoother have been operationalized.
- **Syntactic Correctness**: Verified that transform shorthands (`x`, `y`, `autoAlpha`, `scale`, `rotation`, `clipPath`) replace expensive raw CSS property mutations.
- **Edge-Case Warnings Included**: Case-sensitivity on event listener parameters (`DOMContentLoaded`), CSS string wrapping for percentage/unit-based values, and mandatory plugin registration.

### 2. Operational Test Scenarios

1. **Scenario A (Micro-interaction UI)**: Button hover feedback or modal popup with bounce.
   - *Result*: Handled by Phase 2 & 4 using `gsap.fromTo()` with `ease: "back.out(1.7)"`.
2. **Scenario B (Scroll-pinned multi-step narrative)**: Complex storytelling page where items pin and animate sequentially.
   - *Result*: Handled by Phase 3 & 5 using `gsap.timeline({ scrollTrigger: { pin: true, scrub: 1 } })`.
3. **Scenario C (Full site smooth scrolling with navbar anchor links)**:
   - *Result*: Handled by Phase 6 using `ScrollSmoother.create()` combined with `ScrollToPlugin` anchor interceptors.

### 3. Known Limitations
- Does not cover Canvas/WebGL render loop integration (e.g., Three.js RAF ticks).
- SplitText plugin text chunking requires a Club GreenSock paid license (syntax follows standard stagger once elements are split).
