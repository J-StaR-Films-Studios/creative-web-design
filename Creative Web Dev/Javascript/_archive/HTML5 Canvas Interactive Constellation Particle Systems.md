# Source-to-Skill Compilation Report: HTML5 Canvas Interactive Constellation Particle Systems

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Video Tutorial / Code Demonstration |
| **Title** | Vanilla JavaScript & HTML5 Canvas Interactive Particle System & Constellation Effect |
| **Authority** | Frank's Laboratory (Creative Coding & Canvas Specialist) |
| **Coverage** | HTML5 Canvas boilerplate setup, full-window responsive resizing, 2D rendering context & coordinate space, arc/path drawing primitives, mouse event listeners, continuous `requestAnimationFrame` animation loops, ES6 `Particle` class architecture, 2D velocity vectors, shrinking lifecycle & array garbage collection (`splice`), HSL rainbow color cycling, fading particle trails via translucent background overlays, and distance-based constellation network connection algorithms using the Pythagorean theorem. |

### Coverage Gaps Identified
- WebGL 3D/hardware-accelerated context rendering (mentioned as alternative, but intentionally out of scope for this 2D vanilla tutorial).
- Quadtree spatial partitioning for $O(N \log N)$ constellation line checks at massive scale ($N > 1000$ particles).

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# KNOWLEDGE SPEC: HTML5 Canvas Interactive Particle & Constellation Systems
# ==============================================================================

# --- CONCEPTS ---

- id: ku-001
  type: concept
  name: HTML5 Canvas Context 2D
  source: src-01, "00:56 - 04:50"
  confidence: high
  definition: >
    The CanvasRenderingContext2D object interface obtained via canvas.getContext('2d')
    providing drawing state, global attributes, and vector rasterization primitives.
  attributes: [fillStyle, strokeStyle, lineWidth, globalAlpha, beginPath, arc, fillRect, clearRect]
  avoid_terms: [canvas screen, 2d engine]

- id: ku-002
  type: concept
  name: Animation Loop
  source: src-01, "17:46 - 19:15"
  confidence: high
  definition: >
    A recursive execution cycle driven by window.requestAnimationFrame that synchronizes
    canvas state clearing, model updating, and canvas re-rasterization to display refresh rates.
  attributes: [requestAnimationFrame, frame delta, render loop]
  avoid_terms: [setInterval animation, tick timeout]

- id: ku-003
  type: concept
  name: Particle Object
  source: src-01, "20:20 - 25:55"
  confidence: high
  definition: >
    An individual stateful entity holding spatial coordinates (x, y), velocity vector
    components (speedX, speedY), dimensional scale (size/radius), and color data.
  attributes: [position vector, velocity vector, lifespan, radius, color]
  avoid_terms: [pixel dot, bullet]

- id: ku-004
  type: concept
  name: HSL Color Space
  source: src-01, "38:15 - 40:15"
  confidence: high
  definition: >
    A cylindrical color coordinate representation defining colors by Hue (0–360° angle on the
    color wheel), Saturation (0–100%), and Lightness (0–100%).
  attributes: [hue cycle, saturation percentage, lightness percentage]
  avoid_terms: [RGB spectrum wheel]

- id: ku-005
  type: concept
  name: Constellation Line Mesh
  source: src-01, "41:55 - 49:05"
  confidence: high
  definition: >
    A dynamic spatial network graph formed by computing Euclidean distances between pairs
    of active particles and rendering stroke lines across pairs within a threshold distance.
  attributes: [Euclidean distance threshold, adjacency check, edge line width]
  avoid_terms: [particle web, line cluster]

# --- PRINCIPLES ---

- id: ku-010
  type: principle
  name: Canvas Coordinate & Resizing Synchronization
  source: src-01, "07:01 - 08:38"
  confidence: high
  statement: >
    Always set canvas drawing buffer dimensions directly via canvas.width and canvas.height
    attributes to match window.innerWidth and window.innerHeight, updating on resize events.
  rationale: >
    Setting canvas dimensions via CSS scales and distorts the pixel bitmap, stretching drawn shapes.
  applies_to: [ku-020, ku-021]

