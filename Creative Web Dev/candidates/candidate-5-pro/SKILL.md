---
name: creative-web-development
description: Execute Awwwards-tier immersive creative web development (GSAP, Canvas, WebGL, Shaders).
triggers: ["build awwwards site", "gsap animation", "webgl experience", "canvas particles", "creative dev"]
---

# Creative Web Development Master Pipeline

Act as an expert Creative Technologist. Your objective is to architect, implement, and optimize immersive, high-performance web experiences. 

## 1. Architectural Directives
- **Imperative Execution**: Build deterministic, mathematics-driven motion. Avoid arbitrary CSS transitions.
- **Unified Playhead**: Bind all motion (DOM, Canvas, WebGL, Video) to a singular normalized scroll or time value (0.0 to 1.0).
- **Performance Absolute**: Guarantee 60fps on mobile. Clamp DPR. Pre-allocate memory.

Read the canonical glossary before proceeding:
👉 [Terminology & Anti-Synonyms](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/Creative%20Web%20Dev/candidates/candidate-5-pro/references/terminology.md)

---

## Phase 1: Foundation & Motion Orchestration
Establish the smooth scroll hijacking and timeline logic.

1. Initialize Lenis for continuous, lerped scroll interpolation.
2. Register GSAP ScrollTrigger. Bind Lenis `on('scroll')` to `ScrollTrigger.update`.
3. Construct typographic motion using SplitText. 

👉 **Reference Context**: 
- [Motion & Scroll Choreography](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/Creative%20Web%20Dev/candidates/candidate-5-pro/references/motion-and-scroll.md)

### Phase 1 Completion Gates:
- [ ] Lenis RAF loop is actively driving GSAP's ticker.
- [ ] ScrollTrigger markers accurately reflect normalized progress.
- [ ] Typography is split into characters/words wrapped in `overflow: hidden` for mask reveals.

---

## Phase 2: Canvas 2D & Particle Physics
Construct pixel-manipulation and physics-based particle systems.

1. Extract pixel data via `ctx.getImageData`.
2. Map 1D buffer data to a 2D particle grid using `stride = (y * width + x) * 4`.
3. Apply spring physics equations (stiffness, damping) to return particles to their anchored origin.

👉 **Reference Context**: 
- [Canvas & Particles](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/Creative%20Web%20Dev/candidates/candidate-5-pro/references/canvas-and-particles.md)

### Phase 2 Completion Gates:
- [ ] Image data successfully mapped to particle coordinate arrays.
- [ ] Particle `x/y` attributes lerp smoothly to `baseX/baseY` anchors.
- [ ] Mouse interactions apply radial repulsion force fields.

---

## Phase 3: WebGL & Shaders (Three.js/R3F)
Architect the GPU-accelerated 3D scene and GLSL shader pipelines.

1. Instantiate the WebGLRenderer.
2. Load optimized GLB/GLTF assets utilizing Draco compression.
3. Construct CustomShaderMaterials. Inject `uTime`, `uMouse`, and `uScroll` uniforms.

👉 **Reference Context**: 
- [Three.js & R3F](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/Creative%20Web%20Dev/candidates/candidate-5-pro/references/threejs-and-r3f.md)
- [Shaders & GLSL](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/Creative%20Web%20Dev/candidates/candidate-5-pro/references/shaders-and-glsl.md)

### Phase 3 Completion Gates:
- [ ] R3F Canvas spans the viewport without overflow.
- [ ] Uniforms dynamically update on requestAnimationFrame.
- [ ] Vertex shaders correctly displace geometry based on noise or scroll progress.

---

## Phase 4: Hybrid 3D Cinematics (ORYZO/Apple Paradigm)
Synchronize pre-rendered 3D cinematic sequences with interactive WebGL/DOM overlays.

1. Bake complex 3D animations in Blender to optimized MP4 or WebP sequences.
2. Map ScrollTrigger progress to the HTML5 Video `currentTime` property.
3. Overlay real-time WebGL elements matching the baked camera perspective.

👉 **Reference Context**: 
- [Hybrid 3D Cinematics](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/Creative%20Web%20Dev/candidates/candidate-5-pro/references/hybrid-3d-cinematics.md)

### Phase 4 Completion Gates:
- [ ] Video frames decode smoothly without artifacting during scroll scrubbing.
- [ ] Scroll progress maps exactly from `0` to `video.duration`.
- [ ] Overlays maintain z-index parity with the cinematic action.

---

## Phase 5: Performance Engineering & Polish
Lock the frame rate and eliminate memory leaks.

1. Clamp Device Pixel Ratio: `Math.min(window.devicePixelRatio, 2)`.
2. Object Pool all particle/mesh generation. Never instantiate inside the RAF loop.
3. Manage cleanup: `ScrollTrigger.killAll()`, dispose geometries/materials.

👉 **Reference Context**: 
- [Performance & Profiling](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/Creative%20Web%20Dev/candidates/candidate-5-pro/references/performance-and-profiling.md)
- [Examples](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/Creative%20Web%20Dev/candidates/candidate-5-pro/references/examples.md)

### Phase 5 Completion Gates:
- [ ] `window.devicePixelRatio` is capped.
- [ ] Zero mesh instantiation occurs inside the render loop.
- [ ] Component unmount routines systematically dispose of GPU memory.
