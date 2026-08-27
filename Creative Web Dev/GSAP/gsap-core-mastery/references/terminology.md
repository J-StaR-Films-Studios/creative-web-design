# Terminology & Property Shorthands

## Domain Concepts

**Tween**:
The interpolation of numeric and color values of an object over time.
_Avoid_: frame loop, CSS animation

**Timeline**:
A container that manages the scheduling and relative playback of multiple tweens.
_Avoid_: timeout chain, delay calculator

**ScrollTrigger**:
The plugin controlling tween playback and pinning relative to scroll position.
_Avoid_: scroll listener, intersection wrapper

**ScrollSmoother**:
An inertial scroll wrapper providing smooth momentum scrolling and declarative parallax.
_Avoid_: virtual scroll, smooth wheel hack

**Scrub**:
Linking the playhead of an animation directly to the scrollbar position.
_Avoid_: scroll binding, scroll listener sync

**Pin**:
Locking an element to a fixed viewport position while the user continues to scroll through a defined distance.
_Avoid_: position fixed switch, sticky fallback

---

## GSAP Transform & Property Shorthands

Always use GSAP shorthands instead of raw CSS transform strings:

| CSS Property / Transform | GSAP Shorthand | Example Usage |
|---|---|---|
| `transform: translateX(100px)` | `x` | `x: 100` or `x: "50%"` |
| `transform: translateY(100px)` | `y` | `y: -200` or `y: "100%"` |
| `transform: translateX(50%)` | `xPercent` | `xPercent: 50` |
| `transform: translateY(50%)` | `yPercent` | `yPercent: -50` |
| `transform: scale(1.5)` | `scale` | `scale: 1.5` |
| `transform: scaleX(2)` | `scaleX` | `scaleX: 2` |
| `transform: scaleY(2)` | `scaleY` | `scaleY: 2` |
| `transform: rotate(90deg)` | `rotation` / `rotate` | `rotation: 90` or `rotation: "1.5rad"` |
| `transform: skewX(30deg)` | `skewX` | `skewX: 30` |
| `transform: skewY(30deg)` | `skewY` | `skewY: 30` |
| `transform-origin: 50% 50%` | `transformOrigin` | `transformOrigin: "center center"` |
| `opacity: 0` + `visibility: hidden` | `autoAlpha` | `autoAlpha: 0` (efficiently toggles visibility) |
| `clip-path: polygon(...)` | `clipPath` | `clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"` |
| `background-color: #fff` | `backgroundColor` | `backgroundColor: "#ffffff"` |
