---
name: barba-gsap-page-transitions
description: |
  Implement seamless, animated multi-page website transitions using Barba.js v2 and GSAP.
  Use when: adding Single Page Application (SPA) feel to multi-page sites, building staggered curtain wipes,
  animating page enter/leave lifecycles, or orchestrating clip-path reveals.
  Triggers: barba.js, page transitions, smooth page transitions, gsap page transitions, multi-page animations, barba transitions.
---

# Barba.js & GSAP Page Transition Engineering

Orchestrate fluid, animated page transitions across static and server-rendered multi-page websites by coupling Barba.js lifecycle routing with GSAP timeline animations.

## Core Architecture

For key concepts and forbidden terminology, see [terminology.md](references/terminology.md).

Barba operates on a wrapper-container hierarchy:
- **Wrapper (`data-barba="wrapper"`)**: Persistent shell that lives through all navigations (typically `<body>`).
- **Container (`data-barba="container"`)**: Swappable content area replaced on navigation (typically `<main>`).
- **Overlay Shell**: Sits inside the wrapper but outside the container to animate across page swaps without being destroyed.

---

## Workflow

### Phase 1: Structure the DOM

1. Attach `data-barba="wrapper"` to the root body tag across all HTML pages.
2. Place all persistent site chrome (`<header>`, `<nav>`, global overlays) directly under the wrapper.
3. Enclose page-specific markup inside `<main data-barba="container" data-barba-namespace="[unique-name]">`.
4. Insert transition overlay elements directly under the wrapper (outside `<main>`):
   ```html
   <ul class="transition">
     <li></li><li></li><li></li><li></li><li></li>
   </ul>
   ```
5. Import Barba Core, GSAP, and local application script before closing `</body>`:
   ```html
   <script src="https://unpkg.com/@barba/core"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>
   <script src="js/index.js"></script>
   ```

#### Completion Gate
- [ ] `data-barba="wrapper"` is on `<body>`
- [ ] Dynamic content is wrapped in `<main data-barba="container">`
- [ ] Every page has a descriptive `data-barba-namespace`
- [ ] Navigation and `.transition` elements are outside `<main>`

---

### Phase 2: CSS Layout & Initial States

1. Configure the transition overlay container to cover the viewport above all content:
   ```scss
   ul.transition {
     display: flex;
     position: absolute; // or fixed
     z-index: 10;
     height: 100vh;
     width: 100%;
     top: 0;
     left: 0;
     margin: 0;
     padding: 0;
     pointer-events: none;
     
     li {
       transform: scaleY(0);
       background: #ffffff;
       width: 20%;
       height: 100%;
       list-style: none;
     }
   }
   ```
2. Initialize elements targeted for entry animations (e.g. image reveals) in a collapsed state using CSS `clip-path`:
   ```scss
   img {
     width: 100%;
     clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
   }
   ```

#### Completion Gate
- [ ] Overlay has `pointer-events: none` to prevent blocking clicks when inactive
- [ ] Curtain items have `transform: scaleY(0)` as resting state
- [ ] Reveal elements have initial collapsed `clip-path` or opacity states

---

### Phase 3: Animation Timeline Engineering

Define distinct animation functions using GSAP timelines. For full code implementations, see [examples.md](references/examples.md).

1. **Curtain Overlay Animation (`pageTransition`)**:
   - Step 1: Scale curtain columns to `scaleY(1)` with bottom transform origin and staggered delay.
   - Step 2: Scale curtain columns back down to `scaleY(0)` with bottom transform origin and accelerated stagger.
2. **Page Content Entrance Animation (`contentAnimation`)**:
   - Animate text container from `translateY(50px)` and `opacity: 0` to normal.
   - Animate image `clipPath` to fully open (`polygon(0 0, 100% 0, 100% 100%, 0 100%)`).
   - Use relative negative position parameters (e.g., `"-=1.1"`) to overlap content reveal with curtain exit.

#### Completion Gate
- [ ] Exit timeline covers the screen before revealing new DOM
- [ ] Enter timeline restores opacity and expands clipped geometry
- [ ] Negative position offset synchronizes content entrance with curtain drop

---

### Phase 4: Lifecycle Hook Orchestration

Initialize Barba with concurrency enabled and bind lifecycle hooks:

```javascript
function delay(n) {
  n = n || 2000;
  return new Promise((done) => setTimeout(done, n));
}

barba.init({
  sync: true,
  transitions: [
    {
      async leave(data) {
        const done = this.async();
        pageTransition();
        await delay(1500); // Matches exit curtain coverage duration
        done();
      },
      async enter(data) {
        contentAnimation();
      },
      async once(data) {
        contentAnimation();
      }
    }
  ]
});
```

#### Lifecycle Rules
- Always call `const done = this.async()` at the start of `leave()`.
- Never resolve `done()` until the exit transition has visually obscured the viewport.
- Always provide a `once()` hook so direct initial page visits animate content identically to in-app transitions.

#### Completion Gate
- [ ] `sync: true` is configured in `barba.init`
- [ ] `leave` hook awaits completion before calling `done()`
- [ ] `once` hook executes content entrance on initial load
- [ ] Page navigation runs bidirectionally without layout shifting or frozen states
