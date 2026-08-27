# Source-to-Skill Compilation: HTML Canvas Vector Field Animation

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / transcript |
| **Title** | Vanilla JavaScript HTML5 Canvas Interactive Vector Field & Flow Field Animation Tutorial |
| **Authority** | Frank's Laboratory (Creative Coding & Web Development Educator) in collaboration with Radu (Algorithm & Optimization specialist) |
| **Coverage** | Responsive HTML5 Canvas setup, Object-Oriented JS with ES2022 private class fields (`#`), `requestAnimationFrame` recursion, animation cancellation on resize, periodic timing with `deltaTime`, trigonometry wave/rotation mapping with `Math.sin` and `Math.cos`, nested-loop 2D grid generation, performance optimization (avoiding `Math.sqrt`, avoiding `translate`/`rotate` transform overhead, controlling cell size/line width), linear canvas gradients, and Euclidean distance-based mouse interactivity. |

### Coverage Gaps Identified
- Particle physics integration over the vector field (the video sets up the vector field foundation and discusses particle systems conceptually at 37:48–38:05, but focuses implementation on the underlying vector grid and reactive rotation).
- WebGL rendering (explicitly scoped to Canvas 2D API context).

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
spec_version: "1.0"
source: "src-01: HTML Canvas Interactive Vector Field Tutorial"

# -----------------------------------------------------------------------------
# CONCEPTS
# -----------------------------------------------------------------------------
- id: ku-001
  type: concept
  name: HTML5 Canvas 2D Context
  source: src-01, "03:12 - 03:58"
  confidence: high
  definition: >
    The 2D rendering context interface (`CanvasRenderingContext2D`) obtained via
    `canvas.getContext('2d')` containing state configurations (colors, line width)
    and drawing API primitives.
  attributes: [drawing context, state machine, raster surface]
  avoid_terms: [3D context, WebGL engine, DOM layer]

- id: ku-002
  type: concept
  name: Vector Field
  source: src-01, "00:28, 30:26 - 30:33, 37:41 - 38:05"
  confidence: high
  definition: >
    A spatial grid of cells across a coordinate space where each coordinate point
    has an associated directional vector (angle and length) governing flow and orientation.
  attributes: [grid coordinate, vector angle, vector length, flow direction]
  avoid_terms: [static bitmap, raster mask, pure particle emitter]

- id: ku-003
  type: concept
  name: Delta Time (deltaTime)
  source: src-01, "24:55 - 25:05, 25:48 - 26:25"
  confidence: high
  definition: >
    The elapsed time in milliseconds between the current animation frame and the
    previous frame, used to normalize animation speed and periodic intervals independently of monitor refresh rate.
  attributes: [frame delta, millisecond timestamp, hardware independence]
  avoid_terms: [frame counter, tick rate, fixed step delay]

- id: ku-004
  type: concept
  name: ES2022 Private Class Features
  source: src-01, "05:39 - 06:18, 09:35 - 09:51"
  confidence: high
  definition: >
    JavaScript class fields and methods prefixed with `#` that enforce strict internal
    lexical encapsulation enforced by the runtime engine, preventing external modification.
  attributes: [hash prefix, internal state, runtime encapsulation]
  avoid_terms: [underscore convention, soft private, protected field]

# -----------------------------------------------------------------------------
# PRINCIPLES
# -----------------------------------------------------------------------------
- id: ku-010
  type: principle
  name: Full Encapsulation of Canvas State
  source: src-01, "04:18 - 04:50, 06:35 - 07:55, 09:27 - 09:50"
  confidence: high
  statement: >
    Encapsulate canvas drawing context (`#ctx`), dimensions (`#width`, `#height`),
    and internal calculations inside class instances as private fields rather than
    accessing global variables from within drawing methods.
  rationale: >
    Prevents spaghetti code, allows reusable animation modules, supports multiple
    independent canvas layers, and follows standard animation library design patterns.

- id: ku-011
  type: principle
  name: Explicit Context Binding in Animation Recursion
  source: src-01, "15:08 - 16:11"
  confidence: high
  statement: >
    When passing an instance method into `requestAnimationFrame`, bind `this`
    explicitly via `this.animate.bind(this)`.
  rationale: >
    `requestAnimationFrame` executes callback functions on the global window context;
    without explicit binding, `this` evaluates to `undefined` (in strict/module mode)
    or `window`, throwing `TypeError: Cannot read properties of undefined`.

