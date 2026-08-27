# Source-to-Skill Compilation Report

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / tutorial walkthrough |
| **Title** | *Creative Coding with HTML5 Canvas & Vanilla JavaScript: Pixel Manipulation, Particle Physics & Constellation Systems* |
| **Authority** | Frank's Laboratory (Creative Coding & Canvas Animation Specialist) |
| **Coverage** | HTML5 Canvas 2D Context, Raw Pixel Extraction (`getImageData`), `Uint8ClampedArray` RGBA layout, Grayscale & Luminance Calculations, Base64 Data URL Asset Embedding (CORS Workaround), Dynamic Particle Systems driven by Image Maps, Physics-based Mouse Repulsion & Return Springs, Canvas Text Sampling to Particles, and Proximity-based Constellation Line Networks. |

### Coverage Assessment & Gaps
- **Gaps Identified**: The tutorial focuses purely on 2D software rendering via `<canvas>` with plain Vanilla JavaScript. WebGL hardware shaders and advanced spatial partitioning (e.g., Quadtrees / Spatial Hashing for $O(N)$ proximity lookups) are omitted in favor of direct $O(N^2)$ and nested loop algorithmic demonstrations.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==========================================
# CONCEPTS
# ==========================================
- id: ku-001
  type: concept
  name: 2D Canvas Context (RenderingContext2D)
  source: src-01, "01:00 - 02:30"
  confidence: high
  definition: >
    The rendering interface obtained from an HTML5 <canvas> element via
    `canvas.getContext('2d')`, exposing methods for rasterizing shapes,
    paths, text, and raw pixel buffers.
  attributes: [fillStyle, strokeStyle, globalAlpha, globalCompositeOperation, drawImage, getImageData, putImageData]
  avoid_terms: [canvas DOM node, webgl engine]
  related: [ku-002, ku-003]

- id: ku-002
  type: concept
  name: Uint8ClampedArray (ImageData Buffer)
  source: src-01, "06:20 - 08:35"
  confidence: high
  definition: >
    A 1D typed array of 8-bit unsigned integers clamped to 0–255, where
    every four contiguous elements represent the Red, Green, Blue, and
    Alpha channels of a single pixel stored row-by-row.
  attributes: [linear 1D layout, 4 values per pixel, index stride of 4]
  avoid_terms: [multidimensional pixel matrix, 2D array]
  related: [ku-004, ku-005]

- id: ku-003
  type: concept
  name: Base64 Data URL Image Embedding
  source: src-01, "08:40 - 10:40"
  confidence: high
  definition: >
    An inline image format (`data:image/png;base64,...`) that embeds
    raster data directly into JavaScript source code, bypassing Cross-Origin
    Resource Sharing (CORS) tainted-canvas security restrictions when
    running from local file systems (`file://`).
  attributes: [zero-network fetch, CORS-safe, self-contained]
  avoid_terms: [image file path, asset loader]
  related: [ku-030]

- id: ku-004
  type: concept
  name: Perceived Relative Luminance (Human Eye Weighting)
  source: src-01, "34:40 - 36:00"
  confidence: high
  definition: >
    A photometric formula calculating perceived brightness by weighting RGB
    channels according to human retinal spectral sensitivity:
    Brightness = sqrt(0.299*R^2 + 0.587*G^2 + 0.114*B^2) / 100.
  attributes: [human color perception, non-linear brightness mapping]
  avoid_terms: [simple RGB average, grayscale average]
  related: [ku-021, ku-022]

- id: ku-005
  type: concept
  name: Constellation Line Network
  source: src-01, "60:00 - 64:00"
  confidence: high
  definition: >
    An algorithmic particle visualizer where pairs of particles within a
    maximum threshold Euclidean distance draw connecting lines with opacity
    inversely proportional to their distance.
  attributes: [O(N^2) pairwise evaluation, dynamic distance-to-opacity interpolation]
  avoid_terms: [node graph, mesh network]
  related: [ku-024]

# ==========================================
# PRINCIPLES
# ==========================================
- id: ku-010
  type: principle
  name: 1D to 2D Pixel Index Arithmetic
  source: src-01, "32:00 - 33:20, 59:30 - 60:30"
  confidence: high
  statement: >
    To access pixel coordinates (x, y) in a 1D clamped array of width W:
    Red = (y * 4 * W) + (x * 4), Green = Red + 1, Blue = Red + 2, Alpha = Red + 3.
  rationale: >
    ImageData buffers are strictly flattened 1D arrays; mapping spatial 2D grid
    coordinates requires row-stride offsets multiplied by 4 color channels.
  applies_to: [ku-020, ku-021, ku-023]

