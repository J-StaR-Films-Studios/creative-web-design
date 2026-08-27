# Source-to-Skill Compilation: GSAP Text Reveal Animation

---

## Phase 1: Source Inventory

### Inventory Table

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / video tutorial |
| **Title** | Creative GSAP Text Reveal Animation Tutorial (GSAP 3 & SplitText Plugin) |
| **Authority** | Web animation practitioner / frontend development instructor |
| **Coverage** | GSAP 3 installation via CDN, SplitText plugin registration, text element DOM splitting (lines, words, characters), tween creation with `gsap.from()`, duration/transform/opacity properties, and simple vs. advanced stagger configurations (`each`, `from: "start" | "end" | "center" | "random"`). |

### Coverage Gaps Identified
- SplitText revert / cleanup on window resize or component unmount (not covered in source).
- Commercial licensing note for Club GSAP SplitText vs CDN evaluation (briefly mentioned on website in video, but implementation focuses on CDN script inclusion).

---

## Phase 2: Knowledge Extraction (Intermediate Representation)

```yaml
spec_version: "1.0"
source: "src-01"

concepts:
  - id: ku-001
    type: concept
    name: SplitText Plugin
    source: src-01, "01:30 - 04:35"
    confidence: high
    definition: >
      A GSAP utility plugin that decomposes standard HTML text nodes into nested 
      DOM elements corresponding to lines, words, and individual characters for granular animation.
    attributes:
      - lines (line breaks/containers)
      - words (word containers)
      - chars (individual character containers)
    avoid_terms: [string slicer, css text splitter, manual span wrapper]
    related: [ku-002, ku-004]

  - id: ku-002
    type: concept
    name: Stagger Property
    source: src-01, "08:20 - 10:35"
    confidence: high
    definition: >
      A GSAP timing property that offsets the start time of animations across 
      an array of targets sequentially or according to origin coordinates/distributions.
    attributes:
      - each / amount (interval timing)
      - from ("start", "end", "center", "random", or indexed)
    avoid_terms: [animation delay loop, settimeout stagger]
    related: [ku-005, ku-006]

procedures:
  - id: ku-010
    type: procedure
    name: Environment & CDN Setup
    source: src-01, "00:28 - 02:15"
    confidence: high
    goal: Link GSAP Core and SplitText libraries into HTML document
    prerequisites:
      - Basic HTML structure with a target text element
    steps:
      - action: Add CSS styling to ensure consistent layout and font sizing
        criterion: Target text element has explicit class, font sizing, and container styling
      - action: Load GSAP core via script tag
        criterion: gsap.min.js CDN loaded prior to application script
      - action: Load SplitText plugin via script tag
        criterion: SplitText.min.js CDN loaded immediately after gsap.min.js
      - action: Load application script.js after plugin scripts
        criterion: Custom script loaded after all library dependencies
    outputs:
      - Configured index.html with GSAP CDN dependencies

  - id: ku-011
    type: procedure
    name: Plugin Registration and Text Splitting
    source: src-01, "02:40 - 05:50"
    confidence: high
    goal: Initialize SplitText on target DOM elements after DOM load
    prerequisites:
      - ku-010 (GSAP and SplitText loaded in HTML)
    steps:
      - action: Wrap script execution in DOMContentLoaded event listener
        criterion: Script does not execute before DOM elements are rendered
      - action: Register SplitText with GSAP using gsap.registerPlugin(SplitText)
        criterion: SplitText is recognized by GSAP core instance
      - action: Instantiate SplitText with target selector and type configuration
        criterion: SplitText.create() executed with selected types (lines, words, chars)
    outputs:
      - SplitText instance containing .lines, .words, and .chars arrays

  - id: ku-012
    type: procedure
    name: Entrance Animation Configuration
    source: src-01, "05:52 - 10:40"
    confidence: high
    goal: Animate split text elements using gsap.from with directional offset, opacity, and stagger
    prerequisites:
      - ku-011 (SplitText instance initialized)
    steps:
      - action: Select target split array (split.lines, split.words, or split.chars)
        criterion: Target matches intended animation granularity
      - action: Configure gsap.from() tween with transform offset (y), opacity, and duration
        criterion: Starting values define entrance state (e.g. y: 30, opacity: 0)
      - action: Configure stagger behavior (numeric interval or object with each and from)
        criterion: Stagger defines sequence order ('start', 'end', 'center', or 'random')
    outputs:
      - Running GSAP text reveal animation

principles:
  - id: ku-020
    type: principle
    name: Prefer gsap.from Over gsap.to for Entrance Reveals
    source: src-01, "07:40 - 08:02"
    confidence: high
    statement: >
      Use gsap.from() for initial reveal animations rather than gsap.to().
    rationale: >
      gsap.from() sets initial inline styles to the starting values and animates 
      to the natural resting state defined in CSS. Using gsap.to() requires setting 
      hidden/offset CSS upfront, risking flash of unstyled content or reversed logic.
    applies_to: [ku-012]

  - id: ku-021
    type: principle
    name: Match Split Type to Design Scope
    source: src-01, "05:10 - 05:50"
    confidence: high
    statement: >
      Declare only the split types ("lines", "words", "chars") needed for the animation target.
    rationale: >
      Enabling unnecessary split types generates redundant nested div elements in the DOM. 
      If animating only words, declare type: "words".
    applies_to: [ku-011, ku-012]

constraints:
  - id: ku-030
    type: constraint
    name: Script Load Order Precedence
    source: src-01, "02:00 - 02:45"
    confidence: high
    rule: >
      Load GSAP core first, then SplitText plugin, then application script.
    scope: HTML script inclusion
    consequence: >
      Loading SplitText before GSAP or application script before libraries causes ReferenceError.
    enforced_by: Dependency structure in HTML head/body.

examples:
  - id: ku-040
    type: example
    name: Character Reveal with Random Stagger
    source: src-01, "09:40 - 10:35"
    confidence: high
    scenario: Text character reveal with organic/random timing
    application: >
      gsap.from(split.chars, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: { each: 0.1, from: "random" }
      });
    outcome: Text characters appear from below randomly until the full title is legible.
    teaches: Advanced stagger object configuration with origin distribution.
    illustrates: [ku-002, ku-012]
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Environment & Markup Setup
INPUT: Target typography content and styling specs
STEPS:
  1. Define HTML markup with a specific reveal class on typography containers.
  2. Define CSS base styling (font size, weight, alignment, viewport dimensions).
  3. Include GSAP 3 core CDN followed by SplitText CDN before application script.
OUTPUT: DOM ready for GSAP execution with required external libraries.
VALIDATION:
  [ ] GSAP and SplitText script tags exist in correct sequence.
  [ ] Target text container has class hook.

STAGE 2: Initialization & Text Splitting
INPUT: Loaded DOM and GSAP library objects
STEPS:
  1. Bind execution to DOMContentLoaded.
  2. Call gsap.registerPlugin(SplitText).
  3. Call SplitText.create(selector, { type: "lines, words, chars" }).
OUTPUT: SplitText object providing array handles (.lines, .words, .chars).
VALIDATION:
  [ ] Plugin registered without console warnings.
  [ ] SplitText instance exposes selected target arrays.

STAGE 3: Tween Construction & Stagger Tuning
INPUT: SplitText instance arrays and animation parameters
STEPS:
  1. Select target array (`split.lines`, `split.words`, or `split.chars`).
  2. Call `gsap.from()` passing target, transform offsets (`y`), `opacity`, and `duration`.
  3. Attach `stagger` property (scalar number or object `{ each, from }`).
OUTPUT: Fully operational text reveal animation.
VALIDATION:
  [ ] gsap.from is used instead of gsap.to.
  [ ] Stagger values produce desired sequential or origin-based cadence.
```

