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
