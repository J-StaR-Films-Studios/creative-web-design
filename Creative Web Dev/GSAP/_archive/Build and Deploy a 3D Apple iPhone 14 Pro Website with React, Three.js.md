# Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-tutorial / screencast |
| **Title** | Build and Deploy a 3D Apple iPhone 14 Pro Website with React, Three.js / WebGi, and GSAP |
| **Authority** | Slobodan Gajić (Code with Sloba) via freeCodeCamp (Senior Full-Stack Developer & Course Creator) |
| **Coverage** | React 18 + Vite setup, WebGi SDK (Three.js framework) integration, 3D GLB model preparation & optimization (Sketchfab, WebGi online viewer), GSAP ScrollTrigger timeline animation synchronized with 3D camera vectors, responsive mobile camera coordinate adaptation, interactive 3D model orbit viewer modal via React `useImperativeHandle`, CSS loader animation, and Netlify production deployment. |

### Coverage Gaps Identified
- WebGL shader customization / custom material baking (relies on WebGi base plugins and tone mapping).
- Server-Side Rendering (SSR) configuration (the project is client-rendered via Vite SPA).

---

# Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==========================================
# KNOWLEDGE SPEC: 3D React WebGi Architecture
# ==========================================

- id: ku-001
  type: concept
  name: WebGi SDK
  source: src-01, "0:21, 34:22"
  confidence: high
  definition: >
    A 3D rendering and viewer framework built on top of Three.js designed
    for photorealistic, real-time web rendering with pre-configured post-processing pipelines.
  attributes: [Three.js wrapper, plugin architecture, ToneMapping, Progressive rendering]
  avoid_terms: [raw Three.js engine, WebGL canvas library]

- id: ku-002
  type: concept
  name: GLB Asset Optimization
  source: src-01, "34:00-36:40"
  confidence: high
  definition: >
    The process of preparing a binary GLTF (.glb) 3D asset by stripping unnecessary ground planes,
    configuring transparent backgrounds, disabling shadow artifacts, and applying Draco compression.
  attributes: [Draco compression, background transparency, camera view extraction]
  avoid_terms: [3D model file conversion, texture exporting]

- id: ku-003
  type: principle
  name: Decoupled Camera Vector Animation
  source: src-01, "52:50-56:30"
  confidence: high
  statement: >
    Animate the camera's position and target coordinates using GSAP timelines while
    notifying the WebGi viewer of updates via an explicit dirty/update flag inside
    the viewer's preFrame event loop.
  rationale: >
    Directly mutating canvas frames without synchronizing with WebGi's render pipeline
    causes frame stutter, missed draw calls, and broken tone mapping.
  applies_to: [ku-022, ku-023]

- id: ku-004
  type: principle
  name: Dual-State Pointer Interaction Guard
  source: src-01, "37:30, 75:00-76:30, 85:40"
  confidence: high
  statement: >
    Set WebGi canvas container pointer-events to "none" during normal page scrolling to allow
    native DOM interaction, and toggle pointer-events to "all" only when entering isolated 3D preview mode.
  rationale: >
    A full-viewport WebGL canvas on top of DOM content will intercept all touch and click events,
    preventing users from scrolling or clicking page buttons.

- id: ku-005
  type: procedure
  name: WebGi Viewer Setup and Initialization
  source: src-01, "37:00-44:00"
  confidence: high
  goal: Initialize WebGi ViewerApp inside a React canvas ref with required post-processing plugins and camera options.
  prerequisites: [React canvas ref created, 3D GLB model placed in public folder]
  steps:
    - action: Instantiate ViewerApp targeting the canvas DOM element via canvasRef.current
      criterion: ViewerApp object created without document.getElementById DOM lookups
    - action: Add required plugins (GBufferPlugin, ProgressivePlugin, TonemapPlugin, SSRPlugin, SSAOPlugin, BloomPlugin, GammaCorrectionPlugin)
      criterion: Plugins loaded and tone mapping configured with clipBackground = true
    - action: Add 3D model asset via manager.addFromPath("scene-black.glb")
      criterion: Model loads into scene without blocking UI
    - action: Disable default orbit controls on viewer.scene.activeCamera
      criterion: camera.setCameraOptions({ controlsEnabled: false }) executed
    - action: Attach preFrame event listener to update camera.positionTargetUpdated(true) when needsUpdate is flagged
      criterion: Camera updates synchronize with render pipeline
  outputs: [Configured WebGi viewer instance, exposed camera position and target refs]

