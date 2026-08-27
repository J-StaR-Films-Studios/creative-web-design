---
name: horizontal-smooth-scroll
description: |
  Implement high-performance, smooth, responsive horizontal scrolling sections using GSAP, ScrollTrigger, and Lenis.
  Triggers: horizontal scroll, horizontal gallery, gsap horizontal scroll, lenis horizontal scroll, scrolltrigger pin gallery, scroll progress counter.
---

# Horizontal Smooth Scroll with GSAP, ScrollTrigger & Lenis

Construct responsive horizontal scroll containers driven by vertical page scroll with momentum smoothing and progress tracking.

For domain definitions, see [terminology.md](references/terminology.md).
For complete reference code and templates, see [examples.md](references/examples.md).

## Phase 1: DOM & CSS Layout Setup

Establish the structural foundation preventing native scroll collisions.

1. **Contain page overflow**: Set `overflow-x: hidden` on `html, body`.
2. **Fix static overlay elements**: Position brand headers, permanent navigation, and progress meters using `position: fixed; z-index: >10`.
3. **Configure the trigger section**: Set the outer section (`.scroll-section`) to `width: 100%; height: 100vh; overflow: hidden; position: relative;`.
4. **Create the flexible track**: Set the inner container (`.scroll-container`) to:
   - `display: flex;`
   - `width: fit-content;`
   - `align-items: flex-end;` (or centered based on design)
   - `height: 100%;`

### Completion Gate
- [ ] Outer section strictly occupies 100vh without page overflow.
- [ ] Inner track expands horizontally to fit all child items.
- [ ] No native horizontal scrollbars are visible.

---

## Phase 2: Lenis Smooth Scroll Bridge

Synchronize Lenis momentum scrolling with GSAP's rendering engine inside `DOMContentLoaded`.

1. **Initialize Lenis**:
   ```javascript
   const lenis = new Lenis();
   ```
2. **Hook ScrollTrigger updates**:
   ```javascript
   lenis.on('scroll', ScrollTrigger.update);
   ```
3. **Drive Lenis through GSAP ticker**:
   ```javascript
   gsap.ticker.add((time) => {
     lenis.raf(time * 1000);
   });
   gsap.ticker.lagSmoothing(0);
   ```

### Completion Gate
- [ ] Lenis drives smooth vertical scroll.
- [ ] GSAP ticker passes high-resolution delta time to Lenis.
- [ ] `lagSmoothing` is disabled to prevent animation snapping on tab switch.

---

## Phase 3: Dynamic Scroll Calculations

Compute translation boundaries dynamically to maintain responsiveness across all viewport sizes.

1. **Calculate scroll clearance**:
   Measure total track width minus visible window width:
   ```javascript
   function getScrollAmount() {
     const scrollWidth = scrollContainer.scrollWidth;
     const windowWidth = window.innerWidth;
     return -(scrollWidth - windowWidth);
   }
   ```
2. **Guard against short content**: If `scrollContainer.scrollWidth <= window.innerWidth`, translation distance is `0`.

### Completion Gate
- [ ] Scroll amount returns a negative number matching remaining unviewed track width.
- [ ] Calculation is enclosed in a callable function (not evaluated once statically).

---

## Phase 4: ScrollTrigger Pinning & Scrub Animation

Bind horizontal translation to vertical scroll progression.

1. **Create the GSAP tween**:
   ```javascript
   gsap.to(scrollContainer, {
     x: getScrollAmount,
     ease: "none",
     scrollTrigger: {
       trigger: section,
       pin: true,
       start: "top top",
       end: () => `+=${-getScrollAmount()}`,
       scrub: true,
       invalidateOnRefresh: true,
       onUpdate: (self) => {
         const percent = (self.progress * 100).toFixed(0).padStart(2, '0');
         progressAmount.textContent = `(${percent}%)`;
       }
     }
   });
   ```

### Completion Gate
- [ ] `pin: true` locks the section when its top reaches the viewport top.
- [ ] `scrub: true` synchronizes container translation with the scroll position.
- [ ] `invalidateOnRefresh: true` recalculates dimensions on window resize.
- [ ] Progress counter updates from `(00%)` to `(100%)`.
