# Canvas 2D, Particle Physics & Raster Manipulation

An engineering reference for building interactive particle systems, raster image/text decomposition, physics force fields, and trigonometric flow grids on HTML5 Canvas.

---

## 1. High-DPI Canvas Backing Scale & Context Configuration

Ensure pixel-perfect rendering across Retina and High-DPI screens without visual blurriness or layout distortion.

```javascript
export function configureHighDPICanvas(canvas, width, height) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Clamp to max 2x for GPU performance

  // Set internal display buffer dimensions
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  // Set CSS display layout dimensions
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Scale context operations to match logical coordinate system
  ctx.scale(dpr, dpr);

  return { ctx, dpr };
}
```

---

## 2. 1D-to-2D Stride Arithmetic & Perceived Luminance

The `ctx.getImageData()` API returns a 1D `Uint8ClampedArray` containing sequential RGBA pixel data. Address 2D coordinates $(x, y)$ using the stride formula:

$$\text{Index} = (y \times 4 \times \text{width}) + (x \times 4)$$

```
Pixel (x, y) ──► [ Index + 0 : Red   ]
              ──► [ Index + 1 : Green ]
              ──► [ Index + 2 : Blue  ]
              ──► [ Index + 3 : Alpha ]
```

### Luminance Photometric Weighting

Human retinal cones perceive green light significantly brighter than red or blue. Calculate perceived luminance using standard ITU-R BT.709 coefficients:

$$\text{Luminance} = \frac{\sqrt{0.299 \cdot R^2 + 0.587 \cdot G^2 + 0.114 \cdot B^2}}{100}$$

```javascript
export function extractLuminanceGrid(ctx, width, height) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const grid = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * 4 * width) + (x * 4);
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      const brightness = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
      ) / 100;

      row.push({
        brightness,
        color: `rgba(${r}, ${g}, ${b}, ${a / 255})`,
        alpha: a,
      });
    }
    grid.push(row);
  }
  return grid;
}
```

---

## 3. Sand / Dust Typography Decomposition Architecture

Decompose typographical glyphs into thousands of interactive particles equipped with immutable anchor memory.

```
[Draw Text to Offscreen Canvas]
               │
               ▼
[Extract Raw Uint8ClampedArray Buffer]
               │
               ▼
[Scan Grid at Sampling Stride (Step: 2-4px)]
               │
               ▼ (if Alpha > 128)
[Instantiate Particle(x, y) with Anchor(baseX, baseY)]
               │
               ▼
[Clear Buffer & Run Interactive Physics RAF Loop]
```

### Complete Typography Particle Class

```javascript
export class TextParticle {
  constructor(x, y, color = '#ffffff', size = 2) {
    // Dynamic Simulation State
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.color = color;

    // Immutable Anchor State
    this.baseX = x;
    this.baseY = y;

    // Physical Properties
    this.density = Math.random() * 20 + 5; // Mass / inertia coefficient
    this.friction = 0.92;
    this.ease = 0.08; // Spring recovery stiffness
  }

  update(mouse) {
    // 1. Calculate Vector to Cursor
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distanceSq = dx * dx + dy * dy;
    const radiusSq = mouse.radius * mouse.radius;

    // 2. Cursor Repulsion Force Field
    if (distanceSq < radiusSq) {
      const distance = Math.sqrt(distanceSq);
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const maxDistance = mouse.radius;
      const force = (maxDistance - distance) / maxDistance;

      const repulsionX = forceDirectionX * force * this.density;
      const repulsionY = forceDirectionY * force * this.density;

      this.vx -= repulsionX;
      this.vy -= repulsionY;
    }

    // 3. Elastic Spring Return to Anchor Memory
    const returnForceX = (this.baseX - this.x) * this.ease;
    const returnForceY = (this.baseY - this.y) * this.ease;

    this.vx += returnForceX;
    this.vy += returnForceY;

    // 4. Apply Velocity with Friction Damping
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}
```

### Typography Rasterization & Particle Synthesis Pipeline

```javascript
export function rasterizeTextToParticles(text, width, height, options = {}) {
  const {
    font = '900 120px Inter, sans-serif',
    step = 3, // Sampling stride (lower = denser particles)
    particleSize = 1.5,
    color = '#ffffff',
  } = options;

  // 1. Create Offscreen Canvas
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d');

  // 2. Render Typographic Glyphs
  offCtx.fillStyle = '#ffffff';
  offCtx.font = font;
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillText(text, width / 2, height / 2);

  // 3. Extract Pixel Buffer
  const imgData = offCtx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const particles = [];

  // 4. Sample Non-Transparent Pixels
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alphaIdx = (y * 4 * width) + (x * 4) + 3;
      const alpha = data[alphaIdx];

      if (alpha > 128) {
        particles.push(new TextParticle(x, y, color, particleSize));
      }
    }
  }

  return particles;
}
```

---

## 4. Upper-Triangular Constellation Line Optimization

When connecting proximity lines between $N$ particles, standard nested loops execute $N^2$ iterations. By starting the inner loop at $b = a + 1$, iterations are reduced by $50\%$ to $\frac{N(N-1)}{2}$, avoiding duplicate line draws.

```javascript
export function drawConstellationNetwork(ctx, particles, maxDistance = 60) {
  const maxDistSq = maxDistance * maxDistance;
  const len = particles.length;

  for (let a = 0; a < len; a++) {
    const pA = particles[a];

    for (let b = a + 1; b < len; b++) {
      const pB = particles[b];

      const dx = pA.x - pB.x;
      const dy = pA.y - pB.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < maxDistSq) {
        const dist = Math.sqrt(distSq);
        const opacity = 1 - (dist / maxDistance);

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
      }
    }
  }
}
```

---

## 5. Mathematical Vector Flow Fields

Drive particles or drawing heads across trigonometric vector flow fields without expensive matrix operations (`ctx.save()`, `ctx.rotate()`, `ctx.restore()`).

```javascript
export class VectorFlowField {
  #ctx;
  #width;
  #height;
  #cellSize = 20;
  #zoom = 0.005;
  #curve = 4.0;
  #radius = 1.0;
  #vr = 0.01;

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
  }

  update() {
    this.#radius += this.#vr;
    if (this.#radius > 5 || this.#radius < -5) {
      this.#vr *= -1;
    }
  }

  draw() {
    for (let y = 0; y < this.#height; y += this.#cellSize) {
      for (let x = 0; x < this.#width; x += this.#cellSize) {
        // Direct trigonometric angle mapping
        const angle = (Math.cos(x * this.#zoom) + Math.sin(y * this.#zoom)) * this.#radius;
        const length = this.#cellSize * 0.8;

        this.#ctx.strokeStyle = `hsl(${(angle * 60) % 360}, 70%, 60%)`;
        this.#ctx.lineWidth = 1.5;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        // Direct trigonometric endpoint without context matrix transforms
        this.#ctx.lineTo(
          x + Math.cos(angle) * length,
          y + Math.sin(angle) * length
        );
        this.#ctx.stroke();
      }
    }
  }
}
```
