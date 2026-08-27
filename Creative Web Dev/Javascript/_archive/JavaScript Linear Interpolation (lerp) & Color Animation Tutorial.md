# Pipeline Execution Record

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Video tutorial / code demonstration (`demo.html`, `lerp.js`) |
| **Title** | JavaScript Linear Interpolation (`lerp`) & Color Animation Tutorial |
| **Authority** | Practical JavaScript / Web Animation Developer |
| **Coverage** | Definition of linear interpolation, standard 1D `lerp` implementation, parameter semantics (`start`, `end`, `t`), multi-dimensional / array channel interpolation (RGB color transition), and animation loop integration via `requestAnimationFrame` and timestamp delta calculation. |

### Coverage Gaps Identified
- Extrapolation behavior when $t < 0$ or $t > 1$ (the source clamps via `if (tValue >= 1)` termination condition rather than explicit math clamping like `Math.min(Math.max(t, 0), 1)`).
- Non-linear easing functions (e.g., ease-in, ease-out) are not covered; pure linear transition is demonstrated.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
- id: ku-001
  type: concept
  name: Linear Interpolation (Lerp)
  source: src-01, "00:10 - 00:30"
  confidence: high
  definition: >
    A mathematical method to compute an intermediate value between two endpoints
    along a straight path based on a normalized parameter factor.
  attributes: [start value, end value, interpolation factor t]
  avoid_terms: [tweening without formula, linear regression]
  related: [ku-002, ku-003]

- id: ku-002
  type: principle
  name: Lerp Convex Combination Formula
  source: src-01, "00:00, 02:00"
  confidence: high
  statement: >
    The standard linear interpolation is expressed as (1 - t) * start + t * end.
    When t = 0, the expression evaluates to start. When t = 1, it evaluates to end.
  rationale: >
    It weights the start and end values inversely proportional to their distance from the target parameter t.
  applies_to: [ku-003, ku-004]

- id: ku-003
  type: procedure
  name: Scalar Linear Interpolation
  source: src-01, "00:33 - 02:25"
  confidence: high
  goal: Compute a single interpolated numeric value between a start and end point.
  prerequisites: [Start number, end number, normalized scalar factor t]
  steps:
    - action: Define function accepting (start, end, t)
      criterion: Function accepts three numeric parameters
    - action: Calculate (1 - t) * start + t * end
      criterion: Returns start when t=0, end when t=1, and linear values between
  outputs: [Interpolated number]
  related: [ku-002, ku-004]

- id: ku-004
  type: procedure
  name: Multi-Channel / Vector Color Interpolation
  source: src-01, "03:10 - 04:05"
  confidence: high
  goal: Smoothly transition multi-component values (such as RGB color channels) between start and end vectors.
  prerequisites: [start vector array, end vector array of identical length, t factor]
  steps:
    - action: Map each component of start vector with corresponding end vector component
      criterion: Each channel is mapped using scalar lerp(startVal, endVal, t)
    - action: Format or clamp channels for DOM consumption (e.g. rgb(r, g, b))
      criterion: Valid CSS color string output
  outputs: [Interpolated vector or CSS color value]
  related: [ku-003, ku-005]

- id: ku-005
  type: procedure
  name: Time-Driven Animation Loop with Lerp
  source: src-01, "02:50 - 05:00"
  confidence: high
  goal: Animate a property smoothly across a fixed duration using requestAnimationFrame.
  prerequisites: [Target DOM element, start state, end state, duration in ms]
  steps:
    - action: Record animation start timestamp using performance.now()
      criterion: Precise reference timestamp established
    - action: In each animation frame, calculate elapsed time = currentTime - startTime
      criterion: Elapsed time monotonically increases
    - action: Compute normalized factor t = elapsed / duration
      criterion: t progresses from 0.0 towards 1.0
    - action: Check boundary termination (if t >= 1.0, set to final state and stop)
      criterion: Animation halts at target end value without runaway loops
    - action: Apply interpolated state to target DOM element and request next frame
      criterion: Smooth per-frame update
  outputs: [Continuous UI transition over specified duration]
  related: [ku-003, ku-004]

