# Terminology

**Lottie**:
An open-source, JSON-based vector animation format rendered dynamically on the web via SVG or Canvas.
_Avoid_: GIF, MP4 embed, CSS keyframe sprite

**Scroll Scrubbing**:
Directly binding an animation's playhead position to the user's scroll progress ratio (0.0 to 1.0).
_Avoid_: Scroll trigger toggle, trigger once, autoplay on scroll

**ScrollTrigger Progress (`self.progress`)**:
A normalized decimal value between 0.0 (entry point) and 1.0 (exit point) representing the viewport's relative traversal through the trigger zone.
_Avoid_: Pixel scroll offset, window.scrollY

**`goToAndStop(value, isFrame)`**:
The Lottie API method to advance the playhead to an exact location. When `isFrame` is `true`, `value` represents a frame index; when `false`, it represents milliseconds.
_Avoid_: `play()`, `goToAndPlay()`
