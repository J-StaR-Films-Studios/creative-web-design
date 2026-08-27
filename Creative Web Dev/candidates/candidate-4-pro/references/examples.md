# Examples

Code recipes for combining skills.

## End-to-End: Scroll Triggered Shader Material
```jsx
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei'; // Or custom GSAP sync

export function ScrollShaderMesh() {
  const materialRef = useRef();
  const scroll = useScroll();
  const { size } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Map scroll offset (0-1) to shader uniform
      materialRef.current.uniforms.uScroll.value = scroll.offset;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[size.width, size.height, 32, 32]} />
      <customShaderMaterial ref={materialRef} />
    </mesh>
  );
}
```
