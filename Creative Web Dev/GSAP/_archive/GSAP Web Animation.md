# Source-to-Skill Compilation: GSAP Web Animation

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-tutorial / video-notes |
| **Title** | GSAP 3 Crash Course: Core Methods, Timelines, and ScrollTrigger |
| **Authority** | MUKE-coder (Web development tutorial educator, practical JavaScript & GSAP implementation) |
| **Coverage** | GSAP installation via CDN, Tween methods (`to`, `set`, `from`, `fromTo`), animation properties, ease configurations, stagger effects, animation playback controls (`play`, `pause`, `restart`), GSAP Timelines (chaining), ScrollTrigger plugin integration (`trigger`, `start`, `end`, `markers`, `toggleActions`, `pin`, `pinSpacing`, `scrub`). |

### Coverage Gaps Identified
- Advanced ScrollTrigger features (e.g., custom scrub snapping, horizontal scroll containers, matchMedia responsive animations) were deferred to Part 2 (Landing Page Project).
- Custom easing math/SVG morphing plugins (Flip, Draggable, MotionPath, MorphSVG) were listed on documentation pages but not coded in Part 1.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# KNOWLEDGE SPEC: GSAP 3 Web Animation Foundations & ScrollTrigger
# Source: src-01 (GSAP 3 Crash Course)
# ==============================================================================

# --- CONCEPTS ---

- id: ku-001
  type: concept
  name: GSAP (GreenSock Animation Platform)
  source: src-01, "02:05 - 03:05"
  confidence: high
  definition: >
    A JavaScript animation library designed to animate DOM elements, SVGs, canvas,
    and JS object properties across browsers.
  attributes: [core engine, plugin ecosystem, high performance, property agnostic]
  avoid_terms: [CSS keyframe replacement, jQuery animate]
  related: [ku-002, ku-007, ku-015]

- id: ku-002
  type: concept
  name: Tween
  source: src-01, "05:30 - 06:45"
  confidence: high
  definition: >
    A single animation instance that interpolates target element properties
    over a specified duration from a start state to an end state.
  attributes: [target selector, duration, vars object, ease, callbacks]
  avoid_terms: [transition, CSS frame]
  related: [ku-003, ku-004, ku-005, ku-006]

- id: ku-007
  type: concept
  name: GSAP Timeline
  source: src-01, "40:48 - 42:30"
  confidence: high
  definition: >
    A container for sequencing and choreographing multiple tweens without
    calculating manual delay offsets.
  attributes: [chaining, sequential execution, unified playback control]
  avoid_terms: [delay chain, settimeout sequence]
  related: [ku-002, ku-012]

- id: ku-015
  type: concept
  name: ScrollTrigger Plugin
  source: src-01, "50:40 - 52:30"
  confidence: high
  definition: >
    A GSAP plugin that binds tween or timeline playback, pinning, and scrubbing
    to the page's scroll position and viewport coordinates.
  attributes: [trigger element, start/end boundaries, toggleActions, pin, scrub, markers]
  avoid_terms: [scroll listener, intersection observer wrapper]
  related: [ku-001, ku-007, ku-016]

# --- PRINCIPLES ---

- id: ku-008
  type: principle
  name: CamelCase for Multi-Word CSS Properties
  source: src-01, "11:05 - 11:35"
  confidence: high
  statement: >
    All hyphenated CSS properties (e.g., background-color, border-radius) must be
    written in camelCase (e.g., backgroundColor, borderRadius) inside GSAP vars objects.
  rationale: >
    JavaScript object keys cannot contain unquoted hyphens without syntax errors.
  applies_to: [ku-003, ku-004, ku-005, ku-006, ku-014]

- id: ku-009
  type: principle
  name: Timeline Over Manual Delay Calculations
  source: src-01, "46:30 - 47:35"
  confidence: high
  statement: >
    Use `gsap.timeline()` rather than chaining individual tweens with calculated `delay` properties.
  rationale: >
    Manual delay chaining turns animation maintenance into fragile arithmetic calculations.
    Adjusting one animation's duration requires recalculating every subsequent tween.
  applies_to: [ku-007, ku-012]

- id: ku-010
  type: principle
  name: Explicit Plugin Registration
  source: src-01, "53:15 - 54:05"
  confidence: high
  statement: >
    Always register external GSAP plugins via `gsap.registerPlugin(PluginName)`
    before defining tweens or timelines that use them.
  rationale: >
    Ensures the core engine establishes the necessary hooks and avoids tree-shaking
    or runtime undefined errors.
  applies_to: [ku-015, ku-016]

# --- PROCEDURES ---

