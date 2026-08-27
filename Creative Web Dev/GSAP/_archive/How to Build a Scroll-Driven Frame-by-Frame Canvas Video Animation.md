Here is the operational knowledge extracted and compiled directly from the video into the structured **Source-to-Skill** format.

---

### Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video / tutorial |
| **Title** | How to Build a Scroll-Driven Frame-by-Frame Canvas Video Animation (Adaline / Award-Winning Style) |
| **Authority** | Frontend / Creative Web Development Tutorial |
| **Coverage** | Video frame extraction (DaVinci Resolve, CLI conversion), HTML5 Canvas setup, Retina scaling (`devicePixelRatio`), Aspect ratio preservation (`object-fit: cover` math on 2D context), GSAP + ScrollTrigger scrub integration, Lenis smooth scroll synchronization, 3D CSS transforms layered with canvas scrubbing. |

---

### Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
- id: ku-001
  type: concept
  name: Canvas Image-Sequence Playback
  source: src-01, "01:36 - 02:15"
  confidence: high
  definition: >
    A scroll-driven animation technique that renders preloaded individual image frames
    sequentially onto an HTML5 2D canvas rather than controlling standard HTML5 video elements,
    eliminating video-scrub lag and dropped frames.
  avoid_terms: [video scrub, mp4 playback on scroll]

- id: ku-002
  type: principle
  name: Preload All Frames into Memory
  source: src-01, "13:45 - 14:55"
  confidence: high
  statement: >
    Load all image frames into memory arrays prior to initializing the scroll timeline.
    Never load individual frames on-demand during scroll ticks to prevent lag and frame jitter.
  applies_to: [ku-006, ku-007]

- id: ku-003
  type: principle
  name: High-DPI Canvas Backing Scale
  source: src-01, "12:18 - 13:00"
  confidence: high
  statement: >
    Multiply the canvas internal pixel dimensions (`canvas.width`, `canvas.height`) by
    `window.devicePixelRatio`, set CSS display dimensions (`canvas.style.width/height`) to CSS pixels,
    and scale the 2D rendering context by `devicePixelRatio` to prevent blurriness on Retina/High-DPI screens.

- id: ku-004
  type: principle
  name: Context-Level Aspect Ratio Containment (Cover Math)
  source: src-01, "15:30 - 16:05"
  confidence: high
  statement: >
    Replicate CSS `object-fit: cover` mathematically inside the Canvas 2D context by comparing
    the image aspect ratio against the canvas aspect ratio, scaling by height or width accordingly,
    and centering via negative coordinate offsets (`drawX`, `drawY`).

- id: ku-005
  type: procedure
  name: Asset Extraction and Batch Conversion
  source: src-01, "02:16 - 03:45"
  confidence: high
  goal: Extract every frame from video footage as sequentially numbered, lightweight JPG assets.
  steps:
    - action: Import footage into DaVinci Resolve (or NLE) and configure custom export settings to export an image sequence as TIFF (`frame_XXXX.tif`).
      criterion: All video frames exported sequentially without skipped frames (e.g., 200+ frames).
    - action: Use macOS `sips` CLI tool to batch convert TIFF files to JPG format.
      command: 'for file in frame_*.tif; do sips -s format jpeg "$file" --out "${file%.tif}.jpg"; done'
      criterion: Identically named `.jpg` files generated for every frame.
    - action: Remove uncompressed TIFF source files.
      command: 'rm frame_*.tif'
      criterion: Folder contains only sequentially indexed JPG files.
  outputs: [Directory of indexed JPG frames: `frame_0001.jpg` to `frame_NNNN.jpg`]

