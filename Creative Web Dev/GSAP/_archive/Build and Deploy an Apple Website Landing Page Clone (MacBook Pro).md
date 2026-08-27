# Pipeline Execution Summary

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / tutorial walkthrough |
| **Title** | Build and Deploy an Apple Website Landing Page Clone (MacBook Pro) |
| **Authority** | JavaScript Mastery (Adrian Hajdin) |
| **Coverage** | React 19, Vite, Tailwind CSS v4, Three.js, React Three Fiber, React Three Drei, GSAP (`ScrollTrigger`, `useGSAP`), Zustand state management, `gltfjsx` 3D workflow, automated code review with CodeRabbit CLI / JetBrains Junie. |

---

## Phase 2: Knowledge Extraction (Spec Sample)

```yaml
- id: ku-001
  type: concept
  name: gltfjsx Workflow
  source: src-01, "42:45"
  confidence: high
  definition: Command-line tool that converts GLTF/GLB 3D assets into declarative, reusable React Three Fiber JSX components.
  attributes: [mesh decomposition, materials separation, automatic preload]
  avoid_terms: [3D parser, GLTF converter]

- id: ku-002
  type: procedure
  name: Global 3D Model State Management
  source: src-01, "32:55"
  confidence: high
  goal: Decouple 3D canvas rendering from DOM controls (color, scale, texture) using Zustand.
  steps:
    - action: Create Zustand store with color, scale, and texture state + setters
    - action: Consume state inside R3F model materials via useFrame or useEffect
    - action: Attach DOM control buttons to store setters
  outputs: [Synchronized UI-3D state store]

- id: ku-003
  type: procedure
  name: Scrubbed ScrollTrigger Mask Animation
  source: src-01, "82:35"
  confidence: high
  goal: Create an SVG mask zoom effect over a video canvas synchronized to page scroll.
  steps:
    - action: Overlay an absolute SVG mask container over an autoplaying inline video
    - action: Initialize a GSAP timeline bound to ScrollTrigger with scrub: 1 and pin: true
    - action: Animate scale and opacity of the mask and surrounding typography
  outputs: [Scroll-driven video reveal section]
```

---

# Compiled Skill Package: `apple-3d-landing-page`

```
apple-3d-landing-page/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

---

### `apple-3d-landing-page/SKILL.md`

```markdown
---
name: apple-3d-landing-page
description: |
  Build, animate, and deploy high-performance 3D interactive landing pages modeled after Apple product showcases.
  Use when developing web experiences requiring React Three Fiber (R3F), Three.js 3D models, GSAP ScrollTrigger
  animations, Zustand state management, and Tailwind CSS styling.
  Triggers: create apple clone, build 3d landing page, setup r3f macbook, gsap scroll animations, gltfjsx setup.
---

# Apple 3D Landing Page Methodology

A systematic workflow to build production-grade, scroll-driven, 3D interactive landing pages using React, Three.js, React Three Fiber (R3F), Drei, GSAP, and Tailwind CSS.

For domain terminology, see [terminology.md](references/terminology.md).
For detailed code architecture, see [examples.md](references/examples.md).

---

## Phase 1: Environment & Project Scaffolding

Initialize a clean React + Vite workspace with styling and 3D dependencies.

1. **Scaffold the React Application**:
   - Run `npm create vite@latest ./ -- --template react`
   - Clean up default template files: delete `App.css`, clear `index.css`, purge default assets from `/public`.
2. **Install Styling and Utility Packages**:
   - Install Tailwind CSS: `npm install tailwindcss @tailwindcss/vite`
   - Configure Vite plugin in `vite.config.js`:
     ```javascript
     import tailwindcss from '@tailwindcss/vite';
     export default defineConfig({ plugins: [react(), tailwindcss()] });
     ```
   - In `index.css`, import `@import "tailwindcss";` along with custom fonts and design utility classes.
3. **Install 3D and Animation Packages**:
   - Install Three.js suite: `npm install three @react-three/fiber @react-three/drei`
   - Install animation & state libraries: `npm install gsap @gsap/react zustand clsx react-responsive`
4. **Register GSAP Globally**:
   - In `App.jsx`, import and register `ScrollTrigger`:
     ```javascript
     import gsap from 'gsap';
     import { ScrollTrigger } from 'gsap/all';
     gsap.registerPlugin(ScrollTrigger);
     ```

