# Creative Web Development Terminology

Strict terminology adherence ensures robust agent reasoning.

| Term | Definition | _Avoid_ |
| :--- | :--- | :--- |
| **Playhead** | The normalized scalar value (0.0 to 1.0) representing progress through a timeline or scroll region. | Scroll position, progress bar. |
| **RAF Loop** | `requestAnimationFrame` loop. The singular recursive function driving rendering. | Game loop, timer. |
| **DPR** | Device Pixel Ratio. Defines physical vs logical pixels. | Resolution scaling. |
| **InstancedMesh** | Rendering multiple copies of the same geometry in a single draw call. | Many meshes, cloning. |
| **Fragment Shader** | GLSL program computing pixel color on the GPU. | Pixel shader, color code. |
| **Vertex Displacement** | Modifying vertex coordinates in the Vertex Shader before rasterization. | Shape morphing. |
| **FBO** | Frame Buffer Object. Render target for off-screen GPU processing. | Hidden canvas, texture buffer. |
| **Scrubbing** | Tying an animation's progress directly to scroll velocity and position. | Scroll animating. |
| **Spring Anchor** | The origin `(x, y)` coordinate a physics particle desires to return to. | Original position. |
