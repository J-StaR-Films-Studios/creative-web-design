# Terminology

**Lenis**:
An open-source smooth scroll library created by Darkroom Engineering / Studio Freight that normalizes input delta and provides buttery-smooth inertia without breaking native browser accessibility or scroll anchors.
_Avoid_: scroll hijacker, fake scroll, virtual scroller

**ScrollTrigger**:
The industry-standard GSAP plugin that translates page scroll position into animation progress, viewport-relative triggers, and CSS pin states.
_Avoid_: scroll listener, scroll watcher

**Ticker Synchronization**:
The technique of linking an animation engine's frame loop (GSAP Ticker) directly with an inertia scroll loop (Lenis RAF) so both execute on identical frame timestamps.
_Avoid_: dual requestAnimationFrame, independent render loops

**Pin Container**:
The static parent HTML section targeted by ScrollTrigger's `pin` property, keeping the section fixed in the viewport while child elements animate.
_Avoid_: fixed element, sticky div

**Flex Track**:
The inner horizontally expanding container element (`display: flex`) that receives `transform: translateX(...)` values during vertical scroll.
_Avoid_: slider list, carousel wrapper

**Functional Value (GSAP)**:
A property defined as a callback function (e.g. `x: () => value`) evaluated dynamically on every ScrollTrigger refresh/resize rather than computed once at runtime.
_Avoid_: hardcoded offset, static pixel value