- id: ku-006
  type: procedure
  name: HTML and 3D Perspective DOM Structure Setup
  source: src-01, "03:47 - 05:35"
  confidence: high
  goal: Build the nested DOM layout separating absolute 3D transform layers from the fixed/sticky canvas background.
  steps:
    - action: Create top navigation `<nav>` with `position: fixed`, `z-index: 2`, and `will-change: opacity`.
      criterion: Navigation stays fixed above the canvas.
    - action: Create `<section class="hero">` containing `<canvas>` and separate overlay containers (`.hero-content` and `.hero-img-container`).
      criterion: Section is set to `height: 100vh`/`100svh`, `overflow: hidden`, and `position: relative`.
    - action: Apply 3D perspective to overlay wrappers (`transform-style: preserve-3d; perspective: 1000px;`) and position child elements absolutely.
      criterion: Overlays support independent `translateZ()` animations without altering document layout flow.
  outputs: [DOM structure with canvas base and 3D perspective layers]

- id: ku-007
  type: procedure
  name: Scroll-Scrubbed Canvas and 3D Layer Engine
  source: src-01, "10:46 - 20:55"
  confidence: high
  goal: Integrate Lenis, GSAP ScrollTrigger, preloaded frames, and dynamic multi-element scrubbing.
  steps:
    - action: Initialize Lenis smooth scroll and synchronize with GSAP ticker (`gsap.ticker.add(...)`).
      criterion: ScrollTrigger updates accurately alongside Lenis raf loop.
    - action: Calculate device pixel ratio, size canvas width/height, and scale 2D context.
      criterion: Canvas renders sharp at native display density.
    - action: Asynchronously instantiate `new Image()` for all frames with `onload` and `onerror` listeners; trigger initial frame render upon completing all loads.
      criterion: Array populated with complete Image objects; fallback handler prevents loading hangs.
    - action: Create pinned `ScrollTrigger.create({...})` on `.hero` with `pin: true`, `scrub: 1`, and extended scroll range (`end: "+=" + window.innerHeight * 7`).
      criterion: Section stays pinned for 7x viewport scroll duration while scrub moves from progress 0 to 1.
    - action: In `onUpdate(self)` handler, calculate animation progress clamped to 90% (`Math.min(self.progress / 0.9, 1)`), compute target frame index, and draw corresponding image frame to canvas.
      criterion: Frame index accurately maps to scroll position and finishes playback before the section unpins.
    - action: Scrub overlapping 3D transforms: fade out navigation (0-10% progress), push hero text backward (`translateZ(-500px)`, opacity 1 to 0 between 0-25%), and pull dashboard graphic forward (`translateZ(1000px)` to `0px`, opacity 0 to 1 between 60-90%).
      criterion: Text recedes into distance, background video progresses, and dashboard arrives in center.
    - action: Attach `window.addEventListener('resize', ...)` to re-run sizing, re-render active frame, and call `ScrollTrigger.refresh()`.
      criterion: Aspect ratio, canvas pixel density, and scroll calculations remain intact across viewport resize events.
  outputs: [Complete scroll-driven frame-by-frame interactive web experience]
```

---

### Phase 3 & 4: Compiled Operational Skill (`SKILL.md`)

```markdown
---
name: build-canvas-scroll-video
description: |
  Build high-performance, scroll-driven, frame-by-frame video animations rendered
  on HTML5 Canvas with GSAP ScrollTrigger, Lenis smooth scroll, and layered 3D CSS transforms.
  Use when building award-winning hero sections, product walkthroughs, or interactive landing pages.
---

# Canvas Scroll Video Animation Engine

Implement scroll-scrubbed image sequence playback on an HTML5 2D Canvas paired with smooth scrolling and synchronized 3D DOM transform overlays.

## Principles

1. **Frames Over Video Tags**: Never scrub native `<video>` elements on scroll. Preload extracted sequential JPG images into memory and paint to a 2D canvas context.
2. **Sharp High-DPI Rendering**: Always scale internal canvas resolution by `window.devicePixelRatio` while scaling context drawing transforms to avoid blurriness on Retina displays.
3. **Context `object-fit: cover`**: Dynamically calculate image vs. canvas aspect ratios to prevent image distortion on arbitrary screen viewports.
4. **Buffer Room on Pin**: Finish frame scrubbing at ~90% scroll progress to give unpin transitions natural breathing room.

