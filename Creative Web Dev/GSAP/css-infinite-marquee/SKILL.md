---
name: css-infinite-marquee
description: |
  Implement high-performance, seamless pure CSS infinite carousels and marquees.
  Triggers: create infinite carousel, pure css marquee, looping logo ribbon,
  continuous card scroller, seamless marquee animation, infinite ticker.
---

# CSS Infinite Marquee

Construct zero-dependency, hardware-accelerated horizontal marquees that loop infinitely without layout jumps or JavaScript timers.

## Principles

1. **Two-Group Architecture**: An outer viewport clips overflow while two identical inner groups cycle continuously.
2. **Encapsulated Spacing**: Trailing gap space must be inside the animated group (`padding-right`), never on the outer container (`gap`).
3. **Inflexible Items**: Items must explicitly disable flex shrinking to preserve layout geometry.

---

## Phase 1: Semantic & Accessible DOM Construction

Build the two-group hierarchy required for seamless looping.

1. Wrap the scroller items in an outer container (`.carousel`).
2. Wrap the active items inside an inner track wrapper (`.group`).
3. Duplicate the `.group` node exactly once inside `.carousel`.
4. Append `aria-hidden="true"` to the second `.group` node to prevent assistive tech duplication.

```html
<div class="carousel">
  <div class="group">
    <div class="card">1</div>
    <div class="card">2</div>
    <div class="card">3</div>
  </div>
  <div class="group" aria-hidden="true">
    <div class="card">1</div>
    <div class="card">2</div>
    <div class="card">3</div>
  </div>
</div>
```

### Completion gate
- [ ] Exactly two `.group` elements exist inside `.carousel`.
- [ ] Duplicate group possesses `aria-hidden="true"`.
- [ ] Card items inside both groups match identically.

---

## Phase 2: Flexbox Overflow & Dimension Lockdown

Establish horizontal overflow boundaries without item deformation.

1. Set `.carousel` to `display: flex` and hide overflow/scrollbars:
   ```css
   .carousel {
     display: flex;
     overflow-x: auto;
   }
   .carousel::-webkit-scrollbar {
     display: none;
   }
   ```
2. Configure `.group` as a flex container:
   ```css
   .group {
     display: flex;
     align-items: center;
     justify-content: center;
   }
   ```
3. Lock item sizes using the `flex` shorthand (`flex: 0 0 <basis>`):
   ```css
   .card {
     flex: 0 0 12rem; /* grow: 0, shrink: 0, basis: width */
   }
   ```

For detailed property descriptions and flex shorthand rules, see [terminology.md](references/terminology.md).

### Completion gate
- [ ] Outer container prevents scrollbars while clipping content.
- [ ] Child cards maintain fixed width regardless of viewport scale.

---

## Phase 3: Seamless Loop Animation & Spacing Alignment

Configure the linear keyframe translation and eliminate the boundary gap glitch.

1. Declare the keyframe translation from `0` to `-100%`:
   ```css
   @keyframes spin {
     from {
       translate: 0;
     }
     to {
       translate: -100%;
     }
   }
   ```
2. Attach the animation to `.group` using `linear` easing and `infinite` iteration:
   ```css
   .group {
     animation: spin 15s infinite linear;
   }
   ```
3. Establish gap consistency:
   - Set desired item spacing on `.group` using `gap: <value>`.
   - Set matching trailing padding on `.group` using `padding-right: <value>`.
   - Ensure `.carousel` has **no** `gap` or `margin` between groups.

```css
.group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding-right: 1.5rem;
  animation: spin 15s infinite linear;
}
```

To diagnose animation jumps or stuttering, see [troubleshooting.md](references/troubleshooting.md).

### Completion gate
- [ ] Animation runs infinitely with linear timing.
- [ ] Spacing between the last item of group 1 and first item of group 2 equals internal card gap.
- [ ] Loop iteration reset is imperceptible.
