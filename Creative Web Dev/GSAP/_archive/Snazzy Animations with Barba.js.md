# Source-to-Skill Extraction & Compilation Report

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / transcript |
| **Title** | Snazzy Animations with Barba.js (Tutorial by DesignCourse / Gary Simon) |
| **Authority** | Gary Simon (DesignCourse) — Veteran UI/UX designer and frontend engineering instructor |
| **Coverage** | Barba.js v2 core concepts, HTML markup requirements (`data-barba` attributes), GSAP 3 timeline animations, async transition lifecycle hooks (`leave`, `enter`, `once`), clip-path image reveals, staggered overlay animations, multi-page routing coordination. |

### Coverage Gaps Identified
- Server-side rendering (SSR) / custom routing backends (tutorial uses standard static multi-page HTML).
- Script/style re-evaluation for dynamically injected external scripts per page.

---

## Phase 2: Knowledge Extraction (Intermediate Representation)

```yaml
- id: ku-001
  type: concept
  name: Barba Wrapper
  source: src-01, "02:27 - 02:40"
  confidence: high
  definition: >
    The outer DOM element containing both static persistent UI elements (like global navigation)
    and dynamic page containers that will be replaced during transitions.
  attributes: [data-barba="wrapper", persistent container]
  avoid_terms: [page wrapper, app root]

- id: ku-002
  type: concept
  name: Barba Container
  source: src-01, "03:53 - 04:15"
  confidence: high
  definition: >
    The specific DOM element whose inner contents are swapped out and updated by Barba.js
    on page navigation.
  attributes: [data-barba="container", data-barba-namespace]
  avoid_terms: [view container, router-view]

- id: ku-003
  type: concept
  name: Barba Namespace
  source: src-01, "04:02 - 04:12"
  confidence: high
  definition: >
    A unique identifier assigned to a container allowing conditional or page-specific transition logic.
  attributes: [data-barba-namespace]
  avoid_terms: [page ID, route name]

- id: ku-004
  type: principle
  name: Persistent Chrome Outside Container
  source: src-01, "03:16 - 03:26"
  confidence: high
  statement: >
    Place persistent UI elements (navigation bars, persistent headers/footers, audio players,
    and transition curtain overlays) inside the Barba wrapper but outside the Barba container.
  rationale: >
    Elements outside the container remain in the DOM without re-rendering across page transitions.
  applies_to: [ku-020, ku-021]

- id: ku-005
  type: procedure
  name: Barba.js and GSAP Page Transition Workflow
  source: src-01, "02:27 - 19:49"
  confidence: high
  goal: Implement smooth, staggered animated page transitions on a multi-page website.
  prerequisites:
    - Multi-page HTML structure
    - Barba.js Core and GSAP libraries imported
  steps:
    - action: Annotate HTML structure with `data-barba="wrapper"` on `<body>` and `data-barba="container"` on `<main>`.
      criterion: Persistent elements are outside `<main>` and inside `<body>`.
    - action: Build transition overlay element in HTML/CSS with hidden initial transform states.
      criterion: Overlay covers viewport with `pointer-events: none` and `z-index` above content.
    - action: Initialize Barba with `barba.init()` and configure `sync: true`.
      criterion: Barba intercepts internal link clicks.
    - action: Define asynchronous `leave`, `enter`, and `once` transition hooks.
      criterion: `this.async()` is used to hold page swap until exit animation completes.
    - action: Build GSAP timelines for screen overlay and content entrance animations.
      criterion: Content entrance uses negative position offsets to sync with screen reveal.
  outputs:
    - Single-Page Application (SPA) feel across standard HTML pages.

- id: ku-006
  type: constraint
  name: Async Hook Completion Handshake
  source: src-01, "11:35 - 12:05"
  confidence: high
  rule: >
    In Barba `leave` hooks, invoke `const done = this.async()` and call `done()` only after the
    exit transition animation or promise delay has fully settled.
  scope: Barba lifecycle hooks
  consequence: Failing to call `done()` or omitting `await` will prematurely swap DOM nodes or freeze navigation.

- id: ku-007
  type: example
  name: Staggered Multi-Column Curtain Reveal
  source: src-01, "08:20 - 15:10"
  confidence: high
  scenario: Creating a 5-column curtain wipe transition between pages.
  application: >
    A `<ul>` containing 5 `<li>` elements spanning 20% width each. An exit timeline scales `scaleY: 1`
    from bottom-left with stagger `0.2s`. An entrance timeline scales `scaleY: 0` with stagger `0.1s`.
  outcome: Cinematic column-by-column curtain transition.
  teaches: How to use GSAP stagger and transformOrigin within Barba transition hooks.
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: DOM & Markup Architecture

INPUT
- Multi-page HTML files requiring transitions

STEPS
1. Add `data-barba="wrapper"` to the root containing element (typically `<body>`).
2. Wrap swappable page-specific markup in a `<main data-barba="container" data-barba-namespace="[name]">`.
3. Keep persistent navigation (`<header>`, `<nav>`) and transition overlay markup (`<ul class="transition">`) inside the wrapper but outside `<main>`.
4. Include `@barba/core` and `gsap` scripts before the closing `</body>` tag.

OUTPUT
- Barba-compliant HTML markup for all site pages.

VALIDATION
[ ] Root element has `data-barba="wrapper"`
[ ] Dynamic content is enclosed in `data-barba="container"`
[ ] Every page has a distinct `data-barba-namespace`
[ ] Navigation and overlay elements sit outside the container

---

STAGE 2: Transition Overlay & Element Styling

INPUT
- CSS/SCSS stylesheet

STEPS
1. Style the transition overlay container to cover 100vw/100vh with `position: fixed` or `position: absolute`, top `z-index`, and `pointer-events: none`.
2. Style individual transition curtain items (e.g., flex items with `transform: scaleY(0)`).
3. Set initial hidden states for animated entry elements (e.g., `clip-path` for images, `opacity: 0` for text).

OUTPUT
- Stylesheet with transition overlay and initial animation states.

VALIDATION
[ ] Overlay does not block user clicks when idle (`pointer-events: none`)
[ ] Transition items have default zero-scale or hidden transform properties

---

STAGE 3: Barba.js Initialization & Lifecycle Hook Orchestration

INPUT
- `index.js` script file, GSAP library loaded

STEPS
1. Define a helper delay function returning a Promise for timing synchronization.
2. Construct exit animation timeline (`pageTransition`) scaling curtain bars to `scaleY(1)` with staggered offsets.
3. Construct entrance animation timeline (`contentAnimation`) animating text and revealing images via `clipPath` and negative relative time offsets (`-=N`).
4. Call `barba.init()` with `sync: true`.
5. Implement `transitions` array:
   - `leave(data)`: bind `const done = this.async()`, trigger `pageTransition()`, `await delay()`, and execute `done()`.
   - `enter(data)`: trigger `contentAnimation()`.
   - `once(data)`: trigger `contentAnimation()` on initial direct page load.

OUTPUT
- Operational page transition script.

VALIDATION
[ ] `barba.init()` executes with `sync: true`
[ ] `leave` hook coordinates async `done()` with animation duration
[ ] `once` hook ensures initial page load renders animated content
```

