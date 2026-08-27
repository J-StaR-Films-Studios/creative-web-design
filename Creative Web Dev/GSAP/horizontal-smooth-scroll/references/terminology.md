# Terminology

**Lenis**:
A lightweight smooth scroll library that intercepts and interpolates scrolling coordinates with momentum physics.
_Avoid_: scroll hijacking, native scroll override

**ScrollTrigger Pinning**:
A GSAP mechanism that fixes a DOM element at a specific viewport coordinate while creating virtual vertical scroll height.
_Avoid_: sticky positioning, fixed viewport locking

**Scroll Amount**:
The net pixel offset required to translate an oversized container until its rightmost boundary aligns with the viewport right edge (`-(scrollWidth - windowWidth)`).
_Avoid_: fixed offset, static width animation

**Scrubbing**:
Directly binding animation playback progress (`0.0` to `1.0`) to scroll distance rather than firing a timed playback on trigger.
_Avoid_: scroll trigger autoplay, scroll-linked duration