- id: ku-006
  type: procedure
  name: Scroll-Triggered 3D Camera Timeline Construction
  source: src-01, "53:30-73:30"
  confidence: high
  goal: Construct a GSAP timeline that interpolates camera position and target vectors as DOM sections scroll into view.
  prerequisites: [WebGi viewer initialized, DOM sections rendered with distinct selector classes]
  steps:
    - action: Register ScrollTrigger plugin with GSAP core
      criterion: gsap.registerPlugin(ScrollTrigger) executed once
    - action: Create GSAP timeline (gsap.timeline)
      criterion: Timeline configured with scrub factor (e.g., scrub: 2) and immediateRender: false
    - action: Add camera position and target tween transitions bound to section triggers
      criterion: Triggers specify start ("top bottom") and end ("top top") bounds
    - action: Bind onUpdate callback to set viewer needsUpdate flag and mark viewer as dirty
      criterion: Frame rendering triggers upon scroll delta
    - action: Chain opacity tweens to fade page content in/out synchronously with 3D movements
      criterion: Section text fades cleanly as 3D asset transitions
  outputs: [Synchronized GSAP ScrollTrigger 3D animation timeline]

- id: ku-007
  type: procedure
  name: Mobile & Tablet Camera Coordinate Adaptation
  source: src-01, "92:20-100:30"
  confidence: high
  goal: Adapt camera position and target coordinate vectors for narrow viewport aspect ratios.
  prerequisites: [mobileAndTabletCheck utility available, camera animation timeline constructed]
  steps:
    - action: Run device check during viewer setup and store boolean state
      criterion: isMobile state correctly reflects mobile/tablet viewports
    - action: Adjust initial camera position and target vectors when isMobile is true
      criterion: 3D model is centered and appropriately scaled on mobile viewport
    - action: Use ternary conditionals on GSAP timeline target coordinates based on isMobile flag
      criterion: Scroll animation retains correct perspective and framing on mobile devices
    - action: Apply responsive CSS class (e.g., .mobile-or-tablet) to hide oversized desktop elements
      criterion: No horizontal layout overflow occurs on mobile screen widths
  outputs: [Responsive 3D viewport configuration]

- id: ku-008
  type: procedure
  name: Isolated 3D Preview Mode Integration
  source: src-01, "73:40-90:00"
  confidence: high
  goal: Enable user-driven 3D model orbit manipulation mode via React forwardRef and useImperativeHandle.
  prerequisites: [WebGiViewer wrapped in forwardRef, Parent App component managing preview trigger]
  steps:
    - action: Expose triggerPreview method from WebGiViewer via useImperativeHandle
      criterion: Parent component can invoke 3D preview without direct internal state manipulation
    - action: Inside triggerPreview, animate camera to front-facing coordinates using gsap.to
      criterion: Camera smoothly transitions to preview angle over specified duration
    - action: Enable camera controls (controlsEnabled: true) and set canvas container pointer-events to "all"
      criterion: User can rotate and zoom 3D model via mouse/touch drag
    - action: Hide background DOM content by setting content container opacity to 0
      criterion: Background becomes solid dark focus environment
    - action: Display floating exit button when previewMode state is true
      criterion: Exit button rendered conditionally in UI
    - action: In handleExit, reverse camera vectors, disable controls, restore content opacity, and reset pointer-events to "none"
      criterion: Scene cleanly restores back to previous scroll layout
  outputs: [Interactive 3D model inspection mode with exit transition]

