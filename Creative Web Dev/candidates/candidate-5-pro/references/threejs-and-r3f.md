# Three.js & React Three Fiber (R3F)

Implement WebGL architectures focused on optimized assets and cinematic camera control.

## 1. R3F Canvas Configuration

Ensure the canvas operates at optimal pixel ratios and disables aggressive tone mapping if using custom shaders.

```jsx
import { Canvas } from '@react-three/fiber'

export function Scene() {
  return (
    <Canvas
      dpr={[1, 2]} // Clamp between 1 and 2 for mobile performance
      gl={{ 
        antialias: false, // Turn off if using post-processing
        powerPreference: 'high-performance',
        alpha: true 
      }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <App />
    </Canvas>
  )
}
```

## 2. Draco Compressed GLTF Loading

Always load assets asynchronously using `useGLTF` with the Draco decoder to compress mesh geometries.

```jsx
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/model-draco.glb', '/draco-gltf/')
  
  return (
    <group {...props} dispose={null}>
      <mesh 
        geometry={nodes.Main_Body.geometry} 
        material={materials.Metal_Finish} 
      />
    </group>
  )
}

useGLTF.preload('/model-draco.glb')
```

## 3. InstancedMesh for High-Density Scenes

If rendering > 100 of the same object, construct an `InstancedMesh`. Do not map over individual `<mesh>` components.

```jsx
import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'

export function Particles({ count = 1000 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count])

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="white" />
    </instancedMesh>
  )
}
```
