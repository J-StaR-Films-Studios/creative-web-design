---
name: elementor-horizontal-scroll
description: |
  Construct plugin-free horizontal scrolling sections in Elementor using Flexbox containers.
  Use when building horizontal slide tracks, multi-layer scroll parallax, rotating badges,
  in-track anchor links, and responsive viewport-stacking fallbacks without Elementor Pro.
  Triggers: elementor horizontal scroll, horizontal section elementor, no pro horizontal scroll,
  parallax horizontal scroll, elementor sideways scroll, horizontal scroll track.
---

# Elementor Horizontal Scroll Engine

Implement high-performance, plugin-free horizontal scrolling tracks inside WordPress using standard Elementor Flexbox containers and custom CSS/JS drivers.

## Ground Rules

- **Container-First**: Every horizontal section requires a strict 2-level hierarchy: 1 Outer Viewport Container containing 1 Track Container housing N Slide Containers.
- **Unit Precision**: Outer containers must lock to `100vh` with `overflow: hidden`. Inner tracks must enforce `flex-wrap: nowrap` and `gap: 0`.
- **Anchor via Class**: Anchor links navigating to horizontal slides must target CSS class names (`#class-name`), not HTML element IDs.
- **Sub-Pixel Compensation**: Apply `margin-left: -1px` to consecutive panels to avoid hairline browser seams.

For domain definitions, consult [terminology.md](references/terminology.md).
For all supported classes, variables, and snippet syntax, consult [css-classes.md](references/css-classes.md).

---

## Phase 1: Container Hierarchy Construction

Assemble the structural flexbox containers.

1. **Create Outer Viewport Container**:
   - Set **Content Width** to `Full Width`.
   - Set **Min Height** to `100vh`.
   - Set **Direction** to `Column` (vertical).
   - Set **Justify Content** to `Start`.
   - Set **Align Items** to `Stretch`.
   - Under **Additional Options**, set **Overflow** to `Hidden`.
   - Under **Advanced > Layout**, set **Padding** to `0px` (unlink all sides).

2. **Create Track Container (Inside Outer Container)**:
   - Insert a new Flexbox Container inside the Outer Container.
   - Set **Content Width** to `Full Width`.
   - Set **Direction** to `Row` (horizontal).
   - Set **Gaps** to `0px`.
   - Set **Wrap** to `No Wrap`.
   - Under **Advanced > Layout**, set **Padding** to `0px`.

3. **Configure Slide Section Containers**:
   - Insert child containers inside the Track Container (one per slide).
   - For each child container:
     - Set **Content Width** to `Full Width`.
     - Set **Width** to `auto` (via custom input).
     - Set **Min Height** to `100vh`.
     - Under **Advanced > Layout > Size**, set to `Grow`.

4. **Verify Container Tree**:
   - Ensure the Navigator panel strictly reflects: `Outer Container > Track Container > [Slide 1, Slide 2, ... Slide N]`.

### Completion Gate
- [ ] Outer container has `overflow: hidden` and `100vh` min-height.
- [ ] Track container has `Direction: Row`, `Wrap: No Wrap`, and `Gaps: 0`.
- [ ] Every slide container has `Width: auto`, `Min-Height: 100vh`, and `Size: Grow`.

---

## Phase 2: Driver Integration & Base Activation

Activate horizontal transform mechanics.

1. **Assign Base CSS Class**:
   - Select the **Outer Viewport Container**.
   - Navigate to **Advanced > Layout > CSS Classes**.
   - Add class: `mdw-horizontal-scroll`.

2. **Embed Driver HTML/CSS Widget**:
   - Add an **HTML Widget** inside the page (placed right above or below the outer container).
   - Paste the `mdw-horizontal-scroll` driver stylesheet and configuration block from [css-classes.md](references/css-classes.md#driver-code-template).
   - Under **Advanced > Responsive**, enable **Hide on Desktop**, **Hide on Tablet**, and **Hide on Mobile** (prevents layout shifts in visual editor).

3. **Resolve Hairline Seams**:
   - If 1px rendering lines appear between panels during scroll, select the right-hand container.
   - Set **Margin > Left** to `-1px`.

4. **Eliminate Bottom Whitespace**:
   - Set the background color of the **Outer Viewport Container** to match the dominant slide background color.

### Completion Gate
- [ ] Outer container carries `mdw-horizontal-scroll`.
- [ ] HTML snippet widget embedded and hidden across all breakpoints.
- [ ] Page scroll smoothly drives horizontal axis translation in preview mode.

---

## Phase 3: Parallax, Kinetic & Reveal Styling

Layer dynamic motion onto individual slide assets.

For worked configurations and values, see [examples.md](references/examples.md).

1. **Configure Scroll-Linked Parallax**:
   - Select the target image, heading, or nested container.
   - Navigate to **Advanced > Layout > CSS Classes**.
   - Assign class using syntax `mdw-hs-movement-[axis]-[speed][-reverse]`:
     - Horizontal shift: `mdw-hs-movement-translate-x-20` (Speed: 20).
     - Vertical shift: `mdw-hs-movement-translate-y-50` (Speed: 50).
     - Reversed path: Append `-reverse` (e.g., `mdw-hs-movement-translate-x-30-reverse`).
   - For multi-axis motion, combine classes separated by a space (e.g., `mdw-hs-movement-translate-x-20 mdw-hs-movement-translate-y-20`).

2. **Add Scroll-Driven Rotation**:
   - Select badge, sticker, or circular text path element.
   - Add class `mdw-hs-movement-rotate-[speed]` (e.g., `mdw-hs-movement-rotate-10`).
   - Append `-reverse` if counter-clockwise rotation is needed.

3. **Implement Directional Reveal Animations**:
   - Select target column/card container.
   - Set **Advanced > Motion Effects > Entrance Animation** to `Fade In` and **Animation Duration** to `Slow`.
   - Add class `mdw-reveal-animation-[direction]` where direction is `left`, `right`, `top`, or `bottom`.

### Completion Gate
- [ ] Multi-layer parallax elements move at differentiated relative speeds.
- [ ] Rotational elements track scroll position accurately.
- [ ] Reveal animations trigger cleanly upon entering the visible viewport.

---

## Phase 4: In-Track Anchor Navigation

Configure internal page jumps to specific horizontal slides.

1. **Assign Slide Identifier Class**:
   - Select the target destination slide container inside the track.
   - Under **Advanced > Layout > CSS Classes**, add a unique class name with a space after any existing classes (e.g., `mdw-section-2`).

2. **Bind Trigger Links / Buttons**:
   - Select the navigation button, menu item, or text link.
   - Set the Link URL field to `#[target-class-name]` (e.g., `#mdw-section-2`).

3. **Validate Jump Execution**:
   - Click trigger link from outside or inside the track.
   - Verify track pans smoothly to the targeted slide.

### Completion Gate
- [ ] Destination slide has a unique CSS class.
- [ ] Trigger link points to `#target-class-name`.
- [ ] Anchor jumps center/align to the exact target slide.
