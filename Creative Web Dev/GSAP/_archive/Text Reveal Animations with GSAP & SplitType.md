# Source-to-Skill Compilation Report

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Video tutorial / code walkthrough |
| **Title** | Text Reveal Animations with GSAP & SplitType |
| **Authority** | Gary Simon (DesignCourse) — Veteran UI/UX designer and frontend educator |
| **Coverage** | Character splitting (`SplitType`), GSAP staggered timeline animation, CSS `clip-path` masking, line-height calibration, directional reveals |

### Coverage Gaps Identified
- Build tool / bundler integration (Vite, Webpack) is not covered directly; uses CDN `<script>` tags for demonstration.
- Responsive font scaling / dynamic viewport unit behavior across mobile breakpoints is only shown at fixed rem sizing.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# KNOWLEDGE SPEC: Text Reveal Animations with GSAP & SplitType
# ==============================================================================

- id: ku-001
  type: concept
  name: SplitType
  source: src-01, "05:35-06:55"
  confidence: high
  definition: >
    A lightweight JavaScript utility that parses DOM text nodes and splits them into
    individual nested elements for lines, words, and characters (.char).
  attributes: [DOM manipulation, character splitting, inline-block wrapping]
  avoid_terms: [text parser, letter cutter]

- id: ku-002
  type: concept
  name: GSAP Stagger
  source: src-01, "08:50-10:10"
  confidence: high
  definition: >
    A GreenSock tween property that offsets the start execution time of each target element
    in a selection array by a designated duration interval.
  attributes: [sequential timing, delay offset, animation choreography]
  avoid_terms: [delay loop, sequence interval]

- id: ku-003
  type: concept
  name: Clip-Path Masking
  source: src-01, "10:55-11:58"
  confidence: high
  definition: >
    A CSS property creating a clipping region that defines what portion of an element
    is visible while hiding anything transformed outside those polygon coordinates.
  attributes: [polygon masking, overflow clipping, viewport bounding]
  avoid_terms: [overflow hidden workaround, crop box]

- id: ku-010
  type: principle
  name: Mask Before Translate
  source: src-01, "10:55-11:58"
  confidence: high
  statement: >
    A reveal animation requires an enclosing clipping mask (`clip-path`) on the parent container
    paired with initial translateY offsets on child characters.
  rationale: >
    Without a clip region on the parent container, translateY simply moves text across the screen
    in plain view rather than revealing it across a defined threshold boundary.
  applies_to: [ku-020, ku-022]

- id: ku-011
  type: principle
  name: Line-Height Boundary Calibration
  source: src-01, "12:00-12:45"
  confidence: high
  statement: >
    Default font line-height creates invisible padding inside the clip region, creating an unnatural
    gap before characters emerge into view. Adjust line-height to fit the font cap-height tightly.
  rationale: >
    Tighter line-height ensures characters emerge immediately at the clipping threshold without dead space.
  applies_to: [ku-021, ku-022]

- id: ku-020
  type: procedure
  name: DOM and SplitType Initialization
  source: src-01, "01:40-06:55"
  confidence: high
  goal: Structure HTML element and split target text into individual character nodes
  prerequisites: [HTML container created, GSAP and SplitType libraries loaded]
  steps:
    - action: Assign an explicit selector (ID or class) to the text heading element
      criterion: Target element exists in DOM with accessible ID/class
    - action: Load GSAP 3 and SplitType via CDN script tags or package imports
      criterion: `gsap` and `SplitType` namespaces are available in JavaScript execution context
    - action: Instantiate `new SplitType('#target-selector')`
      criterion: DOM tree reflects nested `.line`, `.word`, and `.char` child nodes
  outputs: [Character-split DOM structure]

