# Source-to-Skill Processing Report: GSAP ScrollTrigger Scrubbing

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video / tutorial |
| **Title** | GSAP ScrollTrigger Tutorial #4: Scrubbing (`scrub` property) |
| **Authority** | Greg Fine (The Code Creative) — Web animation educator / GSAP specialist |
| **Coverage** | GSAP ScrollTrigger `scrub` boolean vs numeric smoothing, trigger positioning, bi-directional scroll synchronization, and real-world commercial production implementations |

### Coverage Gaps Identified
- Advanced scrubbing with timelines (`gsap.timeline({ scrollTrigger: ... })`) is referenced conceptually via multi-step web examples but not coded step-by-step in the isolated demo (which focuses on single `gsap.to()` tweens).

---

## Phase 2: Knowledge Extraction (Intermediate Representation)

```yaml
knowledge_spec:
  metadata:
    source_count: 1
    total_units: 9

  units:
    - id: ku-001
      type: concept
      name: Scroll Scrubbing
      source: src-01, "00:25 - 00:52"
      confidence: high
      definition: >
        The mechanism of directly binding and synchronizing the playback progress (playhead) of an animation to the user's scrollbar position.
      attributes:
        - bi-directional playback
        - 1:1 scroll-to-progress mapping
        - velocity/inertia smoothing
      avoid_terms: [scroll-triggered animation, standard trigger]
      related: [ku-002, ku-003]

    - id: ku-002
      type: procedure
      name: Basic Boolean Scrub Implementation
      source: src-01, "00:53 - 02:34"
      confidence: high
      goal: Bind tween progress directly to scroll position between start and end trigger markers.
      prerequisites:
        - GSAP core and ScrollTrigger plugin registered
        - Trigger element and scroll bounds defined
      steps:
        - action: Define the GSAP tween targeting the desired selector.
          criterion: Target element and animation end values (e.g., x, y, rotation) are specified.
        - action: Configure the `scrollTrigger` object with `trigger`, `start`, and `end` thresholds.
          criterion: Start and end boundary markers are set (e.g., start: "top 80%", end: "top 30%").
        - action: Set `scrub: true` inside the `scrollTrigger` configuration object.
          criterion: Animation playhead moves forward on downscroll and reverses on upscroll exactly matching scroll position.
      outputs:
        - Direct scroll-linked tween
      related: [ku-001, ku-003]

    - id: ku-003
      type: procedure
      name: Smooth Scrub Implementation (Dampened Scrubbing)
      source: src-01, "02:35 - 03:16"
      confidence: high
      goal: Apply inertial damping/smoothing to scroll scrubbing to prevent abrupt stops and create fluid motion.
      prerequisites:
        - Functioning `scrollTrigger` configuration
      steps:
        - action: Replace boolean `true` with a numeric value in seconds (e.g., `scrub: 1`, `scrub: 4`).
          criterion: `scrub` property receives a positive number representing lag/catch-up duration in seconds.
        - action: Tune the numeric duration based on desired weight and responsiveness.
          criterion: Playhead takes the specified duration to catch up to the current scroll position when scrolling halts.
      outputs:
        - Inertial/momentum-smoothed scroll animation
      related: [ku-001, ku-002]

    - id: ku-004
      type: principle
      name: Bi-Directional Scroll Synchronization
      source: src-01, "02:18 - 02:34"
      confidence: high
      statement: >
        When `scrub` is enabled, animation playback is inherently non-destructive and bi-directional; reversing scroll direction immediately reverses tween progress proportionally.
      rationale: >
        Scrub treats the scroll distance between start and end as a 0% to 100% timeline rather than an event-trigger threshold.
      applies_to: [ku-002, ku-003]

    - id: ku-005
      type: constraint
      name: Scrub-Trigger Bound Dependency
      source: src-01, "01:17 - 01:42"
      confidence: high
      rule: >
        The total duration and perceived speed of a scrubbed animation are governed exclusively by the pixel distance between `start` and `end` triggers, not by the GSAP tween's `duration` parameter.
      scope: All scrubbed tweens and timelines
      consequence: >
        Increasing the distance between start and end stretches the scroll travel required to complete the animation; altering the tween `duration` has no direct pacing effect under boolean scrub.
      enforced_by: ScrollTrigger internal calculation

    - id: ku-006
      type: example
      name: 3D Product Inspection (TakeBoost)
      source: src-01, "03:17 - 03:48"
      confidence: high
      scenario: Commercial product landing page presenting nutritional supplement details.
      application: >
        Bound the 3D rotation of a vitamin bottle to scroll progress, allowing the user to rotate the package and read ingredients at their own pace.
      outcome: Interactive, self-paced product demonstration that feels integrated with page narrative.
      illustrates: [ku-001, ku-002]

    - id: ku-007
      type: example
      name: Interactive Viewport Zoom & Framing (Google Pixel 5)
      source: src-01, "03:49 - 04:24"
      confidence: high
      scenario: Tech product showcase highlighting hardware details and display media.
      application: >
        Scrubbed rotation and scale tweens to tilt the device and expand the screen video frame as the user reaches key narrative sections.
      outcome: High-engagement interactive hardware showcase.
      illustrates: [ku-001, ku-003]

    - id: ku-008
      type: example
      name: Spatial Narrative / Metaphor Scrubbing (Bubbl Digital)
      source: src-01, "04:25 - 05:10"
      confidence: high
      scenario: Agency portfolio and services storytelling.
      application: >
        Scrubbed an animated floating bubble along a continuous path down the viewport, guiding the user through distinct service tiers and pushing past obstacles.
      outcome: Cohesive visual guide throughout the entire user scroll journey.
      illustrates: [ku-001, ku-003]

    - id: ku-009
      type: counterexample
      name: Boolean Scrub on High-Velocity Scroll
      source: src-01, "02:03 - 02:15, 03:03 - 03:16"
      confidence: medium
      scenario: Using `scrub: true` without numeric smoothing on abrupt mouse-wheel or trackpad flicking.
      mistake: Leaving scrub as raw boolean on complex or heavy UI transformations.
      consequence: Animation halts instantly on scroll stop, creating a rigid, jerky visual feel.
      correction: Apply a numeric scrub value (e.g., `scrub: 1` to `scrub: 2`) to introduce momentum dampening.
      illustrates: [ku-003, ku-005]
```

