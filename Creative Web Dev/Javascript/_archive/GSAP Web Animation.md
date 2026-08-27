# Source-to-Skill Compilation Report: GSAP Web Animation

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes & code walkthrough transcript |
| **Title** | The Standard for Modern Web Animation: GSAP 3 Full Course & Practical Methodology |
| **Authority** | HuXn WebDev (Full-Stack Web Development & Animation Instructor) |
| **Coverage** | JavaScript animation fundamentals vs. GSAP, Tween creation (`gsap.to`, `gsap.from`, `gsap.fromTo`), zero-duration property setting (`gsap.set`), animation timing & repeat properties, multi-element staggering (`stagger` object syntax), tween control APIs (`play`, `pause`, `restart`), GSAP Timelines (`gsap.timeline`), timeline defaults & refactoring, GSAP Ease Visualizer & easing functions (`power`, `bounce`, `elastic`, `back`), and real-world landing page animation assembly. |

### Coverage Gaps Identified
- Advanced plugin integrations (ScrollTrigger, Flip, MorphSVG, SplitText) are previewed at a high level but not coded line-by-line.
- Framework wrappers (React `useGSAP` hook, Vue integration) are mentioned as ecosystem concepts but implementation uses standard DOM APIs.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# KNOWLEDGE SPECIFICATION: GSAP WEB ANIMATION METHODOLOGY
# Intermediate Representation (IR)
# ==============================================================================

# --- CONCEPTS ---

- id: ku-001
  type: concept
  name: GSAP Object
  source: src-01, "00:50 - 01:25, 12:20 - 12:50"
  confidence: high
  definition: >
    The global JavaScript namespace object that acts as the access point for creating,
    configuring, and controlling all GSAP tweens, timelines, and plugins.
  attributes: [global access point, method provider, tween creator]
  avoid_terms: [animation manager, script runner]
  related: [ku-002, ku-007]

- id: ku-002
  type: concept
  name: Tween
  source: src-01, "09:36 - 13:15"
  confidence: high
  definition: >
    A single animation instance that interpolates one or more properties of target
    DOM elements or JavaScript objects over time.
  attributes: [target selector, vars object, duration, property interpolation]
  avoid_terms: [CSS transition, frame script]
  related: [ku-001, ku-003, ku-004, ku-005, ku-006]

- id: ku-003
  type: concept
  name: Vars Object
  source: src-01, "13:10 - 14:40"
  confidence: high
  definition: >
    A JavaScript configuration object passed to a tween or timeline containing the destination
    property values, animation special properties (duration, ease, repeat, yoyo), and callbacks.
  attributes: [property mapping, camelCase keys, unit-aware values]
  avoid_terms: [options parameter, style bundle]
  related: [ku-002, ku-011, ku-012]

- id: ku-004
  type: concept
  name: Stagger
  source: src-01, "27:12 - 32:51"
  confidence: high
  definition: >
    The distribution of start times across multiple target elements matching a single selector,
    producing offset sequential or wave-like animation executions.
  attributes: [multi-target, amount, each, from origin, grid distribution, axis]
  avoid_terms: [delay loop, sequence interval]
  related: [ku-002, ku-013]

- id: ku-005
  type: concept
  name: Timeline
  source: src-01, "37:26 - 43:30"
  confidence: high
  definition: >
    A container object that sequences multiple tweens and callbacks along a synchronized
    playback timeline without requiring manual delay calculations.
  attributes: [tween sequencing, shared defaults, collective playback control, nesting]
  avoid_terms: [animation queue, callback chain]
  related: [ku-002, ku-007, ku-014]

- id: ku-006
  type: concept
  name: Easing
  source: src-01, "58:06 - 59:38"
  confidence: high
  definition: >
    The mathematical rate of change of a property over time that gives animation
    natural physical qualities (acceleration, deceleration, elasticity, bounce).
  attributes: [power curves, sine, back, elastic, bounce, in/out/inOut direction]
  avoid_terms: [timing function, speed modifier]
  related: [ku-003, ku-015]

