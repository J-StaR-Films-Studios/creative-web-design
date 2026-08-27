# GLSL Shaders & GPU Visual Computation

Use shaders for extreme performance effects that Canvas 2D cannot handle.

## 1. ShaderMaterial Boilerplate
```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uResolution: { value: new THREE.Vector4() }
  },
  vertexShader: `...`,
  fragmentShader: `...`,
  transparent: true,
});
```

## 2. Vertex Displacement (Noise)
Deform geometry based on time.
```glsl
// Vertex Shader
uniform float uTime;
varying vec2 vUv;

// (Insert Simplex Noise function cnoise here)

void main() {
  vUv = uv;
  vec3 pos = position;
  
  float noiseFreq = 2.0;
  float noiseAmp = 0.5;
  vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
  pos.z += cnoise(noisePos) * noiseAmp;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

## 3. RGB Split & Distortion (Fragment)
```glsl
// Fragment Shader
uniform sampler2D tDiffuse;
uniform float uTime;
varying vec2 vUv;

void main() {
  float offset = sin(uTime * 5.0) * 0.01;
  vec4 r = texture2D(tDiffuse, vUv + vec2(offset, 0.0));
  vec4 g = texture2D(tDiffuse, vUv);
  vec4 b = texture2D(tDiffuse, vUv - vec2(offset, 0.0));
  
  gl_FragColor = vec4(r.r, g.g, b.b, 1.0);
}
```
