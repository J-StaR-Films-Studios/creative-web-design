# Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / transcript walkthrough |
| **Title** | *Introducing ScrollTrigger by GreenSock (GSAP)* |
| **Authority** | GreenSock Official Documentation / Walkthrough (Authoritative) |
| **Coverage** | GSAP ScrollTrigger installation, basic tween/timeline integration, `toggleActions`, custom `start`/`end` positions, markers, `scrub` (lock vs. smoothed delay), `pin` and `pinSpacing`, horizontal snapping sections, callbacks (`onEnter`, `onLeave`, `onEnterBack`, `onLeaveBack`, `onUpdate`, `onToggle`), `toggleClass`, `id`/`getById`, global defaults, custom `scroller`, and horizontal mode. |

### Coverage Gaps
- Fast scroll / refresh rate recalculations on mobile navigation bars (partially addressed by `anticipatePin` and function-based values, but full scroll-smoother workflows require additional plugins).

---

# Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==========================================
# KNOWLEDGE SPEC: GSAP ScrollTrigger
# Source: src-01 (GSAP Official Video)
# ==========================================

- id: ku-001
  type: concept
  name: ScrollTrigger Plugin
  source: src-01, "0:00-0:10"
  confidence: high
  definition: >
    A GSAP plugin that triggers, scrubs, pins, or snaps GSAP animations
    and callbacks based on the scroll position of the viewport or a custom container.
  avoid_terms: [scroll listener, scroll observer, scroll jacker]
  related: [ku-002, ku-003]

- id: ku-002
  type: procedure
  name: Plugin Registration and Basic Binding
  source: src-01, "1:45-2:48"
  confidence: high
  goal: Prevent animations from executing before scrolling into view
  steps:
    - action: Register plugin via gsap.registerPlugin(ScrollTrigger)
      criterion: ScrollTrigger is registered before creating tweens
    - action: Add scrollTrigger property to tween or timeline vars
      criterion: scrollTrigger points to target selector or config object
  outputs: [scroll-activated tween]
  related: [ku-001, ku-003]

- id: ku-003
  type: concept
  name: Toggle Actions (toggleActions)
  source: src-01, "2:49-5:10"
  confidence: high
  definition: >
    A 4-part string determining how an animation responds at four distinct
    scroll boundary crossing events: onEnter, onLeave, onEnterBack, and onLeaveBack.
  attributes:
    - positions: [onEnter, onLeave, onEnterBack, onLeaveBack]
    - valid_keywords: [play, pause, resume, reverse, restart, reset, complete, none]
    - default: "play none none none"
  avoid_terms: [scroll callbacks string, animation events]
  related: [ku-004]

- id: ku-004
  type: procedure
  name: Positioning Scroll Boundaries (start and end)
  source: src-01, "5:11-8:51"
  confidence: high
  goal: Define exact trigger collision thresholds for animation lifecycle
  steps:
    - action: Define start property as "[trigger-position] [scroller-position]"
      criterion: Defaults to "top bottom" if omitted
    - action: Define end property as absolute offset or relative string
      criterion: Defaults to "bottom top" or relative distance like "+=300"
    - action: Use function-based strings for dynamic responsive sizing
      criterion: Function returns string like () => "+=" + el.offsetWidth
    - action: Enable markers: true during development
      criterion: Visual indicators render start, end, scroller-start, scroller-end
  outputs: [precisely mapped scroll triggers]
  related: [ku-003, ku-005]

- id: ku-005
  type: concept
  name: Scrubbing (scrub)
  source: src-01, "8:52-10:57"
  confidence: high
  definition: >
    Direct linkage of the animation playhead to the scrollbar progress
    between start and end positions.
  attributes:
    - boolean: true (instant 1:1 lock)
    - numeric: float/integer (seconds of catch-up smoothing lag)
  avoid_terms: [scroll jacking, scroll tracking]
  related: [ku-006]

- id: ku-006
  type: concept
  name: Pinning (pin & pinSpacing)
  source: src-01, "10:58-14:51"
  confidence: high
  definition: >
    Fixing a DOM element in place in the viewport while the scroll position
    is between start and end.
  attributes:
    - pin: boolean | selector string | DOM element
    - pinSpacing: boolean (defaults to true; adds padding below pinned element)
  avoid_terms: [sticky positioning, fixed positioning hack]
  related: [ku-005, ku-007]

