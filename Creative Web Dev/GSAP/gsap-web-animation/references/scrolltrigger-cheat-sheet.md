# ScrollTrigger Cheat Sheet

## Syntax Matrix

```javascript
gsap.to(".target", {
  x: 500,
  scrollTrigger: {
    trigger: ".container",       // Element that triggers the animation
    start: "top 80%",            // [trigger-edge, viewport-edge]
    end: "bottom 20%",           // [trigger-edge, viewport-edge]
    toggleActions: "play pause resume reset", // onEnter onLeave onEnterBack onLeaveBack
    scrub: 1,                    // true or seconds for smooth scrubbing
    pin: true,                   // Pin element during trigger active duration
    pinSpacing: true,            // Add padding so following elements don't overlap
    markers: true                // Show visual start/end indicator lines (debug only)
  }
});
```

## ToggleActions Keywords

`toggleActions: "1 2 3 4"` accepts 4 space-separated states:

| Position | Event | Typical
