# Master Creative Web Development Production Recipes

Complete, production-grade, end-to-end code recipes implementing signature Awwwards/FWA-tier creative development interactions.

---

## Recipe 1: Text-to-Sand / Dust Particle Decomposition & Reconstruction

A standalone HTML5 Canvas 2D engine that rasterizes typography, decomposes it into thousands of physics particles, scatters them under cursor proximity, and elastically reconstructs the text via anchor memory.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sand Typography Particle Physics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0c; overflow: hidden; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="particleCanvas"></canvas>

  <script>
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let width, height, dpr;
    let particles = [];
    const mouse = { x: -1000, y: -1000, radius: 100 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);

      initTextParticles();
    }

    class SandParticle {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 20;
        this.y = y + (Math.random() - 0.5) * 20;
        this.baseX = x;
        this.baseY = y;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 1.5 + 1.0;
        this.density = Math.random() * 25 + 10;
        this.friction = 0.90;
        this.springFactor = 0.08;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Repulsion force field
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          const nx = dx / dist;
          const ny = dy / dist;
          this.vx -= nx * force * this.density;
          this.vy -= ny * force * this.density;
        }

        // Elastic return to anchor memory
        const springX = this.baseX - this.x;
        const springY = this.baseY - this.y;
        this.vx += springX * this.springFactor;
        this.vy += springY * this.springFactor;

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initTextParticles() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 clamp(48px, 12vw, 160px) sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('IMMERSIVE', width / 2, height / 2);

      const imgData = ctx.getImageData(0, 0, width * dpr, height * dpr);
      const data = imgData.data;
      particles = [];

      const stride = (width <= 768) ? 8 : 4; // Mobile performance optimization

      for (let y = 0; y < height; y += stride) {
        for (let x = 0; x < width; x += stride) {
          const pixelX = Math.floor(x * dpr);
          const pixelY = Math.floor(y * dpr);
          const index = (pixelY * 4 * (width * dpr)) + (pixelX * 4);
          const alpha = data[index + 3];

          if (alpha > 128) {
            particles.push(new SandParticle(x, y));
          }
        }
      }

      ctx.clearRect(0, 0, width, height);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('resize', resize);
    window.addEventListener('DOMContentLoaded', () => {
      resize();
      animate();
    });
  </script>
</body>
</html>
```

---

## Recipe 2: Scroll-Driven 3D Product Interactive Experience

Integration of Lenis Smooth Scroll, GSAP ScrollTrigger, and Three.js GLTF model presentation with dynamic camera transitions.

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// 1. Lenis Smooth Scroll Engine
const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 2. Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.querySelector('#webgl-container').appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const keyLight = new THREE.DirectionalLight(0xffeedd, 2.0);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

// 3. GLTF Loader with DRACO
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let model;
gltfLoader.load('/assets/product.glb', (gltf) => {
  model = gltf.scene;

  // Auto-center and normalize size
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  scene.add(model);

  // Bind ScrollTrigger Timeline once asset is loaded
  initScrollAnimation();
});

function initScrollAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.product-stage',
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: 1.0,
      anticipatePin: 1
    }
  });

  tl.to(model.rotation, { y: Math.PI * 2, x: 0.3, ease: 'none' }, 0.0)
    .to(camera.position, { z: 3.0, ease: 'none' }, 0.0)
    .to(model.position, { x: 1.2, ease: 'none' }, 0.5)
    .to(model.rotation, { y: Math.PI * 4, ease: 'none' }, 0.5);
}

// 4. Render Loop
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
```

---

## Recipe 3: Interactive GPU Fluid Distortion Plane (GLSL + Three.js)

A full-screen interactive shader plane responding to cursor velocity with dynamic UV displacement and RGB channel split (chromatic aberration).

```javascript
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const uniforms = {
  u_time: { value: 0.0 },
  u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
  u_velocity: { value: 0.0 },
  u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  u_texture: { value: new THREE.TextureLoader().load('/assets/hero.jpg') }
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_velocity;
  uniform vec2 u_resolution;
  uniform sampler2D u_texture;
  varying vec2 vUv;

  void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 mouseNorm = (u_mouse - 0.5) * (u_resolution / min(u_resolution.x, u_resolution.y));

    float dist = length(st - mouseNorm);
    float force = smoothstep(0.4, 0.0, dist) * u_velocity;
    vec2 dir = normalize(st - mouseNorm + 0.0001);

    vec2 displacedUv = vUv + dir * force * 0.15;

    // Chromatic Aberration (RGB Shift)
    float r = texture2D(u_texture, displacedUv + dir * force * 0.02).r;
    float g = texture2D(u_texture, displacedUv).g;
    float b = texture2D(u_texture, displacedUv - dir * force * 0.02).b;
    float a = texture2D(u_texture, displacedUv).a;

    gl_FragColor = vec4(r, g, b, a);
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms
});

const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

let mousePos = new THREE.Vector2(0.5, 0.5);
let prevMousePos = new THREE.Vector2(0.5, 0.5);
let targetVelocity = 0;
let velocity = 0;

window.addEventListener('mousemove', (e) => {
  mousePos.x = e.clientX / window.innerWidth;
  mousePos.y = 1.0 - (e.clientY / window.innerHeight);

  const dx = mousePos.x - prevMousePos.x;
  const dy = mousePos.y - prevMousePos.y;
  targetVelocity = Math.min(Math.sqrt(dx * dx + dy * dy) * 40.0, 3.0);
  prevMousePos.copy(mousePos);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  velocity += (targetVelocity - velocity) * 0.1;
  targetVelocity *= 0.92; // Damping

  uniforms.u_time.value = elapsedTime;
  uniforms.u_mouse.value.copy(mousePos);
  uniforms.u_velocity.value = velocity;

  renderer.render(scene, camera);
}
animate();
```

