# Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Video tutorial / transcript |
| **Title** | How to Create a Horizontal Scrolling Section in Elementor (Free / No Elementor Pro) |
| **Authority** | Elementor / WordPress Front-end Developer (Jitu Raiyan / Pluralyan) |
| **Coverage** | Elementor Flexbox container hierarchy setup, CSS-driven horizontal scroll mechanics, custom parallax movement (`translate-x`, `translate-y`), rotating badge/text path effects, click-to-scroll anchor linking within horizontal tracks, entry reveal animations, and responsive breakpoint tuning (desktop/tablet/mobile). |

### Coverage Gaps
- The video relies on an external custom HTML/CSS snippet (`mdw-horizontal-scroll`) provided in the author's description. The CSS property syntax and class parameters are extracted directly from the video UI/code editor shown.

---

# Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
- id: ku-001
  type: concept
  name: Outer Viewport Container
  source: src-01, "02:18 - 03:07"
  confidence: high
  definition: >
    The parent Elementor flexbox container that locks viewport height (100vh)
    and hides overflow to create a fixed viewing window for horizontal panning.
  attributes: [full-width, min-height 100vh, overflow hidden, zero padding]
  avoid_terms: [wrapper div, scroll frame]

- id: ku-002
  type: concept
  name: Horizontal Track Container
  source: src-01, "03:08 - 03:45"
  confidence: high
  definition: >
    The inner flexbox container that houses all horizontal slide panels in a single
    non-wrapping row (direction: row, wrap: nowrap, gap: 0).
  attributes: [row direction, no-wrap, zero gap, full-width]
  avoid_terms: [slider list, row track]

- id: ku-003
  type: concept
  name: Slide Section Container
  source: src-01, "03:46 - 05:35"
  confidence: high
  definition: >
    An individual content panel inside the horizontal track, sized to full height (100vh)
    and set to flex-grow so its width adapts to content or auto-calculated widths.
  attributes: [full-width, width: auto, min-height 100vh, size: grow]
  avoid_terms: [slide box, card container]

- id: ku-004
  type: procedure
  name: Container Hierarchy Setup
  source: src-01, "02:18 - 06:49"
  confidence: high
  goal: Structure Elementor flexbox containers to enable horizontal scrolling without third-party plugins.
  steps:
    - action: Create top-level Outer Container (Full Width, Min-Height 100vh, Direction: Column, Overflow: Hidden, Padding: 0).
      criterion: Outer container fits exact viewport height with hidden horizontal overflow.
    - action: Insert inner Track Container (Full Width, Direction: Row, Gap: 0px, Wrap: No Wrap, Padding: 0).
      criterion: Track container aligns children horizontally without wrapping.
    - action: Insert slide section containers inside the track; set Content Width to Full Width, Width to `auto`, Min-Height to `100vh`, and Size to `Grow`.
      criterion: All panels line up side-by-side inside the parent track.
    - action: Assign CSS class `mdw-horizontal-scroll` to the Outer Viewport Container.
      criterion: Class is present in Advanced > Layout > CSS Classes on the outer container.
    - action: Insert an HTML widget directly below the outer container and embed the horizontal scroll stylesheet.
      criterion: HTML widget is added and rendered without display blocking.
  outputs:
    - Operational horizontal track structure in Elementor

- id: ku-005
  type: procedure
  name: Multi-Axis Parallax Motion Configuration
  source: src-01, "10:30 - 13:48"
  confidence: high
  goal: Add multi-layer speed-differential parallax scrolling to elements without Elementor Pro.
  steps:
    - action: Set target element Position to `Absolute` (if floating) or keep inline.
    - action: Add movement CSS class using pattern `mdw-hs-movement-[axis]-[speed][-reverse]`.
      criterion: Class adheres to syntax (e.g., `mdw-hs-movement-translate-x-20`, `mdw-hs-movement-translate-y-50-reverse`).
    - action: If combining multi-axis motion, separate classes with a single space.
      criterion: Space-delimited classes (e.g., `mdw-hs-movement-translate-x-20 mdw-hs-movement-translate-y-20`).
  outputs:
    - Multi-speed parallax elements responsive to page scroll