- id: ku-003
  type: procedure
  name: Animate to Target State (`gsap.to`)
  source: src-01, "06:10 - 10:25"
  confidence: high
  goal: Animate an element from its current CSS state to new property values
  steps:
    - action: Specify target selector string or DOM element
      criterion: Selector accurately matches target element(s)
    - action: Define end properties and animation options (duration, ease, repeat, yoyo)
      criterion: Numeric values without quotes, strings quoted, duration defined in seconds
  outputs: [Tween instance]

- id: ku-004
  type: procedure
  name: Set Instant Properties (`gsap.set`)
  source: src-01, "13:40 - 17:05"
  confidence: high
  goal: Apply initial properties immediately with zero duration
  steps:
    - action: Specify target selector
      criterion: Matches target DOM node
    - action: Define property values in vars object
      criterion: Applied immediately without transition/animation
  outputs: [Updated DOM state]

- id: ku-005
  type: procedure
  name: Animate from Specified State (`gsap.from`)
  source: src-01, "20:30 - 24:35"
  confidence: high
  goal: Animate an element from defined values to its existing CSS state
  steps:
    - action: Define starting values in vars object (e.g. x, opacity, background)
      criterion: Starting state matches animation entrance criteria
    - action: Let GSAP animate towards current rendered DOM values
      criterion: Animation smoothly completes at CSS specified state
  outputs: [Tween instance]

- id: ku-006
  type: procedure
  name: Explicit Start and End Animation (`gsap.fromTo`)
  source: src-01, "24:45 - 27:50"
  confidence: high
  goal: Animate an element between two explicitly declared property sets
  steps:
    - action: Pass selector
      criterion: Matches target element
    - action: Pass fromVars object (initial state)
      criterion: Contains starting properties only
    - action: Pass toVars object (final state + timing options like duration, ease, repeat)
      criterion: Timing controls and target values placed in toVars object
  outputs: [Tween instance]

- id: ku-011
  type: procedure
  name: Stagger Multi-Element Animations
  source: src-01, "28:00 - 32:45"
  confidence: high
  goal: Offset start times for multiple elements matching a single selector
  steps:
    - action: Target selector matching multiple elements
      criterion: Selector returns NodeList / collection
    - action: Add `stagger` property in seconds (e.g., `stagger: 0.2`)
      criterion: Each item starts animating after the specified offset
  outputs: [Staggered multi-target tween]

- id: ku-012
  type: procedure
  name: Build Animation Timeline
  source: src-01, "47:45 - 50:35"
  confidence: high
  goal: Chain sequential tweens into an automatically ordered timeline
  steps:
    - action: Instantiate timeline via `const tl = gsap.timeline()`
      criterion: Timeline instance assigned to variable
    - action: Chain tween methods (`tl.from()`, `tl.to()`, etc.) directly
      criterion: Each tween naturally follows the completion of the previous tween
  outputs: [Timeline instance]

- id: ku-013
  type: procedure
  name: Interactive Animation Playback Control
  source: src-01, "33:00 - 40:40"
  confidence: high
  goal: Control animation execution using user interactions (play, pause, restart)
  steps:
    - action: Assign tween or timeline to a variable (`const anim = gsap.to(...)`)
      criterion: Instance reference preserved
    - action: Attach DOM event listeners to control buttons
      criterion: Click events call `.play()`, `.pause()`, or `.restart()`
  outputs: [Interactive control bindings]

- id: ku-016
  type: procedure
  name: Configure ScrollTrigger Animation
  source: src-01, "54:10 - 68:45"
  confidence: high
  goal: Bind animation playback and pinning to page scroll position
  steps:
    - action: Include core GSAP and ScrollTrigger script tags
      criterion: Both scripts loaded before application code
    - action: Register plugin with `gsap.registerPlugin(ScrollTrigger)`
      criterion: Plugin initialized
    - action: Add `scrollTrigger` configuration object to tween vars
      criterion: `trigger`, `start`, and `end` boundaries defined
    - action: Configure behavioral flags (`toggleActions`, `pin`, `pinSpacing`, `scrub`, `markers`)
      criterion: Visual and scroll behavior matches requirements
  outputs: [Scroll-driven animation instance]

# --- CONSTRAINTS ---

- id: ku-014
  type: constraint
  name: fromTo Duration Placement
  source: src-01, "26:00 - 26:15"
  confidence: high
  rule: >
    In `gsap.fromTo(target, fromVars, toVars)`, timing properties such as `duration`,
    `ease`, `repeat`, and `yoyo` must strictly be defined in the `toVars` (second object).
  scope: `gsap.fromTo` method invocations
  consequence: Placing `duration` in `fromVars` will result in it being ignored.
  enforced_by: Method signature validation