- id: ku-012
  type: principle
  name: Animation Loop Cancellation on Resize
  source: src-01, "19:08 - 20:37"
  confidence: high
  statement: >
    Always store the animation request ID returned by `requestAnimationFrame` in a variable
    and call `cancelAnimationFrame(requestId)` before recreating the instance or restarting the loop on `window.resize`.
  rationale: >
    Failing to cancel previous loops results in multiple parallel recursion loops running
    simultaneously, multiplying CPU/GPU usage and causing frame stutter and state corruption.

- id: ku-013
  type: principle
  name: Direct Mathematical Rotation over Canvas Matrix Transforms
  source: src-01, "36:28 - 37:15"
  confidence: high
  statement: >
    Calculate vector endpoints using trigonometric formulas (`x + cos(θ) * length`, `y + sin(θ) * length`)
    directly in line drawing commands rather than repeatedly calling `ctx.save()`, `ctx.translate()`,
    `ctx.rotate()`, and `ctx.restore()` per cell.
  rationale: >
    Canvas matrix transformations impose massive overhead when rendering thousands of
    grid elements per frame; pure trigonometric vector calculations execute in raw V8 JavaScript registers with zero context-switching overhead.

- id: ku-014
  type: principle
  name: Omission of Square Root in Distance Calculations
  source: src-01, "44:09 - 45:34, 46:00 - 46:13"
  confidence: high
  statement: >
    Calculate squared distance (`dx*dx + dy*dy`) instead of Euclidean distance (`Math.sqrt(dx*dx + dy*dy)`)
    for proximity thresholds across thousands of grid iterations, scaling the comparison thresholds accordingly.
  rationale: >
    `Math.sqrt` is computationally heavy when called thousands of times per frame (e.g. 60 FPS across 5,000 cells = 300,000 sqrt calls/sec).

# -----------------------------------------------------------------------------
# PROCEDURES
# -----------------------------------------------------------------------------
- id: ku-020
  type: procedure
  name: Responsive DOM & Canvas Initialization
  source: src-01, "01:37 - 04:12"
  confidence: high
  goal: Initialize full-bleed responsive canvas with normalized CSS box model
  steps:
    - action: Apply CSS reset (`margin: 0; padding: 0; box-sizing: border-box;`) and position canvas absolute (`top: 0; left: 0; background: black;`)
      criterion: Canvas fills viewport without scrollbars
    - action: Wrap initialization logic in `window.addEventListener('load', ...)`
      criterion: DOM tree and stylesheets are fully loaded before element selection
    - action: Query canvas element and obtain 2D context via `canvas.getContext('2d')`
      criterion: Valid 2D context instance created
    - action: Set `canvas.width = window.innerWidth` and `canvas.height = window.innerHeight`
      criterion: Canvas coordinate resolution matches window viewport dimensions
  outputs: [canvas DOM element, 2D rendering context, viewport dimensions]

- id: ku-021
  type: procedure
  name: Encapsulated FlowFieldEffect Class Construction
  source: src-01, "04:33 - 10:00, 33:28 - 36:00"
  confidence: high
  goal: Construct animation controller encapsulating private context, dimensions, styles, and gradients
  steps:
    - action: Declare private class fields (`#ctx`, `#width`, `#height`, `#field`, `#gradient`, etc.)
      criterion: Fields prefixed with `#` outside constructor
    - action: Assign incoming context and dimensions inside `constructor(ctx, width, height)`
      criterion: Private fields bound to instance parameters
    - action: Define private helper methods (`#createGradient()`, `#drawLine(angle, x, y)`)
      criterion: Methods encapsulated and callable only from within the class instance
  outputs: [FlowFieldEffect class definition]

