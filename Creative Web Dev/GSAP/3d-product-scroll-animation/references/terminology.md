# Terminology

**Scroll Scrubbing**:
The bidirectional coupling of animation playback progress directly to the window's vertical scroll offset.
_Avoid_: scroll-based animation, scroll listener trigger

**Box3 Bounding Normalization**:
Computing an exact enclosing cuboid for a Three.js object hierarchy to extract absolute geometric dimensions and geometric center point.
_Avoid_: hardcoded mesh offsets, manual 3D centering

**Clip-Path Circular Masking**:
Using CSS `clip-path: circle(radius at x y)` to create a spotlight or radial reveal transition between layered DOM viewports.
_Avoid_: SVG overlay mask, canvas circular clearing

**SplitText Span Masking**:
Deconstructing raw text nodes into individually wrapped inline-block character or line spans housed within overflow-hidden block containers.
_Avoid_: opacity text fading, character slicing

**Delta Axis Rotation (`rotateOnAxis`)**:
Applying incremental angular steps around an arbitrary local 3D vector rather than setting Euler angles directly.
_Avoid_: absolute Euler assignment, raw rotation.y overwriting
