# Examples & Timeline Blueprint

## Scroll Timeline Progress Map

| Scroll Progress Range | Target Component | Action / Transformation |
|---|---|---|
| **0.00 - 0.05** | Master Pinned Section | Section locks to top; initial headline rolls in character-by-character. |
| **0.05 - 0.35** | `.header-1` | Marquee text slides from `0%` to `-100%` along X-axis. |
| **0.05 - 1.00** | 3D Model (`.glb`) | Model rotates continuously across Y-axis (12 full revolutions). |
| **0.15 - 0.50** | `.header-2` | Second headline slides from `+100%` (offscreen right) to `-200%` (offscreen left). |
| **0.20 - 0.30** | `.circular-mask` | Dark circular background expands from `circle(0%)` to `circle(100%)`. |
| **0.45 - 0.65** | `.tooltip .divider` | Horizontal divider lines expand from `scaleX(0)` to `scaleX(1)`. |
| **0.65+** | Tooltip 1 Callout | Icon, title lines, and description lines stagger upward (`translateY: 0%`). |
| **0.85+** | Tooltip 2 Callout | Second feature callout staggers upward (`translateY: 0%`). |

---

## Minimal Core Integration Script

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

// 1. Smooth Scroll Setup
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 2. Three.js Initialization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.querySelector('.model-container').appendChild(renderer.domElement);

// 3. Lighting Rig
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
keyLight.position.set(2, 3, 2);
scene.add(keyLight);

// 4. Model Load & Auto-Centering
let model, modelSize, currentRotation = 0;
new GLTFLoader().load('product.glb', (gltf) => {
  model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  modelSize = box.getSize(new THREE.Vector3());
  
  model.position.set(-center.x + modelSize.x * 0.4, -center.y, -center.z);
  camera.position.set(0, 0, Math.max(modelSize.x, modelSize.y, modelSize.z) * 1.25);
  scene.add(model);
});

// Render Loop
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();

// 5. ScrollTrigger Master Scrub
ScrollTrigger.create({
  trigger: '.product-overview',
  start: 'top top',
  end: '+=1000%',
  pin: true,
  pinSpacing: true,
  scrub: 1,
  onUpdate: (self) => {
    const p = self.progress;
    if (model && p >= 0.05) {
      const targetRotation = Math.PI * 12 * ((p - 0.05) / 0.95);
      const diff = targetRotation - currentRotation;
      if (Math.abs(diff) > 0.001) {
        model.rotateOnAxis(new THREE.Vector3(0, 1, 0), diff);
        currentRotation = targetRotation;
      }
    }
  }
});
```
