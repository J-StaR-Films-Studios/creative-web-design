# Source-to-Skill Compilation Report

---

## Phase 1: Source Inventory

| ID | Type | Title | Authority | Coverage |
|---|---|---|---|---|
| `src-01` | video | *GSAP ScrollTrigger Tutorial: Master Start, End, Scrub & ToggleActions* | Gary Simon (DesignCourse) — Veteran UI/UX & Web Animation Instructor | GSAP timeline initialization, ScrollTrigger plugin integration, `trigger`, `start`, `end`, `markers`, `scrub` (scrubbing vs time-based execution), `toggleActions` (the 4 trigger states & action keywords), Lenis smooth-scroll setup. |

### Coverage Gaps
- Advanced pinning (`pin: true`, `pinSpacing`) is mentioned conceptually in the intro docs view but not coded in the practical walkthrough.
- Responsive media queries (`ScrollTrigger.matchMedia()`) are documented in the GSAP reference pages shown briefly but not implemented in the tutorial codebase.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==========================================
# CONCEPTS
# ==========================================
- id: ku-001
  type: concept
  name: ScrollTrigger
  source: src-01, "00:07 - 00:30"
  confidence: high
  definition: >
    A GSAP plugin that binds timeline animations or individual tweens to scroll position,
    firing or scrubbing animations based on viewport intersection points.
  attributes: [trigger-hook, scroller-hook, scrub-mode, event-driven-mode]
  avoid_terms: [scroll listener, parallax script, intersection observer hack]
  related: [ku-002, ku-003, ku-004]

- id: ku-002
  type: concept
  name: Trigger Hook and Scroller Hook
  source: src-01, "05:44 - 07:45"
  confidence: high
  definition: >
    The reference coordinates used by ScrollTrigger. The trigger hook defines a position
    on the target DOM element; the scroller hook defines the corresponding position in the viewport.
  attributes: [element-relative coordinate, viewport-relative coordinate]
  avoid_terms: [scroll boundary, trigger line]
  related: [ku-003, ku-007]

- id: ku-003
  type: concept
  name: ScrollTrigger Markers
  source: src-01, "05:10 - 08:30"
  confidence: high
  definition: >
    Visual debugging indicators injected into the DOM showing the exact positions of
    'start' / 'end' (trigger element) and 'scroller-start' / 'scroller-end' (viewport).
  attributes: [green start markers, red end markers, debug tool]
  avoid_terms: [guide lines, debug rulers]
  related: [ku-002, ku-022]

- id: ku-004
  type: concept
  name: Scrub Mode vs ToggleActions Mode
  source: src-01, "14:50 - 16:15"
  confidence: high
  definition: >
    The two mutually exclusive operational modes of ScrollTrigger. Scrub mode ties animation progress
    directly to scroll distance; ToggleActions mode triggers discrete playback actions over time.
  attributes: [scrub: true, scrub: false, time-based, distance-based]
  avoid_terms: [scroll playback, frame syncing]
  related: [ku-023, ku-024]

# ==========================================
# PRINCIPLES
# ==========================================
- id: ku-010
  type: principle
  name: Debug with Markers First
  source: src-01, "05:10, 08:00 - 09:30, 22:25"
  confidence: high
  statement: >
    Always enable `markers: true` during development to observe where trigger hooks meet
    scroller hooks. Disable markers only when final choreography is verified.
  rationale: >
    Attempting to calculate trigger timings mathematically without visual feedback leads to
    misaligned scroll triggers across differing screen heights.
  applies_to: [ku-021, ku-022]

- id: ku-011
  type: principle
  name: Scroll Span Dictates Scrub Speed
  source: src-01, "10:45 - 12:35, 14:15 - 14:50"
  confidence: high
  statement: >
    In scrub mode (`scrub: true`), the duration parameter on tweens is ignored; the scroll distance
    between `start` and `end` scroller intersections dictates animation playback speed.
  rationale: >
    Larger pixel distance between start and end requires more scrolling, slowing the animation down.
    Narrower distance between hooks makes the animation scrub faster.
  applies_to: [ku-023]

- id: ku-012
  type: principle
  name: ToggleActions Exclusivity
  source: src-01, "17:35 - 17:50"
  confidence: high
  statement: >
    `toggleActions` only takes effect when `scrub: false` (or scrub is omitted). If `scrub: true`
    is active, `toggleActions` is bypassed.
  rationale: >
    Scrubbing directly binds animation progress to scroll distance, eliminating discrete state transitions.
  applies_to: [ku-024]

