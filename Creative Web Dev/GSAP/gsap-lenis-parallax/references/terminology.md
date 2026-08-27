# Terminology

**Lenis**:
A lightweight smooth scroll library that standardizes scrolling momentum across platforms.
_Avoid_: scroll-hijacking, window-wheel-override

**ScrollTrigger**:
The GSAP plugin that drives animations based on viewport scroll progress and element triggers.
_Avoid_: intersection observer tweening, window scroll listener

**Scrubbing**:
Direct synchronization where the scrollbar position acts as the playhead for the animation timeline.
_Avoid_: scroll triggering on enter, scroll events

**Stagger**:
Offsetting the start times of an array of animation targets to create a sequential cascade effect.
_Avoid_: set-timeout cascade, manual delay looping

**Extended Viewport Canvas**:
A container explicitly styled with multiple viewport heights (`min-height: 300vh+`) to supply sufficient scroll track for long timeline scrubs.
_Avoid_: artificial scroll space, empty filler divs