- id: ku-011
  type: principle
  name: Path Isolation Principle
  source: src-01, "09:40 - 10:05, 49:55 - 50:20"
  confidence: high
  statement: >
    Always invoke ctx.beginPath() before declaring geometric path segments and close/render
    them cleanly with ctx.stroke() or ctx.fill().
  rationale: >
    Failing to begin or close paths causes previous path segments to link together, producing
    stray lines jumping across the canvas or offscreen coordinates.
  applies_to: [ku-022, ku-026]

- id: ku-012
  type: principle
  name: Particle Garbage Collection with Index Adjustment
  source: src-01, "32:45 - 34:15"
  confidence: high
  statement: >
    When iterating forward through an array and removing expired elements via splice(i, 1),
    immediately decrement the loop index (i--) to prevent skipping adjacent elements.
  rationale: >
    Array.prototype.splice shifts subsequent element indices leftward. Without index decrementing,
    the next item is skipped, causing visual flickering and missed lifecycle updates.
  applies_to: [ku-024]

- id: ku-013
  type: principle
  name: Fading Trail Mechanism
  source: src-01, "37:05 - 38:15"
  confidence: high
  statement: >
    Replace ctx.clearRect() with a low-opacity filled rectangle (e.g. rgba(0, 0, 0, 0.02 - 0.1))
    covering the canvas at the start of each animation loop frame to create particle trails.
  rationale: >
    Translucent layers leave partially faded historical frames beneath newly rendered frames,
    gradually fading previous positions into the background.
  applies_to: [ku-025]

# --- PROCEDURES ---

- id: ku-020
  type: procedure
  name: Initialize Canvas Environment
  source: src-01, "00:56 - 03:55"
  confidence: high
  goal: Set up the DOM canvas, styling, and 2D drawing context.
  prerequisites: [HTML5 page structure]
  steps:
    - action: Create canvas element with unique ID in HTML.
      criterion: Element present in DOM.
    - action: Style canvas in CSS as position absolute, top 0, left 0, width 100%, height 100%, background black.
      criterion: No scrollbars or margins distorting the view.
    - action: Reference canvas in JS and call getContext('2d').
      criterion: Rendering context instance stored in CTX variable.
    - action: Synchronize canvas.width/canvas.height to window.innerWidth/innerHeight.
      criterion: Internal bitmap matches device display resolution.
  outputs: [canvas, ctx, dimensions]

- id: ku-021
  type: procedure
  name: Handle Dynamic Resizing
  source: src-01, "07:35 - 08:40"
  confidence: high
  goal: Prevent canvas distortion upon viewport change.
  prerequisites: [ku-020]
  steps:
    - action: Attach resize event listener to window.
      criterion: Triggers on viewport dimension shifts.
    - action: Reassign canvas.width to window.innerWidth and canvas.height to window.innerHeight.
      criterion: Coordinate space realigns instantly without distortion.
  outputs: [viewport resize handler]

- id: ku-022
  type: procedure
  name: Draw Circle Primitive
  source: src-01, "08:55 - 11:55"
  confidence: high
  goal: Render a solid or stroked circle on the 2D context.
  prerequisites: [ku-020]
  steps:
    - action: Set ctx.fillStyle or ctx.strokeStyle.
      criterion: Context color state set.
    - action: Call ctx.beginPath().
      criterion: Path buffer reset.
    - action: Call ctx.arc(x, y, radius, 0, Math.PI * 2).
      criterion: 360-degree arc registered.
    - action: Call ctx.fill() or ctx.stroke().
      criterion: Geometry rasterized to buffer.
  outputs: [rasterized circle]

- id: ku-023
  type: procedure
  name: Capture User Input
  source: src-01, "12:15 - 17:35"
  confidence: high
  goal: Track cursor positions and interactive triggers.
  prerequisites: [ku-020]
  steps:
    - action: Define global mouse object with x and y initialized to undefined.
      criterion: State holder available.
    - action: Attach click and mousemove listeners to canvas.
      criterion: Updates mouse.x = event.x and mouse.y = event.y on event.
  outputs: [mouse state object, event listeners]