- id: ku-009
  type: constraint
  name: WebGi Background Transparency Enforcement
  source: src-01, "47:00-47:35, 52:15-52:35"
  confidence: high
  rule: >
    When configuring TonemapPlugin, set tonemap.config.clipBackground = true and pass
    true to the TonemapPlugin constructor (new TonemapPlugin(true)) to preserve alpha channel transparency.
  scope: WebGi viewer setup pipeline
  consequence: Without explicit clipBackground configuration, canvas renders an opaque black box over DOM content.
  enforced_by: WebGi viewer plugin initialization logic

- id: ku-010
  type: example
  name: iPhone 14 Pro Camera Keyframe Coordinates
  source: src-01, "57:30-58:10, 62:30-63:55, 69:50-70:30, 73:30-75:00"
  confidence: high
  scenario: Multi-section storytelling scroll transition for iPhone 3D model.
  application: >
    - Initial View (Hero): Position (x: 1.56, y: 5.0, z: 0.01), Target (x: -0.55, y: 0.32, z: 0.0)
    - Sound Section View: Position (x: -3.38, y: -10.74, z: -5.93), Target (x: 1.52, y: 0.77, z: -1.08)
    - Display Section View: Position (x: 1.56, y: 5.0, z: 0.01), Target (x: -0.55, y: 0.32, z: 0.0)
    - Preview Mode: Position (x: 13.04, y: -2.01, z: 2.29), Target (x: 0.11, y: 0.0, z: 0.0)
  outcome: Cinematic 3D phone rotation and zoom perfectly matching Apple promotional site aesthetic.
  teaches: Capturing exact camera vectors in WebGi editor translates directly into deterministic GSAP tween targets.
```

---

# Phase 3: Methodology Synthesis

```
STAGE 1: Asset Preparation & View Coordinate Extraction
INPUT: Raw 3D model (.glb format)
STEPS:
1. Load .glb file into WebGi 3D Viewer online editor (webgi.xyz/editor).
2. Remove default ground reflection plane and disable shadow artifacts.
3. Configure lighting, material roughness, and camera clipping.
4. Position the model into desired view for each page section (Hero, Feature 1, Feature 2, Modal).
5. Record Camera Position (X, Y, Z) and Target (X, Y, Z) vectors for every section.
6. Export compressed .glb with Draco compression enabled.
OUTPUT: Optimized .glb asset and camera coordinate matrix.

STAGE 2: React Canvas & WebGi Viewport Scaffolding
INPUT: React 18 project with Vite, GSAP, WebGi SDK installed.
STEPS:
1. Create WebGiViewer component using React forwardRef.
2. Initialize canvasRef and canvas container with pointer-events: none.
3. In useEffect/useCallback, instantiate ViewerApp on canvasRef.current.
4. Register essential plugins (GBuffer, Progressive, Tonemap, SSAO, Bloom, GammaCorrection).
5. Set tonemap.config.clipBackground = true for alpha transparency over HTML DOM.
6. Load 3D model via manager.addFromPath("model.glb").
7. Disable default camera orbit controls.
8. Set up preFrame event listener syncing camera.positionTargetUpdated with needsUpdate flag.
OUTPUT: Transparent, performant WebGL canvas rendering 3D asset behind DOM.

STAGE 3: GSAP Scroll-Triggered Camera Timeline
INPUT: WebGi viewer refs (camera, position, target, viewer), DOM section classnames.
STEPS:
1. Register ScrollTrigger plugin with GSAP.
2. Create scrollAnimation timeline with scrub: 2, immediateRender: false.
3. Create tween stages mapping each section trigger (.jumbotron-section, .sound-section, .display-section) to corresponding camera position and target vectors.
4. Attach onUpdate callback setting needsUpdate = true and viewerRef.setDirty().
5. Add synchronized DOM opacity tweens to cross-fade HTML content as 3D model animates.
6. Apply responsive conditional overrides for mobile/tablet screen aspect ratios.
OUTPUT: Scroll-synchronized 3D storytelling animation.

