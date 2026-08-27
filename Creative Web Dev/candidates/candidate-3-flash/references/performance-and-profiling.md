# Performance Engineering, Memory Budgets & Mobile Hardening

An operational guide to ensuring steady 60 FPS frame rates, zero memory leaks, GPU draw call batching, and graceful mobile degradation on creative web applications.

---

## 1. Device Pixel Ratio (DPR) Clamping Protocol

High-DPI / Retina mobile displays often report `devicePixelRatio = 3.0` or `3.75`. Rendering WebGL or Canvas at native 3x scales increases pixel fill-rate work by **9x**, causing immediate thermal throttling.

```javascript
// Strict DPR Clamping Rule
export function getSafePixelRatio() {
  return Math.min(window.devicePixelRatio || 1, 2.0);
}

// Three.js
renderer.setPixelRatio(getSafePixelRatio());

// Canvas 2D
const dpr = getSafePixelRatio();
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;
ctx.scale(dpr, dpr);
```

---

## 2. WebGL Draw Call Budgeting & GPU Instancing

Every unique `THREE.Mesh` creates an individual CPU-to-GPU draw call. Maintain a hard budget of **< 50 draw calls on mobile** and **< 100 on desktop**.

### Converting Loops into `THREE.InstancedMesh`

```javascript
import * as THREE from 'three';

// BAD: 1,000 separate draw calls
// for (let i = 0; i < 1000; i++) {
//   const mesh = new THREE.Mesh(geometry, material);
//   scene.add(mesh);
// }

// GOOD: Exactly 1 single draw call for 1,000 objects
export function createInstancedParticleGrid(count = 1000) {
  const geometry = new THREE.SphereGeometry(0.1, 8, 8);
  const material = new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 0.8 });
  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // Set position, rotation, scale on dummy helper
    dummy.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    dummy.updateMatrix();

    // Assign transformation matrix
    instancedMesh.setMatrixAt(i, dummy.matrix);

    // Assign per-instance color
    color.setHSL(i / count, 0.7, 0.5);
    instancedMesh.setColorAt(i, color);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

  return instancedMesh;
}
```

---

## 3. Zero-Allocation Render Loop Protocol

Garbage Collection (GC) pauses occur when objects are created and discarded inside the animation loop. Eliminate all allocations from `requestAnimationFrame` and `useFrame`.

```javascript
import * as THREE from 'three';

// 1. Pre-allocate scratch vectors and matrices at file/module scope
const SCRATCH_VEC3_A = new THREE.Vector3();
const SCRATCH_VEC3_B = new THREE.Vector3();
const SCRATCH_MAT4 = new THREE.Matrix4();

export class ParticleController {
  constructor(particles) {
    this.particles = particles;
  }

  // Called 60 times per second
  renderLoop(delta) {
    // FORBIDDEN: const diff = new THREE.Vector3(x, y, z); -> Triggers GC pause!

    // PERMITTED: Mutate pre-allocated scratch objects in-place
    SCRATCH_VEC3_A.set(this.targetX, this.targetY, this.targetZ);
    SCRATCH_VEC3_B.copy(this.currentPosition).sub(SCRATCH_VEC3_A);

    // Apply transformation without object creation
    this.mesh.position.addScaledVector(SCRATCH_VEC3_B, delta * 2.0);
  }
}
```

---

## 4. Comprehensive Resource Deallocation & Teardown

Prevent memory leaks when navigating between pages or destroying interactive widgets.

```javascript
export function fullTeardown(experienceContext) {
  const { renderer, scene, lenis, scrollTriggers, animFrameId, listeners } = experienceContext;

  // 1. Cancel RAF Loop
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
  }

  // 2. Kill GSAP ScrollTrigger instances
  if (scrollTriggers && Array.isArray(scrollTriggers)) {
    scrollTriggers.forEach((st) => st.kill());
  }

  // 3. Destroy Lenis smooth scroll
  if (lenis) {
    lenis.destroy();
  }

  // 4. Remove bound event listeners
  if (listeners && Array.isArray(listeners)) {
    listeners.forEach(({ target, type, handler }) => {
      target.removeEventListener(type, handler);
    });
  }

  // 5. Traverse and dispose Three.js scene graph
  if (scene) {
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();

      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(obj.material);
        }
      }
    });
  }

  // 6. Dispose WebGL Context
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }
}

function disposeMaterial(material) {
  Object.keys(material).forEach((key) => {
    const value = material[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      // Identified as a THREE.Texture
      value.dispose();
    }
  });
  material.dispose();
}
```

---

## 5. Mobile Graceful Degradation & Accessibility

Adapt computational load dynamically based on device capabilities and user accessibility preferences.

```javascript
export class ResponsiveExperienceAdapter {
  static isMobile() {
    return window.innerWidth <= 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent);
  }

  static prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static getSamplingStride() {
    // 4px stride on desktop = ~4,000 particles
    // 8px stride on mobile  = ~1,000 particles (75% reduction in CPU/draw cost)
    return this.isMobile() ? 8 : 4;
  }

  static configureScene(scene, renderer) {
    if (this.isMobile()) {
      renderer.shadowMap.enabled = false; // Disable real-time shadow passes
      scene.environment = null; // Disable expensive HDR environment reflections
    } else {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }
}
```
