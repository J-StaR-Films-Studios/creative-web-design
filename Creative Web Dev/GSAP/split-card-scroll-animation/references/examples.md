# Examples & Implementation Reference

## Full Desktop ScrollTrigger Implementation

**Scenario**: 3-card split sequence with a 15:7 sliced hero graphic and sticky header.

```javascript
mm.add("(min-width: 1000px)", () => {
  let isGapAnimationCompleted = false;
  let isFlipAnimationCompleted = false;

  ScrollTrigger.create({
    trigger: ".sticky",
    start: "top top",
    end: () => "+=" + (window.innerHeight * 4) + "px",
    scrub: 1,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      const progress = self.progress;

      // 1. Header Animation (0.10 to 0.25)
      if (progress >= 0.1 && progress <= 0.25) {
        const headerProgress = gsap.utils.mapRange(0.1, 0.25, 0, 1, progress);
        const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
        const opacityValue = gsap.utils.mapRange(0, 1, 0, 1, headerProgress);
        gsap.set(stickyHeader, { y: yValue, opacity: opacityValue });
      } else if (progress < 0.1) {
        gsap.set(stickyHeader, { y: 40, opacity: 0 });
      } else if (progress > 0.25) {
        gsap.set(stickyHeader, { y: 0, opacity: 1 });
      }

      // 2. Container Width Scrub (0.00 to 0.25)
      if (progress <= 0.25) {
        const widthPercentage = gsap.utils.mapRange(0, 0.25, 75, 60, progress);
        gsap.set(cardContainer, { width: `${widthPercentage}%` });
      } else {
        gsap.set(cardContainer, { width: "60%" });
      }

      // 3. Gap & Border Radius Split (Threshold 0.35)
      if (progress >= 0.35 && !isGapAnimationCompleted) {
        gsap.to(cardContainer, { gap: "20px", duration: 0.5, ease: "power3.out" });
        gsap.to(["#card-1", "#card-2", "#card-3"], {
          borderRadius: "20px",
          duration: 0.5,
          ease: "power3.out",
        });
        isGapAnimationCompleted = true;
      } else if (progress < 0.35 && isGapAnimationCompleted) {
        gsap.to(cardContainer, { gap: "0px", duration: 0.5, ease: "power3.out" });
        gsap.to("#card-1", { borderRadius: "20px 0 0 20px", duration: 0.5, ease: "power3.out" });
        gsap.to("#card-2", { borderRadius: "0px", duration: 0.5, ease: "power3.out" });
        gsap.to("#card-3", { borderRadius: "0 20px 20px 0", duration: 0.5, ease: "power3.out" });
        isGapAnimationCompleted = false;
      }

      // 4. 3D Card Flip & Fan Out (Threshold 0.70)
      if (progress >= 0.7 && !isFlipAnimationCompleted) {
        gsap.to(".card", {
          rotationY: 180,
          duration: 0.75,
          ease: "power3.inOut",
          stagger: 0.1,
        });
        gsap.to(["#card-1", "#card-3"], {
          y: 30,
          rotationZ: (i) => [-15, 15][i],
          duration: 0.75,
          ease: "power3.inOut",
        });
        isFlipAnimationCompleted = true;
      } else if (progress < 0.7 && isFlipAnimationCompleted) {
        gsap.to(".card", {
          rotationY: 0,
          duration: 0.75,
          ease: "power3.inOut",
          stagger: -0.1,
        });
        gsap.to(["#card-1", "#card-3"], {
          y: 0,
          rotationZ: 0,
          duration: 0.75,
          ease: "power3.inOut",
        });
        isFlipAnimationCompleted = false;
      }
    },
  });
});
```