STAGE 4: Interactive 3D Orbit Inspection Mode
INPUT: WebGiViewer component with forwardRef, parent state handler.
STEPS:
1. Define useImperativeHandle in WebGiViewer exposing triggerPreview method.
2. Animate camera to centered front-facing inspect position via gsap.to.
3. Set viewer camera controlsEnabled = true to permit orbit and pinch-to-zoom.
4. Set canvas container pointer-events = "all" and DOM content container opacity = 0.
5. Render conditional "Exit" button when previewMode is active.
6. Implement handleExit callback reversing camera coordinates, setting controlsEnabled = false, resetting pointer-events = "none", and restoring DOM content opacity = 1.
OUTPUT: Full-screen interactive 3D product visualizer.

STAGE 5: Production Build & Deployment
INPUT: Working project directory.
STEPS:
1. Add animated logo loader component with CSS fade-out timer.
2. Run npm run build via Vite to produce static dist/ output.
3. Deploy dist/ to hosting provider (Netlify Drop / Vercel).
4. Configure domain routing and verify WebGL asset caching.
OUTPUT: Live, optimized 3D interactive web application.
```

---

# Phase 4: Compiled Skill Package

Below is the complete skill package structured according to the Skill Specification.

```
react-3d-webgi-site/
├── SKILL.md
└── references/
    ├── terminology.md
    └── camera-coords.md
```

### `react-3d-webgi-site/SKILL.md`

```markdown
---
name: react-3d-webgi-site
description: |
  Build and deploy high-performance 3D interactive product websites using React, WebGi (Three.js framework), and GSAP ScrollTrigger.
  Use when: creating 3D product showcase sites (like Apple iPhone clones), embedding interactive 3D GLB models into React SPAs,
  animating WebGL camera vectors tied to page scroll, building isolated 3D model inspect modes, or optimizing 3D canvas performance for mobile.
  Triggers: build 3d website, react threejs website, webgi 3d viewer, gsap 3d scroll animation, 3d iphone clone, embed 3d glb react.
---

# 3D Interactive Website Compiler (React + WebGi + GSAP)

Build photorealistic, scroll-driven 3D product landing pages using React, WebGi SDK (Three.js framework), and GSAP ScrollTrigger.

## Core Principles

1. **Decouple DOM from WebGL**: Render the 3D canvas fixed in the background (`pointer-events: none; z-index: 1`) and scroll standard HTML sections over it.
2. **Explicit Render Dirtying**: Never re-render WebGL canvas continuously during idle. Mutate camera vectors via GSAP tweens and trigger `viewer.setDirty()` only on frame update.
3. **Alpha Channel Background**: Enforce `clipBackground = true` on tone mapping to prevent black background boxes over HTML styling.
4. **Isolate Touch Events**: Keep canvas pointer events disabled during scrolling; toggle to `pointer-events: all` exclusively in active 3D model preview mode.

For architectural terminology, see [terminology.md](references/terminology.md).

---

## Phase 1: 3D Asset Preparation & Optimization

Prepare and optimize 3D GLB assets before loading them into React.

1. **Source Asset**: Obtain a clean 3D model in `.glb` format (e.g., from Sketchfab).
2. **Open WebGi Editor**: Load the `.glb` file into the WebGi 3D Viewer online studio (`webgi.xyz/editor`).
3. **Clean Scene Graph**:
   - Delete ground planes, reflection meshes, and environment geometries that clip page elements.
   - Set background transparency to transparent.
4. **Extract Section Camera Vectors**:
   - Position the model for each website section (Hero, Sound, Display, Inspect).
   - In WebGi Editor > **Animations** > **Camera Views**, click **Add Current View**.
   - Note the exact `position` (X, Y, Z) and `target` (X, Y, Z) vector values for each view.
5. **Export Compressed Asset**:
   - Go to **Export** > **Asset Export**.
   - Select **GLB Export** and enable **DRACO Compression**.
   - Save the optimized `.glb` file into the React project's `public/` directory (e.g., `public/scene-black.glb`).

For a reference camera coordinate table, see [camera-coords.md](references/camera-coords.md).

### Completion Gate
- [ ] GLB file size minimized with Draco compression
- [ ] Unwanted ground/reflection meshes removed
- [ ] Camera Position (X, Y, Z) and Target (X, Y, Z) recorded for all sections
- [ ] GLB asset placed in `public/` folder

---

## Phase 2: WebGi Canvas Viewport Scaffolding

