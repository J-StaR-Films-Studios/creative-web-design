# End-to-End Code Recipes

Production-ready implementation examples combining multiple core pillars.

## 1. The Awwwards Hero Scroll

Combines Lenis, ScrollTrigger pinning, and typographic staggering.

```jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export function Hero() {
  const container = useRef(null);
  const headline = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        }
      });

      tl.to(headline.current, { scale: 1.5, opacity: 0, ease: 'power2.inOut' })
        .to(canvas.current, { rotationY: 180, z: -100 }, '<');

    }, container);
    
    return () => ctx.revert(); // React cleanup
  }, []);

  return (
    <section ref={container} className="h-screen relative overflow-hidden bg-black text-white">
      <h1 ref={headline} className="text-9xl text-center absolute inset-0 flex items-center justify-center">
        IMMERSIVE
      </h1>
      <div ref={canvas} className="absolute inset-0 z-[-1]">
        {/* R3F Canvas Mount Point */}
      </div>
    </section>
  );
}
```

## 2. Global RequestAnimationFrame Sync

Orchestrate Lenis and R3F to use the exact same temporal source.

```javascript
// In your global layout or app wrapper
import { addEffect } from '@react-three/fiber'
import Lenis from '@studio-freight/lenis'

export function ScrollController() {
  useEffect(() => {
    const lenis = new Lenis()

    // Sync Lenis with R3F's internal loop
    const sub = addEffect((time) => {
      lenis.raf(time)
    })

    return () => {
      sub() // Unsubscribe
      lenis.destroy()
    }
  }, [])
  
  return null
}
```
