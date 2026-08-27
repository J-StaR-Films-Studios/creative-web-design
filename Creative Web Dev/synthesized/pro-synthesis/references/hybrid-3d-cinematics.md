# Hybrid 3D Cinematics & Asset Baking Pipelines

An operational blueprint for the hybrid creative development paradigm (ORYZO AI / Superlocal / Apple style), combining pre-rendered Blender CGI image sequence scrubbing with real-time WebGL interactive meshes and 3D perspective DOM overlays.

---

## 1. The Hybrid Architectural Paradigm

Top-tier creative studios achieve cinematic photorealism on the web without crashing client GPUs by separating visual responsibilities:

```
[Offline Blender / CGI Engine] → High-Resolution Raytracing, Global Illumination & Volumetrics
                                       ↓ (Export Sequence)
[Canvas 2D Scrub Engine]       → 60 FPS Preloaded In-Memory Frame Playback (Zero GPU cost)
                                       +
[Three.js / WebGL Layer]       → Real-Time Interactive 3D Meshes, Cursor Lighting & Shaders
                                       +
[3D Perspective DOM Layer]     → Accessible Kinetic Typography, Buttons & Feature Tooltips
```

---

## 2. Blender Production & Asset Baking Workflow

### Camera & Lightmap Baking Rules
1. **Camera Parameter Alignment**: Lock Blender camera Focal Length (e.g. 50mm) and sensor size. Calculate matching Three.js PerspectiveCamera FOV:
   $$\text{FOV} = 2 \cdot \arctan\left(\frac{\text{SensorHeight}}{2 \cdot \text{FocalLength}}\right) \cdot \left(\frac{180}{\pi}\right)$$
2. **Texture Light Baking**: In Blender Cycles, bake indirect lighting, ambient occlusion, and shadows into a 32-bit float diffuse map (`Bake Type: Combined / Diffuse`). This allows real-time Three.js models to run on lightweight `MeshBasicMaterial`.
3. **Sequence Export & Compression**:
   - Export numbered uncompressed TIFF frames: `frame_0001.tif` to `frame_0200.tif`.
   - Batch-convert to optimized 85% quality JPEG or WebP via CLI:
     ```bash
     # FFmpeg batch conversion to high-quality WebP
     ffmpeg -i frame_%04d.tif -q:v 80 -vf "scale=1920:1080" frame_%04d.webp
     ```

---

## 3. In-Memory Canvas Image Sequence Scrub Engine

Never scrub HTML5 `<video>` tags directly on scroll events. Video decoders cannot scrub backward and forward at 60 FPS without dropped frames. Preload discrete frames into memory.

### Canvas Aspect Ratio Containment (`object-fit: cover` Math)

```javascript
function renderCanvasCoverFrame(ctx, img, canvasWidth, canvasHeight) {
  if (!img || !img.complete || img.naturalWidth === 0) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, drawX, drawY;

  if (imgAspect > canvasAspect) {
    drawHeight = canvasHeight;
    drawWidth = canvasHeight * imgAspect;
    drawX = (canvasWidth - drawWidth) / 2;
    drawY = 0;
  } else {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgAspect;
    drawX = 0;
    drawY = (canvasHeight - drawHeight) / 2;
  }

  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}
```

### Preloading & ScrollTrigger Scrub Synchronization

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

class CinematicSequenceScrubber {
  constructor(canvas, frameCount, frameUrlGenerator) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.frameCount = frameCount;
    this.frameUrlGenerator = frameUrlGenerator;
    this.images = [];
    this.currentFrame = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.initCanvasSize();
    this.preloadFrames(() => this.setupScrollTimeline());
  }

  initCanvasSize() {
    this.canvas.width = window.innerWidth * this.dpr;
    this.canvas.height = window.innerHeight * this.dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  preloadFrames(onComplete) {
    let loadedCount = 0;
    const total = this.frameCount;

    for (let i = 0; i < total; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === total) onComplete();
      };
      img.onerror = () => {
        loadedCount++; // Prevent deadlock on individual asset failure
        if (loadedCount === total) onComplete();
      };
      img.src = this.frameUrlGenerator(i);
      this.images.push(img);
    }
  }

  setupScrollTimeline() {
    // Paint initial frame
    renderCanvasCoverFrame(this.ctx, this.images[0], window.innerWidth, window.innerHeight);

    ScrollTrigger.create({
      trigger: '.cinematic-hero-section',
      start: 'top top',
      end: () => `+=${window.innerHeight * 5}`,
      pin: true,
      scrub: 1.0,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Complete frame sequence at 90% progress to allow breathing room for unpinning
        const animProgress = Math.min(self.progress / 0.9, 1.0);
        const frameIndex = Math.floor(animProgress * (this.frameCount - 1));

        if (frameIndex !== this.currentFrame && this.images[frameIndex]) {
          this.currentFrame = frameIndex;
          renderCanvasCoverFrame(
            this.ctx,
            this.images[frameIndex],
            window.innerWidth,
            window.innerHeight
          );
        }
      }
    });
  }
}
```

---

## 4. Layered 3D Perspective DOM Structure

Stack kinetic DOM elements in 3D coordinate space above the canvas background to construct depth.

### CSS Layout & Perspective Setup

```css
.cinematic-hero-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.cinematic-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.perspective-overlay-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  perspective: 1000px;
  transform-style: preserve-3d;
  pointer-events: none;
}

.hero-headline {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(0px);
  will-change: transform, opacity;
}

.feature-callout {
  position: absolute;
  bottom: 20%;
  right: 15%;
  transform: translateZ(800px); /* Positioned deep in foreground */
  opacity: 0;
  will-change: transform, opacity;
}
```

### Synchronized DOM Scrub Timeline

```javascript
function bindPerspectiveDOMTimeline(scrollTriggerInstance) {
  const headline = document.querySelector('.hero-headline');
  const callout = document.querySelector('.feature-callout');

  // Push headline backward into distance (0% - 30% progress)
  gsap.to(headline, {
    transform: 'translate(-50%, -50%) translateZ(-600px)',
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.cinematic-hero-section',
      start: 'top top',
      end: '+=150%',
      scrub: true
    }
  });

  // Pull feature callout forward into view (50% - 85% progress)
  gsap.fromTo(
    callout,
    { transform: 'translateZ(800px)', opacity: 0 },
    {
      transform: 'translateZ(0px)',
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.cinematic-hero-section',
        start: 'top -150%',
        end: '+=200%',
        scrub: true
      }
    }
  );
}
```
