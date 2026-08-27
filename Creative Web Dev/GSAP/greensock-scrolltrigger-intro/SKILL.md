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
