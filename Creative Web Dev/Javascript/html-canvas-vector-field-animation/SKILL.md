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
