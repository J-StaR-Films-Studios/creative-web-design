# Canvas 2D & Particles

Techniques for interactive pixel manipulation and physics.

## 1. ImageData Extraction
Extract pixel data to seed particle coordinates.
```javascript
const ctx = canvas.getContext('2d', { willReadFrequently: true });
ctx.drawImage(image, 0, 0);
const imageData = ctx.getImageData(0, 0, width, height).data;

const particles = [];
const stride = 4; // Skip pixels for performance
for (let y = 0; y < height; y += stride) {
  for (let x = 0; x < width; x += stride) {
    const index = (y * width + x) * 4;
    const alpha = imageData[index + 3];
    if (alpha > 128) {
      particles.push({
        x: x, y: y, // Current
        originX: x, originY: y, // Anchor
        vx: 0, vy: 0, // Velocity
        color: `rgb(${imageData[index]},${imageData[index+1]},${imageData[index+2]})`
      });
    }
  }
}
```

## 2. Spring Anchor Physics
Calculate mouse repulsion and return-to-origin physics in the RAF loop.
```javascript
function updateParticles(mouse) {
  const mouseForce = 10000;
  const spring = 0.05;
  const friction = 0.9;

  for (let p of particles) {
    // Distance to mouse
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const distSq = dx*dx + dy*dy;

    // Mouse repulsion
    if (distSq < 10000) {
      const force = mouseForce / distSq;
      p.vx += (dx / Math.sqrt(distSq)) * force;
      p.vy += (dy / Math.sqrt(distSq)) * force;
    }

    // Spring back to origin
    p.vx += (p.originX - p.x) * spring;
    p.vy += (p.originY - p.y) * spring;

    // Apply velocity and friction
    p.vx *= friction;
    p.vy *= friction;
    p.x += p.vx;
    p.y += p.vy;
  }
}
```
