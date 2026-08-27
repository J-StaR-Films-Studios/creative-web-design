/**
 * Apple Titanium & Optical Glass Monolith Core - Three.js WebGL Scene
 * Studio Keynote lighting, brushed titanium bevels, smoked optical glass, and smooth dampening.
 */

import * as THREE from 'three';
import { crystalVertexShader, crystalFragmentShader } from './shaders';
import { soundEngine } from '../audio/Synthesizer';

export class ReasoningCore3D {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private monolithMesh: THREE.Mesh;
  private outerFrameMesh: THREE.Mesh;
  private innerDieMesh: THREE.Mesh;
  private ringMeshA: THREE.Mesh;
  private ringMeshB: THREE.Mesh;
  private mainGroup: THREE.Group;

  private monolithMaterial: THREE.ShaderMaterial;
  private currentBudget: number = 64;
  private targetBudget: number = 64;
  private currentScrollProgress: number = 0;
  private targetScrollProgress: number = 0;

  private mouse = new THREE.Vector2(0, 0);
  private targetMouse = new THREE.Vector2(0, 0);

  private scratchAxisY = new THREE.Vector3(0, 1, 0);
  private lastRotationY = 0;
  private isDisposed: boolean = false;
  private rafId: number | null = null;
  private clock: THREE.Clock;

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 5.2);

    // 2. High-Performance WebGL Renderer with Filmic Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(dpr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    container.appendChild(this.renderer.domElement);

    // 3. Main Transform Group
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    // 4. Apple Keynote Studio Lighting Rig
    this.setupStudioLighting();

    // 5. Construct Precision Silicon Monolith Meshes
    const { monolith, outerFrame, innerDie, ringA, ringB, material } = this.buildMonolith();
    this.monolithMesh = monolith;
    this.outerFrameMesh = outerFrame;
    this.innerDieMesh = innerDie;
    this.ringMeshA = ringA;
    this.ringMeshB = ringB;
    this.monolithMaterial = material;

    this.mainGroup.add(this.monolithMesh);
    this.mainGroup.add(this.outerFrameMesh);
    this.mainGroup.add(this.innerDieMesh);
    this.mainGroup.add(this.ringMeshA);
    this.mainGroup.add(this.ringMeshB);

    this.bindEvents();
    this.animate();
  }

  private setupStudioLighting(): void {
    // Key Light: Soft, pure white studio directional light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    this.scene.add(keyLight);

    // Fill Light: Cool titanium ambient fill
    const fillLight = new THREE.DirectionalLight(0xd2d2d7, 1.0);
    fillLight.position.set(-4, -2, -2);
    this.scene.add(fillLight);

    // Rim Highlight: Crisp metallic contour reflection
    const rimLight = new THREE.DirectionalLight(0xf5f5f7, 1.6);
    rimLight.position.set(0, 5, -4);
    this.scene.add(rimLight);

    // Soft baseline ambient
    const ambient = new THREE.AmbientLight(0x1a1a20, 0.8);
    this.scene.add(ambient);
  }

  private buildMonolith() {
    // 1. Central Smoked Optical Glass Lens / Monolith
    const monolithGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const material = new THREE.ShaderMaterial({
      vertexShader: crystalVertexShader,
      fragmentShader: crystalFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uReasoningBudget: { value: this.currentBudget },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
    const monolith = new THREE.Mesh(monolithGeo, material);

    // 2. Anodized Brushed Titanium Beveled Frame
    const outerGeo = new THREE.IcosahedronGeometry(1.48, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x86868b,
      metalness: 0.95,
      roughness: 0.18,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerFrame = new THREE.Mesh(outerGeo, outerMat);

    // 3. Dense Mirror-Finish Silicon Core Die
    const innerGeo = new THREE.OctahedronGeometry(0.55, 2);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x1c1c22,
      emissive: 0x111116,
      roughness: 0.05,
      metalness: 0.98,
    });
    const innerDie = new THREE.Mesh(innerGeo, innerMat);

    // 4. Precision Floating Orbital Rings (Titanium Micro-Calipers)
    const ringGeoA = new THREE.TorusGeometry(1.85, 0.008, 16, 120);
    const ringMatA = new THREE.MeshStandardMaterial({
      color: 0xe8e8ed,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.4,
    });
    const ringA = new THREE.Mesh(ringGeoA, ringMatA);
    ringA.rotation.x = Math.PI / 3;

    const ringGeoB = new THREE.TorusGeometry(2.1, 0.006, 16, 120);
    const ringMatB = new THREE.MeshStandardMaterial({
      color: 0xa1a1a6,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.25,
    });
    const ringB = new THREE.Mesh(ringGeoB, ringMatB);
    ringB.rotation.y = Math.PI / 4;

    return { monolith, outerFrame, innerDie, ringA, ringB, material };
  }

  private bindEvents(): void {
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  public resize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(dpr);
  }

  public setReasoningBudget(budget: number): void {
    this.targetBudget = Math.max(1, Math.min(budget, 512));
    soundEngine.setReasoningIntensity(this.targetBudget, this.currentScrollProgress);
  }

  public setScrollProgress(progress: number): void {
    this.targetScrollProgress = progress;
  }

  private animate(): void {
    if (this.isDisposed) return;

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smoothly interpolate Reasoning Budget & Shader Uniforms
    this.currentBudget += (this.targetBudget - this.currentBudget) * (delta * 4);
    this.monolithMaterial.uniforms.uReasoningBudget.value = this.currentBudget;
    this.monolithMaterial.uniforms.uTime.value = elapsedTime;

    // 2. Interpolate Scroll & Subtle Pointer Parallax
    this.currentScrollProgress += (this.targetScrollProgress - this.currentScrollProgress) * (delta * 5);
    this.mouse.lerp(this.targetMouse, delta * 3);

    // 3. Axis-Angle Multi-Turn Scroll Rotation
    const targetRotY = this.currentScrollProgress * Math.PI * 3.5 + this.mouse.x * 0.25;
    const deltaY = targetRotY - this.lastRotationY;
    this.mainGroup.rotateOnAxis(this.scratchAxisY, deltaY);
    this.lastRotationY = targetRotY;

    // Subtle gentle X tilt
    this.mainGroup.rotation.x = this.mouse.y * 0.2 + Math.sin(elapsedTime * 0.4) * 0.05;

    // Counter-rotation of precision caliper rings & outer frame
    this.outerFrameMesh.rotation.y -= delta * 0.15;
    this.ringMeshA.rotation.z += delta * 0.12;
    this.ringMeshB.rotation.x -= delta * 0.08;

    // Exploded View Expansion as you scroll into Strata (0.35 -> 0.75)
    const explodeFactor = Math.sin(this.currentScrollProgress * Math.PI) * 0.35;
    const budgetScale = 1.0 + (this.currentBudget / 512) * 0.15;

    this.outerFrameMesh.scale.setScalar(1.0 + explodeFactor + (budgetScale - 1.0) * 0.5);
    this.innerDieMesh.scale.setScalar(1.0 - explodeFactor * 0.2);

    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  public destroy(): void {
    this.isDisposed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);

    this.monolithMesh.geometry.dispose();
    this.monolithMaterial.dispose();
    this.outerFrameMesh.geometry.dispose();
    (this.outerFrameMesh.material as THREE.Material).dispose();
    this.innerDieMesh.geometry.dispose();
    (this.innerDieMesh.material as THREE.Material).dispose();
    this.ringMeshA.geometry.dispose();
    (this.ringMeshA.material as THREE.Material).dispose();
    this.ringMeshB.geometry.dispose();
    (this.ringMeshB.material as THREE.Material).dispose();

    this.renderer.dispose();
    this.renderer.forceContextLoss();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
