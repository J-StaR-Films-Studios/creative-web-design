# Hybrid 3D Cinematics & Baked Asset Pipelines

An architectural guide for implementing the ORYZO AI and Superlocal Design paradigm: combining offline-rendered Blender cinematics (Cycles/Eevee) with real-time interactive WebGL overlays and 3D DOM transformations.

---

## 1. The Hybrid 3D Paradigm (ORYZO / Superlocal Architecture)

High-end creative websites achieve photorealistic lighting, complex refraction, and cinematic camera choreography by decoupling raw raytracing from real-time GPU computation.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VIEWPORT LAYER STACK                            │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 3: Interactive DOM UI & Kinetic Typography (z-index: 20)         │
│          Buttons, tooltips, navigation, SplitText headlines            │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 2: Real-Time WebGL / Three.js Interactive Overlays (z-index: 10) │
│          Floating glass cards, cursor-reactive shaders, 3D meshes      │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 1: Pinned HTML5 2D Canvas Image-Sequence Scrubber (z-index: 1)   │
│          Offline baked Cycles/Eevee photorealistic lighting & camera   │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
        [Unified GSAP ScrollTrigger Virtual Playhead (0.0 -> 1.0)]
```

### Advantages Over 100% Real-Time WebGL

| Dimension | 100% Real-Time WebGL | Hybrid Baked + Real-Time Engine |
|---|---|---|
| **Lighting Quality** | Simplified PBR / Approximated reflections | True Raytraced Global Illumination (Cycles) |
| **Mobile Performance** | Heavy thermal throttling & battery drain | Lightweight 2D canvas frame draw (solid 60 FPS) |
| **Asset Download** | Massive textures + complex shader compile | Compressed JPG/WebP sequence cached in memory |
| **Interaction Depth** | High | High (Real-time overlays react to cursor & scroll) |

---

## 2. Blender Export & Asset Processing Pipeline

Export 3D camera animations and lighting sequences from Blender as lightweight, sequential image assets.

### Export Configuration in Blender

1. **Resolution**: Set dimensions to $1920 \times 1080$ (Desktop) and $1080 \times 1920$ (Mobile portrait if separate).
2. **Frame Rate**: Export at 24 or 30 FPS.
3. **Format**: Render as PNG or uncompressed TIFF with zero-padded naming (`frame_####.png`).
4. **Target Frame Count**: 150–300 frames per scrollytelling section (provides ultra-smooth scrubbing without bloated memory footprint).

### Batch CLI Image Conversion

Convert raw frames to optimized JPEGs using CLI tools:

```bash
# macOS (sips)
for file in frame_*.tif; do sips -s format jpeg "$file" -s formatOptions 82 --out "${file%.tif}.jpg"; done
rm frame_*.tif

# Linux / Windows (ffmpeg)
ffmpeg -i frame_%04d.png -q:v 3 frame_%04d.jpg
rm frame_*.png
```

---

## 3. High-Performance Canvas Image-Sequence Scrubber Engine

Preload the entire frame array into memory and paint the active frame onto an HTML5 2D Canvas using context-level `object-fit: cover` math.

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class CanvasSequenceScrubber {
  constructor(canvas, frameCount, framePathGenerator) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.frameCount = frameCount;
    this.framePathGenerator = framePathGenerator;
    this.images = [];
    this.currentFrameIndex = { value: 0 };

    this.init();
  }

  async init() {
    this.setupCanvasDPI();
    await this.preloadFrames();
    this.bindScrollTrigger();
    this.renderFrame(0);

    window.addEventListener('resize', () => {
      this.setupCanvasDPI();
      this.renderFrame(Math.round(this.currentFrameIndex.value));
    });
  }

  setupCanvasDPI() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  preloadFrames() {
    const promises = [];
    for (let i = 1; i <= this.frameCount; i++) {
      promises.push(
        new Promise((resolve) => {
          const img = new Image();
          img.src = this.framePathGenerator(i);
          img.onload = () => resolve(img);
        })
      );
    }
    return Promise.all(promises).then((loadedImages) => {
      this.images = loadedImages;
    });
  }

  renderFrame(index) {
    const img = this.images[index];
    if (!img) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Mathematical Replication of CSS object-fit: cover
    const hRatio = width / img.width;
    const vRatio = height / img.height;
    const ratio = Math.max(hRatio, vRatio);

    const centerShiftX = (width - img.width * ratio) / 2;
    const centerShiftY = (height - img.height * ratio) / 2;

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShiftX,
      centerShiftY,
      img.width * ratio,
      img.height * ratio
    );
  }

  bindScrollTrigger() {
    gsap.to(this.currentFrameIndex, {
      value: this.frameCount - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-pinned-track',
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1, // Smooth catch-up
        onUpdate: () => {
          this.renderFrame(Math.round(this.currentFrameIndex.value));
        },
      },
    });
  }
}
```

---

## 4. Layering 3D DOM Overlays with Spatial Depth

Superimpose interactive DOM typography and graphic elements over the video scrubber using 3D perspective transforms.

```html
<section class="hero-pinned-track">
  <!-- Layer 1: Background Canvas Scrubber -->
  <canvas id="sequence-canvas"></canvas>

  <!-- Layer 2: 3D Spatial Content Overlays -->
  <div class="spatial-viewport">
    <div class="hero-card card-left">
      <h2>Neural Engine</h2>
      <p>Continuous hardware inference.</p>
    </div>
    <div class="hero-card card-right">
      <h2>Photonic Bus</h2>
      <p>Sub-millisecond data fabric.</p>
    </div>
  </div>
</section>
```

```css
.hero-pinned-track {
  position: relative;
  width: 100vw;
  height: 100svh;
  overflow: hidden;
  background: #000000;
}

#sequence-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.spatial-viewport {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  perspective: 1000px;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: space-around;
  pointer-events: none;
}

.hero-card {
  width: 320px;
  padding: 2rem;
  background: rgba(18, 18, 20, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  color: #ffffff;
  pointer-events: auto;
  will-change: transform, opacity;
}
```

```javascript
// Synchronized Spatial Scrubbing for 3D DOM Overlays
ScrollTrigger.create({
  trigger: '.hero-pinned-track',
  start: 'top top',
  end: '+=400%',
  scrub: 1,
  onUpdate: (self) => {
    const p = self.progress;

    // Left card enters from deep Z-space and rotates into view
    const leftZ = gsap.utils.mapRange(0.1, 0.4, -400, 0, p);
    const leftOpacity = gsap.utils.mapRange(0.1, 0.3, 0, 1, p);
    gsap.set('.card-left', {
      transform: `translate3d(0, 0, ${leftZ}px) rotateY(${gsap.utils.mapRange(0.1, 0.4, 25, 0, p)}deg)`,
      opacity: leftOpacity,
    });

    // Right card enters at secondary milestone
    const rightZ = gsap.utils.mapRange(0.4, 0.7, -400, 0, p);
    const rightOpacity = gsap.utils.mapRange(0.4, 0.6, 0, 1, p);
    gsap.set('.card-right', {
      transform: `translate3d(0, 0, ${rightZ}px) rotateY(${gsap.utils.mapRange(0.4, 0.7, -25, 0, p)}deg)`,
      opacity: rightOpacity,
    });
  },
});
```