- id: ku-022
  type: procedure
  name: DeltaTime Periodic Event Timing Setup
  source: src-01, "25:10 - 29:55"
  confidence: high
  goal: Execute canvas draw cycles at a deterministic frame interval regardless of screen refresh rate
  steps:
    - action: Initialize `this.lastTime = 0`, `this.interval = 1000/60`, and `this.timer = 0`
      criterion: Timing state variables defined on class instance
    - action: Pass `timeStamp` into recursive `animate(timeStamp)` method
      criterion: `timeStamp` captured from `requestAnimationFrame` callback
    - action: Compute `const deltaTime = timeStamp - this.lastTime; this.lastTime = timeStamp;`
      criterion: Elapsed frame time calculated accurately
    - action: Accumulate `this.timer += deltaTime`
      criterion: Timer increments by frame duration
    - action: Gate drawing behind condition `if (this.timer > this.interval)` and reset `this.timer = 0` (or `this.timer %= this.interval`)
      criterion: Draw logic only executes when accumulated interval threshold is reached
  outputs: [deterministic time-gated animation loop]

- id: ku-023
  type: procedure
  name: 2D Grid Vector Field Generation
  source: src-01, "30:26 - 33:04, 35:41 - 37:40"
  confidence: high
  goal: Generate a regular 2D grid across canvas dimensions and draw directional vectors per cell
  steps:
    - action: Define `#cellSize` (e.g. 15px) governing cell dimension
      criterion: Grid granularity established
    - action: Create nested `for` loops where outer loop increments `y += this.#cellSize` from `0` to `#height`, and inner loop increments `x += this.#cellSize` from `0` to `#width`
      criterion: Iterates systematically across all grid cells row-by-row
    - action: Calculate cell angle `const angle = (Math.cos(x * zoomX) + Math.sin(y * zoomY)) * radius`
      criterion: Smooth continuous angle distribution calculated
    - action: Call line drawing routine passing `(angle, x, y)`
      criterion: Vector rendered for each grid node
  outputs: [2D vector field canvas raster]

- id: ku-024
  type: procedure
  name: Mouse Proximity Distance Calculation & Interaction
  source: src-01, "22:42 - 24:00, 43:35 - 46:40"
  confidence: high
  goal: Track cursor position and alter vector length based on Euclidean distance to cell origin
  steps:
    - action: Set up global `mousemove` event listener updating `{ x, y }` coordinates on mouse state object
      criterion: Current cursor position tracked continuously
    - action: In `#drawLine(angle, x, y)`, compute offset vectors `const dx = mouse.x - x; const dy = mouse.y - y;`
      criterion: Distance components computed per cell
    - action: Calculate squared distance `let distance = dx * dx + dy * dy;`
      criterion: Squared distance computed without `Math.sqrt`
    - action: Clamp distance between minimum and maximum bounds using `if` / `else if` statements
      criterion: Vector length prevented from overflowing or collapsing
    - action: Compute vector length inversely or directly proportional to distance (e.g., `length = distance / scale` or `distance * scale`)
      criterion: Vector lines dynamically scale according to cursor proximity
  outputs: [interactive cursor-reactive vector field]

# -----------------------------------------------------------------------------
# CONSTRAINTS
# -----------------------------------------------------------------------------
- id: ku-030
  type: constraint
  name: Private Class Field Declaration Prerequisite
  source: src-01, "08:14 - 08:26"
  confidence: high
  rule: >
    All private class fields starting with `#` must be declared in the class body
    before being assigned inside the `constructor` or any class method.
  scope: Class definition syntax
  consequence: JavaScript throws a SyntaxError: Private field '#field' must be declared in an enclosing class.

- id: ku-031
  type: constraint
  name: Initial Timestamp Parameter Guard
  source: src-01, "27:25 - 27:48"
  confidence: high
  rule: >
    Pass an initial value (e.g. `0`) when manually triggering the first `animate(0)` call before `requestAnimationFrame` takes over.
  scope: First loop execution
  consequence: `timeStamp` is `undefined` on frame 0, causing `deltaTime` to evaluate to `NaN` and breaking timer comparisons.

- id: ku-032
  type: constraint
  name: Cell Size Minimum Performance Bound
  source: src-01, "39:00 - 39:52"
  confidence: high
  rule: >
    Keep `#cellSize` at or above 10–15 pixels for real-time 60 FPS animation; do not set cell size to micro-values (e.g. < 5px) in 60 FPS continuous redraw loops.
  scope: Grid rendering configuration
  consequence: Geometric explosion in line draws per frame (e.g., 1920x1080 with 3px cell size = ~230,000 lines per frame = severe frame drops).
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Canvas Environment & Layout Setup
INPUT: Target DOM container / Window object
STEPS:
1. Normalize HTML/body margins and canvas positioning via CSS.
2. Initialize canvas on window load and bind full-bleed dimensions to `window.innerWidth` / `innerHeight`.
3. Obtain CanvasRenderingContext2D ('2d').
OUTPUT: Initialized Canvas & 2D Context ready for drawing.
VALIDATION:
[ ] Zero margins / no window scrollbars
[ ] Coordinate resolution strictly matches viewport pixel resolution

