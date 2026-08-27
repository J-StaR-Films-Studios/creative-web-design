# Creative Web Development: Canonical Terminology & Anti-Synonyms

A precise glossary of architectural concepts, mathematical principles, and visual computing models for creative web development.

---

## 1. Core Architecture & Pipeline Models

### Input-to-Computation Pipeline
- **Definition**: An architectural model where user actions (pointer movement, scroll wheel, touch drag, window resize) are transformed into continuous mathematical state vectors (velocity, distance, normalized progression) that drive GPU shaders, canvas physics, and DOM transformations in a deterministic render loop.
- **_Avoid_**: Triggered animation, DOM event callbacks, script-based animation.

### Central RAF Ticker
- **Definition**: A singular, unified `requestAnimationFrame` loop that drives all physics integrations, smooth scrolling engines (Lenis), GSAP timelines, Canvas 2D contexts, and WebGL renders from a single synchronized timestamp, eliminating inter-frame phase tearing and micro-stutters.
- **_Avoid_**: Multiple setInterval loops, uncoordinated requestAnimationFrame calls, decoupled animation timers.

### Virtual Playhead
- **Definition**: A normalized numerical progression scalar ($t \in [0.0, 1.0]$) representing the absolute temporal or spatial position of a scroll journey or interactive state machine, independent of raw hardware scroll ticks or screen pixel distances.
- **_Avoid_**: Scroll distance, window scroll offset, scroll percentage.

### High-DPI Backing Scale (DPR Clamping)
- **Definition**: The technique of sizing a canvas's internal raster buffer (`canvas.width = cssWidth * dpr`) by a constrained device pixel ratio ($\text{DPR} = \min(\text{window.devicePixelRatio}, 2)$) while applying a 2D context scale or WebGL viewport transformation to ensure crisp rendering on Retina displays without incurring GPU memory exhaustion.
- **_Avoid_**: Unconstrained DPR, Retina stretching, canvas pixel scaling.

---

## 2. Kinetic Typography & DOM 3D

### SplitText Granularity
- **Definition**: The procedural deconstruction of DOM text elements into isolated character (`.char`), word (`.word`), or line (`.line`) span wrappers to enable per-unit spatial transformation, rotation, and staggered reveal sequences.
- **_Avoid_**: Letter splitting, string slicing, manual span wrapping.

### Mask Clipping (Line Masks)
- **Definition**: Wrapping split text lines or characters inside an outer `overflow: hidden` container so that vertical translation ($Y: 100\% \to 0\%$) produces a clean edge roll-in reveal without visible overflow or layout shifting.
- **_Avoid_**: CSS opacity fade, display toggling, unmasked text slides.

### Dual-DOM Accessibility Pattern
- **Definition**: Providing an intact, visually hidden semantic element (`<p class="sr-only">`) containing full text and links for screen readers and search engines, while marking the split, animated visual representation with `aria-hidden="true"`, ensuring accessibility compliance.
- **_Avoid_**: Un-annotated text splitting, screen reader character spelling, broken link traversal.

### 3D Stacking Context
- **Definition**: An isolated coordinate space created via `transform-style: preserve-3d` and `perspective: 1000px` that allows child elements to undergo spatial 3D translation ($Z$-depth) and rotation without altering the 2D layout flow of the document.
- **_Avoid_**: Z-index hacking, flat 2D layering, faux 3D.

---

## 3. Smooth Scrolling & Motion Orchestration

### Lenis Smooth Scroll
- **Definition**: A high-performance, non-invasive smooth scrolling engine that intercepts mouse wheel and touch deltas, applies exponential decay or bezier easing curves, and updates the native viewport scroll position via a synchronized RAF loop.
- **_Avoid_**: CSS scroll-behavior: smooth, scroll hijacking, janky mousewheel listeners.

### ScrollTrigger Scrub
- **Definition**: A GSAP mechanism that links the progress of an animation timeline directly to the scrollbar's physical position or a smoothed virtual playhead (`scrub: true` or `scrub: 1`), enabling bidirectional, user-scrubbed interaction.
- **_Avoid_**: Scroll-bound scroll events, manual onScroll progress calculation.

