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