---

## Phase 1: Asset Preparation & Image Sequence Extraction

Extract video frames as sequentially named images.

1. Export raw footage from an editor (DaVinci Resolve / Premiere / ffmpeg) as a numbered image sequence (`frame_0001.tif` to `frame_NNNN.tif`).
2. Batch-convert the uncompressed frames to JPEG in the terminal using native tooling:
   ```bash
   for file in frame_*.tif; do sips -s format jpeg "$file" --out "${file%.tif}.jpg"; done
   ```
3. Remove original uncompressed files:
   ```bash
   rm frame_*.tif
   ```
4. Move the resulting `frames/` directory into your project's public asset path.

### Completion Gate
- [ ] Folder contains strictly `.jpg` assets with 4-digit zero-padded indexing (`frame_0001.jpg`).
- [ ] Frame count is confirmed (e.g., 200+ frames for smooth scrubbing).

---

## Phase 2: HTML & 3D Layer Architecture

Set up DOM nodes separating the render canvas from 3D-transformed text and graphic overlays.

```html
<nav class="nav">
  <div class="nav-links"><!-- Links --></div>
  <div class="logo"><a href="#">Byewind</a></div>
  <div class="nav-buttons"><!-- Actions --></div>
</nav>

<section class="hero">
  <canvas></canvas>

  <div class="hero-content">
    <div class="header">
      <h1>One unified workspace to build, test, and ship AI faster</h1>
      <p>TRUSTED BY</p>
      <div class="client-logos"><!-- Logos --></div>
    </div>
  </div>

  <div class="hero-img-container">
    <div class="hero-img">
      <img src="/dashboard.png" alt="Dashboard" />
    </div>
  </div>
</section>

<section class="outro">
  <h1>Join teams building faster with Byewind.</h1>
</section>
```

### Layout Constraints (CSS)
- `.hero`: Set `position: relative; width: 100vw; height: 100svh; overflow: hidden;`.
- `canvas`: Set `position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;`.
- `.hero-content`, `.hero-img-container`: Set `position: absolute; transform-style: preserve-3d; perspective: 1000px;`.
- `.hero-img`: Set initial state to pushed forward in 3D space (`transform: translateZ(1000px); opacity: 0;`).

### Completion Gate
- [ ] Canvas is positioned behind overlays.
- [ ] Overlay wrappers have explicit 3D perspective rules.

---

## Phase 3: Canvas Setup & Aspect Ratio Math

Implement canvas dimensioning and custom 2D context cover-fitting.

```javascript
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function setCanvasSize() {
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  context.scale(pixelRatio, pixelRatio);
}

function renderFrame(img) {
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  const imageAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, drawX, drawY;

  if (imageAspect > canvasAspect) {
    drawHeight = canvasHeight;
    drawWidth = canvasHeight * imageAspect;
    drawX = (canvasWidth - drawWidth) / 2;
    drawY = 0;
  } else {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imageAspect;
    drawX = 0;
    drawY = (canvasHeight - drawHeight) / 2;
  }

  context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}
```

### Completion Gate
- [ ] Internal resolution accounts for `devicePixelRatio`.
- [ ] Aspect ratio calculation dynamically centers and crops frame without stretching.

---

## Phase 4: Asset Preloading Pipeline

Preload every image into memory before initializing scroll interactions.

```javascript
const frameCount = 207;
const currentFrame = (index) =>
  `/frames/frame_${(index + 1).toString().padStart(4, "0")}.jpg`;

let images = [];
let videoFrames = { frame: 0 };
let imagesToLoad = frameCount;

function preloadImages(onComplete) {
  const onLoadOrError = () => {
    imagesToLoad--;
    if (imagesToLoad === 0) {
      onComplete();
    }
  };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.onload = onLoadOrError;
    img.onerror = onLoadOrError; // Prevent deadlock on failed assets
    img.src = currentFrame(i);
    images.push(img);
  }
}
```

