---
name: gsap-lenis-parallax
description: |
  Construct high-performance, scroll-driven interactive landing pages using GSAP ScrollTrigger
  and Lenis smooth scrolling. Use when creating animated portfolios, editorial pages, scroll-scrubbed
  typography, or image parallax experiences.
  Triggers: gsap scroll animation, lenis smooth scroll, scrolltrigger stagger, editorial scroll page,
  scroll rotation parallax, eat hungry tiger animation style.
---

# GSAP & Lenis Scroll-Driven Interface Builder

Build high-performance, frame-synchronized landing experiences with smooth momentum scrolling, staggered typography reveals, and scroll-linked element rotations.

## Ground Rules & Invariants
- **Ticker Synchronization**: Always bind Lenis to the browser `requestAnimationFrame` ticker.
- **Scroll Distance**: Any scroll-linked stage with absolute elements must declare explicit extended height (e.g., `min-height: 300vh+`) to provide the necessary DOM scroll travel.
- **Scrub Mapping**: Differentiate between text triggers (`scrub: true` for instant binding) and physical motion triggers (`scrub: 1` or higher for inertia).

For standard terminology and terms to avoid, consult [terminology.md](references/terminology.md).

---

## Phase 1: DOM Hierarchy & Layout Architecture

1. Construct the three primary page containers inside a semantic wrapper:
   - **Entry Viewport**: `height: 100vh;` for initial visual cue.
   - **Interactive Animation Canvas**: `position: relative; min-height: 330vh;` to host scroll-linked tweens.
   - **Exit Viewport**: `height: 100vh;` for closure.
2. Segment hero headings into inline child elements (`<span class="txt">...</span>`) to enable granular stagger triggers.
3. Encapsulate media items as absolute floating components containing a circular badge indicator, descriptive typography, and responsive media tags.

### Completion Gate
- [ ] Document reset applied (`margin: 0; padding: 0; box-sizing: border-box;`).
- [ ] Animated canvas container possesses `position: relative` and extended height (`min-height: 330vh`).
- [ ] Heading copy split into individual targetable `.txt` spans.

---

## Phase 2: Responsive Coordinates & Typography Styling

1. Apply full-viewport flex centering to entry/exit screens:
   ```css
   .page {
     width: 100%;
     height: 100vh;
     display: flex;
     align-items: center;
     justify-content: center;
   }
   ```
2. Style the segmented typography and assign responsive leading and font sizes using `em` or `vw`.
3. Anchor floating media cards across the viewport using staggered `vh`/`vw` coordinates:
   - Card 1: `top: 63vh; left: 55vw;`
   - Card 2: `top: 140vh; left: 0;` (or customized offset)
   - Card 3: `top: 230vh; left: 43vw;`
4. Set media constraints with `object-fit: cover;` and subtle `border-radius`.

### Completion Gate
- [ ] Media cards positioned via `position: absolute` with non-overlapping `vh` vertical anchors.
- [ ] Typography assigned `cubic-bezier` transitions for smooth CSS state changes.

---

## Phase 3: Smooth Scroll Runtime Setup (Lenis)

1. Load Lenis library (v1.x) via script tag or package dependency.
2. Instantiate Lenis with target duration inertia:
   ```javascript
   const lenis = new Lenis({
     duration: 2
   });
   ```
3. Establish the continuous `requestAnimationFrame` loop:
   ```javascript
   function raf(time) {
     lenis.raf(time);
     requestAnimationFrame(raf);
   }
   requestAnimationFrame(raf);
   ```

### Completion Gate
- [ ] Lenis instance initialized before GSAP execution.
- [ ] Recursive `requestAnimationFrame` loop active.

---

## Phase 4: ScrollTrigger Animation Binding

1. Load and verify GSAP core and the `ScrollTrigger` plugin.
2. Build the typography color stagger tween:
   ```javascript
   gsap.to(".txt", {
     color: "rgb(64, 32, 17)",
     stagger: 0.5,
     scrollTrigger: {
       trigger: ".title",
       start: "top 80%",
       end: "top 40%",
       scrub: true
     }
   });
   ```
3. Build the rotational parallax scrub tween for floating media cards:
   ```javascript
   gsap.from(".img", {
     rotation: 11,
     scrollTrigger: {
       trigger: ".img",
       start: "top 90%",
       end: "top -250%",
       scrub: 1
     }
   });
   ```

For complete boilerplate and working implementations, see [examples.md](references/examples.md).

### Completion Gate
- [ ] Text color transitions progressively based on viewport entry.
- [ ] Media cards rotate smoothly back to 0 degrees as scrolling progresses.
- [ ] All ScrollTrigger markers disabled in production mode.
