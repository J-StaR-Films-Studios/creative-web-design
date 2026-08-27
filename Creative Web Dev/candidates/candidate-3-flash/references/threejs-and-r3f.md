# Three.js & React Three Fiber (R3F) Scene Architecture

A comprehensive operational manual for building production 3D web environments, optimized GLTF model loaders, responsive camera rigs, and React Three Fiber integrations.

---

## 1. WebGLRenderer Setup & Screen Projection Rig

To guarantee photorealistic color output and prevent high-DPI GPU thermal throttling, configure the WebGL renderer with strict memory and color-space parameters.

### Master Three.js Scene Boilerplate

```javascript
import * as THREE from 'three';

// 1. Instantiate Core Subsystems
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#webgl-canvas'),
  antialias: true,
  alpha: true, // Transparent canvas background for seamless DOM stacking
  powerPreference: 'high-performance'
});

// 2. Strict Display Scaling & Color Management
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // DPR clamped to 2x max
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// 3. Pixel-to-Unit Viewport Matching (1 Three.js Unit = 1 CSS Pixel at Z = 0)
function calculateExactFOV(distance, height) {
  return 2 * Math.atan(height / (2 * distance)) * (180 / Math.PI);
}
```

---

## 2. Optimized GLTF / GLB Asset Pipeline with DRACO

Process all 3D assets through DRACO geometry compression to shrink asset payloads by 70–90%.

### DRACO Loader & Auto-Centering Pipeline

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// 1. Configure DRACO Decoder
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
dracoLoader.setDecoderConfig({ type: 'js' });

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// 2. Load, Normalize Bounding Box, and Center Model
let activeModel = null;

gltfLoader.load('/assets/models/product.glb', (gltf) => {
  activeModel = gltf.scene;

  // Compute exact spatial bounding box
  const box = new THREE.Box3().setFromObject(activeModel);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // Center model origin at (0, 0, 0)
  activeModel.position.x += (activeModel.position.x - center.x);
  activeModel.position.y += (activeModel.position.y - center.y);
  activeModel.position.z += (activeModel.position.z - center.z);

  // Normalize scale to fit standardized 2-unit bounding radius
  const maxAxis = Math.max(size.x, size.y, size.z);
  const targetScale = 2.0 / maxAxis;
  activeModel.scale.setScalar(targetScale);

  // Traverse materials to enable shadows and enforce sRGB maps
  activeModel.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material.map) {
        child.material.map.colorSpace = THREE.SRGBColorSpace;
      }
    }
  });

  scene.add(activeModel);
});
```

---

## 3. Studio Lighting Rig Architecture

Establish a 3-point studio lighting hierarchy paired with HDR environment lighting for premium product visualization.

```javascript
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

function setupStudioLighting(scene, renderer) {
  // 1. Ambient Fill Light
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  // 2. Directional Key Light (Warm Highlight)
  const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0001;
  scene.add(keyLight);

  // 3. Directional Rim Light (Cool Silhouette Separation)
  const rimLight = new THREE.DirectionalLight(0xd6eaff, 1.5);
  rimLight.position.set(-5, 3, -5);
  scene.add(rimLight);

  // 4. HDR Environment Map
  new RGBELoader().load('/assets/hdr/studio_soft.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // Supplies real-time PBR material reflections
  });
}
```

---

## 4. Scroll-Driven 3D Model Choreography (Three.js + GSAP)

Map scroll progress directly to 3D object rotation, translation, and camera orbits using ScrollTrigger.

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function bind3DScrollAnimation(model, camera) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.product-experience-section',
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1
    }
  });

  // Stage 1: Spin 360 degrees and float forward
  tl.to(model.rotation, { y: Math.PI * 2, x: 0.2, ease: 'none' }, 0.0)
    .to(camera.position, { z: 3.5, y: 0.5, ease: 'none' }, 0.0)
    
  // Stage 2: Explode / Pan right for feature callout
    .to(model.position, { x: 1.5, ease: 'none' }, 0.4)
    .to(model.rotation, { y: Math.PI * 3, ease: 'none' }, 0.4)
    
  // Stage 3: Return to center and zoom out
    .to(model.position, { x: 0, ease: 'none' }, 0.8)
    .to(camera.position, { z: 5.0, y: 0, ease: 'none' }, 0.8);
}
```

---

## 5. React Three Fiber (R3F) Modern Declarative Architecture

In React/Next.js production environments, implement 3D experiences using `@react-three/fiber` and `@react-three/drei`.

### Complete R3F Product Viewer Component

```tsx
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

function Model({ scrollProgress }: { scrollProgress: number }) {
  const group = useRef<THREE.Group>(null);
  // useGLTF automatically loads and caches DRACO-compressed GLB assets
  const { scene } = useGLTF('/assets/models/product.glb');

  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Smoothly interpolate rotation based on scroll progress + subtle cursor parallax
    const targetY = scrollProgress * Math.PI * 4 + state.pointer.x * 0.3;
    const targetX = state.pointer.y * 0.2;

    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group}>
        <primitive object={scene} scale={1.5} />
      </group>
    </Float>
  );
}

export function SceneCanvas({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]} // Automatic DPR clamping between 1x and 2x
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Model scrollProgress={scrollProgress} />
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

## 6. GPU Memory Deallocation Protocol

When unmounting Three.js scenes, explicitly free WebGL textures and vertex buffers to prevent runaway memory leaks.

```javascript
function disposeScene(scene, renderer) {
  scene.traverse((object) => {
    if (!object.isMesh) return;

    // Dispose Geometry
    if (object.geometry) {
      object.geometry.dispose();
    }

    // Dispose Materials & Textures
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((mat) => disposeMaterial(mat));
      } else {
        disposeMaterial(object.material);
      }
    }
  });

  renderer.dispose();
  renderer.forceContextLoss();
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
