# Performance Engineering, Memory Audits & Mobile Degradation

A production-grade engineering reference for GPU profiling, draw call budgets, memory leak elimination, garbage collection avoidance, and responsive mobile degradation in creative web applications.

---

## 1. Device Pixel Ratio (DPR) Clamping & Fill-Rate Protection

High-density screens (Apple Retina, 4K displays) feature device pixel ratios of 3.0 to 4.0. Rendering a full-screen WebGL viewport or Canvas buffer at native DPR requires the GPU fragment shader to process up to 16 times more pixels per frame than standard 1080p, causing severe GPU fill-rate thermal throttling and frame drops.

### Operational Rule
Always clamp renderer and canvas pixel ratios to a maximum of 2.0:

```javascript
// Universal DPR Clamping Pattern
const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
renderer.setPixelRatio(dpr);
```

---

## 2. Draw Call Budgets & GPU Instancing

Every individual `THREE.Mesh` dispatched to the GPU incurs CPU draw call overhead. In web browsers, exceeding 50–100 draw calls per frame degrades frame rate below 60 FPS.

### Optimization Strategies
1. **Instanced Rendering**: Use `THREE.InstancedMesh` when rendering multiple instances of the same geometry with unique transformation matrices or colors.
2. **Geometry Merging**: For static non-moving meshes sharing identical materials, merge geometries using `BufferGeometryUtils.mergeGeometries`.

```javascript
import * as THREE from 'three';

export function createInstancedParticleField(count = 5000) {
  const geometry = new THREE.SphereGeometry(0.05, 8, 8);
  const material = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.8 });

  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    dummy.scale.setScalar(Math.random() * 0.8 + 0.2);
    dummy.updateMatrix();

    instancedMesh.setMatrixAt(i, dummy.matrix);
    instancedMesh.setColorAt(i, color.setHSL(i / count, 0.8, 0.5));
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

  return instancedMesh; // 5000 meshes drawn in exactly 1 draw call
}
```

---

## 3. Memory Leak Prevention & Garbage Collection Audits

Allocating objects (`new THREE.Vector3()`, `new Array()`, closure functions) inside a 60/120 FPS `requestAnimationFrame` loop forces the V8 JavaScript engine to trigger frequent Garbage Collection (GC) sweeps, introducing noticeable micro-stutters and frame spikes.

### GC Avoidance Invariants
- Allocate all math vectors, matrices, quaternions, and raycasters once in module/closure scope.
- Mutate existing objects in-place during the render loop (`vec.copy()`, `vec.set()`, `vec.add()`).

```javascript
// Pre-allocated memory scratchpads
const _tempVector = new THREE.Vector3();
const _targetPos = new THREE.Vector3();

export function animateMesh(mesh, targetX, targetY) {
  // Reuse allocated vectors - ZERO allocations during RAF
  _targetPos.set(targetX, targetY, 0);
  mesh.position.lerp(_targetPos, 0.05);
}
```

### Resource Disposal Protocol
When unmounting components, destroying canvases, or navigating routes, explicitly dispose of GPU resources:

```javascript
export function disposeThreeScene(scene, renderer) {
  scene.traverse((node) => {
    if (node.geometry) {
      node.geometry.dispose();
    }
    if (node.material) {
      if (Array.isArray(node.material)) {
        node.material.forEach((mat) => disposeMaterial(mat));
      } else {
        disposeMaterial(node.material);
      }
    }
  });

  renderer.dispose();
  renderer.forceContextLoss();
}

function disposeMaterial(mat) {
  // Dispose attached textures
  for (const key of Object.keys(mat)) {
    const value = mat[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      value.dispose();
    }
  }
  mat.dispose();
}
```

---

## 4. Mobile Degradation & Adaptive Throttling

To preserve battery life and maintain 60 FPS on low-power mobile devices:

1. **Adaptive Particle & Density Scaling**:
   - Detect mobile viewports: `const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);`.
   - Scale down particle sampling density: `densityGap = isMobile ? 6 : 3;` (reduces particle count by 75%).
2. **Shader Complexity Reduction**:
   - Reduce procedural noise octaves from 4 to 1–2 on mobile.
   - Disable expensive multi-pass post-processing (bloom, chromatic aberration, SSR) on low-tier GPUs.
3. **Viewport Height Stability**:
   - Use CSS `svh` / `dvh` units or lock dynamic canvas height to `window.innerHeight` on initial load to prevent layout shifts when mobile browser address bars collapse on scroll.
