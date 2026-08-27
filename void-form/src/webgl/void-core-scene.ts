import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform float uDeform;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  // Simplex 3D noise
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z.xxxx);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vNormal = normal;
    vPosition = position;

    float noiseVal = snoise(position * 1.8 + vec3(uTime * 0.4));
    float mouseDistance = distance(uMouse, position.xy);
    float mouseDeform = smoothstep(2.5, 0.0, mouseDistance) * 0.45;

    float displacement = noiseVal * (0.25 + uDeform * 0.65) + mouseDeform;
    vDisplacement = displacement;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uLightPos;
  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vPosition);
    vec3 viewDir = normalize(-vPosition);

    // Diffuse calculation
    float diff = max(dot(normal, lightDir), 0.0);

    // Specular highlight
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);

    // Fresnel rim light
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

    // Color mixing based on displacement
    vec3 color = mix(uBaseColor, uAccentColor, smoothstep(-0.2, 0.4, vDisplacement));
    vec3 finalColor = color * (diff * 0.8 + 0.2) + vec3(spec * 0.6) + vec3(fresnel * 0.5);

    gl_FragColor = vec4(finalColor, 0.96);
  }
`;

export class VoidCoreScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private coreMesh!: THREE.Mesh;
  private wireframeMesh!: THREE.Mesh;
  private outerRingMesh!: THREE.Mesh;
  private shaderMaterial!: THREE.ShaderMaterial;
  private keyLight!: THREE.PointLight;
  private fillLight!: THREE.DirectionalLight;
  private group = new THREE.Group();

  private mouse = new THREE.Vector2(0, 0);
  private targetMouse = new THREE.Vector2(0, 0);
  private scrollProgress = 0;
  private width = 0;
  private height = 0;

  // Scratch objects to avoid heap allocation in render loop
  private readonly tempRotAxis = new THREE.Vector3(0.3, 1, 0.2).normalize();
  private isDestroyed = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 5.5);

    // 2. High-Performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    this.initGeometries();
    this.initLighting();
  }

  private initGeometries() {
    // 1. Procedural Morphing Core Geometry (Icosahedron high-poly)
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 32);

    this.shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDeform: { value: 0.1 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uLightPos: { value: new THREE.Vector3(2, 3, 4) },
        uBaseColor: { value: new THREE.Color(0x14161d) },
        uAccentColor: { value: new THREE.Color(0xff3b00) },
      },
      wireframe: false,
      transparent: true,
    });

    this.coreMesh = new THREE.Mesh(coreGeometry, this.shaderMaterial);
    this.group.add(this.coreMesh);

    // 2. Non-Euclidean Nested Wireframe Facets
    const wireGeometry = new THREE.IcosahedronGeometry(1.65, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x8e929a,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    this.wireframeMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    this.group.add(this.wireframeMesh);

    // 3. Orbital Concentric Caliper Rings
    const ringGeo = new THREE.TorusGeometry(2.1, 0.012, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff3b00,
      transparent: true,
      opacity: 0.35,
    });
    this.outerRingMesh = new THREE.Mesh(ringGeo, ringMat);
    this.outerRingMesh.rotation.x = Math.PI / 3;
    this.group.add(this.outerRingMesh);

    this.scene.add(this.group);
  }

  private initLighting() {
    this.keyLight = new THREE.PointLight(0xffffff, 2.5, 15);
    this.keyLight.position.set(3, 4, 3);
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.DirectionalLight(0xff3b00, 1.2);
    this.fillLight.position.set(-3, -2, -1);
    this.scene.add(this.fillLight);

    const ambientLight = new THREE.AmbientLight(0x0a0b0e, 1.5);
    this.scene.add(ambientLight);
  }

  public onMouseMove(normalizedX: number, normalizedY: number) {
    this.targetMouse.x = (normalizedX - 0.5) * 4;
    this.targetMouse.y = -(normalizedY - 0.5) * 4;
  }

  public setScrollProgress(progress: number) {
    this.scrollProgress = progress;
  }

  public resize(width: number, height: number) {
    if (this.isDestroyed) return;
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
  }

  public update(time: number, _deltaTime: number) {
    if (this.isDestroyed) return;

    // Mouse lerping for fluid inertia
    this.mouse.lerp(this.targetMouse, 0.08);

    // 1. Update Shader Uniforms
    this.shaderMaterial.uniforms.uTime.value = time;
    this.shaderMaterial.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);
    this.shaderMaterial.uniforms.uDeform.value = 0.15 + this.scrollProgress * 0.85;

    // 2. Reactive Light Rig following cursor
    this.keyLight.position.set(this.mouse.x * 1.5 + 2, this.mouse.y * 1.5 + 3, 3.5);
    this.shaderMaterial.uniforms.uLightPos.value.copy(this.keyLight.position);

    // 3. Multidimensional Axis Rotation
    this.group.rotateOnAxis(this.tempRotAxis, 0.006 + this.scrollProgress * 0.02);
    this.wireframeMesh.rotation.y -= 0.009;
    this.wireframeMesh.rotation.x += 0.004;
    this.outerRingMesh.rotation.z += 0.012;

    // 4. Subtle camera parallax tracking mouse & scroll dolly zoom
    this.camera.position.x = this.mouse.x * 0.3;
    this.camera.position.y = this.mouse.y * 0.3;
    this.camera.position.z = 5.5 - this.scrollProgress * 1.8;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    this.isDestroyed = true;
    this.coreMesh.geometry.dispose();
    this.shaderMaterial.dispose();
    this.wireframeMesh.geometry.dispose();
    (this.wireframeMesh.material as THREE.Material).dispose();
    this.outerRingMesh.geometry.dispose();
    (this.outerRingMesh.material as THREE.Material).dispose();
    this.renderer.dispose();

    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