STAGE 2: Effect Controller Class Definition & Encapsulation
INPUT: Canvas 2D Context, Canvas Dimensions
STEPS:
1. Declare private class fields (`#ctx`, `#width`, `#height`, `#cellSize`, `#radius`, `#vr`, `#timer`, `#interval`, `#lastTime`).
2. Construct instance, assigning dependencies and initializing multi-stop linear gradients.
3. Define private `#drawLine(angle, x, y)` and public `animate(timeStamp)` methods.
OUTPUT: Fully encapsulated `FlowFieldEffect` class definition.
VALIDATION:
[ ] All state variables declared as private fields with `#` prefix
[ ] No dependencies on global variables inside drawing routines

STAGE 3: Deterministic Animation Loop with DeltaTime & Resize Handling
INPUT: Instantiated effect controller, Window resize event
STEPS:
1. Calculate `deltaTime` via `timeStamp - this.#lastTime` within `animate()`.
2. Accumulate `timer += deltaTime` and gate redraw cycles to target interval (`1000 / 60`).
3. Store `animationFrameId = requestAnimationFrame(this.animate.bind(this))`.
4. Attach `resize` listener that calls `cancelAnimationFrame(animationFrameId)`, resizes canvas, creates new instance, and restarts animation.
OUTPUT: Stutter-free, responsive animation loop.
VALIDATION:
[ ] Resizing window does not spawn runaway parallel animation loops
[ ] Animation speed remains identical on 60Hz, 120Hz, and 144Hz monitors

STAGE 4: Vector Field Trigonometric Grid Generation
INPUT: Canvas width/height, Cell size, Zoom/Frequency scalars
STEPS:
1. Iterate over 2D space using nested `y` and `x` loops incrementing by `#cellSize`.
2. Compute directional angle using `(Math.cos(x * factorX) + Math.sin(y * factorY)) * radius`.
3. Oscillate `#radius` over time between `[minRadius, maxRadius]` by adding `#vr` and reversing sign on boundary hit.
4. Calculate line endpoint using direct trigonometry: `x + Math.cos(angle) * length`, `y + Math.sin(angle) * length`.
OUTPUT: Dynamic mathematical vector flow field pattern.
VALIDATION:
[ ] Smooth visual swirl/curving patterns without matrix transform calls (`ctx.rotate`)
[ ] Reversible radius oscillation bounces seamlessly

STAGE 5: Interactive Cursor Distance Scaling
INPUT: Global mouse coordinates `{ x, y }`
STEPS:
1. Calculate coordinate deltas: `dx = mouse.x - x`, `dy = mouse.y - y`.
2. Calculate squared distance: `distance = dx * dx + dy * dy`.
3. Apply boundary thresholds to clamp min/max distance.
4. Compute line length proportional to distance.
OUTPUT: Real-time mouse-reactive flow field.
VALIDATION:
[ ] Vectors warp smoothly as cursor moves
[ ] Performance remains at 60 FPS (zero `Math.sqrt` calls in grid loop)
```

---

## Phase 4 & 5: Skill Compilation & Delivery

Here is the complete, validated agent skill package.

### Skill Package Structure
```
html-canvas-vector-field-animation/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

---

### File 1: `html-canvas-vector-field-animation/SKILL.md`

