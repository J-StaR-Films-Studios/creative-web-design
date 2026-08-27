# Canvas 2D & Particle Physics Systems

A rigorous reference for building high-performance 2D Canvas graphics, raster buffer extraction, perceived luminance analysis, interactive force fields, elastic spring-back anchor memory, and the signature sand/dust text particle decomposition algorithm.

---

## 1. 1D Flattened Buffer & Stride Arithmetic

An HTML5 Canvas of dimensions $W \times H$ yields an `ImageData.data` array of length $W \times H \times 4$. Pixels are stored contiguously in row-major order with 4 byte values ($R, G, B, A \in [0, 255]$) per pixel coordinate $(x, y)$.

```
Pixel Array Layout:
Index:   [0, 1, 2, 3,   4, 5, 6, 7,   8, 9, 10, 11, ...]
Channel: [R, G, B, A,   R, G, B, A,   R, G, B,  A,  ...]
Coords:  (0, 0)         (1, 0)        (2, 0)
```

### Stride Calculation
$$\text{Index}_{\text{Red}}(x, y) = (y \times 4 \times W) + (x \times 4)$$
$$\text{Index}_{\text{Green}}(x, y) = \text{Index}_{\text{Red}} + 1$$
$$\text{Index}_{\text{Blue}}(x, y) = \text{Index}_{\text{Red}} + 2$$
$$\text{Index}_{\text{Alpha}}(x, y) = \text{Index}_{\text{Red}} + 3$$

---

## 2. Photometric Perceived Luminance Formulas

Do not use simple arithmetic means $\frac{R+G+B}{3}$ for optical brightness calculations, as the human eye is significantly more sensitive to green wavelengths than red or blue.

### Weighted Human Perception Formula
$$\text{Luminance}_{\text{weighted}} = \frac{\sqrt{0.299 \cdot R^2 + 0.587 \cdot G^2 + 0.114 \cdot B^2}}{100}$$

```javascript
export function calculatePhotometricLuminance(r, g, b) {
  return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) / 100;
}
```

---

## 3. Particle Physics & Force Field Mathematics

### A. Distance & Radial Proximity
Given particle position $(x_p, y_p)$ and target/cursor position $(x_c, y_c)$:
$$\Delta x = x_c - x_p, \quad \Delta y = y_c - y_p$$
$$\text{Distance} = \sqrt{\Delta x^2 + \Delta y^2} = \text{Math.hypot}(\Delta x, \Delta y)$$

### B. Directional Repulsion with Linear Falloff
When $\text{Distance} < \text{Radius}_{\text{max}}$:
$$\text{ForceScalar} = \frac{\text{Radius}_{\text{max}} - \text{Distance}}{\text{Radius}_{\text{max}}}$$
$$\text{UnitVector}_x = \frac{\Delta x}{\text{Distance}}, \quad \text{UnitVector}_y = \frac{\Delta y}{\text{Distance}}$$
$$\Delta x_{\text{repel}} = -\text{UnitVector}_x \cdot \text{ForceScalar} \cdot \text{Density}$$
$$\Delta y_{\text{repel}} = -\text{UnitVector}_y \cdot \text{ForceScalar} \cdot \text{Density}$$

### C. Elastic Spring-Back Return Easing
When $\text{Distance} \ge \text{Radius}_{\text{max}}$ and the particle is displaced from its anchor $(x_{\text{base}}, y_{\text{base}})$:
$$x_{t+1} = x_t - \frac{x_t - x_{\text{base}}}{\text{dampingFactor}}$$
$$y_{t+1} = y_t - \frac{y_t - y_{\text{base}}}{\text{dampingFactor}}$$
*Recommended damping factor:* $\text{dampingFactor} \in [10.0, 20.0]$.

---

## 4. The Signature Sand/Dust Text Particle Decomposition Algorithm

This algorithm renders high-resolution text onto an offscreen canvas buffer, samples non-transparent pixels, instantiates particles with immutable anchor memory, and simulates kinetic scattering under cursor force fields with automatic spring reconstruction.

```javascript
export class SandTextParticleEngine {
  constructor(canvas, text, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.text = text;
    this.options = {
      fontSize: options.fontSize || 80,
      fontFamily: options.fontFamily || 'Arial, sans-serif',
      color: options.color || '#ffffff',
      particleSize: options.particleSize || 2,
      densityGap: options.densityGap || 3, // Sample every Nth pixel
      mouseRadius: options.mouseRadius || 120,
      dampingFactor: options.dampingFactor || 14,
      ...options,
    };

    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: this.options.mouseRadius };
    this.rafId = null;

    this.init();
  }

  init() {
    this.setupViewport();
    this.bindEvents();
    this.sampleTextBuffer();
    this.startRenderLoop();
  }

  setupViewport() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
      this.setupViewport();
      this.sampleTextBuffer();
    });
  }

  sampleTextBuffer() {
    this.particles = [];

    // 1. Create offscreen scratch canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = this.width;
    offscreen.height = this.height;
    const offCtx = offscreen.getContext('2d');

    // 2. Render crisp typographic target
    offCtx.fillStyle = '#ffffff';
    offCtx.font = `bold ${this.options.fontSize}px ${this.options.fontFamily}`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(this.text, this.width / 2, this.height / 2);

    // 3. Extract 1D raw buffer
    const imageData = offCtx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    const gap = this.options.densityGap;

    // 4. Stride scan raster coordinates
    for (let y = 0; y < this.height; y += gap) {
      for (let x = 0; x < this.width; x += gap) {
        const index = (y * 4 * this.width) + (x * 4);
        const alpha = data[index + 3];

        if (alpha > 128) {
          // Spawn particle with immutable resting coordinates
          this.particles.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            size: this.options.particleSize,
            density: Math.random() * 20 + 5,
            color: this.options.color,
          });
        }
      }
    }
  }

  updateAndDraw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const radius = this.mouse.radius;
    const damping = this.options.dampingFactor;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Proximity vector
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        // Radial repulsion
        const force = (radius - dist) / radius;
        const dirX = dx / dist;
        const dirY = dy / dist;

        p.x -= dirX * force * p.density;
        p.y -= dirY * force * p.density;
      } else {
        // Elastic spring-back recovery
        if (p.x !== p.baseX) {
          p.x -= (p.x - p.baseX) / damping;
        }
        if (p.y !== p.baseY) {
          p.y -= (p.y - p.baseY) / damping;
        }
      }

      // Draw particle
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  startRenderLoop() {
    const loop = () => {
      this.updateAndDraw();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.particles = [];
  }
}
```

---

## 5. Constellation Proximity Networks & $O(N^2/2)$ Optimization

When connecting free particles with dynamic line links, use upper-triangular evaluation ($b = a + 1$) to eliminate redundant comparisons.

```javascript
export function drawConstellationWeb(ctx, particles, maxDistance = 70, strokeColor = 'rgba(255, 255, 255,') {
  const len = particles.length;

  for (let a = 0; a < len; a++) {
    const pA = particles[a];
    for (let b = a + 1; b < len; b++) {
      const pB = particles[b];
      const dx = pA.x - pB.x;
      const dy = pA.y - pB.y;
      const dist = Math.hypot(dx, dy);

      if (dist < maxDistance) {
        const alpha = (1 - dist / maxDistance).toFixed(3);
        ctx.strokeStyle = `${strokeColor}${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
      }
    }
  }
}
```