- id: ku-024
  type: procedure
  name: Construct and Manage Particle Lifecycle
  source: src-01, "20:20 - 36:30"
  confidence: high
  goal: Instantiate, update, shrink, and garbage collect dynamic particles.
  prerequisites: [ku-020, ku-023]
  steps:
    - action: Define Particle ES6 class with x, y, size, speedX, speedY, and color in constructor.
      criterion: Particle instances hold isolated state.
    - action: Implement update() method incrementing x += speedX, y += speedY, and decrementing size.
      criterion: Coordinates update per tick; size shrinks if > threshold.
    - action: Implement draw() method rendering arc at this.x, this.y with this.size.
      criterion: Particle visually rendered.
    - action: In handleParticles(), loop through particlesArray; update and draw each particle.
      criterion: All particles process their state per frame.
    - action: When particle.size <= 0.3, splice from array and decrement index i--.
      criterion: Dead particles purged without memory leakage or index skipping.
  outputs: [Particle class, particlesArray manager]

- id: ku-025
  type: procedure
  name: Animate with Dynamic Color Cycling & Trails
  source: src-01, "37:00 - 41:20"
  confidence: high
  goal: Execute infinite animation loop with fading trail effect and rainbow HSL colors.
  prerequisites: [ku-024]
  steps:
    - action: Define global hue variable initialized to 0.
      criterion: Hue tracker available.
    - action: In animation loop, draw translucent fillRect across entire canvas instead of clearRect.
      criterion: Trails persist and decay smoothly.
    - action: Assign particle color using `hsl(${hue}, 100%, 50%)` upon particle creation or tick.
      criterion: Chromatic spectrum spreads across created particles.
    - action: Increment hue by delta (e.g. 0.5 - 2) per frame.
      criterion: Colors continuously cycle around the 360-degree color wheel.
    - action: Request next frame via requestAnimationFrame(animate).
      criterion: Smooth 60fps execution loop.
  outputs: [animated canvas loop, dynamic chromatic trail effect]

- id: ku-026
  type: procedure
  name: Generate Constellation Mesh (Pythagorean Line Connections)
  source: src-01, "41:55 - 50:45"
  confidence: high
  goal: Connect nearby particles with lines when Euclidean distance falls below a defined threshold.
  prerequisites: [ku-024]
  steps:
    - action: Create nested for-loop over particlesArray (outer index `i`, inner index `j = i`).
      criterion: Evaluates each particle pair exactly once without redundant checks.
    - action: Calculate deltaX (dx = particlesArray[i].x - particlesArray[j].x) and deltaY (dy = particlesArray[i].y - particlesArray[j].y).
      criterion: Triangle catheti established.
    - action: Calculate Euclidean distance = Math.sqrt(dx * dx + dy * dy).
      criterion: Direct distance between particle centers calculated.
    - action: If distance < distanceThreshold (e.g. 100px), beginPath, moveTo(particle[i]), lineTo(particle[j]), set strokeStyle/lineWidth, and stroke.
      criterion: Constellation lines connect proximate particles.
    - action: Set dynamic stroke opacity or line width relative to particle size or distance.
      criterion: Aesthetics scale with particle mass.
  outputs: [dynamic constellation graph mesh]

# --- CONSTRAINTS ---

- id: ku-030
  type: constraint
  name: Non-negative Arc Radius
  source: src-01, "32:25 - 32:45"
  confidence: high
  rule: >
    Never pass a negative number or zero to ctx.arc() radius parameter.
  scope: Particle draw and lifecycle logic.
  consequence: JavaScript runtime DOMException error halts canvas rendering.
  enforced_by: Guard check `if (this.size > 0.2) this.size -= 0.1` before drawing or splicing.

- id: ku-031
  type: constraint
  name: Loop Index Decrement on Splice
  source: src-01, "34:00 - 34:15"
  confidence: high
  rule: >
    Always execute `i--` immediately following `array.splice(i, 1)` in forward for-loops.
  scope: Particle manager / garbage collection loops.
  consequence: Skips the element that shifted into position `i`, leading to rendering glitches and delayed cleanup.
  enforced_by: Code structure in handleParticles().
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Canvas Environment & Viewport Binding
INPUT: Web page container, DOM root.
STEPS:
1. Initialize canvas element and obtain 2D rendering context.
2. Bind width and height to viewport dimensions.
3. Attach window resize listener to maintain 1:1 buffer-to-screen pixel ratio.
OUTPUT: Configured 2D rendering pipeline.

