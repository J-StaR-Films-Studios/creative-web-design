---
name: html5-canvas-particle-physics
description: |
  Build interactive, physics-driven particle systems and pixel manipulation visualizers on HTML5 Canvas using pure Vanilla JavaScript.
  Use when:
  - Creating image-to-particle or text-to-particle animations from raster buffers
  - Implementing pixel manipulation, raw buffer extraction (getImageData), or luminance mapping
  - Designing interactive physics with mouse repulsion, elastic spring-back, or constellation line networks
  - Avoiding cross-origin canvas security errors (CORS tainting) with embedded Base64 data pipelines
---

# HTML5 Canvas Particle Physics & Pixel Manipulation

An operational methodology for building high-performance, interactive particle animations driven by image luminance, raster text buffers, and physics force fields on HTML5 Canvas.

## Workflow Pipeline

```
Asset Pipeline → Buffer Extraction → Luminance/Alpha Mapping → Particle Synthesis → Physics & Render Loop
```

---

## Phase 1: Canvas Setup & CORS-Safe Asset Pipeline

Establish an unpolluted 2D context and load image assets without triggering Cross-Origin Resource Sharing (CORS) tainted-canvas security faults.

1. **Configure Canvas DOM & Context**:
   - Match internal pixel dimensions (`canvas.width`, `canvas.height`) exactly to style dimensions to prevent scaling distortion.
   - Extract the 2D rendering context: `const ctx = canvas.getContext('2d')`.

2. **Bypass Cross-Origin Tainting**:
   - Do not load local file paths via `file://` directly into `ctx.getImageData()`.
   - Convert images to Base64 Data URL format (`data:image/png;base64,...`) or run a local HTTP server.

3. **Synchronize Asset Ingestion**:
   - Instantiate `new Image()`, bind the `onload` handler, and assign the `src` attribute.
   - Defer all canvas drawing and buffer extraction procedures until the `onload` callback fires.

### Completion Gate
- [ ] Canvas buffer dimensions match render display dimensions 1:1.
- [ ] Asset loads via Base64 Data URL or CORS-enabled HTTP pipeline.
- [ ] Context operations execute inside or after asset `onload` resolution.

---

## Phase 2: Buffer Extraction & Luminance Grid Mapping

Extract raw 1D pixel buffers and structure them into accessible 2D spatial maps for brightness and color.

For mathematical definitions and luminance formulas, see [pixel-math.md](references/pixel-math.md).

1. **Extract Linear Pixel Buffer**:
   - Render the asset: `ctx.drawImage(image, 0, 0, width, height)`.
   - Extract raw `ImageData`: `const pixels = ctx.getImageData(0, 0, width, height)`.
   - Note: The returned `pixels.data` is a 1D `Uint8ClampedArray` with 4 values ($R, G, B, A$) per pixel.

2. **Deconstruct Buffer into Spatial Grid**:
   - Iterate vertical rows $y \in [0, \text{height})$ and horizontal columns $x \in [0, \text{width})$.
   - Compute 1D buffer index:
     $$\text{index} = (y \times 4 \times \text{width}) + (x \times 4)$$
   - Extract RGBA channels:
     ```javascript
     const red   = pixels.data[index];
     const green = pixels.data[index + 1];
     const blue  = pixels.data[index + 2];
     const alpha = pixels.data[index + 3];
     ```

3. **Calculate Relative Perceived Luminance**:
   - Calculate luminance using weighted photometric sensitivity:
     $$\text{brightness} = \frac{\sqrt{0.299 \cdot R^2 + 0.587 \cdot G^2 + 0.114 \cdot B^2}}{100}$$
   - Construct a 2D matrix `mappedImage[y][x]` storing `{ cellBrightness, cellColor }`.

### Completion Gate
- [ ] Pixel buffer successfully extracted into `Uint8ClampedArray`.
- [ ] 1D index calculation correctly includes the $4 \times \text{width}$ stride factor.
- [ ] Spatial 2D matrix `mappedImage[y][x]` is fully populated with normalized brightness and color strings.

---

## Phase 3: Particle Population & Anchor Memory

Generate particle instances equipped with fixed anchor memory for spring-back recovery.

1. **Define Particle Model**:
   - Create a `Particle` class storing dynamic state (`x`, `y`, `speed`, `velocity`, `size`) and immutable anchor state (`baseX`, `baseY`).
   - Assign randomized density/mass ($1 \le \text{density} \le 30$) to diversify inertia across particles.

2. **Select Particle Generation Mode**:
   - **Mode A: Flow / Rain Particles**: Spawn $N$ particles at randomized $x$ positions and top boundary ($y=0$).
   - **Mode B: Rasterized Text / Image Particles**: Scan `ImageData`. If $\text{alpha} > 128$, spawn a particle at $(x \cdot \text{scale}, y \cdot \text{scale})$ and lock `baseX = x * scale`, `baseY = y * scale`.

