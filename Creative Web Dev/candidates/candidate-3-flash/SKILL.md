---
name: creative-web-development
description: |
  Synthesize and implement award-winning (Awwwards/FWA/CSSDA tier) creative web experiences,
  interactive digital graphics, kinetic typography, and GPU visual computation pipelines.
  Use when:
  - Engineering interactive canvas particle systems, sand/dust text decomposition, and physics-driven anchor springs
  - Orchestrating synchronized GSAP 3, ScrollTrigger, and Lenis smooth-scrolling animation timelines
  - Building Three.js and React Three Fiber (R3F) 3D scene graphs, camera rigs, and model viewers
  - Authoring custom GLSL vertex/fragment shaders for mouse force-fields, noise displacement, and chromatic aberration
  - Constructing hybrid 3D cinematics combining pre-rendered/baked video frame scrubbing with real-time WebGL overlays (ORYZO/Superlocal/Apple paradigm)
  - Optimizing GPU/CPU performance, instancing, draw call budgets, and DPR clamping
---

# Creative Web Development Engine

An operational framework for engineering award-winning, high-performance creative web applications through synchronized motion, canvas particle physics, WebGL scene graphs, custom GLSL shaders, and hybrid 3D cinematic pipelines.

## Master Input-to-Computation Pipelines

```
[Pointer Event]  → Coordinates & Velocity → Interaction Force Field → Physics/GLSL State → Screen Buffer
[Scroll Engine]  → Lenis Virtual Playhead → Normalized Scrub [0..1] → GSAP Timeline Sync  → DOM/WebGL Mutate
[Hybrid 3D Pipeline] → Pre-Rendered Frame Scrub + Real-Time Mesh Overlay + 3D Perspective DOM
```

For canonical vocabulary, mathematical definitions, and anti-synonyms, see [terminology.md](references/terminology.md).  
For complete end-to-end production recipes, see [examples.md](references/examples.md).

---

## Phase 1: Environment Setup, High-DPI Clamping & Art Direction

Establish the rendering foundation, enforce device pixel ratio bounds, and structure coordinate containers.

1. **Clamp Device Pixel Ratio**:
   - Set maximum rendering scale to $2.0$ across all WebGL renderers and 2D canvas contexts to avoid mobile fill-rate bottlenecks:
     ```javascript
     const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
     ```
2. **Scaffold Viewport Coordinate Container**:
   - Set fixed full-screen containers with `width: 100vw; height: 100svh; overflow: hidden; position: relative;`.
3. **Configure Color Management**:
   - Enforce `THREE.SRGBColorSpace` and `THREE.ACESFilmicToneMapping` on WebGL renderers to prevent washed-out color output.

### Completion Gate
- [ ] Device pixel ratio strictly clamped to $\le 2.0$.
- [ ] Viewport containers use mobile-safe `100svh` heights.
- [ ] WebGL color spaces set to sRGB standard.

---

## Phase 2: Kinetic Typography & DOM Masking Engine

Convert static typography into dynamic, accessible visual objects using character splitting and overflow clip bounds.

For deep configuration options and accessibility rules, see [motion-and-scroll.md](references/motion-and-scroll.md).

1. **Synchronize Font Ingestion**:
   - Wrap SplitText executions inside `document.fonts.ready.then(...)` to eliminate layout calculation errors.
2. **Decompose Text into Masked Hierarchies**:
   - Split typography targeting only the active animated hierarchy (`lines,chars` or `lines,words`):
     ```javascript
     const split = new SplitText('.kinetic-target', {
       type: 'lines,chars',
       linesClass: 'line-mask',
       charsClass: 'char',
       smartWrap: true,
       autoSplit: true
     });
     ```
3. **Apply Clip-Path and Overflow Masks**:
   - Set `.line-mask { overflow: hidden; display: block; }` and animate `.char` from `yPercent: 120` to `0` with staggered power-curve easing.
4. **Enforce Semantic Accessibility**:
   - Apply `aria-label` with original raw string to the parent element and tag child split spans with `aria-hidden="true"`.

### Completion Gate
- [ ] Text splitting executed strictly after `document.fonts.ready` resolves.
- [ ] Parent containers apply overflow clipping without clipping descenders.
- [ ] Screen readers read complete sentences without spelling individual characters.

---

## Phase 3: Smooth Scroll & Unified Virtual Playhead (Lenis + GSAP)

Synchronize virtual scroll physics with GSAP ScrollTrigger timelines through a single master clock.

For detailed timeline math and horizontal track calculations, see [motion-and-scroll.md](references/motion-and-scroll.md).

