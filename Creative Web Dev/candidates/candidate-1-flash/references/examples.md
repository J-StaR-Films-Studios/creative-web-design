# Creative Web Development: Production Recipes & End-to-End Examples

A curated collection of production-ready, fully commented implementations across the core creative web development pillars.

---

## Recipe 1: Interactive Sand/Dust Particle Typography

An interactive HTML5 Canvas 2D typography experience where letters shatter into thousands of physics-driven particles under cursor proximity and elastically reassemble at their exact origin.

```javascript
/**
 * Interactive Sand/Dust Typography Engine
 * Technology: HTML5 Canvas 2D, Vanilla JavaScript, High-DPI Scaling
 */

class DustParticle {
  constructor(x, y, color = '#ffffff') {
    this.x = x;
    this.y = y;
    this.baseX = x; // Anchor Memory
    this.baseY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = 1.6;
    this.color = color;
    this.density = Math.random() * 25 + 10; // Varied inertia
    this.friction = 0.90;
    this.ease = 0.06; // Spring return rate
  }

  update(mouse) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distSq = dx * dx + dy * dy;
    const radiusSq = mouse.radius * mouse.radius;

    // Repulsion physics inside cursor radius
    if (distSq < radiusSq) {
      const dist = Math.sqrt(distSq);
      const force = (mouse.radius - dist) / mouse.radius;
      const angleX = dx / dist;
      const angleY = dy / dist;

      this.vx -= angleX * force * this.density;
      this.vy -= angleY * force * this.density;
    }

    // Elastic spring recovery toward anchor origin
    const returnForceX = (this.baseX - this.x) * this.ease;
    const returnForceY = (this.baseY - this.y) * this.ease;

    this.vx += returnForceX;
    this.vy += returnForceY;

    // Apply friction damping
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class SandTypographyApp {
  constructor(canvasElement, text = 'CREATIVE') {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.text = text;
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: 100 };
    this.rafId = null;

    this.init();
  }

  init() {
    this.setupCanvas();
    this.sampleText();
    this.bindEvents();
    this.animate();
  }

  setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
  }

  sampleText() {
    // 1. Render raster text to measure alpha pixels
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '900 clamp(48px, 12vw, 160px) sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.text, this.width / 2, this.height / 2);

    // 2. Extract pixel buffer
    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imgData.data;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const step = Math.floor(4 * dpr); // Sampling stride

    this.particles = [];

    for (let y = 0; y < this.canvas.height; y += step) {
      for (let x = 0; x < this.canvas.width; x += step) {
        const index = (y * 4 * this.canvas.width) + (x * 4) + 3;
        if (data[index] > 128) {
          // Convert back to logical CSS coordinates
          this.particles.push(new DustParticle(x / dpr, y / dpr));
        }
      }
    }

    // 3. Clear raster image to prepare for particle rendering
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.sampleText();
    });
  }

  animate() {
    // Semi-transparent clear for subtle particle trails
    this.ctx.fillStyle = 'rgba(9, 9, 11, 0.25)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.mouse);
      this.particles[i].draw(this.ctx);
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
  }
}
```

---

## Recipe 2: Scroll-Driven 3D Scrollytelling Showcase

A synchronized Three.js 3D product showcase orchestrated across a 400% pinned viewport with Lenis smooth scroll, GSAP ScrollTrigger, and circular clip-path mask reveals.

