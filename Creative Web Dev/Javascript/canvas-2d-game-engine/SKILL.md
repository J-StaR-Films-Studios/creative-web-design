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
