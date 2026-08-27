# Constellation Distance Mathematics

## Geometric Formulation

To calculate the spatial separation between Particle $A (x_1, y_1)$ and Particle $B (x_2, y_2)$:

1. **Calculate Catheti (Differences in X and Y)**:
   $$\Delta x = x_1 - x_2$$
   $$\Delta y = y_1 - y_2$$

2. **Calculate Hypotenuse (Euclidean Distance)**:
   $$\text{distance} = \sqrt{\Delta x^2 + \Delta y^2}$$

In JavaScript:
```javascript
const dx = particleA.x - particleB.x;
const dy = particleA.y - particleB.y;
const distance = Math.sqrt(dx * dx + dy * dy);
// Modern alternative: const distance = Math.hypot(dx, dy);
```

## Algorithmic Complexity & Optimization

- **Brute Force Pairs**: $O(N^2)$ checks.
- **Triangular Optimization**: By starting the inner loop at `let j = i;`, redundant symmetric comparisons ($B \leftrightarrow A$) and self-comparisons ($A \leftrightarrow A$) are omitted, reducing pairwise evaluations to:
  $$\frac{N(N - 1)}{2} \approx O\left(\frac{N^2}{2}\right)$$

## Dynamic Stroke Attenuation Formulas

To smoothly fade constellation lines as particles separate:

```javascript
// Opacity inversely proportional to distance
const opacity = 1 - (distance / maxDistance);
ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;

// Width proportional to particle scale
ctx.lineWidth = particleA.size / 10;
```
