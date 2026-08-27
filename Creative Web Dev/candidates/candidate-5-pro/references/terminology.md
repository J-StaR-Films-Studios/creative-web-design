# Canonical Terminology

Adhere strictly to this domain vocabulary to ensure exactness in code architecture and communication.

## Glossary & Anti-Synonyms

### The Playhead
- **Definition**: The normalized progression metric (`0.0` to `1.0`) driving an animation, scroll timeline, or shader uniform.
- **Avoid**: "Percentage", "Scroll position", "Progress bar".
- **Use**: Normalized progress, Timeline playhead, Scroll progress.

### Lerp (Linear Interpolation)
- **Definition**: The mathematical function `v0 + t * (v1 - v0)` used to smoothly transition between two values over time.
- **Avoid**: "Easing", "CSS Transition", "Smooth animation".
- **Use**: Lerping, Linear Interpolation, Damping.

### Stride Arithmetic
- **Definition**: The mathematical operation converting a 1D pixel array `(Uint8ClampedArray)` into a 2D coordinate space. `index = (y * width + x) * 4`.
- **Avoid**: "Array looping", "Pixel grabbing".
- **Use**: Stride traversal, Buffer indexing.

### Uniforms
- **Definition**: Global variables passed from the CPU (JavaScript) to the GPU (GLSL shader programs) that remain constant for all vertices/fragments in a single draw call.
- **Avoid**: "Shader variables", "Context data".
- **Use**: Uniforms, varying inputs.

### Instancing (InstancedMesh)
- **Definition**: Rendering thousands of identical geometries with distinct transformations (position, rotation, scale, color) using a single draw call.
- **Avoid**: "Cloning objects", "Adding many meshes", "Group rendering".
- **Use**: Instancing, InstancedMesh, Draw call batching.

### Pinning (Scroll Hijacking)
- **Definition**: Freezing an element in the viewport while continuing to measure scroll distance (often via a ghost spacing element or GSAP Pin Spacer) to drive a local playhead.
- **Avoid**: "Sticky positioning", "Fixed scroll".
- **Use**: ScrollTrigger Pinning, Playhead trapping.

### Baking
- **Definition**: Pre-computing heavy calculations (lighting, physics, high-poly geometry) into texture maps, vertex animations, or video sequences to eliminate real-time compute cost.
- **Avoid**: "Rendering out", "Exporting visuals".
- **Use**: Texture baking, Cinematic baking.
