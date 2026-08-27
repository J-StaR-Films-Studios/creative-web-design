# ScrollSmoother Examples

## Example 1: Standard Smooth Scroll with Speed & Lag

### Scenario
An agency portfolio page requiring smooth scroll, differential box speeds, and staggered lag effect.

### HTML
```html
<div id="smooth-wrapper">
  <div id="smooth-content">
    <header class="hero"><h1>Agency Showcase</h1></header>
    <div class="box-grid">
      <div class="box" data-speed="1.5">Fast</div>
      <div class="box" data-speed="1" data-lag="0.3">Normal + Lag</div>
      <div class="box" data-speed="0.5">Slow</div>
    </div>
  </div>
</div>
```

### JavaScript
```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 2,
  effects: true
});
```

---

## Example 2: Automatic Parallax Images (`speed: "auto"`)

### Scenario
Editorial layout featuring full-width images that seamlessly shift inside their containers.

### CSS
```css
.image-container {
  position: relative;
  height: 400px;
  overflow: hidden;
  margin: 4rem 0;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 160%;
  object-fit: cover;
}
```

### JavaScript
```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.5,
  effects: true
});

smoother.effects(".image-container img", { speed: "auto" });
```

---

## Example 3: Modal Pause and Velocity-Driven Skew

### Scenario
Interactive product gallery where scrolling skews cards proportionally to velocity, and smooth scrolling freezes when an inquiry modal opens.

### JavaScript
```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const skewSetter = gsap.quickTo(".product-card", "skewY");
const clamp = gsap.utils.clamp(-20, 20);

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 2,
  onUpdate: (self) => {
    skewSetter(clamp(self.getVelocity() / -50));
  },
  onStop: () => {
    skewSetter(0);
  }
});

// Modal toggle
const modalBtn = document.querySelector("#open-modal");
const closeBtn = document.querySelector("#close-modal");
const modal = document.querySelector(".modal");

modalBtn.addEventListener("click", () => {
  modal.classList.add("visible");
  smoother.paused(true);
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("visible");
  smoother.paused(false);
});
```
