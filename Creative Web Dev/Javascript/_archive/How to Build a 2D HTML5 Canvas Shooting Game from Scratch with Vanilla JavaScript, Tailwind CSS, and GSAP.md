# Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | `video-transcript` / `code-walkthrough` |
| **Title** | How to Build a 2D HTML5 Canvas Shooting Game from Scratch with Vanilla JavaScript, Tailwind CSS, and GSAP |
| **Authority** | Chris Courses (Chris Lis) — Web development & HTML5 Canvas game educator |
| **Coverage** | Canvas element configuration, full-screen responsive sizing, Object-Oriented Canvas Entity architecture (`Player`, `Projectile`, `Enemy`, `Particle`), Canvas 2D rendering API (`arc`, `fill`, `fillRect`, `save`, `restore`, `globalAlpha`), Trigonometric vector projection (`Math.atan2`, `Math.cos`, `Math.sin`), Animation loop lifecycle (`requestAnimationFrame`, `cancelAnimationFrame`), Periodic enemy perimeter spawning, Euclidean collision detection (`Math.hypot`), GSAP property tweening, particle explosion physics (velocity, friction, alpha decay), DOM UI layering with Tailwind CSS, and game lifecycle state management (`init`). |

### Coverage Gaps Identified
- Audio integration / Sound effects (not covered in source).
- Mobile touch controls / Multi-touch support (source focuses on desktop pointer `click` events).
- High score local storage persistence (score is reset in-memory per session).

---

# Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# TOPIC 1: CANVAS INITIALIZATION & VIEWPORT SIZING
# ==============================================================================

- id: ku-001
  type: concept
  name: HTML5 Canvas 2D Rendering Context
  source: src-01, "05:54 - 09:05"
  confidence: high
  definition: >
    The 2D rendering interface obtained from a canvas element via
    `canvas.getContext('2d')` that provides methods and properties for
    drawing shapes, paths, text, images, and managing alpha states.
  attributes: [context object, 2D API, coordinate space, global state machine]
  avoid_terms: [canvas engine, DOM drawer]
  related: [ku-002, ku-003]

- id: ku-002
  type: constraint
  name: Canvas Viewport Dimension Match
  source: src-01, "02:40 - 07:27"
  confidence: high
  rule: >
    Canvas internal buffer width and height (`canvas.width`, `canvas.height`)
    must be explicitly assigned to window dimensions (`window.innerWidth`,
    `window.innerHeight`), while resetting document body margin to 0.
  scope: Initialization and canvas resizing
  consequence: >
    Failing to set canvas internal dimensions leads to blurry stretching or default
    300x150 resolution constraints with default browser margins introducing scrollbars.
  enforced_by: Initialization procedure

- id: ku-003
  type: principle
  name: Subtractive Frame Clearing vs Alpha Trailing
  source: src-01, "36:41 - 37:45, 65:21 - 66:45"
  confidence: high
  statement: >
    Clearing with `c.clearRect(0, 0, width, height)` produces instantaneous clean frames,
    whereas drawing a semi-transparent rectangle (`c.fillStyle = 'rgba(0, 0, 0, 0.1)'; c.fillRect(...)`)
    produces persistent motion trails by retaining decaying pixel states from prior frames.
  rationale: >
    Semi-transparent overlays compound opacity over consecutive frames, creating
    aesthetic particle trails without maintaining historically retained position arrays.
  applies_to: [ku-020, ku-025]

# ==============================================================================
# TOPIC 2: OBJECT-ORIENTED ENTITY ARCHITECTURE
# ==============================================================================

- id: ku-004
  type: concept
  name: Canvas Entity Model
  source: src-01, "09:30 - 15:40"
  confidence: high
  definition: >
    An object-oriented class pattern encapsulating entity coordinates (x, y),
    geometric radius, color, velocity vector, and rendering/update methods.
  attributes: [constructor, draw method, update method, spatial coordinates]
  avoid_terms: [sprite object, game actor]
  related: [ku-005, ku-006, ku-007, ku-008]

- id: ku-005
  type: procedure
  name: Player Entity Construction
  source: src-01, "09:30 - 17:01"
  confidence: high
  goal: Create a static player anchored at the viewport center
  steps:
    - action: Define Player class with x, y, radius, and color attributes
      criterion: Class stores spatial center coordinates
    - action: Implement draw() method using beginPath(), arc(x, y, radius, 0, Math.PI * 2, false), and fill()
      criterion: Draws a 360-degree circle with assigned fillStyle
    - action: Instantiate Player at (canvas.width / 2, canvas.height / 2)
      criterion: Player rendered exactly in screen center
  outputs: [Player class, player instance]

