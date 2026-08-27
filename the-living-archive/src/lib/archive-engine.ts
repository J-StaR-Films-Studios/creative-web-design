'use client';

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ARCHIVE_ARTIFACTS } from './archive-data';
import { ArchiveArtifact, RoomId } from './types';
import { globalAudio } from './audio-engine';
import type Lenis from 'lenis';

export class ArchiveEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private rooms: Map<RoomId, THREE.Group> = new Map();
  private cursorLight: THREE.PointLight;
  private spotLight: THREE.SpotLight;
  private scrollProgress: number = 0;
  private targetScrollProgress: number = 0;
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private mouseTarget: THREE.Vector2 = new THREE.Vector2();
  private rememberedArtifactIds: Set<string> = new Set();
  private memoryGhostsGroup: THREE.Group = new THREE.Group();
  private isFrozen: boolean = false;
  private _isDestroying: boolean = false;
  private destructionProgress: number = 0;
  private clock: THREE.Clock;
  private animationId: number = 0;
  private raycaster: THREE.Raycaster;
  private hoveredObject: THREE.Object3D | null = null;
  private interactiveObjects: THREE.Object3D[] = [];
  private lenis: Lenis | null = null;
  private soundSculptures: THREE.Mesh[] = [];
  private filmScreenMaterial: THREE.ShaderMaterial | null = null;
  private initialObjectTransforms: Map<THREE.Object3D, { pos: THREE.Vector3; rot: THREE.Euler }> = new Map();

  // Callbacks
  private onProgressCallback?: (progress: number, activeRoom: RoomId) => void;
  private onHoverCallback?: (artifact: ArchiveArtifact | null, screenPos: { x: number; y: number }) => void;
  private onInspectCallback?: (artifact: ArchiveArtifact) => void;
  private onLoadedCallback?: () => void;

  constructor(container: HTMLElement, lenis?: Lenis | null) {
    this.container = container;
    this.lenis = lenis || null;
    this.clock = new THREE.Clock();

    // 1. Scene Setup — Warm architectural museum atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x11141a);
    this.scene.fog = new THREE.Fog(0x11141a, 30, 320);

    // 2. Camera Setup
    this.camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      700
    );
    this.camera.position.set(0, 3.0, 20);

    // 3. Renderer Setup — High-clarity ACESFilmic tone mapping
    const canvas = container.querySelector('#archive-canvas') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas || undefined,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Post-processing Composer
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.2,   // subtle bloom
      0.3,   // radius
      0.90   // threshold
    );
    this.composer.addPass(bloomPass);

    // 5. Lighting Setup — Bright, multi-layered architectural gallery lighting
    const ambientLight = new THREE.AmbientLight(0xf0f4fa, 0.85);
    this.scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xfff7ec, 2.4);
    mainKeyLight.position.set(20, 35, 20);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 2048;
    mainKeyLight.shadow.mapSize.height = 2048;
    mainKeyLight.shadow.bias = -0.0001;
    this.scene.add(mainKeyLight);

    const fillLight = new THREE.DirectionalLight(0xdde8f5, 1.2);
    fillLight.position.set(-20, 20, -60);
    this.scene.add(fillLight);

    // Gallery Ceiling Downlights along the Spine
    const roomPositionsZ = [-30, -80, -130, -180, -230, -280];
    roomPositionsZ.forEach((z) => {
      const downlight = new THREE.PointLight(0xfff2e2, 1.6, 50, 1.2);
      downlight.position.set(0, 12, z);
      downlight.castShadow = true;
      this.scene.add(downlight);

      // Visual luminaire fixture
      const fixtureGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16);
      const fixtureMat = new THREE.MeshBasicMaterial({ color: 0xffeedd });
      const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
      fixture.position.set(0, 13.9, z);
      this.scene.add(fixture);
    });

    // Cursor-following light
    this.cursorLight = new THREE.PointLight(0xfff5e8, 1.2, 35);
    this.cursorLight.position.set(0, 3, 10);
    this.scene.add(this.cursorLight);

    this.spotLight = new THREE.SpotLight(0xc86432, 2.5, 45, Math.PI / 5, 0.35);
    this.spotLight.position.set(0, 12, 0);
    this.scene.add(this.spotLight);

    // 6. Raycasting Setup
    this.raycaster = new THREE.Raycaster();

    // 7. Assemble Environment & Rooms
    this.buildMasterArchitecture();
    this.buildRooms();
    this.scene.add(this.memoryGhostsGroup);

    // 8. Event Listeners
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('click', this.onClick);

    if (this.lenis) {
      this.lenis.on('scroll', this.onScroll);
    } else {
      window.addEventListener('scroll', this.onScroll);
    }

    // Start rendering loop
    this.animate();

    setTimeout(() => this.onLoadedCallback?.(), 400);
  }

  get isDestroying() {
    return this._isDestroying;
  }

  /* -------------------------------------------------------------------------- */
  /*                       MASTER ARCHITECTURAL FOUNDATION                      */
  /* -------------------------------------------------------------------------- */

  private buildMasterArchitecture() {
    // Continuous Brutalist Travertine & Concrete Gallery Floor
    const floorGeo = new THREE.PlaneGeometry(140, 420, 32, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x222631,
      roughness: 0.55,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.8, -160);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Monumental Ceiling with Coffered Panels
    const ceilingGeo = new THREE.PlaneGeometry(140, 420);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x181a22,
      roughness: 0.85,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 14, -160);
    this.scene.add(ceiling);

    // Monumental Concrete Gallery Columns along the Spine
    const columnGeo = new THREE.BoxGeometry(1.6, 16, 1.6);
    const columnMat = new THREE.MeshStandardMaterial({
      color: 0x343a4a,
      roughness: 0.65,
      metalness: 0.2,
    });

    for (let z = 0; z > -340; z -= 24) {
      const leftCol = new THREE.Mesh(columnGeo, columnMat);
      leftCol.position.set(-16, 6.2, z);
      leftCol.castShadow = true;
      leftCol.receiveShadow = true;
      this.scene.add(leftCol);
      this.initialObjectTransforms.set(leftCol, { pos: leftCol.position.clone(), rot: leftCol.rotation.clone() });

      const rightCol = new THREE.Mesh(columnGeo, columnMat);
      rightCol.position.set(16, 6.2, z);
      rightCol.castShadow = true;
      rightCol.receiveShadow = true;
      this.scene.add(rightCol);
      this.initialObjectTransforms.set(rightCol, { pos: rightCol.position.clone(), rot: rightCol.rotation.clone() });
    }

    // Outer Boundary Monumental Walls — Architectural Limestone & Fluted Panels
    const wallGeo = new THREE.PlaneGeometry(420, 22);
    const leftWallMat = new THREE.MeshStandardMaterial({
      color: 0x2b303d,
      roughness: 0.6,
      metalness: 0.15,
    });
    const rightWallMat = new THREE.MeshStandardMaterial({
      color: 0x272c38,
      roughness: 0.6,
      metalness: 0.15,
    });

    const leftWall = new THREE.Mesh(wallGeo, leftWallMat);
    leftWall.position.set(-30, 9, -160);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeo, rightWallMat);
    rightWall.position.set(30, 9, -160);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);
  }

  /* -------------------------------------------------------------------------- */
  /*                               THE SIX ROOMS                                */
  /* -------------------------------------------------------------------------- */

  private buildRooms() {
    // Room 01: IMAGE (Z: -30)
    const imageRoom = this.createImageRoom();
    imageRoom.position.set(0, 0, -30);
    this.rooms.set('image', imageRoom);
    this.scene.add(imageRoom);

    // Room 02: SOUND (Z: -80)
    const soundRoom = this.createSoundRoom();
    soundRoom.position.set(0, 0, -80);
    this.rooms.set('sound', soundRoom);
    this.scene.add(soundRoom);

    // Room 03: TYPOGRAPHY (Z: -130)
    const typoRoom = this.createTypographyRoom();
    typoRoom.position.set(0, 0, -130);
    this.rooms.set('typography', typoRoom);
    this.scene.add(typoRoom);

    // Room 04: OBJECTS (Z: -180)
    const objectsRoom = this.createObjectsRoom();
    objectsRoom.position.set(0, 0, -180);
    this.rooms.set('objects', objectsRoom);
    this.scene.add(objectsRoom);

    // Room 05: FILM (Z: -230)
    const filmRoom = this.createFilmRoom();
    filmRoom.position.set(0, 0, -230);
    this.rooms.set('film', filmRoom);
    this.scene.add(filmRoom);

    // Room 06: DIGITAL (Z: -280)
    const digitalRoom = this.createDigitalRoom();
    digitalRoom.position.set(0, 0, -280);
    this.rooms.set('digital', digitalRoom);
    this.scene.add(digitalRoom);
  }

  /* ---------------------- ROOM 01: PHOTOGRAPHY MONOLITHS ---------------------- */
  private createImageRoom(): THREE.Group {
    const group = new THREE.Group();
    const imageArtifacts = ARCHIVE_ARTIFACTS.filter(a => a.roomId === 'image');

    imageArtifacts.forEach((artifact, index) => {
      // High-resolution photographic canvas texture
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = Math.floor(1024 / artifact.visualData.aspectRatio);
      const ctx = canvas.getContext('2d')!;

      // Photographic tone gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, artifact.visualData.colorPalette[0] || '#1a1c24');
      grad.addColorStop(0.4, artifact.visualData.colorPalette[1] || '#3a3f4d');
      grad.addColorStop(0.8, artifact.visualData.colorPalette[2] || '#8c94a4');
      grad.addColorStop(1, artifact.visualData.colorPalette[artifact.visualData.colorPalette.length - 1] || '#f5f0e8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fine grain & geometric silver-gelatin pattern
      ctx.fillStyle = '#f5f0e8';
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < 40; i++) {
        ctx.fillRect((i * 37) % canvas.width, (i * 83) % canvas.height, canvas.width * 0.35, 3);
      }
      ctx.globalAlpha = 0.95;
      ctx.font = '700 26px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(artifact.id, 40, canvas.height - 40);
      ctx.fillText(artifact.visualData.caption || '', 40, 60);

      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = true;

      const width = 9 * artifact.visualData.aspectRatio;
      const height = 9;
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.4,
          metalness: 0.1,
          side: THREE.DoubleSide,
        })
      );

      // Spatial placement: Hanging gracefully on sides
      const xPos = index === 0 ? -9 : index === 1 ? 9 : 0;
      const yPos = index === 2 ? 6.0 : 4.0;
      const zPos = (index - 1) * 12;

      mesh.position.set(xPos, yPos, zPos);
      mesh.rotation.y = (index === 0 ? 0.25 : index === 1 ? -0.25 : 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { artifact, originalY: yPos, isInteractive: true };

      // Elegant Suspension Cables
      const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 12);
      const cableMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8 });
      const cableL = new THREE.Mesh(cableGeo, cableMat);
      cableL.position.set(-width * 0.45, 6, 0);
      mesh.add(cableL);
      const cableR = new THREE.Mesh(cableGeo, cableMat);
      cableR.position.set(width * 0.45, 6, 0);
      mesh.add(cableR);

      group.add(mesh);
      this.interactiveObjects.push(mesh);
      this.initialObjectTransforms.set(mesh, { pos: mesh.position.clone(), rot: mesh.rotation.clone() });
    });

    return group;
  }

  /* ------------------------ ROOM 02: SOUND SCULPTURES ----------------------- */
  private createSoundRoom(): THREE.Group {
    const group = new THREE.Group();
    const soundArtifacts = ARCHIVE_ARTIFACTS.filter(a => a.roomId === 'sound');

    // Central Monumental Resonator
    const centerResonatorGeo = new THREE.IcosahedronGeometry(4.0, 2);
    const centerResonatorMat = new THREE.MeshStandardMaterial({
      color: 0x2b3240,
      roughness: 0.15,
      metalness: 0.95,
      wireframe: true,
    });
    const centerResonator = new THREE.Mesh(centerResonatorGeo, centerResonatorMat);
    centerResonator.position.set(0, 4.5, 0);
    centerResonator.userData = { artifact: soundArtifacts[0], isInteractive: true, pulseSpeed: 1.5 };
    group.add(centerResonator);
    this.soundSculptures.push(centerResonator);
    this.interactiveObjects.push(centerResonator);

    // Orbiting Harmonic Resonance Rings
    const ringGeo = new THREE.TorusGeometry(7, 0.2, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc86432,
      roughness: 0.25,
      metalness: 0.9,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.position.set(0, 4.5, 0);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);
    this.soundSculptures.push(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.position.set(0, 4.5, 0);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);
    this.soundSculptures.push(ring2);

    // Side acoustic monolith columns
    for (let i = 0; i < 6; i++) {
      const height = 3 + (i % 3) * 3;
      const barGeo = new THREE.BoxGeometry(1.0, height, 1.0);
      const barMat = new THREE.MeshStandardMaterial({
        color: 0x363d4e,
        roughness: 0.35,
        metalness: 0.75,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      const angle = (i / 6) * Math.PI * 2;
      bar.position.set(Math.cos(angle) * 11, height / 2 - 1.8, Math.sin(angle) * 9);
      bar.castShadow = true;
      group.add(bar);
      this.soundSculptures.push(bar);
      this.initialObjectTransforms.set(bar, { pos: bar.position.clone(), rot: bar.rotation.clone() });
    }

    return group;
  }

  /* --------------------- ROOM 03: MONOLITHIC TYPOGRAPHY --------------------- */
  private createTypographyRoom(): THREE.Group {
    const group = new THREE.Group();
    const words = ['FORM', 'LANGUAGE', 'MEMORY', 'TIME', 'SPACE'];

    words.forEach((word, index) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      // Crisp contrast lettering
      ctx.fillStyle = '#1e222c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 135px var(--font-geist-sans), "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '-0.04em';
      ctx.fillText(word, canvas.width / 2, canvas.height / 2);

      // Terracotta architectural border
      ctx.strokeStyle = '#c86432';
      ctx.lineWidth = 6;
      ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

      const texture = new THREE.CanvasTexture(canvas);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.45,
        metalness: 0.3,
      });

      // 3D Monumental Slabs positioned safely along gallery sides
      const slabGeo = new THREE.BoxGeometry(11, 3.2, 1.2);
      const slabMesh = new THREE.Mesh(slabGeo, mat);

      const isLeft = index % 2 === 0;
      const x = isLeft ? -12 : 12;
      const y = 2.4 + (index % 3) * 1.5;
      const z = (index - 2) * 11;

      slabMesh.position.set(x, y, z);
      slabMesh.rotation.y = isLeft ? 0.35 : -0.35;
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;

      group.add(slabMesh);
      this.initialObjectTransforms.set(slabMesh, { pos: slabMesh.position.clone(), rot: slabMesh.rotation.clone() });
    });

    return group;
  }

  /* ------------------- ROOM 04: ARCHIVED PHYSICAL OBJECTS ------------------- */
  private createObjectsRoom(): THREE.Group {
    const group = new THREE.Group();
    const objectArtifacts = ARCHIVE_ARTIFACTS.filter(a => a.roomId === 'objects');

    // 1. Marcel Breuer Cantilever Armchair
    const chairGroup = this.buildChairModel();
    chairGroup.position.set(-8, 0, -4);
    chairGroup.userData = { artifact: objectArtifacts.find(a => a.id.includes('7820')) || objectArtifacts[0], isInteractive: true };
    group.add(chairGroup);
    this.interactiveObjects.push(chairGroup);

    // 2. Vintage Rangefinder Camera
    const cameraGroup = this.buildCameraModel();
    cameraGroup.position.set(0, 2.2, 2);
    cameraGroup.userData = { artifact: objectArtifacts.find(a => a.id.includes('3310')) || objectArtifacts[0], isInteractive: true };
    group.add(cameraGroup);
    this.interactiveObjects.push(cameraGroup);

    // 3. Dual-Trace Analog Oscilloscope
    const scopeGroup = this.buildOscilloscopeModel();
    scopeGroup.position.set(8, 1.0, -2);
    scopeGroup.userData = { artifact: objectArtifacts.find(a => a.id.includes('6155')) || objectArtifacts[0], isInteractive: true };
    group.add(scopeGroup);
    this.interactiveObjects.push(scopeGroup);

    // Illuminated Archival Pedestals
    [-8, 0, 8].forEach((x, i) => {
      const pedGeo = new THREE.BoxGeometry(3.6, 2.0, 3.6);
      const pedMat = new THREE.MeshStandardMaterial({ color: 0x303544, roughness: 0.6, metalness: 0.2 });
      const ped = new THREE.Mesh(pedGeo, pedMat);
      ped.position.set(x, -0.8, i === 1 ? 2 : (i === 0 ? -4 : -2));
      ped.receiveShadow = true;
      ped.castShadow = true;

      // Pedestal spotlight top
      const pedTopGeo = new THREE.PlaneGeometry(3.2, 3.2);
      const pedTopMat = new THREE.MeshStandardMaterial({ color: 0x4a5266, roughness: 0.3 });
      const pedTop = new THREE.Mesh(pedTopGeo, pedTopMat);
      pedTop.rotation.x = -Math.PI / 2;
      pedTop.position.y = 1.01;
      ped.add(pedTop);

      group.add(ped);
    });

    return group;
  }

  private buildChairModel(): THREE.Group {
    const chair = new THREE.Group();
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.98, roughness: 0.08 });
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x1f2128, roughness: 0.75 });

    // Seat & Backrest
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.18, 2.2), leatherMat);
    seat.position.set(0, 1.0, 0);
    seat.castShadow = true;
    chair.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 0.18), leatherMat);
    back.position.set(0, 2.0, -1.05);
    back.castShadow = true;
    chair.add(back);

    // Tubular cantilever rails
    const railGeo = new THREE.CylinderGeometry(0.07, 0.07, 2.4, 16);
    const railL = new THREE.Mesh(railGeo, chromeMat);
    railL.position.set(-1.05, 0.5, 0);
    chair.add(railL);

    const railR = new THREE.Mesh(railGeo, chromeMat);
    railR.position.set(1.05, 0.5, 0);
    chair.add(railR);

    return chair;
  }

  private buildCameraModel(): THREE.Group {
    const camera = new THREE.Group();
    const magnesiumMat = new THREE.MeshStandardMaterial({ color: 0x424856, metalness: 0.9, roughness: 0.2 });
    const vulcaniteMat = new THREE.MeshStandardMaterial({ color: 0x1c1e24, roughness: 0.9 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x224466, roughness: 0.1, transmission: 0.95, thickness: 0.6 });

    // Body
    const bodyTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, 0.9), magnesiumMat);
    bodyTop.position.y = 0.5;
    camera.add(bodyTop);

    const bodyMain = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 0.9), vulcaniteMat);
    camera.add(bodyMain);

    // Optical Lens
    const lensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.44, 0.8, 32), magnesiumMat);
    lensBarrel.rotation.x = Math.PI / 2;
    lensBarrel.position.set(0, 0, 0.6);
    camera.add(lensBarrel);

    const lensElement = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), glassMat);
    lensElement.position.set(0, 0, 0.95);
    camera.add(lensElement);

    camera.scale.setScalar(1.6);
    return camera;
  }

  private buildOscilloscopeModel(): THREE.Group {
    const scope = new THREE.Group();
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x343a48, roughness: 0.5, metalness: 0.5 });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 3.0), chassisMat);
    chassis.position.y = 0.9;
    chassis.castShadow = true;
    scope.add(chassis);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.9), screenMat);
    screen.position.set(-0.45, 1.0, 1.51);
    scope.add(screen);

    return scope;
  }

  /* -------------------------- ROOM 05: FILM PORTAL -------------------------- */
  private createFilmRoom(): THREE.Group {
    const group = new THREE.Group();
    const filmArtifacts = ARCHIVE_ARTIFACTS.filter(a => a.roomId === 'film');

    const filmVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const filmFragmentShader = `
      uniform float uTime;
      uniform float uDistortion;
      varying vec2 vUv;

      float rand(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        // Cinematic wave distortion
        float wave = sin(uv.y * 20.0 + uTime * 4.0) * (uDistortion * 0.04);
        uv.x += wave;

        // Film grain
        float grain = (rand(uv * uTime) - 0.5) * 0.12;

        // 35mm scanlines
        float scanline = sin(uv.y * 350.0) * 0.03;

        // Vignetting
        float vignette = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y) * 16.0;
        vignette = clamp(pow(vignette, 0.4), 0.0, 1.0);

        vec3 color = vec3(0.18, 0.20, 0.25) + vec3(grain) - vec3(scanline);
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    this.filmScreenMaterial = new THREE.ShaderMaterial({
      vertexShader: filmVertexShader,
      fragmentShader: filmFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDistortion: { value: 0 },
      },
    });

    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 14.5),
      this.filmScreenMaterial
    );
    screenMesh.position.set(0, 6.5, 0);
    screenMesh.userData = { artifact: filmArtifacts[0], isInteractive: true };
    group.add(screenMesh);
    this.interactiveObjects.push(screenMesh);

    // Monumental Screen Bevel Frame
    const frameGeo = new THREE.BoxGeometry(27.5, 16, 1.0);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x161820, roughness: 0.85 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 6.5, -0.55);
    group.add(frame);

    return group;
  }

  /* ------------------- ROOM 06: DIGITAL MEMORY ARCHAEOLOGY ------------------- */
  private createDigitalRoom(): THREE.Group {
    const group = new THREE.Group();
    const digitalArtifacts = ARCHIVE_ARTIFACTS.filter(a => a.roomId === 'digital');

    // Floating 1-bit GUI Windows
    for (let i = 0; i < 12; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 342;
      const ctx = canvas.getContext('2d')!;

      // Classic GUI window with high visibility
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, 28);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(`STACK_0x${(1000 + i * 73).toString(16).toUpperCase()}.res`, 14, 19);

      // Window content
      ctx.fillStyle = '#000000';
      ctx.font = '13px monospace';
      ctx.fillText('MEMORY BLOCK ACCESSED', 20, 65);
      ctx.fillText('STATUS: PRESERVED IN SILICON', 20, 92);
      ctx.fillText(`HEX DUMP: 0x48 0x65 0x6C 0x6C 0x6F`, 20, 120);
      ctx.strokeRect(10, 36, canvas.width - 20, canvas.height - 48);

      const texture = new THREE.CanvasTexture(canvas);
      const windowMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      });

      const winMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 3.0), windowMat);
      const angle = (i / 12) * Math.PI * 2;
      winMesh.position.set(
        Math.cos(angle) * (9 + (i % 3) * 2),
        2.5 + (i % 4) * 2,
        (i - 6) * 3.5
      );
      winMesh.rotation.set(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.15
      );
      winMesh.userData = { artifact: digitalArtifacts[0], isInteractive: true };
      group.add(winMesh);
      this.interactiveObjects.push(winMesh);
      this.initialObjectTransforms.set(winMesh, { pos: winMesh.position.clone(), rot: winMesh.rotation.clone() });
    }

    return group;
  }

  /* -------------------------------------------------------------------------- */
  /*                      INTERACTION & EVENT HANDLING                          */
  /* -------------------------------------------------------------------------- */

  private onMouseMove = (event: MouseEvent) => {
    this.mouseTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast for interactive artifacts
    this.raycaster.setFromCamera(this.mouseTarget, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      let target: THREE.Object3D | null = intersects[0].object;
      while (target && !target.userData?.artifact && target.parent) {
        target = target.parent;
      }

      if (target && target.userData?.artifact) {
        const artifact: ArchiveArtifact = target.userData.artifact;
        if (this.hoveredObject !== target) {
          this.hoveredObject = target;
          globalAudio.playTick(3200, 0.015, 0.05);
        }
        this.onHoverCallback?.(artifact, { x: event.clientX, y: event.clientY });
        return;
      }
    }

    if (this.hoveredObject) {
      this.hoveredObject = null;
      this.onHoverCallback?.(null, { x: event.clientX, y: event.clientY });
    }
  };

  private onClick = () => {
    if (this.isFrozen) return;

    this.raycaster.setFromCamera(this.mouseTarget, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      let target: THREE.Object3D | null = intersects[0].object;
      while (target && !target.userData?.artifact && target.parent) {
        target = target.parent;
      }

      if (target && target.userData?.artifact) {
        const artifact: ArchiveArtifact = target.userData.artifact;
        this.rememberArtifact(artifact);
        globalAudio.playHarmonicChime(640);
        this.onInspectCallback?.(artifact);
      }
    }
  };

  private onScroll = () => {
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const currentScroll = this.lenis ? this.lenis.scroll : window.scrollY;
    this.targetScrollProgress = Math.max(0, Math.min(1, currentScroll / maxScroll));
  };

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  };

  /* -------------------------------------------------------------------------- */
  /*                          MEMORY SYSTEM FOOTPRINT                           */
  /* -------------------------------------------------------------------------- */

  public rememberArtifact(artifact: ArchiveArtifact) {
    if (this.rememberedArtifactIds.has(artifact.id)) return;
    this.rememberedArtifactIds.add(artifact.id);

    // Create floating memory ghost fragment in 3D scene
    const ghostGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const ghostMat = new THREE.MeshBasicMaterial({
      color: 0xc86432,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const ghost = new THREE.Mesh(ghostGeo, ghostMat);
    ghost.position.set(
      (Math.random() - 0.5) * 12,
      2 + Math.random() * 6,
      this.camera.position.z - 15 - Math.random() * 20
    );
    this.memoryGhostsGroup.add(ghost);
  }

  public getRememberedCount(): number {
    return this.rememberedArtifactIds.size;
  }

  public getRememberedArtifacts(): ArchiveArtifact[] {
    return ARCHIVE_ARTIFACTS.filter(a => this.rememberedArtifactIds.has(a.id));
  }

  /* -------------------------------------------------------------------------- */
  /*                    CINEMATIC CAMERA CHOREOGRAPHY & TICK                    */
  /* -------------------------------------------------------------------------- */

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Damped mouse interpolation
    this.mouse.lerp(this.mouseTarget, 0.08);

    // Damped scroll progress
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.06;

    // Update Room audio atmosphere based on progress
    const activeRoom = this.determineActiveRoom(this.scrollProgress);
    globalAudio.setRoomAtmosphere(activeRoom);

    // Update 3D Camera spline position and rotation smoothly
    if (!this.isFrozen) {
      this.updateCameraPath(this.scrollProgress);
    }

    // Dynamic Cursor Spotlight
    this.cursorLight.position.set(
      this.camera.position.x + this.mouse.x * 6,
      this.camera.position.y + this.mouse.y * 4,
      this.camera.position.z - 4
    );

    // Animate sound room geometries
    this.soundSculptures.forEach((mesh, index) => {
      mesh.rotation.x += 0.005 * (index % 2 === 0 ? 1 : -1);
      mesh.rotation.y += 0.008;
      const scale = 1.0 + Math.sin(time * 2.5 + index) * 0.04;
      mesh.scale.set(scale, scale, scale);
    });

    // Animate Film Shader Uniforms
    if (this.filmScreenMaterial) {
      this.filmScreenMaterial.uniforms.uTime.value = time;
      const distToFilm = Math.abs(this.camera.position.z - (-230));
      this.filmScreenMaterial.uniforms.uDistortion.value = Math.max(0, 1.0 - distToFilm / 30);
    }

    // Destruction & Reconstruction Sequence Animation (Internal Three.js Only)
    if (this._isDestroying) {
      this.destructionProgress = Math.min(1, this.destructionProgress + delta * 0.25);
      this.initialObjectTransforms.forEach((init, obj) => {
        obj.position.y = init.pos.y - Math.sin(this.destructionProgress * Math.PI) * 3;
        obj.rotation.x = init.rot.x + (Math.random() - 0.5) * 0.08 * this.destructionProgress;
        obj.rotation.z = init.rot.z + (Math.random() - 0.5) * 0.08 * this.destructionProgress;
      });
    }

    // Render Scene via Post-processing
    this.composer.render();

    this.onProgressCallback?.(this.scrollProgress, activeRoom);
  };

  private determineActiveRoom(progress: number): RoomId {
    if (progress < 0.18) return 'image';
    if (progress < 0.35) return 'sound';
    if (progress < 0.52) return 'typography';
    if (progress < 0.68) return 'objects';
    if (progress < 0.84) return 'film';
    if (progress < 0.94) return 'digital';
    return 'finale';
  }

  private updateCameraPath(progress: number) {
    // Total path length: Z = 20 down to -320
    const targetZ = 20 - progress * 330;
    this.camera.position.z = targetZ;

    // Cinematic vertical crane movement
    const baseY = 3.0 + Math.sin(progress * Math.PI * 4) * 0.8;
    this.camera.position.y = baseY + this.mouse.y * 0.5;

    // Gentle lateral sway within central walking corridor
    const baseX = Math.sin(progress * Math.PI * 3) * 1.5;
    this.camera.position.x = baseX + this.mouse.x * 1.0;

    // Subtle camera look banking
    this.camera.rotation.y = -this.mouse.x * 0.1 + Math.cos(progress * Math.PI * 3) * 0.02;
    this.camera.rotation.x = this.mouse.y * 0.06 + Math.sin(progress * Math.PI * 2) * 0.015;
    this.camera.rotation.z = -this.mouse.x * 0.02;
  }

  /* -------------------------------------------------------------------------- */
  /*                               PUBLIC METHODS                               */
  /* -------------------------------------------------------------------------- */

  public triggerDestruction() {
    if (this._isDestroying) return;
    this._isDestroying = true;
    globalAudio.playDestructionSound();

    setTimeout(() => {
      this._isDestroying = false;
      this.reconstruct();
    }, 4500);
  }

  private reconstruct() {
    this.initialObjectTransforms.forEach((init, obj) => {
      obj.position.copy(init.pos);
      obj.rotation.copy(init.rot);
    });
    this.destructionProgress = 0;
  }

  public warpToRoom(roomId: RoomId) {
    const roomProgressMap: Record<RoomId, number> = {
      image: 0.08,
      sound: 0.25,
      typography: 0.42,
      objects: 0.60,
      film: 0.76,
      digital: 0.89,
      finale: 0.98,
    };

    const targetP = roomProgressMap[roomId] ?? 0;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);

    if (this.lenis) {
      this.lenis.scrollTo(targetP * maxScroll, { duration: 1.8 });
    } else {
      window.scrollTo({ top: targetP * maxScroll, behavior: 'smooth' });
    }
  }

  public enterArchive() {
    globalAudio.playDoorPassage();
    this.warpToRoom('image');
  }

  public toggleFreeze(freeze: boolean) {
    this.isFrozen = freeze;
    this.renderer.domElement.style.pointerEvents = freeze ? 'none' : 'auto';
  }

  public onProgress(cb: (p: number, activeRoom: RoomId) => void) {
    this.onProgressCallback = cb;
  }

  public onHover(cb: (artifact: ArchiveArtifact | null, pos: { x: number; y: number }) => void) {
    this.onHoverCallback = cb;
  }

  public onInspect(cb: (artifact: ArchiveArtifact) => void) {
    this.onInspectCallback = cb;
  }

  public onLoaded(cb: () => void) {
    this.onLoadedCallback = cb;
  }

  public dispose() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('click', this.onClick);

    if (this.lenis) {
      this.lenis.off('scroll', this.onScroll);
    } else {
      window.removeEventListener('scroll', this.onScroll);
    }

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.composer.dispose();
  }
}