STAGE 2: Interactive Input & Particle State Definition
INPUT: Initialized 2D context, cursor event stream.
STEPS:
1. Initialize mouse state container.
2. Attach 'click' and 'mousemove' event listeners to update cursor coordinates.
3. Construct Particle blueprint with position, 2D velocity vector, size, and chromatic HSL properties.
OUTPUT: Interactive event dispatcher and particle class model.

STAGE 3: Animation Loop & Decaying Trail Rasterization
INPUT: Context, particle collection.
STEPS:
1. Establish recursive requestAnimationFrame execution cycle.
2. Apply semi-transparent overlay to canvas to retain fading historical frames.
3. Cycle global hue spectrum angle across frames.
OUTPUT: Synchronized frame loop with decaying motion trails.

STAGE 4: Lifecycle Execution & Dynamic Constellation Generation
INPUT: Active particle array, animation loop tick.
STEPS:
1. Spawn particle instances on mouse interaction.
2. Update spatial positions, apply decay/shrink logic, and safely garbage-collect expired particles (i-- on splice).
3. Compute pairwise Euclidean distances between particles via Pythagorean theorem (dx^2 + dy^2).
4. Rasterize stroke lines between particle pairs within the distance threshold.
OUTPUT: Complete responsive, interactive constellation particle simulation.
```

---

## Phase 4: Skill Compilation

Below is the complete compiled skill package ready for deployment.

```
canvas-particle-systems/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── examples.md
    └── constellation-math.md
```

### `canvas-particle-systems/SKILL.md`

```markdown
---
name: canvas-particle-systems
description: |
  Architect and implement high-performance, interactive HTML5 Canvas particle systems,
  animation loops, fading trails, and constellation network effects in Vanilla JavaScript.
  Use when building custom visual effects, generative web art, physics particles, interactive
  backgrounds, or data meshes without external libraries.
  Triggers: canvas particle system, constellation effect, html5 canvas animation, vanilla js particles,
  canvas trail effect, interactive web art, canvas network mesh, particle physics canvas.
---

# HTML5 Canvas Interactive Constellation & Particle Systems

Implement high-performance, vanilla JavaScript particle animations and connected constellation graphs on HTML5 Canvas.

## Ground Rules

1. **Direct Buffer Scaling**: Always set `canvas.width` and `canvas.height` via JavaScript properties to match DOM dimensions. Never rely on CSS dimensions for the coordinate canvas buffer.
2. **Explicit Path Boundary**: Always call `ctx.beginPath()` before defining new paths, and terminate path segments prior to switching styles to avoid stray vectors.
3. **Safe Splice Invariant**: When removing expired particles in forward loops via `splice(i, 1)`, immediately follow with `i--` to avoid skipping elements.
4. **Radius Non-Negativity**: Never pass values $\le 0$ to `ctx.arc()`. Check boundary thresholds before shrinking radii.

For domain definitions and anti-synonyms, see [terminology.md](references/terminology.md).

---

## Phase 1: Canvas Environment & Responsive Viewport Binding

Initialize the HTML5 canvas, configure styling, acquire the 2D rendering context, and establish dynamic viewport synchronization.

1. Create a `<canvas>` element in HTML with a unique ID:
   ```html
   <canvas id="canvas1"></canvas>
   ```
2. Apply reset styles in CSS to eliminate scrollbars and position the canvas full-screen:
   ```css
   * { margin: 0; padding: 0; box-sizing: border-box; }
   #canvas1 {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: #000000;
   }
   ```
3. Acquire the 2D context in JavaScript and bind initial dimensions:
   ```javascript
   const canvas = document.getElementById('canvas1');
   const ctx = canvas.getContext('2d');
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   ```
4. Attach a responsive `resize` listener to maintain 1:1 pixel scaling when the window changes size:
   ```javascript
   window.addEventListener('resize', function() {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
   });
   ```

