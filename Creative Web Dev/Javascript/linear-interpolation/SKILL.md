---
name: linear-interpolation
description: |
  Implement and apply linear interpolation (lerp) for numerical smoothing,
  color transitions, coordinate positioning, and frame-rate independent animations.
  Use when calculating intermediate states between two values or driving smooth DOM/Canvas transitions over time.
  Triggers: lerp, linear interpolation, color transition, animate between values, smooth interpolation.
---

# Linear Interpolation (Lerp)

Implement and execute linear interpolation routines to compute intermediate values between two known points across scalar and vector domains.

## Ground Rules

1. **Normalized Range**: Treat the parameter `t` as a progression factor where `0.0` represents the initial state and `1.0` represents the terminal state.
2. **Deterministic Boundaries**: Ensure `t = 0` strictly returns `start` and `t = 1` strictly returns `end`.
3. **Array Parity**: Vector or color interpolations require equal-length start and end collections.

For canonical definitions and anti-synonyms, see [terminology.md](references/terminology.md).

---

## Phase 1: Scalar Lerp Implementation

Implement the foundational mathematical kernel for 1-dimensional interpolation.

1. Construct the scalar lerp function using the precision-preserving convex formulation:
   $$\text{lerp}(start, end, t) = (1 - t) \cdot start + t \cdot end$$
2. Accept three numeric parameters: `start`, `end`, and `t`.
3. Return the calculated numeric value directly without side effects.

### Completion Gate
- [ ] Returns `start` when `t = 0.0`
- [ ] Returns `end` when `t = 1.0`
- [ ] Returns the exact midpoint `(start + end) / 2` when `t = 0.5`

**Output**: Pure `lerp(start, end, t)` function.

---

## Phase 2: Vector and Multi-Channel Interpolation

Interpolate multi-dimensional data structures such as RGB/RGBA color vectors or coordinate tuples $(x, y, z)$.

1. Align the source vector and destination vector by index.
2. Map over the start array, applying scalar `lerp` to each channel:
   ```javascript
   const interpolated = startVector.map((val, i) => lerp(val, endVector[i], t));
   ```
3. Format the resulting numeric vector into the required target string or data structure (e.g., `rgb(r, g, b)` or transformed coordinate object).

### Completion Gate
- [ ] Length of start vector matches length of end vector
- [ ] Every individual channel is interpolated with the same `t` value
- [ ] Resulting vector values map to valid CSS/data ranges

**Output**: Vector interpolation handler or color formatter.

---

## Phase 3: Time-Based Animation Loop

Drive smooth transitions over fixed durations using standard animation frames.

For complete worked examples and loop implementations, see [examples.md](references/examples.md).

1. Define the duration in milliseconds (`duration`) and define the start and end states.
2. Record the reference timestamp `startTime = performance.now()`.
3. Inside the animation callback:
   - Calculate elapsed time: `elapsed = currentTime - startTime`.
   - Calculate progress ratio: `t = elapsed / duration`.
4. Apply decision point:
   - **If `t >= 1.0`**: Set target directly to the final state (`endColor`/`endValue`), apply to DOM/Canvas, and terminate loop execution.
   - **If `t < 1.0`**: Compute interpolated state at `t`, apply to DOM element style, and schedule the next frame via `requestAnimationFrame(animate)`.

### Completion Gate
- [ ] Reference time captured via high-resolution timer (`performance.now()`)
- [ ] Hard stop guard prevents execution past `t >= 1.0`
- [ ] Terminal frame sets the exact destination value without floating-point artifacts

**Output**: Self-terminating `requestAnimationFrame` loop.
