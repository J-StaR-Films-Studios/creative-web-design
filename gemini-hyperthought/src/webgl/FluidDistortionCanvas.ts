/**
 * Apple Ambient Spotlight Glow Plane
 * Ultra-subtle, serene radial lighting following cursor position with velvety falloff.
 */

import * as THREE from 'three';
import { fluidVertexShader, fluidFragmentShader } from './shaders';

export class FluidDistortionCanvas {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;

  private mouse = new THREE.Vector2(0.5, 0.5);
  private targetMouse = new THREE.Vector2(0.5, 0.5);
  private prevMouse = new THREE.Vector2(0.5, 0.5);
  private speed = 0;
  private isDisposed: boolean = false;
  private rafId: number | null = null;
  private clock: THREE.Clock;

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(dpr);

    container.appendChild(this.renderer.domElement);

    this.material = new THREE.ShaderMaterial({
      vertexShader: fluidVertexShader,
      fragmentShader: fluidFragmentShader,
      uniforms: {
        uMouse: { value: this.mouse },
        uSpeed: { value: 0 },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    this.bindEvents();
    this.animate();
  }

  private bindEvents(): void {
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = e.clientX / window.innerWidth;
      this.targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  public resize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.renderer.setSize(width, height);
    this.material.uniforms.uResolution.value.set(width, height);
  }

  private animate(): void {
    if (this.isDisposed) return;

    const delta = this.clock.getDelta();

    // Smooth lerp
    this.mouse.lerp(this.targetMouse, delta * 8);

    const dx = this.mouse.x - this.prevMouse.x;
    const dy = this.mouse.y - this.prevMouse.y;
    this.speed = Math.hypot(dx, dy);
    this.prevMouse.copy(this.mouse);

    this.material.uniforms.uMouse.value.copy(this.mouse);
    this.material.uniforms.uSpeed.value = this.speed;

    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  public destroy(): void {
    this.isDisposed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);

    this.mesh.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();

    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