- id: ku-006
  type: procedure
  name: Continuous Rotating Badge / Text Path
  source: src-01, "13:04 - 13:49"
  confidence: high
  goal: Bind rotational animation of a widget/badge to the scroll progress.
  steps:
    - action: Select target heading / badge widget.
    - action: Assign CSS class `mdw-hs-movement-rotate-[speed]` (e.g., `mdw-hs-movement-rotate-10`).
      criterion: Element rotates proportional to horizontal scroll distance.
    - action: Append `-reverse` to reverse rotational direction if required.
      criterion: Rotation direction matches visual flow.
  outputs:
    - Scroll-linked rotating element

- id: ku-007
  type: procedure
  name: In-Track Click-to-Scroll Anchoring
  source: src-01, "13:51 - 15:40"
  confidence: high
  goal: Anchor link from standard vertical sections or slide panels directly into a specific horizontal slide.
  steps:
    - action: Assign a unique CSS class name to the destination slide container (e.g., `mdw-section-1`, `mdw-section-2`).
      criterion: Target container has an explicit custom class.
    - action: Set trigger button / link URL to `#[target-class-name]` (e.g., `#mdw-section-2`).
      criterion: Link URL matches hash + class identifier instead of Elementor standard element ID.
  outputs:
    - Functional internal jumping mechanism within horizontal slides

- id: ku-008
  type: procedure
  name: Directional Reveal Animations
  source: src-01, "15:41 - 16:30"
  confidence: high
  goal: Trigger entrance reveal animations when horizontal panels enter the viewport.
  steps:
    - action: Set Motion Effects > Entrance Animation to `Fade In` with Duration `Slow`.
    - action: Add reveal class `mdw-reveal-animation-[direction]` where direction is `left`, `right`, `top`, or `bottom`.
      criterion: Element triggers smooth directional reveal upon slide visibility.
  outputs:
    - Viewport-triggered slide entrance effects

- id: ku-009
  type: procedure
  name: Seam and Sub-Pixel Line Elimination
  source: src-01, "09:12 - 09:50"
  confidence: high
  goal: Eliminate 1px vertical gap lines caused by sub-pixel browser rendering between slides.
  steps:
    - action: Select the slide container following the seam.
    - action: Apply `-1px` margin to its left side (`margin-left: -1px`).
      criterion: 1px overlap eliminates hairline rendering artifacts.
  outputs:
    - Seamless horizontal background transitions

- id: ku-010
  type: procedure
  name: Mobile Viewport Fallback & Stack Mode
  source: src-01, "16:48 - 20:25"
  confidence: high
  goal: Configure responsive behavior for tablet/mobile or switch to vertical stacking.
  steps:
    - action: Reset fixed widths on text and headings to responsive percentages or custom tablet/mobile pixel constraints.
    - action: Set Outer Container height from `100vh` to `auto` or `0` on mobile if horizontal scroll is disabled.
    - action: Toggle snippet configuration flags in the HTML widget (`--disable-movement-mobile: true;`, `--disable-horizontal-scroll-mobile: true;`).
    - action: When disabling horizontal scroll on mobile, switch Track Container Direction to `Column (vertical)`.
      criterion: Track gracefully reverts to a normal vertical flow without horizontal overflow.
  outputs:
    - Fully responsive horizontal track or vertical stack fallback
```

---

# Phase 3: Methodology Synthesis

```
STAGE 1: Container Architecture & Scaffolding
STAGE 2: Script & Class Binding
STAGE 3: Parallax & Kinetic Effects
STAGE 4: Internal Anchoring & Reveal Transitions
STAGE 5: Responsive Breakpoint Normalization & Edge-Case Debugging
```

---

# Phase 4 & 5: Compiled Skill Package

```
elementor-horizontal-scroll/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── css-classes.md
    └── examples.md
```

Below are the compiled files ready for deployment.

***

### `SKILL.md`

```markdown
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

---

## Phase 5: Responsive Calibration & Fallback Configuration

Adapt layout across Tablet and Mobile breakpoints.

1. **Tablet Layout Tuning**:
   - Switch to Tablet preview.
   - Adjust long heading widths to explicit pixel or percentage constraints (e.g., `max-width: 420px`).
   - If product grids overflow vertically, switch grid parent containers from `Direction: Column` to `Direction: Row` with adjusted item widths.