### Completion Gate
- [ ] Canvas bitmap buffer dimensions exactly equal window dimensions.
- [ ] Viewport resizing updates canvas buffer size without visual stretching.

---

## Phase 2: Mouse Event Tracking & Particle Model

Define the cursor tracking interface and the object-oriented `Particle` model with spatial, kinematic, and chromatic properties.

1. Declare a mutable `mouse` state object:
   ```javascript
   const mouse = {
     x: undefined,
     y: undefined,
   };
   ```
2. Bind interactive listeners to canvas to capture cursor coordinates:
   ```javascript
   canvas.addEventListener('click', function(event) {
     mouse.x = event.x;
     mouse.y = event.y;
     for (let i = 0; i < 10; i++) {
       particlesArray.push(new Particle());
     }
   });

   canvas.addEventListener('mousemove', function(event) {
     mouse.x = event.x;
     mouse.y = event.y;
     for (let i = 0; i < 2; i++) {
       particlesArray.push(new Particle());
     }
   });
   ```
3. Construct the ES6 `Particle` class with randomized velocity vectors and HSL color binding:
   ```javascript
   class Particle {
     constructor() {
       this.x = mouse.x;
       this.y = mouse.y;
       this.size = Math.random() * 15 + 1;
       this.speedX = Math.random() * 3 - 1.5; // [-1.5, 1.5]
       this.speedY = Math.random() * 3 - 1.5; // [-1.5, 1.5]
       this.color = 'hsl(' + hue + ', 100%, 50%)';
     }
     update() {
       this.x += this.speedX;
       this.y += this.speedY;
       if (this.size > 0.2) this.size -= 0.1;
     }
     draw() {
       ctx.fillStyle = this.color;
       ctx.beginPath();
       ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
       ctx.fill();
     }
   }
   ```

### Completion Gate
- [ ] Cursor interactions dispatch coordinates directly to `mouse` object.
- [ ] Particle constructor encapsulates isolated velocity vectors, decay rates, and colors.

---

## Phase 3: Particle Lifecycle Management & Garbage Collection

Manage the active particle pool, updating kinematic vectors, shrinking mass, and safely pruning dead instances.

1. Initialize global particle array:
   ```javascript
   const particlesArray = [];
   ```
2. Construct the particle manager function `handleParticles()`:
   - Iterate through `particlesArray`.
   - Update spatial coordinates and draw each particle.
   - Splice dead particles whose size has dropped below operational threshold ($\le 0.3$).
   - Immediately decrement loop index `i--` after `splice()` to maintain loop index integrity.

   ```javascript
   function handleParticles() {
     for (let i = 0; i < particlesArray.length; i++) {
       particlesArray[i].update();
       particlesArray[i].draw();

       if (particlesArray[i].size <= 0.3) {
         particlesArray.splice(i, 1);
         i--;
       }
     }
   }
   ```

### Completion Gate
- [ ] Array size shrinks back to 0 when interaction stops.
- [ ] No visual stuttering, skipped particles, or runtime radius exceptions.

---

## Phase 4: Constellation Distance Mesh (Pythagorean Linking)

For detailed geometric derivation, see [constellation-math.md](references/constellation-math.md).

Compute pairwise particle distances and draw connecting stroke lines between neighbors.

1. Insert a nested pairing loop into `handleParticles()`:
   ```javascript
   function handleParticles() {
     for (let i = 0; i < particlesArray.length; i++) {
       particlesArray[i].update();
       particlesArray[i].draw();

       for (let j = i; j < particlesArray.length; j++) {
         const dx = particlesArray[i].x - particlesArray[j].x;
         const dy = particlesArray[i].y - particlesArray[j].y;
         const distance = Math.sqrt(dx * dx + dy * dy);

         if (distance < 100) {
           ctx.beginPath();
           ctx.strokeStyle = particlesArray[i].color;
           ctx.lineWidth = particlesArray[i].size / 10;
           ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
           ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
           ctx.stroke();
           ctx.closePath();
         }
       }

       if (particlesArray[i].size <= 0.3) {
         particlesArray.splice(i, 1);
         i--;
       }
     }
   }
   ```
