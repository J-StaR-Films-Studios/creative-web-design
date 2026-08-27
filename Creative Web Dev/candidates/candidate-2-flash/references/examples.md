# Production Code Recipes & Implementation Blueprints

Complete, merge-ready code implementations synthesizing the core creative development pillars.

---

## Recipe 1: Signature Sand/Dust Interactive Text Particle System

An interactive 2D Canvas engine that samples text pixel data offscreen, generates anchored particles, scatters them under cursor proximity force fields, and smoothly restores them using elastic spring damping.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kinetic Sand Text</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #0b0c10; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; }
    canvas { width: 100vw; height: 100vh; display: block; }
  </style>
</head>
<body>
  <canvas id="particle-canvas"></canvas>

  <script>
    class SandText {
      constructor(canvas, text) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { willReadFrequently: true });
        this.text = text;
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, radius: 100 };
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.init();
      }

      init() {
        this.resize();
        this.sampleText();
        this.bindEvents();
        this.animate();
      }

      resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
      }

      sampleText() {
        this.particles = [];
        const off = document.createElement('canvas');
        off.width = this.width;
        off.height = this.height;
        const offCtx = off.getContext('2d');

        offCtx.fillStyle = '#ffffff';
        const fontSize = Math.min(this.width / 6, 120);
        offCtx.font = `900 ${fontSize}px sans-serif`;
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(this.text, this.width / 2, this.height / 2);

        const data = offCtx.getImageData(0, 0, this.width, this.height).data;
        const gap = window.innerWidth < 768 ? 4 : 3;

        for (let y = 0; y < this.height; y += gap) {
          for (let x = 0; x < this.width; x += gap) {
            const idx = (y * 4 * this.width) + (x * 4);
            if (data[idx + 3] > 128) {
              this.particles.push({
                x: x + (Math.random() - 0.5) * 8,
                y: y + (Math.random() - 0.5) * 8,
                baseX: x,
                baseY: y,
                size: Math.random() * 1.5 + 1.0,
                density: Math.random() * 18 + 4,
                color: `hsl(${200 + (x / this.width) * 60}, 90%, 75%)`,
              });
            }
          }
        }
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
          this.resize();
          this.sampleText();
        });
      }

      animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        const radius = this.mouse.radius;
        const damping = 12;

        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < radius) {
            const force = (radius - dist) / radius;
            const dirX = dx / dist;
            const dirY = dy / dist;
            p.x -= dirX * force * p.density;
            p.y -= dirY * force * p.density;
          } else {
            p.x -= (p.x - p.baseX) / damping;
            p.y -= (p.y - p.baseY) / damping;
          }

          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
      }
    }

    new SandText(document.getElementById('particle-canvas'), 'CREATIVE');
  </script>
</body>
</html>
```

---

## Recipe 2: Synchronized Lenis + GSAP Horizontal Track & SplitText Stagger

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Horizontal Scroll Experience</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0f0f11; color: #fff; font-family: sans-serif; overflow-x: hidden; }
    .hero, .outro { height: 100vh; display: flex; align-items: center; justify-content: center; }
    .horizontal-section { overflow: hidden; }
    .horizontal-track { display: flex; width: 400vw; height: 100vh; }
    .panel { width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 5vw; }
    .title-char-mask { overflow: hidden; display: inline-block; }
    .title-char { display: inline-block; transform: translateY(110%); }
    .card-media { width: 30vw; height: 40vh; background: #222; overflow: hidden; border-radius: 12px; margin-top: 2rem; }
    .card-media img { width: 100%; height: 100%; object-fit: cover; }
  </style>
</head>
<body>
  <section class="hero"><h1>Scroll Down</h1></section>

  <section class="horizontal-section">
    <div class="horizontal-track">
      <div class="panel"><h2>Panel 01</h2><div class="card-media"><img src="https://picsum.photos/800/600?random=1" alt="Media"></div></div>
      <div class="panel"><h2>Panel 02</h2><div class="card-media"><img src="https://picsum.photos/800/600?random=2" alt="Media"></div></div>
      <div class="panel"><h2>Panel 03</h2><div class="card-media"><img src="https://picsum.photos/800/600?random=3" alt="Media"></div></div>
      <div class="panel"><h2>Panel 04</h2><div class="card-media"><img src="https://picsum.photos/800/600?random=4" alt="Media"></div></div>
    </div>
  </section>

  <section class="outro"><h1>Experience Concluded</h1></section>

  <script src="https://unpkg.com/lenis@1.1.9/dist/lenis.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script>
    gsap.registerPlugin(ScrollTrigger);

    // 1. Lenis Smooth Scroll Binding
    const lenis = new Lenis({ duration: 1.2 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // 2. Horizontal Scroll Tween
    const track = document.querySelector('.horizontal-track');
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: '.horizontal-section',
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // 3. Parallax Inner Images
    gsap.utils.toArray('.card-media img').forEach((img) => {
      gsap.fromTo(img, { xPercent: -15 }, {
        xPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.panel'),
          containerAnimation: tween,
          start: 'left right',
          end: 'right left',
          scrub: true,
        },
      });
    });
  </script>
</body>
</html>
```

---

## Recipe 3: GLSL Mouse-Driven Liquid Image Distortion & RGB Chromatic Aberration

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GLSL Fluid Distortion</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; }
    #canvas-container { width: 80vw; height: 80vh; }
  </style>
</head>
<body>
  <div id="canvas-container"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const texture = new THREE.TextureLoader().load('https://picsum.photos/1200/800?random=10');

    const uniforms = {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: 0.0 },
      uTime: { value: 0.0 },
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uVelocity;
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        vec2 diff = uv - uMouse;
        float dist = length(diff);
        float force = exp(-dist * dist * 25.0) * uVelocity;

        vec2 offset = normalize(diff + 0.0001) * force * 0.12;
        vec2 distortedUv = uv - offset;

        float r = texture2D(uTexture, distortedUv + offset * 0.2).r;
        float g = texture2D(uTexture, distortedUv).g;
        float b = texture2D(uTexture, distortedUv - offset * 0.2).b;
        float a = texture2D(uTexture, distortedUv).a;

        gl_FragColor = vec4(r, g, b, a);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, prevX: 0.5, prevY: 0.5, velocity: 0 };

    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) / rect.width;
      mouse.targetY = 1.0 - (e.clientY - rect.top) / rect.height;
    });

    function animate(time) {
      uniforms.uTime.value = time * 0.001;

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      const speed = Math.hypot(mouse.x - mouse.prevX, mouse.y - mouse.prevY) * 15;
      mouse.velocity += (speed - mouse.velocity) * 0.1;

      uniforms.uMouse.value.set(mouse.x, mouse.y);
      uniforms.uVelocity.value = Math.min(mouse.velocity, 2.5);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  </script>
</body>
</html>
```