---

## Phase 3: Methodology Synthesis

### Stage 1: Trigger & Scroll-Bound Definition
- **Input**: Target element, DOM container, animation goal.
- **Steps**:
  1. Register `ScrollTrigger` plugin via `gsap.registerPlugin(ScrollTrigger)`.
  2. Select target DOM element and target CSS properties.
  3. Define `start` and `end` trigger points relative to element and viewport (e.g., `start: "top 80%"`, `end: "top 30%"`).
- **Decision Point**:
  - If wide travel/slow animation is required $\rightarrow$ Increase distance between `start` and `end`.
  - If fast/compact animation is required $\rightarrow$ Narrow distance between `start` and `end`.
- **Output**: Calibrated scroll boundary range.
- **Validation**: Trigger start and end markers align with target viewport entry/exit points.

### Stage 2: Scrub Mode Selection & Binding
- **Input**: Tween definition, user experience pacing requirements.
- **Steps**:
  1. Attach `scrollTrigger` object to `gsap.to()` / `gsap.from()` / `gsap.timeline()`.
  2. Choose scrub mode:
     - **Direct Synchronous**: `scrub: true` for strict lockstep.
     - **Damped Inertial**: `scrub: <number>` (e.g., `0.5` to `2.0` seconds) for organic catch-up lag.
  3. Validate bi-directional movement (scroll down $\rightarrow$ forward; scroll up $\rightarrow$ reverse).
- **Output**: Fully responsive, scroll-synchronized animation.
- **Validation**:
  - Playhead accurately tracks scrollbar position.
  - Reversing scroll reverses animation.
  - Inertial lag resolves smoothly without snapping.

---

## Phase 4: Compiled Skill Delivery

Below is the complete compiled skill package ready for deployment.

