/**
 * Procedural WebGL Background Shader: Aspect-ratio correct Fluid Refraction & Chromatic Wave Distortion
 */
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // 2D Simplex Noise Kernel
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
    
    // Mouse proximity repulsion wave
    float mouseDist = length(st - uMouse);
    float mouseWave = sin(mouseDist * 12.0 - uTime * 3.0) * exp(-mouseDist * 2.5);

    // Multi-scale procedural titanium grain
    float n1 = snoise(st * 1.5 + uTime * 0.1);
    float n2 = snoise(st * 3.0 - uTime * 0.15 + n1 * 0.5);

    vec3 baseColor = vec3(0.06, 0.07, 0.08); // Deep Slate
    vec3 orangeColor = vec3(1.0, 0.28, 0.0); // Horological Orange
    vec3 steelColor = vec3(0.9, 0.92, 0.95); // Brushed Platinum

    float lines = sin((st.y + n2 * 0.2 + mouseWave * 0.15) * 40.0);
    lines = smoothstep(0.92, 0.98, lines);

    vec3 finalColor = mix(baseColor, steelColor, lines * 0.12);
    finalColor += orangeColor * mouseWave * 0.4;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export class ChronoDistortion {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private material: THREE.ShaderMaterial;
  private mousePos = new THREE.Vector2(-10, -10);

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMouse: { value: this.mousePos }
      },
      depthWrite: false,
      depthTest: false
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.scene.add(quad);

    this.resize();
    this.setupEvents();
  }

  public resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.material.uniforms.uResolution.value.set(w, h);
  }

  private setupEvents() {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX * 2.0 - window.innerWidth) / Math.min(window.innerWidth, window.innerHeight);
      const y = -(e.clientY * 2.0 - window.innerHeight) / Math.min(window.innerWidth, window.innerHeight);
      this.mousePos.set(x, y);
    });
  }

  public update(elapsed: number) {
    this.material.uniforms.uTime.value = elapsed;
    this.renderer.render(this.scene, this.camera);
  }
}