- id: ku-006
  type: procedure
  name: Dynamic Projectile Modeling
  source: src-01, "17:45 - 23:05, 30:23 - 33:05"
  confidence: high
  goal: Instantiate and manage velocity-driven projectile entities
  steps:
    - action: Define Projectile class storing x, y, radius, color, and {x, y} velocity vector
      criterion: Projectile contains directional speed
    - action: Implement update() method incrementing coordinates by velocity components (x += velocity.x, y += velocity.y)
      criterion: Position shifts on every update call
    - action: Maintain a global `projectiles = []` array
      criterion: Projectiles iterable in animation loop
  outputs: [Projectile class, projectiles array]

- id: ku-007
  type: procedure
  name: Enemy Entity Generation & Perimeter Spawning
  source: src-01, "38:17 - 53:30"
  confidence: high
  goal: Periodically spawn enemies outside the viewport directed toward player
  steps:
    - action: Define Enemy class matching entity drawing/update interface
      criterion: Enemy updates along linear trajectory
    - action: Execute a setInterval timer (e.g., 1000ms)
      criterion: Recurrent execution established
    - action: Compute perimeter spawn coordinate using random ternary logic (50/50 X-axis vs Y-axis boundary selection)
      criterion: Enemies spawn strictly outside canvas viewports (x < 0 or x > width; y < 0 or y > height)
    - action: Derive normalized velocity vector from spawn coordinate to player center using Math.atan2
      criterion: Velocity vector drives enemy directly toward (canvas.width / 2, canvas.height / 2)
    - action: Push enemy instance into `enemies = []` array
      criterion: Enemy added to active pool
  outputs: [Enemy class, spawnEnemies function, enemies array]

- id: ku-008
  type: procedure
  name: Particle Explosion Modeling
  source: src-01, "80:45 - 92:10"
  confidence: high
  goal: Generate bursting particle debris with velocity friction and opacity fading upon impact
  steps:
    - action: Define Particle class containing alpha (1), friction (0.99), radius, color, and randomized velocity vector
      criterion: Particle encapsulates decay and drag properties
    - action: Enclose rendering in context save() and restore() blocks using c.globalAlpha = this.alpha
      criterion: Alpha state changes do not leak to global canvas rendering
    - action: Multiply velocity by friction on each frame (velocity.x *= friction, velocity.y *= friction)
      criterion: Particles decelerate smoothly over time
    - action: Decrement alpha linearly (alpha -= 0.01)
      criterion: Alpha decays toward 0
    - action: Purge particle from array when alpha <= 0
      criterion: Dead particles removed from memory and rendering passes
  outputs: [Particle class, particles array]

# ==============================================================================
# TOPIC 3: VECTOR MATHEMATICS & TRIGONOMETRY
# ==============================================================================

- id: ku-009
  type: principle
  name: Two-Point Angle Derivation via atan2
  source: src-01, "31:12 - 36:35"
  confidence: high
  statement: >
    The angle θ from point A (source) to point B (target) is calculated as
    `Math.atan2(target.y - source.y, target.x - source.x)`.
  rationale: >
    `Math.atan2` takes the delta-y and delta-x components of the right triangle and
    returns the exact angle in radians (-π to +π) across all four quadrants without division-by-zero errors.
  applies_to: [ku-006, ku-007]

- id: ku-010
  type: principle
  name: Velocity Vector Resolution via Sine and Cosine
  source: src-01, "35:30 - 37:00, 68:05 - 69:10"
  confidence: high
  statement: >
    Directional velocity components along Cartesian axes are resolved from angle θ and scalar speed `s`
    as `velocity.x = Math.cos(θ) * s` and `velocity.y = Math.sin(θ) * s`.
  rationale: >
    Cosine represents the adjacent-over-hypotenuse ratio (horizontal vector scale) and
    Sine represents the opposite-over-hypotenuse ratio (vertical vector scale).
  applies_to: [ku-006, ku-007, ku-008]

- id: ku-011
  type: principle
  name: Random Bipolar Velocity Dispersion
  source: src-01, "83:30 - 87:30"
  confidence: high
  statement: >
    Random velocity spread in all 360-degree directions is computed as
    `velocity = (Math.random() - 0.5) * power`.
  rationale: >
    `Math.random()` produces [0, 1). Subtracting 0.5 shifts the distribution to [-0.5, 0.5),
    providing equal probability of negative and positive directional impulses across both axes.
  applies_to: [ku-008]

# ==============================================================================
# TOPIC 4: SPATIAL COLLISION DETECTION & GC SANITIZATION
# ==============================================================================