```markdown
---
name: html-canvas-vector-field-animation
description: |
  Create high-performance, responsive HTML5 Canvas 2D vector field and flow field animations in vanilla JavaScript.
  Use when building: interactive canvas generative art, mathematical flow fields, particle vector grids,
  trigonometric canvas animations, or responsive OOP canvas architectures with private class fields and deltaTime.
  Triggers: canvas vector field, flow field animation, canvas generative grid, interactive canvas lines,
  trigonometry canvas animation, requestAnimationFrame deltaTime loop.
---

# HTML5 Canvas Vector Field Animation

Build modular, 60 FPS interactive vector field animations using vanilla JavaScript, Canvas 2D API, ES2022 private class fields, and direct trigonometric mapping.

## Principles & Core Rules

1. **Direct Trigonometric Mapping**: Never use `ctx.save()`, `ctx.translate()`, `ctx.rotate()`, and `ctx.restore()` in dense grid loops. Compute endpoint positions directly via trigonometric offsets (`x + cos(θ) * len`, `y + sin(θ) * len`).
2. **Encapsulate State**: Store rendering context, dimensions, and styling in ES2022 private class fields (`#ctx`, `#width`, `#height`). Never read global variables inside class methods.
3. **Cancel Loops on Resize**: Store the ID returned by `requestAnimationFrame`. Cancel the existing loop via `cancelAnimationFrame()` before re-initializing on window resize.
4. **Frame-Rate Independence**: Normalize all periodic updates and animation steps using `deltaTime` calculated from `requestAnimationFrame` timestamps.
5. **Distance Optimization**: Compute squared Euclidean distance (`dx*dx + dy*dy`) when calculating cursor proximity. Do not invoke `Math.sqrt` inside per-cell loops.

For canonical terminology and anti-patterns, consult [terminology.md](references/terminology.md).

---

## Phase 1: Environment & Canvas Initialization

Set up the HTML5 Canvas DOM structure, CSS reset, and viewport bindings.

1. **Configure CSS layout**: Set `margin: 0`, `padding: 0`, and `box-sizing: border-box` on all elements. Position canvas `position: absolute; top: 0; left: 0; background: #000;`.
2. **Bind window load**: Wrap initialization logic inside a `window.addEventListener('load', ...)` listener.
3. **Obtain 2D Context**: Query the canvas element via `document.getElementById()` and extract the context via `canvas.getContext('2d')`.
4. **Scale to Viewport**: Assign `canvas.width = window.innerWidth` and `canvas.height = window.innerHeight`.

### Completion Gate
- [ ] Canvas covers 100% of viewport without triggering scrollbars
- [ ] 2D context is acquired and verified

---

## Phase 2: Class Structure & Private Field Encapsulation

Encapsulate vector field properties, gradients, and drawing subroutines within a dedicated ES2022 class.

1. **Declare Private Fields**: Declare all internal properties at the class top level prefixed with `#`.
2. **Construct Instance**: Accept `(ctx, width, height)` in `constructor`. Assign them to `#ctx`, `#width`, `#height`.
3. **Build Color Gradients**: Create a private `#createGradient()` method using `this.#ctx.createLinearGradient()` with multi-stop color anchors. Assign to `#ctx.strokeStyle`.
4. **Define Vector Drawer**: Implement `#drawLine(angle, x, y)`:
   - Call `this.#ctx.beginPath()`
   - Call `this.#ctx.moveTo(x, y)`
   - Call `this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)`
   - Call `this.#ctx.stroke()`

### Completion Gate
- [ ] All internal properties use `#` private syntax
- [ ] No `ctx` state leaks to global scope

---

## Phase 3: Responsive Lifecycle & DeltaTime Timing Loop

Set up frame-rate-independent recursion and clean resize teardown.

1. **Initialize Timing Parameters**: In constructor, set `this.#lastTime = 0`, `this.#interval = 1000 / 60` (16.6ms for 60 FPS target), and `this.#timer = 0`.
2. **Implement `animate(timeStamp)`**:
   - Calculate delta: `const deltaTime = timeStamp - this.#lastTime; this.#lastTime = timeStamp;`
   - Accumulate timer: `this.#timer += deltaTime;`
   - If `this.#timer >= this.#interval`, clear canvas via `this.#ctx.clearRect(0, 0, this.#width, this.#height)`, run the grid loop, and reset `this.#timer = 0`.
   - Recurse via `flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));`.
3. **Handle Window Resizing**:
   - Register `window.addEventListener('resize', ...)`
   - Call `cancelAnimationFrame(flowFieldAnimation)`
   - Update `canvas.width` and `canvas.height` to new window dimensions
   - Instantiate a new effect object and invoke `flowField.animate(0)`

### Completion Gate
- [ ] `animate` uses `.bind(this)` on recursive scheduling
- [ ] `cancelAnimationFrame` prevents duplicate animation loops on resize
- [ ] First loop call passes initial timestamp `0`

---

