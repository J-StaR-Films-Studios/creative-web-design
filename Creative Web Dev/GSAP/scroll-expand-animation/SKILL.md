---
name: scroll-expand-animation
description: |
  Implement dynamic scroll-driven expanding layouts and smooth scrolling
  using Lenis, GSAP ScrollTrigger, and IntersectionObserver API.
  Triggers: dynamic scroll animation, expanding image on scroll,
  lenis gsap scrolltrigger, dynamic height scroll, interactive scroll expansion.
---

# Scroll Expand Animation

Implement performant, dynamic scroll-driven expansion where element heights and image widths expand smoothly based on scroll position without trigger-drift bugs.

## Core Principles

1. **Decouple Trigger Binding**: Do not bind ScrollTriggers across all dynamically expanding items upfront. Static trigger points drift when sibling items alter page height dynamically.
2. **Observe Before Triggering**: Use `IntersectionObserver` to detect when an item is within range, dynamically bind the `ScrollTrigger.create()` instance, and immediately unobserve the target.
3. **Synchronize Animation Loops**: Pipe Lenis smooth scroll updates directly into the GSAP ticker and set lag smoothing to `0` to prevent stutter.

---

## Workflow Phases

### Phase 1: DOM & Layout Architecture

Structure the page with bounding containers and flex-based expandable components.

1. Create parent container with three primary blocks: `Hero`, `Expandable Section (e.g., Services)`, and `Footer`.
2. Define a multi-column header (`col` flex distribution) above the list items.
3. Structure each expandable row item with two child blocks:
   - **Info block (`.service-info`)**: Text, titles, descriptions (flex column with `space-between`).
   - **Visual block (`.service-img`)**: Fixed initial width/height wrapper containing an image element (`overflow: hidden`, `border-radius`).
4. Set default initial dimensions in CSS:
   - Image wrapper width: `30%` (expands to `100%`).
   - Service item base height: `150px` (expands up to `450px`).
   - Images inside containers: `width: 100%`, `height: 100%`, `object-fit: cover`.

#### Completion Gate
- [ ] Section and item DOM markup matches standard schema.
- [ ] Base dimensions defined in CSS without hardcoded viewport breaks.

---

### Phase 2: Lenis Smooth Scroll Synchronization

Initialize Lenis and couple it with the GSAP ticker.

1. Ensure CSS includes Lenis scroll handling defaults (or `html.lenis` auto height).
2. Instantiate Lenis on `DOMContentLoaded`.
3. Link Lenis scroll listener to `ScrollTrigger.update`.
4. Add Lenis RAF handling to `gsap.ticker`.
5. Disable lag smoothing via `gsap.ticker.lagSmoothing(0)` to prevent frame skipping during intense scroll gestures.

For boilerplates and scripts, see [code-templates.md](references/code-templates.md).

#### Completion Gate
- [ ] Lenis drives the window scroll without competing with native momentum.
- [ ] GSAP ticker updates Lenis on every animation frame.

---

### Phase 3: Observer-Driven ScrollTrigger Binding

Bind dynamic scroll expansion using `IntersectionObserver`.

1. Collect target items using `gsap.utils.toArray('.service')`.
2. Define `observerOptions` with `root: null`, `rootMargin: '0px'`, and `threshold: 0.1` (triggers when 10% is visible).
3. In `observerCallback`:
   - Verify `entry.isIntersecting`.
   - Query the internal image container (`.service-img` / `.img`).
   - Create a `ScrollTrigger` for image width:
     - `trigger: service`
     - `start: "bottom bottom"`, `end: "top top"`
     - `scrub: true`
     - In `onUpdate(self)`: calculate `let newWidth = 30 + 70 * self.progress;` and apply `gsap.to(imgContainer, { width: newWidth + "%", duration: 0.1, ease: "none" })`.
   - Create a `ScrollTrigger` for container height:
     - `trigger: service`
     - `start: "top bottom"`, `end: "top top"`
     - `scrub: true`
     - In `onUpdate(self)`: calculate `let newHeight = 150 + 300 * self.progress;` and apply `gsap.to(service, { height: newHeight + "px", duration: 0.1, ease: "none" })`.
4. Call `observer.unobserve(entry.target)` immediately after attaching triggers to prevent duplicate bindings.
5. Loop through all items with `services.forEach(service => observer.observe(service))`.

For technical definitions and anti-patterns, see [terminology.md](references/terminology.md).

#### Completion Gate
- [ ] Elements only attach ScrollTriggers upon entering viewport threshold.
- [ ] Elements unobserve immediately after initialization.
- [ ] Width and height expand proportionally during scroll without jitter or drift.
