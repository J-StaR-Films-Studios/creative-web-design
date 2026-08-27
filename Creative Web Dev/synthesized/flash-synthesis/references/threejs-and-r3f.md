# Three.js & React Three Fiber (R3F) Architecture

An authoritative engineering manual for constructing 3D browser viewports, importing DRACO-compressed GLTF assets, building responsive camera projection rigs, and synchronizing 3D scenes with page scroll.

---

## 1. WebGLRenderer Setup & Screen Projection Rig

To guarantee photorealistic color output and prevent high-DPI GPU thermal throttling, configure the WebGL renderer with transparent alpha backgrounds, filmic tone mapping, and clamped pixel ratio.

### Master Three.js Scene Boilerplate

```javascript
import * as THREE from 'three';

export function createWebGLStudio(container) {
  // 1. Scene Graph & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // 2. High-Performance WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true, // Transparent canvas background for seamless DOM stacking
    powerPreference: 'high-performance',
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0)); // Strict DPR clamping
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

// 3. Pixel-to-Unit Viewport Matching (1 Three.js Unit = 1 CSS Pixel at Z = 0)
export function calculateExactFOV(distance, height) {
  return 2 * Math.atan(height / (2 * distance)) * (180 / Math.PI);
}
```

---

## 2. Studio Lighting Rig Architecture

Establish a 3-point studio lighting hierarchy paired with HDR environment lighting to accentuate metallic and dielectric surfaces.

```javascript
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export function setupStudioLighting(scene) {
  // 1. Key Light (Cast Soft Directional Shadows)
  const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.8);
  keyLight.position.set(4, 5, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0001;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 15;
  scene.add(keyLight);

  // 2. Fill Light (Cool Silhouette Separation)
  const fillLight = new THREE.DirectionalLight(0xd6eaff, 0.8);
  fillLight.position.set(-4, -1, -2);
  scene.add(fillLight);

  // 3. Rim / Contour Highlight
  const rimLight = new THREE.DirectionalLight(0xfef08a, 1.0);
  rimLight.position.set(0, 4, -4);
  scene.add(rimLight);

  // 4. Ambient Fill Base
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // 5. Optional: HDR Environment Reflection Map
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('/assets/hdr/studio_soft.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // Supplies real-time PBR reflections
  });

  return { keyLight, fillLight, rimLight, ambientLight };
}
```

---

## 3. DRACO GLTF Asset Loading & Responsive Bounding Rig

Ingest 3D models compressed with Google DRACO, normalize material surface parameters, auto-center geometry at origin $(0,0,0)$, and dynamically calculate camera distance to fit any screen size.

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export function loadDracoGLTF(url, scene, camera, isMobile = false) {
  return new Promise((resolve, reject) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    dracoLoader.setDecoderConfig({ type: 'js' });

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;

        // 1. Traverse & Enforce PBR Surface Standards
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.25;
              child.material.metalness = 0.85;
              child.material.envMapIntensity = 1.0;
              if (child.material.map) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
              }
            }
          }
        });

        // 2. Compute Accurate Spatial Bounding Box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center Model at Origin (0, 0, 0)
        model.position.x += model.position.x - center.x;
        model.position.y += model.position.y - center.y;
        model.position.z += model.position.z - center.z;

        // 3. Responsive Camera Fit
        const maxDim = Math.max(size.x, size.y, size.z);
        const cameraDistance = isMobile ? maxDim * 2.2 : maxDim * 1.5;

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

export function bindModelScrollRotation(model) {
  const axis = new THREE.Vector3(0, 1, 0); // Normalized vertical axis

  return (progress) => {
    if (!model) return;

    // Target 4 complete 360-degree rotations (8 PI) across scroll progress
    const targetRadians = progress * Math.PI * 2 * 4;
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

Deploy 3D scenes cleanly into React / Next.js applications using `@react-three/fiber` and `@react-three/drei`.

```tsx
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveModel({ scrollProgress }: { scrollProgress: { current: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/assets/models/product.glb');

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smoothly interpolate rotation based on scroll progress + subtle cursor parallax
    const targetY = scrollProgress.current * Math.PI * 4 + state.pointer.x * 0.3;
    const targetX = state.pointer.y * 0.2;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 4, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 4, delta);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef}>
        <Center>
          <primitive object={scene} scale={1.4} />
        </Center>
      </group>
    </Float>
  );
}

export function SceneCanvas({ scrollProgress }: { scrollProgress: { current: number } }) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]} // Clamped DPR between 1x and 2x
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <Suspense fallback={null}>
          <InteractiveModel scrollProgress={scrollProgress} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/assets/models/product.glb');
```

---

## 6. On-Demand "Dirty" Rendering for Battery Conservation

In interactive landing pages where 3D meshes do not spin while idle, decouple from continuous 60 FPS RAF rendering and invoke `renderer.render()` strictly on state changes.

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

---

## 7. GPU Memory Deallocation Protocol

When unmounting Three.js scenes or transitioning routes in Single Page Applications, explicitly free WebGL textures and vertex buffers to prevent runaway memory leaks.

```javascript
export function disposeThreeScene(scene, renderer) {
  if (!scene) return;

  // 1. Recursive Scene Traversal
  scene.traverse((object) => {
    if (!object.isMesh) return;

    // Dispose Geometry
    if (object.geometry) {
      object.geometry.dispose();
    }

    // Dispose Materials & Associated Textures
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((mat) => disposeMaterial(mat));
      } else {
        disposeMaterial(object.material);
      }
    }
  });

  // 2. Renderer Context Loss
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }
}

function disposeMaterial(mat) {
  Object.keys(mat).forEach((prop) => {
    if (mat[prop] && typeof mat[prop].dispose === 'function') {
      mat[prop].dispose();
    }
  });
  mat.dispose();
}
```