---

## Recipe 4: Hybrid Canvas Video Frame Scrubbing with 3D DOM Overlays

The ORYZO AI / Apple paradigm: preloading an image sequence onto a 2D canvas scrubber synchronized with 3D perspective DOM layers.

```html
<section class="hybrid-hero">
  <canvas id="scrubCanvas"></canvas>
  <div class="perspective-layer">
    <h1 class="hero-text">REDEFINING MOTION</h1>
    <div class="feature-card">
      <h2>01 / ARCHITECTURE</h2>
      <p>Photorealistic pre-rendered CGI combined with real-time UI.</p>
    </div>
  </div>
</section>

<style>
  .hybrid-hero {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  #scrubCanvas {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 1;
  }
  .perspective-layer {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 2;
    perspective: 1000px;
    transform-style: preserve-3d;
    pointer-events: none;
  }
  .hero-text {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) translateZ(0px);
    color: #fff;
    font-size: 5vw;
  }
  .feature-card {
    position: absolute;
    bottom: 20%; right: 10%;
    transform: translateZ(800px);
    opacity: 0;
    color: #fff;
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    padding: 24px;
    border-radius: 12px;
  }
</style>

<script type="module">
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Lenis from 'lenis';

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const canvas = document.getElementById('scrubCanvas');
  const ctx = canvas.getContext('2d');
  const frameCount = 150;
  const images = [];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  let loaded = 0;
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = `/frames/frame_${i.toString().padStart(4, '0')}.jpg`;
    img.onload = () => { if (++loaded === frameCount) startScrub(); };
    img.onerror = () => { if (++loaded === frameCount) startScrub(); };
    images.push(img);
  }

  function drawFrame(img) {
    if (!img || !img.complete) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    
    // Cover math
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let dw = w, dh = h, dx = 0, dy = 0;
    if (imgRatio > canvasRatio) {
      dw = h * imgRatio;
      dx = (w - dw) / 2;
    } else {
      dh = w / imgRatio;
      dy = (h - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function startScrub() {
    drawFrame(images[0]);

    ScrollTrigger.create({
      trigger: '.hybrid-hero',
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: 1.0,
      onUpdate: (self) => {
        const p = Math.min(self.progress / 0.9, 1.0);
        const frameIdx = Math.floor(p * (frameCount - 1));
        drawFrame(images[frameIdx]);

        // DOM Layer 1: Recede text into 3D distance
        if (self.progress < 0.4) {
          const tp = self.progress / 0.4;
          gsap.set('.hero-text', {
            transform: `translate(-50%, -50%) translateZ(${-tp * 600}px)`,
            opacity: 1 - tp
          });
        }

        // DOM Layer 2: Bring card forward from foreground
        if (self.progress >= 0.4 && self.progress <= 0.85) {
          const cp = (self.progress - 0.4) / 0.45;
          gsap.set('.feature-card', {
            transform: `translateZ(${(1 - cp) * 800}px)`,
            opacity: cp
          });
        }
      }
    });
  }
</script>
```

---

## Recipe 5: Seamless Multi-Page Cinematic Shutter Transition

A complete, promise-based page transition intercepting link navigation and orchestrating dual-opposing curtain wipes with zero layout shift.

```html
<div class="transition-container">
  <div class="transition-row row-top">
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
  </div>
  <div class="transition-row row-bottom">
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
  </div>
</div>

<style>
  .transition-container {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    display: flex; flex-direction: column;
    z-index: 99999;
    pointer-events: none;
  }
  .transition-row {
    display: flex; flex: 1; width: 100%;
  }
  .shutter-block {
    flex: 1;
    background: #000000;
    transform: scaleY(1);
    will-change: transform;
  }
  .row-top .shutter-block { transform-origin: top; }
  .row-bottom .shutter-block { transform-origin: bottom; }
</style>

<script>
  function revealPage() {
    return new Promise((resolve) => {
      gsap.set('.shutter-block', { scaleY: 1, visibility: 'visible' });
      const tl = gsap.timeline({ onComplete: () => {
        gsap.set('.shutter-block', { visibility: 'hidden' });
        resolve();
      }});

      tl.to('.row-top .shutter-block', {
        scaleY: 0,
        duration: 0.8,
        stagger: { each: 0.08, from: 'start' },
        ease: 'expo.inOut'
      })
      .to('.row-bottom .shutter-block', {
        scaleY: 0,
        duration: 0.8,
        stagger: { each: 0.08, from: 'start' },
        ease: 'expo.inOut'
      }, '<');
    });
  }

  function exitPage() {
    return new Promise((resolve) => {
      gsap.set('.shutter-block', { visibility: 'visible' });
      const tl = gsap.timeline({ onComplete: resolve });

      tl.fromTo('.row-top .shutter-block', { scaleY: 0 }, {
        scaleY: 1,
        duration: 0.8,
        stagger: { each: 0.08, from: 'end' },
        ease: 'expo.inOut'
      })
      .fromTo('.row-bottom .shutter-block', { scaleY: 0 }, {
        scaleY: 1,
        duration: 0.8,
        stagger: { each: 0.08, from: 'end' },
        ease: 'expo.inOut'
      }, '<');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    revealPage();

    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || link.target === '_blank') return;

        e.preventDefault();
        exitPage().then(() => {
          window.location.href = href;
        });
      });
    });
  });
</script>
```
