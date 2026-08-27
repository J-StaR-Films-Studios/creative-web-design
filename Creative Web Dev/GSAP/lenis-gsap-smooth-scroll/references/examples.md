# Implementation Examples

## Example 1: Full Vanilla HTML/JS Showcase

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lenis Smooth Scroll Showcase</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://unpkg.com/lenis@1.1.13/dist/lenis.css">
  <style>
    .grid-div > div {
      grid-row: var(--r);
      grid-column: var(--c);
    }
  </style>
</head>
<body class="bg-zinc-900 text-white">

  <!-- Fixed Hero Overlay -->
  <div class="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none z-50">
    <h1 class="text-7xl font-bold uppercase tracking-tight">Thomas Vance<sup>®</sup></h1>
    <h2 class="text-3xl text-zinc-400 mt-2">Editorial Collection</h2>
  </div>

  <!-- Scattered Grid -->
  <div class="grid-div grid grid-cols-8 grid-rows-20 gap-4 p-8 w-full">
    <div class="elem col-span-1 row-span-1" style="--r: 1; --c: 2;"><img src="/img/1.jpg" class="w-full h-full object-cover" /></div>
    <div class="elem col-span-1 row-span-1" style="--r: 2; --c: 6;"><img src="/img/2.jpg" class="w-full h-full object-cover" /></div>
    <div class="elem col-span-1 row-span-1" style="--r: 4; --c: 4;"><img src="/img/3.jpg" class="w-full h-full object-cover" /></div>
    <div class="elem col-span-1 row-span-1" style="--r: 6; --c: 1;"><img src="/img/4.jpg" class="w-full h-full object-cover" /></div>
  </div>

  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
  <script>
    // 1. Lenis Setup
    const lenis = new Lenis({ duration: 1.2 });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP ScrollTrigger Setup
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.elem').forEach((elem) => {
      const img = elem.querySelector('img');
      const xOffset = gsap.utils.random(-100, 100);

      gsap.set(img, {
        transformOrigin: `${xOffset < 0 ? 0 : 100}% 50%`
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
      .to(img, { scale: 0, ease: 'none' }, 'sync')
      .to(elem, { xPercent: xOffset, ease: 'none' }, 'sync');
    });
  </script>
</body>
</html>
```

---

## Example 2: React Component (Vite / Next.js)

```jsx
import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const gridItems = [
  { id: 1, r: 1, c: 2, src: '/img/1.jpg' },
  { id: 2, r: 2, c: 6, src: '/img/2.jpg' },
  { id: 3, r: 4, c: 4, src: '/img/3.jpg' },
  { id: 4, r: 6, c: 1, src: '/img/4.jpg' },
];

export default function ParallaxShowcase() {
  const containerRef = useRef(null);

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    let frameId;

    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  // GSAP Animations
  useGSAP(() => {
    const elements = containerRef.current.querySelectorAll('.elem');

    elements.forEach((elem) => {
      const img = elem.querySelector('img');
      const xTransform = gsap.utils.random(-80, 80);

      gsap.set(img, {
        transformOrigin: `${xTransform < 0 ? 0 : 100}% 50%`,
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
      .to(img, { scale: 0, ease: 'none' }, 'start')
      .to(elem, { xPercent: xTransform, ease: 'none' }, 'start');
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full bg-zinc-900 text-white min-h-screen">
      {/* Title */}
      <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
        <h1 className="text-6xl font-bold uppercase tracking-wider">Thomas Vance®</h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 grid-rows-20 gap-4 p-8 w-full">
        {gridItems.map((item) => (
          <div
            key={item.id}
            className="elem col-span-1 row-span-1"
            style={{
              gridRow: `var(--r)`,
              gridColumn: `var(--c)`,
              '--r': item.r,
              '--c': item.c,
            }}
          >
            <img src={item.src} alt={`Visual ${item.id}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
```