- id: ku-012
  type: principle
  name: Circle-to-Circle Collision Distance Test
  source: src-01, "53:30 - 55:15, 58:20 - 59:40"
  confidence: high
  statement: >
    Two circles collide when the Euclidean distance `d = Math.hypot(A.x - B.x, A.y - B.y)`
    minus both radii `(A.radius + B.radius)` is strictly less than 1 (or d < A.radius + B.radius).
  rationale: >
    `Math.hypot` calculates `√(Δx² + Δy²)`. When the distance between center points is less
    than the combined radii, the bounding perimeters overlap.
  applies_to: [ku-013, ku-014]

- id: ku-013
  type: constraint
  name: Zero-Timeout Splicing for Render Cycle Stability
  source: src-01, "57:05 - 58:10, 72:30 - 74:50"
  confidence: high
  rule: >
    Array mutations (`splice`) during nested `.forEach()` collision loops must be deferred
    to the next tick via `setTimeout(() => { array.splice(index, 1); }, 0)` when concurrent
    rendering passes access the element within the same frame.
  scope: Active animation and collision loop
  consequence: >
    Immediate in-loop splicing causes index shifting mid-iteration, producing visible
    single-frame rendering flashes, skipped element checks, and undefined reference exceptions.
  enforced_by: Collision handler implementations

- id: ku-014
  type: procedure
  name: Off-Screen Entity Garbage Collection
  source: src-01, "61:05 - 65:05"
  confidence: high
  goal: Remove projectiles that leave viewport bounds to prevent unbounded memory leaks
  steps:
    - action: Evaluate boundary condition: `projectile.x + radius < 0 || projectile.x - radius > canvas.width || projectile.y + radius < 0 || projectile.y - radius > canvas.height`
      criterion: Detection matches complete viewport departure
    - action: Defer splice of projectile from `projectiles` array via `setTimeout(..., 0)`
      criterion: Projectile removed without disrupting active forEach traversal
  outputs: [Sanitized projectiles array]

# ==============================================================================
# TOPIC 5: GSAP TWEENING & TRANSITIONS
# ==============================================================================

- id: ku-015
  type: procedure
  name: Smooth Entity Radius Shrinking via GSAP
  source: src-01, "71:15 - 77:30"
  confidence: high
  goal: Smoothly interpolate enemy radius down upon non-lethal projectile hit
  steps:
    - action: Check if `enemy.radius - shrinkAmount > minRadiusThreshold` (e.g., -10 > 5)
      criterion: Determines if hit is non-lethal
    - action: Execute `gsap.to(enemy, { radius: enemy.radius - shrinkAmount })`
      criterion: GSAP smoothly interpolates radius over standard tween duration
    - action: Remove projectile with deferred splice
      criterion: Projectile consumed while enemy remains alive with reduced radius
  outputs: [Interpolated enemy state]

# ==============================================================================
# TOPIC 6: UI LAYERING & GAME LIFECYCLE MANAGEMENT
# ==============================================================================

- id: ku-016
  type: principle
  name: HTML/CSS Overlay DOM Layering over Canvas Text
  source: src-01, "94:10 - 95:50"
  confidence: high
  statement: >
    UI elements (scores, modal dialogs, buttons) should be constructed as HTML DOM elements
    styled with CSS utility classes (e.g. Tailwind `fixed inset-0`) layered over the canvas
    rather than painted directly with `context.fillText()`.
  rationale: >
    DOM text is anti-aliased, responsive, accessible, unaffected by canvas clear cycles,
    and supports standard interactive event listeners without canvas raycasting.
  applies_to: [ku-017, ku-018]

- id: ku-017
  type: procedure
  name: Game State Lifecycle Management & Reset Routine
  source: src-01, "100:00 - 110:00"
  confidence: high
  goal: Implement comprehensive state initialization and restart functionality
  steps:
    - action: Define `init()` function resetting entity arrays (`projectiles = []`, `enemies = []`, `particles = []`), instantiating fresh `player`, resetting `score = 0`, and updating DOM score displays
      criterion: Memory and visual state reset to baseline
    - action: Store animation frame reference `animationId = requestAnimationFrame(animate)`
      criterion: Animation loop handle stored
    - action: Terminate loop on game over via `cancelAnimationFrame(animationId)` and `clearInterval(spawnIntervalId)`
      criterion: Frame rendering and spawning halted immediately
    - action: Toggle modal visibility by altering `modalEl.style.display` ('flex' vs 'none')
      criterion: Modal UI displays on game-over and hides on game start
  outputs: [init function, game loop controller, modal state handlers]
```

---

# Phase 3: Methodology Synthesis

```
================================================================================
OPERATIONAL METHODOLOGY: HTML5 2D CANVAS ARCADE GAME DEVELOPMENT
================================================================================

