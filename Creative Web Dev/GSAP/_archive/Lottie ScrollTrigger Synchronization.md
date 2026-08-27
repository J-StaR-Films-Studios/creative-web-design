# Source-to-Skill Compilation: Lottie ScrollTrigger Synchronization

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Video tutorial / code walkthrough |
| **Title** | How to Control Lottie Animations with GSAP ScrollTrigger |
| **Authority** | Greg Fine (*The Code Creative*), Full-Stack Engineer & Web Animation Instructor |
| **Coverage** | Loading Lottie animations via `lottie-web`, configuring GSAP ScrollTrigger plugin, scrubbing Lottie frames based on scroll position using `goToAndStop()` and `self.progress`. |

### Coverage Gaps Identified
- Advanced pinning (`pin: true`), multi-section timeline syncing, or bidirectional custom easing are mentioned as broader course topics but not covered in depth in this core implementation.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
- id: ku-001
  type: concept
  name: Lottie Animation
  source: src-01, "00:31-00:48"
  confidence: high
  definition: >
    A lightweight, scalable vector animation format exported as JSON data,
    rendered via SVG/Canvas in web applications.
  attributes: [json data, svg rendering, vector scalability, javascript api]
  avoid_terms: [gif animation, video file, css sprite]
  related: [ku-002, ku-003]

- id: ku-002
  type: concept
  name: Scroll Scrubbing
  source: src-01, "03:52-04:02"
  confidence: high
  definition: >
    Directly tying the playback position (playhead) of an animation to the
    scrollbar scroll position rather than real-time playback.
  attributes: [scroll-driven, progress ratio, playhead scrubbing]
  avoid_terms: [autoplay on scroll, scroll trigger firing once]
  related: [ku-004, ku-005]

- id: ku-003
  type: procedure
  name: Lottie Instance Initialization
  source: src-01, "01:47-03:05"
  confidence: high
  goal: Load and configure a Lottie animation instance without automatic playback
  prerequisites:
    - lottie-web script loaded
    - Target DOM container element available
    - Valid Lottie JSON file or URL
  steps:
    - action: Call lottie.loadAnimation with configuration object
      criterion: Returns animation item reference
    - action: Pass container DOM element reference
      criterion: Target container div matched by ID
    - action: Set path to JSON file
      criterion: Valid file path or remote URI specified
    - action: Set renderer to "svg"
      criterion: Vector sharpness preserved across screen resolutions
    - action: Set autoplay to false
      criterion: Animation does not run on page load
  outputs: [Lottie animation instance]
  related: [ku-001, ku-005]

- id: ku-004
  type: procedure
  name: GSAP ScrollTrigger Registration and Creation
  source: src-01, "03:06-04:02"
  confidence: high
  goal: Instantiate a ScrollTrigger watcher with scrubbing enabled
  prerequisites:
    - GSAP core and ScrollTrigger scripts loaded
  steps:
    - action: Register ScrollTrigger via gsap.registerPlugin(ScrollTrigger)
      criterion: Plugin attached to GSAP core
    - action: Create standalone ScrollTrigger instance via ScrollTrigger.create()
      criterion: Trigger configuration bound to target selector
    - action: Set trigger property to target container selector
      criterion: Defines start/end boundaries based on viewport intersection
    - action: Set scrub to true
      criterion: Binds playhead to scroll position
  outputs: [ScrollTrigger instance]
  related: [ku-002, ku-005]

- id: ku-005
  type: procedure
  name: Frame-to-Scroll Progress Synchronization
  source: src-01, "04:03-06:11"
  confidence: high
  goal: Map normalized scroll progress (0.0 to 1.0) to discrete Lottie animation frames
  prerequisites:
    - Lottie animation instance loaded (ku-003)
    - ScrollTrigger instance created (ku-004)
  steps:
    - action: Attach onUpdate callback on ScrollTrigger configuration
      criterion: Callback receives ScrollTrigger instance (self)
    - action: Extract self.progress normalized float (0 to 1)
      criterion: Accurate scroll fraction available
    - action: Calculate target frame using animation.totalFrames * self.progress
      criterion: Target frame corresponds to current scroll depth
    - action: Invoke animation.goToAndStop(targetFrame, true)
      criterion: Second argument is true to enforce frame-based seeking
  outputs: [Synchronized scroll-scrubbed vector animation]
  related: [ku-002, ku-003, ku-004]

- id: ku-006
  type: constraint
  name: Autoplay Must Be Disabled
  source: src-01, "02:57-03:05"
  confidence: high
  rule: >
    Lottie configuration autoplay property must be set to false when scrubbing.
  scope: Lottie initialization
  consequence: Automatic playback conflicts with manual scroll scrubbing.
  enforced_by: ku-003