- id: ku-006
  type: constraint
  name: Boundary and Normalization Constraint
  source: src-01, "01:20 - 01:55, 03:50"
  confidence: high
  rule: >
    The parameter t represents a normalized ratio in the interval [0.0, 1.0]. Values outside this range
    extrapolate beyond endpoints unless clamped or guarded by a termination check.
  scope: All lerp calculations and animation loops
  consequence: Overrunning duration without bounds checking causes unpredictable CSS/graphics states.
  enforced_by: Explicit branch condition `if (tValue >= 1)` or math clamping.
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Scalar Lerp Computation
INPUT: start (number), end (number), t (number in [0, 1])
STEPS:
1. Apply the formula `(1 - t) * start + t * end` — completion criterion: correct boundary evaluations at 0.0 and 1.0.
OUTPUT: Single interpolated scalar.

STAGE 2: Multi-Dimensional / Vector Interpolation
INPUT: startArray (number[]), endArray (number[]), t (number)
STEPS:
1. Validate array dimension parity.
2. Iterate through index `i`, computing `lerp(startArray[i], endArray[i], t)`.
3. Format output (e.g. RGB string `rgb(r, g, b)`).
OUTPUT: Interpolated vector or formatted color value.

STAGE 3: Frame-Based Animation Driver
INPUT: DOM target element, startColor, endColor, durationMs
STEPS:
1. Capture `startTime = performance.now()`.
2. Compute `t = (currentTime - startTime) / durationMs`.
3. Check completion guard: if `t >= 1.0`, apply exact `endColor` and exit loop.
4. If `t < 1.0`, compute interpolated vector, assign to element style, and call `requestAnimationFrame`.
OUTPUT: Smooth visual transition matching target duration.
```

---

## Phase 4: Skill Compilation

Below is the complete operational skill package.

### File Structure
```
linear-interpolation/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

### `SKILL.md`

```markdown
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
```

---

### `references/terminology.md`

```markdown
# Terminology

**Linear Interpolation (Lerp)**:
The mathematical calculation of an intermediate value between two reference points along a linear trajectory using a normalized factor.
_Avoid_: tweening (too generic), linear regression (different mathematical concept)

**Interpolation Factor ($t$)**:
The normalized scalar value representing fractional progress between start ($t=0.0$) and end ($t=1.0$).
_Avoid_: step count, raw delta

**Convex Combination**:
A linear combination of points where all coefficients are non-negative and sum to 1 (specifically $(1 - t)$ and $t$).
_Avoid_: weighted average without normalization
```

---

### `references/examples.md`

```markdown
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
```

---

## Phase 5: Validation & Delivery Summary

### 1. Knowledge Spec Traceability
- `ku-001` (Definition) $\rightarrow$ SKILL.md Overview & `terminology.md`
- `ku-002` (Formula) $\rightarrow$ SKILL.md Phase 1 formula specification
- `ku-003` (Scalar Lerp) $\rightarrow$ SKILL.md Phase 1 steps
- `ku-004` (Color/Vector Lerp) $\rightarrow$ SKILL.md Phase 2
- `ku-005` (Animation Loop) $\rightarrow$ SKILL.md Phase 3 & `examples.md`
- `ku-006` (Bounds & Normalization) $\rightarrow$ SKILL.md Ground Rules & Decision Points

### 2. Operational Test Scenarios
1. **Midpoint Test**: `lerp(0, 100, 0.5)` yields `50`. (Verified)
2. **RGB Transition Test**: `[255, 0, 0]` to `[0, 0, 255]` at $t=0.5$ yields `[127.5, 0, 127.5]`. (Verified)
3. **Loop Termination Test**: When `elapsed >= duration`, execution branches to terminal set and stops calling `requestAnimationFrame`. (Verified)

### 3. Known Limitations
- Pure `lerp` produces linear velocity; non-linear easing (Bezier, ease-in-out) requires remapping $t$ prior to passing into `lerp`.
- Negative or $>1$ values of $t$ will perform linear extrapolation unless explicitly clamped.
