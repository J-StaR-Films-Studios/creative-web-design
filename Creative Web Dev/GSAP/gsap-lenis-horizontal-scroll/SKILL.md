---
name: gsap-lenis-horizontal-scroll
description: |
  Implement high-performance smooth horizontal scroll galleries, showcases, and pinned card sections
  using GSAP ScrollTrigger and Lenis Smooth Scroll.
  Triggers: horizontal scroll, gsap horizontal, lenis smooth scroll, scrolltrigger pin gallery,
  horizontal showcase, smooth scroll card slider, lenis gsap integration.
---

# GSAP + Lenis Horizontal Smooth Scroll

Construct silky-smooth horizontal showcase sections inside vertically scrolling web layouts by synchronizing the Lenis smooth scroll engine with GSAP ScrollTrigger.

## Phase 1: Environment & Engine Coupling

Load core dependencies and synchronize the rendering ticker to prevent frame lag and jitter.

1. **Include Libraries**: Load Lenis CSS/JS along with GSAP Core and ScrollTrigger.
2. **Register Plugin**: Call `gsap.registerPlugin(ScrollTrigger)` inside `DOMContentLoaded`.
3. **Synchronize Ticker**: Pipe Lenis's requestAnimationFrame (RAF) into GSAP's ticker, update ScrollTrigger on scroll, and zero out lag smoothing.

```javascript
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

### Completion Gate
- [ ] Lenis CSS and JS CDN/packages imported.
- [ ] ScrollTrigger registered with GSAP.
- [ ] Lenis frame updates locked to `gsap.ticker`.
- [ ] `gsap.ticker.lagSmoothing(0)` active.

For complete CDN scripts and imports, see [code-snippets.md](references/code-snippets.md).

---

## Phase 2: Multi-Tier DOM & CSS Architecture

Build a three-tier DOM structure that isolates overflow masking, pinning context, and track translation.

```
[#horizontal-scroll]           <- Pin Container (vertical padding)
  └── [.horizontal-scroll-wrapper] <- Overflow Mask (overflow: hidden, fixed height)
        └── [.horizontal]            <- Flex Track (display: flex, padding-left)
              ├── [.card]
              ├── [.card]
              └── [.card]
```

1. **Suppress Native Horizontal Scroll**: Apply `overflow-x: hidden;` to `body`. Do not use global `overflow: hidden` on `body` as it blocks vertical scrolling.
2. **Pin Container (`#horizontal-scroll`)**: Set vertical padding (e.g. `160px 0`) to provide entrance and exit buffers.
3. **Overflow Mask (`.horizontal-scroll-wrapper`)**: Set `overflow: hidden;` and assign fixed viewport height (e.g. `55vh`).
4. **Flex Track (`.horizontal`)**: Set `display: flex; align-items: center; height: 100%;`. Add `padding-left: 45vw;` so the first card enters with aesthetic offset.
5. **Card Items (`.card`)**: Set fixed proportional dimensions (e.g. `width: 28vw;`) and horizontal margins/padding (`0 4vw`).

### Completion Gate
- [ ] `body` has `overflow-x: hidden`.
- [ ] 3-tier hierarchy built (`#horizontal-scroll` > `.horizontal-scroll-wrapper` > `.horizontal`).
- [ ] `.horizontal-scroll-wrapper` has `overflow: hidden`.
- [ ] Cards display in a single horizontal flex line extending beyond viewport width.

For domain terms and layout vocabulary, see [terminology.md](references/terminology.md).

---

## Phase 3: Dynamic ScrollTrigger Track Translation

Animate the flex track along the X-axis using dynamic functional expressions.

1. **Reference Track**: Query the track DOM element (`const track = document.querySelector(".horizontal")`).
2. **Define Translation Tween**: Create a `gsap.to(".horizontal", {...})` tween.
3. **Set Dynamic Distance**: Compute `x: () => -(track.scrollWidth - window.innerWidth)` to guarantee the track translates precisely until the final element docks.
4. **Configure ScrollTrigger**:
   - `trigger`: Set to `".horizontal"`.
   - `pin`: Set to outer parent `"#horizontal-scroll"`.
   - `start`: Set to `"center center"` (triggers when container center meets screen center).
   - `end`: Set dynamically via functional value `() => "+=" + track.scrollWidth`.
   - `scrub`: Set to `1` (or `true`) for direct momentum scrubbing.
   - `invalidateOnRefresh`: Set to `true` to recalculate values on viewport resize.

```javascript
const horizontalSection = document.querySelector(".horizontal");

gsap.to(".horizontal", {
  x: () => -(horizontalSection.scrollWidth - window.innerWidth),
  scrollTrigger: {
    trigger: ".horizontal",
    pin: "#horizontal-scroll",
    start: "center center",
    end: () => "+=" + horizontalSection.scrollWidth,
    scrub: 1,
    invalidateOnRefresh: true,
  }
});
```

### Completion Gate
- [ ] Outer section (`#horizontal-scroll`) pins securely during scroll.
- [ ] Track translates horizontally from right to left smoothly.
- [ ] End calculation matches full scroll width without cutting off cards.
- [ ] Layout dynamically adapts on window resize without refresh bugs.

---

## Phase 4: Micro-Interactions & Intro Choreography

Enhance visual fidelity with intro entrance timelines and per-card directional scroll reveals.

1. **Intro Hero Entrance**: Build a `gsap.timeline()` for load-time typography animations using `power4.out` / `power3.out` eases and negative timeline offsets.
2. **Per-Card Reveal Tweens**: Loop through all `.card` elements and assign a directional offset tween triggered when each card enters the viewport.

```javascript
document.querySelectorAll(".card").forEach((card) => {
  gsap.from(card, {
    x: 250,
    duration: 0.6,
    scrollTrigger: {
      trigger: card,
      start: "top bottom",
      toggleActions: "play none none reverse"
    }
  });
});
```

### Completion Gate
- [ ] Hero text reveals smoothly on page load.
- [ ] Cards animate inward smoothly as they enter the screen during horizontal scrub.
- [ ] Animations reverse cleanly when scrolling back upward.

For full worked layouts and production implementations, see [examples.md](references/examples.md).
