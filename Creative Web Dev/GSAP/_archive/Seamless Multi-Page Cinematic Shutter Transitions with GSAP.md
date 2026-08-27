# Source-to-Skill Compilation Report

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video / tutorial |
| **Title** | Seamless Multi-Page Cinematic Shutter Transitions with GSAP |
| **Authority** | Frontend Animation & Creative Web Developer |
| **Coverage** | Intercepting browser navigation, Promise-based lifecycle synchronization, HTML/CSS shutter grid overlay setup, GSAP entrance (`revealTransition`) & exit (`animateTransition`) timelines with staggered transforms, and clean state resetting. |

### Coverage Gaps Identified
- The source demonstrates hard page transitions across static multi-page HTML setups (standard multi-page application / MPA navigation with `window.location.href`). Single Page Application (SPA) router-based transitions (e.g., Next.js, Barba.js, Vue Router) are not directly implemented, though the animation logic translates directly.

---

## Phase 2: Knowledge Extraction

```yaml
# Knowledge Spec — Shutter Page Transition System

- id: ku-001
  type: concept
  name: Shutter Transition Overlay
  source: src-01, "01:13-03:17"
  confidence: high
  definition: >
    A fixed, full-screen DOM overlay containing symmetrical rows of segmented rectangular
    blocks that scale vertically in opposing directions to conceal and reveal page content.
  attributes: [fixed positioning, pointer-events none, transform-origin split, segmented block grid]
  avoid_terms: [loading screen, spinner, popup overlay]

- id: ku-002
  type: concept
  name: Navigation Interceptor
  source: src-01, "03:18-04:02"
  confidence: high
  definition: >
    An event-handling mechanism attached to anchor tags that halts default instant browser
    navigation, allowing an exit animation timeline to run to completion before updating the URL.
  attributes: [event.preventDefault, href validation, hash filtering, same-origin check]
  avoid_terms: [link blocker, router hook]

- id: ku-003
  type: principle
  name: Promise-Wrapped Animation Lifecycles
  source: src-01, "04:30-05:59"
  confidence: high
  statement: >
    Wrap GSAP animation timelines in native Promises and resolve them strictly via the timeline's
    onComplete callback. This prevents race conditions between animation duration and URL navigation.
  rationale: >
    Directly setting window.location or DOM changes without awaiting full timeline completion
    cuts off animations mid-flight and causes layout flashes.
  applies_to: [ku-006, ku-007]

- id: ku-004
  type: principle
  name: Opposing Transform Origins
  source: src-01, "02:49-03:17"
  confidence: high
  statement: >
    Set top row blocks to `transform-origin: top` and bottom row blocks to `transform-origin: bottom`.
  rationale: >
    During exit, top blocks expand downward while bottom blocks expand upward to meet at center.
    During reveal, top blocks contract upward while bottom blocks contract downward, producing
    a dual mechanical shutter / iris effect.
  applies_to: [ku-005, ku-006, ku-007]

- id: ku-005
  type: procedure
  name: Markup and Overlay Layout Construction
  source: src-01, "01:13-03:17"
  confidence: high
  goal: Build a non-blocking full-screen shutter overlay grid
  steps:
    - action: Create transition container with two flex rows, each holding N blocks
      criterion: DOM contains equal block counts across both rows
    - action: Style container as fixed full-screen with pointer-events none and zero/negative z-index
      criterion: Overlay covers viewport without capturing user clicks during idle state
    - action: Assign transform-origin top to row 1 blocks and transform-origin bottom to row 2 blocks
      criterion: Blocks scale away from and toward their outer viewport edges
  outputs: [Structured HTML overlay and CSS layout]

- id: ku-006
  type: procedure
  name: Entrance (Reveal) Animation Execution
  source: src-01, "04:03-05:30"
  confidence: high
  goal: Animate shutter blocks out of view on page load to reveal content
  prerequisites: [DOM ready, overlay blocks initialized to visible and scaleY 1]
  steps:
    - action: Set initial block state to visible with scaleY: 1
      criterion: Blocks fully cover viewport before rendering starts
    - action: Construct Promise-wrapped GSAP timeline scaling scaleY from 1 to 0
      criterion: Top and bottom rows animate concurrently with staggered axis timing
    - action: Hide block visibility on resolve
      criterion: Blocks removed from visual layer after contract completion
  outputs: [Smooth page reveal on initial load]

- id: ku-007
  type: procedure
  name: Navigation Interception and Exit Animation
  source: src-01, "03:18-04:02, 05:31-06:35"
  confidence: high
  goal: Intercept navigation, play closing shutter animation, and redirect upon completion
  steps:
    - action: Attach click listener to target anchor tags
      criterion: Internal navigation links intercepted
    - action: Check target href for validity and ignore empty links, current page, or hash links
      criterion: Invalid or intra-page anchors proceed normally without animation lock
    - action: Call event.preventDefault() and invoke Promise-wrapped animateTransition()
      criterion: Page stays open until closing timeline onComplete fires
    - action: Execute window.location.href = href inside the promise resolution handler
      criterion: Browser redirects only after overlay fully covers the viewport
  outputs: [Concealing shutter animation followed by clean page transfer]

- id: ku-008
  type: constraint
  name: Pointer Events and Z-Index Stratification
  source: src-01, "02:26-03:00"
  confidence: high
  rule: >
    Overlay container must use `pointer-events: none` during idle states, and interactive content
    (such as the navbar) must maintain a higher z-index than the underlying document structure.
  scope: CSS architecture
  consequence: >
    Omitting pointer-events: none renders the entire webpage unclickable even when blocks have scaleY: 0.
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Overlay Scaffold & CSS Architecture
STAGE 2: Navigation Interceptor & Life-Cycle Bridge
STAGE 3: Exit Animation Timeline (animateTransition)
STAGE 4: Entrance Reveal Timeline (revealTransition)
STAGE 5: State Reset & Edge Case Handling
```