- id: ku-017
  type: constraint
  name: ScrollTrigger ToggleActions Syntax
  source: src-01, "60:10 - 60:50"
  confidence: high
  rule: >
    `toggleActions` string must contain exactly 4 space-separated keywords corresponding
    to [onEnter, onLeave, onEnterBack, onLeaveBack].
  scope: ScrollTrigger configuration
  consequence: Invalid syntax defaults to no-op or unexpected trigger state resets.
  enforced_by: ScrollTrigger parser
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Environment & Script Initialization
INPUT: HTML document, target animation elements, CDN scripts.
STEPS:
1. Load GSAP 3 core script (`gsap.min.js`) before custom scripts.
2. If scroll interactions are required, load `ScrollTrigger.min.js`.
3. In JS, invoke `gsap.registerPlugin(ScrollTrigger)` if plugins are loaded.
OUTPUT: Initialized GSAP environment ready for tween definitions.
VALIDATION:
[ ] `gsap` global object is available in scope.
[ ] Loaded plugins are registered.

STAGE 2: Tween & Initial State Definition
INPUT: DOM selectors, starting CSS state, intended motion parameters.
STEPS:
1. Determine method based on state transition requirement:
   - Current CSS to new value -> `gsap.to(selector, vars)`
   - Defined start value to CSS value -> `gsap.from(selector, vars)`
   - Explicit start to explicit end -> `gsap.fromTo(selector, fromVars, toVars)`
   - Instant zero-duration preset -> `gsap.set(selector, vars)`
2. Format all CSS properties in camelCase.
3. If multiple items share a selector, configure `stagger: <seconds>`.
4. Configure timing: `duration`, `ease`, `repeat` (-1 for infinite), `yoyo: true`.
OUTPUT: Configured Tween instance(s).
VALIDATION:
[ ] Multi-word CSS properties use camelCase.
[ ] In `fromTo`, timing properties reside strictly in `toVars`.

STAGE 3: Timeline Choreography
INPUT: Multiple tweens requiring ordered or overlapping playback.
STEPS:
1. Initialize timeline: `const tl = gsap.timeline({ defaults: { ... } })`.
2. Chain animation calls sequentially (`tl.from(...).to(...)`).
3. Eliminate manual arithmetic delays across individual tweens.
OUTPUT: Coordinated GSAP Timeline instance.
VALIDATION:
[ ] Timeline executes sequentially without manual delay calculations.

STAGE 4: Interactive Control Binding (Optional)
INPUT: Tween or Timeline instance, UI control elements (Buttons).
STEPS:
1. Capture tween/timeline reference in a variable.
2. Bind DOM event listeners (`click`, `hover`) to control buttons.
3. Call `.play()`, `.pause()`, or `.restart()` on the animation reference.
OUTPUT: User-controlled interactive animation.
VALIDATION:
[ ] Animation pauses, plays, and resets without visual glitching.

STAGE 5: ScrollTrigger Integration
INPUT: Tween or Timeline, trigger element, viewport interaction spec.
STEPS:
1. In tween/timeline vars, add `scrollTrigger: { ... }`.
2. Define `trigger: selector`, `start: "top 80%"`, and `end: "top 30%"`.
3. Set `markers: true` during development for visual verification.
4. Set behavioral mode:
   - Discrete events: `toggleActions: "onEnter onLeave onEnterBack onLeaveBack"`
   - Scroll-linked progress: `scrub: true` or `scrub: <smoothSeconds>`
   - Sticky viewport element: `pin: true`, `pinSpacing: true`
OUTPUT: Scroll-synchronized animation.
VALIDATION:
[ ] Animation triggers at the designated viewport scroll intersection.
[ ] Scrubbing matches scroll velocity if enabled.
[ ] Pinned element stays locked during trigger duration without layout breakage.
```

---

## Phase 4: Skill Compilation

Below is the complete, validated agent skill package ready for deployment.

### File Tree

```
gsap-web-animation/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── examples.md
    └── scrolltrigger-cheat-sheet.md
```

---

### `gsap-web-animation/SKILL.md`

```markdown
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

---

## Phase 5: ScrollTrigger Integration

Bind tween or timeline playback to viewport scroll position:

1. Add the `scrollTrigger` configuration object to the tween or timeline vars:
   ```javascript
   gsap.to(".box", {
     x: 0,
     duration: 2,
     scrollTrigger: {
       trigger: ".box",
       start: "top 80%",
       end: "top 30%",
       toggleActions: "restart none none none",
       markers: false
     }
   });
   ```
2. **Coordinate Format**: Specify `start` and `end` as `"elementTriggerPoint viewportPoint"` (e.g., `"top 80%"` = when top of element hits 80% down the viewport).
3. **Scrubbing**: Use `scrub: true` or `scrub: 1` (seconds of smooth catch-up) to tie progress directly to scrollbar motion.
4. **Pinning**: Use `pin: true` and `pinSpacing: true` to fix an element in place during animation without breaking layout flow.