# --- PRINCIPLES ---

- id: ku-010
  type: principle
  name: Model Initial State Before Dynamic Motion
  source: src-01, "17:58 - 19:35, 47:50 - 49:20"
  confidence: high
  statement: >
    Always configure starting positions, opacities, and layout constraints before initiating
    motion sequences. Use gsap.set() or gsap.fromTo() rather than relying on uninitialized DOM states.
  rationale: >
    Prevents Flash of Unstyled Content (FOUC) and ensures deterministic animation
    behavior across browser refreshes and dynamic user interactions.
  applies_to: [ku-020, ku-022, ku-023]

- id: ku-011
  type: principle
  name: Use Timelines Over Manual Delays
  source: src-01, "37:26 - 38:50, 42:00 - 43:15"
  confidence: high
  statement: >
    Construct complex animation sequences using gsap.timeline() rather than standalone tweens
    with calculated delay properties.
  rationale: >
    Manual delays create brittle coupling: changing the duration of an early animation requires
    recalculating every downstream delay. Timelines manage position and sequence automatically.
  applies_to: [ku-024, ku-025]

- id: ku-012
  type: principle
  name: Centralize Common Animation Properties in Defaults
  source: src-01, "42:25 - 43:30, 56:10 - 56:45"
  confidence: high
  statement: >
    Extract recurring tween properties (duration, ease) into the timeline defaults configuration object.
  rationale: >
    Enforces visual consistency across the entire animation suite and minimizes repetitive boilerplate.
  applies_to: [ku-024, ku-025]

# --- PROCEDURES ---

- id: ku-020
  type: procedure
  name: Construct Basic Tweens (to, from, fromTo)
  source: src-01, "09:36 - 27:11"
  confidence: high
  goal: Animate single or grouped DOM elements to, from, or between explicit states.
  prerequisites: [GSAP script loaded, target elements rendered in DOM]
  steps:
    - action: Select target DOM element using CSS selector string or element reference
      criterion: Target resolves to one or more valid DOM nodes
    - action: Choose tween method based on state lifecycle (to for destination, from for natural entrance, fromTo for deterministic range)
      criterion: Correct method selected based on known starting/ending values
    - action: Define numerical and transform properties in vars object
      criterion: Properties use camelCase (e.g. borderRadius, x, y, opacity)
    - action: Configure playback dynamics (duration in seconds, ease, repeat, yoyo)
      criterion: Duration set in seconds; infinite loops use repeat: -1
  outputs: [Active GSAP Tween instance]
  related: [ku-002, ku-003, ku-010]

- id: ku-021
  type: procedure
  name: Apply Zero-Duration State Configuration
  source: src-01, "17:14 - 20:53"
  confidence: high
  goal: Immediately apply stylistic and spatial properties to elements without animation.
  prerequisites: [Target elements rendered in DOM]
  steps:
    - action: Call gsap.set() with target selector and properties
      criterion: Properties apply instantaneously (0-second duration)
    - action: Verify baseline styling matches layout requirements
      criterion: Opacity, coordinate offsets, or transforms match target initial state
  outputs: [Configured DOM baseline state]
  related: [ku-002, ku-010]

- id: ku-022
  type: procedure
  name: Configure Multi-Element Stagger Sequences
  source: src-01, "27:12 - 32:51"
  confidence: high
  goal: Create wave-like or sequential offset animations across multiple matched elements.
  prerequisites: [Multi-element selector matching 2+ DOM nodes]
  steps:
    - action: Pass a multi-element selector to tween method
      criterion: Selector targets multiple sibling or grouped elements
    - action: Supply stagger configuration as either a number (seconds between each element) or an advanced configuration object
      criterion: Advanced object specifies amount or each, from origin, grid dimensions, and axis
    - action: Set tween motion properties (y, scale, opacity, borderRadius)
      criterion: Target motion values applied across all staggered elements
  outputs: [Staggered multi-element animation]
  related: [ku-004, ku-020]