### Pinned Scroll Track
- **Definition**: A layout architecture where a viewport-sized container is locked in place (`pin: true`) across an extended scroll duration (e.g., `+=400%`), allowing complex multi-stage animations to unfold while page scrolling progresses.
- **_Avoid_**: Fixed-position hack, sticky scroll container without pin spacing.

### Lag Smoothing
- **Definition**: A GSAP feature that prevents animation jumps when CPU/GPU stalls occur. For real-time synchronized scroll scrubbers (e.g., Lenis + ScrollTrigger), `gsap.ticker.lagSmoothing(0)` is enforced to avoid rubber-banding when recovering from frame drops.
- **_Avoid_**: Frame skipping, jumpy scroll catchup, unconstrained tween delta.

---

## 4. Canvas 2D & Particle Physics

### 1D Uint8ClampedArray Stride
- **Definition**: The linear 1-dimensional array format returned by `ctx.getImageData().data` containing contiguous 4-byte RGBA sequences for every pixel. Addressed spatially via $\text{Index} = (y \times 4 \times \text{width}) + (x \times 4)$.
- **_Avoid_**: 2D pixel array, matrix lookup, pixel object map.

### Relative Perceived Luminance
- **Definition**: The human photometric brightness calculation derived from RGB components: $\text{Luminance} = \frac{\sqrt{0.299 R^2 + 0.587 G^2 + 0.114 B^2}}{100}$. Used to modulate particle velocity, size, or generation thresholds from raster buffers.
- **_Avoid_**: Average RGB brightness, gray arithmetic mean, unweighted luminance.

### Anchor Memory (Spring-Back Origin)
- **Definition**: Immutable resting coordinates (`baseX`, `baseY`) stored inside dynamic particle objects. When external forces (cursor repulsion) subside, an elastic damped spring pulls the particle back toward this anchor: $x \leftarrow x - \frac{x - \text{baseX}}{\text{damping}}$.
- **_Avoid_**: Reset to zero, static repositioning, non-physical bounce.

### Upper-Triangular Constellation Linking
- **Definition**: An optimized spatial neighbor comparison algorithm for drawing proximity lines between particles. By initializing the inner loop at $b = a + 1$, duplicate comparisons and self-connections are eliminated, halving execution cost to $\frac{N(N-1)}{2}$.
- **_Avoid_**: $O(N^2)$ full matrix check, duplicate line draws, bidirectional link tests.

---

## 5. WebGL, Three.js & React Three Fiber (R3F)

### Scene Graph & Viewport Rig
- **Definition**: The hierarchical tree of nodes (scenes, groups, meshes, lights, cameras) processed by Three.js, paired with a responsive camera rig that auto-calculates field of view (FOV) and distance based on asset bounding boxes (`THREE.Box3`).
- **_Avoid_**: Hardcoded camera Z coordinates, manual window-size mesh scaling, flat 3D placement.

### Draco Geometry Compression
- **Definition**: An open-source library that compresses 3D geometric meshes (vertices, normals, UVs, colors) within GLTF/GLB files, reducing asset payload transfer sizes by up to $80\text{--}90\%$.
- **_Avoid_**: Raw uncompressed OBJ/GLTF, massive unoptimized 3D models.

### On-Demand Dirty Rendering
- **Definition**: A WebGL rendering strategy that executes `renderer.render(scene, camera)` only when scene state, mesh orientation, or camera vectors are explicitly flagged as dirty (`viewer.setDirty()` or `needsUpdate = true`), reducing idle GPU/CPU battery consumption.
- **_Avoid_**: Continuous 60 FPS idle render loops, unnecessary GPU cycles on static frames.

### Axis-Angle Rotation (`rotateOnAxis`)
- **Definition**: Updating 3D object orientations incrementally along an arbitrary normalized vector using quaternion mathematics, preventing gimbal lock and trigonometric flipping during multi-turn scroll animations.
- **_Avoid_**: Direct Euler angle accumulation, unconstrained rotation.y += progress.

---

## 6. GPU Shaders & GLSL Visual Computation

### Vertex Displacement
- **Definition**: Modifying vertex coordinates $(x, y, z)$ dynamically inside a vertex shader before rasterization, using mathematical equations, texture maps, or procedural noise to create surface ripples, waves, and geometric deformations.
- **_Avoid_**: CPU-based vertex mesh manipulation, morph target brute force.

