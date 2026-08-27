# Three.js & React Three Fiber (R3F) Architecture

An operational engineering manual for building 3D browser viewports, importing Draco-compressed GLTF assets, building responsive camera rigs, and synchronizing 3D scenes with page scroll.

---

## 1. WebGLRenderer Setup & Studio Configuration

Initialize a high-performance WebGL context with transparent alpha background, filmic tone mapping, and clamped pixel ratio.

```javascript
import * as THREE from 'three';

export function createWebGLStudio(container) {
  // 1. Scene Graph
  const scene = new THREE.Scene();

  // 2. Perspective Camera
  const fov = 45;
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
  camera.position.set(0, 0, 5);

  // 3. WebGL Renderer with High-Performance Settings
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true, // Transparent canvas background
    powerPreference: 'high-performance',
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Strict DPR clamp
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}
```

---

## 2. Studio Lighting Rig

Construct a three-point studio lighting environment that accentuates metallic and dielectric 3D surfaces.

```javascript
export function setupStudioLighting(scene) {
  // 1. Key Light (Cast Soft Shadows)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(3, 4, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 15;
  scene.add(keyLight);

  // 2. Fill Light (Soft Blue Tint)
  const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.6);
  fillLight.position.set(-3, 0, -2);
  scene.add(fillLight);

  // 3. Rim / Hair Light (Warm Gold Contour)
  const rimLight = new THREE.DirectionalLight(0xfef08a, 0.8);
  rimLight.position.set(0, 4, -4);
  scene.add(rimLight);

  // 4. Ambient Base Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  return { keyLight, fillLight, rimLight, ambientLight };
}
```

---

## 3. Draco GLTF Asset Loading & Responsive Bounding Rig

Ingest 3D models compressed with Google Draco, normalize material surface parameters, and dynamically calculate camera distance to fit any screen size.

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export function loadGLTFModel(url, scene, camera, isMobile = false) {
  return new Promise((resolve, reject) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;

        // 1. Traverse & Tune Materials
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
              node.material.roughness = 0.25;
              node.material.metalness = 0.85;
              node.material.envMapIntensity = 1.0;
            }
          }
        });

        // 2. Compute Accurate Bounding Box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center Model Geometry at Origin
        model.position.x += model.position.x - center.x;
        model.position.y += model.position.y - center.y;
        model.position.z += model.position.z - center.z;

        // 3. Responsive Camera Positioning
        const maxDim = Math.max(size.x, size.y, size.z);
        const cameraDistance = isMobile ? maxDim * 2.2 : maxDim * 1.4;

        camera.position.set(0, 0, cameraDistance);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();

        scene.add(model);
        dracoLoader.dispose();
        resolve({ model, box, size });
      },
      undefined,
      reject
    );
  });
}
```

---

## 4. Multi-Turn Scroll Rotation via Axis-Angle Mathematics

Avoid Euler angle flipping and gimbal lock by rotating meshes on normalized axis vectors during GSAP ScrollTrigger scrubbing.

```javascript
let currentRadianOffset = 0;

export function bindModelScrollRotation(model, scrollTriggerInstance) {
  // Pinned rotation tracking
  const axis = new THREE.Vector3(0, 1, 0); // Y-axis rotation

  return (progress) => {
    if (!model) return;

    // Target 6 complete 360-degree rotations (12 PI) across scroll progress
    const targetRadians = progress * Math.PI * 2 * 6;
    const deltaRadians = targetRadians - currentRadianOffset;

    if (Math.abs(deltaRadians) > 0.0001) {
      model.rotateOnAxis(axis, deltaRadians);
      currentRadianOffset = targetRadians;
    }
  };
}
```

---

## 5. React Three Fiber (R3F) Declarative Architecture

Deploy 3D scenes cleanly into React applications with `@react-three/fiber` and `@react-three/drei`.

```jsx
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, Center } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveModel({ scrollProgress }) {
  const meshRef = useRef();
  const { scene } = useGLTF('/assets/product.glb');

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Continuous subtle floating + scroll-driven rotation
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      scrollProgress.current * Math.PI * 4,
      0.08
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Center>
        <primitive ref={meshRef} object={scene} scale={1.2} />
      </Center>
    </Float>
  );
}

export default function SceneCanvas({ scrollProgress }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]} // Clamped DPR between 1 and 2
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <Suspense fallback={null}>
          <InteractiveModel scrollProgress={scrollProgress} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

---

## 6. On-Demand "Dirty" Rendering for Battery Conservation

In interactive landing pages where the 3D model does not continuously spin while idle, decouple from continuous 60 FPS RAF rendering and invoke `renderer.render()` strictly on state changes.

```javascript
export class OnDemandViewer {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.isDirty = true;

    this.render = this.render.bind(this);
    this.setDirty = this.setDirty.bind(this);
  }

  setDirty() {
    if (!this.isDirty) {
      this.isDirty = true;
      requestAnimationFrame(this.render);
    }
  }

  render() {
    if (this.isDirty) {
      this.renderer.render(this.scene, this.camera);
      this.isDirty = false;
    }
  }
}
```