# ==========================================
# PROCEDURES
# ==========================================
- id: ku-020
  type: procedure
  name: Environment & CDN Initialization
  source: src-01, "01:25 - 03:00"
  confidence: high
  goal: Load GSAP, ScrollTrigger, and optional smooth scrolling runtime.
  steps:
    - action: Load GSAP core (`gsap.min.js`) and ScrollTrigger (`ScrollTrigger.min.js`) via CDN or bundle
      criterion: `gsap` and `ScrollTrigger` global objects exist in runtime
    - action: Register ScrollTrigger plugin if using modular bundlers (`gsap.registerPlugin(ScrollTrigger)`)
      criterion: ScrollTrigger methods are accessible via GSAP timeline/tween configs
    - action: Initialize smooth scroll library (Lenis) and link to requestAnimationFrame loop
      criterion: Page scrolling updates smoothly with Lenis instance running
  outputs: [Configured DOM environment ready for animation binding]

- id: ku-021
  type: procedure
  name: Timeline and Trigger Configuration
  source: src-01, "03:05 - 05:44"
  confidence: high
  goal: Instantiate a GSAP timeline with a ScrollTrigger definition.
  steps:
    - action: Define target element in CSS initial state (e.g. translated off-screen or opacity 0)
      criterion: Element displays in initial resting state before trigger point
    - action: Instantiate timeline with `gsap.timeline({ scrollTrigger: { ... } })`
      criterion: Timeline is attached to the DOM element via `trigger: '<selector>'`
    - action: Chain target tween onto timeline specifying destination attributes
      criterion: Tween animates to final properties on timeline progression
  outputs: [Active timeline bound to scroll events]

- id: ku-022
  type: procedure
  name: Coordinate Mapping (Start and End)
  source: src-01, "05:44 - 14:50"
  confidence: high
  goal: Configure exact trigger coordinates for animation entry and exit.
  steps:
    - action: Set `markers: true` in the scrollTrigger config
      criterion: Green and red marker indicators are visible in the viewport
    - action: Define `start: "<element-hook> <viewport-hook>"` (e.g. `'top center'`, `'35% 80%'`, `'-50% center'`)
      criterion: Green `start` and `scroller-start` lines align at the desired entry threshold
    - action: Define `end: "<element-hook> <viewport-hook>"` (e.g. `'bottom center'`, `'bottom 20%'`, `'200% center'`)
      criterion: Red `end` and `scroller-end` lines align at the desired exit threshold
  outputs: [Calibrated start and end triggers]

- id: ku-023
  type: procedure
  name: Scrub Mode Implementation
  source: src-01, "14:50 - 15:55, 21:50 - 22:15"
  confidence: high
  goal: Tie animation playhead directly to scroll movement.
  steps:
    - action: Set `scrub: true` (or numeric value for smoothing) in scrollTrigger options
      criterion: Scrolling forward advances tween; scrolling backward reverses tween
    - action: Adjust gap between `start` and `end` hooks to tune scrub resistance
      criterion: Animation pace matches target scroll duration
  outputs: [Direct scroll-scrubbed animation]

- id: ku-024
  type: procedure
  name: ToggleActions State Configuration
  source: src-01, "15:55 - 21:45"
  confidence: high
  goal: Define discrete playback behaviors across the 4 viewport transition states.
  steps:
    - action: Set `scrub: false` and define `duration` on the child tween
      criterion: Animation executes over real time, not scroll distance
    - action: Define `toggleActions: "<onEnter> <onLeave> <onEnterBack> <onLeaveBack>"`
      criterion: 4 keywords provided from: `play`, `pause`, `resume`, `reverse`, `restart`, `reset`, `complete`, `none`
    - action: Validate behavior across forward scroll (onEnter, onLeave) and backward scroll (onEnterBack, onLeaveBack)
      criterion: Element transitions as specified at each marker boundary
  outputs: [Event-driven scroll triggered animation]

# ==========================================
# CONSTRAINTS
# ==========================================
- id: ku-030
  type: constraint
  name: Syntax String Structure for Start and End
  source: src-01, "05:55 - 07:15"
  confidence: high
  rule: >
    `start` and `end` values must always be structured as two space-separated tokens:
    `"[trigger-position] [scroller-position]"`. Omitting the second token defaults to scroller top.
  scope: ScrollTrigger configuration objects
  consequence: Invalid or single-token syntax causes unexpected hook alignment.
  enforced_by: GSAP ScrollTrigger parser

