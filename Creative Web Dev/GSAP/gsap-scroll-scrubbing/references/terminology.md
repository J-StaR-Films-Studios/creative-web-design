# Terminology

**Scrubbing (Scroll Scrub)**:
The technique of linking the playhead of an animation directly to the scrollbar position such that scrolling forward advances the animation and scrolling backward reverses it.
_Avoid_: scroll trigger click, scroll threshold animation, scroll firing

**Damping (Numeric Scrub)**:
A numeric value specified in seconds representing the inertia or lag time required for the animation playhead to catch up to the current scrollbar position.
_Avoid_: animation delay, tween duration, transition timeout

**Scroll Trigger Bounds**:
The defined range between the `start` and `end` scroll markers across which 0% to 100% of the scrubbed animation is mapped.
_Avoid_: scroll limits, page heights, trigger distances

**Trigger**:
The target DOM element whose position relative to the viewport determines when scroll calculations activate.
_Avoid_: watcher, listener node, target observer
