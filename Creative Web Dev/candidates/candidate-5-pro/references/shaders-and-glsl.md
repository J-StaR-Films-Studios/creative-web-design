# GLSL Shaders & Visual Computation

Build custom shaders for vertex displacement, RGB distortion, and fluid noise.

## 1. Uniforms Injection via R3F

Pass JavaScript variables into GLSL smoothly using `useFrame`.

```jsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

export function ShaderPlane() {
  const materialRef = useRef()
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  }), [])

  useFrame((state) => {
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    // Mouse provided by state.pointer (-1 to 1)
    materialRef.current.uniforms.uMouse.value.lerp(state.pointer, 0.1) 
  })

  return (
    <mesh>
      <planeGeometry args={[5, 5, 128, 128]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  )
}
```

## 2. Vertex Displacement (vert.glsl)

Displace geometry based on time and noise to create organic surfaces.

```glsl
uniform float uTime;
varying vec2 vUv;

// Include a standard Perlin Noise function here (e.g. cnoise)

void main() {
  vUv = uv;
  
  vec3 pos = position;
  
  // Calculate noise based on XY coords and time
  float noiseFrequency = 2.0;
  float noiseElevation = 0.5;
  float noise = cnoise(vec3(pos.x * noiseFrequency, pos.y * noiseFrequency, uTime)) * noiseElevation;
  
  pos.z += noise;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

## 3. RGB Split & Chromatic Aberration (frag.glsl)

Apply post-processing or fragment math to distort textures.

```glsl
uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Create an offset based on time or scroll velocity
  float offset = sin(uTime) * 0.02;
  
  float r = texture2D(uTexture, uv + vec2(offset, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(offset, 0.0)).b;
  
  gl_FragColor = vec4(r, g, b, 1.0);
}
```
