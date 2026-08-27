# Source-to-Skill Compilation: Smooth Scrolling & Scroll-Driven Grid Animations with Lenis & GSAP

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video / tutorial |
| **Title** | Complete Lenis Smooth Scroll & GSAP ScrollTrigger Grid Animation Guide (Vanilla JS & React) |
| **Authority** | Harsh Sharma (Sheryians Coding School) — Lead Web Development Instructor specializing in creative frontend and interactive web animations. |
| **Coverage** | Lenis smooth scroll setup (CDN & NPM), Lenis configuration/instance settings (`lerp`, `duration`, `infinite`, `wrapper`, `orientation`), CSS Grid layout with CSS variables, GSAP ScrollTrigger timeline animation with scrub, transforming/scaling elements on scroll, porting vanilla animation workflows into React (Vite, `useGSAP`, `useEffect`, JSX style handling). |

### Coverage Gaps Identified
- Webpack/Next.js-specific bundle configuration (source focuses on Vite and standalone Vanilla JS/CDN).
- Detailed touch device tuning beyond `syncTouch` and `touchMultiplier` options.

---

## Phase 2: Knowledge Extraction (Intermediate Spec)

```yaml
# -------------------------------------------------------------
# CONCEPTS
# -------------------------------------------------------------
- id: ku-001
  type: concept
  name: Lenis Smooth Scroll
  source: src-01, "00:23 - 03:25"
  confidence: high
  definition: >
    A lightweight, robust, performant smooth scrolling library designed to normalize
    and smooth out wheel, touch, and scroll interactions across modern browsers without breaking accessibility or native functionality.
  attributes: [performant, zero-config accessibility, touch support, lightweight]
  avoid_terms: [fake scroll, body-hijack scroll, scroll bar blocker]

- id: ku-002
  type: concept
  name: RequestAnimationFrame Render Loop (RAF)
  source: src-01, "04:25 - 05:35, 13:03 - 15:45"
  confidence: high
  definition: >
    The browser rendering loop method used to continuously update Lenis's internal scroll interpolation state
    at the display's native refresh rate.
  attributes: [raf loop, timestamp delivery, continuous interpolation]
  avoid_terms: [setInterval scroll, timer scroll]

- id: ku-003
  type: concept
  name: CSS Variable-Driven Grid Positioning
  source: src-01, "23:00 - 26:35, 34:00 - 36:00"
  confidence: high
  definition: >
    A styling pattern where layout placement (`grid-row` and `grid-column`) is controlled via dynamic inline custom properties
    (`--r`, `--c`), enabling staggered, randomized, or responsive 2D coordinate positioning without repetitive CSS classes.
  attributes: [grid-row var(--r), grid-column var(--c), dynamic matrix placement]

# -------------------------------------------------------------
# PRINCIPLES
# -------------------------------------------------------------
- id: ku-010
  type: principle
  name: RAF Continuous Synchronization
  source: src-01, "13:40 - 15:50"
  confidence: high
  statement: >
    Lenis must receive continuous time updates from `requestAnimationFrame` to compute fine-grained fractional delta steps.
    Without this continuous loop, scroll smoothing cannot calculate the easing curve between target and actual scroll position.

- id: ku-011
  type: principle
  name: Transform Origin Directional Alignment
  source: src-01, "37:35 - 39:15"
  confidence: high
  statement: >
    When scaling elements down during horizontal/parallax scroll, set their `transformOrigin` to match their exit trajectory
    (e.g., origin `0% 50%` / left for leftward drift, `100% 50%` / right for rightward drift) to prevent visual clipping and unnatural pivoting.

# -------------------------------------------------------------
# PROCEDURES
# -------------------------------------------------------------
- id: ku-020
  type: procedure
  name: Initialize Lenis Smooth Scroll (Vanilla JS)
  source: src-01, "03:45 - 05:55"
  confidence: high
  goal: Set up Lenis smooth scrolling in a standard web page
  prerequisites: [Lenis script imported or installed]
  steps:
    - action: Include Lenis stylesheet and script (via CDN or NPM bundle)
      criterion: Lenis global or module is available in the window scope
    - action: Instantiate Lenis instance using `new Lenis(options)`
      criterion: Instance created with specified settings (e.g., duration, lerp)
    - action: Construct a recursive `requestAnimationFrame` loop calling `lenis.raf(time)`
      criterion: Page scrolls smoothly on mouse wheel/drag
  outputs: [Active smooth-scrolling context]

- id: ku-021
  type: procedure
  name: Construct ScrollTrigger-Linked Scrub Animation
  source: src-01, "35:15 - 40:40"
  confidence: high
  goal: Link GSAP timeline animations directly to smooth scroll progression
  prerequisites: [GSAP core loaded, ScrollTrigger plugin loaded, Lenis running]
  steps:
    - action: Register `ScrollTrigger` via `gsap.registerPlugin(ScrollTrigger)`
      criterion: ScrollTrigger is registered before building timelines
    - action: Query all target animated elements (e.g., grid items)
      criterion: Node list or array of DOM elements is selected
    - action: Iterate over each element and determine random or calculated directional offsets (e.g., `xTransform`)
      criterion: Directional vectors and transform origins are configured per element
    - action: Create a GSAP timeline with `scrollTrigger` containing `trigger`, `start`, `end`, and `scrub: true`
      criterion: Animation progress strictly tracks viewport scroll position
  outputs: [Scroll-scrubbed interactive animation]

- id: ku-022
  type: procedure
  name: Implement Lenis and GSAP in React (Vite / Next.js compatible)
  source: src-01, "43:00 - 58:50"
  confidence: high
  goal: Integrate Lenis smooth scroll and GSAP scroll timelines within a React component lifecycle
  prerequisites: [Vite React app initialized, packages `lenis`, `gsap`, `@gsap/react` installed]
  steps:
    - action: Import `Lenis` from `'lenis'`, `gsap` from `'gsap'`, and `ScrollTrigger` from `'gsap/ScrollTrigger'`
      criterion: All packages cleanly imported without SSR/bundling errors
    - action: Register `ScrollTrigger` using `gsap.registerPlugin(ScrollTrigger)`
      criterion: Plugin registered before component mounting/rendering
    - action: Mount Lenis and its RAF loop inside a `useEffect` hook with cleanup
      criterion: Lenis starts on component mount and destroys on unmount
    - action: Encapsulate GSAP ScrollTrigger timeline definitions within `useGSAP` or scoped `useEffect`
      criterion: DOM queries target valid rendered JSX refs/classes
    - action: Adapt inline CSS custom property styles to React JSX format (`style={{ '--r': 1, '--c': 2 }}`)
      criterion: No React DOM invalid style/property console errors
  outputs: [Production-ready React smooth-scrolling animated component]

# -------------------------------------------------------------
# CONSTRAINTS
# -------------------------------------------------------------
- id: ku-030
  type: constraint
  name: ScrollTrigger Plugin Registration Requirement
  source: src-01, "41:20 - 41:55, 58:05 - 58:40"
  confidence: high
  rule: >
    GSAP ScrollTrigger must be explicitly registered via `gsap.registerPlugin(ScrollTrigger)` before declaring any
    `scrollTrigger` configuration blocks in timelines or tweens, otherwise animation triggers fail silently or throw ReferenceErrors.

- id: ku-031
  type: constraint
  name: JSX Style Object Mapping for CSS Custom Properties
  source: src-01, "53:10 - 54:15"
  confidence: high
  rule: >
    In React/JSX, CSS custom properties cannot be passed as raw strings (`style="--r: 1"`).
    They must be supplied as object key-value pairs with strings (`style={{ '--r': 1, '--c': 2 }}`).
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Smooth Scroll Environment Setup
INPUT: HTML/JS or React Project Base
STEPS:
  1. Add Lenis CSS stylesheet to head.
  2. Instantiate Lenis with chosen tuning parameters (`duration`, `lerp`, `smoothWheel`, `infinite`).
  3. Wire the recursive `requestAnimationFrame` loop to feed timestamps into `lenis.raf(time)`.
OUTPUT: Operational smooth-scrolling viewport.
VALIDATION:
  [ ] Page does not jerk or stutter during wheel input.
  [ ] RAF loop fires continuously on page render.

STAGE 2: Spatial Grid & Layout Architecture
INPUT: Asset collection (images/cards) and typography.
STEPS:
  1. Establish container grid (`display: grid`) with explicit rows and columns.
  2. Apply CSS variables `--r` and `--c` to control dynamic row/column coordinates per child.
  3. Overlay fixed or centered typography layers with high `z-index` and pointer-events configuration.
OUTPUT: Multi-row, multi-column scattered visual grid.
VALIDATION:
  [ ] Grid children position according to `--r` and `--c`.
  [ ] Centered text remains readable above or between visual items.

STAGE 3: Scroll-Driven Vector & Scale Orchestration
INPUT: Grid elements, GSAP core, ScrollTrigger plugin.
STEPS:
  1. Register `ScrollTrigger` with GSAP.
  2. Calculate directional movement offsets (`xTransform` between -100% and 100%) and assign corresponding `transformOrigin`.
  3. Construct GSAP Timeline with `scrollTrigger: { trigger, start, end, scrub: true }`.
  4. Tween element scale down to 0 and shift X/Y position as the element traverses the viewport.
OUTPUT: Parallax/collapsing grid animation synchronised to scroll.
VALIDATION:
  [ ] Elements scale toward their exit anchors without clipping.
  [ ] Animation strictly follows scroll delta in both forward and reverse directions.

STAGE 4: Framework-Specific Adaptation (React / Vite)
INPUT: Vanilla code and Vite React environment.
STEPS:
  1. Install `lenis`, `gsap`, `@gsap/react`.
  2. Isolate Lenis RAF loop inside `useEffect` or root animation context.
  3. Implement `useGSAP` hook for scoped timeline teardown and reactive DOM queries.
  4. Convert HTML `class` to `className` and style strings to JSX object notation.
OUTPUT: Performant React implementation.
VALIDATION:
  [ ] No memory leaks on component unmount (Lenis & ScrollTrigger properly disposed).
  [ ] No React style prop syntax errors in browser console.
```

