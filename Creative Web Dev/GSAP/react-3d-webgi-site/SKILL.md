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
