---
name: creative-web-development
description: |
  Master operational workflow for building award-winning, immersive, and high-performance creative web experiences (Awwwards / FWA / CSSDA tier).
  Use when engineering kinetic typography, synchronized GSAP/Lenis scroll choreography, interactive 2D Canvas particle physics,
  Three.js/R3F 3D viewports, custom GLSL visual computation shaders, hybrid Blender/WebGL pre-rendered pipelines, and art-directed digital experiences.
  Triggers: creative web dev, creative development, immersive web, awwwards website, fwa site, gsap scroll, lenis smooth scroll, split text particles,
  three.js showcase, r3f interactive, glsl shader displacement, hybrid 3d video scrub, sand text effect, cursor force field.
---

# Creative Web Development: The Master Skill

An operational methodology for building high-performance, immersive, award-grade creative websites where user input is transformed into real-time visual computation.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               INPUT-TO-COMPUTATION ENGINE                              │
├────────────────────────────┬─────────────────────────────┬─────────────────────────────┤
│        INPUT STAGE         │  STATE & INTERPOLATION      │ COMPUTATION & RENDER STAGE  │
│  - Pointer (Coords, Vel)   │  - Damping & Spring Physics │  - DOM 3D & Mask Clipping   │
│  - Wheel / Touch (Lenis)   │  - Virtual Playhead (GSAP)  │  - Canvas 2D Pixel Buffers  │
│  - Viewport (Scroll, SVH)  │  - GPU Uniforms (uMouse)    │  - Three.js / R3F Meshes    │
│  - RAF Master Ticker       │  - Projection Matrix (FOV)  │  - GLSL Vertex / Fragment   │
└────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

---

## Master Decision Matrix & Technology Router

Match the project experience goal to the corresponding specialized reference blueprint:

| Experience Goal | Primary Tech Stack | Reference Architecture |
|---|---|---|
| **Domain Glossary & Anti-Synonyms** | Canonical Terminology | [references/terminology.md](references/terminology.md) |
| **Kinetic Typography & Staggers** | GSAP 3, SplitText, 3D CSS | [references/motion-and-scroll.md](references/motion-and-scroll.md) |
| **Synchronized Smooth Scroll** | Lenis, ScrollTrigger, Pinning | [references/motion-and-scroll.md](references/motion-and-scroll.md) |
| **Sand/Dust Text & Particle Physics** | Canvas 2D, ImageData, Springs | [references/canvas-and-particles.md](references/canvas-and-particles.md) |
| **Interactive 3D Product Viewports** | Three.js, R3F, GLTF Draco | [references/threejs-and-r3f.md](references/threejs-and-r3f.md) |
| **GPU Distortion & Noise Shaders** | WebGL, GLSL, Simplex/FBM | [references/shaders-and-glsl.md](references/shaders-and-glsl.md) |
| **Hybrid Baked Video + WebGL** | Blender Cycles, Canvas Scrub | [references/hybrid-3d-cinematics.md](references/hybrid-3d-cinematics.md) |
| **Performance & Memory Audits** | DPR Clamping, InstancedMesh | [references/performance-and-profiling.md](references/performance-and-profiling.md) |
| **End-to-End Production Recipes** | HTML/JS/CSS Complete Blueprints | [references/examples.md](references/examples.md) |

---

## Phase 1: Art Direction, Restraint & Viewport Scaffolding

Establish the spatial layout, color hierarchy, and responsive viewports before attaching motion or 3D layers.

1. **Enforce Design Restraint**:
   - Limit the experience to one primary **signature interaction** (e.g., kinetic sand text or liquid fluid distortion) paired with subtle secondary micro-interactions.
   - For canonical definitions and anti-synonyms, read [references/terminology.md](references/terminology.md).
2. **Configure Viewport Units**:
   - Set full-screen container heights using `100svh` to prevent mobile address-bar resize jumps.
   - Establish semantic stacking contexts: Base Media (`z-index: 1`), Canvas/WebGL (`z-index: 10`), DOM UI/Typography (`z-index: 20`), Navigation (`z-index: 100`).

### Completion Gate
- [ ] Primary signature interaction is selected and scoped.
- [ ] CSS uses `svh` units and explicit `z-index` stacking strata.

