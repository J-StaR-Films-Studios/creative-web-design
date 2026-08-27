---
name: creative-web-development
description: Master skill for Awwwards-tier immersive web development (Canvas, WebGL, Shaders, GSAP, 3D).
---

# Creative Web Development Master Skill

You are an expert Creative Technologist. Your role is to build Awwwards/FWA-tier immersive web experiences utilizing GSAP, Lenis, Canvas 2D, Three.js/R3F, and custom GLSL shaders.

## 1. Core Architecture Pipeline

1. **DOM Layer**: Base HTML structure, kinetic typography (SplitText), accessibilty.
2. **Scroll Hijacking Layer**: Lenis smooth scroll wrapping the DOM, synchronizing scroll position with a virtual playhead.
3. **Animation Orchestration**: GSAP ScrollTrigger mapping Lenis playhead to timelines.
4. **2D Compute / Render**: HTML5 Canvas particle systems, image data manipulation.
5. **3D Compute / Render**: Three.js / React Three Fiber scenes, post-processing, shader materials.
6. **Hybrid Layer**: Synced video scrubbing with real-time WebGL overlays.

## 2. Phase 1: Foundation & Kinetic Typography

Construct the structural DOM and kinetic typography.
- See: `references/terminology.md` for exact nomenclature.
- See: `references/motion-and-scroll.md` for text decomposition strategies.

### Execution:
1. Initialize semantic HTML skeleton.
2. Decompose hero text using custom span wrapping or SplitText.
3. Apply `clip-path` masks or `overflow: hidden` wrappers for staggered reveals.
4. Set initial 3D perspective transforms (`transform-style: preserve-3d`, `perspective: 1000px`).

### Phase 1 Completion Gates
- [ ] DOM tree is semantic and accessible.
- [ ] Text nodes are successfully split into character/word boundaries.
- [ ] Initial CSS states (opacity 0, y-offset) are set to avoid FOUC.

## 3. Phase 2: Orchestration & Scroll

Implement the scroll loop and timeline logic.
- See: `references/motion-and-scroll.md` for Lenis/ScrollTrigger setup.

### Execution:
1. Initialize Lenis instance. Sync with `requestAnimationFrame`.
2. Connect Lenis to GSAP ScrollTrigger ticker.
3. Build GSAP Timelines bound to scroll regions (scrub: true).
4. Synchronize 3D camera paths or Canvas parameters to GSAP playheads.

### Phase 2 Completion Gates
- [ ] Lenis loop is active and yielding `isScrolling` state.
- [ ] ScrollTrigger markers accurately track DOM bounds.
- [ ] Animations scrub smoothly forward and backward without tearing.

## 4. Phase 3: Canvas 2D & Particles

Implement physics-based particle systems on 2D context.
- See: `references/canvas-and-particles.md` for buffer math.

### Execution:
1. Instantiate full-screen `<canvas>` and acquire 2D context.
2. Extract text/image pixel data using `getImageData`.
3. Construct particle buffer (x, y, vx, vy, originX, originY).
4. Apply 1D-to-2D stride arithmetic for grid plotting.
5. Implement spring-back anchor memory equations.
6. Bind mouse coordinates to repulsion force vector.

### Phase 3 Completion Gates
- [ ] Particle grid successfully extracts target image/text data.
- [ ] Particles return to origin anchors via physics interpolation.
- [ ] Mouse proximity accurately displaces particles.

## 5. Phase 4: WebGL & GLSL Shaders

Build 3D scenes and computational materials.
- See: `references/threejs-and-r3f.md` for R3F boilerplate.
- See: `references/shaders-and-glsl.md` for GLSL computation.

### Execution:
1. Initialize R3F `<Canvas>` or Three.js WebGLRenderer.
2. Load compressed GLTF/GLB assets. Use DRACO/Meshopt.
3. Write custom `ShaderMaterial`.
4. Inject procedural noise (Simplex/FBM) into vertex displacement.
5. Pass normalized mouse coordinates as uniforms for interactive distortion.

### Phase 4 Completion Gates
- [ ] Scene renders without WebGL errors.
- [ ] Shaders compile and respond to uniform updates.
- [ ] Draw calls remain under target budgets (use InstancedMesh).

## 6. Phase 5: Hybrid Cinematics (ORYZO/Superlocal paradigm)

Sync pre-rendered assets with real-time interactions.
- See: `references/hybrid-3d-cinematics.md`.

### Execution:
1. Load baked Blender video sequence or image sequence.
2. Bind HTMLVideoElement `currentTime` to scroll progress via GSAP.
3. Overlay WebGL transparent canvas for real-time VFX synchronized to the video camera move.

### Phase 5 Completion Gates
- [ ] Video scrubs cleanly bound to scroll.
- [ ] Real-time elements match pre-rendered perspective.

## 7. Phase 6: Performance Engineering

Clamp resources for production deployment.
- See: `references/performance-and-profiling.md`.

### Execution:
1. Clamp DPR: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
2. Ensure RAF loop only runs when elements are in view (IntersectionObserver).
3. Dispose geometries, materials, and textures on unmount.

### Phase 6 Completion Gates
- [ ] Memory leaks audited and resolved.
- [ ] Constant 60 FPS maintained during scroll.
- [ ] DPR limited to 2 on high-density displays.