```javascript
/**
 * 3D Scrollytelling Showcase
 * Technology: Three.js, GSAP 3, ScrollTrigger, Lenis Smooth Scroll
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export class Scrollytelling3D {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.model = null;

    this.init();
  }

  async init() {
    this.initLenis();
    this.initThree();
    await this.loadModel('/assets/watch.glb');
    this.initScrollTimeline();
  }

  initLenis() {
    this.lenis = new Lenis({ duration: 1.2 });
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => this.lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  initThree() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(4, 5, 4);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
    fillLight.position.set(-4, -2, -2);
    this.scene.add(fillLight);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    this.camera.position.set(0, 0, 4);

    // Continuous Render Loop
    const render = () => {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(render);
    };
    render();
  }

  loadModel(url) {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        this.model = gltf.scene;

        // Auto-center geometry
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);

        this.scene.add(this.model);
        resolve();
      });
    });
  }

  initScrollTimeline() {
    const yAxis = new THREE.Vector3(0, 1, 0);
    let lastRotation = 0;

    ScrollTrigger.create({
      trigger: '.pinned-track',
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // 1. Rotate 3D Model across 4 full turns
        if (this.model) {
          const targetRotation = progress * Math.PI * 2 * 4;
          const delta = targetRotation - lastRotation;
          this.model.rotateOnAxis(yAxis, delta);
          lastRotation = targetRotation;
        }

        // 2. Circular Mask Expansion (0.15 -> 0.45)
        const maskP = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.15, 0.45, 0, 100, progress));
        gsap.set('.circular-theme-mask', {
          clipPath: `circle(${maskP}% at 50% 50%)`,
        });

        // 3. Translate Headline Offscreen (0.00 -> 0.20)
        const textP = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.00, 0.20, 0, 1, progress));
        gsap.set('.hero-title', {
          xPercent: -120 * textP,
          opacity: 1 - textP,
        });

        // 4. Stagger Spec Callouts (0.50 -> 0.85)
        const specP = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.50, 0.85, 0, 1, progress));
        gsap.set('.spec-item', {
          opacity: specP,
          y: (1 - specP) * 40,
        });
      },
    });
  }
}
```

---

## Recipe 3: Mouse-Velocity Force Field & RGB Split Distortion Shader

A custom GLSL shader material applied to an interactive image plane. The cursor acts as a fluid force field that displaces texture coordinates and introduces chromatic aberration proportional to movement speed.

```javascript
/**
 * Fluid RGB Distortion Plane
 * Technology: Three.js, Custom GLSL, Cursor Velocity Tracking
 */

import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Euclidean distance to cursor
    float dist = distance(uv, uMouse);
    float force = smoothstep(0.35, 0.0, dist);

    // Dynamic displacement vector
    vec2 displacement = uVelocity * 0.06 * force * sin(dist * 20.0 - uTime * 3.0);

    // RGB Channel Offsets
    float r = texture2D(uTexture, uv + displacement * 1.25).r;
    float g = texture2D(uTexture, uv + displacement).g;
    float b = texture2D(uTexture, uv + displacement * 0.75).b;
    float a = texture2D(uTexture, uv).a;

    gl_FragColor = vec4(r, g, b, a);
  }
`;

