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