- id: ku-011
  type: principle
  name: Base Coordinate Preservation for Physics Springs
  source: src-01, "75:00 - 76:30, 93:30 - 95:00"
  confidence: high
  statement: >
    Particles displaced by external force fields must preserve immutable base coordinates
    (baseX, baseY) to allow spring-back return damping when the force subsides.
  rationale: >
    Without fixed anchor memory, dynamic repulsion results in permanent particle drift,
    destroying the reconstructed image or text contour.
  applies_to: [ku-023]

- id: ku-012
  type: principle
  name: Trailing Canvas Clearing via Global Alpha
  source: src-01, "23:25 - 24:10, 42:00 - 43:30"
  confidence: high
  statement: >
    Drawing a semi-transparent black rectangle (`fillRect` with low `globalAlpha` or
    rgba fill) over the canvas each frame produces fading particle motion trails.
  rationale: >
    Avoids complete buffer clears (`clearRect`), allowing previous frame renders to decay
    exponentially over successive redraw cycles.
  applies_to: [ku-022]

# ==========================================
# PROCEDURES
# ==========================================
- id: ku-020
  type: procedure
  name: Synchronous Base64 Image Sampling Pipeline
  source: src-01, "02:30 - 06:15, 18:20 - 20:30"
  confidence: high
  goal: Safely load image data and extract raw pixel buffers without CORS faults.
  prerequisites: [Canvas initialized, dimensions matched to image]
  steps:
    - action: Convert target image into a Base64 Data URL string
      criterion: String starts with `data:image/...;base64,`
    - action: Instantiate `new Image()` and attach an `onload` event listener
      criterion: Drawing logic executes only after `onload` triggers
    - action: Set `image.src` to the Base64 data string
      criterion: Image loads locally without network requests
    - action: Draw image onto canvas with `ctx.drawImage(image, 0, 0, width, height)`
      criterion: Canvas displays source image
    - action: Extract pixel buffer via `ctx.getImageData(0, 0, width, height)`
      criterion: Returns ImageData object containing Uint8ClampedArray
  outputs: [ImageData object with raw buffer, canvas width/height matched to asset]
  related: [ku-002, ku-003, ku-030]

- id: ku-021
  type: procedure
  name: Pixel Array Luminance & Color Grid Mapping
  source: src-01, "30:00 - 37:30, 45:30 - 47:00"
  confidence: high
  goal: Deconstruct a 1D ImageData buffer into a 2D structured brightness & color map.
  prerequisites: [ImageData buffer extracted via ku-020]
  steps:
    - action: Initialize outer loop iterating row `y` from 0 to `canvas.height`
      criterion: Iterates through all vertical scanlines
    - action: Initialize inner loop iterating column `x` from 0 to `canvas.width`
      criterion: Iterates through every horizontal pixel per row
    - action: Compute 1D buffer index: `index = (y * 4 * width) + (x * 4)`
      criterion: Extracts Red, Green, Blue, and Alpha components
    - action: Calculate relative brightness using weighted Euclidean photometric equation
      criterion: Returns normalized brightness value (0–2.55)
    - action: Assemble cell object `{ cellBrightness, cellColor }` and push to row array
      criterion: Row holds width-many cell objects
    - action: Push completed row array to master `mappedImage` matrix
      criterion: `mappedImage[y][x]` directly indexes coordinates (x, y)
  outputs: [2D structured array `mappedImage[y][x]` containing brightness & RGB strings]
  related: [ku-004, ku-010]

- id: ku-022
  type: procedure
  name: Luminance-Modulated Particle Rain System
  source: src-01, "20:00 - 27:00, 38:00 - 45:00"
  confidence: high
  goal: Create falling particles whose speed, size, and opacity modulate based on background brightness.
  prerequisites: [`mappedImage` 2D grid created via ku-021]
  steps:
    - action: Define `Particle` class with properties `x`, `y`, `speed`, `velocity`, `size`
      criterion: Class constructor initializes randomized horizontal spawns and top vertical origin
    - action: In `update()`, clamp coordinates and query `mappedImage[floor(y)][floor(x)]`
      criterion: Out-of-bounds array access guard is strictly enforced
    - action: Modulate falling speed inversely or directly to luminance: `movement = (2.55 - brightness) + velocity`
      criterion: Particles accelerate in dark regions and decelerate in light regions
    - action: Update `this.y += movement` and wrap around canvas height
      criterion: Particles exceeding bottom edge reset to top with randomized `x`
    - action: Render particle in `draw()` using sampled `cellColor` or gradient fill
      criterion: Canvas updates particle positions with trailing effects
  outputs: [Self-animating image-reconstructing particle stream]
  related: [ku-011, ku-012]