### Completion Gate
- [ ] Dev server runs cleanly (`npm run dev`)
- [ ] Tailwind utility classes apply properly in JSX
- [ ] 3D and animation dependencies resolve with zero import conflicts

---

## Phase 2: Navigation & Hero Canvas Setup

Implement the high-converting minimal Apple-style navigation bar and cinematic opening hero section.

1. **Build Component Structure**:
   - Create semantic `<header>` with responsive navigation links mapped from a central constants dictionary.
   - Restrict navigation links on mobile devices using responsive Tailwind classes (`hidden md:flex`).
2. **Implement Hero Section**:
   - Add product title typography and call-to-action buttons.
   - Insert an autoplaying, muted, inline product reveal video (`playsInline`, `autoPlay`, `muted`, `loop`).
3. **Optimize Hero Video Playback**:
   - Attach a React `useRef` to the `<video>` element.
   - In a `useEffect` hook, adjust `playbackRate` (e.g., `2.0` for faster initial impact).

### Completion Gate
- [ ] Navigation links dynamically render from `constants/index.js`
- [ ] Hero video autoplays inline on both mobile and desktop viewports

---

## Phase 3: Global State & 3D Interactive Model Viewer

Create a centralized state store to control 3D model properties and display interactive R3F scenes.

1. **Configure Central State Store (Zustand)**:
   - Create `src/store/index.js` to manage `color`, `scale`, `texture`, and corresponding setters:
     ```javascript
     import { create } from 'zustand';
     export const useMacBookStore = create((set) => ({
       color: '#2e2c2e',
       scale: 0.08,
       texture: '/videos/feature-1.mp4',
       setColor: (color) => set({ color }),
       setScale: (scale) => set({ scale }),
       setTexture: (texture) => set({ texture }),
       reset: () => set({ color: '#2e2c2e', scale: 0.08, texture: '/videos/feature-1.mp4' })
     }));
     ```
2. **Convert 3D Assets with `gltfjsx`**:
   - Run `npx gltfjsx public/models/macbook.glb -T` to generate a lightweight, transformed React component.
   - Place output component inside `src/components/models/`.
3. **Map Dynamic Textures to 3D Meshes**:
   - Use Drei's `useVideoTexture(texture)` or `useTexture(screenImage)`.
   - Ensure color accuracy by assigning `texture.colorSpace = THREE.SRGBColorSpace`.
   - Apply texture to the screen mesh material (`<meshBasicMaterial map={screen} />`).
4. **Implement Lighting & Orbit/Presentation Controls**:
   - Build a `StudioLights.jsx` component combining `<Environment resolution={256}>`, `<Lightformer>`, and directional `<spotLight>`.
   - Wrap 3D models with `<PresentationControls>` to allow user interaction with physics dampening (`snap`, `speed`, `polar`, `azimuth`).

### Completion Gate
- [ ] 3D models switch dynamically based on state scale triggers
- [ ] Material colors update across mesh nodes without cross-part bleeding
- [ ] Screen texture displays without washed-out colors (`sRGB` color-space verified)

---

## Phase 4: Scroll-Triggered Parallax & Video Masking

Build scroll-synchronized showcases using GSAP timelines and responsive media queries.

1. **Parallax Video Mask Reveal**:
   - Set up a container with an absolute-positioned SVG mask over a fixed looping background video.
   - Create a `useGSAP` timeline linked to `ScrollTrigger`:
     ```javascript
     const tl = gsap.timeline({
       scrollTrigger: {
         trigger: '#showcase',
         start: 'top top',
         end: 'bottom top',
         scrub: 1,
         pin: true,
       }
     });
     tl.to('.mask img', { scale: 1.1, transformOrigin: 'center center' })
       .to('.content', { opacity: 1, y: 0, ease: 'power1.in' });
     ```
2. **Dispersed Performance Layout**:
   - Map a cluster of feature cards/images positioned via coordinates (`top`, `left`, `bottom`, `right`).
   - Animate each image toward its final position using `stagger` and scrubbed scroll progress.
   - Exclude central product models from moving off-screen (`if (pos.id === 'center-model') return`).
3. **Bento Grid Highlights Section**:
   - Build a masonry layout using Tailwind CSS.
   - Stagger card entrances as the user scrolls into the viewport.

### Completion Gate
- [ ] Mask scales cleanly to reveal underlying video without layout jumps
- [ ] Pinned sections unpin smoothly at exact scroll endpoints
- [ ] Mobile fallbacks disable heavy multi-axis 3D scrubbing on lower-end devices

