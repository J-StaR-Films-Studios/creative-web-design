# Terminology

**Lenis**:
A high-performance, modern smooth-scrolling engine that preserves native scroll behavior and accessibility while applying configurable easing physics.
_Avoid_: body scroll hijacker, fake custom scrollbar

**Scrubbing**:
The direct 1:1 binding of animation playhead progress to the scrollbar/viewport travel distance.
_Avoid_: scroll trigger timer, delayed scroll animation

**RequestAnimationFrame (RAF) Loop**:
A high-frequency browser callback loop executing render computations immediately before screen redraws, ensuring 60Hz/120Hz smooth interpolation.
_Avoid_: interval loop, timer callback

**Transform Origin**:
The coordinate anchor point around which CSS transformations (scaling, rotation, skewing) pivot.
_Avoid_: center point, scale anchor

**Lerp (Linear Interpolation)**:
A mathematical smoothing technique computing fractional movements between a current value and a target value per animation tick.
_Avoid_: step animation, jump scroll