- id: ku-023
  type: procedure
  name: Physics Repulsion & Spring Return System
  source: src-01, "75:00 - 95:00"
  confidence: high
  goal: Repel particles away from cursor and smoothly spring them back to home coordinates.
  prerequisites: [Mouse event listener tracking `x` and `y`, particles with `baseX`/`baseY`]
  steps:
    - action: Calculate vector delta `dx = mouse.x - this.x` and `dy = mouse.y - this.y`
      criterion: Determines distance components
    - action: Compute Euclidean distance `distance = Math.sqrt(dx * dx + dy * dy)`
      criterion: Yields radial distance to cursor
    - action: Calculate normalized force scalar `force = (maxDistance - distance) / maxDistance`
      criterion: Force equals 1.0 at cursor center, decaying to 0.0 at `maxDistance`
    - action: If `distance < maxDistance`, repel: `this.x -= (dx / distance) * force * this.density`
      criterion: Particle pushes away radially with mass/density weighting
    - action: Else spring back: `this.x -= (this.x - this.baseX) / dampingFactor`
      criterion: Displaced particle returns smoothly to its anchor position
  outputs: [Interactive elastic particle field responding to cursor proximity]
  related: [ku-011]

- id: ku-024
  type: procedure
  name: Raster-to-Particle Text Extraction & Constellation Linking
  source: src-01, "66:00 - 74:00, 100:00 - 119:00"
  confidence: high
  goal: Render offscreen typography, sample alpha pixels, and generate interconnected constellation particle mesh.
  prerequisites: [Canvas 2D context, typography styling parameters]
  steps:
    - action: Rasterize text string using `ctx.fillText(text, x, y)`
      criterion: Text renders onto canvas buffer in high contrast (e.g. white text on transparent canvas)
    - action: Sample bounding box via `ctx.getImageData(0, 0, scanWidth, scanHeight)`
      criterion: Returns pixel buffer containing rendered letterforms
    - action: Iterate scan grid; if alpha channel `data[index + 3] > 128`, instantiate Particle
      criterion: Spawns particle at `(col * scale, row * scale)` with anchor `(baseX, baseY)`
    - action: Clear canvas buffer to erase raw text
      criterion: Raw raster text is removed, leaving only particle data
    - action: Run pairwise nested loops across active particle array
      criterion: Computes pairwise distance between `particleArray[a]` and `particleArray[b]`
    - action: If `distance < connectionRadius`, draw line with dynamic alpha `opacity = 1 - (distance / connectionRadius)`
      criterion: Renders soft constellation web between neighboring particles
  outputs: [Interactive typographic constellation network with elastic particle dynamics]
  related: [ku-005, ku-023]

# ==========================================
# CONSTRAINTS
# ==========================================
- id: ku-030
  type: constraint
  name: Cross-Origin Canvas Tainting Constraint
  source: src-01, "08:40 - 09:30, 27:00 - 28:00"
  confidence: high
  rule: >
    `ctx.getImageData()` will throw a DOMException security error if the source image
    is loaded from an external origin or local file path (`file://`) without a web server.
  scope: Pixel data extraction
  consequence: JavaScript execution terminates and canvas becomes unreadable.
  enforced_by: Base64 data encoding inline or serving assets over local HTTP server.