---

## Phase 4 & Phase 5: Skill Compilation & Delivery

Below is the complete, production-ready, compiled agent skill package.

```
lenis-gsap-smooth-scroll/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── lenis-options.md
    └── examples.md
```

---

### `lenis-gsap-smooth-scroll/SKILL.md`

```markdown
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
```

---

### `lenis-gsap-smooth-scroll/references/terminology.md`

```markdown
# Terminology

**Lenis**:
A high-performance, modern smooth-scrolling engine that preserves native scroll behavior and accessibility while applying configurable easing physics.
_Avoid_: body scroll hijacker, fake custom scrollbar

**Scrubbing**:
The direct 1:1 binding of animation playhead progress to the scrollbar/viewport travel distance.
_Avoid_: scroll trigger timer, delayed scroll animation

**RequestAnimationFrame (RAF) Loop**:
A high-frequency browser callback loop executing render computations immediately before screen redraws, ensuring 60Hz/120Hz smooth interpolation.
_Avoid_: interval loop, timer callback

**Transform Origin**:
The coordinate anchor point around which CSS transformations (scaling, rotation, skewing) pivot.
_Avoid_: center point, scale anchor

**Lerp (Linear Interpolation)**:
A mathematical smoothing technique computing fractional movements between a current value and a target value per animation tick.
_Avoid_: step animation, jump scroll
```