- id: ku-031
  type: constraint
  name: ToggleActions Format Invariant
  source: src-01, "16:05 - 16:30"
  confidence: high
  rule: >
    `toggleActions` must be an exact string of four space-separated keywords corresponding strictly to
    `onEnter`, `onLeave`, `onEnterBack`, and `onLeaveBack`.
  scope: Event-driven ScrollTrigger instances
  consequence: Missing or malformed tokens prevent state transition handlers from firing.
  enforced_by: GSAP ScrollTrigger runtime

# ==========================================
# EXAMPLES & COUNTEREXAMPLES
# ==========================================
- id: ku-040
  type: example
  name: Scrubbed In-Out Translation
  source: src-01, "14:15 - 15:50"
  confidence: high
  scenario: Animate a card horizontally into view as user scrolls down, and back out when scrolling up.
  application: >
    Initial CSS: `position: relative; left: -400px;`
    ScrollTrigger: `trigger: '.animated-element', start: '-50% center', end: '200% center', scrub: true, markers: true`
    Timeline: `tl.to('.animated-element', { x: 800 })`
  outcome: Card glides smoothly across screen in lockstep with the scroll bar.
  teaches: Percentage offsets beyond 0-100% allow pre-entry and extended exit scroll zones.
  illustrates: [ku-022, ku-023]

- id: ku-041
  type: example
  name: Bidirectional Reversible Trigger
  source: src-01, "19:00 - 21:00"
  confidence: high
  scenario: Trigger a fixed-duration slide-in when entering the section, reverse it when scrolling back up.
  application: >
    ScrollTrigger: `trigger: '.animated-element', start: '-50% center', end: '200% center', scrub: false, toggleActions: 'play pause reverse complete'`
    Tween: `tl.to('.animated-element', { x: 800, duration: 0.5 })`
  outcome: Element plays 0.5s tween on forward scroll entry, pauses on leave, and reverses on upward scroll.
  teaches: Discrete state control without tying animation frame rate to scroll jitter.
  illustrates: [ku-024]

- id: ku-050
  type: counterexample
  name: Setting Duration in Scrub Mode
  source: src-01, "14:45 - 15:15"
  confidence: high
  scenario: Developer sets `duration: 5` on a tween expecting a scrubbed animation to take 5 seconds.
  mistake: Kept `scrub: true` while trying to control animation speed via the `duration` property.
  consequence: Tween duration is ignored; speed is solely determined by user scroll velocity and marker distance.
  correction: Expand the vertical scroll distance between `start` and `end` hooks to slow down scrubbed animations.
  teaches: Scrub mode substitutes time duration with scroll distance.
  illustrates: [ku-011, ku-023]
```

---

## Phase 3: Methodology Synthesis

### Operational Stage Workflow

```
[DOM & Script Prep] ──► [Timeline & Trigger Init] ──► [Hook Alignment & Debugging] 
                                                                │
                                    ┌───────────────────────────┴───────────────────────────┐
                                    ▼                                                       ▼
                            [Mode A: Scrubbing]                                   [Mode B: ToggleActions]
                                    │                                                       │
                                    └───────────────────────────┬───────────────────────────┘
                                                                ▼
                                                    [Production Finalization]
```

---

## Phase 4: Skill Compilation

Below is the complete compiled skill package ready for deployment.

```
gsap-scrolltrigger/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── examples.md
    └── toggle-actions.md
```

### File 1: `gsap-scrolltrigger/SKILL.md`

```markdown
---
name: gsap-scrolltrigger
description: |
  Configure, time, and debug GSAP ScrollTrigger animations in web applications.
  Use when building scroll-driven animations, binding GSAP timelines/tweens to viewport scroll,
  calibrating start/end trigger hooks, configuring scrub mode vs toggleActions, or integrating
  smooth scroll (Lenis).
  Triggers: gsap scrolltrigger, scroll animation, scroll-driven animation, gsap scrub,
  toggleActions, scrolltrigger start end, animate on scroll, gsap lenis smooth scroll.
---

# GSAP ScrollTrigger Implementation

Implement precise scroll-driven animations using GSAP and the ScrollTrigger plugin. Follow this workflow to configure trigger hooks, calibrate scroll timing, select between scrubbed distance-based tracking and discrete event-driven playback, and eliminate scroll timing defects.

