---
name: 3d-product-scroll-animation
description: |
  Build interactive, high-performance 3D product scroll animations using Three.js, GSAP ScrollTrigger, SplitText, and Lenis.
  Use when creating interactive landing pages, 3D product showcases, award-winning scrollytelling experiences, or WebGL-driven viewport animations.
  Triggers: 3d product scroll, three.js scroll animation, gsap 3d showcase, scrollytelling 3d model, webgl scroll experience, pinned 3d product view.
---

# 3D Product Scroll Animation

Engineer high-performance, responsive 3D product showcase pages where 3D mesh rotation, background reveals, marquee headings, and spec callouts are choreographed to scroll progress.

## Architecture Overview

```
[Lenis Smooth Scroll] ──► [GSAP Ticker] ──► [ScrollTrigger (Pin + Scrub)]
                                                  │
         ┌───────────────────┬────────────────────┼───────────────────┐
         ▼                   ▼                    ▼                   ▼
  [3D Mesh Rotation]  [Clip-Path Mask]   [Marquee Slide]   [Tooltip Stagger]
  (Three.js + GLTF)     (CSS Circle)       (SplitText)       (SplitText)
```

---

## Phase 1: DOM & Viewport Scaffolding

Construct the full-height scroll track and pinned viewport container.

1. **Create Section Containers**:
   - Define an `#intro` section (`100vw`, `100svh`).
   - Define a `.product-overview` section (`100vw`, `100svh`, `overflow: hidden`, `position: relative`).
   - Define an `#outro` section (`100vw`, `100svh`).

2. **Structure Layer Hierarchy inside `.product-overview`**:
   - Background header (`.header-1`) with high-impact title text.
   - Foreground sliding header (`.header-2`) positioned off-screen (`translateX(100%)`).
   - Circular clip-path overlay (`.circular-mask`) with `clip-path: circle(0% at 50% 50%)` and inverse theme colors.
   - Tooltip container (`.tooltips`) containing spec callouts (icon, divider line, title, description).
   - WebGL mount node (`.model-container`) centered absolutely (`z-index: 100`, `pointer-events: none`).

3. **Set Core CSS Constraints**:
   - Set all section heights to `100svh` to prevent mobile address bar jumpiness.
   - Set `.tooltip .divider` initial state to `transform: scaleX(0)` with appropriate `transform-origin` (`left center` or `right center`).
   - Hide overflow on text wrapper containers for clean roll-in reveals.

### Completion Gate
- [ ] DOM hierarchy correctly stacks headers, circular mask, model canvas, and tooltips
- [ ] CSS uses `svh` units and resets margins/paddings
- [ ] Circular mask is completely hidden (`circle(0% at 50% 50%)`) at initial state

---

## Phase 2: Smooth Scroll & Animation Framework Binding

Initialize Lenis smooth scroll and synchronize with GSAP ScrollTrigger.

1. **Import Required Libraries**:
   - Three.js core + `GLTFLoader`.
   - GSAP + `ScrollTrigger` + `SplitText`.
   - `@studio-freight/lenis`.

2. **Register GSAP Plugins**:
   ```javascript
   gsap.registerPlugin(ScrollTrigger, SplitText);
   ```

3. **Bind Lenis to GSAP Ticker**:
   ```javascript
   const lenis = new Lenis();
   lenis.on('scroll', ScrollTrigger.update);
   gsap.ticker.add((time) => lenis.raf(time * 1000));
   gsap.ticker.lagSmoothing(0);
   ```

4. **Split Typography**:
   - Split primary marquee headlines by character: `new SplitText('.header-1 h1', { type: 'chars', charsClass: 'char' })`.
   - Split tooltip titles and descriptions by line: `new SplitText('.tooltip .description p', { type: 'lines', linesClass: 'line' })`.
   - Wrap each extracted character/line in an inner `<span>` to enable translateY masking.

### Completion Gate
- [ ] Lenis tick runs inside GSAP ticker loop with `lagSmoothing(0)`
- [ ] All animated text elements are parsed into nested masked spans

---

## Phase 3: Three.js Scene, Studio Lighting & Model Ingestion

Set up the 3D rendering pipeline and load the product asset.

1. **Initialize Scene & WebGLRenderer**:
   - Enable `antialias: true` and `alpha: true`.
   - Set clear color to `(0x000000, 0)`.
   - Clamp pixel ratio: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
   - Enable soft shadow mapping (`THREE.PCFSoftShadowMap`).
   - Configure tone mapping: `renderer.toneMapping = THREE.NoToneMapping` or `ACESFilmicToneMapping`.