STAGE 1: Environment & Canvas Viewport Setup
  INPUT: HTML boilerplate, Canvas DOM element, Tailwind CSS, GSAP CDN.
  STEPS:
    1. Select canvas element and extract 2D context (`c = canvas.getContext('2d')`).
    2. Bind `canvas.width` and `canvas.height` to `window.innerWidth` and `window.innerHeight`.
    3. Reset document body margins and overflow to 0 via CSS/Tailwind.
  OUTPUT: Full-screen, crisp 2D canvas context.
  VALIDATION:
    [ ] Canvas covers 100% viewport without scrollbars
    [ ] Context scale is 1:1 with device viewport coordinates

STAGE 2: Entity Architecture & Player Initialization
  INPUT: Canvas context, viewport dimensions.
  STEPS:
    1. Define `Player` class with `(x, y, radius, color)` and `draw()` path method.
    2. Instantiate `player` anchored at `(canvas.width / 2, canvas.height / 2)`.
  OUTPUT: Operational player entity rendered at exact screen center.
  VALIDATION:
    [ ] Player circle renders crisply at screen center

STAGE 3: Projectile Modeling & Trigonometric Aiming
  INPUT: Player position, user pointer event coordinates (`event.clientX`, `event.clientY`).
  STEPS:
    1. Define `Projectile` class with `(x, y, radius, color, velocity)`.
    2. Bind pointer `click` event listener.
    3. Compute aim angle: `θ = Math.atan2(event.clientY - player.y, event.clientX - player.x)`.
    4. Compute Cartesian velocity: `velocity = { x: Math.cos(θ) * speed, y: Math.sin(θ) * speed }`.
    5. Instantiate projectile at player center and push to `projectiles` array.
  OUTPUT: Aim-accurate projectiles moving along linear trajectories.
  VALIDATION:
    [ ] Projectile trajectory intersects exact click location

STAGE 4: Autonomous Perimeter Enemy Generation
  INPUT: Viewport dimensions, target player position.
  STEPS:
    1. Define `Enemy` class with geometric and trajectory attributes.
    2. Establish recursive interval (`setInterval(spawnEnemies, 1000)`).
    3. Select perimeter coordinate: Randomly select X or Y axis, placing enemy at boundary (-radius or canvas.dimension + radius).
    4. Compute normalized trajectory toward player using `Math.atan2`.
    5. Push randomized enemy (random radius [4..30], random HSL hue) to `enemies` array.
  OUTPUT: Perpetual stream of diverse enemies converging on player.
  VALIDATION:
    [ ] Enemies spawn strictly outside visible viewport edges
    [ ] Trajectory heads directly toward screen center

STAGE 5: Dynamic Particle Explosion System
  INPUT: Collision coordinates, enemy color/radius.
  STEPS:
    1. Define `Particle` class with velocity decay (`friction = 0.99`), opacity fade (`alpha = 1`, `alpha -= 0.01`), and `save()`/`restore()` isolated canvas context wrapper.
    2. On enemy hit, iterate a loop (`enemy.radius * 2` particles).
    3. Generate randomized bipolar velocity: `(Math.random() - 0.5) * power`.
    4. Push particles to `particles` array; remove dead particles when `alpha <= 0`.
  OUTPUT: Firework-like particle bursts upon entity destruction.
  VALIDATION:
    [ ] Particles explode radially from collision point
    [ ] Particles decelerate and fade cleanly without visual artifacts

STAGE 6: Collision Detection, Hit Resolution & Entity Shrinking
  INPUT: Active `projectiles`, `enemies`, and `player` instances.
  STEPS:
    1. Within animation loop, iterate nested checks: `enemies` vs `player`, and `enemies` vs `projectiles`.
    2. Calculate distance: `d = Math.hypot(A.x - B.x, A.y - B.y)`.
    3. Check `d - A.radius - B.radius < 1`:
       - If Player hit → Cancel animation loop (`cancelAnimationFrame`), display Game Over modal.
       - If Projectile hit & `enemy.radius - 10 > 5` → Tween radius with `gsap.to()`, remove projectile.
       - If Projectile hit & lethal → Spawn explosion particles, remove projectile and enemy via `setTimeout(..., 0)`.
    4. Increment score based on action (hit: +100, kill: +250) and update DOM UI.
  OUTPUT: Fully interactive combat loop with hit feedback and scoring.
  VALIDATION:
    [ ] Collision registers when circle perimeters intersect
    [ ] No rendering flashes or missed frames during entity removal