- id: ku-031
  type: constraint
  name: Strict Integer Array Indexing Boundary Guard
  source: src-01, "48:50 - 51:00, 71:00 - 73:00"
  confidence: high
  rule: >
    When querying coordinate-based lookups in 2D arrays (`mappedImage[y][x]`), all coordinates
    must be floored to integers (`Math.floor`) and strictly bounded between `0` and `dimension - 1`.
  scope: Particle class update methods
  consequence: Floats or out-of-bound indices evaluate to `undefined`, causing `TypeError: Cannot read property of undefined`.
  enforced_by: Explicit boundary check `if (this.y < height && this.x < width)` before array access.
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Environment & Asset Pipeline Initialization
INPUT: Canvas element, asset specification (image Base64 or text string).
STEPS:
  1. Initialize Canvas 2D context (`getContext('2d')`) and sync CSS/canvas element pixel dimensions.
  2. Embed raster asset via Base64 Data URL or render raw typographic string with `fillText`.
  3. Await complete asset load event before invoking raster sampling procedures.
OUTPUT: Rendered raster asset on canvas buffer, ready for extraction.

STAGE 2: Pixel Sampling & Luminance Grid Structuring
INPUT: Canvas buffer with rendered asset.
STEPS:
  1. Extract raw 1D pixel buffer using `ctx.getImageData(0, 0, width, height)`.
  2. Iterate 2D scanlines using index stride arithmetic `(y * 4 * width) + (x * 4)`.
  3. Extract R, G, B, A components and compute perceived relative luminance via weighted photometric formula.
  4. Construct spatial 2D matrix `mappedImage[y][x]` storing luminance and color strings.
OUTPUT: Structured 2D map `mappedImage` and filtered active pixel coordinates.

STAGE 3: Particle Population & Anchor Generation
INPUT: Spatial coordinate array from Stage 2.
STEPS:
  1. Instantiate particle array based on target density or thresholded non-transparent alpha pixels (`alpha > 128`).
  2. Set particle coordinates `(x, y)` and immutable home anchors `(baseX, baseY)`.
  3. Assign randomized density/mass for variable inertia response.
OUTPUT: Populated `particleArray` with immutable spatial anchors.

STAGE 4: Physics, Luminance Flow & Interactive Repulsion
INPUT: Active `particleArray`, mouse state `{ x, y, radius }`.
STEPS:
  1. In particle `update()`, check bounds and query `mappedImage` for underlying luminance.
  2. Modulate particle velocity/size/angle according to luminance rules.
  3. Compute Euclidean distance and directional vector to cursor.
  4. If within cursor radius, displace particle radially away from cursor scaled by force and density.
  5. If outside cursor radius, apply spring damping to return particle toward `(baseX, baseY)`.
OUTPUT: Updated particle coordinates with elastic interactive behaviors.

STAGE 5: Dynamic Render & Constellation Assembly
INPUT: Updated `particleArray`, Canvas 2D context.
STEPS:
  1. Apply trailing canvas refresh (`fillRect` with low alpha) or full clear (`clearRect`).
  2. Render particles as arcs, letters, or geometric paths with sampled cell colors or gradients.
  3. (Optional) Run upper-triangular pairwise particle distance loop ($j = i + 1$).
  4. Draw connecting lines with dynamic opacity `1 - (distance / maxDistance)` between particles within threshold.
  5. Recursively invoke `requestAnimationFrame(animate)`.
OUTPUT: 60 FPS interactive visual simulation on HTML5 Canvas.
```

---

## Phase 4: Skill Compilation

Below is the complete, self-contained compiled skill package structured according to the prompt instructions.

--- START OF FILE html5-canvas-particle-physics/SKILL.md ---
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
--- END OF FILE html5-canvas-particle-physics/SKILL.md ---

--- START OF FILE html5-canvas-particle-physics/references/terminology.md ---
# Terminology

**2D Rendering Context (`CanvasRenderingContext2D`)**:
The drawing interface on an HTML5 `<canvas>` element providing hardware-accelerated 2D rasterization methods.
_Avoid_: canvas DOM node, webgl engine

**Uint8ClampedArray**:
A typed array storing 8-bit unsigned integers clamped strictly to the range 0–255, forming the underlying representation of canvas pixel buffers.
_Avoid_: standard JavaScript array, pixel matrix

**Linear Stride**:
The multiplication factor (4 bytes: R, G, B, A) required to map 2D spatial pixel coordinates $(x, y)$ to a 1D flattened array index: $(y \times 4 \times W) + (x \times 4)$.
_Avoid_: 2D matrix indexing

**Perceived Relative Luminance**:
The non-linear brightness of a color calculated using human eye spectral weighting ($0.299R^2 + 0.587G^2 + 0.114B^2$), accounting for higher retinal sensitivity to green light.
_Avoid_: RGB average, simple grayscale

**CORS Tainting**:
A browser security state triggered when loading external or non-server assets onto a canvas, permanently disabling `getImageData()` and `toDataURL()`.
_Avoid_: canvas crash, image fetch error

**Base Anchor (`baseX, baseY`)**:
The immutable origin coordinates assigned to a particle during initialization, used as an elastic spring target after displacement.
_Avoid_: home point, spawn coordinate

**Constellation Network**:
A visual particle graph where lines are drawn dynamically between any two particles whose Euclidean distance is less than a predefined threshold.
_Avoid_: node mesh, spider graph
--- END OF FILE html5-canvas-particle-physics/references/terminology.md ---

--- START OF FILE html5-canvas-particle-physics/references/pixel-math.md ---
# Pixel & Physics Mathematics

## 1. 1D Flattened Buffer Indexing

A canvas of dimensions $W \times H$ produces an `ImageData.data` array of length $W \times H \times 4$.

```
Pixel (x, y) Buffer Layout:
[R, G, B, A,  R, G, B, A,  R, G, B, A, ...]
 ^           ^           ^
 (0,0)       (1,0)       (2,0)
