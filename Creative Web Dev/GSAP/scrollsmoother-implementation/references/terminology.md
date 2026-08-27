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
