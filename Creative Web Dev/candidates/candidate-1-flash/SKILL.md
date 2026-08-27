---
name: creative-web-development
description: |
  Architect and engineer production-grade creative web experiences (Awwwards/FWA/CSSDA tier).
  Synthesizes kinetic typography, GSAP 3 / ScrollTrigger / Lenis motion orchestration,
  HTML5 Canvas 2D particle physics, Three.js / React Three Fiber 3D scenes, custom GLSL shaders,
  and hybrid Blender pre-rendered video scrubbing pipelines.
  Use when:
  - Designing interactive digital experiences, award-winning portfolios, or creative landing pages
  - Implementing sand/dust text particle decomposition and spring-back recovery
  - Choreographing pinned scrollytelling timelines with synchronized 3D models or frame sequences
  - Building GPU-accelerated mouse-velocity distortion shaders and fluid visual effects
  - Integrating smooth scrolling (Lenis) with GSAP timelines and WebGL render loops
  - Architecting hybrid 3D workflows (Blender baking + real-time WebGL overlays)
---

# Creative Web Development

An operational engineering methodology for constructing interactive, GPU-accelerated digital experiences where user input drives unified visual computation pipelines across the DOM, Canvas 2D, Three.js, and GLSL shaders.

## Input-to-Computation Architecture

All creative interactions operate as deterministic, synchronized pipelines:

```
[Pointer / Scroll / Viewport Input]
               │
               ▼
[Normalizer & Interpolation Kernel] ──► (Lerp, Velocity, Decay, DeltaTime)
               │
               ▼
[Central RAF Ticker (GSAP / Lenis)] ──► Synchronized Virtual Playhead
               │
       ┌───────┼────────────────────────┬────────────────────────┐
       ▼       ▼                        ▼                        ▼
  [DOM / CSS] [Canvas 2D]          [Three.js / R3F]        [GLSL Shaders]
  Kinetic     Pixel Strides        Camera Rigs             Vertex / Fragment
  Typography  Spring Particles     GLTF Meshes             Displacement Noise
```

For canonical domain terminology and anti-synonyms, see [terminology.md](references/terminology.md).

---

## Phase 1: DOM, Kinetic Typography & 3D Layer Scaffolding

Structure accessible, responsive DOM hierarchies and kinetic typography using masked transforms and GSAP SplitText.

1. **Synchronize Font Ingestion**:
   - Defer text measurement and splitting until font glyphs are loaded:
     ```javascript
     document.fonts.ready.then(() => initializeTypography());
     ```

2. **Split Typography by Granularity**:
   - Split headings by character (`type: "chars"`) with `smartWrap: true` or by line (`type: "lines"`).
   - Use `mask: "lines"` to generate overflow-hidden clipping containers.
   - For detailed configuration, accessibility dual-DOM patterns, and internationalization, see [motion-and-scroll.md](references/motion-and-scroll.md).

3. **Construct 3D CSS Stacking Contexts**:
   - Assign `transform-style: preserve-3d` and `perspective: 1000px` to pinned containers.
   - Separate background canvases (`position: fixed; z-index: 1; pointer-events: none`) from interactive overlays (`z-index: 10; pointer-events: auto`).

### Completion Gate
- [ ] Typography splits only execute after `document.fonts.ready` resolves.
- [ ] Split elements contain overflow masks without layout-breaking line wraps.
- [ ] Screen readers access intact semantic markup (`aria-label` or `.sr-only` duplicate).

---

## Phase 2: Smooth Scroll & Animation Orchestration

Synchronize smooth scrolling physics with GSAP ScrollTrigger timelines and virtual playheads.

1. **Unify the Animation Ticker**:
   - Bind Lenis smooth scroll updates directly to GSAP's central requestAnimationFrame loop:
     ```javascript
     const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
     lenis.on('scroll', ScrollTrigger.update);
     gsap.ticker.add((time) => lenis.raf(time * 1000));
     gsap.ticker.lagSmoothing(0);
     ```

2. **Calculate Pin Buffers & Scrub Intervals**:
   - Establish pinned scrollytelling tracks: `pin: true`, `scrub: 1`, `end: () => "+=" + (window.innerHeight * N) + "px"`.
   - Map normalized scroll progress ($0.0 \to 1.0$) to multi-layer transforms using `gsap.utils.mapRange` and `gsap.utils.clamp`.
   - For full scrollytelling timelines, card splitting, and multi-page shutter transitions, see [motion-and-scroll.md](references/motion-and-scroll.md).

3. **Enforce Responsive MatchMedia**:
   - Guard complex spatial scroll animations using `gsap.matchMedia()`.
   - Degrade multi-turn 3D pins into natural vertical document flows on mobile viewports (`max-width: 768px`).

### Completion Gate
- [ ] Zero frame jitter: Lenis and ScrollTrigger run on a unified ticker with `lagSmoothing(0)`.
- [ ] Pinned scroll tracks release cleanly at terminal progress boundaries.
- [ ] Viewport resizing recalibrates trigger start/end positions via debounced refresh.