```

$$\text{Index}_{\text{Red}}(x, y) = (y \times 4 \times W) + (x \times 4)$$
$$\text{Index}_{\text{Green}}(x, y) = \text{Index}_{\text{Red}} + 1$$
$$\text{Index}_{\text{Blue}}(x, y) = \text{Index}_{\text{Red}} + 2$$
$$\text{Index}_{\text{Alpha}}(x, y) = \text{Index}_{\text{Red}} + 3$$

---

## 2. Luminance & Grayscale Conversion Formulas

### Simple Arithmetic Mean (Flat Average)
$$\text{Luminance}_{\text{flat}} = \frac{R + G + B}{3}$$

### Photometric Relative Brightness (Human Perception)
$$\text{Luminance}_{\text{weighted}} = \frac{\sqrt{0.299 \cdot R^2 + 0.587 \cdot G^2 + 0.114 \cdot B^2}}{100}$$

---

## 3. Physics Vector & Distance Formulas

### Euclidean Distance
$$\text{dx} = x_{\text{target}} - x_{\text{particle}}$$
$$\text{dy} = y_{\text{target}} - y_{\text{particle}}$$
$$\text{Distance} = \sqrt{\text{dx}^2 + \text{dy}^2}$$

### Radial Force & Repulsion Displacement
$$\text{ForceScalar} = \frac{\text{Radius}_{\text{max}} - \text{Distance}}{\text{Radius}_{\text{max}}}$$
$$\text{UnitVector}_x = \frac{\text{dx}}{\text{Distance}}, \quad \text{UnitVector}_y = \frac{\text{dy}}{\text{Distance}}$$
$$\Delta x = -\text{UnitVector}_x \cdot \text{ForceScalar} \cdot \text{Density}$$
$$\Delta y = -\text{UnitVector}_y \cdot \text{ForceScalar} \cdot \text{Density}$$

### Spring-Back Return Easing
$$x_{t+1} = x_t - \frac{x_t - x_{\text{base}}}{\text{dampingFactor}}$$
$$y_{t+1} = y_t - \frac{y_t - y_{\text{base}}}{\text{dampingFactor}}$$
--- END OF FILE html5-canvas-particle-physics/references/pixel-math.md ---

--- START OF FILE html5-canvas-particle-physics/references/examples.md ---
# Worked Examples

## Example 1: Full Typographic Particle Constellation System

```javascript
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// 1. Render initial text raster
ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
ctx.fillText('A', 0, 30);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 30) + 1;
  }
  draw() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = mouse.radius;
    const force = (maxDistance - distance) / maxDistance;

    if (distance < mouse.radius) {
      this.x -= forceDirectionX * force * this.density;
      this.y -= forceDirectionY * force * this.density;
    } else {
      if (this.x !== this.baseX) {
        const dxReturn = this.x - this.baseX;
        this.x -= dxReturn / 10;
      }
      if (this.y !== this.baseY) {
        const dyReturn = this.y - this.baseY;
        this.y -= dyReturn / 10;
      }
    }
  }
}

function init() {
  particleArray = [];
  // Sample 100x100 scanned box
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      // Check alpha channel > 128 (index = y * 4 * width + x * 4 + 3)
      if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
        const positionX = x + 10;
        const positionY = y + 10;
        particleArray.push(new Particle(positionX * 15, positionY * 15));
      }
    }
  }
}
init();