- id: ku-007
  type: procedure
  name: Horizontal Snapping Sections
  source: src-01, "14:52-17:44"
  confidence: high
  goal: Transform vertical scroll into horizontal panel translation with snapping
  steps:
    - action: Set overflow-x: hidden on the container/body
      criterion: Native horizontal scroll is prevented
    - action: Tween panel container xPercent to -100 * (count - 1) with ease: "none"
      criterion: Linear translation across all sections
    - action: Configure ScrollTrigger with pin: true, scrub: 1, and snap: 1 / (count - 1)
      criterion: Viewport locks and snaps organically to nearest section
    - action: Set end dynamically based on container offsetWidth
      criterion: end: () => "+=" + container.offsetWidth
  outputs: [snapped horizontal scroll experience]
  related: [ku-005, ku-006]

- id: ku-008
  type: concept
  name: Standalone ScrollTrigger & Callbacks
  source: src-01, "17:45-21:24"
  confidence: high
  definition: >
    ScrollTrigger instance created independently via ScrollTrigger.create()
    exposing event hooks (onEnter, onLeave, onEnterBack, onLeaveBack, onUpdate, onToggle)
    and class toggling without requiring a GSAP tween.
  attributes:
    - hooks: [onEnter, onLeave, onEnterBack, onLeaveBack, onUpdate, onToggle]
    - helpers: [toggleClass, id, ScrollTrigger.getById, ScrollTrigger.defaults, scroller, horizontal]
  related: [ku-001, ku-003]
```

---

# Phase 3: Methodology Synthesis

### Stage 1: Registration & Initial Binding
- **Input**: GSAP core script, ScrollTrigger plugin script, DOM markup.
- **Steps**:
  1. Call `gsap.registerPlugin(ScrollTrigger)` once before creating any animation.
  2. For simple triggers, attach `scrollTrigger: ".selector"` directly inside tween variables.
- **Validation**:
  - `[ ]` Animation only plays when element enters the viewport.

### Stage 2: Interaction Configuration (`toggleActions` vs. `scrub`)
- **Input**: Animation type requirements (trigger-based playback vs. scrollbar-locked scrub).
- **Decision Points**:
  - *If discrete playback on enter/leave*: Configure `toggleActions: "[onEnter] [onLeave] [onEnterBack] [onLeaveBack]"`.
  - *If direct playhead sync to scrollbar*: Set `scrub: true` (direct lock) or `scrub: [seconds]` (smooth lag).
- **Validation**:
  - `[ ]` `toggleActions` contains exactly 4 valid keywords.
  - `[ ]` If `scrub` is enabled, `ease: "none"` is used on linear translations.

### Stage 3: Boundary & Marker Placement (`start` and `end`)
- **Input**: Trigger element, scroller target, desired activation zone.
- **Steps**:
  1. Set `start: "[trigger-edge/px/%] [scroller-edge/px/%]"`.
  2. Set `end: "[trigger-edge/px/%] [scroller-edge/px/%]"` or relative `"+=[px]"`.
  3. Use arrow functions `() => ...` for dynamic responsive calculations.
  4. Enable `markers: true` during layout calibration.
- **Validation**:
  - `[ ]` Green line collision triggers start; Red line collision triggers end.

### Stage 4: Layout Pinning & Snapping (`pin`, `pinSpacing`, `snap`)
- **Input**: Pinned element, panel structure, snapping steps.
- **Steps**:
  1. Enable `pin: true` on the trigger or pass a target selector `pin: ".target"`.
  2. Set `pinSpacing: false` for layering/stacking effects; leave `true` to push content down.
  3. Configure `snap: 1 / (totalPanels - 1)` or custom snapping intervals.
- **Validation**:
  - `[ ]` Pinned content remains stationary in viewport during active trigger duration.
  - `[ ]` Snapping automatically advances/settles to discrete sections.

---

# Phase 4 & 5: Compiled Skill Package & Validation

Below is the complete, self-contained compiled skill package ready for deployment.

---

### `gsap-scrolltrigger/SKILL.md`

```markdown
---
name: gsap-scrolltrigger
description: |
  Implement and debug scroll-driven animations using GSAP ScrollTrigger.
  Use when: creating scroll-triggered animations, timeline scrubbing, element pinning,
  layered panel reveals, horizontal snapping sections, scroll callbacks, or debug markers.
  Triggers: gsap scroll, scrolltrigger, scroll animation, scrub animation, pin scroll,
  horizontal scroll section, scroll snapping gsap, toggleactions.
---

# GSAP ScrollTrigger

Implement performant, declarative scroll-driven animations, element pinning, scrubbing, and snapping using GreenSock ScrollTrigger.

## Workflow

```
Register → Choose Pattern (Tween / Timeline / Standalone) → Define Triggers & Boundaries → Configure Action (toggleActions / scrub / pin / snap) → Calibrate & Debug
```

---

## Phase 1: Setup and Registration

Always register the plugin before creating any ScrollTrigger-dependent animations.

```javascript
gsap.registerPlugin(ScrollTrigger);
```

To configure global default options across all triggers on the page:

```javascript
ScrollTrigger.defaults({
  toggleActions: "restart pause resume none",
  markers: false
});
```