## Phase 4: Trigonometric Grid & Vector Field Generation

Generate the 2D grid matrix and calculate flow angle per cell.

1. **Configure Grid Density**: Set `#cellSize` to a value between `10` and `25` pixels.
2. **Execute Nested Grid Traversal**:
   - Outer loop: `for (let y = 0; y < this.#height; y += this.#cellSize)`
   - Inner loop: `for (let x = 0; x < this.#width; x += this.#cellSize)`
3. **Compute Flow Angle**:
   - Calculate base angle: `const angle = (Math.cos(x * scaleX) + Math.sin(y * scaleY)) * this.#radius;`
   - Adjust `scaleX` and `scaleY` (e.g. `0.005` to `0.01`) to alter pattern frequency and zoom.
4. **Oscillate Radius**:
   - Add velocity step per frame: `this.#radius += this.#vr;`
   - Reverse on boundary: `if (this.#radius > max || this.#radius < min) this.#vr *= -1;`
5. **Render Cell Vector**: Call `this.#drawLine(angle, x, y)`.

For detailed angle formula variations and worked examples, consult [examples.md](references/examples.md).

### Completion Gate
- [ ] Grid covers full canvas dimensions
- [ ] Curves and swirls oscillate smoothly without visual seams

---

## Phase 5: Mouse Interaction & Distance Optimization

Introduce interactive cursor reactivity using squared Euclidean distances.

1. **Track Cursor**: Initialize global `const mouse = { x: 0, y: 0 };`. Update coordinates on `window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; })`.
2. **Compute Proximity Deltas**: Inside `#drawLine(angle, x, y)`:
   ```javascript
   const dx = mouse.x - x;
   const dy = mouse.y - y;
   let distance = dx * dx + dy * dy;
   ```
3. **Clamp Proximity Bounds**: Clamp `distance` between threshold values (e.g. `min = 50000`, `max = 600000`).
4. **Modulate Length & Angles**: Compute `const length = distance * 0.00005;` (or scale angle factors using `mouse.x` and `mouse.y`).

### Completion Gate
- [ ] Vector field deforms dynamically around cursor
- [ ] Zero `Math.sqrt` operations inside per-cell loops
- [ ] Animation maintains constant 60 FPS during cursor movement

---

## Validation & Verification

1. **Responsive Test**: Drag browser window corner rapidly. Confirm no multi-speed rendering or visual artifacting occurs.
2. **Framerate Test**: Verify performance in DevTools Performance tab; ensure frame duration stays under 16.6ms.
3. **Memory Test**: Verify memory heap remains stable over 60 seconds of continuous oscillation without unbounded allocations.
```

---

### File 2: `html-canvas-vector-field-animation/references/terminology.md`

```markdown
# Terminology & Canonical Concepts

**Vector Field**:
A spatial grid across 2D coordinate space where each node defines a directional angle and magnitude.
_Avoid_: static raster, particle background, sprite canvas

**Private Class Fields (`#field`)**:
ES2022 JavaScript syntax providing true engine-enforced private encapsulation of object properties.
_Avoid_: underscore-prefix convention (`_field`), closure variables inside constructor

**Delta Time (`deltaTime`)**:
The time elapsed in milliseconds between consecutive animation frames (`currentTime - previousTime`), used to achieve consistent animation speed across screens with different refresh rates (60Hz, 120Hz, 144Hz).
_Avoid_: fixed frame counter, hardcoded step increment, `setInterval` tick

**Direct Trigonometric Rendering**:
Calculating line endpoints using `x + cos(θ) * length` and `y + sin(θ) * length` directly in drawing commands rather than altering the global canvas transformation matrix.
_Avoid_: canvas matrix stack manipulation (`ctx.save()`, `ctx.rotate()`, `ctx.restore()`) in high-frequency loops

**Squared Euclidean Distance**:
Measuring proximity via `dx*dx + dy*dy` rather than `Math.sqrt(dx*dx + dy*dy)` to eliminate CPU-heavy square root computations in dense loops.
_Avoid_: Euclidean distance with `Math.hypot` or `Math.sqrt` in per-frame grid traversal

**Color Stop (`addColorStop`)**:
A point along a linear or radial canvas gradient defining a normalized position (`0.0` to `1.0`) and color value.
_Avoid_: CSS gradient string interpolation on 2D context
```

---

### File 3: `html-canvas-vector-field-animation/references/examples.md`

```markdown
# Worked Examples & Implementations

