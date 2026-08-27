# GPU Shaders, GLSL Visual Computation & Noise Fields

An operational engineering manual for authoring high-performance GLSL vertex and fragment shaders, procedural noise algorithms (Simplex, FBM, Curl), mouse-velocity force fields, and chromatic aberration filters.

---

## 1. Core Shader Pipeline & Aspect-Corrected UV Math

To avoid elliptical stretching on non-square screens, normalize and center fragment coordinates using viewport resolution uniforms.

### Standard Three.js Shader Material Boilerplate

```javascript
import * as THREE from 'three';

const customShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_velocity: { value: 0.0 },
    u_texture: { value: new THREE.TextureLoader().load('/assets/images/hero.jpg') },
    u_progress: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float u_time;
    uniform float u_velocity;

    void main() {
      vUv = uv;
      vPosition = position;
      
      // Optional: Dynamic vertex displacement
      vec3 displacedPosition = position;
      displacedPosition.z += sin(position.x * 4.0 + u_time * 2.0) * (u_velocity * 0.1);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_velocity;
    uniform sampler2D u_texture;
    varying vec2 vUv;

    void main() {
      // 1. Aspect ratio correction for procedural graphics
      vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

      // 2. Mouse distance vector calculation
      vec2 mouseNorm = (u_mouse - 0.5) * (u_resolution / min(u_resolution.x, u_resolution.y));
      float dist = length(st - mouseNorm);

      // 3. Fluid UV displacement force field
      float force = smoothstep(0.4, 0.0, dist) * u_velocity;
      vec2 displacedUv = vUv + (st - mouseNorm) * force * 0.2;

      // 4. Sample texture
      vec4 color = texture2D(u_texture, displacedUv);
      gl_FragColor = color;
    }
  `,
  transparent: true,
  side: THREE.DoubleSide
});
```

---

## 2. GLSL Procedural Noise Algorithms

Procedural noise replaces rigid mathematical sine waves with organic, continuous random fields.

### 1. 2D Simplex Noise Function

```glsl
// GLSL Simplex Noise 2D (Ian McEwan / Ashima Arts standard)
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
```

### 2. Fractal Brownian Motion (FBM) Multi-Octave Noise

```glsl
#define NUM_OCTAVES 5

float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

  for (int i = 0; i < NUM_OCTAVES; i++) {
    value += amplitude * snoise(st * frequency);
    st = rot * st * 2.0 + shift;
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}
```

### 3. Curl Noise (Divergence-Free Fluid Turbulence)

```glsl
vec2 curlNoise(vec2 p) {
  const float e = 0.01;
  float n1 = snoise(vec2(p.x, p.y + e));
  float n2 = snoise(vec2(p.x, p.y - e));
  float n3 = snoise(vec2(p.x + e, p.y));
  float n4 = snoise(vec2(p.x - e, p.y));

  float x = (n1 - n2) / (2.0 * e);
  float y = -(n3 - n4) / (2.0 * e);

  return vec2(x, y);
}
```

---

## 3. Mouse-Velocity Interactive Force Field Pipeline

Connect user mouse motion to shader uniforms with smooth velocity decay.

```javascript
class ShaderUniformController {
  constructor(material) {
    this.material = material;
    this.mouse = new THREE.Vector2(0.5, 0.5);
    this.targetMouse = new THREE.Vector2(0.5, 0.5);
    this.prevMouse = new THREE.Vector2(0.5, 0.5);
    this.velocity = 0;
    this.targetVelocity = 0;

    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = e.clientX / window.innerWidth;
      this.targetMouse.y = 1.0 - (e.clientY / window.innerHeight); // Invert Y for WebGL UV space
    });

    window.addEventListener('resize', () => {
      this.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    });
  }

  update(delta, elapsedTime) {
    // 1. Interpolate mouse position
    this.mouse.lerp(this.targetMouse, 0.1);

    // 2. Compute instantaneous speed
    const dx = this.mouse.x - this.prevMouse.x;
    const dy = this.mouse.y - this.prevMouse.y;
    const speed = Math.sqrt(dx * dx + dy * dy) * 50.0;

    this.velocity += (speed - this.velocity) * 0.1;
    this.prevMouse.copy(this.mouse);

    // 3. Forward values to GPU uniforms
    this.material.uniforms.u_time.value = elapsedTime;
    this.material.uniforms.u_mouse.value.copy(this.mouse);
    this.material.uniforms.u_velocity.value = this.velocity;
  }
}
```

---

## 4. Chromatic Aberration & RGB Split Distortion

Separate color channels across an interactive displacement vector to produce cinematic optical refraction.

```glsl
uniform sampler2D u_texture;
uniform float u_velocity;
uniform vec2 u_mouse;
varying vec2 vUv;

void main() {
  vec2 dir = vUv - u_mouse;
  float dist = length(dir);
  vec2 displacement = normalize(dir) * (u_velocity * 0.03) * smoothstep(0.5, 0.0, dist);

  // Sample Red, Green, and Blue channels at staggered UV coordinates
  float r = texture2D(u_texture, vUv + displacement * 1.5).r;
  float g = texture2D(u_texture, vUv + displacement * 1.0).g;
  float b = texture2D(u_texture, vUv + displacement * 0.5).b;
  float a = texture2D(u_texture, vUv).a;

  gl_FragColor = vec4(r, g, b, a);
}
```