2. **Choose Mobile Experience Strategy**:
   - **Mode A: Maintain Horizontal Scroll on Mobile**:
     - Keep track active. Set slide containers to `Width: auto`, `Min-Height: 100vh`.
     - Disable heavy parallax by setting `--disable-movement-mobile: true;` in the HTML snippet to prevent mobile stutter.
   - **Mode B: Revert to Vertical Flow on Mobile**:
     - In the HTML widget, set `--disable-horizontal-scroll-mobile: true;`.
     - On Mobile preview, select the **Outer Viewport Container** and set **Min Height** to `auto` (or `0`).
     - Select the **Track Container** and set **Direction** to `Column (vertical)`.
     - Reset Slide Container widths to `100%` and Min Height to `auto`.

3. **Final End-to-End Verification**:
   - Test full scroll through on Desktop, Tablet, and Mobile devices.
   - Verify no horizontal overflow escapes into global document scroll on mobile.

### Completion Gate
- [ ] Mobile strategy selected and configured in snippet flags.
- [ ] No layout clipping or text overlap on tablet/mobile screens.
- [ ] Global page vertical scroll functions continuously before and after the horizontal section.

**Output**: Fully operational, high-performance horizontal scrolling section with custom parallax, responsive fallbacks, and zero plugin dependencies.
```

***

### `references/terminology.md`

```markdown
# Terminology

**Outer Viewport Container**:
The top-level flexbox container locking the vertical scroll frame to 100vh and masking overflowing slide content.
_Avoid_: wrapper div, scroll outer frame, slider window

**Track Container**:
The immediate child flexbox container set to a horizontal row layout (`wrap: nowrap`, `gap: 0`) holding all consecutive slides.
_Avoid_: carousel track, slide list, row wrapper

**Slide Section Container**:
An individual content panel placed directly within the track container, configured with flexible width growth and viewport height.
_Avoid_: slide card, slider item, sub-section

**Sub-Pixel Hairline Seam**:
A 1px background gap artifact rendered between adjacent containers due to floating-point display calculations in web browsers.
_Avoid_: rendering bug, border glitch

**Driver Snippet**:
The lightweight HTML/CSS/JS block that binds page vertical scroll offset to track horizontal CSS transform properties without external library dependencies.
_Avoid_: slider plugin, scroll addon
```

***

### `references/css-classes.md`

```markdown
# CSS Classes and Configuration Reference

## Driver Code Template

Embed inside an Elementor HTML widget on the target page:

```html
<style>
/* Horizontal Scroll Configuration */
:root {
  --progress-bar: true;
  --progress-bar-color: #FFF00;
  --progress-bar-height: 2px;
}

body {
  --disable-movement-desktop: false;
  --disable-movement-tablet: false;
  --disable-movement-mobile: true;
  --hide-default-scrollbar: false;
  --disable-horizontal-scroll-mobile: false;
}
</style>
```

---

## Class Naming Conventions

### 1. Structural Classes
| CSS Class | Target Element | Description |
|---|---|---|
| `mdw-horizontal-scroll` | Outer Viewport Container | Activates horizontal scroll driver on container |
| `[custom-name]` (e.g., `mdw-section-1`) | Slide Container | Target anchor identifier for jump links |

---

### 2. Parallax Motion Classes
Syntax: `mdw-hs-movement-[property]-[axis]-[speed][-reverse]`

| CSS Class | Effect |
|---|---|
| `mdw-hs-movement-translate-x-20` | Shifts element along X-axis at speed 20 |
| `mdw-hs-movement-translate-x-50` | Fast shift along X-axis at speed 50 |
| `mdw-hs-movement-translate-x-50-reverse` | Shifts element along X-axis in opposite scroll direction |
| `mdw-hs-movement-translate-y-20` | Shifts element along Y-axis at speed 20 |
| `mdw-hs-movement-translate-y-50-reverse` | Shifts element along Y-axis in opposite direction |
| `mdw-hs-movement-translate-x-20 mdw-hs-movement-translate-y-20` | Multi-axis diagonal parallax shift |

---

### 3. Rotational Classes
Syntax: `mdw-hs-movement-rotate-[speed][-reverse]`

