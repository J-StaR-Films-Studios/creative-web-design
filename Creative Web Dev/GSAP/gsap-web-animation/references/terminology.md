# Terminology

**Tween**:
A single animation instance created by GSAP that interpolates target element properties over time.
_Avoid_: transition, CSS keyframe

**Timeline**:
A container object that choreographs multiple tweens across a shared virtual playhead, eliminating manual delay calculations.
_Avoid_: delay chain, setTimeout sequence

**Vars Object**:
The JavaScript object passed to GSAP methods containing target property values and configuration settings (duration, ease, callbacks).
_Avoid_: options hash, CSS block

**Stagger**:
A timing offset applied between multiple elements matching the same selector, causing them to animate sequentially.
_Avoid_: waterfall delay, CSS animation-delay loop

**Ease**:
A mathematical timing function that modulates the rate of change across an animation's duration (e.g., `power2.out`, `power4.inOut`).
_Avoid_: transition timing, CSS bezier curve

**ScrollTrigger**:
The GSAP plugin responsible for linking tween/timeline execution, pinning, and scrubbing to scroll position.
_Avoid_: scroll listener, intersection observer wrapper

**Scrub**:
A mode in ScrollTrigger where animation progress is directly proportional to scrollbar position rather than time duration.
_Avoid_: scroll sync, parallax loop

**Pinning**:
Holding an element stationary in the viewport for the duration of a ScrollTrigger boundary while the scroll continues.
_Avoid_: position sticky, fixed scroll lock
