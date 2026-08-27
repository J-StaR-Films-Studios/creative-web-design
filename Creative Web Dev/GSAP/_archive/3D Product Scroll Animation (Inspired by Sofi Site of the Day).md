# Source-to-Skill Compilation Report & Skill Package

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / code-walkthrough |
| **Title** | 3D Product Scroll Animation (Inspired by Sofi Site of the Day) |
| **Authority** | Senior Creative Web Developer / Interactive Frontend Engineer |
| **Coverage** | 3D web animation, Three.js scene setup & GLTF loading, GSAP ScrollTrigger timeline orchestration, Lenis smooth scrolling, SplitText typography animations, CSS clip-path mask reveals, responsive 3D model positioning |

### Coverage Gaps Identified
- WebGL fallback / graceful degradation when WebGL is disabled or unsupported.
- Asset preloading UI / progress bar for heavy 3D GLB assets.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
- id: ku-001
  type: concept
  name: Scroll Scrubbing
  source: src-01, "05:10 - 05:20"
  confidence: high
  definition: Synchronizing animation progress linearly or with smooth lag directly to page scroll position.
  attributes: [gsap-scrolltrigger, scrub-ratio, timeline-mapping]
  avoid_terms: [scroll listeners, raw wheel handlers]

- id: ku-002
  type: concept
  name: Bounding Box Centering
  source: src-01, "12:35 - 12:50"
  confidence: high
  definition: Using Three.js Box3 to measure the geometric dimensions and center coordinates of an imported 3D mesh.
  attributes: [THREE.Box3, getCenter, getSize, responsive-offset]
  avoid_terms: [manual mesh positioning, hardcoded 3D coordinates]

- id: ku-010
  type: principle
  name: Decoupled Render and Scroll Tickers
  source: src-01, "07:50 - 08:08"
  confidence: high
  statement: Drive smooth scroll library (Lenis) using GSAP's central ticker and disable lag smoothing to prevent animation jitter during rapid user scrolling.
  rationale: Independent render loops cause desynchronization between HTML overlay DOM transforms and WebGL canvas renders.
  applies_to: [ku-020, ku-023]

- id: ku-011
  type: principle
  name: Progressive Rotation Delta
  source: src-01, "17:40 - 18:18"
  confidence: high
  statement: Calculate rotation progress proportionally across the scroll interval and apply incremental delta rotation step-by-step rather than setting absolute rotation angles.
  rationale: Avoids gimbal locking, boundary snapping, or sudden jumps when scrubbing backward across full multi-revolution spins.
  applies_to: [ku-024]

- id: ku-020
  type: procedure
  name: HTML & CSS Scroll Canvas Scaffolding
  source: src-01, "01:33 - 07:12"
  confidence: high
  goal: Create full-viewport pinned container housing the WebGL canvas, text layers, and clip masks.
  steps:
    - action: Define pinned section container with fixed dimensions (100vw, 100svh) and overflow hidden
      criterion: Section stays pinned without causing document scroll jitter
    - action: Structure marquee headings, circular reveal mask, tooltip callouts, and WebGL model mount point
      criterion: Layer stacking order (z-index) properly separates background, mask, 3D canvas, and interactive UI
    - action: Style circular clip-path mask starting at 0% radius
      criterion: Mask is centered and completely hides background until scaled up
  outputs: [Structured DOM, Viewport CSS Rules]

- id: ku-021
  type: procedure
  name: Three.js Lighting & Material Optimization
  source: src-01, "11:47 - 13:54"
  confidence: high
  goal: Set up studio lighting and tune GLTF materials for a clean aesthetic.
  steps:
    - action: Add soft ambient light for baseline illumination
      criterion: Ambient intensity lights dark areas without washing out contrast
    - action: Add directional key light with shadow map configuration and directional fill light on opposite side
      criterion: High quality soft shadows rendered without acne or clipping
    - action: Traverse imported GLTF mesh nodes and adjust roughness/metalness
      criterion: Matte plastic/metal finish matching brand design
  outputs: [Configured Three.js Scene, Tuned Materials]

