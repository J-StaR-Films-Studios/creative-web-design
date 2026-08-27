# Canvas 2D & Particle Systems

Architect physics-driven particle simulations derived from imagery or typography.

## 1. ImageData to Particle Array Mapping

To turn an image or text into particles, draw it to an offscreen canvas, extract the pixel data, and convert it to anchor points.

```javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
ctx.drawImage(image, 0, 0, width, height);

const pixels = ctx.getImageData(0, 0, width, height).data;
const particles = [];
const density = 4; // Skip pixels for performance

for (let y = 0; y < height; y += density) {
  for (let x = 0; x < width; x += density) {
    const stride = (y * width + x) * 4;
    const alpha = pixels[stride + 3];
    
    // Only capture opaque pixels
    if (alpha > 128) {
      particles.push({
        x: Math.random() * width, // Random spawn
        y: Math.random() * height,
        baseX: x,                 // Anchor memory
        baseY: y,
        color: `rgb(${pixels[stride]}, ${pixels[stride+1]}, ${pixels[stride+2]})`,
        vx: 0,
        vy: 0
      });
    }
  }
}
```

## 2. Spring Physics and Friction

Update particles on every RequestAnimationFrame to seek their `baseX/baseY`.

```javascript
function updateParticles(mouse) {
  const friction = 0.85;
  const ease = 0.1;

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // Distance from mouse
    let dx = mouse.x - p.x;
    let dy = mouse.y - p.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    // Mouse repulsion force
    if (distance < 100) {
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let force = (100 - distance) / 100;
      
      p.vx -= forceDirectionX * force * 5;
      p.vy -= forceDirectionY * force * 5;
    }

    // Spring back to base anchor
    p.vx += (p.baseX - p.x) * ease;
    p.vy += (p.baseY - p.y) * ease;

    // Apply friction
    p.vx *= friction;
    p.vy *= friction;

    // Update position
    p.x += p.vx;
    p.y += p.vy;
  }
}
```
