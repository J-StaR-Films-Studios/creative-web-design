# Source-to-Skill Compilation Report

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes |
| **Title** | How to Create Infinite Carousels / Marquees with Pure CSS |
| **Authority** | Fabian (Coding To Go) — Web development instructor & CSS specialist |
| **Coverage** | Semantic HTML structure, Flexbox sizing (`flex-shrink`/`flex-basis`), CSS keyframe translate animation, seamless infinite looping via DOM duplication, accessibility (`aria-hidden`), and gap alignment calculation fix. |

### Coverage Gaps Identified
- Pause on hover / interaction states (not covered in source video; flagged as known limitation).
- Bidirectional scrolling or variable velocity (reverse marquee / speed modifiers).

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
knowledge_spec:
  - id: ku-001
    type: concept
    name: Infinite Carousel / CSS Marquee
    source: src-01, "00:00 - 00:34"
    confidence: high
    definition: >
      A continuous, seamlessly looping horizontal display mechanism where items scroll out 
      of viewport and reappear from the opposite side indefinitely without visible jump or reset.
    attributes:
      - continuous linear translation
      - duplicate DOM wrapper
      - seamless offset timing
    avoid_terms: [javascript slider, swiper widget]
    related: [ku-002, ku-003]

  - id: ku-002
    type: concept
    name: Group Wrapper Architecture
    source: src-01, "00:17 - 00:34"
    confidence: high
    definition: >
      A structural container wrapping a set of items, duplicated to create an identical trailing set 
      that fills the viewport during translation.
    attributes:
      - flex layout
      - translated unit
      - duplicated in DOM
    avoid_terms: [inner track, slider tape]
    related: [ku-001, ku-006]

  - id: ku-003
    type: principle
    name: Separation of Overflow and Translation
    source: src-01, "01:05 - 01:56"
    confidence: high
    statement: >
      The outer container manages viewport overflow and hides scrollbars; the inner group wrappers 
      handle linear animation translation.
    rationale: >
      Applying translate directly to the outer container moves the viewport boundary instead of the content.
    applies_to: [ku-006]

  - id: ku-004
    type: principle
    name: Trailing Gap Compensation
    source: src-01, "02:45 - 03:32"
    confidence: high
    statement: >
      When items use inter-item gap spacing, the animated group must include a trailing padding equal 
      to the gap size, and the outer container must have zero gap between groups.
    rationale: >
      A gap on the outer container creates an unmeasured spatial offset during the -100% translation, 
      causing a visual jump on loop iteration. Trailing padding on the group ensures the distance between 
      the last card of Group A and the first card of Group B matches internal gap spacing exactly within the 100% width calculation.
    applies_to: [ku-006, ku-008]

  - id: ku-005
    type: constraint
    name: Inflexible Child Sizing
    source: src-01, "00:48 - 01:04, 03:33 - 03:43"
    confidence: high
    rule: >
      Child cards must have flex-grow: 0 and flex-shrink: 0 (e.g., flex: 0 0 [size]) to prevent flexbox 
      auto-shrinking within the container.
    scope: Applied to individual item elements (.card)
    consequence: >
      Without disabling flex-shrink, items compress to fit the parent width instead of overflowing horizontally.
    enforced_by: CSS flex shorthand

  - id: ku-006
    type: procedure
    name: Pure CSS Infinite Carousel Implementation
    source: src-01, "00:17 - 03:32"
    confidence: high
    goal: Construct a zero-dependency, glitch-free infinitely looping CSS marquee.
    prerequisites:
      - List of items/cards to display
    steps:
      - action: Create outer container (.carousel) with a child track group (.group) containing item elements.
        criterion: Proper DOM nesting established.
      - action: Set outer container to display: flex, overflow-x: auto (or hidden), and hide webkit scrollbars.
        criterion: Scrollable/clipped container without visible scrollbar.
      - action: Set child cards to flex: 0 0 [width] to force horizontal overflow.
        criterion: Cards retain intrinsic width without shrinking.
      - action: Define keyframe animation translating from 0 to -100% on the X-axis.
        criterion: Keyframe translates full group width.
      - action: Apply linear infinite animation to the .group class.
        criterion: Group scrolls continuously to the left.
      - action: Duplicate the .group element in HTML and mark the duplicate with aria-hidden="true".
        criterion: Duplicate fills the gap seamlessly; screen readers ignore duplicate.
      - action: Apply padding-right on .group equal to the gap size and ensure zero gap on the outer container.
        criterion: Loop transition is visual-glitch free with consistent item spacing.
    outputs:
      - Production-ready HTML/CSS infinite carousel.
    related: [ku-001, ku-002, ku-004, ku-005, ku-007, ku-008]

  - id: ku-007
    type: constraint
    name: Duplicate Accessibility Masking
    source: src-01, "02:18 - 02:27"
    confidence: high
    rule: >
      The cloned duplicate group element must carry aria-hidden="true".
    scope: HTML structure of the duplicate group
    consequence: >
      Assistive technologies will read redundant duplicate content twice.
    enforced_by: DOM attribute

  - id: ku-008
    type: counterexample
    name: Container Gap Loop Glitch
    source: src-01, "02:55 - 03:15"
    confidence: high
    scenario: >
      Developer applies gap: 1em directly to the .carousel container to space out groups.
    mistake: >
      Added spacing between groups at the parent flex container level.
    consequence: >
      The duplicate group starts 1em further right than 100% offset, causing a visible snap/jump every loop.
    correction: >
      Remove gap from .carousel. Add padding-right: 1em to .group so gap space is encapsulated inside the 100% translated width.
    teaches: >
      Translate percentages only account for element box models, not container-level flex gaps.
    illustrates: [ku-004]
