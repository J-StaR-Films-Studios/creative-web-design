# Three.js & React Three Fiber (R3F) 3D Scene Architecture

An operational engineering reference for constructing performant browser-based 3D viewports, studio lighting rigs, responsive camera rigs, GLTF/GLB pipelines, and React Three Fiber (R3F) declarative scenes.

---

## 1. Studio Lighting Rig & Renderer Baseline

To achieve photorealistic, award-grade product rendering (Awwwards/FWA standard), configure a calibrated three-point studio lighting rig combined with HDR environment irradiance and clamped tone mapping.

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export function createStudio3DScene(mountElement) {
  // 1. Scene & Renderer Initialization
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  // Clamp DPR to max 2.0 to avoid fragment bottleneck on 4K/Retina displays
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mountElement.appendChild(renderer.domElement);

  // 2. Responsive Camera Rig
  const camera = new THREE.PerspectiveCamera(
    45,
    mountElement.clientWidth / mountElement.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5);

  // 3. Three-Point Studio Lighting Rig
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Key Light (Primary highlights & casting shadows)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(4, 5, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.bias = -0.0001;
  scene.add(keyLight);

  // Fill Light (Softens dark shadow crevices)
  const fillLight = new THREE.DirectionalLight(0xaaccff, 0.7);
  fillLight.position.set(-4, -1, 3);
  scene.add(fillLight);

  // Rim Light (Edge silhouette definition)
  const rimLight = new THREE.DirectionalLight(0xffeedd, 1.2);
  rimLight.position.set(0, 4, -4);
  scene.add(rimLight);

  return { scene, camera, renderer };
}
```

---

## 2. GLTF/GLB Asset Ingestion, Draco Decoding & Auto-Centering

Load compressed 3D assets, traverse mesh hierarchies to tune PBR physical materials, and auto-center the model using `THREE.Box3`.

```javascript
export function loadAndFitModel(scene, camera, modelUrl, onLoaded) {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load(modelUrl, (gltf) => {
    const model = gltf.scene;

    // 1. Traverse and optimize materials
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material.roughness = Math.max(child.material.roughness, 0.15);
          child.material.envMapIntensity = 1.0;
          child.material.needsUpdate = true;
        }
      }
    });

    // 2. Compute Bounding Box & Center Model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Reposition mesh to origin
    model.position.x -= center.x;
    model.position.y -= center.y;
    model.position.z -= center.z;

    // 3. Adjust Camera Distance based on Max Dimension
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;

    camera.position.z = cameraZ;
    camera.lookAt(0, 0, 0);

    scene.add(model);
    if (onLoaded) onLoaded(model);
  });
}
```

---

## 3. Synchronizing 3D Rotations with GSAP & Pointer Velocity

```javascript
export function bind3DModelScrollAndCursor(model, camera) {
  let targetRotationY = 0;
  let currentRotationY = 0;
  let mouseX = 0;
  let mouseY = 0;

  // Pointer interaction
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // GSAP ScrollTrigger Multi-Turn Rotation
  ScrollTrigger.create({
    trigger: '.pin-section',
    start: 'top top',
    end: '+=300%',
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      // 2 full turns (4*PI) across scroll range
      targetRotationY = self.progress * Math.PI * 4;
    },
  });

  // RAF loop with smooth lerp
  function updateFrame() {
    currentRotationY += (targetRotationY - currentRotationY) * 0.08;
    if (model) {
      model.rotation.y = currentRotationY + mouseX;
      model.rotation.x = mouseY * 0.5;
    }
  }

  return updateFrame;
}
```

---

## 4. React Three Fiber (R3F) Declarative Architecture

In React/Next.js architectures, implement 3D viewports with `@react-three/fiber` and `@react-three/drei`.

```tsx
import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveModel({ url, scrollProgress }: { url: string; scrollProgress: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  const { viewport, mouse } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Multi-turn spin synced with scroll
    const targetRotY = scrollProgress * Math.PI * 4;
    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      targetRotY + mouse.x * 0.3,
      6,
      delta
    );
    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      mouse.y * 0.2,
      6,
      delta
    );
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <primitive object={scene} scale={viewport.width > 6 ? 1.5 : 1.0} />
      </Float>

      {/* 3D-Anchored DOM Spec Callout */}
      <Html position={[1.2, 0.8, 0]} center distanceFactor={10}>
        <div className="bg-black/80 backdrop-blur-md text-white p-3 rounded-lg border border-white/20 text-xs w-44">
          <p className="font-bold tracking-wider">AEROSPACE ALLOY</p>
          <p className="text-white/60 mt-1">Grade 5 titanium chassis with custom micro-machined bezel.</p>
        </div>
      </Html>
    </group>
  );
}

export function R3FProductCanvas({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <Environment preset="city" />

        <React.Suspense fallback={null}>
          <InteractiveModel url="/models/product.glb" scrollProgress={scrollProgress} />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
```
