# GSAP & Lenis Scroll Recipes

## 1. Lenis + GSAP Ticker Connection
```javascript
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

## 2. Linear Interpolation via `mapRange`
Convert sub-progress ranges to bounded CSS values:
```javascript
// Map progress from [0.10, 0.25] down to [40px, 0px]
const yOffset = gsap.utils.mapRange(0.10, 0.25, 40, 0, currentProgress);
```

## 3. Debounced Trigger Recalculation
Prevent layout shift bugs during window resize:
```javascript
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initAnimations();
  }, 250);
});
```
