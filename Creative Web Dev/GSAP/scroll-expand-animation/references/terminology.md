# Terminology

**Intersection Observer API**:
A native browser API providing asynchronous observation of the intersection of a target element with an ancestor element or top-level document viewport.
_Avoid_: window scroll listener, resize listener polling.

**ScrollTrigger Scrub**:
A GSAP feature that links animation progress directly to the scrollbar position, advancing or reversing animations smoothly with scrolling.
_Avoid_: scroll toggle, one-shot scroll trigger.

**Trigger Drift**:
The misalignment of computed trigger start/end positions caused by dynamic DOM height changes occurring above the trigger element after page load.
_Avoid_: scroll offset error, animation jump.

**Lag Smoothing**:
GSAP's mechanism to adjust rendering ticks when frame rates drop; must be zeroed when using smooth scroll libraries like Lenis to maintain strict 1:1 scroll synchronization.
_Avoid_: frame throttling, ticker delay.
