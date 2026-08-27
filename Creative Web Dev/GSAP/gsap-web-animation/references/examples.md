# GSAP Code Examples

## 1. Explicit State Interpolation (`fromTo`)

**Scenario**: Entrance animation for an element arriving from offscreen left with custom easing, looping with yoyo.

```javascript
gsap.fromTo(
  ".ball",
  {
    x: -600,
    backgroundColor: "green"
  },
  {
    x: 500,
    backgroundColor: "orange",
    duration: 3,
    ease: "power4.inOut",
    repeat: -1,
    yoyo: true
  }
);
```

---

## 2. Multi-Element Stagger with Continuous Rotation

**Scenario**: Stagger four card/box elements sequentially while rotating and pulsing scale.

```javascript
gsap.to(".card", {
  rotation: 360,
  scale: 1.2,
  duration: 1.5,
  stagger: 0.2,
  repeat: -1,
  yoyo: true,
  ease: "power2.inOut"
});
```

---

## 3. Chained Hero Section Timeline

**Scenario**: Sequential entrance of hero title, paragraph text, and call-to-action button upon page load.

```javascript
const heroTl = gsap.timeline({
  defaults: { duration: 1.2, ease: "power3.out" }
});

heroTl
  .from(".hero-title", { x: -150, opacity: 0 })
  .from(".hero-description", { x: 150, opacity: 0 }, "-=0.4")
  .from(".hero-cta", { y: 40, opacity: 0 }, "-=0.2");
```

---

## 4. ScrollTrigger with Pinning and Scrubbing

**Scenario**: Fix an element in place during scroll while four indicators translate across the screen smoothly.

```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to(".indicator-ball", {
  x: 0,
  duration: 2,
  stagger: 0.5,
  scrollTrigger: {
    trigger: ".section-container",
    start: "top 80%",
    end: "top 20%",
    scrub: 1.5,
    pin: true,
    pinSpacing: true,
    markers: false
  }
});
```