2. Ensure distance checks execute **before** pruning expired particles within the loop to avoid referencing undefined objects.

### Completion Gate
- [ ] Lines dynamically connect and disconnect based on distance threshold.
- [ ] Inner loop starts at `j = i` to eliminate duplicate redundant checks.
- [ ] Line width and stroke style dynamically reflect particle properties.

---

## Phase 5: Continuous Animation Loop & Decaying Trail Shading

Establish the 60fps rendering cycle, chromatic hue rotation, and decaying motion blur trails.

1. Declare global chromatic angle:
   ```javascript
   let hue = 0;
   ```
2. Construct the infinite rendering loop `animate()`:
   - Apply translucent fill rect to achieve decaying motion trails (or `clearRect` for crisp, non-trail rendering).
   - Process `handleParticles()`.
   - Rotate `hue` value.
   - Invoke `requestAnimationFrame(animate)`.

   ```javascript
   function animate() {
     // Decaying trail background overlay
     ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
     ctx.fillRect(0, 0, canvas.width, canvas.height);

     handleParticles();
     hue += 2;
     requestAnimationFrame(animate);
   }
   animate();
   ```

For complete working implementations across scenarios, see [examples.md](references/examples.md).

### Completion Gate
- [ ] `requestAnimationFrame` continuously executes without frame drops.
- [ ] Hue cycles continuously across the 0–360° chromatic spectrum.
- [ ] Old frames smoothly fade into the background.
```

---

### `canvas-particle-systems/references/terminology.md`

```markdown
# Terminology

**Canvas Rendering Context 2D (`CanvasRenderingContext2D`)**:
The drawing state machine object returned by `canvas.getContext('2d')` that provides methods to render shapes, text, images, and manipulate bitmap pixels.
_Avoid_: canvas screen, 2D renderer engine

**Drawing Buffer Dimensions**:
The internal pixel resolution of the canvas surface specified by `canvas.width` and `canvas.height`.
_Avoid_: CSS width, element layout size

**Animation Loop**:
A recursive loop synchronizing game or rendering state updates with the browser screen refresh rate via `requestAnimationFrame`.
_Avoid_: setInterval loop, tick timeout

**Velocity Vector**:
A 2D vector defined by components `speedX` ($\Delta x$) and `speedY` ($\Delta y$) applied to a particle position per animation frame.
_Avoid_: direction speed, movement momentum

**Pythagorean Euclidean Distance**:
The straight-line metric between two 2D points calculated as $\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$.
_Avoid_: point gap, spatial delta

**HSL Color Model**:
A cylindrical color coordinate system specifying Hue (degrees 0–360), Saturation (percentage), and Lightness (percentage).
_Avoid_: RGB color wheel, color gradient code

**Fading Trail Effect**:
A rendering technique that replaces full buffer clearing (`clearRect`) with a low-opacity rectangular overlay (`fillRect` with alpha $0.02 - 0.1$), causing historical frames to fade exponentially.
_Avoid_: motion blur filter, ghosting bug
```

---

### `canvas-particle-systems/references/constellation-math.md`

```markdown
# Constellation Distance Mathematics

## Geometric Formulation

To calculate the spatial separation between Particle $A (x_1, y_1)$ and Particle $B (x_2, y_2)$:

1. **Calculate Catheti (Differences in X and Y)**:
   $$\Delta x = x_1 - x_2$$
   $$\Delta y = y_1 - y_2$$

2. **Calculate Hypotenuse (Euclidean Distance)**:
   $$\text{distance} = \sqrt{\Delta x^2 + \Delta y^2}$$

In JavaScript:
```javascript
const dx = particleA.x - particleB.x;
const dy = particleA.y - particleB.y;
const distance = Math.sqrt(dx * dx + dy * dy);
// Modern alternative: const distance = Math.hypot(dx, dy);
```

## Algorithmic Complexity & Optimization

- **Brute Force Pairs**: $O(N^2)$ checks.
- **Triangular Optimization**: By starting the inner loop at `let j = i;`, redundant symmetric comparisons ($B \leftrightarrow A$) and self-comparisons ($A \leftrightarrow A$) are omitted, reducing pairwise evaluations to:
  $$\frac{N(N - 1)}{2} \approx O\left(\frac{N^2}{2}\right)$$