STAGE 7: Motion Trailing, UI & Lifecycle State Control
  INPUT: Game state variables, DOM modal elements.
  STEPS:
    1. Replace `clearRect` with semi-transparent fill (`rgba(0, 0, 0, 0.1)`) for light-trail effects.
    2. Overlay Tailwind CSS DOM markup for score indicator and start/restart modal (`fixed inset-0 flex items-center justify-center`).
    3. Implement `init()`: reset arrays, score, spawn timers, and instantiate clean player.
    4. Bind Start/Restart button to invoke `init()`, hide modal, and initiate `animate()`.
  OUTPUT: Production-ready playable game with complete lifecycle.
  VALIDATION:
    [ ] Restart resets score and screen without lingering state
    [ ] Motion trails render smoothly behind fast-moving entities
```

---

# Phase 4: Skill Compilation

Below is the complete, validated agent skill package compiled according to the Source-to-Skill specification.

--- START OF FILE canvas-2d-game-engine/SKILL.md ---

---
name: canvas-2d-game-engine
description: |
  Build high-performance 2D HTML5 Canvas arcade games with JavaScript, Tailwind CSS, and GSAP.
  Use when: creating canvas games from scratch, implementing 2D shooting/movement mechanics,
  writing particle explosion systems, vector trajectory aiming, collision detection, and canvas animation lifecycles.
  Triggers: build canvas game, 2d canvas shooter, html5 game from scratch, canvas particle system, canvas collision detection.
---

# Canvas 2D Game Engine

Architect, implement, and optimize 2D action/arcade games on the HTML5 Canvas using vanilla JavaScript, vector mathematics, hardware-accelerated animation loops, and modern DOM overlay UI patterns.

## Ground Rules

- **Pure Canvas Render Pipeline**: Never use DOM elements for in-game entities. Use HTML5 Canvas 2D context for game rendering.
- **Pure DOM UI Layer**: Never paint scores, buttons, or dialogs using `c.fillText()`. Layer anti-aliased DOM elements over the canvas via fixed positioning.
- **Trigonometric Directionality**: Always resolve 2D velocities from angles via `Math.atan2`, `Math.cos`, and `Math.sin`.
- **Render-Loop Integrity**: Always defer array pruning (`splice`) within concurrent render loops via zero-delay timeouts (`setTimeout(..., 0)`).
- **Context Isolation**: Always wrap alpha, transformation, or blend mode changes in `c.save()` and `c.restore()`.

---

## Phase 1: Viewport & Canvas Initialization

Establish a responsive, zero-margin 2D rendering buffer synchronized with the browser viewport.

1. Create a minimal HTML layout containing a `<canvas id="canvas"></canvas>`.
2. Select the canvas and extract its 2D rendering context:
   ```javascript
   const canvas = document.querySelector('canvas')
   const c = canvas.getContext('2d')
   ```
3. Set the internal coordinate buffer dimensions directly to window viewport dimensions:
   ```javascript
   canvas.width = window.innerWidth
   canvas.height = window.innerHeight
   ```
4. Reset CSS margin and hide overflow on the document body (`margin: 0; overflow: hidden; background: black;`).

### Completion gate
- [ ] Canvas internal buffer matches `window.innerWidth` and `window.innerHeight`
- [ ] Canvas covers 100% of the viewport with no scrollbars

---

## Phase 2: Entity Modeling (OOP Architecture)

Construct modular entity classes sharing a standardized spatial interface: `(x, y, radius, color, velocity)`.

1. **Player Entity**: Construct a circular entity anchored at viewport center `(canvas.width / 2, canvas.height / 2)`.
2. **Projectile Entity**: Construct dynamic circular entities driven by Cartesian velocity vectors (`x += velocity.x`, `y += velocity.y`).
3. **Enemy Entity**: Construct converging circular entities with dynamic radii and variable speeds.
4. **Particle Entity**: Construct decaying debris entities with drag physics (`friction = 0.99`) and linear alpha fading.

For complete mathematical definitions and physics equations, see [math-and-physics.md](references/math-and-physics.md).  
For structural class implementations, see [examples.md](references/examples.md).

### Completion gate
- [ ] Every entity implements isolated `draw(c)` and `update()` methods
- [ ] Entity classes preserve coordinates, radius, color, and velocity fields

---

## Phase 3: Projectile Trajectory & Aim Mechanics

Resolve pointer click events into normalized velocity vectors originating from the player center.

1. Bind a `'click'` event listener to `window`.
2. Extract click coordinates (`event.clientX`, `event.clientY`).
3. Compute the angle θ from player center to pointer:
   ```javascript
   const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
   ```
4. Resolve directional velocity vector multiplied by scalar speed `s`:
   ```javascript
   const velocity = {
     x: Math.cos(angle) * s,
     y: Math.sin(angle) * s
   }
   ```
5. Instantiate `new Projectile(...)` at player center and push into the active `projectiles` array.

### Completion gate
- [ ] Projectiles travel along exact radial vector toward click target
- [ ] Speed is uniform across all firing angles

---

## Phase 4: Autonomous Perimeter Enemy Spawning

Generate enemies outside viewport boundaries and direct them toward the player.

1. Implement `spawnEnemies()` running on an interval (e.g. `setInterval(..., 1000)`).
2. Compute a randomized perimeter coordinate using binary selection (50% chance X-axis edge, 50% chance Y-axis edge):
   - **X-axis Edge**: `x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius; y = Math.random() * canvas.height`
   - **Y-axis Edge**: `x = Math.random() * canvas.width; y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius`
3. Randomize enemy radius between bounds (e.g. `Math.random() * (30 - 4) + 4`).
4. Generate randomized HSL color: `'hsl(' + Math.random() * 360 + ', 50%, 50%)'`.
5. Compute normalized angle toward player center `(canvas.width / 2, canvas.height / 2)` using `Math.atan2`.
6. Instantiate `new Enemy(...)` and push into `enemies` array.

### Completion gate
- [ ] Enemies spawn strictly outside the visible screen perimeter
- [ ] Enemies move directly toward the center player coordinate

---

## Phase 5: Frame Trailing & Core Animation Loop

Implement a 60 FPS update-render loop utilizing `requestAnimationFrame` with particle trail persistence.

1. Define recursive `animate()` function storing frame handle:
   ```javascript
   let animationId
   function animate() {
     animationId = requestAnimationFrame(animate)
     // Render steps
   }
   ```
2. Clear the canvas using a semi-transparent overlay to produce motion trails:
   ```javascript
   c.fillStyle = 'rgba(0, 0, 0, 0.1)'
   c.fillRect(0, 0, canvas.width, canvas.height)
   ```
3. Render static entities: `player.draw()`.
4. Update and render active entity arrays (`particles`, `projectiles`, `enemies`).
5. Filter off-screen projectiles to prevent memory leaks:
   ```javascript
   if (projectile.x + projectile.radius < 0 ||
       projectile.x - projectile.radius > canvas.width ||
       projectile.y + projectile.radius < 0 ||
       projectile.y - projectile.radius > canvas.height) {
     setTimeout(() => { projectiles.splice(index, 1) }, 0)
   }
   ```

### Completion gate
- [ ] `requestAnimationFrame` drives the loop smoothly
- [ ] Moving entities leave smooth, decaying motion trails
- [ ] Off-screen projectiles are garbage-collected

---

## Phase 6: Spatial Collision Detection & FX Resolution

Evaluate circle-to-circle distances each frame and trigger particle explosions, smooth shrinking, or game termination.

1. **Player-Enemy Collision Check**:
   - For each enemy, compute distance `dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)`.
   - If `dist - enemy.radius - player.radius < 1`:
     - Halt loop: `cancelAnimationFrame(animationId)`.
     - Halt spawning: `clearInterval(spawnIntervalId)`.
     - Reveal Game Over modal DOM element.

2. **Projectile-Enemy Collision Check**:
   - For each enemy and projectile pair, compute distance:
     ```javascript
     const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
     ```
   - When `dist - enemy.radius - projectile.radius < 1`:
     - **Particle Burst**: Instantiate radial particles (`count = enemy.radius * 2`):
       ```javascript
       for (let i = 0; i < enemy.radius * 2; i++) {
         particles.push(new Particle(
           projectile.x, projectile.y,
           Math.random() * 2, enemy.color,
           { x: (Math.random() - 0.5) * (Math.random() * 6),
             y: (Math.random() - 0.5) * (Math.random() * 6) }
         ))
       }
       ```
     - **Enemy Shrink (Non-Lethal)**: If `enemy.radius - 10 > 5`:
       - Increase score by 100.
       - Smoothly tween radius using GSAP: `gsap.to(enemy, { radius: enemy.radius - 10 })`.
       - Remove projectile via deferred splice: `setTimeout(() => { projectiles.splice(pIndex, 1) }, 0)`.
     - **Enemy Kill (Lethal)**: If `enemy.radius - 10 <= 5`:
       - Increase score by 250.
       - Remove enemy and projectile via deferred splice:
         ```javascript
         setTimeout(() => {
           enemies.splice(eIndex, 1)
           projectiles.splice(pIndex, 1)
         }, 0)
         ```

For domain terms, see [terminology.md](references/terminology.md).

### Completion gate
- [ ] Collisions trigger instantly upon perimeter contact
- [ ] Non-lethal hits shrink enemies smoothly via GSAP
- [ ] Explosions spawn particles adopting enemy color
- [ ] All deletions use zero-timeout splicing

---

## Phase 7: DOM UI Layering & State Reset (`init`)

Encapsulate full lifecycle management, score synchronization, and responsive overlay styling with Tailwind CSS.

1. Build fixed UI overlays above the canvas:
   - Score HUD: Top-left `fixed text-white text-sm ml-2 mt-1 select-none`.
   - Start/Game Over Modal: Centered overlay `fixed inset-0 flex items-center justify-center select-none`.
2. Construct the `init()` function:
   ```javascript
   function init() {
     player = new Player(canvas.width / 2, canvas.height / 2, 10, 'white')
     projectiles = []
     enemies = []
     particles = []
     score = 0
     scoreEl.innerHTML = score
     bigScoreEl.innerHTML = score
   }
   ```
3. Wire the Start/Restart button:
   ```javascript
   startGameBtn.addEventListener('click', () => {
     init()
     animate()
     spawnEnemies()
     modalEl.style.display = 'none'
   })
   ```

### Completion gate
- [ ] Game starts cleanly only after user clicks Start button
- [ ] Game Over displays final score and restart button
- [ ] Restart clears lingering entities, resets score to 0, and relaunches loop

--- END OF FILE canvas-2d-game-engine/SKILL.md ---

--- START OF FILE canvas-2d-game-engine/references/terminology.md ---

# Terminology

**2D Rendering Context (`CanvasRenderingContext2D`)**:
The drawing state machine interface obtained from a `<canvas>` element providing immediate-mode rasterization methods.
_Avoid_: canvas engine, graphics driver, canvas DOM.

**Immediate-Mode Rendering**:
A rendering paradigm where graphics commands directly modify pixel buffers each frame without maintaining an internal scene graph.
_Avoid_: retained mode, DOM graphics.

**Normalized Velocity Vector**:
A directional magnitude pair `{x, y}` scaled between -1 and +1 derived from trigonometric functions representing heading per unit of time.
_Avoid_: angle delta, speed coordinates.

**Euclidean Distance**:
The straight-line length between two points in Cartesian space computed as `√(Δx² + Δy²)`.
_Avoid_: bounding box distance, grid step.

**Zero-Timeout Splicing**:
The practice of wrapping array `splice` operations in `setTimeout(..., 0)` to defer array mutation until the current call stack and loop iteration resolve.
_Avoid_: direct splicing, in-place deletion, immediate slice.

**Alpha Trailing (Motion Trail)**:
A visual technique where the background is redrawn each frame using a low-opacity fill (`rgba(0, 0, 0, 0.1)`) instead of full clearing, causing past pixels to fade progressively.
_Avoid_: ghost blur, motion blur filter.

**Tweening**:
The automatic interpolation of object properties across time using mathematical easing functions.
_Avoid_: frame jumping, manual stepping.

--- END OF FILE canvas-2d-game-engine/references/terminology.md ---

--- START OF FILE canvas-2d-game-engine/references/math-and-physics.md ---

# Math & Physics Reference

Mathematical formulas and physics calculations used in 2D canvas games.

## 1. Angle Between Two Coordinates

To calculate the directional angle $\theta$ in radians from source point $(x_1, y_1)$ to destination point $(x_2, y_2)$:

$$\theta = \text{atan2}(y_2 - y_1, x_2 - x_1)$$

```javascript
const angle = Math.atan2(targetY - sourceY, targetX - sourceX)
```

## 2. Resolving Cartesian Velocities

To project an angle $\theta$ and scalar speed $s$ into directional velocity components:

$$v_x = \cos(\theta) \cdot s$$
$$v_y = \sin(\theta) \cdot s$$

```javascript
const velocity = {
  x: Math.cos(angle) * speed,
  y: Math.sin(angle) * speed
}
```

## 3. Euclidean Distance & Circle Collision

The distance $d$ between two circular bodies $A$ and $B$:

$$d = \sqrt{(A_x - B_x)^2 + (A_y - B_y)^2}$$

Using `Math.hypot`:

```javascript
const dist = Math.hypot(A.x - B.x, A.y - B.y)
const isColliding = (dist - A.radius - B.radius) < 1
```

## 4. Bipolar Particle Dispersion & Drag (Friction)

Randomized velocity with equal bidirectional dispersion and exponential deceleration:

```javascript
// Initial impulse
const velocity = {
  x: (Math.random() - 0.5) * (Math.random() * maxPower),
  y: (Math.random() - 0.5) * (Math.random() * maxPower)
}

