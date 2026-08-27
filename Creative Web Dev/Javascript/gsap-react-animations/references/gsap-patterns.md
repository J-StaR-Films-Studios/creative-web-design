# GSAP Production Patterns & Code Recipes

## Pattern 1: Infinite Modular Slider via Remainder Operator

Use the modulo / remainder operator `%` to create looping sliders without state bounds:

```javascript
const goToSlide = (index) => {
  // Safe circular index calculation
  const newIndex = ((index % totalItems) + totalItems) % totalItems;
  setCurrentIndex(newIndex);
};

// Auto re-run animation on dependency change
useGSAP(() => {
  gsap.fromTo(
    '.slider-image',
    { opacity: 0, xPercent: -100 },
    { opacity: 1, xPercent: 0, duration: 1, ease: 'power1.inOut' }
  );
  gsap.fromTo(
    '.slider-title',
    { opacity: 0, yPercent: 100 },
    { opacity: 1, yPercent: 0, duration: 1, ease: 'power1.inOut' }
  );
}, { scope: containerRef, dependencies: [currentIndex] });
```

---

## Pattern 2: Position Offsets and Relative Timing in Timelines

Control tween overlap and synchronization with position parameters:

```javascript
const tl = gsap.timeline();

tl.to('#box1', { x: 200, duration: 1 })
  // Start at the exact same time as #box1
  .to('#box2', { y: 200, duration: 1 }, '<')
  // Start 0.5s before previous tween ends
  .to('#box3', { scale: 1.5, duration: 1 }, '-=0.5')
  // Absolute timestamp (at 3 seconds)
  .to('#box4', { opacity: 0, duration: 1 }, 3);
```

---

## Pattern 3: Array Conversion & DOM Target Extraction

Convert React child refs or NodeLists into GSAP-compatible arrays:

```javascript
useGSAP(() => {
  const boxArray = gsap.utils.toArray(containerRef.current.children);

  boxArray.forEach((box, index) => {
    gsap.to(box, {
      x: 150 * (index + 1),
      rotation: 360,
      scrollTrigger: {
        trigger: box,
        start: 'bottom bottom',
        end: 'top 20%',
        scrub: true
      }
    });
  });
}, { scope: containerRef });
```

---

## Pattern 4: Responsive Parallax Dual-Asset Scroll

```javascript
useGSAP(() => {
  const isMobile = window.innerWidth < 768;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#footer-contact',
      start: isMobile ? 'top 80%' : 'top center',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  tl.to('#f-right-leaf', { y: -50, duration: 1, ease: 'power1.inOut' })
    .to('#f-left-leaf', { y: 50, duration: 1, ease: 'power1.inOut' }, '<');
}, { scope: containerRef });
```
