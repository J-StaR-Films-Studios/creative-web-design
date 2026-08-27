# Performance Engineering

Mandatory constraints for Awwwards-tier performance.

## 1. DPR Clamping
Never render blindly at native DPR on 3x/4x mobile devices.
```javascript
// Three.js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Canvas 2D
const dpr = Math.min(window.devicePixelRatio, 2);
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
ctx.scale(dpr, dpr);
```

## 2. InstancedMesh
Use InstancedMesh for > 100 identical geometries.
```javascript
const mesh = new THREE.InstancedMesh(geometry, material, count);
const dummy = new THREE.Object3D();

for (let i = 0; i < count; i++) {
  dummy.position.set(Math.random(), Math.random(), Math.random());
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
}
mesh.instanceMatrix.needsUpdate = true;
scene.add(mesh);
```

## 3. Intersection Observers
Pause RAF loop and GSAP tickers when off-screen.
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startRAF();
    } else {
      stopRAF();
    }
  });
});
observer.observe(document.querySelector('.canvas-container'));
```