---

## Phase 4 & 5: Skill Compilation & Delivery

Here is the complete compiled skill package ready for deployment.

```
gsap-text-reveal/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

---

### File: `gsap-text-reveal/SKILL.md`

```markdown
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
```

---

### File: `gsap-text-reveal/references/terminology.md`

```markdown
# Terminology

**SplitText**:
A specialized GSAP plugin that breaks text content inside HTML elements into nested inline-block `div` wrappers representing lines, words, and characters while preserving accessibility attributes.
_Avoid_: text chopper, CSS span slicer, DOM string parser

**gsap.from()**:
A GSAP tween method that defines the initial starting values of target properties, animating them towards their default CSS rendered state.
_Avoid_: gsap.to entrance, reverse tweening

**Stagger**:
A timing controller in GSAP that introduces an incremental delay between each element in an array of animation targets.
_Avoid_: loop delay, keyframe delay, setTimeout cascade

**Split Types**:
The granularity levels specified during SplitText initialization: `lines`, `words`, and `chars`.
_Avoid_: text tokens, character nodes
```

---

### File: `gsap-text-reveal/references/examples.md`

```markdown
# Worked Examples

## Example 1: Basic Line-by-Line Reveal

**Scenario**: A clean paragraph or heading reveal where lines slide up smoothly.

```html
<h1 class="reveal-text">Creative GSAP Text Reveal</h1>

<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(SplitText);

    let split = SplitText.create(".reveal-text", { type: "lines" });

    gsap.from(split.lines, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    });
  });
</script>
```

**Outcome**: Lines slide up sequentially from 30px offset with a 0.2s delay between lines.

---

## Example 2: Word-by-Word Reveal with Center Origin

**Scenario**: A bold headline revealing outward from the center word.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

  let split = SplitText.create(".reveal-text", { type: "words" });

  gsap.from(split.words, {
    y: 25,
    opacity: 0,
    duration: 0.7,
    stagger: {
      each: 0.15,
      from: "center"
    }
  });
});
```

**Outcome**: Middle words animate first, cascading outward to the start and end words.

---

## Example 3: Character-by-Character Random Reveal

**Scenario**: A stylized title effect where characters fade and rise randomly.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

  let split = SplitText.create(".reveal-text", { type: "chars" });

  gsap.from(split.chars, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: {
      each: 0.05,
      from: "random"
    }
  });
});
```

**Outcome**: Individual characters pop in randomly across the text block until fully legible.
```

---

## Delivery Summary

1. **Extraction Count**:
   - 2 Concepts (`SplitText Plugin`, `Stagger Property`)
   - 3 Procedures (`Environment & CDN Setup`, `Plugin Registration and Text Splitting`, `Entrance Animation Configuration`)
   - 2 Principles (`Prefer gsap.from Over gsap.to`, `Match Split Type to Design Scope`)
   - 1 Constraint (`Script Load Order Precedence`)
   - 1 Worked Example extracted directly from demonstration
2. **Key Methodology Encoded**:
   - Explicit script inclusion order for GSAP core, SplitText, and app script.
   - Decomposing text using `SplitText.create()`.
   - Tween construction using `gsap.from()`.
   - Direct numerical vs. object-based stagger configurations (`from: 'start' | 'end' | 'center' | 'random'`).
3. **Artifacts Produced**:
   - `SKILL.md` (under 500 lines, imperative, completion-gate governed)
   - `references/terminology.md`
   - `references/examples.md`
