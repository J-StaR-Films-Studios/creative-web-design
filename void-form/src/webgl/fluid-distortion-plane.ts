import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uSpeed;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uNoiseIntensity;
  varying vec2 vUv;

  // Aspect-corrected cover UV coordinates
  vec2 getCoverUv(vec2 uv, vec2 screenRes, vec2 texRes) {
    vec2 s = screenRes;
    vec2 i = texRes;
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 newRes = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
    vec2 offset = (rs < ri ? vec2((newRes.x - s.x) / 2.0, 0.0) : vec2(0.0, (newRes.y - s.y) / 2.0)) / newRes;
    return uv * s / newRes + offset;
  }

  // Fractional Brownian Motion (FBM) 4-octave turbulence
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // 1. Cover UV Mapping
    vec2 uv = getCoverUv(vUv, uResolution, vec2(1920.0, 1080.0));

    // 2. Cursor Distance & Force Field
    float dist = distance(vUv, uMouse);
    float force = smoothstep(0.42, 0.0, dist);

    // 3. Fluid Wave & Velocity Displacement
    float n = fbm(vUv * 6.0 + vec2(uTime * 0.25));
    vec2 dir = normalize(vUv - uMouse + 0.0001);
    
    // Displacement magnitude scales with mouse velocity + organic noise
    float displacementMag = force * (0.02 + uSpeed * 0.08) * (1.0 + n * uNoiseIntensity);
    vec2 displacement = dir * displacementMag * sin(dist * 24.0 - uTime * 4.0);

    // Add velocity drift
    displacement += uVelocity * force * 0.035;

    // 4. Differential RGB Chromatic Aberration
    float r = texture2D(uTexture, uv + displacement * 1.4).r;
    float g = texture2D(uTexture, uv + displacement * 1.0).g;
    float b = texture2D(uTexture, uv + displacement * 0.6).b;
    float a = texture2D(uTexture, uv).a;

    // 5. High-Velocity Luminescence Flash
    float flash = uSpeed * force * 0.12;
    vec3 finalColor = vec3(r, g, b) + vec3(flash * 0.8, flash * 0.3, flash * 0.1);

    // Vignette dark edges
    float vignette = smoothstep(1.3, 0.4, length(vUv - 0.5));
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, a);
  }
`;

export class FluidDistortionPlane {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private material!: THREE.ShaderMaterial;
  private mesh!: THREE.Mesh;
  private texture!: THREE.Texture;

  private mouse = new THREE.Vector2(0.5, 0.5);
  private targetMouse = new THREE.Vector2(0.5, 0.5);
  private prevMouse = new THREE.Vector2(0.5, 0.5);
  private velocity = new THREE.Vector2(0, 0);
  private speed = 0;
  private isDestroyed = false;

  constructor(container: HTMLElement, imageUrl: string) {
    this.container = container;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    this.container.appendChild(this.renderer.domElement);

    this.initTextureAndMaterial(imageUrl, width, height);
  }

  private initTextureAndMaterial(imageUrl: string, width: number, height: number) {
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(imageUrl);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: this.texture },
        uMouse: { value: this.mouse },
        uVelocity: { value: this.velocity },
        uSpeed: { value: 0 },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uNoiseIntensity: { value: 0.8 },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  public setImageUrl(url: string) {
    if (this.isDestroyed) return;
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(url);
    this.texture.minFilter = THREE.LinearFilter;
    this.material.uniforms.uTexture.value = this.texture;
  }

  public onMouseMove(normalizedX: number, normalizedY: number) {
    this.targetMouse.x = normalizedX;
    this.targetMouse.y = 1.0 - normalizedY; // Flip Y for WebGL UV coordinate space
  }

  public resize(width: number, height: number) {
    if (this.isDestroyed) return;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    this.material.uniforms.uResolution.value.set(width, height);
  }

  public update(time: number, _deltaTime: number) {
    if (this.isDestroyed) return;

    // 1. Mouse interpolation
    this.mouse.lerp(this.targetMouse, 0.12);

    // 2. Velocity calculation & decay
    const dx = this.mouse.x - this.prevMouse.x;
    const dy = this.mouse.y - this.prevMouse.y;
    this.speed = Math.hypot(dx, dy) * 45.0;
    this.velocity.set(dx, dy).multiplyScalar(0.90);
    this.prevMouse.copy(this.mouse);

    // 3. Update Uniforms
    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uMouse.value.copy(this.mouse);
    this.material.uniforms.uVelocity.value.copy(this.velocity);
    this.material.uniforms.uSpeed.value = this.speed;

    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    this.isDestroyed = true;
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
    this.renderer.dispose();

    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
