# Terminology

**ScrollTrigger**:
The GSAP plugin responsible for linking DOM tweens and timelines to scroller positions and viewport intersections.
_Avoid_: scroll listener, scroll watcher, intersection observer script

**Trigger Hook**:
The first token in a `start` or `end` string specifying the reference coordinate on the target animated element (e.g., `top`, `bottom`, `center`, `35%`, `-50%`).
_Avoid_: element marker, element trigger line

**Scroller Hook**:
The second token in a `start` or `end` string specifying the reference coordinate in the viewport or scrollable container (e.g., `top`, `center`, `bottom`, `80%`, `20%`).
_Avoid_: viewport line, screen trigger

**Scrubbing (`scrub`)**:
The mode where animation playhead progress (0% to 100%) is directly locked to the scroll distance between `scroller-start` and `scroller-end`.
_Avoid_: scroll syncing, frame scrubbing

**ToggleActions**:
A 4-token configuration string defining discrete playback commands (`play`, `pause`, `reverse`, `restart`, etc.) executed when entering/leaving trigger boundaries during non-scrubbed playback.
_Avoid_: scroll callbacks, trigger events
