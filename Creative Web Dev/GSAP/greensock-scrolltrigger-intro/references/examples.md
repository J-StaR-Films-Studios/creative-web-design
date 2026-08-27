# Worked Examples

## 1. Slide-In Layered Panels (Stacking Effect)

**Scenario**: Stacking 4 full-screen colored panels on top of each other as the user scrolls down.

**Application**:
```javascript
const panels = gsap.utils.toArray(".panel");

panels.forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    start: "top top",
    pin: true,
    pinSpacing: false
  });
});
```

**Outcome**: Each panel sticks to the top of the viewport and gets covered by the subsequent panel.

---

## 2. Horizontal Snapping Section

**Scenario**: Translating vertical page scroll into horizontal card translation that snaps cleanly to panel edges.

**Application**:
```javascript
const sections = gsap.utils.toArray(".horizontal-panel");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-container",
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector(".horizontal-container").offsetWidth
  }
});
```

**Outcome**: Vertical scrolling smoothly scrubs the horizontal translation and snaps to each section cleanly upon release.

---

## 3. Before / After Image Reveal with Pin

**Scenario**: Revealing a comparison image underneath a green-screen overlay as the user scrolls.

**Application**:
```javascript
gsap.to(".reveal-mask", {
  width: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: ".comparison-container",
    start: "top top",
    end: "+=1000",
    scrub: true,
    pin: true,
    anticipatePin: 1
  }
});
```

**Outcome**: The container locks at the top of the viewport for 1000px of scrolling while the mask expands proportionally.
