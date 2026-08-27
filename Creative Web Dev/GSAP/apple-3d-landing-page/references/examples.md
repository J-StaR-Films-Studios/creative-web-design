# Implementation Examples

## 1. 3D Model Switcher with Smooth GSAP Transitions

```jsx
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { PresentationControls } from '@react-three/drei';
import MacBookModel16 from './MacBook-16';
import MacBookModel14 from './MacBook-14';

const ANIMATION_DURATION = 1;
const OFFSET_DISTANCE = 5;

export default function ModelSwitcher({ scale, isMobile }) {
  const smallRef = useRef();
  const largeRef = useRef();
  const showLarge = scale === 0.08 || scale === 0.05;

  useGSAP(() => {
    if (showLarge) {
      gsap.to(smallRef.current.position, { x: -OFFSET_DISTANCE, duration: ANIMATION_DURATION });
      gsap.to(largeRef.current.position, { x: 0, duration: ANIMATION_DURATION });
    } else {
      gsap.to(smallRef.current.position, { x: 0, duration: ANIMATION_DURATION });
      gsap.to(largeRef.current.position, { x: OFFSET_DISTANCE, duration: ANIMATION_DURATION });
    }
  }, [scale]);

  return (
    <PresentationControls snap speed={1} zoom={1} polar={[-Math.PI / 2, Math.PI / 2]}>
      <group ref={largeRef}>
        <MacBookModel16 scale={isMobile ? 0.05 : 0.08} />
      </group>
      <group ref={smallRef}>
        <MacBookModel14 scale={isMobile ? 0.03 : 0.06} />
      </group>
    </PresentationControls>
  );
}
```

---

## 2. Studio Lighting Rig for Product Renders

```jsx
import { Environment, Lightformer } from '@react-three/drei';

export default function StudioLights() {
  return (
    <group name="lights">
      <Environment resolution={256}>
        <group>
          <Lightformer form="rect" intensity={10} position={[-10, 5, -5]} scale={10} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={10} position={[10, 0, 1]} scale={10} rotation-y={-Math.PI / 2} />
        </group>
      </Environment>
      <spotLight position={[-2, 10, 5]} angle={0.15} decay={0} intensity={Math.PI * 0.2} />
      <spotLight position={[0, -25, 10]} angle={0.15} decay={0} intensity={Math.PI * 0.2} />
    </group>
  );
}
```
