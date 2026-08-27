# Compilation & Extraction Report: Dynamic Scroll Expansion with Lenis, GSAP & IntersectionObserver

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Video tutorial / Code walkthrough |
| **Title** | Dynamic Scroll-Driven Image & Layout Expansion with Lenis, GSAP ScrollTrigger & Intersection Observer |
| **Authority** | Frontend animation practitioner (recreating Awwwards "Site of the Day" Q Industrial interaction) |
| **Coverage** | Lenis smooth scroll setup, GSAP ScrollTrigger integration, dynamic layout calculation challenges, Intersection Observer API lifecycle management, CSS flexbox layout for expandable image cards. |

---

## Phase 2: Knowledge Spec (Intermediate Representation)

```yaml
- id: ku-001
  type: concept
  name: Lenis Smooth Scroll
  source: src-01, "00:21-00:26, 05:10-05:32"
  confidence: high
  definition: >
    A lightweight, modern smooth scrolling library for the web that normalizes scroll behavior across devices and provides hookable animation frames.
  attributes: [smooth-scrolling, RAF integration, ScrollTrigger compatibility]
  avoid_terms: [native scroll jank, heavy momentum libraries]

- id: ku-002
  type: principle
  name: Dynamic Layout vs Static ScrollTrigger Invalidation
  source: src-01, "00:27-00:36, 05:37-05:59"
  confidence: high
  statement: >
    Standard GSAP ScrollTriggers compute start/end trigger points on initial page load. When elements dynamically expand in height or width during scroll, static trigger markers drift and trigger prematurely or misalign.
  rationale: >
    Modifying element heights in real time alters DOM flow and total scroll height dynamically, requiring either constant recalculation or observer-driven deferred trigger attachment.
  applies_to: [ku-003, ku-005]

- id: ku-003
  type: principle
  name: Deferred ScrollTrigger via IntersectionObserver
  source: src-01, "05:56-06:03, 07:18-07:46, 09:10-09:20"
  confidence: high
  statement: >
    Instantiate GSAP ScrollTriggers only when the target component enters the viewport via an Intersection Observer, and unobserve the target once bound.
  rationale: >
    Prevents trigger calculation issues for off-screen elements that rely on dynamically modified layout heights, while avoiding redundant execution cycles.
  applies_to: [ku-005]

- id: ku-004
  type: procedure
  name: Lenis and GSAP Ticker Synchronization
  source: src-01, "06:03-06:44"
  confidence: high
  goal: Synchronize Lenis scroll updates with GSAP's internal ticker and ScrollTrigger updates.
  prerequisites: [Lenis and GSAP scripts loaded in DOM]
  steps:
    - action: Initialize Lenis instance (`new Lenis()`)
      criterion: Lenis instance created.
    - action: Bind `lenis.on('scroll', ScrollTrigger.update)`
      criterion: ScrollTrigger receives Lenis scroll events.
    - action: Bind GSAP ticker to Lenis RAF (`gsap.ticker.add((time) => lenis.raf(time * 1000))`)
      criterion: Smooth scroll renders on GSAP render loop.
    - action: Set `gsap.ticker.lagSmoothing(0)`
      criterion: Prevents frame jumps after scroll lags.
  outputs: [Synchronized smooth scrolling rendering loop]

- id: ku-005
  type: procedure
  name: Observer-Driven Dynamic Scroll Expansion
  source: src-01, "06:46-09:18"
  confidence: high
  goal: Dynamically expand image width and container height proportionally to scroll progress.
  prerequisites: [DOM ready, Lenis-GSAP ticker synced, target items selected]
  steps:
    - action: Query target service items into an array (`gsap.utils.toArray('.service')`)
      criterion: Array of target elements created.
    - action: Define `IntersectionObserver` with threshold (e.g., `0.1`)
      criterion: Threshold configured to trigger when 10% enters viewport.
    - action: Inside observer callback, attach `ScrollTrigger.create()` targeting item image and container
      criterion: ScrollTrigger scrub is bound with `onUpdate(self)` callback.
    - action: Interpolate width (`30% -> 100%`) and height (`150px -> 450px`) using `self.progress` in `gsap.to()`
      criterion: Image width expands to 100% and item height expands proportionally.
    - action: Unobserve element immediately after attaching ScrollTrigger
      criterion: Observer disconnects from element to prevent re-instantiation.
  outputs: [Dynamic scroll-driven expansion effect]
```