For full terminology and canonical parameter names, see [terminology.md](references/terminology.md).

---

## Ground Rules

1. **Visual Calibration First**: Always set `markers: true` during development. Never guess trigger hook coordinates without visual marker inspection.
2. **Mode Exclusivity**: Choose either **Scrub Mode** (`scrub: true` or numeric smoothing) or **ToggleActions Mode** (`scrub: false` + `toggleActions`). Never attempt to control timing with `duration` in scrub mode.
3. **Two-Token Coordinate Strings**: Always format `start` and `end` properties as `"[triggerHook] [scrollerHook]"` (e.g., `'top center'`, `'35% 80%'`).

---

## Phase 1: Environment & Initial State Preparation

Set up DOM elements in their initial resting positions before binding ScrollTrigger.

1. Load GSAP core (`gsap.min.js`) and the ScrollTrigger plugin (`ScrollTrigger.min.js`).
2. If using an ES module environment, register the plugin:
   ```javascript
   gsap.registerPlugin(ScrollTrigger);
   ```
3. (Optional) Initialize smooth scrolling (Lenis) to normalize scroll acceleration across platforms:
   ```javascript
   const lenis = new Lenis();
   function raf(time) {
     lenis.raf(time);
     requestAnimationFrame(raf);
   }
   requestAnimationFrame(raf);
   ```
4. Define the target element's starting CSS state (e.g., translated off-screen via `position: relative; left: -400px;` or `opacity: 0;`).

### Completion Gate
- [ ] GSAP and ScrollTrigger runtime objects are accessible without console errors
- [ ] Target element is visually positioned in its pre-animated state
- [ ] Viewport contains sufficient scrollable height (e.g., spacer sections) to allow testing

---

## Phase 2: Timeline & Trigger Definition

Instantiate a GSAP timeline bound to the target DOM element via ScrollTrigger.

1. Instantiate the timeline with the `scrollTrigger` configuration object:
   ```javascript
   let tl = gsap.timeline({
     scrollTrigger: {
       trigger: '.target-element',
       start: 'top center',
       end: 'bottom center',
       markers: true
     }
   });
   ```
2. Chain child tweens to the timeline specifying the target destination values:
   ```javascript
   tl.to('.target-element', {
     x: 800
   });
   ```

### Completion Gate
- [ ] Green (`start` / `scroller-start`) and red (`end` / `scroller-end`) markers appear in the viewport
- [ ] Scrolling causes the trigger element to cross the viewport marker threshold

---

## Phase 3: Coordinate Hook Calibration

Calibrate the entry (`start`) and exit (`end`) points to control when and where the animation executes.

1. Configure the **`start`** property using `"<trigger-hook> <scroller-hook>"`:
   - **First token** (Trigger Hook): Reference point on the target element (`top`, `center`, `bottom`, percentage `35%`, pixel offset `100px`, or negative value `-50%`).
   - **Second token** (Scroller Hook): Reference point in the viewport (`top`, `center`, `bottom`, percentage `80%`, or pixel position).
2. Configure the **`end`** property using `"<trigger-hook> <scroller-hook>"`:
   - Defines where the animation completes or unpins (e.g., `'bottom center'`, `'200% center'`, `'bottom 20%'`).
3. Tune scroll velocity/duration:
   - **To slow down the animation**: Increase the vertical distance between `scroller-start` and `scroller-end`.
   - **To speed up the animation**: Bring `scroller-start` and `scroller-end` closer together.

For complete hook coordinate formulas and worked visual layouts, see [examples.md](references/examples.md).

### Completion Gate
- [ ] Green `start` marker meets `scroller-start` at the exact desired trigger moment
- [ ] Red `end` marker meets `scroller-end` at the desired completion threshold

---

## Phase 4: Operational Mode Configuration

Select and implement the appropriate animation mode based on interaction requirements.

```
Decision Tree:
Is animation progress directly locked to the scrollbar position?
├── YES ──► Mode A: Scrub Mode
└── NO  ──► Mode B: ToggleActions Mode (Time-based discrete playback)
```

### Mode A: Scrub Mode (Scrollbar-Bound)
Use when the user directly scrubs the animation back and forth by scrolling.

1. Set `scrub: true` (or a number like `scrub: 1` for 1-second catch-up lag) inside the `scrollTrigger` object.
2. Remove any time-based `duration` assumptions on child tweens. Adjust pace purely by changing the distance between `start` and `end` hooks.

