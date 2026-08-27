# Performance Engineering, Profiling & Mobile Degradation

An operational guide for maintaining a steady 60 FPS frame rate, eliminating memory leaks, optimizing WebGL draw calls, and implementing responsive mobile degradation.

---

## 1. The 16.6ms Frame Budget & Execution Allocation

To maintain 60 FPS on standard $60\text{Hz}$ displays (or 120 FPS on $120\text{Hz}$ ProMotion screens), total work per frame must stay strictly within the timing budget:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        16.6ms FRAME BUDGET                             │
├─────────────────┬───────────────────┬───────────────────┬──────────────┤
│ 4.0ms: JS / Physics │ 4.0ms: Draw Call Prep │ 6.0ms: GPU Render │ 2.6ms Margin │
│ (Lerp, Lenis, Math) │ (Three.js Scene Graph)│ (Raster, Shaders) │ (Headroom)   │
└─────────────────┴───────────────────┴───────────────────┴──────────────┘
```

---

## 2. DPR Clamping & Pixel Fill Rate Protection

Unconstrained `window.devicePixelRatio` on high-density mobile screens (e.g., iPhone Pro @ 3x or 4x) quadruples GPU fill-rate demands without perceptible visual gains. Always clamp DPR between 1.0 and 2.0.

```javascript
// High-DPI clamping utility
export function getClampedDPR(maxDpr = 2.0) {
  return Math.min(window.devicePixelRatio || 1.0, maxDpr);
}

// Applying to Three.js Renderer
renderer.setPixelRatio(getClampedDPR(2.0));

// Applying to HTML5 2D Canvas
const dpr = getClampedDPR(2.0);
canvas.width = Math.floor(cssWidth * dpr);
canvas.height = Math.floor(cssHeight * dpr);
ctx.scale(dpr, dpr);
```

---

## 3. Instanced Meshes & Draw Call Minimization

Never instantiate thousands of individual `THREE.Mesh` objects in a loop. Use `THREE.InstancedMesh` to render all instances in a single draw call.

```javascript
import * as THREE from 'three';

export function createInstancedParticleField(count = 5000) {
  const geometry = new THREE.SphereGeometry(0.05, 8, 8);
  const material = new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 0.8,
    color: 0xffffff,
  });

  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
  instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // Pre-allocate temporary objects to eliminate Garbage Collection churn
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // Set spatial positions
    dummy.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    dummy.scale.setScalar(Math.random() * 0.8 + 0.2);
    dummy.updateMatrix();

    instancedMesh.setMatrixAt(i, dummy.matrix);

    // Assign per-instance color variation
    color.setHSL(i / count, 0.7, 0.5);
    instancedMesh.setColorAt(i, color);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  if (instancedMesh.instanceColor) {
    instancedMesh.instanceColor.needsUpdate = true;
  }

  return instancedMesh;
}
```

---

## 4. Zero-Allocation Animation Loop & GC Protection

Instantiating objects (`new THREE.Vector3()`, `new Array()`, string templates) inside requestAnimationFrame loops triggers Garbage Collection (GC) sweeps, producing micro-stutters.

### Anti-Pattern vs. Zero-Allocation Pattern

```javascript
// ❌ ANTI-PATTERN: Heap allocation per frame
function animateBad() {
  const target = new THREE.Vector3(mouse.x, mouse.y, 0); // Allocates on heap!
  camera.position.lerp(target, 0.05);
  requestAnimationFrame(animateBad);
}

//  ZERO-ALLOCATION PATTERN: Pre-allocated static vectors
const workingTarget = new THREE.Vector3(); // Allocated once at top level

function animateOptimized() {
  workingTarget.set(mouse.x, mouse.y, 0); // Mutates existing memory
  camera.position.lerp(workingTarget, 0.05);
  requestAnimationFrame(animateOptimized);
}
```

---

## 5. Explicit WebGL Resource Disposal

Free GPU VRAM and prevent browser crashes on single-page application (SPA) route changes by recursively disposing of all WebGL assets.

```javascript
export function disposeThreeScene(scene, renderer) {
  if (!scene) return;

  // 1. Recursive Scene Traversal
  scene.traverse((object) => {
    if (object.isMesh) {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(object.material);
        }
      }
    }
  });

  // 2. Renderer & Context Cleanup
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }
}

function disposeMaterial(material) {
  // Dispose all associated textures
  Object.keys(material).forEach((prop) => {
    if (material[prop] && material[prop].isTexture) {
      material[prop].dispose();
    }
  });
  material.dispose();
}
```

---

## 6. Mobile Degradation & Feature Tiering Matrix

Adjust graphical intensity dynamically according to device hardware capabilities.

```javascript
export function detectDeviceTier() {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || (window.innerWidth < 768);

  const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

  if (isMobile || isLowPower) {
    return {
      tier: 'mobile',
      particleCount: 1500,
      dpr: 1.5,
      postProcessing: false,
      enableShadows: false,
      textureScale: 0.5,
    };
  }

  return {
    tier: 'desktop',
    particleCount: 6000,
    dpr: 2.0,
    postProcessing: true,
    enableShadows: true,
    textureScale: 1.0,
  };
}
```

### Dynamic Configuration Application

```javascript
const hardwareConfig = detectDeviceTier();

// Apply configuration
renderer.setPixelRatio(Math.min(window.devicePixelRatio, hardwareConfig.dpr));
renderer.shadowMap.enabled = hardwareConfig.enableShadows;

const particles = createInstancedParticleField(hardwareConfig.particleCount);
scene.add(particles);
```