- id: ku-007
  type: constraint
  name: Frame-Mode Flag In goToAndStop
  source: src-01, "06:05-06:11"
  confidence: high
  rule: >
    The isFrame parameter (second argument) of animation.goToAndStop must be set to true.
  scope: Frame synchronization callback
  consequence: Defaults to time-based (milliseconds), causing severe position desynchronization.
  enforced_by: ku-005
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Environment & Dependency Loading
INPUT: HTML document
STEPS:
  1. Load lottie-web library (CDN or bundle) — criterion: lottie global available.
  2. Load gsap core and ScrollTrigger plugin — criterion: gsap & ScrollTrigger globals available.
  3. Create DOM container (<div id="...">) — criterion: element accessible via DOM queries.
OUTPUT: Ready DOM environment with animation and tweening engines.

STAGE 2: Lottie Initialization
INPUT: Target DOM container ID, Lottie JSON file path
STEPS:
  1. Call lottie.loadAnimation().
  2. Set container to DOM element.
  3. Set renderer to "svg".
  4. Set autoplay to false.
  5. Store animation reference.
OUTPUT: Initialized, static Lottie animation instance.
VALIDATION:
  [ ] Animation does not self-play on page load.
  [ ] SVG markup is injected into container.

STAGE 3: ScrollTrigger Binding & Scrub Calculation
INPUT: Lottie instance reference, container selector
STEPS:
  1. Register plugin: gsap.registerPlugin(ScrollTrigger).
  2. Call ScrollTrigger.create() with target trigger and scrub: true.
  3. In onUpdate(self), compute frame: animation.totalFrames * self.progress.
  4. Call animation.goToAndStop(frame, true).
OUTPUT: Scroll-synchronized Lottie animation playback.
VALIDATION:
  [ ] Frame updates in lockstep with scrollbar movement.
  [ ] Scrolling to 0% displays frame 0.
  [ ] Scrolling to 100% displays final frame.
```

---

## Phase 4: Compiled Skill Package

Below is the complete compiled skill directory structure:

```
lottie-scrolltrigger-sync/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

### `lottie-scrolltrigger-sync/SKILL.md`

```markdown
---
name: lottie-scrolltrigger-sync
description: |
  Synchronize and scrub Lottie vector animations to scroll position using GSAP ScrollTrigger.
  Use when: creating scroll-driven animations, building scrollytelling web pages,
  binding Lottie JSON playback to scroll progress, or controlling vector playheads with scrollbars.
  Triggers: lottie scrolltrigger, scrub lottie, scroll driven lottie, sync lottie with scroll,
  gsap lottie animation, scrollytelling lottie.
---

# Lottie & GSAP ScrollTrigger Synchronization

Control vector Lottie animation playback interactively via scrollbar position by binding normalized ScrollTrigger progress directly to Lottie frame indices.

For domain definitions and anti-patterns, see [terminology.md](references/terminology.md).
For complete standalone code implementations, see [examples.md](references/examples.md).

---

## Phase 1: Dependency & DOM Setup

Prepare the HTML document with necessary scripts and container elements.

1. Load `lottie-web` (`v5.x` or higher) via package manager or CDN.
2. Load `gsap` core and `ScrollTrigger` plugin (`v3.x` or higher).
3. Create a dedicated container element with a unique ID (e.g., `<div id="lottie-container"></div>`).
4. Ensure the page or parent document contains sufficient scrollable height for testing.

### Completion gate
- [ ] `lottie` is available on the global/module scope.
- [ ] `gsap` and `ScrollTrigger` are available on the global/module scope.
- [ ] Container element exists in the DOM.

---

## Phase 2: Instantiate Lottie with Scrub Configuration

Initialize the Lottie player in a static, non-autoplay state.

1. Invoke `lottie.loadAnimation()` with an options configuration object.
2. Assign `container` to the DOM element (`document.getElementById("...")`).
3. Set `renderer` to `"svg"` for resolution-independent vector scaling.
4. Set `path` to the local or remote Lottie JSON file.
5. Set `autoplay: false` and `loop: false` to allow external playhead control.
6. Store the returned animation instance in a constant (e.g., `const animation`).

### Completion gate
- [ ] `autoplay` is explicitly set to `false`.
- [ ] `renderer` is set to `"svg"`.
- [ ] Animation instance is stored in a referenceable variable.

---

## Phase 3: Register and Configure GSAP ScrollTrigger

Bind scroll progress to the animation container.

1. Register the plugin once:
   ```javascript
   gsap.registerPlugin(ScrollTrigger);
   ```
2. Create a standalone ScrollTrigger instance via `ScrollTrigger.create()`.
3. Set `trigger` to the container ID selector (e.g., `"#lottie-container"`).
4. Set `scrub: true` to bind the playhead directly to the scrollbar movement.

### Completion gate
- [ ] `gsap.registerPlugin(ScrollTrigger)` is called prior to instance creation.
- [ ] `trigger` points to the valid container selector.
- [ ] `scrub` is enabled (`true` or numeric lag value).

---

## Phase 4: Map Scroll Progress to Animation Frames

Synchronize the scroll position to discrete Lottie frame playback using the `onUpdate` hook.

1. Add an `onUpdate` callback to the `ScrollTrigger.create()` options:
   ```javascript
   onUpdate: function (self) {
     const progress = self.progress;
     animation.goToAndStop(animation.totalFrames * progress, true);
   }
   ```
2. Extract `self.progress` (normalized float between `0.0` and `1.0`).
3. Calculate target frame index: `animation.totalFrames * self.progress`.
4. Call `animation.goToAndStop(targetFrame, true)`. The second parameter (`isFrame: true`) is mandatory to enforce frame-based scrubbing rather than milliseconds.

### Completion gate
- [ ] `onUpdate` receives `self` and extracts `self.progress`.
- [ ] `animation.goToAndStop()` is called with `true` as the second argument.
- [ ] Scrolling from top to bottom of trigger sweeps animation from frame 0 to `totalFrames`.
```