---

## Phase 3 & 4: Compiled Operational Skill

Below is the complete, compiled agent skill package structured according to the specification.

```
scroll-expand-animation/
├── SKILL.md
└── references/
    ├── terminology.md
    └── code-templates.md
```

### `scroll-expand-animation/SKILL.md`

```markdown
---
name: scroll-expand-animation
description: |
  Implement dynamic scroll-driven expanding layouts and smooth scrolling
  using Lenis, GSAP ScrollTrigger, and IntersectionObserver API.
  Triggers: dynamic scroll animation, expanding image on scroll,
  lenis gsap scrolltrigger, dynamic height scroll, interactive scroll expansion.
---

# Scroll Expand Animation

Implement performant, dynamic scroll-driven expansion where element heights and image widths expand smoothly based on scroll position without trigger-drift bugs.

## Core Principles

1. **Decouple Trigger Binding**: Do not bind ScrollTriggers across all dynamically expanding items upfront. Static trigger points drift when sibling items alter page height dynamically.
2. **Observe Before Triggering**: Use `IntersectionObserver` to detect when an item is within range, dynamically bind the `ScrollTrigger.create()` instance, and immediately unobserve the target.
3. **Synchronize Animation Loops**: Pipe Lenis smooth scroll updates directly into the GSAP ticker and set lag smoothing to `0` to prevent stutter.

---

## Workflow Phases

### Phase 1: DOM & Layout Architecture

Structure the page with bounding containers and flex-based expandable components.

1. Create parent container with three primary blocks: `Hero`, `Expandable Section (e.g., Services)`, and `Footer`.
2. Define a multi-column header (`col` flex distribution) above the list items.
3. Structure each expandable row item with two child blocks:
   - **Info block (`.service-info`)**: Text, titles, descriptions (flex column with `space-between`).
   - **Visual block (`.service-img`)**: Fixed initial width/height wrapper containing an image element (`overflow: hidden`, `border-radius`).
4. Set default initial dimensions in CSS:
   - Image wrapper width: `30%` (expands to `100%`).
   - Service item base height: `150px` (expands up to `450px`).
   - Images inside containers: `width: 100%`, `height: 100%`, `object-fit: cover`.

#### Completion Gate
- [ ] Section and item DOM markup matches standard schema.
- [ ] Base dimensions defined in CSS without hardcoded viewport breaks.

---

### Phase 2: Lenis Smooth Scroll Synchronization

Initialize Lenis and couple it with the GSAP ticker.

1. Ensure CSS includes Lenis scroll handling defaults (or `html.lenis` auto height).
2. Instantiate Lenis on `DOMContentLoaded`.
3. Link Lenis scroll listener to `ScrollTrigger.update`.
4. Add Lenis RAF handling to `gsap.ticker`.
5. Disable lag smoothing via `gsap.ticker.lagSmoothing(0)` to prevent frame skipping during intense scroll gestures.

For boilerplates and scripts, see [code-templates.md](references/code-templates.md).

#### Completion Gate
- [ ] Lenis drives the window scroll without competing with native momentum.
- [ ] GSAP ticker updates Lenis on every animation frame.

---

### Phase 3: Observer-Driven ScrollTrigger Binding

Bind dynamic scroll expansion using `IntersectionObserver`.

1. Collect target items using `gsap.utils.toArray('.service')`.
2. Define `observerOptions` with `root: null`, `rootMargin: '0px'`, and `threshold: 0.1` (triggers when 10% is visible).
3. In `observerCallback`:
   - Verify `entry.isIntersecting`.
   - Query the internal image container (`.service-img` / `.img`).
   - Create a `ScrollTrigger` for image width:
     - `trigger: service`
     - `start: "bottom bottom"`, `end: "top top"`
     - `scrub: true`
     - In `onUpdate(self)`: calculate `let newWidth = 30 + 70 * self.progress;` and apply `gsap.to(imgContainer, { width: newWidth + "%", duration: 0.1, ease: "none" })`.
   - Create a `ScrollTrigger` for container height:
     - `trigger: service`
     - `start: "top bottom"`, `end: "top top"`
     - `scrub: true`
     - In `onUpdate(self)`: calculate `let newHeight = 150 + 300 * self.progress;` and apply `gsap.to(service, { height: newHeight + "px", duration: 0.1, ease: "none" })`.
4. Call `observer.unobserve(entry.target)` immediately after attaching triggers to prevent duplicate bindings.
5. Loop through all items with `services.forEach(service => observer.observe(service))`.

For technical definitions and anti-patterns, see [terminology.md](references/terminology.md).

#### Completion Gate
- [ ] Elements only attach ScrollTriggers upon entering viewport threshold.
- [ ] Elements unobserve immediately after initialization.
- [ ] Width and height expand proportionally during scroll without jitter or drift.

---

## Validation & Verification

1. **Layout Integrity**: Ensure initial layout does not collapse before scroll.
2. **Scroll Direction Agnostic**: Scroll up and down repeatedly; verify width/height shrink and expand accurately according to `self.progress`.
3. **No Cumulative Trigger Drift**: Verify bottom items trigger at their exact viewport entry point regardless of how many preceding items expanded.
```