2. **Configure Studio Lighting Rig**:
   - **Ambient Light**: Add `THREE.AmbientLight(0xffffff, 0.7)` for baseline fill.
   - **Key Light**: Add `THREE.DirectionalLight(0xffffff, 1.0)` at `(2, 3, 2)` with `castShadow = true`, `shadow.bias = -0.001`, `shadow.mapSize.set(1024, 1024)`.
   - **Fill Light**: Add `THREE.DirectionalLight(0xffffff, 0.5)` at `(-2, 0, -2)` to soften dark cavities.

3. **Ingest GLTF Asset & Tune Materials**:
   - Load file via `new GLTFLoader().load(path, callback)`.
   - Traverse mesh nodes and tune surface properties:
     ```javascript
     model.traverse((node) => {
       if (node.isMesh && node.material) {
         Object.assign(node.material, { metalness: 0.05, roughness: 0.9 });
       }
     });
     ```

4. **Compute Bounding Box & Implement Responsive Placement**:
   - Compute dimensions via `new THREE.Box3().setFromObject(model)`.
   - Compute model center and size vectors.
   - Position mesh offset to the left/right on desktop to leave clear space for tooltips; center vertically and horizontally on mobile (`window.innerWidth < 1000`).
   - Set camera position based on maximum dimension:
     ```javascript
     const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
     const cameraDistance = isMobile ? 2.0 : 1.25;
     camera.position.set(0, 0, maxDim * cameraDistance);
     camera.lookAt(0, 0, 0);
     ```

5. **Start Animation Loop & Resize Listener**:
   - Execute `renderer.render(scene, camera)` on `requestAnimationFrame`.
   - Attach window `resize` handler updating camera aspect ratio, projection matrix, renderer size, and invoking model layout calculation.

### Completion Gate
- [ ] 3D canvas renders with transparent background and studio lighting
- [ ] Product mesh is auto-centered using `THREE.Box3` and dynamically scaled across screen widths
- [ ] Resize listener prevents distortion or viewport clipping

---

## Phase 4: ScrollTrigger Orchestration & Multi-Turn Rotation

Choreograph all animation layers to scroll progress inside a single master pin.

1. **Instantiate Pinned ScrollTrack**:
   ```javascript
   ScrollTrigger.create({
     trigger: '.product-overview',
     start: 'top top',
     end: '+=1000%', // 10 viewport heights of scroll distance
     pin: true,
     pinSpacing: true,
     scrub: 1,
     onUpdate: (self) => updateScene(self.progress),
   });
   ```

2. **Map Layer Timelines in `onUpdate(progress)`**:
   - **Header 1 Translation (0.05 → 0.35)**:
     Calculate `headerProgress = clamp((progress - 0.05) / 0.30)`. Animate `xPercent` from `0` to `-100`.
   - **Circular Mask Reveal (0.20 → 0.30)**:
     Calculate `maskSize = clamp((progress - 0.20) / 0.10) * 100`. Apply `clip-path: circle(${maskSize}% at 50% 50%)`.
   - **Header 2 Slide (0.15 → 0.50)**:
     Animate `xPercent` across viewport from `100%` (right) to `-200%` (left).
   - **Tooltip Dividers (0.45 → 0.65)**:
     Animate `scaleX` from `0` to `1` using `gsap.to('.tooltip .divider', { scaleX })`.

3. **Trigger Discrete Tooltip Callout Reveals**:
   - At `progress >= 0.65`: Stagger reveal Tooltip 1 elements (`translateY: '0%'`).
   - At `progress >= 0.85`: Stagger reveal Tooltip 2 elements (`translateY: '0%'`).
   - Reverse to `translateY: '125%'` when scrolling upward past threshold.

4. **Calculate Continuous Incremental Model Rotation**:
   - Calculate target rotation across multi-turn radian multiplier:
     ```javascript
     if (model && progress >= 0.05) {
       const rotationProgress = (progress - 0.05) / 0.95;
       const targetRotation = Math.PI * 3 * 4 * rotationProgress; // 12 full turns
       const rotationDiff = targetRotation - currentRotation;
       if (Math.abs(rotationDiff) > 0.001) {
         model.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationDiff);
         currentRotation = targetRotation;
       }
     }
     ```

### Completion Gate
- [ ] Section pins smoothly for entire 10x scroll duration
- [ ] Circular mask, marquee text, and divider bars interpolate accurately against scroll position
- [ ] 3D model completes multi-turn spin smoothly without gimbal lock or jump cuts
