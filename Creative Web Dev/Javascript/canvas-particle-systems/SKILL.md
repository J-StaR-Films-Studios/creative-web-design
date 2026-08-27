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
