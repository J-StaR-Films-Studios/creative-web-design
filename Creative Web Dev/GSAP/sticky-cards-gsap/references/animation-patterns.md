# Animation Patterns Reference

## 1. Infinite Horizontal Marquee Loop

Use GSAP `horizontalLoop` helper to run text continuously behind the intro card.

```javascript
export function setupMarqueeAnimation() {
  const marqueeItems = gsap.utils.toArray(".marquee h1");
  if (marqueeItems.length > 0) {
    horizontalLoop(marqueeItems, {
      repeat: -1,
      paddingRight: 30
    });
  }
}
```

## 2. Mathematical Mapping for Progress Bands

When an animation state must complete during a fraction of the total scroll distance (e.g., marquee fade occurring between container scale $0.5$ and $0.75$):

$$\text{Normalized Progress} = \frac{\text{Current Scale} - \text{Start Scale}}{\text{End Scale} - \text{Start Scale}} = \frac{\text{imgScale} - 0.5}{0.75 - 0.5}$$

```javascript
const fadeProgress = (imgScale - 0.5) / 0.25;
gsap.set(marquee, { opacity: 1 - fadeProgress });
```

## 3. Directional Bidirectional Toggle Guard

Prevent redundant tween creation during high-frequency `onUpdate` events by using state flags:

```javascript
let isRevealed = false;

// Inside onUpdate:
if (progress >= 1.0 && !isRevealed) {
  isRevealed = true;
  animateContentIn(chars, desc);
} else if (progress < 1.0 && isRevealed) {
  isRevealed = false;
  animateContentOut(chars, desc);
}
```
