# Terminology

**ScrollTrigger**:
The GSAP plugin responsible for linking DOM animation playheads and lifecycle hooks to scroll positions.
_Avoid_: scroll listener, scroll watcher

**toggleActions**:
A 4-part configuration string (`"onEnter onLeave onEnterBack onLeaveBack"`) controlling tween playback state.
_Avoid_: scroll state string, transition trigger

**Scrubbing**:
Synchronizing the playhead position of an animation to the progress between `start` and `end` scroll coordinates.
_Avoid_: scroll-jacking, smooth scroll hijack

**Pinning**:
Temporarily locking an element's viewport position (`position: fixed` emulation) for a set scroll distance.
_Avoid_: CSS sticky hack, static locking

**pinSpacing**:
Automatic padding injected below a pinned element by ScrollTrigger to preserve page scroll height.
_Avoid_: scroll spacer, margin pushing

**Scroller**:
The scrollable container holding the trigger element. Defaults to the browser window/viewport.
_Avoid_: scroll parent, outer box

**Markers**:
Visual debugging guides drawn on screen showing exact `start`, `end`, `scroller-start`, and `scroller-end` collision lines.
_Avoid_: debug lines, layout guides
