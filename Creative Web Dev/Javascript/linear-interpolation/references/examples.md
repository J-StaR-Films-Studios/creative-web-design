# Examples

## Example 1: Basic Scalar Interpolation

**Scenario**: Calculate a coordinate position 70% of the way from $x_1 = 100$ to $x_2 = 500$.

**Application**:
```javascript
function lerp(start, end, t) {
  return (1 - t) * start + t * end;
}

const position = lerp(100, 500, 0.7);
// Output: 380
```

**Outcome**: Returns 380 without creating intermediate array objects.

---

## Example 2: DOM Background Color Transition

**Scenario**: Smoothly transition a box background from Red `[255, 0, 0]` to Blue `[0, 0, 255]` over 10 seconds.

**Application**:
```javascript
const box = document.querySelector('#box');
const startColor = [255, 0, 0];
const endColor = [0, 0, 255];
const duration = 10000;

function lerp(start, end, t) {
  return (1 - t) * start + t * end;
}

let startTime = null;

function animate(currentTime) {
  if (!startTime) startTime = currentTime;
  const elapsed = currentTime - startTime;
  const t = elapsed / duration;

  if (t >= 1.0) {
    box.style.backgroundColor = `rgb(${endColor.join(',')})`;
    return;
  }

  const currentColor = startColor.map((val, idx) => lerp(val, endColor[idx], t));
  box.style.backgroundColor = `rgb(${currentColor.join(',')})`;

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

**Outcome**: The DOM element smoothly transitions across shades of magenta/purple and locks into pure blue at exactly 10,000 ms.
