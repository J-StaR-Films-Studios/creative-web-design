---
name: barba-gsap-transitions
description: |
  Implement seamless page transitions in vanilla HTML/CSS/JavaScript using Barba.js and GSAP.
  Use when building multi-page websites that require SPA-like animated transitions, overlay wipes,
  persistent navigation bars, or masked text reveals.
  Triggers: barba transitions, smooth page transitions, barba js gsap, html page transition,
  multi-page animated transition, barba wrapper container.
---

# Barba.js & GSAP Page Transitions

Orchestrate smooth, seamless page transitions across static multi-page sites by pairing Barba.js DOM-swapping with GSAP timeline animations.

## Principles

1. **Persistent UI Outside Container**: Keep persistent elements (navbars, footers, overlay wipe blocks) outside `data-barba="container"` but inside `data-barba="wrapper"`.
2. **Plural Configuration**: Always define `transitions: [...]` (plural) in `barba.init()`.
3. **Asynchronous Lifecycle Handling**: Intercept page exit in the `leave` hook using `const done = this.async()` and call `done()` once the exit timeline completes.

---

## Phase 1: DOM Hierarchy & Barba Markup

Structure all HTML documents to support Barba DOM replacement.

1. **Import Libraries**: Load Barba.js core and GSAP via CDN before the local script tag.
   ```html
   <script src="https://unpkg.com/@barba/core"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.6/gsap.min.js"></script>
   <script src="script.js"></script>
   ```
2. **Assign Wrapper**: Set `data-barba="wrapper"` on the `<body>` element.
3. **Add Transition Canvas**: Insert a dedicated transition overlay element directly inside the wrapper:
   ```html
   <div class="transition"></div>
   ```
4. **Isolate Persistent Navigation**: Place navigation links inside the wrapper, outside the dynamic container:
   ```html
   <div class="wrapper">
     <nav class="nav">
       <a href="index.html">Home</a>
       <a href="about.html">About</a>
       <a href="contact.html">Contact</a>
     </nav>
     <!-- dynamic container goes here -->
   </div>
   ```
5. **Define Dynamic Container**: Wrap page-specific content inside a `<main>` container with Barba attributes:
   ```html
   <main data-barba="container" data-barba-namespace="home" class="container">
     <div class="header">
       <h1>Homebase</h1>
       <div class="header-revealer"></div>
     </div>
     <div class="footer">(01)</div>
   </main>
   ```
6. **Replicate Across Pages**: Duplicate this structure across all target pages (`about.html`, `contact.html`), updating `data-barba-namespace` and internal text.

### Completion Gate
- [ ] Every page has `data-barba="wrapper"` on the body.
- [ ] The `.transition` overlay element is present on all pages outside the container.
- [ ] Navigation anchors use standard `href` attributes pointing to HTML files.
- [ ] Each page has a unique `data-barba-namespace`.

---

## Phase 2: CSS Layout & Wipe Layer Setup

Set up dimensions, positioning, and animation masks.

1. **Configure Transition Layer**: Ensure the transition wipe element covers the viewport and ignores pointer interactions while inactive:
   ```css
   .transition {
     position: absolute;
     z-index: 2;
     top: 0;
     left: 0;
     width: 100%;
     height: 100vh;
     pointer-events: none;
     background: #ffffff;
     transform: scaleY(0);
     -webkit-transform: scaleY(0);
   }
   ```
2. **Style Persistent Navigation**: Lay out the navbar with flexbox and border dividers.
3. **Configure Text Revealer Masks**: Place content revealers over headings to allow displacement animations:
   ```css
   .header {
     position: relative;
     width: max-content;
     height: max-content;
   }
   h1 {
     position: relative;
     top: 120px;
   }
   .header-revealer {
     position: absolute;
     top: 0;
     width: 100%;
     height: 100%;
   }
   .header-revealer::after {
     content: "";
     position: absolute;
     top: 120px;
     left: 0;
     width: 110%;
     height: 110%;
     background: #0f0f0f;
   }
   ```

### Completion Gate
- [ ] `.transition` element has `pointer-events: none` and `transform: scaleY(0)` initially.
- [ ] Content reveal masks match page background colors.

---

## Phase 3: Animation Logic & Barba Initialization

Coordinate GSAP timelines with Barba lifecycle hooks in `script.js`.

For full code implementations, see [examples.md](references/examples.md).
For domain definitions and anti-synonyms, see [terminology.md](references/terminology.md).

1. **Build Overlay Timeline**: Construct `pageTransition()` to scale the wipe layer in from the bottom, then out through the top:
   ```javascript
   function pageTransition() {
     const tl = gsap.timeline();
     tl.to(".transition", {
       duration: 1,
       scaleY: 1,
       transformOrigin: "bottom",
       ease: "power4.inOut"
     });
     tl.to(".transition", {
       duration: 1,
       scaleY: 0,
       transformOrigin: "top",
       ease: "power4.inOut",
       delay: 0.2
     });
   }
   ```
2. **Build Content Entrance Timeline**: Construct `contentAnimation()` to slide displaced headings to `top: 0`:
   ```javascript
   function contentAnimation() {
     const tl = gsap.timeline();
     tl.to("h1", {
       top: 0,
       duration: 1,
       ease: "power3.inOut",
       delay: 0.75
     });
   }
   ```
3. **Implement Async Delay Helper**:
   ```javascript
   function delay(ms) {
     return new Promise((done) => setTimeout(done, ms || 2000));
   }
   ```
4. **Initialize Barba**:
   ```javascript
   barba.init({
     sync: true,
     transitions: [
       {
         async leave(data) {
           const done = this.async();
           pageTransition();
           await delay(1000);
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

### Completion Gate
- [ ] `barba.init()` contains `transitions` (plural).
- [ ] `sync: true` is enabled for coordinated entering and leaving containers.
- [ ] `this.async()` token is resolved with `done()` after transition completion.
- [ ] `once` hook fires entrance animations on initial page load.