- id: ku-023
  type: procedure
  name: Implement Interactive Playback Control
  source: src-01, "32:52 - 37:25"
  confidence: high
  goal: Bind animation playback actions (play, pause, restart, reverse) to UI trigger events.
  prerequisites: [Tween or timeline assigned to a variable, trigger elements present in DOM]
  steps:
    - action: Assign tween or timeline instance to a variable
      criterion: Variable holds a valid GSAP Animation instance
    - action: Select UI control elements (buttons, toggles)
      criterion: DOM query selectors resolved
    - action: Attach click event listeners invoking tween control methods (.play(), .pause(), .restart())
      criterion: Method invocation properly controls the animation instance without memory leaks or duplicate tweens
  outputs: [Event-driven interactive animation system]
  related: [ku-002, ku-005]

- id: ku-024
  type: procedure
  name: Assemble Timeline Orchestration
  source: src-01, "37:26 - 47:20, 56:10 - 58:05"
  confidence: high
  goal: Sequence multi-stage, multi-element visual scenes into a single controllable timeline.
  prerequisites: [DOM structure prepared with semantic classes/IDs]
  steps:
    - action: Instantiate timeline with gsap.timeline() and configure global defaults
      criterion: Timeline initialized with default duration and ease
    - action: Chain tween methods (.to, .from, .fromTo, .set) in sequence of desired visual appearance
      criterion: Each animation executes after preceding tween finishes without manual delay offsets
    - action: Use relative position parameters or explicit offsets when overlaps are needed
      criterion: Timing overlaps flow naturally without breaking timeline structure
  outputs: [Cohesive, sequenced animation timeline]
  related: [ku-005, ku-011, ku-012]

# --- CONSTRAINTS ---

- id: ku-030
  type: constraint
  name: Time Values in Seconds
  source: src-01, "15:05 - 15:10, 50:00 - 50:30"
  confidence: high
  rule: >
    GSAP measures all durations, delays, staggers, and position parameters in seconds,
    never milliseconds. Do not append "s" or "ms" to numeric values in the vars object.
  scope: Global GSAP configuration
  consequence: >
    Passing string units like "2s" or millisecond numbers like 2000 causes parsing errors
    or excessively long 2000-second animations.
  enforced_by: Tween argument validation

- id: ku-031
  type: constraint
  name: Transform Shorthands Over CSS String Transforms
  source: src-01, "14:40 - 15:00, 43:35 - 44:00"
  confidence: high
  rule: >
    Use GSAP transform aliases (x, y, xPercent, yPercent, scale, rotate, rotation)
    instead of raw CSS transform strings (e.g. `transform: "translateX(100px)"`).
  scope: Vars object property definitions
  consequence: >
    GSAP parses independent transform components for accelerated GPU matrix composition.
    Raw strings bypass internal matrix caching and prevent individual component interpolation.
  enforced_by: GSAP vars object specification

# --- EXAMPLES & COUNTEREXAMPLES ---

- id: ku-040
  type: example
  name: Complete Hero Section Reveal Sequence
  source: src-01, "47:21 - 58:05"
  confidence: high
  scenario: Revealing a landing page with a sidebar, hero image, and staggered text content.
  application: >
    Created a timeline with defaults: { duration: 1, ease: 'linear' }.
    Chained sidebar entrance (fromTo width 0 to 30%), hero image slide-in (fromTo x: 100 to 0),
    rotated main title reveal (fromTo y: -100 to -90deg rotation), and paragraph info fade-in.
  outcome: Perfectly synchronized, frame-accurate landing page animation without manual delay math.
  illustrates: [ku-011, ku-012, ku-024]

- id: ku-050
  type: counterexample
  name: Vanilla JS Style Toggle for Complex Animation
  source: src-01, "00:58 - 09:35"
  confidence: high
  scenario: Building a sliding sidebar navigation using pure CSS transitions and classList toggling.
  mistake: Writing extensive CSS transitions, state classes (.hide), and manual event handling in JS.
  consequence: Brittle code, difficulty coordinating multi-step sequences, lack of timeline scrub/pause/reverse controls.
  correction: Replace manual CSS class manipulation with GSAP tweens and timelines for precision control.
  illustrates: [ku-001, ku-005]