---

### `lottie-scrolltrigger-sync/references/terminology.md`

```markdown
# Terminology

**Lottie**:
An open-source, JSON-based vector animation format rendered dynamically on the web via SVG or Canvas.
_Avoid_: GIF, MP4 embed, CSS keyframe sprite

**Scroll Scrubbing**:
Directly binding an animation's playhead position to the user's scroll progress ratio (0.0 to 1.0).
_Avoid_: Scroll trigger toggle, trigger once, autoplay on scroll

**ScrollTrigger Progress (`self.progress`)**:
A normalized decimal value between 0.0 (entry point) and 1.0 (exit point) representing the viewport's relative traversal through the trigger zone.
_Avoid_: Pixel scroll offset, window.scrollY

**`goToAndStop(value, isFrame)`**:
The Lottie API method to advance the playhead to an exact location. When `isFrame` is `true`, `value` represents a frame index; when `false`, it represents milliseconds.
_Avoid_: `play()`, `goToAndPlay()`
```

---

### `lottie-scrolltrigger-sync/references/examples.md`

```markdown
# Implementation Examples

## Minimal Working Example (HTML + JS)

### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lottie + ScrollTrigger</title>
  <style>
    body {
      margin: 0;
      background-color: #b8ecf4;
    }
    .spacer {
      height: 100vh;
    }
    #lottie-container {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <div class="spacer"></div>
  <div id="lottie-container"></div>
  <div class="spacer"></div>

  <!-- CDN Dependencies -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

### `app.js`
```javascript
// 1. Initialize Lottie Animation
const animation = lottie.loadAnimation({
  container: document.getElementById("lottie-container"),
  path: "lottie/airplane.json",
  renderer: "svg",
  autoplay: false,
  loop: false
});

// 2. Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// 3. Bind ScrollTrigger to Frame Scrubbing
ScrollTrigger.create({
  trigger: "#lottie-container",
  start: "top bottom",
  end: "bottom top",
  scrub: true,
  onUpdate: function (self) {
    const progress = self.progress;
    if (animation.totalFrames) {
      animation.goToAndStop(animation.totalFrames * progress, true);
    }
  }
});
```
```

---

## Phase 5: Validation

1. **Source Fidelity Check**:
   - `lottie.loadAnimation` options (`container`, `path`, `renderer: "svg"`, `autoplay: false`) are verified and encoded.
   - `gsap.registerPlugin(ScrollTrigger)` is included.
   - `ScrollTrigger.create({ trigger, scrub, onUpdate })` is correctly documented.
   - Formula `animation.goToAndStop(animation.totalFrames * progress, true)` and the frame mode flag (`true`) are strictly validated.
2. **Scenario Walkthroughs**:
   - *Scenario A (Page Scroll Scrub)*: User scrolls page -> ScrollTrigger calculates `self.progress` -> Multiplies by `totalFrames` -> Lottie seeks to exact SVG frame. Validated.
   - *Scenario B (Reverse Scroll)*: User scrolls up -> `self.progress` decreases -> Lottie renders earlier frames smoothly. Validated.
   - *Scenario C (Initial Load)*: `autoplay: false` prevents playback until scroll triggers. Validated.

---

## Delivery Summary

1. **Compiled Skill**: `lottie-scrolltrigger-sync` with `SKILL.md`, `references/terminology.md`, and `references/examples.md`.
2. **Knowledge Units Extracted**: 7 total (2 concepts, 3 procedures, 2 constraints).
3. **Key Guardrails Included**: Enforced `autoplay: false` and the boolean `isFrame: true` flag in `goToAndStop`.