---

### `scroll-expand-animation/references/terminology.md`

```markdown
# Terminology

**Intersection Observer API**:
A native browser API providing asynchronous observation of the intersection of a target element with an ancestor element or top-level document viewport.
_Avoid_: window scroll listener, resize listener polling.

**ScrollTrigger Scrub**:
A GSAP feature that links animation progress directly to the scrollbar position, advancing or reversing animations smoothly with scrolling.
_Avoid_: scroll toggle, one-shot scroll trigger.

**Trigger Drift**:
The misalignment of computed trigger start/end positions caused by dynamic DOM height changes occurring above the trigger element after page load.
_Avoid_: scroll offset error, animation jump.

**Lag Smoothing**:
GSAP's mechanism to adjust rendering ticks when frame rates drop; must be zeroed when using smooth scroll libraries like Lenis to maintain strict 1:1 scroll synchronization.
_Avoid_: frame throttling, ticker delay.
```

---

### `scroll-expand-animation/references/code-templates.md`

```markdown
# Code Templates

## 1. HTML Layout

```html
<div class="container">
  <section class="hero"></section>
  <section class="services">
    <div class="services-header">
      <div class="col"></div>
      <div class="col"><h1>All Services</h1></div>
    </div>
    
    <!-- Repeatable Service Item -->
    <div class="service">
      <div class="service-info">
        <h1>Service Title</h1>
        <p>Service description content goes here.</p>
      </div>
      <div class="service-img">
        <div class="img">
          <img src="./assets/img1.jpg" alt="Service preview" />
        </div>
      </div>
    </div>
  </section>
  <section class="footer"></section>
</div>
```

## 2. JavaScript Engine Implementation

```javascript
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lenis & Sync with GSAP
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Select Elements & Define Observer
  const services = gsap.utils.toArray(".service");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const service = entry.target;
        const imgContainer = service.querySelector(".img");

        // Width Scrub Animation (30% -> 100%)
        ScrollTrigger.create({
          trigger: service,
          start: "bottom bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            let newWidth = 30 + 70 * self.progress;
            gsap.to(imgContainer, {
              width: `${newWidth}%`,
              duration: 0.1,
              ease: "none",
            });
          },
        });

        // Height Scrub Animation (150px -> 450px)
        ScrollTrigger.create({
          trigger: service,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            let newHeight = 150 + 300 * self.progress;
            gsap.to(service, {
              height: `${newHeight}px`,
              duration: 0.1,
              ease: "none",
            });
          },
        });

        // Clean up observer
        observer.unobserve(service);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  services.forEach((service) => observer.observe(service));
});
```
```

---

## Phase 5: Validation & Delivery

### Extraction Summary
- **Knowledge Units Extracted**: 5 (2 Concepts, 2 Principles, 2 Procedures, Architecture & Code Artifacts).
- **Core Problem Solved**: Resolves trigger drift when animating element dimensions dynamically during scroll by coupling `IntersectionObserver` lazy registration with GSAP `ScrollTrigger.create()` and Lenis smooth scrolling.

### Known Limitations
- Requires external script inclusions (`lenis.js`, `gsap.min.js`, `ScrollTrigger.min.js`).
- If an item starts fully within the initial viewport (e.g. above the fold without a hero), trigger calculations must adjust `start` parameters from `"bottom bottom"` to avoid initial jump.