## 1. Complete Minimal Vector Field Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vector Field Animation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    canvas { position: absolute; top: 0; left: 0; background: #050505; }
  </style>
</head>
<body>
  <canvas id="canvas1"></canvas>
  <script>
    let canvas, ctx, flowField, flowFieldAnimation;
    const mouse = { x: 0, y: 0 };

    window.addEventListener('load', () => {
      canvas = document.getElementById('canvas1');
      ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
      flowField.animate(0);
    });

    window.addEventListener('resize', () => {
      cancelAnimationFrame(flowFieldAnimation);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
      flowField.animate(0);
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    class FlowFieldEffect {
      #ctx;
      #width;
      #height;
      #cellSize = 15;
      #radius = 3;
      #vr = 0.03;
      #lastTime = 0;
      #interval = 1000 / 60;
      #timer = 0;
      #gradient;

      constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#createGradient();
        this.#ctx.strokeStyle = this.#gradient;
        this.#ctx.lineWidth = 1;
      }

      #createGradient() {
        this.#gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.#gradient.addColorStop(0.1, '#ff5c33');
        this.#gradient.addColorStop(0.2, '#ff66b3');
        this.#gradient.addColorStop(0.4, '#ccccff');
        this.#gradient.addColorStop(0.6, '#b3ffff');
        this.#gradient.addColorStop(0.8, '#80ff80');
        this.#gradient.addColorStop(0.9, '#ffff33');
      }

      #drawLine(angle, x, y) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        let distance = dx * dx + dy * dy;

        if (distance > 600000) distance = 600000;
        else if (distance < 50000) distance = 50000;

        const length = distance * 0.00005;

        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(
          x + Math.cos(angle) * length,
          y + Math.sin(angle) * length
        );
        this.#ctx.stroke();
      }

      animate(timeStamp) {
        const deltaTime = timeStamp - this.#lastTime;
        this.#lastTime = timeStamp;

        if (this.#timer > this.#interval) {
          this.#ctx.clearRect(0, 0, this.#width, this.#height);

          this.#radius += this.#vr;
          if (this.#radius > 5 || this.#radius < -5) {
            this.#vr *= -1;
          }

          for (let y = 0; y < this.#height; y += this.#cellSize) {
            for (let x = 0; x < this.#width; x += this.#cellSize) {
              const angle = (Math.cos(x * 0.007) + Math.sin(y * 0.007)) * this.#radius;
              this.#drawLine(angle, x, y);
            }
          }
          this.#timer = 0;
        } else {
          this.#timer += deltaTime;
        }

        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
      }
    }
  </script>
</body>
</html>
```

---

## 2. Trigonometric Formula Variations

### Symmetrical Circular Flow
```javascript
const angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.#radius;
```

### High-Frequency Wave Distortion
```javascript
const angle = (Math.cos(x * 0.05) + Math.sin(y * 0.05)) * this.#radius;
```

### Interactive Mouse-Distorted Swirl
```javascript
const angle = (Math.cos(mouse.x * x * 0.00001) + Math.sin(mouse.y * y * 0.00001)) * this.#radius;
```

### Radial Curvature Multiplier
```javascript
const angle = ((Math.cos(x * 0.005) + Math.sin(y * 0.005)) * 10) * this.#radius;
```
```

---

## Extraction & Compilation Summary

- **Total Knowledge Units Extracted**: 16 (4 Concepts, 5 Principles, 5 Procedures, 3 Constraints, 2 Worked Code Configurations).
- **Key Architectural Decisions Encapsulated**:
  1. **ES2022 `#` Private Class Syntax**: Fully adopted to protect canvas rendering state.
  2. **Trigonometric Offsets vs Matrix Transforms**: Replaced `ctx.save()/translate()/rotate()/restore()` with zero-overhead vector coordinate arithmetic (`x + cos(θ) * L`, `y + sin(θ) * L`).
  3. **Resize Race Condition Guard**: Handled via `cancelAnimationFrame` + explicit recreation of effect instances.
  4. **Performance Bounds**: Removed `Math.sqrt` in favor of squared distance comparisons; clamped grid resolution to scalable limits (`cellSize >= 10px`).