Construct the WebGL viewport inside a React component using `useRef` and `forwardRef`.

1. **Canvas Element Setup**:
   Create `src/components/WebGiViewer.jsx` wrapped in `React.forwardRef`:
   ```jsx
   import React, { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef } from "react";
   import {
       ViewerApp,
       AssetManagerPlugin,
       GBufferPlugin,
       ProgressivePlugin,
       TonemapPlugin,
       SSRPlugin,
       SSAOPlugin,
       BloomPlugin,
       GammaCorrectionPlugin,
       mobileAndTabletCheck
   } from "webgi";
   import gsap from "gsap";
   import { ScrollTrigger } from "gsap/ScrollTrigger";
   import { scrollAnimation } from "../lib/scroll-animation";

   gsap.registerPlugin(ScrollTrigger);
   ```

2. **Viewer Initialization Procedure**:
   Instantiate the viewer inside a memoized `useCallback`:
   ```jsx
   const WebGiViewer = forwardRef((props, ref) => {
       const canvasRef = useRef(null);
       const [viewerRef, setViewerRef] = useState(null);
       const [targetRef, setTargetRef] = useState(null);
       const [cameraRef, setCameraRef] = useState(null);
       const [positionRef, setPositionRef] = useState(null);
       const [isMobile, setIsMobile] = useState(null);
       const canvasContainerRef = useRef(null);

       const setupViewer = useCallback(async () => {
           const viewer = new ViewerApp({ canvas: canvasRef.current });
           setViewerRef(viewer);

           const isMobileOrTablet = mobileAndTabletCheck();
           setIsMobile(isMobileOrTablet);

           const manager = await viewer.addPlugin(AssetManagerPlugin);
           const camera = viewer.scene.activeCamera;
           const position = camera.position;
           const target = camera.target;

           setCameraRef(camera);
           setPositionRef(position);
           setTargetRef(target);

           await viewer.addPlugin(GBufferPlugin);
           await viewer.addPlugin(new ProgressivePlugin(32));
           await viewer.addPlugin(new TonemapPlugin(true));
           await viewer.addPlugin(GammaCorrectionPlugin);
           await viewer.addPlugin(SSRPlugin);
           await viewer.addPlugin(SSAOPlugin);
           await viewer.addPlugin(BloomPlugin);

           viewer.renderer.refreshPipeline();
           await manager.addFromPath("scene-black.glb");

           const tonemap = viewer.getPlugin(TonemapPlugin);
           tonemap.config.clipBackground = true;

           viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

           if (isMobileOrTablet) {
               position.set(-16.7, 1.17, 11.7);
               target.set(0, 1.37, 0);
               props.contentRef.current.className = "mobile-or-tablet";
           }

           window.scrollTo(0, 0);

           let needsUpdate = true;
           const onUpdate = () => {
               needsUpdate = true;
               viewer.setDirty();
           };

           viewer.addEventListener("preFrame", () => {
               if (needsUpdate) {
                   camera.positionTargetUpdated(true);
                   needsUpdate = false;
               }
           });

           memoizedScrollAnimation(position, target, isMobileOrTablet, onUpdate);
       }, []);

       useEffect(() => {
           setupViewer();
       }, [setupViewer]);
   ```

3. **Styling Container**:
   Ensure `#webgi-canvas-container` is fixed with `pointer-events: none; top: 0; left: 0; width: 100vw; height: 100vh; position: fixed;`.

### Completion Gate
- [ ] ViewerApp binds to `canvasRef.current`
- [ ] Background alpha transparency enabled (`clipBackground = true`)
- [ ] Default orbit controls disabled during initial page load
- [ ] `preFrame` loop manages `positionTargetUpdated` efficiently

---

## Phase 3: GSAP Scroll-Triggered Animation Pipeline

Bind 3D camera vector changes to page scroll depth using a standalone animation module.