```

---

## Phase 3: Methodology Synthesis

### Stage 1: Target & Baseline State Setup
- **Input**: Target DOM elements, layout requirements, starting visual states.
- **Steps**:
  1. Identify target DOM elements and verify their CSS query selectors.
  2. Establish whether initial states require immediate rendering before motion starts.
  3. Execute `gsap.set()` on elements that must start hidden (`opacity: 0`), scaled down (`scale: 0`), or positioned off-screen (`x` / `y` offsets).
- **Validation**:
  - [ ] No unstyled flash occurs on page load.
  - [ ] Elements hold exact initial coordinates before animation trigger.

### Stage 2: Tween Construction & Configuration
- **Input**: Visual motion parameters (coordinates, rotation, scale, color), timing specifications.
- **Steps**:
  1. Choose appropriate tween method:
     - `gsap.to()`: For moving elements from natural state to destination.
     - `gsap.from()`: For natural entrance from an offset state to default CSS.
     - `gsap.fromTo()`: When both starting and ending values must be strictly guaranteed.
  2. Populate the vars object using standard GSAP transform shorthands (`x`, `y`, `scale`, `rotate`, `borderRadius`).
  3. Configure numeric timing in seconds (`duration: 1`, `delay: 0.5`).
  4. Specify easing function (`power1.out`, `bounce.out`, `elastic.out`).
  5. Apply loop controls if continuous motion is required (`repeat: -1`, `yoyo: true`).
- **Validation**:
  - [ ] All durations are pure numbers representing seconds.
  - [ ] CSS properties use camelCase formatting.

### Stage 3: Multi-Element Stagger Choreography
- **Input**: Array or NodeList of sibling/grouped elements.
- **Steps**:
  1. Pass group selector matching target nodes (e.g. `".box"` or `".nav-item"`).
  2. Configure stagger parameter:
     - Simple: `stagger: 0.2` (delay in seconds between each item).
     - Advanced: `stagger: { amount: 1.5, from: "center", ease: "power1.inOut" }`.
  3. Verify sequence flow and spatial distribution across viewport.
- **Validation**:
  - [ ] Stagger offsets execute smoothly across all matched nodes.
  - [ ] `from` origin matches intended visual focal point (`"start"`, `"center"`, `"end"`, `"edges"`, `"random"`).

### Stage 4: Timeline Sequence Orchestration & Refactoring
- **Input**: Multiple individual tween stages intended to play in a coordinated narrative.
- **Steps**:
  1. Instantiate timeline: `const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } })`.
  2. Append tweens sequentially: `tl.to(...)`, `tl.fromTo(...)`, `tl.set(...)`.
  3. Eliminate duplicated durations and eases by delegating to timeline defaults.
  4. Attach control listeners to trigger elements (`tl.play()`, `tl.pause()`, `tl.restart()`).
- **Validation**:
  - [ ] Sequence runs smoothly without manual delay calculations.
  - [ ] Timeline methods (`play`, `pause`, `restart`) control the entire sequence simultaneously.

---

## Phase 4: Skill Compilation

Below is the complete, self-contained compiled skill package ready for deployment.

### File Tree
```
gsap-web-animation/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── examples.md
    └── easing-reference.md
```

---

### `gsap-web-animation/SKILL.md`

```markdown
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

---

## Phase 5: Timeline Orchestration & Scene Assembly

Sequence complex multi-element visual narratives into a unified timeline.

1. Instantiate a timeline and set shared defaults:
   ```javascript
   const tl = gsap.timeline({
     defaults: {
       duration: 1,
       ease: "power2.out"
     }
   });
   ```
2. Chain sequential steps without manual delay calculations:
   ```javascript
   tl.fromTo(".sidebar", { width: 0 }, { width: "30%", opacity: 1 })
     .fromTo(".main-img", { x: 100, opacity: 0 }, { x: 0, opacity: 1 }, "-=0.3") // 0.3s overlap
     .fromTo(".main-title", { y: -80, opacity: 0 }, { y: 0, opacity: 1 })
     .fromTo(".main-info", { opacity: 0 }, { opacity: 1 });
   ```
