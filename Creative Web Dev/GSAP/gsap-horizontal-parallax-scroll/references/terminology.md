# Terminology

**Pinning**:
Locking a target element in the viewport during scroll while creating virtual scroll track space.
_Avoid_: sticky positioning, fixed hijacking

**Scrub**:
Linking the playhead progress of an animation directly to the scrollbar scroll position.
_Avoid_: scroll listener, scroll trigger callback

**Differential Parallax**:
Applying differing translation speeds and rotational deltas to child elements within a moving parent track to simulate visual depth.
_Avoid_: background parallax, standard parallax

**Scroll Track**:
The total vertical scroll height assigned to a parent element (`1200vh`) used to drive scrubbed timelines.
_Avoid_: document height, scroll distance
