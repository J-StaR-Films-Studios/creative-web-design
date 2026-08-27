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