---

## Phase 4: Skill Compilation

Below is the compiled operational agent skill package ready for deployment.

```
page-transition-gsap/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

### `page-transition-gsap/SKILL.md`

```markdown
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

---

## Phase 5: Verification & Quality Checklist

1. **Zero White Flash**: Verify clicking navigation smoothly covers the page and opens the target page without browser blanking.
2. **Back/Forward Cache (bfcache) Handling**: If pages are loaded via browser back/forward buttons, re-trigger the reveal by listening to `pageshow`:
   ```javascript
   window.addEventListener("pageshow", (event) => {
     if (event.persisted) {
       revealTransition().then(() => {
         gsap.set(".block", { visibility: "hidden" });
       });
     }
   });
   ```
```

---

### `page-transition-gsap/references/terminology.md`

```markdown
# Terminology

**Shutter Transition**:
A multi-element visual wipe where partitioned geometric blocks expand from or contract toward viewport bounds to conceal page navigation.
_Avoid_: page loader, preloader spinner, slide transition

**Navigation Interceptor**:
An event handler bound to anchor tags that suppresses default browser navigation (`event.preventDefault()`) to execute an asynchronous exit timeline.
_Avoid_: link blocker, route kill

**Transform Origin Split**:
The deliberate assignment of opposing anchor points (`top` vs. `bottom`) across adjacent layout rows to enforce mirrored directional motion during scale transforms.
_Avoid_: directional flip, alignment invert

**Staggered Grid Animation**:
Sequential animation delays applied across structured DOM element sets based on directional flow parameters (`start`, `center`, `end`, `axis: "x"`).
_Avoid_: delay chain, manual timeout loop
```

---

### `page-transition-gsap/references/examples.md`

```markdown
# Implementation Examples

## Example 1: Standard Dual-Row Shutter Transition

**Scenario**: Multi-page agency portfolio (`index.html`, `about.html`, `contact.html`) requiring a seamless black-and-white shutter wipe.

### HTML Structure (`index.html` & `about.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agency Home</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
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

  <nav class="nav">
    <a href="index.html" class="logo">STUDIO</a>
    <div class="nav-items">
      <a href="index.html">HOME</a>
      <a href="about.html">ABOUT</a>
    </div>
  </nav>

  <main>
    <div class="title">
      <h1>HOME</h1>
    </div>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

