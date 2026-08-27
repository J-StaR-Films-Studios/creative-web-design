# Terminology

**2D Rendering Context (`CanvasRenderingContext2D`)**:
The drawing state machine interface obtained from a `<canvas>` element providing immediate-mode rasterization methods.
_Avoid_: canvas engine, graphics driver, canvas DOM.

**Immediate-Mode Rendering**:
A rendering paradigm where graphics commands directly modify pixel buffers each frame without maintaining an internal scene graph.
_Avoid_: retained mode, DOM graphics.

**Normalized Velocity Vector**:
A directional magnitude pair `{x, y}` scaled between -1 and +1 derived from trigonometric functions representing heading per unit of time.
_Avoid_: angle delta, speed coordinates.

**Euclidean Distance**:
The straight-line length between two points in Cartesian space computed as `√(Δx² + Δy²)`.
_Avoid_: bounding box distance, grid step.

**Zero-Timeout Splicing**:
The practice of wrapping array `splice` operations in `setTimeout(..., 0)` to defer array mutation until the current call stack and loop iteration resolve.
_Avoid_: direct splicing, in-place deletion, immediate slice.

**Alpha Trailing (Motion Trail)**:
A visual technique where the background is redrawn each frame using a low-opacity fill (`rgba(0, 0, 0, 0.1)`) instead of full clearing, causing past pixels to fade progressively.
_Avoid_: ghost blur, motion blur filter.

**Tweening**:
The automatic interpolation of object properties across time using mathematical easing functions.
_Avoid_: frame jumping, manual stepping.