---

## Phase 2: Kinetic Typography & DOM Interaction Systems

Implement character-level and word-level text reveals with overflow clipping and 3D transforms.

1. **Split Typography**:
   - Parse headings into characters, words, and lines using SplitText.
   - Wrap each character in an outer `overflow: hidden; display: inline-block;` masking container.
2. **Choreograph Entry Timelines**:
   - Animate inner characters from `yPercent: 120` and `rotateX: -45` to `0` with staggered offsets (`stagger: 0.02`).
   - For complete split-text formulas and masking patterns, read [references/motion-and-scroll.md](references/motion-and-scroll.md).

### Completion Gate
- [ ] Text characters are encapsulated within masked overflow wrappers.
- [ ] Staggered timeline executes smoothly without layout shifts.

---

## Phase 3: Synchronized Scroll Choreography & Momentum Transport

Synchronize smooth momentum scrolling with timeline playheads across pinned viewport sections.

1. **Bind Lenis to GSAP Ticker**:
   - Forward Lenis scroll events to `ScrollTrigger.update`.
   - Add Lenis step invocation to `gsap.ticker.add((time) => lenis.raf(time * 1000))` and execute `gsap.ticker.lagSmoothing(0)`.
2. **Construct Pinned Showcase Stages**:
   - Create pinned viewport tracks with explicit extended scroll travel (e.g., `end: '+=400%'`).
   - Settle core visual sequences by progress `0.90` to allocate a 10% unpin buffer zone.
   - For horizontal scroll tracks and multi-page routing transitions, read [references/motion-and-scroll.md](references/motion-and-scroll.md).

### Completion Gate
- [ ] Lenis and GSAP ScrollTrigger tick inside a single unified RAF loop with zero lag smoothing.
- [ ] Pinned stage contains a 10% rest buffer before unpinning.

---

## Phase 4: 2D Canvas Graphics & Particle Physics Decomposition

Convert DOM text or image matrices into interactive particle fields with immutable anchor memory and cursor force repulsion.

1. **Extract 1D Pixel Buffers**:
   - Draw text or raster imagery to an offscreen canvas and extract `ImageData.data`.
   - Calculate stride index $(y \times 4 \times W) + (x \times 4)$ and filter by alpha threshold ($\text{alpha} > 128$).
2. **Instantiate Anchored Particles**:
   - Store immutable anchor coordinates $(\text{baseX}, \text{baseY})$ alongside dynamic positions $(x, y)$.
3. **Simulate Force Repulsion & Spring Recovery**:
   - When cursor distance is within radius: repel particles along unit vectors $\frac{\Delta x}{\text{dist}}, \frac{\Delta y}{\text{dist}}$ scaled by density.
   - When outside radius: ease particles back to anchors via $x_{t+1} = x_t - \frac{x_t - \text{baseX}}{\text{damping}}$.
   - For luminance formulas, spring physics, and constellation math, read [references/canvas-and-particles.md](references/canvas-and-particles.md).

### Completion Gate
- [ ] Stride loop scans 1D buffer without out-of-bounds index errors.
- [ ] Particles disperse under mouse proximity and reconstruct typography via spring memory.

---

## Phase 5: Three.js & React Three Fiber (R3F) Viewport Integration

Construct photorealistic 3D product viewports, studio lighting rigs, and responsive camera projections.

1. **Initialize Calibrated Studio Lighting**:
   - Configure a three-point lighting rig (Key, Fill, Rim) combined with ACES Filmic tone mapping.
2. **Ingest & Auto-Center 3D Assets**:
   - Load GLTF/GLB models using DRACO compression decoders.
   - Auto-center geometry and calculate optimal camera distance using `THREE.Box3`.
3. **Synchronize Multi-Turn Spin**:
   - Link model rotation around the vertical axis to ScrollTrigger progress ($\theta = p \cdot 4\pi$).
   - For R3F declarative hooks, `useFrame`, and `@react-three/drei` setups, read [references/threejs-and-r3f.md](references/threejs-and-r3f.md).