### CSS Styling (`style.css`)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #111111;
  color: #ffffff;
  font-family: monospace;
  overflow: hidden;
}

main {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title h1 {
  font-size: 10vw;
  font-weight: 900;
  text-transform: uppercase;
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}

nav a {
  color: #ffffff;
  text-decoration: none;
  font-size: 1.2rem;
  margin-left: 1.5rem;
}

.transitionContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 50;
  pointer-events: none;
}

.transition-row {
  display: flex;
  flex: 1;
}

.transition-row.row-1 .block {
  transform-origin: top;
}

.transition-row.row-2 .block {
  transform-origin: bottom;
}

.block {
  flex: 1;
  background-color: #ffffff;
  transform: scaleY(1);
  will-change: transform;
}
```

### Orchestration Script (`app.js`)
```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.set(".block", { visibility: "visible", scaleY: 1 });

  revealTransition().then(() => {
    gsap.set(".block", { visibility: "hidden" });
  });

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href === window.location.pathname) return;

      e.preventDefault();
      animateTransition().then(() => {
        window.location.href = href;
      });
    });
  });
});

function revealTransition() {
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    tl.fromTo(
      ".row-1 .block",
      { scaleY: 1 },
      {
        scaleY: 0,
        duration: 1,
        delay: 0.2,
        stagger: { each: 0.1, from: "start", grid: [1, 5], axis: "x" },
        ease: "expo.inOut"
      }
    ).fromTo(
      ".row-2 .block",
      { scaleY: 1 },
      {
        scaleY: 0,
        duration: 1,
        delay: 0.2,
        stagger: { each: 0.1, from: "start", grid: [1, 5], axis: "x" },
        ease: "expo.inOut"
      },
      "<"
    );
  });
}

function animateTransition() {
  return new Promise((resolve) => {
    gsap.set(".block", { visibility: "visible", scaleY: 0 });

    const tl = gsap.timeline({ onComplete: resolve });

    tl.fromTo(
      ".row-1 .block",
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1,
        delay: 0.2,
        stagger: { each: 0.1, from: "end", grid: [1, 5], axis: "x" },
        ease: "expo.out"
      }
    ).fromTo(
      ".row-2 .block",
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1,
        delay: 0.2,
        stagger: { each: 0.1, from: "end", grid: [1, 5], axis: "x" },
        ease: "expo.out"
      },
      "<"
    );
  });
}
```
```

---

## Phase 5: Validation

### Knowledge Spec Coverage Verification
- [x] **ku-001 (Shutter Transition Overlay)**: Fully encoded in Phase 1 & Phase 2.
- [x] **ku-002 (Navigation Interceptor)**: Fully operationalized in Phase 4.
- [x] **ku-003 (Promise-Wrapped Lifecycles)**: Implemented across Phase 3 & Phase 4.
- [x] **ku-004 (Opposing Transform Origins)**: Specified in Phase 2 with explicit CSS.
- [x] **ku-005, ku-006, ku-007 (Procedures)**: Transformed into step-by-step phases with completion criteria.
- [x] **ku-008 (Pointer Events & Z-Index Guard)**: Enforced as invariant in Phase 2.

### Scenario Walkthroughs
1. **User clicks an internal navigation link**: Intercepted → `animateTransition()` runs → blocks expand from `scaleY: 0` to `1` staggered → Promise resolves → `window.location.href` updates to target page.
2. **Target page finishes loading**: `DOMContentLoaded` sets blocks to `scaleY: 1` → `revealTransition()` runs → blocks contract from `scaleY: 1` to `0` staggered → blocks hidden with `visibility: hidden`.
3. **User clicks external link or hash anchor**: Guard check detects `#` or `_blank` → returns early → default browser navigation proceeds unimpeded.

---

## Delivery Summary

- **Skill directory**: `page-transition-gsap/` (includes `SKILL.md`, `references/terminology.md`, and `references/examples.md`).
- **Extracted Units**: 8 Knowledge Units across 4 categories (Concepts, Principles, Procedures, Constraints).
- **Key Capability Delivered**: Complete reusable MPA transition architecture eliminating page flash via Promise-synchronized GSAP shutter timelines.
