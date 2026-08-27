---
name: lenis-gsap-smooth-scroll
description: |
  Implement Lenis smooth scrolling and GSAP ScrollTrigger parallax/grid animations in Vanilla JS and React.
  Use when building interactive landing pages, portfolio showcases, fashion grids, or smooth scroll-driven experiences.
  Triggers: lenis smooth scroll, gsap scroll animation, smooth scroll react, scrolltrigger grid animation, parallax showcase.
---

# Lenis Smooth Scroll & GSAP ScrollTrigger Integration

Build high-performance, accessible smooth scroll experiences combined with scroll-synchronized GSAP animations across Vanilla JS and React applications.

## Ground Rules

1. **Always feed timestamps via RAF**: Lenis relies on a continuous `requestAnimationFrame` loop calling `lenis.raf(time)` to interpolate scroll physics.
2. **Explicitly register ScrollTrigger**: Execute `gsap.registerPlugin(ScrollTrigger)` prior to creating timelines.
3. **Anchor Transform Origins**: When scaling or translating items on scroll, set `transformOrigin` to match directional exit vectors to prevent unnatural warping.
4. **Scrub Sync**: Use `scrub: true` or numeric scrub values (`scrub: 1`) on ScrollTrigger instances to tie tween progression directly to the smooth scroll position.

For common domain terminology and anti-synonyms, see [terminology.md](references/terminology.md).

---

## Phase 1: Environment Setup & Lenis Initialization

Initialize Lenis to control page smooth scrolling physics.

### Vanilla HTML/JS

1. Include the Lenis stylesheet and script via CDN or bundler:
   ```html
   <link rel="stylesheet" href="https://unpkg.com/lenis@1.1.13/dist/lenis.css">
   <script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
   ```
2. Instantiate Lenis and establish the continuous RAF render loop:
   ```javascript
   const lenis = new Lenis({
     duration: 1.2,
     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
     smoothWheel: true,
   });

   function raf(time) {
     lenis.raf(time);
     requestAnimationFrame(raf);
   }
   requestAnimationFrame(raf);
   ```

### React (Vite / Next.js)

1. Install required dependencies:
   ```bash
   npm i lenis gsap @gsap/react
   ```
2. Initialize inside component root with lifecycle cleanup:
   ```jsx
   import { useEffect } from 'react';
   import Lenis from 'lenis';
   import 'lenis/dist/lenis.css';

   export default function App() {
     useEffect(() => {
       const lenis = new Lenis({ duration: 1.2 });
       let rafId;

       function raf(time) {
         lenis.raf(time);
         rafId = requestAnimationFrame(raf);
       }
       rafId = requestAnimationFrame(raf);

       return () => {
         cancelAnimationFrame(rafId);
         lenis.destroy();
       };
     }, []);

     return <main>{/* content */}</main>;
   }
   ```

For detailed configuration options (e.g., `infinite`, `orientation`, `lerp`, `wrapper`), see [lenis-options.md](references/lenis-options.md).

### Completion Gate
- [ ] Lenis stylesheet loaded without rendering artifacts.
- [ ] Viewport responds with eased, interpolated scrolling on mouse wheel/touch drag.
- [ ] RAF loop runs continuously without uncaught frame errors.

---

## Phase 2: Structural Grid Architecture (CSS Variables)

Structure a modular 2D coordinate grid using CSS custom properties for scattered layout generation.

1. Define the grid container with Tailwind CSS or standard CSS:
   ```html
   <div class="grid grid-cols-8 grid-rows-20 gap-2 overflow-hidden w-full bg-zinc-900">
     <!-- Dynamic Items -->
     <div class="elem col-span-1 row-span-1" style="--r: 1; --c: 3;">
       <img src="/img/1.jpg" alt="Item 1" class="w-full h-full object-cover" />
     </div>
   </div>
   ```
2. Bind CSS rules to map custom properties to grid indices:
   ```css
   .grid > div {
     grid-row: var(--r);
     grid-column: var(--c);
   }
   ```
3. Attach overlay titles using fixed/absolute positioning with `pointer-events-none` where necessary to maintain scroll ergonomics.

### Completion Gate
- [ ] Items populate calculated row/column coordinates.
- [ ] Layout maintains responsive bounds without breaking viewport width.

---

## Phase 3: GSAP ScrollTrigger Animation Orchestration

Bind visual transitions (scaling, translation, opacity) to the scroll delta using GSAP ScrollTrigger.

1. Import and register ScrollTrigger:
   ```javascript
   import { gsap } from 'gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';

   gsap.registerPlugin(ScrollTrigger);
   ```
2. Iterate through grid elements, determine random/directional transforms, and bind ScrollTrigger timelines:
   ```javascript
   const elements = document.querySelectorAll('.elem');

   elements.forEach((elem) => {
     const image = elem.querySelector('img');
     const xTransform = gsap.utils.random(-100, 100);

     // Dynamically set origin based on exit trajectory
     gsap.set(image, {
       transformOrigin: `${xTransform < 0 ? 0 : 100}% 50%`,
     });

     const tl = gsap.timeline({
       scrollTrigger: {
         trigger: image,
         start: 'top bottom',
         end: 'bottom top',
         scrub: true,
       },
     });

     tl.to(image, {
       scale: 0,
       ease: 'none',
     }, 'start')
     .to(elem, {
       xPercent: xTransform,
       ease: 'power4.inOut',
     }, 'start');
   });
   ```

For complete working implementations across Vanilla JS and React, see [examples.md](references/examples.md).

### Completion Gate
- [ ] All grid items scrub seamlessly between viewport enter (`top bottom`) and exit (`bottom top`).
- [ ] Images scale down toward their set transform origins without jarring angle flips.

---

## Phase 4: React Integration & JSX Normalization

When deploying inside React, convert DOM manipulation and inline styling into safe JSX conventions.

1. **Inline CSS Custom Properties**: Pass CSS variables using React object syntax:
   ```jsx
   <div
     className="elem col-span-1 row-span-1"
     style={{ '--r': rowNumber, '--c': colNumber }}
   >
     <img src={src} alt={alt} className="w-full h-full object-cover" />
   </div>
   ```
2. **Scoping Tweens with `useGSAP`**:
   ```jsx
   import { useGSAP } from '@gsap/react';

   useGSAP(() => {
     const elements = document.querySelectorAll('.elem');
     elements.forEach((elem) => {
       const image = elem.querySelector('img');
       const xTransform = gsap.utils.random(-100, 100);

       gsap.set(image, {
         transformOrigin: `${xTransform < 0 ? 0 : 100}% 50%`,
       });

       gsap.timeline({
         scrollTrigger: {
           trigger: image,
           start: 'top bottom',
           end: 'bottom top',
           scrub: true,
         },
       })
       .to(image, { scale: 0, ease: 'none' }, 'start')
       .to(elem, { xPercent: xTransform, ease: 'none' }, 'start');
     });
   }, []);
   ```

### Completion Gate
- [ ] Zero JSX/React console warnings regarding invalid style properties or unclosed tags.
- [ ] GSAP timelines correctly recalculate positions on React hot-reloads and window resizes.