- id: ku-021
  type: procedure
  name: CSS Mask and Initial Transform Setup
  source: src-01, "10:10-12:45"
  confidence: high
  goal: Establish the parent clip boundaries and offset the initial character positions
  prerequisites: [SplitType initialization active]
  steps:
    - action: Apply `clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%)` to the parent container
      criterion: Container forms a strict 4-point bounding mask
    - action: Set initial character translation `transform: translateY(115px)` (or negative for top-down) on `.char`
      criterion: Characters are positioned entirely outside the parent clipping polygon by default
    - action: Fine-tune parent `line-height` below font-size (e.g., `5.9rem` on `7rem` font)
      criterion: Clipping boundary sits directly adjacent to font glyphs
  outputs: [Masked and offset CSS layout]

- id: ku-022
  type: procedure
  name: GSAP Tween Execution
  source: src-01, "08:50-10:10"
  confidence: high
  goal: Animate character elements into the visible clipping mask with stagger timing
  prerequisites: [Initial CSS transform and clip-path applied]
  steps:
    - action: Define `gsap.to('.char', { y: 0, stagger: 0.05, delay: 0.2, duration: 0.1 })`
      criterion: GSAP clears translation offset sequentially per character
    - action: Configure optional easings or reverse directions as needed
      criterion: Reveal executes cleanly without visual clipping glitches
  outputs: [Staggered text reveal animation]

- id: ku-030
  type: constraint
  name: Character Display Property Invariant
  source: src-01, "08:30-08:50"
  confidence: high
  rule: >
    Character nodes must have `display: inline-block` (applied automatically by SplitType)
    to respond to CSS `transform: translateY()` calls.
  scope: CSS transform execution
  consequence: Inline elements (`display: inline`) ignore vertical transform properties.
  enforced_by: SplitType inline-block injection

- id: ku-040
  type: example
  name: Bottom-Up Staggered Text Reveal
  source: src-01, "00:05-12:45"
  confidence: high
  scenario: Revealing brand typography or heading text on page load
  application: >
    Parent H1 clipped with polygon mask; .char elements translated Y: 115px; GSAP tweens y to 0 with 0.05s stagger.
  outcome: Smooth, high-impact sequential letter slide-in.

- id: ku-041
  type: example
  name: Top-Down Inverted Reveal
  source: src-01, "12:45-12:57"
  confidence: high
  scenario: Inverted text slide-in for UI transition variants
  application: >
    Initial character translation set to `translateY(-115px)`; GSAP tweens y to 0.
  outcome: Letters drop downward into the masked container sequentially.
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Setup & Target Markup
INPUT: Text content and DOM container
STEPS:
1. Wrap typography in a designated container element with a distinct ID/class.
2. Load GSAP 3 and SplitType libraries.
VALIDATION:
[ ] Target text element exists in DOM.
[ ] SplitType and GSAP scripts are loaded and executable.

STAGE 2: DOM Character Segmentation
INPUT: Target DOM text node
STEPS:
1. Instantiate `new SplitType('#selector')`.
2. Inspect DOM to verify target characters are converted into `.char` elements.
VALIDATION:
[ ] DOM contains `.char` elements for every glyph.
[ ] Each `.char` has `display: inline-block`.

STAGE 3: Masking & Transform Offsetting
INPUT: Segmented character nodes
STEPS:
1. Apply rectangular `clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%)` to parent heading.
2. Calibrate parent `line-height` to eliminate excess vertical bounding space.
3. Apply initial `transform: translateY(distance)` on `.char` to hide characters outside the clipping mask.
DECISION POINTS:
- If revealing from bottom → set initial `translateY(positiveDistance)` (e.g. `115px`).
- If revealing from top → set initial `translateY(negativeDistance)` (e.g. `-115px`).
VALIDATION:
[ ] Characters are hidden outside the clipping polygon on initial render.
[ ] Clipping boundary tightly frames the typography without dead space.

