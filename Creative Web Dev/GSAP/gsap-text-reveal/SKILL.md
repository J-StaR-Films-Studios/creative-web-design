---
name: gsap-text-reveal
description: |
  Create high-performance, customizable text reveal animations using GSAP 3 and the SplitText plugin.
  Triggers: animate text, text reveal, split text animation, GSAP text effects, character stagger reveal,
  word reveal animation, typography animation with GSAP.
---

# GSAP Text Reveal Animation

Implement staggered entrance reveals on typography using GSAP 3 and the SplitText plugin. This methodology breaks text into lines, words, or characters and applies transform and opacity tweens.

## Workflow Pipeline

```
Markup & Dependencies → DOM Ready & Plugin Registration → Text Decomposition → Tween & Stagger Configuration
```

For domain terminology, see [terminology.md](references/terminology.md).
For worked code examples across split modes, see [examples.md](references/examples.md).

---

## Phase 1: Dependency & DOM Setup

Configure the document structure and load necessary GSAP libraries in exact dependency order.

1. **Add target markup**: Assign an identifiable class (e.g., `.reveal-text`) to the heading or paragraph element.
2. **Apply base styles**: Set styling (font size, font weight, line height, colors) in CSS. Ensure elements have predictable layout dimensions.
3. **Include script dependencies**: Load scripts in the following mandatory order before your application script:
   - GSAP 3 Core: `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js`
   - SplitText Plugin: `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js`
   - Application Script: `script.js`

### Completion gate
- [ ] Target element exists in HTML with dedicated selector class.
- [ ] GSAP core loads before SplitText plugin.
- [ ] Application script loads last.

---

## Phase 2: Plugin Registration & Text Splitting

Initialize GSAP safely after the DOM is fully loaded and decompose target text into controllable nodes.

1. **Wrap in lifecycle handler**: Bind initialization to `DOMContentLoaded` to prevent executing against unrendered DOM nodes:
   ```javascript
   document.addEventListener("DOMContentLoaded", () => {
     // Initialization code
   });
   ```
2. **Register plugin**: Register SplitText with the GSAP engine:
   ```javascript
   gsap.registerPlugin(SplitText);
   ```
3. **Instantiate SplitText**: Target the element and specify the required decomposition level (`"lines"`, `"words"`, `"chars"` or a comma-separated combination):
   ```javascript
   let split = SplitText.create(".reveal-text", {
     type: "lines, words, chars"
   });
   ```

### Completion gate
- [ ] `gsap.registerPlugin(SplitText)` executes prior to `SplitText.create()`.
- [ ] Split type matches intended animation granularity.
- [ ] Split instance variable stores reference to decomposed nodes.

---

## Phase 3: Tween Construction (`gsap.from`)

Build the entrance tween using `gsap.from()` to animate elements from an offset state to their natural CSS resting position.

1. **Select target array**: Choose `split.lines`, `split.words`, or `split.chars`.
2. **Set starting properties**:
   - `y`: Vertical pixel offset (e.g., `20` to `40`) for upwards reveal motion.
   - `opacity`: Set to `0` to fade in during entrance.
   - `duration`: Animation length in seconds (typically `0.6` to `1.2`).
3. **Enforce `from` tweening**: Always use `gsap.from()` rather than `gsap.to()` for entrance animations to avoid flashes of unstyled content or manual pre-hiding.

### Basic Tween Syntax
```javascript
gsap.from(split.chars, {
  y: 30,
  opacity: 0,
  duration: 0.8
});
```

### Completion gate
- [ ] Tween uses `gsap.from()`.
- [ ] Target refers to valid split array (`split.lines`, `split.words`, or `split.chars`).
- [ ] `y`, `opacity`, and `duration` values are defined.

---

## Phase 4: Stagger Tuning

Apply cadence and sequence control across split nodes using scalar or object stagger parameters.

### Decision Point: Stagger Type
- **Uniform sequential delay**: Use a scalar number (seconds between each element).
  ```javascript
  stagger: 0.1
  ```
- **Directional or distributed delay**: Use a stagger configuration object.

### Advanced Stagger Configuration
Configure the stagger object:
- `each`: Delay interval per item in seconds (e.g., `0.1`).
- `from`: Origin point for the sequence cascade:
  - `"start"`: Left-to-right / first-to-last (default).
  - `"end"`: Reverse order / last-to-first.
  - `"center"`: Expands outward from the middle.
  - `"random"`: Unordered organic reveal.

```javascript
gsap.from(split.chars, {
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: {
    each: 0.1,
    from: "random"
  }
});
```

### Completion gate
- [ ] Stagger is calibrated to prevent overly slow total reveal time.
- [ ] `from` origin matches intended design effect (`start`, `end`, `center`, `random`).