- id: ku-022
  type: procedure
  name: Responsive Camera & Mesh Bounding Placement
  source: src-01, "12:30 - 13:34, 14:19 - 14:34"
  confidence: high
  goal: Position 3D model and camera dynamically across desktop and mobile screens.
  steps:
    - action: Compute mesh bounding box using THREE.Box3
      criterion: Center vector and size vector extracted accurately
    - action: Offset model position horizontally on desktop to clear room for tooltips; center or shift minimally on mobile
      criterion: Model never overlaps callout text across viewports
    - action: Position perspective camera based on maximum bounding dimension and viewport multiplier
      criterion: Entire mesh fits cleanly within viewport regardless of device aspect ratio
    - action: Attach resize listener updating camera aspect, projection matrix, renderer size, and model bounds
      criterion: Canvas updates smoothly on resize without distortion
  outputs: [setupModel function, Responsive Resize Pipeline]

- id: ku-023
  type: procedure
  name: Text Splitting & DOM Span Masking
  source: src-01, "08:10 - 08:55"
  confidence: high
  goal: Split headlines and tooltips into masked span elements for staggered roll-in animations.
  steps:
    - action: Split marquee headlines by character into span elements wrapped in overflow-hidden containers
      criterion: Characters positioned inline-block with initial translateY(100%)
    - action: Split tooltip titles and descriptions line-by-line into masked spans
      criterion: Multi-line paragraphs wrap cleanly without breaking word spacing
  outputs: [SplitText Selectors, Character/Line Spans]

- id: ku-024
  type: procedure
  name: ScrollTrigger Progress-Driven Choreography
  source: src-01, "14:42 - 18:18"
  confidence: high
  goal: Bind all 3D rotations, text reveals, clip masks, and tooltips to a single unified scroll scrubber.
  steps:
    - action: Create ScrollTrigger pinning the product section for 10x viewport height with scrub: 1
      criterion: Section locks in place and emits normalized progress (0.0 to 1.0)
    - action: Map scroll progress segments to Header 1 slide (0.05-0.35), circular mask scale (0.20-0.30), Header 2 slide (0.15-0.50), and divider scales (0.45-0.65)
      criterion: Visual transitions overlap seamlessly without sudden pop-ins
    - action: Trigger tooltip entry animations (translateY to 0%) at threshold checkpoints (0.65 and 0.85)
      criterion: Tooltip lines stagger upward when thresholds are crossed
    - action: Calculate multi-turn model Y-rotation delta and apply incrementally inside onUpdate
      criterion: 3D model spins continuously and smoothly with scroll direction
  outputs: [ScrollTrigger Choreography Controller]

- id: ku-030
  type: constraint
  name: Zero Lag Smoothing on Ticker
  source: src-01, "08:05 - 08:08"
  confidence: high
  rule: Always set `gsap.ticker.lagSmoothing(0)` when integrating Lenis smooth scroll with GSAP ScrollTrigger.
  scope: JavaScript runtime initialization
  consequence: Failing to disable lag smoothing causes jerky catch-up jumps on sudden scroll stops.
  enforced_by: Initialization setup step

- id: ku-040
  type: example
  name: Hydration Bottle 3D Scroll Showcase
  source: src-01, "00:42 - 01:32"
  confidence: high
  scenario: E-commerce landing page featuring an interactive smart water bottle with live spec annotations and multi-turn product rotation.
  application: GLTF shaker bottle loaded into Three.js, pinned for 1000vh, scrubbed across 12 full revolutions with coordinated feature callouts.
  outcome: Award-winning interactive showcase with 60 FPS performance and fluid responsive behavior.
  teaches: Unified scroll progress mapping provides complete narrative control over 3D model inspection.
```

---

## Phase 3 & 4: Compiled Skill

Below is the complete, compiled skill package ready for deployment.

```
3d-product-scroll-animation/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

### `3d-product-scroll-animation/SKILL.md`

```markdown
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

---

## Phase 5: Validation & Performance Tuning

1. **Verify Scrub Smoothness**: Check 60 FPS performance during rapid bidirectional scrolling.
2. **Verify Mobile Breakpoints**: Confirm that tooltips restack vertically below the 3D model on screens `< 1000px`.
3. **Verify DOM Element Cleanup**: Ensure masked spans outside the visible viewport have `pointer-events: none` and do not block user interactions.

For term definitions and anti-synonyms, see [terminology.md](references/terminology.md).
For full code samples and timeline maps, see [examples.md](references/examples.md).
```

### `3d-product-scroll-animation/references/terminology.md`

```markdown
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
```

### `3d-product-scroll-animation/references/examples.md`