STAGE 4: Staggered Tween Execution
INPUT: Masked and translated characters
STEPS:
1. Configure `gsap.to('.char', { y: 0, stagger, delay, duration, ease })`.
2. Adjust stagger duration (typically `0.03s` - `0.08s`) for desired fluidity.
VALIDATION:
[ ] Letters sequentially enter view within the clipping window.
[ ] Final letter positions align at baseline `y: 0`.
```

---

## Phase 4: Skill Compilation

Below is the complete compiled skill package ready for deployment.

### File: `text-reveal-animation/SKILL.md`

```markdown
---
name: text-reveal-animation
description: |
  Implement high-performance, staggered character-level text reveal animations using
  SplitType, GSAP (GreenSock), and CSS clip-path masking.
  Use when building page-load headlines, animated logos, UI card hovers, or hero text reveals.
  Triggers: text reveal animation, split text animation, gsap text reveal, character stagger reveal,
  kinetic typography, clip-path text reveal.
---

# Text Reveal Animation

Implement staggered kinetic text reveals by splitting typography into discrete character nodes, masking the parent boundary via CSS `clip-path`, and animating character transforms using GSAP.

For domain terminology, see [terminology.md](references/terminology.md).
For complete implementation templates and variants, see [examples.md](references/examples.md).

## Phase 1: Environment & Markup Setup

Structure the target HTML element and import the required animation and splitting engines.

1. Create the semantic container element (`<h1>`, `<h2>`, or `<div>`) and assign a unique ID or selector.
2. Import GSAP 3 core and SplitType into your project runtime:
   - **CDN**:
     ```html
     <script src="https://unpkg.com/split-type"></script>
     <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.2/gsap.min.js"></script>
     ```
   - **NPM / ESM**:
     ```javascript
     import gsap from 'gsap';
     import SplitType from 'split-type';
     ```

### Completion gate
- [ ] Target element is defined in DOM with an explicit selector.
- [ ] `gsap` and `SplitType` are loaded without console errors.

---

## Phase 2: Parent Masking & Character Offsetting

Establish the clipping window and set the initial hidden state for character elements.

1. Apply a 4-point polygon clipping path to the parent text element:
   ```css
   .reveal-target {
     clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
     line-height: 0.85em; /* Calibrate tightly to cap-height */
   }
   ```
2. Define the starting translation on character elements:
   ```css
   .char {
     transform: translateY(115px);
     transition: transform 0.5s;
   }
   ```

### Decision Points:
- **Bottom-up Reveal**: Set `.char { transform: translateY(115px); }` (positive offset).
- **Top-down Reveal**: Set `.char { transform: translateY(-115px); }` (negative offset).
- **Custom Angular Reveal**: Adjust `clip-path: polygon(...)` coordinates to create angled masks.

### Completion gate
- [ ] Parent element has an active `clip-path` bounding box.
- [ ] Parent `line-height` is reduced to eliminate dead space between font and mask border.
- [ ] `.char` starting transform moves characters completely outside the clipping mask.

---

## Phase 3: Character Splitting & GSAP Execution

Segment text into individual character DOM nodes and trigger the staggered GSAP tween.

1. Instantiate `SplitType` on the target selector:
   ```javascript
   const textInstance = new SplitType('#target-element', { types: 'lines,words,chars' });
   ```
2. Trigger the GSAP tween targeting the generated `.char` class:
   ```javascript
   gsap.to('.char', {
     y: 0,
     stagger: 0.05,
     delay: 0.2,
     duration: 0.1,
     ease: 'power2.out'
   });
   ```

### Completion gate
- [ ] `SplitType` successfully inserts `.char` wrappers with `display: inline-block`.
- [ ] GSAP tween resets `y` translation to `0` in sequential order.
- [ ] Characters are visible only when inside the parent `clip-path` boundaries.
```

---

### File: `text-reveal-animation/references/terminology.md`

```markdown
# Terminology

**SplitType**:
A JavaScript library that parses text within a DOM element and wraps lines, words, and individual characters into separate `<div>` or `<span>` nodes for animation targeting.
_Avoid_: text parser, string slicer