```
gsap-scroll-scrubbing/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

### File 1: `gsap-scroll-scrubbing/SKILL.md`

```markdown
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
```

---

### File 2: `gsap-scroll-scrubbing/references/terminology.md`

```markdown
# Terminology

**Scrubbing (Scroll Scrub)**:
The technique of linking the playhead of an animation directly to the scrollbar position such that scrolling forward advances the animation and scrolling backward reverses it.
_Avoid_: scroll trigger click, scroll threshold animation, scroll firing

**Damping (Numeric Scrub)**:
A numeric value specified in seconds representing the inertia or lag time required for the animation playhead to catch up to the current scrollbar position.
_Avoid_: animation delay, tween duration, transition timeout

**Scroll Trigger Bounds**:
The defined range between the `start` and `end` scroll markers across which 0% to 100% of the scrubbed animation is mapped.
_Avoid_: scroll limits, page heights, trigger distances

**Trigger**:
The target DOM element whose position relative to the viewport determines when scroll calculations activate.
_Avoid_: watcher, listener node, target observer
```

---

### File 3: `gsap-scroll-scrubbing/references/examples.md`

```markdown
# Worked Examples & Case Studies

## 1. 3D Product Package Rotation (TakeBoost Pattern)

**Scenario**: An e-commerce landing page where a supplement bottle rotates 360 degrees as the user scrolls, revealing nutritional facts and branding without forcing a 3D canvas reload.

**Implementation**:
```javascript
gsap.to(".product-bottle", {
  rotationY: 360,
  scrollTrigger: {
    trigger: ".product-section",
    start: "top 75%",
    end: "bottom 25%",
    scrub: 1.2
  }
});
```

**Outcome**: The user controls product inspection speed via natural scroll speed.
**Key Lesson**: Using a moderate numeric scrub (`1.2s`) softens abrupt wheel ticks into continuous rotation.

---

## 2. Interactive Viewport Framing & Media Zoom (Google Pixel 5 Pattern)

**Scenario**: A hardware presentation where a phone model enters the frame, tilts to show edge details, and expands a video screen into full focus.

**Implementation**:
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".device-showcase",
    start: "top top",
    end: "+=1500",
    scrub: 0.8,
    pin: true
  }
});

tl.to(".phone-chassis", { rotation: -15, scale: 1.1 })
  .to(".screen-content", { scale: 1.8 }, "<");
```

**Outcome**: Pinning the section while scrubbing creates a guided, cinematic vignette that stays anchored during playback.
**Key Lesson**: Timeline scrubbing maintains precise choreography across multiple sub-properties simultaneously.

---

## 3. Persistent Narrative Path Guide (Bubbl Digital Pattern)

**Scenario**: An agency site where a branded graphic asset (e.g., an animated bubble) traverses the entire page height, interacting with section headings and icons along the way.

**Implementation**:
```javascript
gsap.to(".floating-bubble", {
  y: "400vh",
  x: "random(-50, 50)",
  scale: 1.5,
  scrollTrigger: {
    trigger: ".page-wrapper",
    start: "top top",
    end: "bottom bottom",
    scrub: 2.0
  }
});
```

**Outcome**: The bubble acts as a physical scroll progress tracker, unifying multi-section layouts.
**Key Lesson**: Higher scrub values (`2.0s+`) generate buoyant, physics-like follow-through.
```

---

## Phase 5: Validation & Verification Summary

### Source Fidelity Checklist
- [x] Boolean scrubbing (`scrub: true`) fully captured with syntax and behavioral description.
- [x] Numeric smooth scrubbing (`scrub: <number>`) extracted and parameterized.
- [x] Start/end threshold relationship to animation pacing operationalized.
- [x] Bi-directional scroll-reversal mechanics codified.
- [x] All 3 commercial case studies (TakeBoost, Google Pixel 5, Bubbl Digital) formalized into structured reference patterns.

### Operational Verification
1. **Basic 1:1 Implementation**: Addressed in Phase 2 Mode A.
2. **Smooth Inertial Dampening**: Addressed in Phase 2 Mode B with tuning heuristics.
3. **Multi-element Scroll Pinning/Pacing**: Captured in reference examples.