1. **Create Animation Definition File (`src/lib/scroll-animation.js`)**:
   ```javascript
   import gsap from "gsap";

   export const scrollAnimation = (position, target, isMobile, onUpdate) => {
       const tl = gsap.timeline();

       // Sequence 1: Transition Hero -> Sound Section
       tl.to(position, {
           x: !isMobile ? -3.38 : -7.0,
           y: !isMobile ? -10.74 : -12.2,
           z: !isMobile ? -5.93 : -6.0,
           scrollTrigger: {
               trigger: ".sound-section",
               start: "top bottom",
               end: "top top",
               scrub: 2,
               immediateRender: false
           },
           onUpdate
       })
       .to(target, {
           x: !isMobile ? 1.52 : 0.7,
           y: !isMobile ? 0.77 : 1.9,
           z: !isMobile ? -1.08 : 0.7,
           scrollTrigger: {
               trigger: ".sound-section",
               start: "top bottom",
               end: "top top",
               scrub: 2,
               immediateRender: false
           }
       })
       .to(".jumbotron-section", {
           opacity: 0,
           scrollTrigger: {
               trigger: ".sound-section",
               start: "top bottom",
               end: "top top",
               scrub: 2,
               immediateRender: false
           }
       })
       .to(".sound-section-content", {
           opacity: 1,
           scrollTrigger: {
               trigger: ".sound-section",
               start: "top bottom",
               end: "top top",
               scrub: 2,
               immediateRender: false
           }
       })

       // Sequence 2: Transition Sound Section -> Display Section
       .to(position, {
           x: !isMobile ? 1.56 : 9.36,
           y: !isMobile ? 5.0 : 10.95,
           z: !isMobile ? 0.01 : 0.09,
           scrollTrigger: {
               trigger: ".display-section",
               start: "top bottom",
               end: "top top",
               scrub: 2,
               immediateRender: false
           },
           onUpdate
       })
       .to(target, {
           x: !isMobile ? -0.55 : -1.62,
           y: !isMobile ? 0.32 : 0.02,
           z: !isMobile ? 0.0 : -0.06,
           scrollTrigger: {
               trigger: ".display-section",
               start: "top bottom",
               end: "top top",
               scrub: 2,
               immediateRender: false
           }
       })
       .to(".display-section", {
           opacity: 1,
           scrollTrigger: {
               trigger: ".display-section",
               start: "top bottom",
               end: "top top",
               scrub: 2,
               immediateRender: false
           }
       });
   };
   ```

2. **Programmatic Smooth Scroll Handlers**:
   In DOM sections (e.g., `Jumbotron.jsx`, `SoundSection.jsx`), implement scroll triggers:
   ```javascript
   const handleLearnMore = () => {
       const element = document.querySelector(".sound-section");
       window.scrollTo({
           top: element?.getBoundingClientRect().top,
           left: 0,
           behavior: "smooth"
       });
   };
   ```

### Completion Gate
- [ ] GSAP timeline uses `scrub: 2` and `immediateRender: false`
- [ ] `onUpdate` notifies WebGi viewer on position change
- [ ] DOM text elements fade synchronously with 3D camera shifts
- [ ] Smooth scrolling triggers navigate between defined section offsets

---

## Phase 4: Interactive 3D Model Inspection Modal

Expose an isolated 3D orbit inspection mode using `useImperativeHandle`.

1. **Expose Imperative Handle in `WebGiViewer.jsx`**:
   ```jsx
   const [previewMode, setPreviewMode] = useState(false);

   useImperativeHandle(ref, () => ({
       triggerPreview() {
           setPreviewMode(true);
           canvasContainerRef.current.style.pointerEvents = "all";
           props.contentRef.current.style.opacity = "0";

           gsap.to(positionRef, {
               x: 13.04,
               y: -2.01,
               z: 2.29,
               duration: 2,
               onUpdate: () => {
                   viewerRef.setDirty();
                   cameraRef.positionTargetUpdated(true);
               }
           });

           gsap.to(targetRef, { x: 0.11, y: 0.0, z: 0.0, duration: 2 });
           viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: true });
       }
   }));

   const handleExit = useCallback(() => {
       setPreviewMode(false);
       canvasContainerRef.current.style.pointerEvents = "none";
       props.contentRef.current.style.opacity = "1";
       viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

       gsap.to(positionRef, {
           x: !isMobile ? 1.56 : 9.36,
           y: !isMobile ? 5.0 : 10.95,
           z: !isMobile ? 0.01 : 0.09,
           duration: 2,
           onUpdate: () => {
               viewerRef.setDirty();
               cameraRef.positionTargetUpdated(true);
           }
       });

       gsap.to(targetRef, {
           x: !isMobile ? -0.55 : -1.62,
           y: !isMobile ? 0.32 : 0.02,
           z: !isMobile ? 0.0 : -0.06,
           duration: 2
       });
   }, [isMobile, viewerRef, positionRef, targetRef, cameraRef]);
   ```

