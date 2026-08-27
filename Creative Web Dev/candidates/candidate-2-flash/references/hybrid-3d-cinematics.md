# Hybrid 3D Cinematics & Asset Baking Pipelines

An engineering guide to the ORYZO AI / Superlocal hybrid architectural paradigm: combining pre-rendered, ray-traced cinematic image sequences on HTML5 Canvas with synchronized real-time WebGL/Three.js interactive overlays.

---

## 1. The Hybrid Architectural Paradigm

Real-time browser graphics face hard GPU computational budgets (geometry complexity, volumetric lighting, path tracing, subsurface scattering). The hybrid paradigm solves this by splitting visual layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│ TOP LAYER: DOM / Kinetic Typography / HTML Spec Callouts (GSAP)        │
├────────────────────────────────────────────────────────────────────────┤
│ MIDDLE LAYER: Real-time WebGL Interactive Overlays (Three.js / Shaders)│
├────────────────────────────────────────────────────────────────────────┤
│ BASE LAYER: Pre-rendered Ray-Traced Image Sequence (HTML5 2D Canvas)   │
└────────────────────────────────────────────────────────────────────────┘
```

- **Base Layer (Canvas 2D)**: Renders photorealistic, ray-traced lighting and complex camera motion pre-baked offline in Blender Cycles at 60 FPS without GPU strain.
- **Middle Layer (WebGL/Three.js)**: Renders only responsive, interactive elements (cursor magnetic particles, dynamic text distortion, floating interactive 3D accessories).
- **Top Layer (DOM)**: Renders accessible, SEO-indexed kinetic typography and UI controls.

---

## 2. Sequence Extraction & Frame Encoding

### Why Never Scrub Native `<video>` Elements
Native `<video>` elements depend on temporal keyframe compression (H.264/H.265 GOP structures). Scrubbing `<video>.currentTime` causes frame drops, decoding latency, and severe visual stutter. Preloading an array of sequential image frames (`.jpg`/`.webp`) and painting to a 2D canvas guarantees frame-accurate, instantaneous rendering.

### Batch Extraction Commands
Export your 3D animation from Blender Cycles as an image sequence. Batch-convert and optimize the frames using `ffmpeg` or ImageMagick:

```bash
# Convert image sequence to optimized WebP / JPEG with 4-digit zero padding
ffmpeg -i input_sequence_%04d.png -q:v 80 -vf scale=1920:1080 frames/frame_%04d.jpg
```

---

## 3. High-Performance Canvas Image Sequence Scrubbing Engine

This engine preloads extracted frames into memory, scales resolution for high-DPI displays, calculates dynamic `object-fit: cover` aspect ratio centering, and scrubs frame indices via GSAP ScrollTrigger.

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class CanvasVideoScrubber {
  constructor(canvas, frameConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.totalFrames = frameConfig.totalFrames;
    this.frameUrlPattern = frameConfig.frameUrlPattern; // e.g., (index) => `/frames/frame_${String(index).padStart(4, '0')}.jpg`
    
    this.images = [];
    this.currentFrame = { index: 0 };
    this.isLoaded = false;

    this.init();
  }

  async init() {
    this.setupResolution();
    await this.preloadAllFrames();
    this.bindScrollTrigger();
    this.renderFrame(0);

    window.addEventListener('resize', () => {
      this.setupResolution();
      this.renderFrame(Math.round(this.currentFrame.index));
    });
  }

  setupResolution() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
  }

  preloadAllFrames() {
    return new Promise((resolve) => {
      let loadedCount = 0;
      for (let i = 0; i < this.totalFrames; i++) {
        const img = new Image();
        img.src = this.frameUrlPattern(i + 1);
        img.onload = () => {
          loadedCount++;
          if (loadedCount === this.totalFrames) {
            this.isLoaded = true;
            resolve();
          }
        };
        this.images.push(img);
      }
    });
  }

  // Calculate object-fit: cover coordinates
  renderFrame(frameIndex) {
    const img = this.images[frameIndex];
    if (!img) return;

    const canvasRatio = this.width / this.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawWidth = this.width;
      drawHeight = this.width / imgRatio;
      drawX = 0;
      drawY = (this.height - drawHeight) / 2;
    } else {
      drawWidth = this.height * imgRatio;
      drawHeight = this.height;
      drawX = (this.width - drawWidth) / 2;
      drawY = 0;
    }

    this.ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }

  bindScrollTrigger() {
    gsap.to(this.currentFrame, {
      index: this.totalFrames - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: this.canvas.parentElement,
        start: 'top top',
        end: '+=400%', // 400vh scroll travel
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: () => {
          const targetIndex = Math.min(
            this.totalFrames - 1,
            Math.max(0, Math.round(this.currentFrame.index))
          );
          this.renderFrame(targetIndex);
        },
      },
    });
  }
}
```

---

## 4. Synchronizing Real-Time WebGL Overlays

To overlay interactive 3D particles or cursor-reactive meshes over the pre-rendered video sequence:

1. Position the WebGL canvas directly over the 2D frame canvas using `position: absolute; inset: 0; pointer-events: none;`.
2. Configure the Three.js camera position to match the exact Blender camera trajectory exported at keyframe milestones.
3. Synchronize both timelines using the identical GSAP ScrollTrigger master progress:

```javascript
// Synchronized Master Scroll Orchestrator
ScrollTrigger.create({
  trigger: '.hybrid-container',
  start: 'top top',
  end: '+=400%',
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    const p = self.progress;
    // 1. Scrub Canvas Frames (0.0 to 1.0)
    videoScrubber.renderFrame(Math.floor(p * (totalFrames - 1)));

    // 2. Drive WebGL Interactive Overlay Camera
    threeCamera.position.z = 5.0 - p * 2.0;
    threeCamera.rotation.y = p * Math.PI * 0.5;

    // 3. Drive Kinetic DOM Overlays
    gsap.set('.hero-title', { opacity: 1 - p * 3 });
  },
});
```
