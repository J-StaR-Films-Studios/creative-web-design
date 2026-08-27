# Worked Examples

## Example 1: Standard Horizontal Showcase Implementation

**Scenario**: A portfolio showcase requiring a pinned 6-card horizontal gallery between a hero and footer section.

**JavaScript Setup**:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Initialize & Sync Lenis
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Intro Animation Timeline
  const tl = gsap.timeline();
  tl.from(".intro .heading", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out"
  })
  .from(".intro .content p", {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  }, "-=0.8");

  // 3. Pinned Horizontal Track Translation
  const horizontalSection = document.querySelector(".horizontal");
  gsap.to(".horizontal", {
    x: () => -(horizontalSection.scrollWidth - window.innerWidth),
    scrollTrigger: {
      trigger: ".horizontal",
      pin: "#horizontal-scroll",
      start: "center center",
      end: () => "+=" + horizontalSection.scrollWidth,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  // 4. Individual Card Reveal Transitions
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
});
```

**Outcome**:
- Inertial smooth scrolling across the entire page.
- Clean hero animation on load.
- Pinning occurs seamlessly when the gallery enters view.
- Track scrolls horizontally based on user scroll velocity and unpins as soon as the final card aligns.
