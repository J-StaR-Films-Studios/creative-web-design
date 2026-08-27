---
name: page-transition-gsap
description: |
  Implement seamless multi-page shutter / curtain transitions using HTML, CSS, JavaScript, and GSAP.
  Use when: creating smooth page transitions, eliminating white flash between MPA pages, building
  cinematic creative portfolio navigation, orchestrating Promise-based GSAP entrance and exit timelines,
  or intercepting anchor click navigation.
  Triggers: page transition, gsap page transition, shutter transition, curtain transition, smooth page navigation.
---

# Page Transition GSAP

Build high-performance, cinematic shutter page transitions across multi-page sites using vanilla JavaScript, CSS transforms, and GSAP timelines.

## Core Architecture & Workflow

```
[Page Load] → Set ScaleY(1) → revealTransition() → ScaleY(0) → Set Hidden
                                                                   ↓
[Link Click] ← PreventDefault ← AnimateTransition() ← Set Visible ← Intercept Link
     ↓
[Promise Resolves] → window.location.href = target
```

For domain terms, see [terminology.md](references/terminology.md).  
For full code examples across multiple pages, see [examples.md](references/examples.md).

---

## Phase 1: DOM Overlay Scaffolding

Structure the full-screen shutter overlay containing two opposing rows of block partitions.

1. **Insert the overlay container** at the top of every page `<body>`:
   ```html
   <div class="transitionContainer">
     <div class="transition-row row-1">
       <div class="block"></div>
       <div class="block"></div>
       <div class="block"></div>
       <div class="block"></div>
       <div class="block"></div>
     </div>
     <div class="transition-row row-2">
       <div class="block"></div>
       <div class="block"></div>
       <div class="block"></div>
       <div class="block"></div>
       <div class="block"></div>
     </div>
   </div>
   ```

2. **Wrap page content** in a main tag and elevate header navigation `z-index` so navigation remains accessible:
   ```html
   <nav class="nav">
     <a href="index.html" class="logo">LOGO</a>
     <div class="nav-items">
       <a href="index.html">HOME</a>
       <a href="about.html">ABOUT</a>
       <a href="contact.html">CONTACT</a>
     </div>
   </nav>
   <main>
     <div class="title"><h1>HOME</h1></div>
   </main>
   ```