### Mode B: ToggleActions Mode (Discrete Playback)
Use when scrolling past a threshold should trigger a fixed-duration, time-based animation.

1. Set `scrub: false` in the `scrollTrigger` object.
2. Set explicit `duration` on child tweens (e.g., `duration: 0.5`).
3. Define the 4-token `toggleActions` string:
   ```javascript
   toggleActions: 'onEnter onLeave onEnterBack onLeaveBack'
   ```
   Choose actions for each event from: `play`, `pause`, `resume`, `reverse`, `restart`, `reset`, `complete`, `none`.

For all 8 action behaviors and common toggleAction combinations, see [toggle-actions.md](references/toggle-actions.md).

### Completion Gate
- [ ] If `scrub: true`: Animation advances smoothly forward/backward with scrollbar position
- [ ] If `scrub: false`: Animation plays over its specified duration when crossing marker thresholds without jitter

---

## Phase 5: Production Cleanup & Verification

Prepare the implementation for deployment.

1. Set `markers: false` or delete the `markers` property from all `scrollTrigger` configs.
2. Test animation behavior under fast scroll gestures and reverse scrolling.
3. Verify layout stability across differing screen heights and aspect ratios.

### Completion Gate
- [ ] All visual debug markers are removed from DOM
- [ ] Animation triggers cleanly in both scroll directions without visual snapping
```

---

### File 2: `gsap-scrolltrigger/references/terminology.md`

```markdown
# Terminology

**ScrollTrigger**:
The GSAP plugin responsible for linking DOM tweens and timelines to scroller positions and viewport intersections.
_Avoid_: scroll listener, scroll watcher, intersection observer script

**Trigger Hook**:
The first token in a `start` or `end` string specifying the reference coordinate on the target animated element (e.g., `top`, `bottom`, `center`, `35%`, `-50%`).
_Avoid_: element marker, element trigger line

**Scroller Hook**:
The second token in a `start` or `end` string specifying the reference coordinate in the viewport or scrollable container (e.g., `top`, `center`, `bottom`, `80%`, `20%`).
_Avoid_: viewport line, screen trigger

**Scrubbing (`scrub`)**:
The mode where animation playhead progress (0% to 100%) is directly locked to the scroll distance between `scroller-start` and `scroller-end`.
_Avoid_: scroll syncing, frame scrubbing

**ToggleActions**:
A 4-token configuration string defining discrete playback commands (`play`, `pause`, `reverse`, `restart`, etc.) executed when entering/leaving trigger boundaries during non-scrubbed playback.
_Avoid_: scroll callbacks, trigger events
```

---

### File 3: `gsap-scrolltrigger/references/examples.md`

```markdown
# Worked ScrollTrigger Examples

## Example 1: Full-Span Scrubbed Horizontal Glide

**Scenario**: A card starts off-screen to the left and glides 800px to the right as the user scrolls through the middle section of the page.

**Application**:
```javascript
// Initial CSS: .card { position: relative; left: -400px; }
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.card',
    start: '-50% center', // Starts when 50% above card hits viewport center
    end: '200% center',   // Completes when 200% past card hits viewport center
    scrub: true,
    markers: false
  }
});

tl.to('.card', {
  x: 800,
  ease: 'none'
});
```

**Outcome**: Animation progress is perfectly tied to scrollbar distance across an extended trigger area.

---

## Example 2: Fast Scrub with Tight Hook Boundaries

**Scenario**: A card needs to snap across the screen rapidly over a very short scroll window.

**Application**:
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.card',
    start: '35% 80%',     // Starts near bottom of viewport
    end: 'bottom 20%',    // Ends near top of viewport
    scrub: true,
    markers: false
  }
});

tl.to('.card', {
  x: 800
});
```

**Outcome**: Narrowing the distance between trigger hooks creates high scroll responsiveness, requiring minimal scroll distance to finish the tween.

---

## Example 3: Reversible Event-Driven Slide-In

**Scenario**: A card animates into view over a fixed 0.5s duration when reached, but must cleanly reverse out when the user scrolls back up.

**Application**:
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.card',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: false,
    toggleActions: 'play pause reverse complete',
    markers: false
  }
});

tl.to('.card', {
  x: 800,
  duration: 0.5,
  ease: 'power2.out'
});
```