### Completion gate
- [ ] `gsap.registerPlugin(ScrollTrigger)` executes before any tween instantiation.

---

## Phase 2: Choosing the Pattern

Select the appropriate implementation architecture based on the interaction type:

### Pattern A: Discrete Tween Trigger
Use when an animation should play, reverse, restart, or pause when crossing scroll thresholds.

```javascript
gsap.to(".box", {
  x: 400,
  rotation: 360,
  duration: 3,
  scrollTrigger: {
    trigger: ".box",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "restart pause reverse pause"
  }
});
```

### Pattern B: Scrubbed Timeline
Use when multiple animations synchronize directly to the scrollbar movement.

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#container",
    start: "top center",
    end: "+=500",
    scrub: 1, // Smooth catch-up delay in seconds (or true for 1:1)
    markers: false
  }
});

tl.to(".panel-a", { xPercent: 100, ease: "none" })
  .to(".panel-b", { yPercent: -100, ease: "none" });
```

### Pattern C: Standalone ScrollTrigger (Callbacks & State)
Use when controlling non-tween logic, classes, or external state.

```javascript
ScrollTrigger.create({
  trigger: ".section",
  start: "top center",
  end: "bottom center",
  toggleClass: "is-active",
  id: "section-tracker",
  onEnter: () => console.log("Entered forward"),
  onLeave: () => console.log("Left forward"),
  onEnterBack: () => console.log("Re-entered backward"),
  onLeaveBack: () => console.log("Left backward"),
  onUpdate: (self) => console.log("Progress:", self.progress.toFixed(3)),
  onToggle: (self) => console.log("Active state:", self.isActive)
});
```

For advanced parameters, custom scrollers, and instance methods, see [advanced-options.md](references/advanced-options.md).

### Completion gate
- [ ] Appropriate pattern (Tween, Timeline, or Standalone) selected.
- [ ] Standalone triggers use `ScrollTrigger.create()`.

---

## Phase 3: Boundary Positioning (`start` and `end`)

Position strings follow the syntax: `"[trigger-position] [scroller-position]"`.

- **Keywords**: `top`, `center`, `bottom`.
- **Numeric**: Pixels (`"20px"`), percentages (`"80%"` relative to top).
- **Relative end**: `"+=300"` (ends 300px after `start`).
- **Dynamic / Responsive**: Use arrow functions `() => ...` to recalculate on resize.

```javascript
scrollTrigger: {
  trigger: ".target-element",
  start: "top center",                    // When top of .target hits center of viewport
  end: () => "+=" + document.querySelector(".target-element").offsetWidth,
  markers: true                           // Set true to visualize bounds during dev
}
```

For canonical term definitions and marker behaviors, see [terminology.md](references/terminology.md).

### Completion gate
- [ ] `start` and `end` positions configured explicitly.
- [ ] `markers: true` enabled during layout verification, disabled for production.

---

## Phase 4: Pinning and Scrubbing

### 1. Pinning
Fixes an element in place for the duration of the trigger.

- `pin: true` — Pins the `trigger` element.
- `pin: ".other-element"` — Pins an arbitrary selector/element.
- `pinSpacing: true` (default) — Adds bottom padding to push subsequent content down.
- `pinSpacing: false` — Leaves natural flow, enabling layered stacking.

### 2. Scrubbing
- `scrub: true` — Playhead strictly locked to scrollbar progress.
- `scrub: 1` — Playhead smooths with a 1-second catch-up inertia.
- *Rule*: Always set `ease: "none"` on tweens inside scrubbed timelines to maintain linear scroll tracking.

For full worked examples of layered pinning and horizontal snapping, see [examples.md](references/examples.md).

### Completion gate
- [ ] Pinned elements maintain stability without layout shifts.
- [ ] Overlapping panel workflows have `pinSpacing: false` applied.

---

## Phase 5: Verification and Final Checks

Before finalizing ScrollTrigger code, verify:

- [ ] `gsap.registerPlugin(ScrollTrigger)` is called once.
- [ ] All `toggleActions` strings have exactly 4 valid keywords.
- [ ] Elements using dynamic dimension calculations wrap values in functions `() => ...`.
- [ ] `markers: true` removed or set to `false`.
- [ ] No layout jumping occurs when pinning starts/stops (`anticipatePin: 1` applied if necessary).
```

---

### `gsap-scrolltrigger/references/terminology.md`