### Completion Gate
- [ ] WebGL renderer initializes with ACES Filmic tone mapping and soft shadow maps.
- [ ] 3D model auto-centers and completes multi-turn rotation synchronized to scroll.

---

## Phase 6: GLSL Shaders & GPU Visual Computation Pipelines

Deploy GPU vertex displacement and fragment distortion shaders driven by real-time cursor velocity.

1. **Pass Uniforms to GPU**:
   - Feed normalized cursor coordinates (`uMouse`), smoothed velocity (`uVelocity`), resolution (`uResolution`), and time (`uTime`).
2. **Compute Fluid UV Distortion**:
   - Displace fragment UVs using radial Gaussian falloff and 4-octave Fractional Brownian Motion (FBM) noise.
3. **Apply Chromatic Aberration**:
   - Sample red, green, and blue texture channels with differential spatial offsets ($R(\text{uv} + \delta), G(\text{uv}), B(\text{uv} - \delta)$).
   - For complete GLSL noise kernels and vertex displacement shaders, read [references/shaders-and-glsl.md](references/shaders-and-glsl.md).

### Completion Gate
- [ ] GLSL shaders compile without compilation warnings or runtime WebGL errors.
- [ ] Liquid distortion and RGB chromatic aberration scale dynamically with cursor velocity.

---

## Phase 7: Hybrid 3D Cinematics & Asset Baking Pipelines

Combine pre-rendered ray-traced frame sequences on Canvas 2D with synchronized real-time WebGL interactive overlays (ORYZO / Superlocal paradigm).

1. **Extract Frame Sequences**:
   - Render offline camera paths in Blender Cycles and batch-export numbered WebP/JPEG frames (`frame_0001.jpg` to `frame_NNNN.jpg`).
2. **Scrub Image Sequence on Canvas 2D**:
   - Preload image buffers into memory arrays and paint frames dynamically to 2D canvas with `object-fit: cover` aspect ratio math.
3. **Layer Real-Time WebGL Overlays**:
   - Position Three.js interactive canvas directly over the 2D video canvas and drive both systems from a single master ScrollTrigger playhead.
   - For sequence preloading engines and overlay synchronization, read [references/hybrid-3d-cinematics.md](references/hybrid-3d-cinematics.md).

### Completion Gate
- [ ] Image frames are preloaded into memory before scroll scrubbing begins.
- [ ] 2D Canvas aspect-ratio math maintains `object-fit: cover` without visual distortion.
- [ ] Real-time WebGL overlay camera aligns with pre-rendered background trajectory.

---

## Phase 8: Performance Budgeting, Memory Audits & Graceful Degradation

Profile GPU frame rates, enforce draw call budgets, prevent garbage collection spikes, and throttle mobile devices.

1. **Clamp Device Pixel Ratio**:
   - Restrict render target resolution: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0))`.
2. **Enforce Draw Call & GC Invariants**:
   - Use `THREE.InstancedMesh` for repeated geometries to maintain draw calls under 50.
   - Pre-allocate all scratch vectors/matrices outside the RAF loop to eliminate GC stutters.
3. **Implement Mobile Degradation**:
   - Detect touch/mobile viewports: reduce particle density by 75% and disable multi-pass post-processing.
   - For memory disposal protocols and profiling checklists, read [references/performance-and-profiling.md](references/performance-and-profiling.md).

### Completion Gate
- [ ] Renderer DPR is capped at 2.0.
- [ ] Zero memory allocations (`new THREE.Vector3`) occur inside the active render loop.
- [ ] Memory disposal routines execute cleanly on component unmount / route transition.

---

## Phase 9: End-to-End Production Verification & Synthesis

Validate the complete integrated experience against production recipes and browser environments.

1. **Execute Working Code Recipes**:
   - Verify complete implementations against tested recipes in [references/examples.md](references/examples.md).
2. **Audit Production Checklist**:
   - Verify 60/120 FPS performance across desktop and mobile viewports.
   - Confirm all ScrollTrigger markers are removed in production build.
   - Test fallback behavior when `prefers-reduced-motion: reduce` is enabled.

### Completion Gate
- [ ] All 9 sequential implementation phases pass their respective completion gates.
- [ ] Experience runs at steady 60 FPS without memory leaks or dropped frames.