1. **Instantiate Lenis Smooth Scroll Engine**:
   - Configure exponential deceleration curves and touch multiplier scaling.
2. **Bind Virtual Engine to GSAP Clock**:
   - Forward Lenis scroll updates to `ScrollTrigger.update`:
     ```javascript
     lenis.on('scroll', ScrollTrigger.update);
     gsap.ticker.add((time) => lenis.raf(time * 1000));
     gsap.ticker.lagSmoothing(0);
     ```
3. **Configure Dynamic Pin Buffers**:
   - Define pinned sections using dynamic functions: `end: () => "+=" + window.innerHeight * multiplier`.
   - Set `pin: true`, `pinSpacing: true`, `anticipatePin: 1`, and `scrub: 1.0`.

### Completion Gate
- [ ] Lenis scroll updates forwarded to `ScrollTrigger.update`.
- [ ] Lenis frame updates executed exclusively via `gsap.ticker.add`.
- [ ] `gsap.ticker.lagSmoothing(0)` active to prevent playhead jumping.

---

## Phase 4: Canvas 2D Buffers & Typographic Particle Decomposition

Deconstruct rasterized typography into thousands of interactive physics particles with anchor memory and spring reconstruction.

For raw buffer formulas and constellation network math, see [canvas-and-particles.md](references/canvas-and-particles.md).

1. **Extract Linear Pixel Buffer**:
   - Draw typography to an offscreen buffer and extract raw byte array: `ctx.getImageData(0, 0, width, height)`.
2. **Sample Active Alpha Glyphs**:
   - Iterate grid at configurable stride (4px desktop, 8px mobile). Sample 1D array: $\text{index} = (y \cdot 4 \cdot \text{width}) + (x \cdot 4)$.
   - When `data[index + 3] > 128`, instantiate a particle storing immutable anchor memory (`baseX = x, baseY = y`).
3. **Execute Physics & Dispersion Loop**:
   - Compute Euclidean distance: $\text{dist} = \sqrt{\Delta x^2 + \Delta y^2}$.
   - Apply inverse cursor repulsion when $\text{dist} < \text{radius}$.
   - Apply Hooke's Law elastic return: $F_{spring} = -k \cdot (\text{pos} - \text{base}) - c \cdot \text{vel}$.

### Completion Gate
- [ ] 1D buffer index accurately accounts for the $4 \times \text{width}$ stride.
- [ ] Particle instances store immutable `baseX` and `baseY` rest coordinates.
- [ ] Particles scatter under cursor proximity and reconstruct accurately upon cursor departure.

---

## Phase 5: Three.js / R3F 3D Scene Graph & Camera Choreography

Construct WebGL 3D scene graphs, import DRACO-compressed assets, and choreograph camera paths along scroll timelines.

For scene graph setup, lighting rigs, and React Three Fiber components, see [threejs-and-r3f.md](references/threejs-and-r3f.md).

1. **Scaffold Responsive Camera & Viewport Projection**:
   - Calculate PerspectiveCamera FOV matching viewport height so 1 3D unit corresponds to 1 CSS pixel on plane $Z = 0$.
2. **Load & Center DRACO-Compressed Models**:
   - Decode assets via `DRACOLoader`. Compute bounding box via `THREE.Box3().setFromObject(model)` and normalize origin to $(0,0,0)$.
3. **Establish Studio Lighting Rig**:
   - Add ambient fill, warm directional key light with soft shadow maps (`PCFSoftShadowMap`), and HDR environment reflection maps.
4. **Bind 3D Transforms to ScrollTrigger**:
   - Scrub mesh rotation, translation, and camera positioning across normalized progress intervals $[0.0, 1.0]$.

### Completion Gate
- [ ] GLTF/GLB models processed via DRACO compression and auto-centered at origin.
- [ ] Bounding boxes normalized across responsive viewports.
- [ ] 3D object rotation and camera coordinates smoothly scrubbed by ScrollTrigger.

---

## Phase 6: Custom GPU Shaders & GLSL Force Field Computation

Write performant GLSL vertex and fragment shaders for procedural noise, UV deformation, and mouse-velocity force fields.

For Simplex noise algorithms, FBM, and curl noise implementations, see [shaders-and-glsl.md](references/shaders-and-glsl.md).

1. **Normalize Aspect-Corrected UV Coordinates**:
   - Compute coordinate plane: `vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);`.
2. **Construct Mouse Velocity Uniform Buffer**:
   - Calculate mouse travel speed per frame. Pass uniforms: `u_mouse` (UV coordinates), `u_velocity` (scalar), `u_time` (elapsed seconds).