**CSS Clip-Path**:
A CSS property that sets a specific clipping region (such as a polygon or rectangle). Visual pixels falling outside this region are hidden from the viewport.
_Avoid_: overflow cutter, crop wrapper

**GSAP (GreenSock Animation Platform)**:
A high-performance JavaScript animation suite used to manipulate DOM properties, transforms, and timing sequences.
_Avoid_: CSS timer, DOM script animator

**Stagger**:
A timing parameter in multi-target tweens that offsets the starting point of each subsequent element in the selection array.
_Avoid_: loop delay, frame offset

**Line-Height Calibration**:
The practice of reducing font line-height to match glyph cap-height, preventing empty buffer zones within CSS clip masks.
_Avoid_: vertical padding hack
```

---

### File: `text-reveal-animation/references/examples.md`

```markdown
# Examples & Implementation Patterns

## Example 1: Standard Bottom-Up Staggered Text Reveal

**Scenario**: Hero headline reveal on initial page load.

### HTML
```html
<header>
  <h1 id="headline">Gary.Simon</h1>
</header>

<script src="https://unpkg.com/split-type"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.2/gsap.min.js"></script>
```

### CSS (`main.css`)
```css
header {
  display: grid;
  place-content: center;
  height: 100vh;
}

h1 {
  font-size: 7rem;
  text-transform: uppercase;
  font-family: 'Bebas Neue', sans-serif;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  line-height: 5.9rem;
}

.char {
  transform: translateY(115px);
  transition: transform 0.5s;
}
```

### JavaScript
```javascript
const myText = new SplitType('#headline');

gsap.to('.char', {
  y: 0,
  stagger: 0.05,
  delay: 0.2,
  duration: 0.1
});
```

---

## Example 2: Inverted Top-Down Reveal

**Scenario**: Downward letter entrance for secondary headings or hover states.

### CSS Alteration
```css
.char {
  transform: translateY(-115px);
}
```

### JavaScript
```javascript
const myText = new SplitType('#subhead');

gsap.to('.char', {
  y: 0,
  stagger: 0.04,
  delay: 0.1,
  duration: 0.15,
  ease: 'back.out(1.7)'
});
```
```

---

## Phase 5: Validation

### Source Fidelity Check
- [x] `SplitType` DOM character extraction procedure fully encoded (`Phase 1` & `Phase 3`).
- [x] CSS `clip-path` bounding box technique encoded (`Phase 2`).
- [x] Line-height calibration requirement to prevent dead space gaps preserved (`Phase 2` & `terminology.md`).
- [x] GSAP `.to()` stagger configuration with `y: 0` target operationalized (`Phase 3` & `examples.md`).
- [x] Top-down vs bottom-up directional branching captured (`Phase 2 Decision Points`).

### Scenario Walkthroughs

1. **Scenario 1: Large Display Headline Reveal**
   - Developer imports GSAP/SplitType, adds `#hero-title` with `clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%)`, tunes `line-height`, runs `new SplitType('#hero-title')` and `gsap.to('.char', { y: 0, stagger: 0.05 })`.
   - *Result*: Clean reveal from bottom across the clipping edge.

2. **Scenario 2: Drop-Down Text Reveal Variant**
   - Developer changes starting transform to `translateY(-115px)` and configures GSAP ease.
   - *Result*: Letters drop down into view sequentially.

---

## Delivery Summary

- **Extracted Units**: 3 Concepts, 2 Principles, 3 Procedures, 1 Constraint, 2 Examples.
- **Compiled Package**:
  - `SKILL.md` (Operational methodology, under 500 lines, imperative form)
  - `references/terminology.md` (Domain terms with definitions and anti-synonyms)
  - `references/examples.md` (Worked code examples for bottom-up and top-down variants)
- **Known Limitations**: SplitType operates on client DOM load; server-side rendering (SSR) requires hydration before calling `new SplitType()`.