### Fragment Distortion & Chromatic Aberration (RGB Split)
- **Definition**: Sampling texture color channels at spatially offset UV coordinates inside a fragment shader based on a distortion vector field: $\text{UV}_R = \text{UV} + \Delta \cdot 1.2$, $\text{UV}_G = \text{UV} + \Delta$, $\text{UV}_B = \text{UV} + \Delta \cdot 0.8$.
- **_Avoid_**: CSS color filters, overlaid pseudo-elements, CPU image slicing.

### Procedural Noise (Perlin / Simplex / FBM)
- **Definition**: Continuous, non-repeating pseudorandom mathematical functions evaluated directly on the GPU. Fractal Brownian Motion (FBM) accumulates multiple octaves of noise with increasing frequencies and decreasing amplitudes to generate organic turbulence.
- **_Avoid_**: Math.random() in canvas loops, pre-rendered noise videos, tiling noise images.

### Mouse-Velocity Force Field
- **Definition**: Passing normalized cursor coordinates (`uMouse`) and decaying velocity vectors (`uVelocity`) as uniforms into GLSL shaders, creating an interactive fluid-like force field that distorts textures and geometry proportional to cursor speed.
- **_Avoid_**: Static cursor hover effects, instantaneous non-decaying shader jumps.

---

## 7. Hybrid 3D Cinematics & Baking

### The Hybrid 3D Architecture (ORYZO / Superlocal Paradigm)
- **Definition**: An architectural pattern combining pre-rendered offline cinematic image sequences (baked in Blender Cycles/Eevee for photorealistic lighting) with lightweight real-time WebGL meshes and interactive DOM layers, achieving cinematic fidelity within strict mobile web performance budgets.
- **_Avoid_**: Attempting full raytracing in WebGL, purely static pre-rendered video without interactive WebGL overlays.

### Image-Sequence Canvas Scrubber
- **Definition**: Loading pre-extracted, sequentially numbered image frames into an in-memory `Image` array and painting the exact frame corresponding to scroll progress onto an HTML5 2D Canvas with context-level aspect ratio preservation (`object-fit: cover` math).
- **_Avoid_**: Native `<video>` currentTime scrubbing on scroll, un-cached network frame fetches.

### Context Object-Fit Cover Math
- **Definition**: Calculating scaling ratios ($\text{ratio} = \max(\frac{\text{canvasWidth}}{\text{imgWidth}}, \frac{\text{canvasHeight}}{\text{imgHeight}})$) and centering offsets inside `ctx.drawImage()` to guarantee that rendered imagery covers the full canvas without visual distortion or aspect ratio warping.
- **_Avoid_**: Stretching canvas context, CSS background-size: cover on parent divs.

---

## 8. Performance & Memory Management

### Draw Call Budget
- **Definition**: The total number of discrete rendering commands issued by the CPU to the GPU per frame. In creative web development, draw calls must be kept below 50 by merging geometries or using `THREE.InstancedMesh`.
- **_Avoid_**: Individual meshes per particle, thousands of separate draw calls.

### Instanced Mesh Rendering (`THREE.InstancedMesh`)
- **Definition**: A WebGL rendering technique that draws thousands of identical geometric instances in a single draw call by passing per-instance transformation matrices and color attributes to the GPU in a contiguous buffer.
- **_Avoid_**: Spawning separate `THREE.Mesh` objects in a loop.

### Zero-Allocation Render Loop
- **Definition**: The engineering practice of pre-allocating all working vectors (`THREE.Vector3`), matrices, Euler angles, and temporary calculation objects outside the `requestAnimationFrame` loop, preventing garbage collector pauses and frame drops.
- **_Avoid_**: `new THREE.Vector3()` inside `useFrame` or `animate()`, object instantiation in render loops.

### Explicit WebGL Resource Disposal
- **Definition**: Manually invoking `.dispose()` on all geometries, materials, textures, render targets, and WebGL renderers during component teardown to free GPU VRAM and prevent browser memory leaks.
- **_Avoid_**: Relying on JavaScript garbage collector to free GPU memory, orphaned WebGL contexts.