// Frame update with drag
const friction = 0.99
velocity.x *= friction
velocity.y *= friction
```

## 5. Viewport Perimeter Spawning Logic

To distribute entity spawn points uniformly around the four outer edges of a screen:

```javascript
let x, y
const radius = Math.random() * (30 - 4) + 4

if (Math.random() < 0.5) {
  // Horizontal bounds (Left or Right)
  x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
  y = Math.random() * canvas.height
} else {
  // Vertical bounds (Top or Bottom)
  x = Math.random() * canvas.width
  y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
}
```

--- END OF FILE canvas-2d-game-engine/references/math-and-physics.md ---

--- START OF FILE canvas-2d-game-engine/references/examples.md ---

# Implementation Templates & Examples

Complete code templates for all core engine modules.

## Complete JavaScript Architecture Template

```javascript
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const bigScoreEl = document.querySelector('#bigScoreEl')

// ==========================================
// ENTITY CLASSES
// ==========================================

class Player {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x += this.velocity.x
    this.y += this.velocity.y
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x += this.velocity.x
    this.y += this.velocity.y
  }
}

const friction = 0.99
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1
  }

  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.alpha -= 0.01
  }
}

// ==========================================
// STATE & CONTROLLERS
// ==========================================

let player = new Player(canvas.width / 2, canvas.height / 2, 10, 'white')
let projectiles = []
let enemies = []
let particles = []
let animationId
let score = 0
let spawnIntervalId