function connect() {
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a + 1; b < particleArray.length; b++) {
      const dx = particleArray[a].x - particleArray[b].x;
      const dy = particleArray[a].y - particleArray[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 50;

      if (distance < maxDistance) {
        const opacityValue = 1 - (distance / maxDistance);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}
animate();
```

---

## Example 2: Luminance-Modulated Particle Flow from Base64 Image

```javascript
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 706;

let mappedImage = [];
let particlesArray = [];
const numberOfParticles = 5000;

const myImage = new Image();
myImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'; // Base64 payload

myImage.addEventListener('load', () => {
  ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Build 2D Luminance Map
  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    for (let x = 0; x < canvas.width; x++) {
      const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
      const green = pixels.data[(y * 4 * pixels.width) + (x * 4) + 1];
      const blue = pixels.data[(y * 4 * pixels.width) + (x * 4) + 2];
      const brightness = Math.sqrt(
        (red * red * 0.299) +
        (green * green * 0.587) +
        (blue * blue * 0.114)
      ) / 100;
      row.push({
        cellBrightness: brightness,
        cellColor: `rgb(${red},${green},${blue})`
      });
    }
    mappedImage.push(row);
  }

  class FlowParticle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.speed = 0;
      this.velocity = Math.random() * 0.5;
      this.size = Math.random() * 1.5 + 1;
    }
    update() {
      const gridY = Math.min(Math.max(Math.floor(this.y), 0), canvas.height - 1);
      const gridX = Math.min(Math.max(Math.floor(this.x), 0), canvas.width - 1);
      this.speed = mappedImage[gridY][gridX].cellBrightness;
      
      const movement = (2.55 - this.speed) + this.velocity;
      this.y += movement;
      if (this.y >= canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      const gridY = Math.min(Math.max(Math.floor(this.y), 0), canvas.height - 1);
      const gridX = Math.min(Math.max(Math.floor(this.x), 0), canvas.width - 1);
      ctx.fillStyle = mappedImage[gridY][gridX].cellColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new FlowParticle());
  }

  function animate() {
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
});
```
--- END OF FILE html5-canvas-particle-physics/references/examples.md ---

---

## Phase 5: Validation & Delivery

### Source Fidelity & Verification
- **Every Knowledge Unit Accounted For**:
  - `ku-001` to `ku-005` (Canvas, Uint8ClampedArray, Base64 CORS, Luminance, Constellations) $\to$ mapped to `SKILL.md` Phases 1, 2, 5 & `references/terminology.md`.
  - `ku-010` to `ku-012` (1D-to-2D indexing math, Base anchor springs, Alpha trailing) $\to$ mapped to `SKILL.md` Phases 2, 4, 5 & `references/pixel-math.md`.
  - `ku-020` to `ku-024` (Sampling pipeline, Luminance mapping, Particle rain, Repulsion physics, Constellation linking) $\to$ mapped to numbered steps in `SKILL.md` and complete code in `references/examples.md`.
  - `ku-030`, `ku-031` (CORS tainting, Out-of-bounds array clamping) $\to$ mapped as explicit constraints and guards in Phases 1 & 4.

### Test Scenarios
1. **Scenario 1 (Local Asset Processing)**: User loads a custom image locally.
   - *Result*: Skill instructs conversion to Base64 data string, preventing `SecurityError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data`.
2. **Scenario 2 (Interactive Particle Font)**: User wants a brand logo or letter to explode on mouse hover and reassemble.
   - *Result*: Skill provides the typography scan method ($\text{alpha} > 128$), establishes `baseX`/`baseY`, applies distance-weighted radial repulsion, and uses spring return damping.
3. **Scenario 3 (Performance in Constellation Networks)**: Large particle arrays causing frame rate drops during pairwise line checks.
   - *Result*: Skill uses upper-triangular loops ($b = a + 1$) cutting comparisons in half from $N^2$ to $\frac{N(N-1)}{2}$.

### Extraction Summary
- **Total Knowledge Units Extracted**: 16 (5 concepts, 3 principles, 5 procedures, 2 constraints, 1 counterexample pattern).
- **Key Limitations Documented**: High particle counts ($N > 3000$) in pairwise constellation networks require spatial partitioning (e.g., Quadtrees) or WebGL shaders for real-time mobile performance.