## Dynamic Stroke Attenuation Formulas

To smoothly fade constellation lines as particles separate:

```javascript
// Opacity inversely proportional to distance
const opacity = 1 - (distance / maxDistance);
ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;

// Width proportional to particle scale
ctx.lineWidth = particleA.size / 10;
```
```

---

### `canvas-particle-systems/references/examples.md`

```markdown
# Worked Examples

## Example 1: Full Interactive Rainbow Constellation Mesh

**Scenario**: Full-screen canvas where cursor movement spawns shrinking rainbow particles that link together into a constellation web with decaying trails.

```javascript
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hue = 0;
const particlesArray = [];
const mouse = { x: undefined, y: undefined };

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
  for (let i = 0; i < 3; i++) {
    particlesArray.push(new Particle());
  }
});

canvas.addEventListener('click', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
  for (let i = 0; i < 15; i++) {
    particlesArray.push(new Particle());
  }
});

class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 15 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = 'hsl(' + hue + ', 100%, 50%)';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function handleParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    for (let j = i; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = particlesArray[i].color;
        ctx.lineWidth = 0.3;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }

    if (particlesArray[i].size <= 0.3) {
      particlesArray.splice(i, 1);
      i--;
    }
  }
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  hue += 2;
  requestAnimationFrame(animate);
}
animate();
```

---

## Example 2: Autonomous Ambient Constellation Background

**Scenario**: Autonomous ambient particle field (e.g., website header/hero background) initialized with 100 floating particles bouncing across screen boundaries without requiring mouse events.

```javascript
class AmbientParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 1.5 - 0.75;
    this.speedY = Math.random() * 1.5 - 0.75;
    this.color = 'rgba(255, 255, 255, 0.8)';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
    if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
```
```

---

## Phase 5: Validation & Delivery

### Source Fidelity Matrix

| Source Unit | Extracted Feature | SKILL.md Implementation |
|---|---|---|
| Boilerplate & Resizing | `canvas.width = window.innerWidth` + `resize` listener | Phase 1 |
| Drawing Primitives | `ctx.arc()`, `beginPath()`, `fill()`, `stroke()` | Phase 1 & 2 |
| Mouse Interactivity | `mousemove`, `click`, `mouse.x/y` | Phase 2 |
| Particle Architecture | ES6 `class Particle` (`constructor`, `update`, `draw`) | Phase 2 |
| Garbage Collection | `particlesArray.splice(i, 1); i--;` | Phase 3 |
| Chromatic Spectrum | `hsl(${hue}, 100%, 50%)` + `hue += delta` | Phase 5 |
| Decaying Motion Trails | `ctx.fillStyle = 'rgba(0,0,0,0.02)'` + `fillRect` | Phase 5 |
| Constellation Effect | Distance calculation via Pythagorean theorem + `lineTo` | Phase 4 & `constellation-math.md` |
| Path Stray Vector Fix | `ctx.beginPath()` / `ctx.closePath()` on line mesh | Phase 4 & Ground Rules |

### Test Scenarios

1. **Scenario: Window Resized by User**
   - *Behavior*: `resize` event fires, resetting `canvas.width` and `canvas.height` directly on buffer properties. Coordinate space adapts instantly without aspect ratio stretching or blurriness.
2. **Scenario: High-Frequency Cursor Movement**
   - *Behavior*: Spawns up to hundreds of particles; `handleParticles` processes positions and shrinks radii. When particles reach threshold $\le 0.3$, `splice(i, 1)` followed by `i--` purges expired elements smoothly without memory leaks.
3. **Scenario: Dynamic Inter-Particle Proximity**
   - *Behavior*: Nested loop checks particle pairs. When distance $< 100\text{px}$, stroke vectors dynamically connect them in real-time, coloring connections with the origin particle's HSL hue.

### Known Limitations
- **Large Particle Counts ($N > 1000$)**: Pairwise $O(N^2)$ distance checks may cause frame drops on low-tier CPUs. For massive simulations, spatial grid partitioning or quadtrees should be layered on top of this methodology.
