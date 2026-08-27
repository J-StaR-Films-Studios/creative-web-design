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