**Outcome**: When scrolled down past 80% viewport, the 0.5s tween plays. If scrolled back up past the bottom marker, it reverses smoothly.
```

---

### File 4: `gsap-scrolltrigger/references/toggle-actions.md`

```markdown
# ToggleActions Reference

The `toggleActions` property accepts a single string containing **four space-separated keywords**:

```javascript
toggleActions: 'onEnter onLeave onEnterBack onLeaveBack';
```

## The Four Transition States

| Position | State Name | Trigger Event |
|---|---|---|
| **1st Token** | `onEnter` | User scrolls **DOWN**; top of element crosses `scroller-start` into view. |
| **2nd Token** | `onLeave` | User scrolls **DOWN**; bottom of element crosses `scroller-end` out of view. |
| **3rd Token** | `onEnterBack` | User scrolls **UP**; bottom of element crosses `scroller-end` back into view. |
| **4th Token** | `onLeaveBack` | User scrolls **UP**; top of element crosses `scroller-start` out of view. |

---

## Permitted Action Keywords

| Keyword | Playback Behavior |
|---|---|
| `play` | Plays the animation forward from its current position. |
| `pause` | Freezes the animation at its current frame. |
| `resume` | Unfreezes and continues playing forward. |
| `reverse` | Plays the animation backward toward the start. |
| `restart` | Resets playhead to 0 and plays forward from the beginning. |
| `reset` | Resets playhead to 0 and pauses. |
| `complete` | Jumps immediately to the end frame and finishes. |
| `none` | Does nothing at this transition boundary. |

---

## Common ToggleAction Recipes

- `'play none none none'` — Play once on entry; never replay or reverse (standard one-shot trigger).
- `'play pause reverse complete'` — Play on enter, pause if scrolled past, reverse when entering back, complete when leaving top.
- `'play reverse play reverse'` — Play forward whenever in viewport; reverse whenever exiting viewport in either direction.
- `'restart none none reverse'` — Restart from beginning each time user scrolls down into section; reverse when scrolling out the top.
```

---

## Phase 5: Validation

### Source Fidelity Matrix
- **`trigger` selector mapping**: Handled in Phase 2 step 1 (`SKILL.md`).
- **`start` and `end` two-token syntax**: Handled in Phase 3 (`SKILL.md`) & `examples.md`.
- **`markers: true/false` debugging principle**: Handled in Ground Rules & Phase 3 (`SKILL.md`).
- **`scrub: true` vs `scrub: false` distance vs time dynamics**: Handled in Phase 4 Mode A vs Mode B (`SKILL.md`).
- **`toggleActions` 4-keyword mapping & state transitions**: Handled in Phase 4 Mode B (`SKILL.md`) & `toggle-actions.md`.
- **Lenis smooth scrolling setup**: Handled in Phase 1 step 3 (`SKILL.md`).

### Operational Scenario Walkthroughs

1. **Scenario 1: User wants an animation to play slower during scroll.**
   - *Skill Execution*: Consultant checks Phase 3 -> increases vertical distance between `start` and `end` hooks (e.g. `start: '-50% center'`, `end: '200% center'`).
   - *Result*: Animation spreads over a larger scroll window without mistakenly touching the tween `duration`.

2. **Scenario 2: Element jumps on load instead of waiting for scroll.**
   - *Skill Execution*: Consultant checks Phase 1 (prepares CSS resting state) and Phase 2 (verifies timeline wrapper with `scrollTrigger: { ... }` instead of standalone `gsap.to`).
   - *Result*: Element stays hidden off-screen until the green `start` and `scroller-start` hooks intersect.

3. **Scenario 3: User needs an entrance animation to fire once with natural easing.**
   - *Skill Execution*: Consultant checks Phase 4 Mode B -> sets `scrub: false`, `duration: 0.8`, and `toggleActions: 'play none none none'`.
   - *Result*: Animation triggers as an un-scrubbed, fixed-duration tween.

---

## Delivery Summary

- **Total Knowledge Units Extracted**: 15 (4 Concepts, 3 Principles, 5 Procedures, 2 Constraints, 3 Examples/Counterexamples)
- **Artifacts Generated**:
  - `SKILL.md` (Operational workflow and phase gates under 150 lines)
  - `references/terminology.md` (Canonical domain terms with anti-synonyms)
  - `references/examples.md` (Concrete code patterns for scrubbed and event-driven animations)
  - `references/toggle-actions.md` (Full lookup table for the 4 states and 8 actions)