### Completion Gate
- [ ] Array contains all Image objects.
- [ ] Error handler ensures pipeline completes even if an asset fails to load.

---

## Phase 5: Smooth Scroll & ScrollTrigger Orchestration

Connect Lenis smooth scrolling, GSAP ScrollTrigger pinning, frame swapping, and layered 3D DOM motion.

```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis Smooth Scroll
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 2. Setup ScrollTrigger Timeline
function setupScrollTrigger() {
  const nav = document.querySelector("nav");
  const header = document.querySelector(".header");
  const heroImg = document.querySelector(".hero-img");

  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: () => `+=${window.innerHeight * 7}`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      // Canvas Frame Scrubbing (0% to 90% scroll progress)
      const animationProgress = Math.min(progress / 0.9, 1);
      const targetFrame = Math.round(animationProgress * (frameCount - 1));
      videoFrames.frame = targetFrame;
      renderFrame(images[targetFrame]);

      // Layer 1: Nav Fade Out (0% - 10%)
      if (progress <= 0.1) {
        const navProgress = progress / 0.1;
        gsap.set(nav, { opacity: 1 - navProgress });
      } else {
        gsap.set(nav, { opacity: 0 });
      }

      // Layer 2: Header Recedes into 3D Space (0% - 25%)
      if (progress <= 0.25) {
        const zProgress = progress / 0.25;
        const translateZ = zProgress * -500;
        let opacity = 1;
        if (progress >= 0.2) {
          opacity = 1 - (progress - 0.2) / 0.05;
        }
        gsap.set(header, {
          transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
          opacity: opacity,
        });
      } else {
        gsap.set(header, { opacity: 0 });
      }

      // Layer 3: Dashboard Enters from Foreground (60% - 90%)
      if (progress < 0.6) {
        gsap.set(heroImg, { transform: "translateZ(1000px)", opacity: 0 });
      } else if (progress >= 0.6 && progress <= 0.9) {
        const imgProgress = (progress - 0.6) / 0.3;
        const translateZ = 1000 - imgProgress * 1000;
        let opacity = 0;
        if (progress <= 0.8) {
          opacity = (progress - 0.6) / 0.2;
        } else {
          opacity = 1;
        }
        gsap.set(heroImg, {
          transform: `translateZ(${translateZ}px)`,
          opacity: opacity,
        });
      } else {
        gsap.set(heroImg, { transform: "translateZ(0px)", opacity: 1 });
      }
    },
  });
}

// 3. Lifecycle Execution
document.addEventListener("DOMContentLoaded", () => {
  setCanvasSize();
  preloadImages(() => {
    renderFrame(images[0]);
    setupScrollTrigger();
  });
});

// 4. Resize Handling
window.addEventListener("resize", () => {
  setCanvasSize();
  renderFrame(images[videoFrames.frame]);
  ScrollTrigger.refresh();
});
```

### Completion Gate
- [ ] ScrollTrigger pins section for 7x viewport distance.
- [ ] `onUpdate` accurately coordinates frame rendering and CSS transforms.
- [ ] Resize listener refreshes canvas scaling and recalculates ScrollTrigger trigger points.
```

---

### Phase 5: Extraction Summary & Validation

- **Knowledge Units Extracted**: 7 total (4 Principles & Concepts, 3 Procedures).
- **Core Technology Stack**: Vanilla JavaScript, Canvas 2D API, GSAP + ScrollTrigger, Lenis Smooth Scroll, DaVinci Resolve / `sips` CLI.
- **Key Edge Cases Handled**:
  1. *Retina Displays*: Handled through `pixelRatio` multiplier and `context.scale()`.
  2. *Responsive Viewport Scaling*: Handled using manual aspect-ratio comparison math mimicking CSS `object-fit: cover`.
  3. *Loading Deadlocks*: Handled by attaching `onerror` alongside `onload` during image buffer preloading.
  4. *Viewport Resizing*: Handled by combining canvas re-sizing, immediate active frame repaint, and `ScrollTrigger.refresh()`.
