# GLSL Shaders & GPU Visual Computation

A definitive engineering guide for GLSL shader programming, vertex displacement, procedural noise functions, cursor force-field fluid distortion, and chromatic aberration (RGB splitting) on the GPU.

---

## 1. Shader Architecture & Uniform Interface

A custom visual computation shader operates via two synchronized programs:
1. **Vertex Shader**: Deforms geometry coordinates and passes interpolated varyings (such as `vUv` and `vNormal`) to the fragment stage.
2. **Fragment Shader**: Computes per-pixel color, texture sampling, procedural noise fields, and lens distortion.

```
[CPU Application (JS)] ──(Uniforms: uTime, uMouse, uTexture)──► [Vertex Shader] ──► [Rasterizer] ──► [Fragment Shader] ──► [FrameBuffer / Screen]
```

---

## 2. Procedural Noise Algorithms (Simplex & FBM in GLSL)

Include these optimized GLSL noise implementations inside your fragment and vertex shaders.

```glsl
// GLSL 2D Simplex Noise Kernel
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractional Brownian Motion (FBM) - 4 Octaves
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 0.0;
  for (int i = 0; i < 4; i++) {
    value += amplitude * snoise(st);
    st *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
```

---

## 3. Vertex Displacement Shader (Wave Ripple & Cursor Morph)

Deform mesh vertices dynamically based on time and distance to an interaction point.

```glsl
// vertexShader.glsl
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;

varying vec2 vUv;
varying vec3 vNormal;
varying float vElevation;

void main() {
  vUv = uv;
  vNormal = normal;

  vec3 pos = position;

  // Calculate distance from vertex UV to normalized mouse position
  float dist = distance(uv, uMouse);
  float mouseWave = sin(dist * 20.0 - uTime * 4.0) * exp(-dist * 4.0) * uHover;

  // Global undulating surface wave
  float surfaceWave = sin(pos.x * 2.0 + uTime) * cos(pos.y * 2.0 + uTime) * 0.15;

  float elevation = surfaceWave + mouseWave * 0.3;
  pos.z += elevation;
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

---

## 4. Mouse-Driven Liquid Image Distortion & RGB Split (Chromatic Aberration)

Distort image UVs with mouse velocity and sample RGB channels at offset intervals to produce fluid chromatic aberration.

### GLSL Fragment Shader
```glsl
// fragmentShader.glsl
uniform sampler2D uTexture;
uniform vec2 uMouse;        // Current mouse position (0.0 to 1.0)
uniform vec2 uPrevMouse;    // Previous mouse position
uniform vec2 uResolution;   // Viewport or image aspect resolution
uniform float uTime;
uniform float uVelocity;    // Normalized cursor speed scalar

varying vec2 vUv;

void main() {
  // Correct aspect ratio distortion
  vec2 uv = vUv;
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (1.0), 1.0),
    min((uResolution.y / uResolution.x) / (1.0), 1.0)
  );

  // Radial vector from mouse to current fragment UV
  vec2 mouseDir = uv - uMouse;
  float dist = length(mouseDir);

  // Interaction force with smooth Gaussian falloff
  float influence = exp(-dist * dist * 18.0) * uVelocity;

  // Compute UV distortion displacement
  vec2 displacement = normalize(mouseDir + 0.0001) * influence * 0.15;

  // Add subtle continuous organic noise turbulence
  float noiseVal = fbm(uv * 4.0 + uTime * 0.2);
  displacement += vec2(noiseVal) * influence * 0.05;

  vec2 distortedUv = uv - displacement;

  // Chromatic Aberration: Separate RGB color channel samples
  float rOffset = influence * 0.035;
  float bOffset = influence * -0.035;

  float r = texture2D(uTexture, distortedUv + vec2(rOffset, 0.0)).r;
  float g = texture2D(uTexture, distortedUv).g;
  float b = texture2D(uTexture, distortedUv + vec2(bOffset, 0.0)).b;
  float a = texture2D(uTexture, distortedUv).a;

  gl_FragColor = vec4(r, g, b, a);
}
```

---

## 5. Three.js Material Setup & Uniform Update Loop

```javascript
import * as THREE from 'three';

export function createDistortionMesh(textureImage, container) {
  const texture = new THREE.TextureLoader().load(textureImage);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;

  const uniforms = {
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uVelocity: { value: 0.0 },
    uTime: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `/* Embed Fragment Shader from above */`,
    uniforms: uniforms,
    transparent: true,
  });

  const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
  const mesh = new THREE.Mesh(geometry, material);

  // Velocity tracking
  let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, prevX: 0.5, prevY: 0.5, velocity: 0 };

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.targetX = (e.clientX - rect.left) / rect.width;
    mouse.targetY = 1.0 - (e.clientY - rect.top) / rect.height; // Invert Y for GLSL UV coords
  });

  function updateUniforms(time) {
    uniforms.uTime.value = time * 0.001;

    // Smooth mouse coordinates
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;

    // Calculate instantaneous cursor velocity
    const vx = mouse.x - mouse.prevX;
    const vy = mouse.y - mouse.prevY;
    const speed = Math.hypot(vx, vy) * 10;
    mouse.velocity += (speed - mouse.velocity) * 0.1;

    uniforms.uMouse.value.set(mouse.x, mouse.y);
    uniforms.uVelocity.value = Math.min(mouse.velocity, 2.0);
  }

  return { mesh, updateUniforms };
}
```
