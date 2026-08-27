# Canvas 2D Buffers, Particle Physics & Pixel Manipulation

A comprehensive guide to building interactive 2D canvas particle systems, pixel-buffer extraction, luminance mapping, and the sand/dust typographic decomposition-reconstruction engine.

---

## 1. High-DPI Canvas Initialization & DPR Scaling

Prevent blurred rendering on High-DPI / Retina screens by multiplying the internal canvas pixel resolution while maintaining CSS display bounds.

```javascript
function initializeCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Clamp to 2x maximum

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  // Scale context coordinate transformations to match CSS pixel coordinates
  ctx.scale(dpr, dpr);

  return { ctx, dpr, width: window.innerWidth, height: window.innerHeight };
}
```

---

## 2. 1D-to-2D Pixel Buffer Extraction & Luminance Math

Extracting `ImageData` produces a linear 1D `Uint8ClampedArray` containing sequential $R, G, B, A$ values ($0\text{--}255$) for every pixel in row-major order.

### Linear Stride Formula
For any pixel at horizontal coordinate $x$ and vertical coordinate $y$:

$$\text{Index} = (y \times 4 \times \text{width}) + (x \times 4)$$

```
Byte 0: Red    | Byte 1: Green  | Byte 2: Blue   | Byte 3: Alpha
Index + 0      | Index + 1      | Index + 2      | Index + 3
```

### Relative Perceived Luminance (ITU-R BT.601)
Human vision perceives green light with significantly higher intensity than red or blue. Calculate photometric brightness:

$$\text{Brightness} = \frac{\sqrt{0.299 \cdot R^2 + 0.587 \cdot G^2 + 0.114 \cdot B^2}}{100}$$

```javascript
function extractLuminanceGrid(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const grid = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const index = (y * 4 * width) + (x * 4);
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      const brightness = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) / 100;
      row.push({ brightness, r, g, b, a });
    }
    grid.push(row);
  }
  return grid;
}
```

---

## 3. Sand / Dust Text Particle Decomposition Algorithm

The sand/dust typography effect rasterizes text, samples active alpha pixels into anchored particles, applies cursor-driven dispersion physics, and recovers typography through elastic spring forces.

### Step-by-Step Execution Sequence

```
1. Render Typography to Buffer → 2. Sample Alpha Stride (A > 128) → 3. Instantiate Anchored Particles → 4. Clear Raster Buffer → 5. Run Physics & Spring Recovery Loop
```

### Complete Implementation Blueprint

```javascript
class TextParticle {
  constructor(x, y, color = '#ffffff') {
    // Current dynamic physics position
    this.x = x + (Math.random() - 0.5) * 50; // Slight initial jitter
    this.y = y + (Math.random() - 0.5) * 50;
    this.vx = 0;
    this.vy = 0;
    
    // Immutable Anchor Memory (Resting Home State)
    this.baseX = x;
    this.baseY = y;

    // Physical characteristics
    this.size = Math.random() * 1.5 + 1.0;
    this.density = Math.random() * 20 + 10; // Mass / resistance factor
    this.color = color;
    this.friction = 0.92;
    this.springFactor = 0.08;
  }

  update(mouse) {
    // 1. Calculate vector and Euclidean distance to cursor
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 2. Interactive Force Field (Repulsion)
    if (distance < mouse.radius && distance > 0) {
      const force = (mouse.radius - distance) / mouse.radius; // 1.0 at center, 0.0 at boundary
      const normalX = dx / distance;
      const normalY = dy / distance;

      // Accelerate particle away from cursor proportional to density
      this.vx -= normalX * force * this.density;
      this.vy -= normalY * force * this.density;
    }

    // 3. Elastic Spring-Back Recovery (Hooke's Law Damping)
    const springDx = this.baseX - this.x;
    const springDy = this.baseY - this.y;
    
    this.vx += springDx * this.springFactor;
    this.vy += springDy * this.springFactor;

    // 4. Apply Friction & Integrate Velocity
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class TextParticleSystem {
  constructor(canvas, text = 'CREATIVE') {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.text = text;
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: 120 };

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.init();
  }

  init() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // Render source text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 120px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.text, width / 2, height / 2);

    // Extract raster buffer
    const textCoordinates = this.ctx.getImageData(0, 0, width, height);
    this.particles = [];

    // Sample pixel grid at 4px stride for optimal 60fps performance
    const step = 4;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * 4 * width) + (x * 4);
        const alpha = textCoordinates.data[index + 3];

        if (alpha > 128) {
          this.particles.push(new TextParticle(x, y, '#ffffff'));
        }
      }
    }

    // Clear raw raster text from canvas before beginning physics loop
    this.ctx.clearRect(0, 0, width, height);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.mouse);
      this.particles[i].draw(this.ctx);
    }

    requestAnimationFrame(this.animate.bind(this));
  }
}
```

---

## 4. Constellation Proximity Networks ($O(N^2/2)$ Optimization)

Connect nearby particles with dynamic lines. Standard nested loops cause duplicate calculations ($N^2$). Initialize inner loop at $j = i + 1$ to cut comparisons in half:

```javascript
function renderConstellation(particles, ctx, maxDistance = 60) {
  const count = particles.length;

  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distSquared = dx * dx + dy * dy;
      const maxDistSquared = maxDistance * maxDistance;

      // Avoid expensive Math.sqrt until proximity is confirmed
      if (distSquared < maxDistSquared) {
        const distance = Math.sqrt(distSquared);
        const opacity = 1.0 - (distance / maxDistance);

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}
```

---

## 5. Trigonometric Flow Fields (Zero-Matrix Overhead)

Compute continuous vector flow fields using direct trigonometric coordinate arithmetic instead of costly `ctx.save()`, `ctx.translate()`, `ctx.rotate()`, `ctx.restore()` matrix stacks.

```javascript
function drawFlowField(ctx, width, height, time, cellSize = 20) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      // Calculate continuous angle from trigonometric wave interference
      const angle = (Math.cos(x * 0.005 + time) + Math.sin(y * 0.005 + time)) * Math.PI;
      const length = cellSize * 0.8;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      );
      ctx.stroke();
    }
  }
}
```