function init() {
  player = new Player(canvas.width / 2, canvas.height / 2, 10, 'white')
  projectiles = []
  enemies = []
  particles = []
  score = 0
  scoreEl.innerHTML = score
  bigScoreEl.innerHTML = score
}

function spawnEnemies() {
  spawnIntervalId = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4
    let x, y

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }

    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()

  // Particle updates
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  })

  // Projectile bounds cleanup
  projectiles.forEach((projectile, index) => {
    projectile.update()
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
  })

  // Enemy collision testing
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update()

    // End Game: Enemy hits Player
    const distPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    if (distPlayer - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
      clearInterval(spawnIntervalId)
      modalEl.style.display = 'flex'
      bigScoreEl.innerHTML = score
    }

    // Hit Detection: Projectile hits Enemy
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      if (dist - enemy.radius - projectile.radius < 1) {
        // Explosion particles
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6)
              }
            )
          )
        }

        // Enemy radius shrink vs kill
        if (enemy.radius - 10 > 5) {
          score += 100
          scoreEl.innerHTML = score
          gsap.to(enemy, { radius: enemy.radius - 10 })
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1)
          }, 0)
        } else {
          score += 250
          scoreEl.innerHTML = score
          setTimeout(() => {
            enemies.splice(enemyIndex, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0)
        }
      }
    })
  })
}

