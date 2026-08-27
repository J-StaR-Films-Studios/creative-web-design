# Three.js & React Three Fiber (R3F)

Architecture for real-time 3D pipelines.

## 1. R3F Scene Boilerplate
Setup optimized canvas and environment.
```jsx
import { Canvas } from '@react-three/fiber';
import { Environment, Preload, Bvh } from '@react-three/drei';

export function Scene() {
  return (
    <Canvas
      dpr={[1, 2]} // Clamp DPR
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <Bvh firstHitOnly>
        {/* Scene Graph */}
        <HeroModel />
      </Bvh>
      <Environment preset="city" />
      <Preload all />
    </Canvas>
  );
}
```

## 2. Asset Optimization
- Compress models using glTF Pipeline or Draco.
- Serve via CDN.
- Use `useGLTF` from `@react-three/drei` for automatic caching.

```jsx
import { useGLTF } from '@react-three/drei';

function HeroModel(props) {
  const { nodes, materials } = useGLTF('/model-draco.glb');
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Main.geometry} material={materials.Metal} />
    </group>
  );
}
useGLTF.preload('/model-draco.glb');
```