export class FluidDistortionPlane {
  constructor(canvasContainer, imageUrl) {
    this.container = canvasContainer;
    this.imageUrl = imageUrl;
    this.mouse = new THREE.Vector2(0.5, 0.5);
    this.targetMouse = new THREE.Vector2(0.5, 0.5);
    this.prevMouse = new THREE.Vector2(0.5, 0.5);
    this.velocity = new THREE.Vector2(0, 0);

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    const texture = new THREE.TextureLoader().load(this.imageUrl);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: this.mouse },
        uVelocity: { value: this.velocity },
        uTime: { value: 0 },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = e.clientX / window.innerWidth;
      this.targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
    });
  }

  render() {
    // 1. Mouse interpolation
    this.mouse.lerp(this.targetMouse, 0.1);

    // 2. Velocity calculation & decay
    this.velocity.x = (this.mouse.x - this.prevMouse.x) * 0.9;
    this.velocity.y = (this.mouse.y - this.prevMouse.y) * 0.9;
    this.prevMouse.copy(this.mouse);

    // 3. Update Uniforms
    this.material.uniforms.uTime.value += 0.02;
    this.material.uniforms.uMouse.value.copy(this.mouse);
    this.material.uniforms.uVelocity.value.copy(this.velocity);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
  }
}
```

---

## Recipe 4: Hybrid Canvas Video Scrubber with Real-Time Overlays

The ORYZO AI / Superlocal Design implementation: an offline-rendered frame sequence painted to a 2D canvas on scroll with synchronized 3D perspective DOM cards.

```javascript
/**
 * Hybrid Canvas Frame Scrubber + Spatial DOM Layers
 * Technology: HTML5 Canvas 2D, GSAP ScrollTrigger, Lenis
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export class HybridCinematicScrubber {
  constructor(canvas, frameTotal, pathTemplate) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.frameTotal = frameTotal;
    this.pathTemplate = pathTemplate;
    this.images = [];
    this.playhead = { frame: 0 };

    this.init();
  }

  async init() {
    this.setupLenis();
    this.setupCanvasDPR();
    await this.preloadAllFrames();
    this.bindScrollSequence();
    this.paint(0);
  }

  setupLenis() {
    this.lenis = new Lenis();
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => this.lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  setupCanvasDPR() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  preloadAllFrames() {
    const loaders = [];
    for (let i = 1; i <= this.frameTotal; i++) {
      loaders.push(
        new Promise((resolve) => {
          const img = new Image();
          img.src = this.pathTemplate(i);
          img.onload = () => resolve(img);
        })
      );
    }
    return Promise.all(loaders).then((imgs) => {
      this.images = imgs;
    });
  }

  paint(index) {
    const img = this.images[index];
    if (!img) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Replicate CSS object-fit: cover math
    const ratio = Math.max(w / img.width, h / img.height);
    const offsetX = (w - img.width * ratio) / 2;
    const offsetY = (h - img.height * ratio) / 2;

    this.ctx.clearRect(0, 0, w, h);
    this.ctx.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, img.width * ratio, img.height * ratio);
  }

  bindScrollSequence() {
    ScrollTrigger.create({
      trigger: '.cinematic-track',
      start: 'top top',
      end: '+=450%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;

        // 1. Scrub Canvas Frames (Finishes at 0.90 for breathing room)
        const frameIndex = Math.min(
          this.frameTotal - 1,
          Math.floor(gsap.utils.mapRange(0, 0.90, 0, this.frameTotal - 1, p))
        );
        this.paint(frameIndex);

        // 2. Synchronize 3D Floating Feature Card
        const cardZ = gsap.utils.mapRange(0.2, 0.6, -500, 0, p);
        const cardOpacity = gsap.utils.mapRange(0.2, 0.4, 0, 1, p);
        gsap.set('.spatial-feature-card', {
          transform: `translate3d(0, 0, ${cardZ}px) rotateY(${gsap.utils.mapRange(0.2, 0.6, 20, 0, p)}deg)`,
          opacity: cardOpacity,
        });
      },
    });
  }
}
```

---

## Recipe 5: Seamless Multi-Page Cinematic Shutter Transition

Eliminates page-loading white flashes with Promise-orchestrated opposing-row shutter curtains.

```javascript
/**
 * Cinematic Shutter Page Transition
 * Technology: Vanilla JS, GSAP Timelines, CSS 3D Stacking
 */

import { gsap } from 'gsap';

export function setupCinematicPageTransitions() {
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize shutter overlay covering viewport
    gsap.set('.shutter-block', { visibility: 'visible', scaleY: 1 });

    // 2. Play opening reveal
    executeReveal().then(() => {
      gsap.set('.shutter-block', { visibility: 'hidden' });
    });

    // 3. Bind navigation link intercepts
    interceptAnchorClicks();
  });
}

function executeReveal() {
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    tl.to('.row-top .shutter-block', {
      scaleY: 0,
      duration: 0.85,
      stagger: { each: 0.06, from: 'start' },
      ease: 'expo.inOut',
    })
    .to('.row-bottom .shutter-block', {
      scaleY: 0,
      duration: 0.85,
      stagger: { each: 0.06, from: 'start' },
      ease: 'expo.inOut',
    }, '<');
  });
}

function executeClose() {
  return new Promise((resolve) => {
    gsap.set('.shutter-block', { visibility: 'visible', scaleY: 0 });

    const tl = gsap.timeline({ onComplete: resolve });

    tl.to('.row-top .shutter-block', {
      scaleY: 1,
      duration: 0.85,
      stagger: { each: 0.06, from: 'end' },
      ease: 'expo.inOut',
    })
    .to('.row-bottom .shutter-block', {
      scaleY: 1,
      duration: 0.85,
      stagger: { each: 0.06, from: 'end' },
      ease: 'expo.inOut',
    }, '<');
  });
}

function interceptAnchorClicks() {
  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        link.target === '_blank' ||
        href === window.location.pathname
      ) {
        return;
      }

      e.preventDefault();

      executeClose().then(() => {
        window.location.href = href;
      });
    });
  });
}
```