| CSS Class | Effect |
|---|---|
| `mdw-hs-movement-rotate-10` | Rotates element clockwise proportional to scroll |
| `mdw-hs-movement-rotate-10-reverse` | Rotates element counter-clockwise proportional to scroll |
| `mdw-hs-movement-rotate-30` | High-speed clockwise rotation |

---

### 4. Entrance Reveal Classes
Syntax: `mdw-reveal-animation-[direction]`

*Note: Requires widget/container Entrance Animation set to `Fade In` with duration `Slow`.*

| CSS Class | Reveal Direction |
|---|---|
| `mdw-reveal-animation-left` | Slide reveals entering from the left |
| `mdw-reveal-animation-right` | Slide reveals entering from the right |
| `mdw-reveal-animation-top` | Slide reveals entering from top |
| `mdw-reveal-animation-bottom` | Slide reveals entering from bottom |
```

***

### `references/examples.md`

```markdown
# Worked Examples

## Example 1: 3D Multi-Layer Product Hero Slide

**Scenario**: A slide with a large background text heading, a center featured product bottle, and two background floating fruit images requiring 3D depth effect.

**Application**:
1. Outer Container: `mdw-horizontal-scroll`.
2. Heading Widget: Fixed width `1000px`, padding-top `130px`.
3. Background Fruit Image 1 (Left): Class `mdw-hs-movement-translate-x-10`.
4. Foreground Bottle Image (Center): Position `Absolute`, Class `mdw-hs-movement-translate-x-20`.
5. Background Fruit Image 2 (Right): Position `Absolute`, Class `mdw-hs-movement-translate-x-30`.

**Outcome**: As user scrolls horizontally, the background fruit moves slowly (10), the bottle moves medium (20), and the foreground fruit moves rapidly (30), producing a realistic 3D depth parallax illusion.

---

## Example 2: In-Track Jump Link with Rotating CTA Badge

**Scenario**: A landing hero slide contains a circular badge ("Scroll Down • Explore More") that must rotate continuously and scroll directly to Slide 3 upon clicking.

**Application**:
1. Circular badge heading widget assigned class: `mdw-hs-movement-rotate-10`.
2. Target Slide 3 container assigned class: `mdw-section-3`.
3. Badge link URL set to: `#mdw-section-3`.

**Outcome**: Badge rotates smoothly in sync with scroll progress. Clicking the badge instantly jumps horizontal scroll directly to Slide 3.

---

## Example 3: Mobile Stacking Fallback

**Scenario**: A horizontal track with 4 rich content slides needs to scroll horizontally on Desktop and Tablet, but convert to standard vertical stacking on mobile smartphones to ensure readable typography.

**Application**:
1. In driver HTML widget, configure:
   ```css
   body {
     --disable-movement-mobile: true;
     --disable-horizontal-scroll-mobile: true;
   }
   ```
2. In Elementor Mobile Breakpoint:
   - Outer Viewport Container: `Min-Height: auto`, `Overflow: visible`.
   - Track Container: `Direction: Column (vertical)`.
   - Slide Containers: `Width: 100%`, `Min-Height: auto`.

**Outcome**: On mobile screens, the page scrolls vertically without horizontal jamming, while desktop retains full horizontal animation.
```

---

# Phase 5: Validation & Delivery

### Source Fidelity & Verification
- **Container Structure**: Encoded in Phase 1 (`SKILL.md`).
- **Motion Parallax & Multi-axis**: Fully operationalized in Phase 3 (`SKILL.md` & `references/css-classes.md`).
- **Rotation & Anchoring**: Encoded in Phase 3 & 4 (`SKILL.md`).
- **Bug Fixes (Seams & Backgrounds)**: Captured in Phase 2, Step 3 & 4.
- **Mobile Stack Toggling**: Handled in Phase 5 with explicit snippet flags.

### Test Walkthrough
1. *Scenario 1: User wants horizontal scroll without Elementor Pro.* → Verified: Skill directs exact container hierarchy and free driver snippet integration.
2. *Scenario 2: User wants to jump from Header button to Slide 2.* → Verified: Methodology directs class targeting (`#mdw-section-2`), resolving Elementor's default ID jump failure.
3. *Scenario 3: Layout broken on Mobile.* → Verified: Methodology provides 2 explicit paths (Mobile horizontal preservation vs. Vertical stack fallback).