3. Refactor repetitive inline properties by migrating common parameters into `timeline({ defaults: { ... } })`.

For complete end-to-end code implementations, see [examples.md](references/examples.md).

### Completion Gate
- [ ] All sequential tweens consolidated inside a `gsap.timeline()`.
- [ ] Common durations and easings moved to `defaults`.
- [ ] No hardcoded cumulative delays used to sequence animations.
- [ ] Relative position offsets (e.g. `"-=0.5"`) used where smooth overlaps are needed.
```

---

### `gsap-web-animation/references/terminology.md`

```markdown
# Terminology

**GSAP (GreenSock Animation Platform)**:
The high-performance JavaScript animation library used to animate CSS properties, SVG, canvas, and generic JavaScript objects.
_Avoid_: CSS animator, animation engine script

**Tween**:
A single animation instance that interpolates property values of target objects over a specified duration.
_Avoid_: CSS keyframe, transition script

**Timeline**:
A container for sequencing, nesting, and managing multiple tweens and callbacks along a synchronized global playhead.
_Avoid_: animation chain, timeout queue

**Vars Object**:
The JavaScript key-value configuration object passed to GSAP methods defining destination values, timing, easing, and callbacks.
_Avoid_: options object, style dictionary

**Stagger**:
An animation parameter that offsets the start time of animations across an array of target elements matching a single selector.
_Avoid_: delay loop, manual interval

**Ease**:
The mathematical acceleration and deceleration curve governing the rate of property change throughout a tween's duration.
_Avoid_: speed curve, timing function

**Zero-Duration Tween (gsap.set)**:
An instantaneous property assignment executed through GSAP to establish baseline visual states without time-based interpolation.
_Avoid_: manual CSS override, instant animation
```

---

### `gsap-web-animation/references/examples.md`

```markdown
# Worked Animation Examples

## 1. Interactive Sliding Sidebar Navigation

**Scenario**: A sliding navigation sidebar controlled via an interactive toggle button.

```javascript
// Baseline setup
gsap.set(".sidebar", { x: -240 });

const toggleBtn = document.querySelector(".toggle-btn");
let isOpen = false;

const sidebarTween = gsap.to(".sidebar", {
  x: 0,
  duration: 0.6,
  ease: "power2.out",
  paused: true
});

toggleBtn.addEventListener("click", () => {
  if (!isOpen) {
    sidebarTween.play();
  } else {
    sidebarTween.reverse();
  }
  isOpen = !isOpen;
});
```

**Key lesson**: Use `paused: true` and `.reverse()` to create clean two-way UI toggles with a single tween instance.

---

## 2. Advanced 2D Grid Stagger Reveal

**Scenario**: Revealing a grid of card elements emanating from the center outward.

```javascript
gsap.fromTo(".card", 
  {
    scale: 0,
    opacity: 0,
    borderRadius: "100px"
  },
  {
    scale: 1,
    opacity: 1,
    borderRadius: "8px",
    duration: 0.8,
    stagger: {
      amount: 1.2,
      from: "center",
      grid: [4, 6],
      ease: "power1.out"
    },
    ease: "back.out(1.7)"
  }
);
```

**Key lesson**: `stagger.amount` guarantees the total distribution time across all cards regardless of grid item count.

---

## 3. Coordinated Hero Landing Page Sequence

**Scenario**: A choreographed landing page reveal with sliding sidebar, hero image entrance, rotated title, and text content.

