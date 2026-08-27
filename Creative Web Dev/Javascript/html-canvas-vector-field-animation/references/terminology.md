# Terminology & Canonical Concepts

**Vector Field**:
A spatial grid across 2D coordinate space where each node defines a directional angle and magnitude.
_Avoid_: static raster, particle background, sprite canvas

**Private Class Fields (`#field`)**:
ES2022 JavaScript syntax providing true engine-enforced private encapsulation of object properties.
_Avoid_: underscore-prefix convention (`_field`), closure variables inside constructor

**Delta Time (`deltaTime`)**:
The time elapsed in milliseconds between consecutive animation frames (`currentTime - previousTime`), used to achieve consistent animation speed across screens with different refresh rates (60Hz, 120Hz, 144Hz).
_Avoid_: fixed frame counter, hardcoded step increment, `setInterval` tick

**Direct Trigonometric Rendering**:
Calculating line endpoints using `x + cos(θ) * length` and `y + sin(θ) * length` directly in drawing commands rather than altering the global canvas transformation matrix.
_Avoid_: canvas matrix stack manipulation (`ctx.save()`, `ctx.rotate()`, `ctx.restore()`) in high-frequency loops

**Squared Euclidean Distance**:
Measuring proximity via `dx*dx + dy*dy` rather than `Math.sqrt(dx*dx + dy*dy)` to eliminate CPU-heavy square root computations in dense loops.
_Avoid_: Euclidean distance with `Math.hypot` or `Math.sqrt` in per-frame grid traversal

**Color Stop (`addColorStop`)**:
A point along a linear or radial canvas gradient defining a normalized position (`0.0` to `1.0`) and color value.
_Avoid_: CSS gradient string interpolation on 2D context