// ==========================================
// EVENT LISTENERS
// ==========================================

window.addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }
  projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity))
})

startGameBtn.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  modalEl.style.display = 'none'
})
```

--- END OF FILE canvas-2d-game-engine/references/examples.md ---

---

# Phase 5: Validation & Delivery

### 1. Source Fidelity Verification
- **All Knowledge Units Accounted For**:
  - `ku-001` - `ku-003` (Canvas Setup & Trailing): Encoded in Phase 1 and Phase 5 of `SKILL.md`.
  - `ku-004` - `ku-008` (Entity Classes): Encoded in Phase 2 and `references/examples.md`.
  - `ku-009` - `ku-011` (Vector Trig & Math): Encoded in Phase 3, Phase 4, and `references/math-and-physics.md`.
  - `ku-012` - `ku-014` (Collisions & Zero-Timeout Splice): Encoded in Phase 6 and `Ground Rules`.
  - `ku-015` (GSAP Shrinking): Encoded in Phase 6.
  - `ku-016` - `ku-017` (DOM Layering & Lifecycle State): Encoded in Phase 7 and `references/examples.md`.

### 2. Operational Test Scenarios
1. **Scenario A (Entity Flashing & Index Shift Fix)**: A fast-firing projectile collides with multiple enemies in the same frame.
   - *Verification*: Handled via zero-timeout splicing (`setTimeout(..., 0)`), preventing index skipping.
2. **Scenario B (Perimeter Spawning Coverage)**: Spawn calls generate enemies from all 4 screen edges without clipping the center player.
   - *Verification*: 50/50 ternary algorithm places enemies at coordinate offsets $\pm \text{radius}$.
3. **Scenario C (Memory Leak Mitigation)**: Player shoots 500 projectiles into open space.
   - *Verification*: Boundary cleanup checks purge projectiles once fully outside screen limits.

### 3. Extraction Summary
- **Total Knowledge Units**: 17 atomic units extracted across 6 key architectural domains.
- **Key Methodologies Operationalized**: OOP Canvas Entity Pattern, Cartesian Angle Resolution, Zero-Timeout DOM Loop Mutation, GSAP Canvas Property Tweening, and Tailwind Fixed-Inset Layering.