3. **Clear Sampling Buffer**:
   - Once particle coordinates are captured, call `ctx.clearRect(0, 0, canvas.width, canvas.height)` to erase raw raster imagery before beginning the animation loop.

### Completion Gate
- [ ] Particle objects contain immutable anchor coordinates `(baseX, baseY)`.
- [ ] Raster text/image buffer cleared from visual canvas.
- [ ] Master `particleArray` initialized with populated particle instances.

---

## Phase 4: Physics Simulation & Interactive Force Fields

Implement mouse proximity detection, directional repulsion, speed modulation, and spring return.

1. **Track Mouse Interaction State**:
   - Attach a `mousemove` listener on `window` updating a global `mouse = { x, y, radius }` coordinate tracker.

2. **Calculate Euclidean Vector & Distance**:
   - In each particle's `update()` method:
     $$\text{dx} = \text{mouse.x} - \text{this.x}, \quad \text{dy} = \text{mouse.y} - \text{this.y}$$
     $$\text{distance} = \sqrt{\text{dx}^2 + \text{dy}^2}$$

3. **Apply Repulsion & Distance-Weighted Falloff**:
   - Compute normalized force ratio:
     $$\text{force} = \frac{\text{mouse.radius} - \text{distance}}{\text{mouse.radius}}$$
   - If $\text{distance} < \text{mouse.radius}$:
     $$\text{this.x} -= \left(\frac{\text{dx}}{\text{distance}}\right) \cdot \text{force} \cdot \text{this.density}$$
     $$\text{this.y} -= \left(\frac{\text{dy}}{\text{distance}}\right) \cdot \text{force} \cdot \text{this.density}$$

4. **Apply Spring-Back Return Damping**:
   - If $\text{distance} \ge \text{mouse.radius}$ and particle is displaced from its anchor:
     $$\text{this.x} -= \frac{\text{this.x} - \text{this.baseX}}{\text{dampingFactor}}$$
     $$\text{this.y} -= \frac{\text{this.y} - \text{this.baseY}}{\text{dampingFactor}}$$
   - Use $\text{dampingFactor} \approx 10\text{--}20$ for smooth easing.

5. **Apply Luminance Flow (For Image Flow Systems)**:
   - Ensure particle coordinates are clamped to matrix limits before indexing:
     ```javascript
     const gridY = Math.min(Math.max(Math.floor(this.y), 0), canvas.height - 1);
     const gridX = Math.min(Math.max(Math.floor(this.x), 0), canvas.width - 1);
     const cell = mappedImage[gridY][gridX];
     this.speed = cell.cellBrightness;
     ```
   - Advance vertical movement inversely to brightness: $\text{movement} = (2.55 - \text{this.speed}) + \text{this.velocity}$.

### Completion Gate
- [ ] Coordinates clamped before indexing into `mappedImage` to prevent `undefined` runtime errors.
- [ ] Particles within `mouse.radius` repel away from cursor.
- [ ] Particles outside force field return smoothly to `baseX, baseY`.

---

## Phase 5: Rendering Loop & Constellation Linking

Execute recursive frame animation, trailing effects, and proximity line networks.

1. **Manage Frame Refresh & Trails**:
   - **For Clean Redraws**: Call `ctx.clearRect(0, 0, canvas.width, canvas.height)` every frame.
   - **For Particle Decay Trails**: Render a full-screen semi-transparent rectangle:
     ```javascript
     ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
     ctx.fillRect(0, 0, canvas.width, canvas.height);
     ```

2. **Render Particle Geometries**:
   - Iterate `particleArray` calling `particle.draw()`.
   - Render as filled circles (`ctx.arc`), stroked rectangles, or typographic glyphs (`ctx.fillText`).

3. **Assemble Constellation Line Web**:
   - Use an upper-triangular pairwise evaluation to connect neighboring particles without duplicate checks:
     ```javascript
     function connect() {
       for (let a = 0; a < particleArray.length; a++) {
         for (let b = a + 1; b < particleArray.length; b++) {
           const dx = particleArray[a].x - particleArray[b].x;
           const dy = particleArray[a].y - particleArray[b].y;
           const dist = Math.sqrt(dx * dx + dy * dy);
           const maxDist = 50;

           if (dist < maxDist) {
             const opacity = 1 - (dist / maxDist);
             ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
             ctx.lineWidth = 1;
             ctx.beginPath();
             ctx.moveTo(particleArray[a].x, particleArray[a].y);
             ctx.lineTo(particleArray[b].x, particleArray[b].y);
             ctx.stroke();
           }
         }
       }
     }
     ```

4. **Drive Animation Loop**:
   - Recursively schedule frames using `requestAnimationFrame(animate)`.

For complete reference implementations and worked examples, see [examples.md](references/examples.md).

### Completion Gate
- [ ] `requestAnimationFrame` maintains steady 60 FPS animation loop.
- [ ] Pairwise constellation loop avoids redundant comparisons via $b = a + 1$ initialization.
- [ ] Line opacity smoothly fades to zero at maximum connection radius.