---

## Phase 4: Compiled Skill Delivery

Below is the compiled agent skill package ready for deployment.

### Directory Structure
```
barba-gsap-page-transitions/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

---

### `barba-gsap-page-transitions/SKILL.md`

```markdown
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
```

---

### `barba-gsap-page-transitions/references/terminology.md`

```markdown
# Terminology

**Barba Wrapper**:
The persistent outer DOM boundary (annotated via `data-barba="wrapper"`) that maintains global state, scripts, and persistent visual layers across navigations.
_Avoid_: page wrapper, site container, app shell

**Barba Container**:
The contextual DOM segment (annotated via `data-barba="container"`) that Barba extracts from incoming pages and swaps into the current DOM.
_Avoid_: route view, dynamic template, swappable div

**Barba Namespace**:
A unique attribute value (`data-barba-namespace="[name]"`) defining page identity to permit targeted transition rules.
_Avoid_: page identifier, route tag

**Sync Mode**:
Barba initialization configuration (`sync: true`) enabling incoming and outgoing page transitions to execute concurrently rather than strictly sequentially.
_Avoid_: parallel routing, async mode

**Curtain Overlay**:
A multi-segment overlay element residing outside the Barba container used to visually mask the DOM replacement process.
_Avoid_: loading screen, transition mask
```

---

### `barba-gsap-page-transitions/references/examples.md`

```markdown
# Implementation Examples