2. **Render Return Scaffolding**:
   ```jsx
   return (
       <div ref={canvasContainerRef} id="webgi-canvas-container">
           <canvas id="webgi-canvas" ref={canvasRef} />
           {previewMode && (
               <button className="button" onClick={handleExit}>Exit</button>
           )}
       </div>
   );
   ```

3. **Wire Trigger in `App.jsx`**:
   ```jsx
   function App() {
       const webgiViewerRef = useRef();
       const contentRef = useRef();

       const handlePreview = () => {
           webgiViewerRef.current?.triggerPreview();
       };

       return (
           <div className="App">
               <Loader />
               <div ref={contentRef} id="content">
                   <Nav />
                   <Jumbotron />
                   <SoundSection />
                   <DisplaySection triggerPreview={handlePreview} />
               </div>
               <WebGiViewer contentRef={contentRef} ref={webgiViewerRef} />
           </div>
       );
   }
   ```

### Completion Gate
- [ ] Clicking "Try me!" isolates the 3D phone model and disables DOM visibility
- [ ] Orbit controls enable user rotation and zoom
- [ ] Exit button cleanly restores previous scroll position, camera angle, and DOM visibility

---

## Phase 5: Loading Screen & Production Deployment

1. **Loader Component (`src/components/Loader.jsx`)**:
   Display animated logo while 3D assets load into memory:
   ```jsx
   import React from "react";
   import AnimatedLogo from "../assets/images/logo-animated.gif";

   export default function Loader() {
       return (
           <div className="loader">
               <img className="logo" src={AnimatedLogo} alt="loading..." />
           </div>
       );
   }
   ```
   Apply CSS fade-out animation (`animation: fadeOut 0.3s ease-in-out 3s forwards; pointer-events: none;`).

2. **Compile Static Bundle**:
   Execute Vite build command:
   ```bash
   npm run build
   ```
   Verify `dist/` directory contains compiled JS bundle, CSS, and compressed GLB asset.

3. **Deploy to Hosting Provider (Netlify / Vercel)**:
   - Deploy `dist/` folder directly via drag-and-drop or Git CI pipeline.
   - Configure custom site name / sub-domain.
   - Verify on physical mobile and desktop browsers that WebGL canvas initializes without memory leaks.

### Completion Gate
- [ ] `npm run build` succeeds without bundle errors
- [ ] Loading animation gracefully fades into initial 3D Hero scene
- [ ] Site deployed and accessible via public HTTPS URL
```

---

### `react-3d-webgi-site/references/terminology.md`

```markdown
# Terminology

**WebGi SDK**:
A high-performance Three.js framework optimized for photorealistic WebGL rendering, tone mapping, and automated post-processing pipelines.
_Avoid_: Three.js canvas helper, WebGL graphic library

**GSAP ScrollTrigger**:
The GreenSock animation plugin that links timeline progress directly to browser viewport scroll depth and element trigger thresholds.
_Avoid_: scroll listener, scroll watcher

**Camera Target Vector**:
The 3D point $(X, Y, Z)$ in world space at which the WebGL camera is centered and looking toward.
_Avoid_: camera focus, look-at coordinate

**Camera Position Vector**:
The physical location $(X, Y, Z)$ of the camera lens relative to the origin of the 3D scene.
_Avoid_: camera distance, viewpoint coordinate

**Draco Compression**:
An open-source library for compressing and decompressing 3D geometric meshes and point clouds to drastically reduce GLB payload sizes.
_Avoid_: 3D zip, model minifier