For complete ScrollTrigger options and toggle action matrix, see [scrolltrigger-cheat-sheet.md](references/scrolltrigger-cheat-sheet.md).

### Completion Gate
- [ ] Plugin registered before calling `scrollTrigger`.
- [ ] `start` and `end` values use valid boundary syntax.
- [ ] `toggleActions` contains exactly 4 valid space-separated keywords if scrub is not used.
```

---

### `gsap-web-animation/references/terminology.md`

```markdown
# Terminology

**Tween**:
A single animation instance created by GSAP that interpolates target element properties over time.
_Avoid_: transition, CSS keyframe

**Timeline**:
A container object that choreographs multiple tweens across a shared virtual playhead, eliminating manual delay calculations.
_Avoid_: delay chain, setTimeout sequence

**Vars Object**:
The JavaScript object passed to GSAP methods containing target property values and configuration settings (duration, ease, callbacks).
_Avoid_: options hash, CSS block

**Stagger**:
A timing offset applied between multiple elements matching the same selector, causing them to animate sequentially.
_Avoid_: waterfall delay, CSS animation-delay loop

**Ease**:
A mathematical timing function that modulates the rate of change across an animation's duration (e.g., `power2.out`, `power4.inOut`).
_Avoid_: transition timing, CSS bezier curve

**ScrollTrigger**:
The GSAP plugin responsible for linking tween/timeline execution, pinning, and scrubbing to scroll position.
_Avoid_: scroll listener, intersection observer wrapper

**Scrub**:
A mode in ScrollTrigger where animation progress is directly proportional to scrollbar position rather than time duration.
_Avoid_: scroll sync, parallax loop

**Pinning**:
Holding an element stationary in the viewport for the duration of a ScrollTrigger boundary while the scroll continues.
_Avoid_: position sticky, fixed scroll lock
```

---

### `gsap-web-animation/references/examples.md`

```markdown
# GSAP Code Examples

## 1. Explicit State Interpolation (`fromTo`)

**Scenario**: Entrance animation for an element arriving from offscreen left with custom easing, looping with yoyo.

```javascript
gsap.fromTo(
  ".ball",
  {
    x: -600,
    backgroundColor: "green"
  },
  {
    x: 500,
    backgroundColor: "orange",
    duration: 3,
    ease: "power4.inOut",
    repeat: -1,
    yoyo: true
  }
);
```

---

## 2. Multi-Element Stagger with Continuous Rotation

**Scenario**: Stagger four card/box elements sequentially while rotating and pulsing scale.

```javascript
gsap.to(".card", {
  rotation: 360,
  scale: 1.2,
  duration: 1.5,
  stagger: 0.2,
  repeat: -1,
  yoyo: true,
  ease: "power2.inOut"
});
```

---

## 3. Chained Hero Section Timeline

**Scenario**: Sequential entrance of hero title, paragraph text, and call-to-action button upon page load.

```javascript
const heroTl = gsap.timeline({
  defaults: { duration: 1.2, ease: "power3.out" }
});

heroTl
  .from(".hero-title", { x: -150, opacity: 0 })
  .from(".hero-description", { x: 150, opacity: 0 }, "-=0.4")
  .from(".hero-cta", { y: 40, opacity: 0 }, "-=0.2");
```

---

## 4. ScrollTrigger with Pinning and Scrubbing

**Scenario**: Fix an element in place during scroll while four indicators translate across the screen smoothly.

```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to(".indicator-ball", {
  x: 0,
  duration: 2,
  stagger: 0.5,
  scrollTrigger: {
    trigger: ".section-container",
    start: "top 80%",
    end: "top 20%",
    scrub: 1.5,
    pin: true,
    pinSpacing: true,
    markers: false
  }
});
```
```

---

### `gsap-web-animation/references/scrolltrigger-cheat-sheet.md`

```markdown
# ScrollTrigger Cheat Sheet

## Syntax Matrix

```javascript
gsap.to(".target", {
  x: 500,
  scrollTrigger: {
    trigger: ".container",       // Element that triggers the animation
    start: "top 80%",            // [trigger-edge, viewport-edge]
    end: "bottom 20%",           // [trigger-edge, viewport-edge]
    toggleActions: "play pause resume reset", // onEnter onLeave onEnterBack onLeaveBack
    scrub: 1,                    // true or seconds for smooth scrubbing
    pin: true,                   // Pin element during trigger active duration
    pinSpacing: true,            // Add padding so following elements don't overlap
    markers: true                // Show visual start/end indicator lines (debug only)
  }
});
```

## ToggleActions Keywords

`toggleActions: "1 2 3 4"` accepts 4 space-separated states:

| Position | Event | Typical
