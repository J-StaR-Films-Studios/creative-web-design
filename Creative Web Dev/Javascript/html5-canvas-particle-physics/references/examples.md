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