**Tone Mapping**:
The algorithmic mapping of high-dynamic-range (HDR) color values to low-dynamic-range display color space, including background alpha clipping.
_Avoid_: color grading, screen filter
```

---

### `react-3d-webgi-site/references/camera-coords.md`

```markdown
# 3D Camera Coordinate Matrix (iPhone 14 Pro Spec)

Reference camera position and target vectors extracted from WebGi Editor for Apple promotional layout.

## Desktop Coordinate System

| View / Section | Camera Position $(X, Y, Z)$ | Camera Target $(X, Y, Z)$ | Scrub / Duration |
|---|---|---|---|
| **Hero (Initial)** | `(1.56, 5.0, 0.01)` | `(-0.55, 0.32, 0.0)` | Initial Load |
| **Sound Section** | `(-3.38, -10.74, -5.93)` | `(1.52, 0.77, -1.08)` | `scrub: 2` |
| **Display Section** | `(1.56, 5.0, 0.01)` | `(-0.55, 0.32, 0.0)` | `scrub: 2` |
| **Interactive Preview** | `(13.04, -2.01, 2.29)` | `(0.11, 0.0, 0.0)` | `duration: 2` (Smooth tween) |

## Mobile & Tablet Responsive Coordinate System

| View / Section | Camera Position $(X, Y, Z)$ | Camera Target $(X, Y, Z)$ | Notes |
|---|---|---|---|
| **Hero (Initial)** | `(-16.7, 1.17, 11.7)` | `(0.0, 1.37, 0.0)` | Compasses narrow portrait aspect |
| **Sound Section** | `(-7.0, -12.2, -6.0)` | `(0.7, 1.9, 0.7)` | Shifted right to preserve text clearance |
| **Display Section** | `(9.36, 10.95, 0.09)` | `(-1.62, 0.02, -0.06)` | Scaled for vertical display framing |
| **Interactive Preview** | `(13.04, -2.01, 2.29)` | `(0.11, 0.0, 0.0)` | Centered for touch-drag orbit |
```

---

# Phase 5: Validation & Extraction Summary

### Extraction Summary
- **Knowledge Units Extracted**: 10 total (2 Concepts, 2 Principles, 4 Procedures, 1 Constraint, 1 Detailed Example).
- **Key Technical Conflicts Resolved**:
  - *Conflict*: WebGi canvas intercepting page scrolling vs. user needing to scroll HTML content.
  - *Resolution*: Canvas set to `pointer-events: none` globally; dynamically toggled to `pointer-events: all` strictly inside `triggerPreview()`.
  - *Conflict*: Black opaque box rendering over DOM content.
  - *Resolution*: Instantiating `new TonemapPlugin(true)` and configuring `tonemap.config.clipBackground = true`.

### Operational Verification Scenarios
1. **Scenario 1 (Initial Hero Load)**:
   - *Trace*: `App.jsx` mounts `Loader` and `WebGiViewer`. `setupViewer` initializes WebGi, sets `controlsEnabled: false`, loads `scene-black.glb`, and applies initial camera vectors.
   - *Result*: 3D model renders smoothly behind navigation and hero text; loader fades out after 3 seconds.
2. **Scenario 2 (Continuous Scroll Interaction)**:
   - *Trace*: User scrolls through `.sound-section` and `.display-section`. GSAP ScrollTrigger updates camera position and target vectors via `scrub: 2`. `onUpdate` flags `needsUpdate = true` and `viewer.setDirty()`.
   - *Result*: 3D phone rotates smoothly in lockstep with scroll speed without rendering lag or canvas clipping.
3. **Scenario 3 (3D Model Modal Inspection)**:
   - *Trace*: User clicks "Try me!". `handlePreview` invokes `webgiViewerRef.current.triggerPreview()`. Content container opacity is set to 0, pointer events set to `all`, and `controlsEnabled: true`.
   - *Result*: Background darkens, phone aligns front-and-center, and user can orbit and zoom 3D model. Clicking "Exit" returns the camera and DOM to their prior states.