3. **Apply Dynamic UV Displacement & Chromatic Aberration**:
   - Displace texture coordinates along the mouse-to-pixel vector: $\text{uv}_{displaced} = \text{uv} + \vec{d} \cdot \text{force}$.
   - Stagger Red, Green, and Blue texture samples along displacement vectors to generate optical chromatic aberration.

### Completion Gate
- [ ] UV coordinates normalized with aspect ratio correction to eliminate distortion.
- [ ] Mouse speed smoothly lerped and forwarded to `u_velocity` uniform.
- [ ] Fragment shader performs chromatic aberration without exceeding texture sample limits.

---

## Phase 7: Hybrid 3D Cinematics & Asset Scrubbing Architecture

Implement the ORYZO AI / Apple hybrid paradigm: synchronize pre-rendered CGI image sequence scrubbing with real-time 3D meshes and 3D perspective DOM overlays.

For frame conversion pipelines and CSS 3D perspective layering, see [hybrid-3d-cinematics.md](references/hybrid-3d-cinematics.md).

1. **Preload Discrete Image Sequence**:
   - Preload numbered JPEG/WebP frames into memory array with error fallback listeners. Never scrub native `<video>` elements.
2. **Implement Canvas Context Cover Containment**:
   - Compute image vs canvas aspect ratio dynamically and draw with centered offsets (`object-fit: cover` math).
3. **Orchestrate Layered 3D Perspective DOM**:
   - Set container `perspective: 1000px; transform-style: preserve-3d;`.
   - Scrub child elements along `translateZ` to push background headlines into the distance and pull interactive cards into the foreground.

### Completion Gate
- [ ] Video frames preloaded into memory array prior to timeline binding.
- [ ] Frame scrubbing completes at ~90% scroll progress to grant breathing room for unpinning.
- [ ] 3D DOM overlays synchronized with canvas frame playback.

---

## Phase 8: Performance Budgeting, Memory Teardown & Hardening

Audit draw calls, eliminate garbage collection pauses, dispose GPU resources, and gracefully adapt to mobile devices.

For draw call batching, memory deallocation, and mobile degradation strategies, see [performance-and-profiling.md](references/performance-and-profiling.md).

1. **Enforce GPU Draw Call Limits & Instancing**:
   - Combine duplicate geometries into `THREE.InstancedMesh`. Maintain $< 50$ draw calls on mobile, $< 100$ on desktop.
2. **Enforce Zero-Allocation Render Loops**:
   - Pre-allocate scratch vectors (`THREE.Vector3`) and matrices at module scope. Mutate in-place inside `requestAnimationFrame`.
3. **Execute Comprehensive Teardown**:
   - On unmount/transition, call `cancelAnimationFrame`, `lenis.destroy()`, `scrollTrigger.kill()`, and recursively dispose geometries, textures, materials, and WebGL contexts.
4. **Implement Mobile Degradation & Reduced Motion**:
   - Increase particle sample stride on mobile (75% particle reduction). Disable expensive post-processing shaders. Respect `prefers-reduced-motion`.

### Completion Gate
- [ ] Animation loops operate with zero object allocations per frame.
- [ ] Page transitions fully dispose textures, geometries, and listeners.
- [ ] Particle systems and shaders dynamically degrade on mobile viewports.

---

## Master Reference Architecture

| Pillar | Reference Document | Key Operational Focus |
|---|---|---|
| **Terminology** | [terminology.md](references/terminology.md) | Canonical definitions, stride formulas, anti-synonyms |
| **Motion & Scroll** | [motion-and-scroll.md](references/motion-and-scroll.md) | Lenis + GSAP sync, SplitText masks, horizontal scrolling |
| **Canvas & Particles** | [canvas-and-particles.md](references/canvas-and-particles.md) | Raw `ImageData`, luminance mapping, sand/dust text engine |
| **Three.js & R3F** | [threejs-and-r3f.md](references/threejs-and-r3f.md) | DRACO loaders, studio lighting, R3F declarative architectures |
| **GPU & GLSL** | [shaders-and-glsl.md](references/shaders-and-glsl.md) | Procedural Simplex/FBM noise, mouse force fields, RGB split |
| **Hybrid Cinematics** | [hybrid-3d-cinematics.md](references/hybrid-3d-cinematics.md) | Blender baking, canvas frame scrub, 3D perspective DOM |
| **Performance** | [performance-and-profiling.md](references/performance-and-profiling.md) | DPR clamping, `InstancedMesh`, zero-allocation loops, teardown |
| **Production Recipes** | [examples.md](references/examples.md) | End-to-end working boilerplate implementations |
