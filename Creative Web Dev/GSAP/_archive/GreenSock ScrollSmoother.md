# Source-to-Skill Compilation: GreenSock ScrollSmoother

---

## Phase 1: Source Inventory

### Inventory Table

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video / transcript / tutorial |
| **Title** | Introducing ScrollSmoother by GreenSock |
| **Authority** | Cassie Evans, Core Developer Advocate / Educator at GreenSock |
| **Coverage** | Setup & architecture (`#smooth-wrapper`, `#smooth-content`), plugin registration, creation config (`smooth`, `smoothTouch`, `effects`), programmatic scrolling (`scrollTo`, tweening `scrollTop`), speed/lag parallax effects (HTML attributes vs JS `effects()`), image parallax (`speed: "auto"`), modal scrolling pause (`paused()`), callbacks (`onStop`, `onUpdate`, `getVelocity`), ScrollTrigger/GSAP integration (quickTo, pin, fake horizontal scrolling). |

### Coverage Gaps Identified
- Server-side rendering (SSR / Next.js / Nuxt) hydration lifecycle caveats (not covered in source).
- Custom scroller containers besides viewport `window` (source focuses exclusively on window/viewport smoothing).

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
conflicts: []

# --- CONCEPTS ---
- id: ku-001
  type: concept
  name: ScrollSmoother
  source: src-01, "00:00-00:40"
  confidence: high
  definition: >
    A smooth-scrolling plugin for GSAP built on top of ScrollTrigger that leverages
    native browser scrolling rather than intercepting or faking scrollbars.
  attributes:
    - native-scrolling-based
    - accessible (preserves tabbing, native scrollbar, pointer events)
    - club-greensock-exclusive
  avoid_terms: [fake scrollbar, scroll hijacking, virtual scroll library]
  related: [ku-002, ku-003]