---

## Phase 5: Code Quality Verification & Production Deployment

1. **Vibe & Static Code Review**:
   - Execute CLI code review via CodeRabbit (`coderabbit --plain` or IDE plugin).
   - Ensure:
     - Meaningful `alt` attributes on all images for accessibility.
     - Semantic HTML tags (`<header>`, `<section>`, `<footer>`, `<nav>`).
     - Dependency arrays in `useGSAP` and `useEffect` contain necessary triggers (`color`, `scale`, `isMobile`).
2. **Build Optimization**:
   - Run `npm run build` to generate static bundle in `/dist`.
3. **Deploy to Hosting Provider**:
   - Upload `/dist` contents to public web server root (`public_html`).
   - Validate SSL certificate and personalized domain routing.

### Completion Gate
- [ ] Production build generates with zero warnings
- [ ] Web performance scores (Lighthouse / PageSpeed) verified
- [ ] Complete landing page functions smoothly across mobile, tablet, and desktop viewports
```

---

### `apple-3d-landing-page/references/terminology.md`

```markdown
# Terminology

**gltfjsx**:
A command-line tool that compiles GLTF/GLB 3D files into declarative React Three Fiber JSX components.
_Avoid_: model converter, 3D translator

**React Three Fiber (R3F)**:
A React renderer for Three.js that brings declarative component structures to WebGL scenes.
_Avoid_: ThreeJS wrapper, WebGL library

**Drei**:
A collection of useful helpers, abstractions, and staging components designed for React Three Fiber (e.g., `<Environment>`, `<Lightformer>`, `<PresentationControls>`).
_Avoid_: Three plugins, helper pack

**ScrollTrigger**:
A GSAP plugin that triggers animations, pins elements, and links timeline progress directly to scroll position.
_Avoid_: scroll listener, scroll watcher

**Zustand**:
A lightweight, fast, boilerplate-free state management library used to coordinate UI actions with 3D canvas parameters.
_Avoid_: Redux alternative, global variable store

**Bento Grid**:
A UI layout style that arranges cards of varying sizes into a visually cohesive modular masonry grid.
_Avoid_: tile display, card list
```

---

### `apple-3d-landing-page/references/examples.md`

```markdown
# Implementation Examples

## 1. 3D Model Switcher with Smooth GSAP Transitions

```jsx
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { PresentationControls } from '@react-three/drei';
import MacBookModel16 from './MacBook-16';
import MacBookModel14 from './MacBook-14';

const ANIMATION_DURATION = 1;
const OFFSET_DISTANCE = 5;

export default function ModelSwitcher({ scale, isMobile }) {
  const smallRef = useRef();
  const largeRef = useRef();
  const showLarge = scale === 0.08 || scale === 0.05;

  useGSAP(() => {
    if (showLarge) {
      gsap.to(smallRef.current.position, { x: -OFFSET_DISTANCE, duration: ANIMATION_DURATION });
      gsap.to(largeRef.current.position, { x: 0, duration: ANIMATION_DURATION });
    } else {
      gsap.to(smallRef.current.position, { x: 0, duration: ANIMATION_DURATION });
      gsap.to(largeRef.current.position, { x: OFFSET_DISTANCE, duration: ANIMATION_DURATION });
    }
  }, [scale]);

  return (
    <PresentationControls snap speed={1} zoom={1} polar={[-Math.PI / 2, Math.PI / 2]}>
      <group ref={largeRef}>
        <MacBookModel16 scale={isMobile ? 0.05 : 0.08} />
      </group>
      <group ref={smallRef}>
        <MacBookModel14 scale={isMobile ? 0.03 : 0.06} />
      </group>
    </PresentationControls>
  );
}
```

---

## 2. Studio Lighting Rig for Product Renders

```jsx
import { Environment, Lightformer } from '@react-three/drei';

export default function StudioLights() {
  return (
    <group name="lights">
      <Environment resolution={256}>
        <group>
          <Lightformer form="rect" intensity={10} position={[-10, 5, -5]} scale={10} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={10} position={[10, 0, 1]} scale={10} rotation-y={-Math.PI / 2} />
        </group>
      </Environment>
      <spotLight position={[-2, 10, 5]} angle={0.15} decay={0} intensity={Math.PI * 0.2} />
      <spotLight position={[0, -25, 10]} angle={0.15} decay={0} intensity={Math.PI * 0.2} />
    </group>
  );
}
```
```
