# GSAP Plugins Reference Guide

## 1. ScrollTrigger

### Registration
```javascript
gsap.registerPlugin(ScrollTrigger);
```

### Trigger Configuration Options

```javascript
ScrollTrigger.create({
  trigger: ".target-element",     // Element that triggers the viewport check
  scroller: window,              // Default is window
  start: "top 80%",              // [trigger top] hits [viewport 80% from top]
  end: "bottom 20%",             // [trigger bottom] hits [viewport 20% from top]
  toggleActions: "play pause resume reverse",
  // Action slots: onEnter, onLeave, onEnterBack, onLeaveBack
  // Options: "play", "pause", "resume", "reverse", "restart", "reset", "complete", "none"
  scrub: true,                   // true or numeric smoothing (e.g. 0.5, 1, 2)
  pin: true,                     // Boolean or selector to pin during scroll
  pinSpacing: true,              // Adds padding to push subsequent content
  anticipatePin: 1,              // Avoids slight jitter on fast scroll
  markers: false,                // Visual debug guides
  onUpdate: (self) => console.log("Progress:", self.progress.toFixed(2)),
  onToggle: (self) => console.log("Active state:", self.isActive)
});
```

---

## 2. ScrollToPlugin

### Registration
```javascript
gsap.registerPlugin(ScrollToPlugin);
```

### Syntax & Properties

```javascript
gsap.to(window, {
  duration: 1.2,
  ease: "power2.inOut",
  scrollTo: {
    y: "#pricing-section",       // Target selector, pixel offset (e.g. 500), or "max"
    x: 0,
    offsetY: 80,                 // Subtracts height (e.g. fixed header)
    offsetX: 0,
    autoKill: true               // Stops animation if user manually scrolls/touches
  }
});
```

---

## 3. ScrollSmoother

### Registration & Requirements
Requires `ScrollTrigger`. Must wrap page contents inside container elements.

```html
<div id="smooth-wrapper">
  <div id="smooth-content">
    <!-- Page Content -->
  </div>
</div>
```

```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 2,                     // Seconds to catch up to mouse wheel
  effects: true,                  // Enables data-speed & data-lag
  smoothTouch: 0.1,              // Smooth on touch devices (default false / 0)
  normalizeScroll: true          // Prevents mobile browser address bar jitter
});
```

### Declarative Parallax Attributes
Apply directly to HTML elements inside `#smooth-content`:
- `data-speed="0.5"`: Moves at half normal scroll speed (parallax background).
- `data-speed="1.5"`: Moves 1.5x faster than normal scroll (foreground rush).
- `data-lag="0.5"`: Adds 0.5 seconds of lazy catch-up smoothing to the specific element.

---

## 4. EasePack & Custom Eases

### Registration
```javascript
gsap.registerPlugin(EasePack, CustomEase);
```

### Visual Curves Reference
- **Bounce**: `"bounce.out"`, `"bounce.in"`, `"bounce.inOut"`
- **Elastic**: `"elastic.out(amplitude, period)"` (default `elastic.out(1, 0.3)`)
- **SlowMo**: `"slow(linearRatio, power, yoyoMode)"` (e.g. `"slow(0.7, 0.7, false)"`)
- **Rough**: `"rough({ template: power1.out, strength: 1, points: 20, randomize: true })"`
- **Steps**: `"steps(12)"` (stepped discrete transitions)