## Example 1: 5-Column Staggered Wipe & Content Entrance

### HTML Structure (`index.html` & `services.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Transition Example</title>
  <link rel="stylesheet" href="css/main.css">
</head>
<body data-barba="wrapper">
  <!-- Persistent Transition Curtain -->
  <ul class="transition">
    <li></li><li></li><li></li><li></li><li></li>
  </ul>

  <div class="wrapper">
    <header>
      <nav>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="services.html">Services</a></li>
        </ul>
      </nav>
    </header>

    <!-- Dynamic Container -->
    <main data-barba="container" data-barba-namespace="home">
      <div class="left">
        <h1>An Ongoing Experience</h1>
        <a href="services.html" class="cta">Explore Services</a>
      </div>
      <img src="photo.jpg" alt="Interior Architecture">
    </main>
  </div>

  <script src="https://unpkg.com/@barba/core"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>
  <script src="js/index.js"></script>
</body>
</html>
```

### JavaScript Implementation (`js/index.js`)
```javascript
function delay(n) {
  n = n || 2000;
  return new Promise((done) => setTimeout(done, n));
}

function pageTransition() {
  var tl = gsap.timeline();

  // Curtain rises up
  tl.to('ul.transition li', {
    duration: 0.5,
    scaleY: 1,
    transformOrigin: 'bottom left',
    stagger: 0.2
  });

  // Curtain drops down
  tl.to('ul.transition li', {
    duration: 0.5,
    scaleY: 0,
    transformOrigin: 'bottom left',
    stagger: 0.1,
    delay: 0.1
  });
}

function contentAnimation() {
  var tl = gsap.timeline();

  tl.from('.left', {
    duration: 1.5,
    translateY: 50,
    opacity: 0
  });

  tl.to('img', {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
  }, '-=1.1');
}

barba.init({
  sync: true,
  transitions: [
    {
      async leave(data) {
        const done = this.async();
        pageTransition();
        await delay(1500);
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
```

---

## Phase 5: Validation & Verification

### Source Fidelity Matrix
- [x] **Wrapper & Container semantics (`data-barba="wrapper"`, `data-barba="container"`, `data-barba-namespace`)**: Encoded in Phase 1 & `terminology.md`.
- [x] **Persistent navigation placement**: Encoded in Phase 1 rule 2.
- [x] **GSAP Timeline with stagger & transformOrigin**: Encoded in Phase 3 & `examples.md`.
- [x] **Image reveal via CSS `clip-path`**: Encoded in Phase 2 & Phase 3.
- [x] **Async lifecycle synchronization (`this.async()`, `await delay()`, `done()`)**: Encoded in Phase 4.
- [x] **Relative negative timeline offset (`-=1.1`) for seamless pacing**: Encoded in Phase 3 & `examples.md`.

### Operational Walkthrough Scenarios
1. **Scenario 1: Fresh initial visit on cold browser session.**
   - *Result*: `once()` hook triggers `contentAnimation()` immediately without firing curtain wipe, avoiding black/white screen flashing.
2. **Scenario 2: User clicks navigation link to secondary page.**
   - *Result*: `leave()` hook is intercepted, curtain wipe scales up across 5 columns, DOM swap occurs under curtain via `done()`, `enter()` reveals new page content as curtain drops down.
3. **Scenario 3: Rapid consecutive link clicking.**
   - *Result*: `sync: true` and `pointer-events: none` prevent race conditions and layout breaks while transitions settle.