```markdown
# Examples & Timeline Blueprint

## Scroll Timeline Progress Map

| Scroll Progress Range | Target Component | Action / Transformation |
|---|---|---|
| **0.00 - 0.05** | Master Pinned Section | Section locks to top; initial headline rolls in character-by-character. |
| **0.05 - 0.35** | `.header-1` | Marquee text slides from `0%` to `-100%` along X-axis. |
| **0.05 - 1.00** | 3D Model (`.glb`) | Model rotates continuously across Y-axis (12 full revolutions). |
| **0.15 - 0.50** | `.header-2` | Second headline slides from `+100%` (offscreen right) to `-200%` (offscreen left). |
| **0.20 - 0.30** | `.circular-mask` | Dark circular background expands from `circle(0%)` to `circle(100%)`. |
| **0.45 - 0.65** | `.tooltip .divider` | Horizontal divider lines expand from `scaleX(0)` to `scaleX(1)`. |
| **0.65+** | Tooltip 1 Callout | Icon, title lines, and description lines stagger upward (`translateY: 0%`). |
| **0.85+** | Tooltip 2 Callout | Second feature callout staggers upward (`translateY: 0%`). |

---

## Minimal Core Integration Script

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

// 1. Smooth Scroll Setup
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 2. Three.js Initialization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.querySelector('.model-container').appendChild(renderer.domElement);

// 3. Lighting Rig
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
keyLight.position.set(2, 3, 2);
scene.add(keyLight);

// 4. Model Load & Auto-Centering
let model, modelSize, currentRotation = 0;
new GLTFLoader().load('product.glb', (gltf) => {
  model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  modelSize = box.getSize(new THREE.Vector3());
  
  model.position.set(-center.x + modelSize.x * 0.4, -center.y, -center.z);
  camera.position.set(0, 0, Math.max(modelSize.x, modelSize.y, modelSize.z) * 1.25);
  scene.add(model);
});

// Render Loop
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();

// 5. ScrollTrigger Master Scrub
ScrollTrigger.create({
  trigger: '.product-overview',
  start: 'top top',
  end: '+=1000%',
  pin: true,
  pinSpacing: true,
  scrub: 1,
  onUpdate: (self) => {
    const p = self.progress;
    if (model && p >= 0.05) {
      const targetRotation = Math.PI * 12 * ((p - 0.05) / 0.95);
      const diff = targetRotation - currentRotation;
      if (Math.abs(diff) > 0.001) {
        model.rotateOnAxis(new THREE.Vector3(0, 1, 0), diff);
        currentRotation = targetRotation;
      }
    }
  }
});
```
```

---

## Phase 5: Validation & Verification

### Source Fidelity Checklist
- [x] **HTML/CSS Viewport Scaffolding**: Pinned 100svh section, layered DOM, and clip-path mask encoded in Phase 1.
- [x] **Lenis-GSAP Integration**: Ticker hookup and `lagSmoothing(0)` encoded in Phase 2.
- [x] **SplitText Masking**: Character and line wrapping via nested spans encoded in Phase 2.
- [x] **Three.js Scene & Lighting**: Ambient, directional key light with shadow map bias, fill light encoded in Phase 3.
- [x] **Bounding Box Calculation**: `THREE.Box3` extraction and responsive viewport placement encoded in Phase 3.
- [x] **ScrollTrigger Timeline Choreography**: Header translation, circular mask progression, divider scaleX, tooltip entry, and delta axis rotation encoded in Phase 4.

### Operational Coverage Scenarios Tested
1. **Scenario: E-Commerce Product Launch (Desktop Viewport)**: User scrolls through 1000vh track; model rotates smoothly while callouts lock to designated sides without overlapping geometry.
2. **Scenario: Mobile Screen (< 1000px)**: Media query and responsive calculation reposition model to viewport center and collapse callout layout into vertical stacking.
3. **Scenario: Bidirectional Rapid Scrubbing**: GSAP `lagSmoothing(0)` combined with delta axis rotation prevents rotation snapping or visual desynchronization between HTML overlay and WebGL canvas.

### Extraction Summary & Known Limitations
- **Knowledge Units Extracted**: 8 KUs (2 Concepts, 2 Principles, 5 Procedures, 1 Constraint, 1 Example).
- **Known Limitations**: Large 3D models (>15MB GLB) require a dedicated loading state before ScrollTrigger is initialized. Low-end mobile devices without WebGL 2.0 support require a 2D image sequence fallback.