---

### `lenis-gsap-smooth-scroll/references/lenis-options.md`

```markdown
# Lenis Configuration Settings Reference

Pass these properties to `new Lenis({ ... })` to customize scroll physics.

| Option | Type | Default | Description |
|---|---|---|---|
| `wrapper` | `HTMLElement` \| `window` | `window` | Container element used for listening and managing scroll viewport. |
| `content` | `HTMLElement` | `document.documentElement` | Scrollable container content holding all DOM elements. |
| `eventsTarget` | `HTMLElement` \| `window` | `wrapper` | Element that listens to touch and wheel events. |
| `smoothWheel` | `boolean` | `true` | Enables smooth easing on mouse wheel and touchpad actions. |
| `lerp` | `number` | `0.1` | Linear interpolation intensity between 0 and 1 (lower = smoother/slower). |
| `duration` | `number` | `1.2` | Duration of scroll animation in seconds (overridden if `lerp` is specified). |
| `easing` | `function` | `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` | Custom easing curve function. |
| `orientation` | `'vertical'` \| `'horizontal'` | `'vertical'` | Primary scroll trajectory axis. |
| `gestureOrientation` | `'vertical'` \| `'horizontal'` | `'vertical'` | Gesture detection axis for trackpads and touch devices. |
| `syncTouch` | `boolean` | `false` | Emulates inertial wheel scrolling physics on native touch drag. |
| `touchMultiplier` | `number` | `1` | Touch gesture scroll speed multiplier. |
| `wheelMultiplier` | `number` | `1` | Mouse wheel scroll speed multiplier. |
| `infinite` | `boolean` | `false` | Loops scrolling indefinitely between page top and bottom bounds. |
| `autoResize` | `boolean` | `true` | Automatically detects window size and DOM height mutations. |
```

---

### `lenis-gsap-smooth-scroll/references/examples.md`

```markdown
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
```