3. **Import GSAP** before your custom script:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
   <script src="app.js"></script>
   ```

### Completion gate
- [ ] Overlay markup identical across all target pages.
- [ ] Row 1 and Row 2 contain identical block counts (e.g., 5 blocks per row).
- [ ] GSAP library script loaded before application code.

---

## Phase 2: CSS Layout & Transform Origin Configuration

Configure fixed viewport coverage, zero-pointer-event capture, and opposing transform origins for the shutter effect.

1. **Style the transition container**:
   ```css
   .transitionContainer {
     position: fixed;
     top: 0;
     left: 0;
     width: 100vw;
     height: 100vh;
     display: flex;
     flex-direction: column;
     z-index: 999;
     pointer-events: none;
   }

   .transition-row {
     display: flex;
     flex: 1;
     width: 100%;
   }

   .block {
     flex: 1;
     background-color: #ffffff;
     transform: scaleY(1);
     will-change: transform;
   }
   ```

2. **Set opposing transform origins**:
   ```css
   /* Top row expands/contracts from the top edge */
   .transition-row.row-1 .block {
     transform-origin: top;
   }

   /* Bottom row expands/contracts from the bottom edge */
   .transition-row.row-2 .block {
     transform-origin: bottom;
   }
   ```

3. **Elevate interactive elements**:
   ```css
   nav {
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     z-index: 1000;
   }
   ```

### Completion gate
- [ ] `.transitionContainer` has `position: fixed`, `width: 100vw`, `height: 100vh`, and `pointer-events: none`.
- [ ] `.transition-row.row-1 .block` has `transform-origin: top`.
- [ ] `.transition-row.row-2 .block` has `transform-origin: bottom`.
- [ ] Interactive UI (nav/controls) maintains higher `z-index` than the overlay.

---

## Phase 3: Entrance Reveal Timeline (`revealTransition`)

Execute the opening animation on `DOMContentLoaded` to uncover the newly loaded page.

1. **Initialize initial shutter state** and chain the reveal:
   ```javascript
   document.addEventListener("DOMContentLoaded", () => {
     // Prepare overlay as fully covering the viewport
     gsap.set(".block", {
       visibility: "visible",
       scaleY: 1
     });

     // Execute entrance reveal animation
     revealTransition().then(() => {
       gsap.set(".block", { visibility: "hidden" });
     });

     attachNavigationListeners();
   });
   ```

2. **Define `revealTransition()`** with staggered scaling from `1` to `0`:
   ```javascript
   function revealTransition() {
     return new Promise((resolve) => {
       const tl = gsap.timeline({
         onComplete: resolve
       });

       // Top row collapses upward
       tl.fromTo(
         ".row-1 .block",
         { scaleY: 1 },
         {
           scaleY: 0,
           duration: 1,
           delay: 0.2,
           stagger: {
             each: 0.1,
             from: "start", // Options: "start", "center", "end"
             grid: [1, 5],
             axis: "x"
           },
           ease: "expo.inOut"
         }
       );

       // Bottom row collapses downward simultaneously
       tl.fromTo(
         ".row-2 .block",
         { scaleY: 1 },
         {
           scaleY: 0,
           duration: 1,
           delay: 0.2,
           stagger: {
             each: 0.1,
             from: "start",
             grid: [1, 5],
             axis: "x"
           },
           ease: "expo.inOut"
         },
         "<" // Sync timeline start with row-1
       );
     });
   }
   ```

### Completion gate
- [ ] `revealTransition()` returns a native `Promise`.
- [ ] Timeline uses `onComplete: resolve`.
- [ ] Both row timelines run in parallel using position parameter `"<"`.
- [ ] Overlay blocks hidden (`visibility: hidden`) once resolved to restore DOM clarity.

---

## Phase 4: Navigation Interception & Exit Timeline (`animateTransition`)

Intercept link navigation, play the closing shutter animation, and redirect the browser only when the screen is fully obscured.

1. **Attach link interception**:
   ```javascript
   function attachNavigationListeners() {
     const links = document.querySelectorAll("a");

     links.forEach((link) => {
       link.addEventListener("click", (event) => {
         const href = link.getAttribute("href");

         // Guard: Ignore empty links, hashes, external tabs, or same-page clicks
         if (
           !href ||
           href.startsWith("#") ||
           href === window.location.pathname ||
           href === window.location.href ||
           link.target === "_blank"
         ) {
           return;
         }

         event.preventDefault();

         animateTransition().then(() => {
           window.location.href = href;
         });
       });
     });
   }
   ```

2. **Define `animateTransition()`** to close the shutter:
   ```javascript
   function animateTransition() {
     return new Promise((resolve) => {
       gsap.set(".block", {
         visibility: "visible",
         scaleY: 0
       });

       const tl = gsap.timeline({
         onComplete: resolve
       });

       // Top row extends downward
       tl.fromTo(
         ".row-1 .block",
         { scaleY: 0 },
         {
           scaleY: 1,
           duration: 1,
           delay: 0.2,
           stagger: {
             each: 0.1,
             from: "end", // Reverse flow from entrance for visual dynamism
             grid: [1, 5],
             axis: "x"
           },
           ease: "expo.out"
         }
       );

       // Bottom row extends upward
       tl.fromTo(
         ".row-2 .block",
         { scaleY: 0 },
         {
           scaleY: 1,
           duration: 1,
           delay: 0.2,
           stagger: {
             each: 0.1,
             from: "end",
             grid: [1, 5],
             axis: "x"
           },
           ease: "expo.out"
         },
         "<"
       );
     });
   }
   ```

### Completion gate
- [ ] Internal link clicks are intercepted with `event.preventDefault()`.
- [ ] Safe guards skip external links (`_blank`), hash anchors, and same-page reloads.
- [ ] `window.location.href` is called exclusively inside `animateTransition().then()`.