```

---

## Phase 3: Methodology Synthesis

### Stage 1: Structural Markup & Accessibility Setup
- **Input**: List of child items (logos, cards, testimonials).
- **Steps**:
  1. Build a root `.carousel` container.
  2. Encapsulate items inside a `.group` wrapper.
  3. Clone the `.group` element once to create an identical adjacent group.
  4. Attach `aria-hidden="true"` to the cloned `.group`.
- **Validation**: Root contains exactly two sibling `.group` elements; secondary group has `aria-hidden="true"`.

### Stage 2: Layout & Child Rigid Sizing
- **Input**: Markup from Stage 1.
- **Steps**:
  1. Apply `display: flex` and `overflow-x: auto` (or `hidden`) on `.carousel`.
  2. Suppress scrollbar visibility (`::-webkit-scrollbar { display: none; }`).
  3. Style `.group` with `display: flex`, `align-items: center`, and `justify-content: center`.
  4. Enforce child dimensions using `flex: 0 0 <width>` on `.card` to disable shrink/grow.
- **Validation**: Cards overflow horizontally across the container without shrinking.

### Stage 3: Translation Keyframes & Loop Smoothing
- **Input**: Layout from Stage 2.
- **Steps**:
  1. Define `@keyframes` translating X from `0` to `-100%`.
  2. Assign animation to `.group` with `infinite linear` timing.
  3. Align inter-group spacing: set `gap: <size>` and `padding-right: <size>` on `.group`.
  4. Verify `.carousel` has no `gap` or inter-group margins.
- **Validation**: Zero visual jumping or stuttering at loop reset; spacing between all cards is uniform.

---

## Phase 4: Skill Compilation

Below is the compiled agent skill package.

```
css-infinite-marquee/
├── SKILL.md
└── references/
    ├── terminology.md
    └── troubleshooting.md
```

### `css-infinite-marquee/SKILL.md`

```markdown
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
```

---

### `css-infinite-marquee/references/terminology.md`

```markdown
# Terminology & CSS Specifications

**Group Wrapper**:
The direct child of the marquee container that holds one full set of items and undergoes the `@keyframes` transform.
_Avoid_: inner slider, tape track, scroll container

**Flex Shorthand (`flex: 0 0 <basis>`)**:
A combination rule specifying `flex-grow: 0` (do not expand), `flex-shrink: 0` (do not compress), and `flex-basis: <size>` (intrinsic reference width).
_Avoid_: static width, absolute box

**Trailing Gap Compensation**:
The technique of applying `padding-right` equivalent to `gap` on the translated group while keeping outer container gap at zero to preserve mathematical translation continuity.
_Avoid_: margin hack, spacer element

**Aria-Hidden Clone**:
A duplicate subtree marked with `aria-hidden="true"` so screen readers perceive only a single set of content items.
_Avoid_: accessibility shadow, invisible clone
```

---

### `css-infinite-marquee/references/troubleshooting.md`

```markdown
# Troubleshooting & Antipatterns

## Visual Jump / Stutter at Loop Reset

### Root Cause
Applying `gap` directly to `.carousel` or applying external `margin-right` to `.group`. The translation calculates `-100%` of `.group` width, ignoring parent gap.

```
INCORRECT:
.carousel {
  display: flex;
  gap: 1rem; /* ❌ Causes jump */
}

CORRECT:
.carousel {
  display: flex;
  gap: 0;
}
.group {
  gap: 1rem;
  padding-right: 1rem; /* ✅ Preserves 100% translation boundary */
}
```

---

## Cards Squeezing / Squishing on Small Screens

### Root Cause
Default flex behavior allows items to shrink (`flex-shrink: 1`).

```
INCORRECT:
.card {
  width: 200px; /* ❌ Flexbox will compress this */
}

CORRECT:
.card {
  flex: 0 0 200px; /* ✅ Disables flex-shrink */
}
```

---

## Pause on Hover (Extension)

To pause marquee motion during user interaction:

```css
.carousel:hover .group {
  animation-play-state: paused;
}
```
```

---

## Phase 5: Validation & Delivery

### Source Fidelity Matrix
- [x] **DOM Structure**: Encoded in Phase 1 (Container > Two Groups > Cards).
- [x] **Flex Sizing (`flex: 0 0 <basis>`)**: Encoded in Phase 2 & `terminology.md`.
- [x] **Overflow & Scrollbar Removal**: Encoded in Phase 2.
- [x] **Linear 0 to -100% Translate Animation**: Encoded in Phase 3.
- [x] **Accessibility (`aria-hidden="true"`)**: Encoded in Phase 1.
- [x] **Gap Alignment / Padding-right Glitch Fix**: Encoded in Phase 3 & `troubleshooting.md`.

### Operational Verification Scenarios
1. **Scenario 1: Client Logo Strip**: 8 company logos displayed horizontally across full page width.
   - *Verification*: Handled via 2 `.group` elements, `flex: 0 0 150px`, linear 20s animation.
2. **Scenario 2: Review / Testimonial Cards**: Variable length quote cards.
   - *Verification*: Handled with `flex: 0 0 350px`, `padding-right: 1.5rem`, `gap: 1.5rem`.
3. **Scenario 3: Responsive Viewport Resizing**: Mobile to desktop viewport change.
   - *Verification*: `flex-shrink: 0` prevents cards from compressing; translation scales proportionally without layout break.

### Extraction Summary
- **Total Knowledge Units Extracted**: 8 units (2 concepts, 2 principles, 2 constraints, 1 procedure, 1 counterexample).
- **Key Conflict/Glitch Resolved**: Explaining why container-level `gap` breaks loop continuity and establishing `padding-right` encapsulation as standard practice.
- **Known Limitations**: Does not cover dynamic variable-length DOM injection via JavaScript (requires equal DOM cloning).