```javascript
const heroTimeline = gsap.timeline({
  defaults: {
    duration: 1,
    ease: "power2.out"
  }
});

heroTimeline
  // Step 1: Sidebar reveals from left
  .fromTo(".sidebar", 
    { width: 0, opacity: 0 }, 
    { width: "30%", opacity: 1, duration: 1.2 }
  )
  // Step 2: Main image slides in with slight overlap
  .fromTo(".main-img", 
    { x: 150, opacity: 0 }, 
    { x: 0, opacity: 1 }, 
    "-=0.4"
  )
  // Step 3: Rotated main headline reveals
  .fromTo(".main-title", 
    { y: -100, rotate: -90, opacity: 0 }, 
    { y: 0, rotate: -90, opacity: 1 }
  )
  // Step 4: Body copy fades in smoothly
  .fromTo(".main-info", 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0 }, 
    "-=0.5"
  );
```

**Key lesson**: Timeline defaults reduce code duplication while position parameter offsets (`"-=0.4"`) create natural motion overlaps.
```

---

### `gsap-web-animation/references/easing-reference.md`

```markdown
# GSAP Easing Reference

Access the GreenSock Ease Visualizer at `greensock.com/ease-visualizer` to preview and test mathematical curves.

## Standard Eases & Curves

| Ease Name | Behavior & Feel | Typical Use Case |
|---|---|---|
| `none` / `linear` | Constant speed from start to finish | Continuous rotations, background pans, marquee tickers |
| `power1` (`quad`) | Gentle acceleration / deceleration | Subtle UI fades, soft micro-interactions |
| `power2` (`cubic`) | Moderate, natural motion curve | Standard UI transitions, cards, modals |
| `power3` (`quart`) | Strong acceleration into smooth deceleration | Hero entrances, bold sliding menus |
| `power4` (`quint`) | Aggressive start with dramatic deceleration | High-impact reveals, sports/gaming UI |
| `expo` | Extreme exponential acceleration/deceleration | Fast snappiness, heavy component entries |
| `sine` | Very soft sinusoidal curve | Breathing animations, floating elements |

## Specialty Physics Eases

| Ease Name | Parameters / Config | Visual Effect |
|---|---|---|
| `back` | `back.out(overshoot)` (e.g. `back.out(1.7)`) | Overshoots destination before settling |
| `elastic` | `elastic.out(amplitude, period)` | Bouncy spring-like elasticity |
| `bounce` | `bounce.out`, `bounce.in`, `bounce.inOut` | Realistic gravity bouncing on collision |
| `slow` | `slow(linearRatio, power, yoyoMode)` | Slows in the middle, speeds at edges |
| `steps` | `steps(number)` (e.g. `steps(12)`) | Stepped quantization (pixel art, sprite sheets) |

## Direction Suffixes

- **`.out`** (Default): Fast start, slows at the end (best for UI entrances).
- **`.in`**: Slow start, accelerates at the end (best for UI exits).
- **`.inOut`**: Slow start, fast middle, slow end (best for loops and reversible state changes).
```

---

## Phase 5: Validation & Delivery

### Validation Matrix
1. **Source Fidelity**:
   - `gsap.to`, `gsap.from`, `gsap.fromTo` mapped directly to Phase 2.
   - `gsap.set` zero-duration pattern mapped to Phase 1.
   - `stagger` numeric and object syntax (`amount`, `each`, `from`, `grid`, `axis`) fully codified in Phase 3.
   - Timeline orchestration and defaults refactoring mapped to Phase 5.
   - Playback controls (`play`, `pause`, `restart`) mapped to Phase 4.
   - Ease visualizer curves catalogued in `references/easing-reference.md`.
2. **Operational Verification**:
   - Scenario 1: *User wants to build an interactive animated sidebar.* -> Handled via `Phase 4` and `examples.md#1`.
   - Scenario 2: *User wants a staggered grid entrance.* -> Handled via `Phase 3` and `examples.md#2`.
   - Scenario 3: *User wants a cohesive landing page intro.* -> Handled via `Phase 5` and `examples.md#3`.
3. **Writing Constraints Checklist**:
   - [x] SKILL.md under 500 lines.
   - [x] All steps written in imperative action form with clear completion gates.
   - [x] Progressive disclosure pattern used (`references/` separation).
   - [x] No negative-only steering or default no-ops.

The compiled skill package is complete and ready for integration into agent workflows.
