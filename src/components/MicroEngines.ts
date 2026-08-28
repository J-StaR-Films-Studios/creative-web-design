import * as THREE from 'three';
import { soundEngine } from '../core/audio';

/**
 * 01 / HYPERTHOUGHT Micro-Engine
 * Rotating 3D Silicon Monolith with exploding wireframe strata
 */
export class HyperthoughtMicroEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private group: THREE.Group;
  private isDisposed: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 200;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 4.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));

    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Silicon Monolith Core Box
    const coreGeo = new THREE.BoxGeometry(1.2, 1.8, 0.4);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x12141A,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(coreMesh);

    // Wireframe Strata Outer Cage
    const wireGeo = new THREE.BoxGeometry(1.4, 2.0, 0.6);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    this.group.add(wireMesh);

    // Studio Lighting
    const ambient = new THREE.AmbientLight(0xFFFFFF, 1.2);
    this.scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xFF3B00, 3.0);
    dirLight.position.set(3, 4, 3);
    this.scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x00E5FF, 4.0, 10);
    blueLight.position.set(-2, -2, 2);
    this.scene.add(blueLight);
  }

  public update(time: number): void {
    if (this.isDisposed) return;
    const sec = time * 0.001;
    this.group.rotation.y = sec * 0.8;
    this.group.rotation.x = Math.sin(sec * 0.5) * 0.25;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.isDisposed = true;
    this.renderer.dispose();
  }
}

/**
 * 02 / THE HOROLOGIST Micro-Engine
 * Live mechanical horological escapement ticking at 4Hz with balance oscillation
 */
export class HorologistMicroEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 300;
  private height: number = 200;
  private dpr: number = Math.min(window.devicePixelRatio || 1, 2.0);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
  }

  public resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 300;
    this.height = rect.height || 200;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  public update(time: number): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2;
    const sec = time * 0.001;

    // 4Hz Balance Wheel Oscillation (28,800 vph)
    const balanceAngle = Math.sin(sec * Math.PI * 4) * 0.65;
    const escapeAngle = (sec * 0.8) % (Math.PI * 2);

    ctx.save();
    ctx.translate(cx, cy);

    // Escapement Gear Outer Ring
    ctx.strokeStyle = '#D4AF37'; // Brass Horological Gold
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 55, 0, Math.PI * 2);
    ctx.stroke();

    // Escape Wheel Teeth (15 club teeth)
    ctx.save();
    ctx.rotate(escapeAngle);
    const teeth = 15;
    for (let i = 0; i < teeth; i++) {
      ctx.rotate((Math.PI * 2) / teeth);
      ctx.beginPath();
      ctx.moveTo(48, -3);
      ctx.lineTo(58, 0);
      ctx.lineTo(48, 3);
      ctx.stroke();
    }
    ctx.restore();

    // Pallet Fork & Lever Arms
    ctx.save();
    ctx.rotate(balanceAngle * 0.25);
    ctx.strokeStyle = '#FF3B00';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -42);
    ctx.lineTo(-18, -35);
    ctx.moveTo(0, -42);
    ctx.lineTo(18, -35);
    ctx.stroke();
    ctx.restore();

    // Hairspring Coils
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const coils = 6;
    for (let a = 0; a < Math.PI * 2 * coils; a += 0.1) {
      const r = (a / (Math.PI * 2 * coils)) * 32 + balanceAngle * 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Center Jewel (Synthetic Ruby)
    ctx.fillStyle = '#E63946';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

/**
 * 03 / TERRA ARCHIVE Micro-Engine
 * Subterranean Topographic Contour Radar reacting to cursor
 */
export class TerraMicroEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 300;
  private height: number = 200;
  private mouseX: number = 150;
  private mouseY: number = 100;
  private dpr: number = Math.min(window.devicePixelRatio || 1, 2.0);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.setupListeners();
  }

  public resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 300;
    this.height = rect.height || 200;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private setupListeners(): void {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      soundEngine.playHoverChirp(520);
    });
  }

  public update(time: number): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const sec = time * 0.001;
    const lines = 12;

    ctx.strokeStyle = '#C86432'; // Terracotta Ochre
    ctx.lineWidth = 1;

    for (let l = 1; l <= lines; l++) {
      ctx.beginPath();
      const baseRadius = l * 12;
      const points = 40;

      for (let p = 0; p <= points; p++) {
        const theta = (p / points) * Math.PI * 2;

        // Topographic Simplex-like noise ripple
        const noise = Math.sin(theta * 3 + sec * 1.5) * 6 + Math.cos(l * 0.5 + theta * 2) * 4;
        const x = this.mouseX + Math.cos(theta) * (baseRadius + noise);
        const y = this.mouseY + Math.sin(theta) * (baseRadius + noise);

        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.2 + (l / lines) * 0.7;
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }
}

/**
 * 04 / VOID / FORM Micro-Engine
 * Real-time Simplex noise fluid shader simulation
 */
export class VoidMicroEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 300;
  private height: number = 200;
  private dpr: number = Math.min(window.devicePixelRatio || 1, 2.0);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
  }

  public resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 300;
    this.height = rect.height || 200;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  public update(time: number): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const sec = time * 0.001;
    const cx = this.width / 2;
    const cy = this.height / 2;

    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 90);
    grad.addColorStop(0, '#FF3B00');
    grad.addColorStop(0.5, '#2D1B2D');
    grad.addColorStop(1, '#0A0B0D');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Wave distortion ribbons
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;

    for (let r = 0; r < 5; r++) {
      ctx.beginPath();
      for (let x = 0; x < this.width; x += 10) {
        const y = cy + Math.sin(x * 0.02 + sec * 2 + r) * 25 * Math.cos(sec + r * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
}

/**
 * 05 / THE LIVING ARCHIVE Micro-Engine
 * Dynamic particle swarm coupled to scroll momentum
 */
export class ArchiveMicroEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
  private width: number = 300;
  private height: number = 200;
  private dpr: number = Math.min(window.devicePixelRatio || 1, 2.0);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.initParticles();
  }

  public resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 300;
    this.height = rect.height || 200;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private initParticles(): void {
    this.particles = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: 1.5 + Math.random() * 2,
      });
    }
  }

  public update(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#00E5FF';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Connect near neighbors
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 45) {
          ctx.strokeStyle = `rgba(0, 229, 255, ${1 - dist / 45})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }
}