```markdown
# Terminology

**ScrollTrigger**:
The GSAP plugin responsible for linking DOM animation playheads and lifecycle hooks to scroll positions.
_Avoid_: scroll listener, scroll watcher

**toggleActions**:
A 4-part configuration string (`"onEnter onLeave onEnterBack onLeaveBack"`) controlling tween playback state.
_Avoid_: scroll state string, transition trigger

**Scrubbing**:
Synchronizing the playhead position of an animation to the progress between `start` and `end` scroll coordinates.
_Avoid_: scroll-jacking, smooth scroll hijack

**Pinning**:
Temporarily locking an element's viewport position (`position: fixed` emulation) for a set scroll distance.
_Avoid_: CSS sticky hack, static locking

**pinSpacing**:
Automatic padding injected below a pinned element by ScrollTrigger to preserve page scroll height.
_Avoid_: scroll spacer, margin pushing

**Scroller**:
The scrollable container holding the trigger element. Defaults to the browser window/viewport.
_Avoid_: scroll parent, outer box

**Markers**:
Visual debugging guides drawn on screen showing exact `start`, `end`, `scroller-start`, and `scroller-end` collision lines.
_Avoid_: debug lines, layout guides
```

---

### `gsap-scrolltrigger/references/examples.md`

```markdown
# Worked Examples

## 1. Slide-In Layered Panels (Stacking Effect)

**Scenario**: Stacking 4 full-screen colored panels on top of each other as the user scrolls down.

**Application**:
```javascript
const panels = gsap.utils.toArray(".panel");

panels.forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    start: "top top",
    pin: true,
    pinSpacing: false
  });
});
```

**Outcome**: Each panel sticks to the top of the viewport and gets covered by the subsequent panel.

---

## 2. Horizontal Snapping Section

**Scenario**: Translating vertical page scroll into horizontal card translation that snaps cleanly to panel edges.

**Application**:
```javascript
const sections = gsap.utils.toArray(".horizontal-panel");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-container",
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector(".horizontal-container").offsetWidth
  }
});
```

**Outcome**: Vertical scrolling smoothly scrubs the horizontal translation and snaps to each section cleanly upon release.

---

## 3. Before / After Image Reveal with Pin

**Scenario**: Revealing a comparison image underneath a green-screen overlay as the user scrolls.

**Application**:
```javascript
gsap.to(".reveal-mask", {
  width: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: ".comparison-container",
    start: "top top",
    end: "+=1000",
    scrub: true,
    pin: true,
    anticipatePin: 1
  }
});
```

**Outcome**: The container locks at the top of the viewport for 1000px of scrolling while the mask expands proportionally.
```

---

### `gsap-scrolltrigger/references/advanced-options.md`

```markdown
# Advanced Options & API Reference

## `toggleActions` Keywords
Each of the 4 positions in `toggleActions: "onEnter onLeave onEnterBack onLeaveBack"` accepts:
- `play` — Resumes animation forward from current position.
- `pause` — Freezes animation playhead.
- `resume` — Resumes playing forward.
- `reverse` — Plays animation backwards toward start.
- `restart` — Jumps back to beginning and plays forward.
- `reset` — Jumps back to beginning and pauses.
- `complete` — Jumps to end and stops.
- `none` — Performs no action.

Default: `"play none none none"`.

---

## Instance Callbacks
Callbacks pass the `self` instance containing useful real-time data:

```javascript
ScrollTrigger.create({
  trigger: ".target",
  onUpdate: (self) => {
    // self.progress (0 to 1)
    // self.direction (1 = forward, -1 = backward)
    // self.velocity (current scroll speed in px/sec)
    // self.isActive (boolean)
  }
});
```

---

## Custom Containers (`scroller`) and Horizontal Triggers
To bind to a scrollable `<div>` rather than the window:

```javascript
ScrollTrigger.create({
  trigger: ".content",
  scroller: "#custom-scroll-container",
  horizontal: true // Enables horizontal scroll tracking
});
```

---

## Retrieval and Cleanup
Assign an `id` to query or kill instances dynamically:

```javascript
ScrollTrigger.create({
  id: "hero-trigger",
  trigger: ".hero"
});

// Retrieve instance elsewhere
const trigger = ScrollTrigger.getById("hero-trigger");
trigger.kill();
```
```

---

# Delivery Summary

1. **Compiled Skill Structure**:
   - `SKILL.md` (Operational methodology, under 500 lines, imperative steps, progressive disclosure)
   - `references/terminology.md` (Domain glossary with `_Avoid_` antipatterns)
   - `references/examples.md` (Concrete worked implementations: Layered Pinning, Horizontal Snapping, Image Reveal)
   - `references/advanced-options.md` (Callback properties, custom scrollers, instance retrieval)
2. **Knowledge Units Extracted**: 8 atomic units (Procedures, Concepts, Principles) with 100% provenance from `src-01`.
3. **Known Limitations**: Advanced 3D WebGL / Canvas integration (e.g. Three.js mesh morphing on scroll) requires bridging ScrollTrigger's `self.progress` into the 3D render loop.
