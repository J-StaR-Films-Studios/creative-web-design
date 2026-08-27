# GSAP & React Animation Terminology

**Tween**:
The foundational animation instance created by `gsap.to()`, `gsap.from()`, or `gsap.fromTo()` that interpolates properties of objects/DOM nodes over time.
_Avoid_: CSS keyframe, transition block

**Timeline (`gsap.timeline`)**:
A sequencing container that manages multiple tweens and callbacks, controlling their execution relative to a single playhead.
_Avoid_: animation chain, setTimeout queue

**useGSAP**:
The React-specific hook from `@gsap/react` that provides automatic context-based scoping, cleanup, and dependency tracking for GSAP animations.
_Avoid_: useEffect animation wrapper, componentDidMount tween

**ScrollTrigger**:
The GSAP plugin responsible for binding tween or timeline progress to scrollbar coordinates, supporting features like pinning, scrubbing, and snapping.
_Avoid_: scroll listener, intersection observer animation

**Scrub (`scrub`)**:
A ScrollTrigger property that ties playhead progress directly to the scrollbar movement. Setting a numeric value (e.g. `scrub: 1.5`) smooths the catch-up response.
_Avoid_: scroll trigger on-scroll event

**Pinning (`pin`)**:
Locking a DOM element in place in the viewport while the scrollbar continues to progress over a specified scroll distance.
_Avoid_: sticky positioning hack, fixed position toggle

**SplitText**:
A utility plugin that parses text nodes into nested `span` arrays (`chars`, `words`, `lines`) for kinetic typography.
_Avoid_: custom span splitter, regex text parser

**GOP Size (Group of Pictures)**:
The frequency of keyframes (I-frames) in video encoding. For scroll-scrubbed video, GOP must equal 1 (`-g 1`).
_Avoid_: standard video compression, variable keyframe interval
