# Motion and Scroll Choreography

Implement high-end typographic and scroll-driven motion using Lenis and GSAP.

## 1. Lenis Smooth Scroll Integration

Synchronize Lenis with GSAP's ticker to prevent scroll-jitter.

```javascript
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  lerp: 0.1, // Adjust for perceived weight
  wheelMultiplier: 1,
  smoothWheel: true,
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0) // Crucial for perfect sync
```

## 2. Typographic Mask Reveals

Utilize `SplitText` (or custom character wrapping) to construct staggered mask reveals.

1. Wrap the text node in a parent div with `overflow: hidden`.
2. Apply `transform: translateY(100%)` to the child element as the starting state.
3. Animate the child `y` to `0%`.

```javascript
gsap.fromTo('.split-char', 
  { y: '100%', rotationZ: 5 },
  { 
    y: '0%', 
    rotationZ: 0, 
    duration: 1.2, 
    stagger: 0.02, 
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '.text-container',
      start: 'top 80%',
    }
  }
);
```

## 3. The Pinned Buffer Strategy

When creating 3D product scrolls (e.g., Apple landing pages), pin a container and map its internal scroll progress to a sequence.

1. Create a `[data-pin-spacer]` that is 400vh tall.
2. Pin the `[data-visual-target]` inside it.
3. Map the progress (0 to 1) to GSAP timeline scrub.

```javascript
gsap.to(timeline, {
  progress: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: '.pin-spacer',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    pin: '.visual-target'
  }
});
```