---

## Phase 3: Canvas 2D & Particle Physics

Sample rasterized typography or image buffers and drive particle displacement with cursor proximity force fields and anchor memory.

1. **Configure High-DPI 2D Canvas**:
   - Scale internal pixel resolution by `window.devicePixelRatio` and scale 2D context transforms:
     ```javascript
     const dpr = Math.min(window.devicePixelRatio, 2);
     canvas.width = width * dpr;
     canvas.height = height * dpr;
     ctx.scale(dpr, dpr);
     ```

2. **Extract Pixel Buffers & 1D-to-2D Stride Mapping**:
   - Render typography or images to an off-screen buffer.
   - Extract raw pixel buffer via `ctx.getImageData(0, 0, width, height)`.
   - Compute 1D stride index: $\text{index} = (y \times 4 \times \text{width}) + (x \times 4)$.
   - Calculate relative perceived luminance:
     $$\text{brightness} = \frac{\sqrt{0.299 \cdot R^2 + 0.587 \cdot G^2 + 0.114 \cdot B^2}}{100}$$

3. **Synthesize Particles with Anchor Memory**:
   - For alpha $> 128$, instantiate a particle storing dynamic coordinates (`x`, `y`, `vx`, `vy`) and immutable anchors (`baseX`, `baseY`).
   - Clear the sampling canvas prior to starting the animation loop.

4. **Execute Interaction Physics & Elastic Spring Recovery**:
   - On cursor proximity ($\text{distance} < \text{radius}$), apply directional repulsion:
     $$\text{force} = \frac{\text{radius} - \text{distance}}{\text{radius}}, \quad \text{dx} = \text{mouse.x} - \text{x}, \quad \text{dy} = \text{mouse.y} - \text{y}$$
     $$\text{x} -= \left(\frac{\text{dx}}{\text{distance}}\right) \cdot \text{force} \cdot \text{density}$$
   - When outside radius, pull particle toward anchor with damping:
     $$\text{x} -= \frac{\text{x} - \text{baseX}}{\text{dampingFactor}}$$
   - For complete particle math, vector flow fields, and constellation networks, see [canvas-and-particles.md](references/canvas-and-particles.md).

### Completion Gate
- [ ] Canvas coordinates scaled by DPR without pixelation on Retina displays.
- [ ] Text disintegrates into particles on cursor approach and reconstructs cleanly at resting state.
- [ ] Constellation proximity checks use upper-triangular indexing ($b = a + 1$) to eliminate duplicate tests.

---

## Phase 4: Three.js & React Three Fiber (R3F)

Construct 3D viewport scenes, ingest Draco-compressed GLTF assets, configure studio lighting rigs, and synchronize camera vectors with page scroll.

1. **Initialize WebGLRenderer & Scene Graph**:
   - Enable alpha transparency (`alpha: true`), antialiasing (`antialias: true`), and ACESFilmic tone mapping.
   - Clamp pixel ratio: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.

2. **Ingest & Normalize 3D Assets**:
   - Load `.glb` assets using `GLTFLoader` with `DRACOLoader`.
   - Traverse scene graph nodes to optimize mesh materials (`metalness`, `roughness`, `envMapIntensity`).
   - Compute bounding box using `new THREE.Box3().setFromObject(model)` to center and scale the model dynamically.

3. **Construct Studio Lighting Rig**:
   - Position directional key light (`intensity: 1.0`, soft shadow maps), ambient fill (`intensity: 0.7`), and rim highlights.

4. **Bind Camera Vectors & On-Demand Rendering**:
   - Scrub camera position $(x, y, z)$ and lookAt target vectors via GSAP ScrollTrigger.
   - Avoid continuous idle rendering; call `renderer.render()` or `viewer.setDirty()` only when camera/mesh vectors mutate.
   - For R3F components, camera coordinate tables, and model inspection modes, see [threejs-and-r3f.md](references/threejs-and-r3f.md).

### Completion Gate
- [ ] 3D models auto-center and scale responsively across desktop and mobile viewports.
- [ ] Render loop utilizes dirty flags or delta clamping to prevent CPU/GPU throttling during idle.
- [ ] OrbitControls isolate pointer events during inspection mode and release pointer events during scroll.

---

## Phase 5: GPU Visual Computation & Custom GLSL Shaders

Build hardware-accelerated vertex displacement, fragment distortion, and mouse-velocity force fields using GLSL.

1. **Construct Shader Material Pipeline**:
   - Create `THREE.ShaderMaterial` with vertex shader, fragment shader, and unified uniforms:
     ```javascript
     const material = new THREE.ShaderMaterial({
       vertexShader,
       fragmentShader,
       uniforms: {
         uTime: { value: 0 },
         uMouse: { value: new THREE.Vector2(0.5, 0.5) },
         uVelocity: { value: new THREE.Vector2(0, 0) },
         uTexture: { value: texture },
         uResolution: { value: new THREE.Vector2(width, height) }
       }
     });
     ```

