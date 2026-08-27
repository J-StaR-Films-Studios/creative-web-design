# Performance Engineering & Profiling

Maintain 60fps across devices by ruthlessly optimizing draw calls, memory allocation, and layout thrashing.

## 1. Pixel Ratio Clamping

High DPR screens (retina displays on Mac/iPhone) will crash if you ask WebGL to render native resolution on heavy shaders. Always clamp.

```javascript
// In Three.js / R3F
const pixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);
```

## 2. Memory Pre-allocation (No `new` in loops)

Never instantiate vectors, matrices, or objects inside `useFrame` or `requestAnimationFrame`. Pre-allocate them.

```javascript
// AVOID:
useFrame(() => {
  const position = new THREE.Vector3(0, 0, 0); // BAD: Triggers GC constantly
  mesh.position.copy(position);
});

// USE:
const targetPosition = new THREE.Vector3();
useFrame(() => {
  targetPosition.set(x, y, z); // GOOD: Mutating existing object
  mesh.position.copy(targetPosition);
});
```

## 3. DOM Repaint Minimization

When animating DOM elements, force GPU acceleration and avoid triggering layout calculation properties (like `width`, `top`, `left`).

- **Use**: `transform: translate3d(x, y, z)`, `scale`, `opacity`, `rotate`.
- **Add**: `will-change: transform` dynamically before animation, remove after.

```javascript
gsap.to('.card', {
  xPercent: 100, // Uses transform
  force3D: true, // Forces hardware acceleration
});
```

## 4. Disposal and Memory Leaks

Always dispose geometries, materials, and textures when a component unmounts. If using raw Three.js, call `.dispose()`. In React, handle cleanup in `useEffect`.

```javascript
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
    texture.dispose();
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}, []);
```
