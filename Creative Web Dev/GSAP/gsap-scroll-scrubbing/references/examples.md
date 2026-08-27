# Worked Examples & Case Studies

## 1. 3D Product Package Rotation (TakeBoost Pattern)

**Scenario**: An e-commerce landing page where a supplement bottle rotates 360 degrees as the user scrolls, revealing nutritional facts and branding without forcing a 3D canvas reload.

**Implementation**:
```javascript
gsap.to(".product-bottle", {
  rotationY: 360,
  scrollTrigger: {
    trigger: ".product-section",
    start: "top 75%",
    end: "bottom 25%",
    scrub: 1.2
  }
});
```

**Outcome**: The user controls product inspection speed via natural scroll speed.
**Key Lesson**: Using a moderate numeric scrub (`1.2s`) softens abrupt wheel ticks into continuous rotation.

---

## 2. Interactive Viewport Framing & Media Zoom (Google Pixel 5 Pattern)

**Scenario**: A hardware presentation where a phone model enters the frame, tilts to show edge details, and expands a video screen into full focus.

**Implementation**:
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".device-showcase",
    start: "top top",
    end: "+=1500",
    scrub: 0.8,
    pin: true
  }
});

tl.to(".phone-chassis", { rotation: -15, scale: 1.1 })
  .to(".screen-content", { scale: 1.8 }, "<");
```

**Outcome**: Pinning the section while scrubbing creates a guided, cinematic vignette that stays anchored during playback.
**Key Lesson**: Timeline scrubbing maintains precise choreography across multiple sub-properties simultaneously.

---

## 3. Persistent Narrative Path Guide (Bubbl Digital Pattern)

**Scenario**: An agency site where a branded graphic asset (e.g., an animated bubble) traverses the entire page height, interacting with section headings and icons along the way.

**Implementation**:
```javascript
gsap.to(".floating-bubble", {
  y: "400vh",
  x: "random(-50, 50)",
  scale: 1.5,
  scrollTrigger: {
    trigger: ".page-wrapper",
    start: "top top",
    end: "bottom bottom",
    scrub: 2.0
  }
});
```

**Outcome**: The bubble acts as a physical scroll progress tracker, unifying multi-section layouts.
**Key Lesson**: Higher scrub values (`2.0s+`) generate buoyant, physics-like follow-through.