2. **Implement Vertex Displacement & Noise**:
   - Compute vertex wave offsets using simplex/Perlin noise functions inside GLSL.
   - Modulate wave amplitude by distance to cursor:
     ```glsl
     vec3 pos = position;
     float dist = distance(uv, uMouse);
     pos.z += sin(dist * 10.0 - uTime * 3.0) * exp(-dist * 4.0) * length(uVelocity);
     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
     ```

3. **Implement Fragment Distortion & RGB Chromatic Aberration**:
   - Distort UV coordinates based on procedural noise and cursor velocity.
   - Offset red, green, and blue texture sampling channels for chromatic aberration:
     ```glsl
     vec2 uv = vUv;
     vec2 displacement = uVelocity * 0.05 * sin(uv.yx * 10.0 + uTime);
     float r = texture2D(uTexture, uv + displacement * 1.2).r;
     float g = texture2D(uTexture, uv + displacement).g;
     float b = texture2D(uTexture, uv + displacement * 0.8).b;
     gl_FragColor = vec4(r, g, b, 1.0);
     ```
   - For complete noise functions (Simplex/Perlin/FBM) and full-screen post-processing quads, see [shaders-and-glsl.md](references/shaders-and-glsl.md).

### Completion Gate
- [ ] Uniforms (`uTime`, `uMouse`, `uVelocity`) update per frame with normalized coordinates ($0.0 \to 1.0$).
- [ ] Aspect-ratio preservation UV math prevents texture stretching across arbitrary screen dimensions.
- [ ] Velocity decays smoothly toward zero when cursor stops moving.

---

## Phase 6: Hybrid 3D Cinematics & Asset Pipelines

Combine offline-rendered Blender cinematics (Cycles/Eevee) with real-time WebGL meshes and interactive DOM layers (ORYZO / Superlocal paradigm).

1. **Bake & Extract Cinematic Sequences**:
   - Export animation frames from Blender / NLE as sequentially numbered JPG/WebP assets (`frame_0001.jpg` to `frame_NNNN.jpg`).
   - Keep frame dimensions optimized ($1920 \times 1080$, quality 80-85%).

2. **Preload Image Buffer Array**:
   - Preload all frames into an in-memory `Image` array before activating the scroll timeline.
   - Never scrub native `<video>` elements on scroll (eliminates keyframe decode lag).

3. **Execute Canvas Frame Painting with Object-Fit Cover Math**:
   - In 2D canvas render step, calculate scale ratio to replicate `object-fit: cover`:
     ```javascript
     const hRatio = canvas.width / img.width;
     const vRatio = canvas.height / img.height;
     const ratio = Math.max(hRatio, vRatio);
     const centerShiftX = (canvas.width - img.width * ratio) / 2;
     const centerShiftY = (canvas.height - img.height * ratio) / 2;
     ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
     ```

4. **Synchronize Real-Time WebGL & DOM Overlays**:
   - Align real-time Three.js overlay meshes and 3D CSS transform layers to identical scroll progress triggers.
   - For the complete hybrid architecture and frame sequence recipes, see [hybrid-3d-cinematics.md](references/hybrid-3d-cinematics.md).

### Completion Gate
- [ ] Image frames preloaded into memory before scroll triggers engage.
- [ ] Canvas frame painting maintains aspect ratio (`cover`) without aspect distortion on resize.
- [ ] Real-time WebGL overlays and DOM text layers track frame progression seamlessly.

---

## Phase 7: Performance Engineering, Profiling & Mobile Degradation

Audit and optimize runtime CPU/GPU metrics to guarantee 60 FPS across desktop and mobile devices.

1. **Enforce Render & Resource Budgets**:
   - Clamp device pixel ratio: `Math.min(window.devicePixelRatio, 2)`.
   - Maintain WebGL draw call budget: $< 50$ draw calls per frame via `THREE.InstancedMesh`.
   - Zero heap allocations inside animation loops: reuse pre-allocated vectors, matrices, and color objects.

2. **Implement Graceful Mobile Fallbacks**:
   - Reduce particle counts by $60\text{--}75\%$ on mobile viewports.
   - Disable heavy GPU post-processing (SSAO, SSR, Bloom) on mobile GPUs.
   - Fall back to standard touch scroll where complex 3D pinning impedes navigation ergonomics.

3. **Enforce Complete Teardown & Lifecycle Cleanup**:
   - Clean up event listeners, cancel RAF IDs, and dispose of GPU resources upon component unmount:
     ```javascript
     geometry.dispose();
     material.dispose();
     texture.dispose();
     renderer.dispose();
     lenis.destroy();
     ```
   - For memory profiling guides and mobile degradation rules, see [performance-and-profiling.md](references/performance-and-profiling.md).
   - For end-to-end worked production recipes, see [examples.md](references/examples.md).

### Completion Gate
- [ ] Zero memory leaks on repeated route changes or resize cycles.
- [ ] Stable 60 FPS verified on target desktop and mobile profiles.
- [ ] Accessible navigation and readable typography preserved across all screen sizes.