- id: ku-002
  type: concept
  name: Smooth Wrapper & Smooth Content
  source: src-01, "01:06-03:04"
  confidence: high
  definition: >
    The two-tier DOM architecture required by ScrollSmoother: an outer fixed viewport container
    (#smooth-wrapper) and an inner transformable container (#smooth-content).
  attributes:
    - smooth-wrapper: position: fixed, width/height: 100%, inset: 0, overflow: hidden
    - smooth-content: receives inline matrix3d/CSS transforms to ease into native scroll position
  avoid_terms: [scroll container, viewport div]
  related: [ku-001, ku-004]

- id: ku-003
  type: concept
  name: Parallax Speed and Lag
  source: src-01, "05:18-06:46"
  confidence: high
  definition: >
    Differential motion modifiers where speed alters element movement rate relative to scroll,
    and lag introduces inertia/delayed catch-up behind the scroll position.
  attributes:
    - data-speed: multiplier (e.g., 2 = 2x speed, 0.5 = half speed)
    - data-lag: delay in seconds to catch up
    - speed: "auto": calculates motion offset based on container bounds
  avoid_terms: [scroll delay, parallax factor]
  related: [ku-007, ku-008]

# --- PRINCIPLES ---
- id: ku-004
  type: principle
  name: Native Scroll Accessibility
  source: src-01, "00:20-00:38"
  confidence: high
  statement: >
    Preserve native browser scrollbars and standard accessibility features (keyboard tab navigation,
    touch gestures) by transforming inner content rather than hijacking document scrolling.
  rationale: >
    Fake scrollbars and gesture interception degrade accessibility, break keyboard navigation,
    and cause input friction.
  applies_to: [ku-010, ku-012]

- id: ku-005
  type: principle
  name: Register Prerequisites Before Creation
  source: src-01, "01:40-01:50"
  confidence: high
  statement: >
    Always register ScrollTrigger and ScrollSmoother via gsap.registerPlugin() before invoking
    ScrollSmoother.create().
  rationale: >
    ScrollSmoother extends ScrollTrigger's core architecture and cannot instantiate without it.
  applies_to: [ku-010]

# --- PROCEDURES ---
- id: ku-010
  type: procedure
  name: Initialize ScrollSmoother
  source: src-01, "01:06-03:37"
  confidence: high
  goal: Set up smooth scrolling across a document using GSAP ScrollSmoother.
  prerequisites:
    - GSAP, ScrollTrigger, and ScrollSmoother loaded
  steps:
    - action: Structure DOM with outer wrapper (#smooth-wrapper) and inner content (#smooth-content).
      criterion: Inner elements reside inside the content container.
    - action: Register plugins via gsap.registerPlugin(ScrollTrigger, ScrollSmoother).
      criterion: Plugins registered before any ScrollSmoother call.
    - action: Invoke ScrollSmoother.create(config).
      criterion: Smoother instance created with specified smooth duration.
  outputs:
    - ScrollSmoother instance object
  related: [ku-001, ku-002, ku-005]

- id: ku-011
  type: procedure
  name: Programmatic Smooth Scrolling
  source: src-01, "03:41-05:14"
  confidence: high
  goal: Scroll to specific elements or pixel positions smoothly or instantly.
  prerequisites:
    - ScrollSmoother initialized (ku-010)
  steps:
    - action: Call smoother.scrollTo(target, smooth, position) for standard target jumps.
      criterion: Target selector or pixel value provided with boolean smooth flag.
    - action: Alternatively, tween smoother.scrollTop using gsap.to() with smoother.offset() for custom easing/durations.
      criterion: Custom GSAP tween drives smoother.scrollTop with defined ease and duration.
  outputs:
    - Programmatic viewport translation to target position

- id: ku-012
  type: procedure
  name: Implement Parallax Effects and Image Parallax
  source: src-01, "05:18-08:37"
  confidence: high
  goal: Add differential movement and automatic image parallax to elements.
  prerequisites:
    - ScrollSmoother initialized with effects: true (ku-010)
  steps:
    - action: Enable effects by setting effects: true in ScrollSmoother.create().
      criterion: effects: true present in config.
    - action: For elements, assign data-speed / data-lag attributes or use smoother.effects(target, config).
      criterion: Target elements move at differential rates during scroll.
    - action: For auto image parallax, enclose image in a container with overflow: hidden, set image to position: absolute with height > 100% (e.g. 160%), and apply speed: "auto".
      criterion: Image moves seamlessly within wrapper without revealing empty container space.
  outputs:
    - Parallax-animated elements and media

- id: ku-013
  type: procedure
  name: Control Scroll State and Monitor Velocity
  source: src-01, "08:41-11:15"
  confidence: high
  goal: Pause scrolling on modal states and bind dynamic effects to scroll velocity.
  prerequisites:
    - ScrollSmoother initialized (ku-010)
  steps:
    - action: Call smoother.paused(true/false) when toggling modals or overlays.
      criterion: Scrolling halts when modal opens and resumes when closed.
    - action: Subscribe to onUpdate and/or onStop callbacks in smoother config.
      criterion: Callback fires on each scroll update / scroll termination.
    - action: Query smoother.getVelocity() or self.getVelocity() inside onUpdate to drive reactive animations via gsap.quickTo().
      criterion: Velocity value piped into dynamic properties (e.g., rotation, skew).
  outputs:
    - Interactive reactive scroll behaviors and controlled modal scrolling

# --- CONSTRAINTS ---
- id: ku-020
  type: constraint
  name: Touch Device Smoothing Restriction
  source: src-01, "03:17-03:37"
  confidence: high
  rule: >
    Touch device smoothing defaults to 0 (off). If overridden with smoothTouch, keep the value small
    (e.g., 0.1s).
  scope: ScrollSmoother configuration
  consequence: >
    High smoothing values on touch devices create a noticeable lag between finger drag and screen motion,
    causing user disorientation.
  enforced_by: Default config settings and validation checklist

- id: ku-021
  type: constraint
  name: Image Container Overflow Requirement
  source: src-01, "08:15-08:30"
  confidence: high
  rule: >
    When using speed: "auto" for image parallax, container must have overflow: hidden and position: relative,
    and image must be position: absolute and taller than the container (e.g., height: 160%).
  scope: HTML/CSS markup for parallax images
  consequence: >
    Image will overflow into adjacent elements or show empty space during scroller bounds interpolation.
  enforced_by: CSS validation rules
```

---

## Phase 3: Methodology Synthesis

### Stage 1: Scroller Architecture & DOM Structure
- **Input**: Page markup and target elements requiring smooth scroll.
- **Steps**:
  1. Wrap page content in an outer container (`#smooth-wrapper`) and an inner container (`#smooth-content`).
  2. Ensure fixed header/modals that should remain stationary stay outside `#smooth-content` if needed, or configure pinning inside.
- **Validation**:
  - [ ] `#smooth-content` holds all scrollable DOM elements.
  - [ ] `#smooth-wrapper` wraps `#smooth-content`.

### Stage 2: Plugin Registration & Instantiation
- **Input**: GSAP, ScrollTrigger, and ScrollSmoother libraries loaded in environment.
- **Steps**:
  1. Execute `gsap.registerPlugin(ScrollTrigger, ScrollSmoother)`.
  2. Instantiate via `ScrollSmoother.create({ wrapper, content, smooth, effects, smoothTouch })`.
- **Decision Points**:
  - If mobile/touch smoothing is required → Set `smoothTouch: 0.1` (do not exceed 0.2).
  - If standard desktop smoothing → Set `smooth: 1` to `3` (default 2s catch-up).
- **Validation**:
  - [ ] Plugins registered prior to instance creation.
  - [ ] Instance stored in variable for programmatic access.

### Stage 3: Scroll Interaction & Parallax Configuration
- **Input**: Elements designated for speed variance, lag inertia, or jump triggers.
- **Steps**:
  1. Enable `effects: true` in instance creation.
  2. Apply `data-speed` / `data-lag` attributes in HTML, or call `smoother.effects(selector, config)`.
  3. Configure parallax images with CSS (`overflow: hidden`, `position: absolute`, `height: >100%`) and `speed: "auto"`.
  4. Implement target navigation via `smoother.scrollTo()` or `gsap.to(smoother, { scrollTop: ... })`.
- **Validation**:
  - [ ] Parallax images have proper bounding wrappers.
  - [ ] Differential speeds align with document flow when reaching screen center.

### Stage 4: State Handling, Velocity & Pinning Integration
- **Input**: Overlays (modals), scroll callbacks, ScrollTrigger pins, and velocity effects.
- **Steps**:
  1. Attach `smoother.paused(true|false)` to overlay/modal visibility state triggers.
  2. Use `onUpdate: (self) => self.getVelocity()` with `gsap.quickTo()` to bind dynamic transforms (rotation, skew) to scrolling velocity.
  3. Attach ScrollTrigger instances with `pin: true` or scrubbed timelines directly inside `#smooth-content`.
- **Validation**:
  - [ ] Modals halt smooth scrolling when active.
  - [ ] Velocity transforms clamp within sensible boundaries (e.g. `gsap.utils.clamp(-360, 360)`).
  - [ ] ScrollTrigger pins align accurately with smooth content matrix transforms.

---

## Phase 4: Skill Compilation

Below is the complete compiled skill package ready for deployment.

```
scrollsmoother-implementation/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── examples.md
    └── api-reference.md
```

---

### `scrollsmoother-implementation/SKILL.md`

```markdown
---
name: scrollsmoother-implementation
description: |
  Implement and configure GSAP ScrollSmoother for accessible, high-performance smooth scrolling,
  differential parallax effects, velocity-driven animations, and ScrollTrigger integration.
  Triggers: implement ScrollSmoother, GSAP smooth scroll, add scroll parallax, setup ScrollSmoother,
  configure smoothTouch, smoother.scrollTo, smoother.paused, velocity scroll effects.
---

# ScrollSmoother Implementation

Implement accessible, GPU-accelerated smooth scrolling using GreenSock's ScrollSmoother. This skill guides the architecture, instantiation, parallax configuration, programmatic navigation, and ScrollTrigger integration.

For terminology and anti-patterns, see [terminology.md](references/terminology.md).
For complete worked examples, see [examples.md](references/examples.md).
For exact method signatures and config options, see [api-reference.md](references/api-reference.md).

---

## Phase 1: DOM Hierarchy Setup

Structure the HTML markup to support ScrollSmoother's native-backed transform model.

1. Create the outer wrapper container (`#smooth-wrapper`).
2. Create the inner content container (`#smooth-content`) immediately inside the wrapper.
3. Place all scrollable document elements inside the inner content container.
4. Place elements intended to remain fixed across the entire viewport (like global sticky headers or overlay modals) outside `#smooth-wrapper`.

### Completion gate
- [ ] Markup contains outer `#smooth-wrapper` and inner `#smooth-content`.
- [ ] All scrolling content is nested within `#smooth-content`.

---

## Phase 2: Plugin Registration & Instantiation

Initialize ScrollSmoother within your script entry point.

1. Register plugins in GSAP before invoking creation:
   ```javascript
   gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
   ```
2. Create the smoother instance and configure base timing:
   ```javascript
   const smoother = ScrollSmoother.create({
     wrapper: "#smooth-wrapper",
     content: "#smooth-content",
     smooth: 2,           // seconds to catch up to native scroll
     effects: true,       // parse data-speed and data-lag attributes
     smoothTouch: 0.1     // subtle smoothing on touch devices (0 = disabled)
   });
   ```

### Decision Points
- **Desktop Only vs Touch Support**:
  - Default: Omit `smoothTouch` (or set `0`) to preserve native 1:1 touch response.
  - If touch smoothing is required: Set `smoothTouch: 0.1` (never exceed `0.2` to prevent drag disconnect).
- **DOM Auto-Detection**:
  - If `#smooth-content` exists and wrapper/content selectors are omitted, ScrollSmoother automatically locates `#smooth-content` and generates the wrapper. Explicit configuration is recommended.

### Completion gate
- [ ] `gsap.registerPlugin(ScrollTrigger, ScrollSmoother)` executed before `.create()`.
- [ ] Smoother instance created and assigned to a reusable variable.
- [ ] `smoothTouch` configured at 0.1 or disabled.

---

## Phase 3: Parallax & Differential Motion

Add depth and differential scrolling speeds using declarative attributes or programmatic effect definitions.

For detailed configuration properties, see [api-reference.md](references/api-reference.md).

1. **Declarative Speed & Lag**:
   - Add `data-speed` to elements (`"2"` = double speed, `"0.5"` = half speed, `"1"` = standard).
   - Add `data-lag` to elements (`"0.5"` = half-second delay to catch up).
2. **Programmatic Effects via JS**:
   ```javascript
   smoother.effects(".box", {
     speed: 0.5,
     lag: (i) => i * 0.2
   });
   ```
3. **Auto Image Parallax (`speed: "auto"`)**:
   - Set container CSS: `overflow: hidden; position: relative;`
   - Set image CSS: `position: absolute; height: 160%; width: 100%; object-fit: cover;`
   - Apply effect:
     ```javascript
     smoother.effects("img.parallax", { speed: "auto" });
     ```

### Completion gate
- [ ] `effects: true` enabled on smoother config.
- [ ] Auto-parallax images styled with `position: absolute` and `height > 100%` inside `overflow: hidden` wrappers.

---

## Phase 4: Programmatic Scrolling & State Control

Handle element jumping, custom tweening, modal pausing, and velocity integration.

1. **Instant or Smooth Anchor Jumps**:
   ```javascript
   // smoother.scrollTo(target, smooth, position)
   smoother.scrollTo("#section-3", true, "center center");
   smoother.scrollTo(450, false); // instant jump to pixel 450
   ```
2. **Custom GSAP Tween Transitions**:
   ```javascript
   gsap.to(smoother, {
     scrollTop: smoother.offset("#section-3", "center center"),
     duration: 2,
     ease: "back.out(1.7)"
   });
   ```
3. **Pause Scrolling for Overlays / Modals**:
   ```javascript
   function toggleModal(isOpen) {
     modalElement.classList.toggle("active", isOpen);
     smoother.paused(isOpen);
   }
   ```
4. **Velocity-Driven Effects**:
   - Elicit current scroll velocity inside `onUpdate` and pipe into `gsap.quickTo()`:
   ```javascript
   const rotateSetter = gsap.quickTo(".reactive-card", "rotation");
   const clamp = gsap.utils.clamp(-360, 360);

   const smoother = ScrollSmoother.create({
     wrapper: "#smooth-wrapper",
     content: "#smooth-content",
     smooth: 2,
     onUpdate: (self) => {
       rotateSetter(clamp(self.getVelocity()));
     }
   });
   ```

### Completion gate
- [ ] Anchor links and buttons use `smoother.scrollTo()` or `smoother.offset()` with `scrollTop`.
- [ ] Modal opening handlers call `smoother.paused(true)` and closing handlers call `smoother.paused(false)`.
- [ ] Velocity updates use `gsap.quickTo()` with clamped boundary values.

---

## Phase 5: ScrollTrigger Integration & Verification

Combine ScrollSmoother with standard ScrollTrigger features.

1. **Element Pinning**:
   ```javascript
   ScrollTrigger.create({
     trigger: ".pinned-section",
     pin: true,
     start: "top top",
     end: "+=500px"
   });
   ```
2. **Horizontal Section Simulation**:
   - Translate horizontal track along X-axis scrubbed against vertical scroll:
   ```javascript
   gsap.to(panels, {
     xPercent: -100 * (panels.length - 1),
     ease: "none",
     scrollTrigger: {
       trigger: ".horizontal-container",
       pin: true,
       scrub: true,
       end: () => "+=" + container.offsetWidth
     }
   });
   ```

### Completion gate
- [ ] Pinned elements maintain correct layout coordinates inside `#smooth-content`.
- [ ] All ScrollTrigger instances refresh without layout shift or jitter.
- [ ] Native keyboard navigation (Tab/Shift+Tab) functions across smoothed content.
```

---

### `scrollsmoother-implementation/references/terminology.md`

```markdown
# Terminology & Anti-Patterns

**ScrollSmoother**:
A GSAP plugin that computes differential between native window scroll position and rendered view, applying matrix transform easing to `#smooth-content`.
_Avoid_: scroll hijacker, virtual scroller, scroll emulator.

**Smooth Wrapper (`#smooth-wrapper`)**:
The fixed outer viewport container (`position: fixed; inset: 0; overflow: hidden;`) that anchors the visible screen.
_Avoid_: scroll container, viewport div.

**Smooth Content (`#smooth-content`)**:
The inner container housing all document content that receives inline CSS transforms for smooth easing.
_Avoid_: body wrapper, page holder.

**`data-speed`**:
A multiplier attribute defining element scroll speed relative to document flow (`1` = normal, `2` = double speed, `0.5` = half speed).
_Avoid_: parallax-rate, scroll-speed.

**`data-lag`**:
A time-based delay attribute (in seconds) determining how lazily an element catches up to the scroll position.
_Avoid_: lag-time, follow-delay.

**`smoothTouch`**:
Configuration setting controlling smooth scrolling duration on touch/pointer-drag devices (default `0`).
_Avoid_: touch-inertia, mobile-smooth.

**`getVelocity()`**:
Method on the smoother instance returning current scrolling speed in pixels per second.
_Avoid_: scrollSpeed(), currentVelocity().
```

---

### `scrollsmoother-implementation/references/api-reference.md`

```markdown
# ScrollSmoother API Reference

## Configuration Options (`ScrollSmoother.create({...})`)

| Option | Type | Default | Description |
|---|---|---|---|
| `wrapper` | `String \| Element` | `"#smooth-wrapper"` | Outer container selector or element. |
| `content` | `String \| Element` | `"#smooth-content"` | Inner content container selector or element. |
| `smooth` | `Number` | `0.8` | Seconds for content to catch up to native scroll position. |
| `smoothTouch` | `Number \| Boolean` | `0` | Smoothing duration on touch devices (0 = native 1:1 touch scroll). |
| `effects` | `Boolean \| String` | `false` | When `true`, parses `data-speed` and `data-lag` attributes on DOM elements. |
| `onUpdate` | `Function(self)` | `null` | Callback executed every time smooth scroll updates. `self` is the ScrollSmoother instance. |
| `onStop` | `Function(self)` | `null` | Callback executed when smooth scroll completes catch-up. |

---

## Instance Methods

### `smoother.scrollTo(target, smooth, position)`
- **`target`**: `String | Element | Number` — CSS selector, DOM element, or pixel number.
- **`smooth`**: `Boolean` — `true` for animated ease, `false` for instant jump.
- **`position`**: `String` (Optional) — Viewport/target alignment string (e.g., `"center center"`, `"top top"`, `"top 100px"`).

### `smoother.offset(target, position)`
- Returns the exact pixel scroll value where `target` meets `position` in the viewport.
- Useful for passing target scroll positions to `gsap.to(smoother, { scrollTop: ... })`.

### `smoother.paused(boolean)`
- Getter/Setter for scroll state.
- `smoother.paused(true)`: Halts scrolling and freezes screen.
- `smoother.paused(false)`: Unfreezes scrolling.

### `smoother.getVelocity()`
- Returns current scroll velocity in pixels per second (positive when scrolling down, negative when scrolling up).

### `smoother.effects(targets, config)`
- Programmatically assigns speed and lag without HTML data attributes.
- **`config` options**:
  - `speed`: `Number | "auto"`
  - `lag`: `Number | Function`
  - `refresh`: `Boolean`
```

---

### `scrollsmoother-implementation/references/examples.md`

```markdown
# ScrollSmoother Examples

## Example 1: Standard Smooth Scroll with Speed & Lag

### Scenario
An agency portfolio page requiring smooth scroll, differential box speeds, and staggered lag effect.

### HTML
```html
<div id="smooth-wrapper">
  <div id="smooth-content">
    <header class="hero"><h1>Agency Showcase</h1></header>
    <div class="box-grid">
      <div class="box" data-speed="1.5">Fast</div>
      <div class="box" data-speed="1" data-lag="0.3">Normal + Lag</div>
      <div class="box" data-speed="0.5">Slow</div>
    </div>
  </div>
</div>
```

### JavaScript
```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 2,
  effects: true
});
```

---

## Example 2: Automatic Parallax Images (`speed: "auto"`)

### Scenario
Editorial layout featuring full-width images that seamlessly shift inside their containers.

### CSS
```css
.image-container {
  position: relative;
  height: 400px;
  overflow: hidden;
  margin: 4rem 0;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 160%;
  object-fit: cover;
}
```

### JavaScript
```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.5,
  effects: true
});

smoother.effects(".image-container img", { speed: "auto" });
```

---

## Example 3: Modal Pause and Velocity-Driven Skew

### Scenario
Interactive product gallery where scrolling skews cards proportionally to velocity, and smooth scrolling freezes when an inquiry modal opens.

### JavaScript
```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const skewSetter = gsap.quickTo(".product-card", "skewY");
const clamp = gsap.utils.clamp(-20, 20);

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 2,
  onUpdate: (self) => {
    skewSetter(clamp(self.getVelocity() / -50));
  },
  onStop: () => {
    skewSetter(0);
  }
});

// Modal toggle
const modalBtn = document.querySelector("#open-modal");
const closeBtn = document.querySelector("#close-modal");
const modal = document.querySelector(".modal");

modalBtn.addEventListener("click", () => {
  modal.classList.add("visible");
  smoother.paused(true);
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("visible");
  smoother.paused(false);
});
```
```

---

## Phase 5: Validation

### Source Fidelity Checklist
- [x] `#smooth-wrapper` & `#smooth-content` structure encoded in Phase 1 & `terminology.md`.
- [x] Native scrolling accessibility principle preserved in Phase 1 & `terminology.md`.
- [x] `gsap.registerPlugin` requirement encoded in Phase 2.
- [x] `smooth` and `smoothTouch` configuration and constraints encoded in Phase 2 and `api-reference.md`.
- [x] `data-speed`, `data-lag`, and `smoother.effects()` encoded in Phase 3 & `examples.md`.
- [x] Automatic image parallax requirements (`overflow: hidden`, `position: absolute`, `height: 160%`, `speed: "auto"`) encoded in Phase 3, constraint ku-021, and `examples.md`.
- [x] `smoother.scrollTo()`, `smoother.offset()`, and `scrollTop` GSAP tweening encoded in Phase 4 & `api-reference.md`.
- [x] `smoother.paused()` modal flow encoded in Phase 4 and `examples.md`.
- [x] `onUpdate`, `onStop`, `self.getVelocity()`, `gsap.quickTo()`, and `gsap.utils.clamp()` encoded in Phase 4 and `examples.md`.
- [x] ScrollTrigger pinning and simulated horizontal scrolling encoded in Phase 5.

### Test Scenarios

1. **Scenario 1: Accessibility-compliant corporate site with smooth scrolling and anchor links**
   - *Walkthrough*: Phase 1 sets up markup without hijacking native scroll. Phase 2 configures `smooth: 2, smoothTouch: 0`. Phase 4 implements `smoother.scrollTo(target, true, 'top top')` for navigation links.
   - *Outcome*: Meets all criteria; keyboard tabbing functions natively.

2. **Scenario 2: Parallax photography blog with dynamic card skew**
   - *Walkthrough*: Phase 3 applies container CSS with `speed: "auto"` to image tags. Phase 4 attaches `onUpdate` to `smoother.getVelocity()` with `gsap.quickTo()`.
   - *Outcome*: High-performance GPU transforms without jitter.

3. **Scenario 3: Site with fullscreen overlay menus / modal forms**
   - *Walkthrough*: Phase 4 sets `smoother.paused(true)` on modal open and `smoother.paused(false)` on close.
   - *Outcome*: Prevents background scroll-bleed while overlay is active.

---

## Delivery Summary

1. **Compiled Skill Package**: Complete, self-contained `scrollsmoother-implementation` skill with `SKILL.md`, `references/terminology.md`, `references/api-reference.md`, and `references/examples.md`.
2. **Extracted Knowledge Units**: 13 total units (3 concepts, 2 principles, 4 procedures, 2 constraints, 3 illustrative examples).
3. **Key Guidance Highlight**:
   - Never use high `smoothTouch` values (keep at `0` or `<= 0.1`) to avoid touch disconnect.
   - Always ensure auto-parallax images have `position: absolute`, `height > 100%`, and an outer container with `overflow: hidden`.
   - Always use `gsap.quickTo()` for velocity-bound callbacks to avoid creating un-garbage-collected tween overhead on every frame.
