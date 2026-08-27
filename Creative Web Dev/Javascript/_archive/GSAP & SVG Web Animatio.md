# Source-to-Skill Compilation: GSAP & SVG Web Animation

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / transcript |
| **Title** | The Ultimate JavaScript Animation Course — Chapter 2: Cookie Pop-up Animation |
| **Authority** | DevelopedByEd (Ed) — Senior frontend developer, UI/UX educator, course creator |
| **Coverage** | SVG layer preparation in Figma, inline SVG integration, CSS UI modal architecture, GSAP installation via CDN, GSAP `to`/`fromTo` tweens, GSAP Timelines (`timeline()`), positioning parameters (`<`, `<50%`), custom easing (`elastic.out`, `power1.out`), infinite yoyo looping (`repeat: -1`, `yoyo: true`), interactive dismissal handlers, SVG clipping/overflow troubleshooting. |

### Coverage Gaps Identified
- npm/bundler-based GSAP installation (source covers CDN script inclusion).
- Multi-breakpoint responsive layouts for complex SVG modals (source focuses on desktop viewport scaling).

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# KNOWLEDGE SPEC: GSAP & SVG Web Animation Methodology
# ==============================================================================

- id: ku-001
  type: concept
  name: Inline SVG for Animation
  source: src-01, "10:30-14:43"
  confidence: high
  definition: >
    Embedding complete SVG XML markup directly into the HTML DOM rather than referencing it via an <img> tag.
  attributes: [direct DOM access, sub-element targetability, CSS styling inheritance]
  avoid_terms: [embedded image, external SVG asset]
  related: [ku-002, ku-011]

- id: ku-002
  type: concept
  name: GSAP Timeline
  source: src-01, "40:08-41:30"
  confidence: high
  definition: >
    A container tool in GreenSock (gsap.timeline) that orchestrates sequences of tweens, managing execution order, timing offsets, and global defaults.
  attributes: [synchronization, default parameter inheritance, position parameters]
  avoid_terms: [animation queue, timeout chain]
  related: [ku-012, ku-023]

- id: ku-003
  type: concept
  name: Timeline Position Parameter
  source: src-01, "53:00-56:00"
  confidence: high
  definition: >
    A syntax argument passed to timeline tweens (e.g., '<', '<50%', '+=1') that dictates exact playback timing relative to other tweens.
  attributes: [overlap timing, relative alignment, parallel execution]
  avoid_terms: [delay offset, step timer]
  related: [ku-002, ku-023]

- id: ku-010
  type: principle
  name: Decompose Vectors Before DOM Injection
  source: src-01, "05:45-10:30"
  confidence: high
  statement: >
    Isolate, group, and name every animatable vector component in a design editor (Figma/Illustrator) prior to copying SVG markup into code.
  rationale: >
    Once pasted as raw path coordinates in HTML, identifying and grouping nested sub-shapes is error-prone. Semantic naming in Figma automatically produces clean SVG IDs/classes.
  applies_to: [ku-020, ku-021]

- id: ku-011
  type: principle
  name: Inline SVG Over Image Tags for Micro-Animations
  source: src-01, "14:00-14:40"
  confidence: high
  statement: >
    Never use <img> or CSS background-image tags when individual SVG paths need animation. Inject inline SVG markup.
  rationale: >
    Browser security boundaries encapsulate <img> tags in a separate document context, rendering internal paths inaccessible to JavaScript and CSS selectors.
  applies_to: [ku-021]

- id: ku-012
  type: principle
  name: Centralize Timing Defaults in Timelines
  source: src-01, "40:30-41:15"
  confidence: high
  statement: >
    Define shared duration and easing functions in the timeline constructor defaults object rather than repeating them on individual tweens.
  rationale: >
    Maintains choreographic consistency across multi-stage animations and enables single-point duration adjustments.
  applies_to: [ku-023]

- id: ku-020
  type: procedure
  name: SVG Layer Dissection in Figma
  source: src-01, "05:45-10:30"
  confidence: high
  goal: Prepare and isolate independent SVG sub-components for programmatic animation.
  prerequisites: [Raw SVG vector downloaded]
  steps:
    - action: Import raw SVG into a standard reference canvas/frame (e.g., 1920x1080).
      criterion: Vector is visible and centered at design scale.
    - action: Scale vector proportionally using Shift + Alt/Option.
      criterion: Aspect ratio and center point are preserved.
    - action: Double-click vector to inspect nested vector path hierarchy.
      criterion: Individual vector paths are exposed.
    - action: Select sub-paths that require independent animation and group them into distinct parent groups.
      criterion: Target elements are isolated in dedicated group folders.
    - action: Assign semantic names to each group folder (e.g., `cookie`, `crumbs`).
      criterion: Layer names reflect their role in the animation choreography.
    - action: Export SVG with "Include 'id' attribute" enabled, or right-click group and select "Copy as SVG".
      criterion: Resulting SVG string contains explicit `id="[group-name]"` tags.
  outputs: [Structured SVG markup with semantic IDs]
  related: [ku-001, ku-010]

- id: ku-021
  type: procedure
  name: Modal UI Scaffold & SVG Embedding
  source: src-01, "14:43-23:30"
  confidence: high
  goal: Assemble accessible HTML DOM structure and layout styling for modal popups.
  prerequisites: [Structured SVG markup ready]
  steps:
    - action: Create modal wrapper element with semantic container class (`.cookie-container`).
      criterion: Container element wraps both visual graphic and content sections.
    - action: Paste raw SVG code directly inside container and assign a top-level CSS class (`.cookie`).
      criterion: SVG DOM elements render inline within the HTML file.
    - action: Add textual content and action controls (`.text`, `h2.cookie-title`, `p.cookie-subtitle`, `button`).
      criterion: All content elements are present with semantic class names.
    - action: Style wrapper with absolute centering (`position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`).
      criterion: Modal card is centered regardless of viewport dimensions.
    - action: Apply flexbox layout (`display: flex; align-items: center; justify-content: space-between;`) and styling rules.
      criterion: Graphic and text columns sit side-by-side cleanly.
  outputs: [Complete HTML/CSS modal interface]
  related: [ku-001, ku-011]

- id: ku-022
  type: procedure
  name: GSAP Integration & CDN Setup
  source: src-01, "35:55-38:00"
  confidence: high
  goal: Load GSAP core engine before application scripts.
  prerequisites: [HTML boilerplate constructed]
  steps:
    - action: Fetch latest GSAP CDN script tag from CDN provider (e.g., cdnjs).
      criterion: Valid script URL pointing to `gsap.min.js`.
    - action: Paste GSAP `<script>` tag immediately before closing `</body>` tag and above local `app.js`.
      criterion: Global `gsap` object is accessible when `app.js` runs.
  outputs: [Active GSAP execution environment]
  related: [ku-002]

- id: ku-023
  type: procedure
  name: Orchestrating Entrance, Looping, and Exit Animations
  source: src-01, "40:08-57:50"
  confidence: high
  goal: Sequence complex multi-element entrance tweens, persistent idle animations, and user dismissal.
  prerequisites: [GSAP loaded, UI DOM rendered]
  steps:
    - action: Instantiate timeline with shared defaults: `const tl = gsap.timeline({ defaults: { duration: 0.75, ease: 'power1.out' } });`.
      criterion: Timeline instance created.
    - action: Animate modal container entrance using scale `fromTo` with elastic easing: `tl.fromTo('.cookie-container', { scale: 0 }, { scale: 1, ease: 'elastic.out(1, 0.4)', duration: 1.5 });`.
      criterion: Container pops into view with natural bounce.
    - action: Animate main graphic slide and rotation with position overlap: `tl.fromTo('.cookie', { opacity: 0, x: -50, rotation: '-45deg' }, { opacity: 1, x: 0, rotation: '0deg' }, '<50%');`.
      criterion: Graphic enters halfway through container entrance.
    - action: Animate textual content entrance in sync with graphic: `tl.fromTo('.text', { x: 30, opacity: 0 }, { x: 0, opacity: 1 }, '<');`.
      criterion: Text fades and slides in simultaneously with the graphic.
    - action: Chain infinite idle loop using `yoyo: true` and `repeat: -1` on graphic and sub-elements.
      criterion: Graphic floats/rotates continuously after entrance completes.
    - action: Attach click listener to dismissal button firing closing tween (`opacity: 0, y: 100`).
      criterion: Clicking button smoothly transitions modal out of viewport.
  outputs: [Fully animated interactive UI modal]
  related: [ku-002, ku-003, ku-012]

- id: ku-030
  type: constraint
  name: SVG Transform Overflow Invariant
  source: src-01, "57:50-59:24"
  confidence: high
  rule: >
    SVG elements animated with translation or rotation transforms that exceed initial bounding boxes MUST have CSS `overflow: visible;` and any internal `<clipPath>` tags wrapping transformed groups removed.
  scope: Inline SVG animations with transforms.
  consequence: >
    Browser clips rotated or translated vector paths at the SVG canvas boundaries, causing visual clipping bugs.
  enforced_by: CSS rule `.cookie { overflow: visible; }` and SVG XML inspection.

- id: ku-050
  type: counterexample
  name: SVG Encapsulation Failure
  source: src-01, "14:00-14:40"
  confidence: high
  scenario: Attempting to animate sub-paths of an SVG embedded via `<img src="cookie.svg">`.
  mistake: Developer targeted `#crumbs` inside `app.js` using `document.querySelector('#crumbs')` on an external image tag.
  consequence: JavaScript query returned `null`, preventing GSAP from binding tweens to internal paths.
  correction: Replace `<img>` tag with direct inline `<svg>` code.
  teaches: Programmatic manipulation of vector paths requires DOM-level inline inclusion.
  illustrates: [ku-001, ku-011]
```

---

## Phase 3: Methodology Synthesis

### Operational Workflow

```
[Design Phase]           [Markup & Styling Phase]         [Animation Phase]
1. Vector Dissection  →  2. Inline Scaffold & CSS    →   3. GSAP Timeline & Tweening
   - Group sub-paths        - Inline <svg> injection        - Container entrance (Elastic)
   - Assign semantic IDs    - Absolute centering            - Parallel graphic/text (Position tags)
   - Export XML markup      - Overflow: visible             - Infinite idle yoyo loop
                                                            - Interactive exit handler
```

---

## Phase 4: Skill Compilation

Below is the complete, validated skill package ready for deployment.

### File Structure
```
gsap-svg-animation/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

---

### `gsap-svg-animation/SKILL.md`

```markdown
---
name: gsap-svg-animation
description: |
  Design, scaffold, and code high-performance SVG and UI micro-animations using GSAP 3 Timelines,
  vector dissection workflows in Figma, and CSS layout architecture.
  Triggers: gsap animation, svg animation, animate modal, animate popup, gsap timeline,
  vector micro-animation, figma to svg code, interactive dismissal animation.
---

# GSAP & SVG Web Animation

Orchestrate smooth, responsive web animations using Figma vector preparation, inline SVG DOM injection, and GreenSock Animation Platform (GSAP 3) Timelines.

For domain terms and canonical vocabulary, see [terminology.md](references/terminology.md).
For worked code examples and interactive patterns, see [examples.md](references/examples.md).

---

## Phase 1: Vector Asset Dissection & Optimization

Isolate animatable vector components before writing code.

1. **Import vector into Figma**: Place raw SVG on a standard reference frame (e.g., 1920×1080).
2. **Scale proportionally**: Hold `Shift + Option` (or `Shift + Alt`) to scale the vector from its center without distorting aspect ratios.
3. **Decompose sub-paths**: Double-click the vector group to reveal individual vector paths.
4. **Group animatable components**: Group paths into distinct layers based on animation choreography (e.g., separate floating crumbs, rotating icons, or bouncing parts from the base body).
5. **Assign semantic names**: Name every layer group descriptively in Figma (`cookie`, `crumbs`).
6. **Export with IDs**: Right-click the element and select **Copy as SVG**, or export with `Include "id" attribute` enabled to retain semantic group selectors in code.

### Completion Gate
- [ ] Every independently animatable element lives in a dedicated group folder.
- [ ] Layer group names use clean kebab-case or single-word identifiers.
- [ ] Exported SVG contains explicit `id="..."` attributes for every target group.

---

## Phase 2: DOM Scaffolding & Layout Architecture

Build the HTML/CSS foundation for the animated component.

1. **Inject inline SVG**: Paste SVG markup directly into HTML inside a semantic wrapper (`.cookie-container`). Never load SVG via `<img>` tags when sub-path animation is required.
2. **Add typography and UI controls**: Structure textual headers (`.cookie-title`), descriptions (`.cookie-subtitle`), and action triggers (`button`).
3. **Set CSS layout resets**:
   ```css
   * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
   }
   ```
4. **Center modal viewport**: Apply absolute centering to the root wrapper:
   ```css
   .cookie-container {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
   }
   ```
5. **Prevent SVG edge clipping**: Apply `overflow: visible;` to the animated SVG class and remove any wrapping `<clipPath>` tags inside the `<defs>` section that constrain rotational or translational overshoot.

### Completion Gate
- [ ] SVG markup is directly in the DOM tree.
- [ ] Modal layout is centered using CSS transforms.
- [ ] SVG class has `overflow: visible;` defined in CSS.

---

## Phase 3: GSAP Core Engine Setup

Load GreenSock before application logic.

1. **Load GSAP core via CDN**: Include the GSAP 3 bundle immediately before the closing `</body>` tag:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
   <script src="./app.js"></script>
   ```
2. **Verify global object**: Confirm `window.gsap` is available before running tween initialization in `app.js`.

### Completion Gate
- [ ] GSAP script precedes local script file.
- [ ] `gsap` global object initializes without errors in the browser console.

---

## Phase 4: Choreographing Timelines & Micro-Animations

Sequence multi-stage entrances, infinite idle states, and dismissal actions.

1. **Instantiate timeline with defaults**: Define global timing and easing to avoid repetitive code:
   ```javascript
   const tl = gsap.timeline({
     defaults: { duration: 0.75, ease: "power1.out" }
   });
   ```
2. **Animate container entrance**: Use `fromTo` with elastic overshoot for natural entry:
   ```javascript
   tl.fromTo('.cookie-container', { scale: 0 }, { scale: 1, ease: "elastic.out(1, 0.4)", duration: 1.5 });
   ```
3. **Overlap graphic entrance**: Use relative position parameter `<50%` to start graphic entry halfway through container scaling:
   ```javascript
   tl.fromTo('.cookie', { opacity: 0, x: -50, rotation: '-45deg' }, { opacity: 1, x: 0, rotation: '0deg' }, '<50%');
   ```
4. **Synchronize text entrance**: Use `<` to run text entrance in parallel with the graphic:
   ```javascript
   tl.fromTo('.text', { x: 30, opacity: 0 }, { x: 0, opacity: 1 }, '<');
   ```
5. **Implement infinite idle loop**: Chain persistent floating/bouncing micro-animations:
   ```javascript
   tl.fromTo('.cookie', { y: 0, rotation: '0deg' }, { y: -20, rotation: '-20deg', yoyo: true, repeat: -1 });
   tl.fromTo('#crumbs', { y: 0 }, { y: -20, yoyo: true, repeat: -1 }, '<');
   ```
6. **Implement dismissal handler**: Bind click listener to button for exit transition:
   ```javascript
   const button = document.querySelector('button');
   button.addEventListener('click', () => {
     gsap.to('.cookie-container', { opacity: 0, y: 100, duration: 0.75, ease: 'power1.out' });
   });
   ```

### Completion Gate
- [ ] Modal enters smoothly with elastic overshoot.
- [ ] Graphic and text animate in parallel using timeline position markers.
- [ ] Idle animations loop infinitely with `yoyo: true` and `repeat: -1`.
- [ ] Dismissal button triggers smooth fade and slide exit.
```

---

### `gsap-svg-animation/references/terminology.md`

```markdown
# Terminology

**GSAP Timeline (`gsap.timeline`)**:
A powerful sequencing tool that acts as a container for tweens, coordinating timing, delays, and global defaults across multiple animated elements.
_Avoid_: animation chain, setTimeout queue

**Position Parameter**:
An argument in GSAP timeline methods (`'<50%'`, `'<'`, `'+=1'`) that defines when a tween starts relative to other tweens in the timeline.
_Avoid_: hardcoded delay, manual timer

**Inline SVG**:
Raw SVG XML elements embedded directly within the HTML document body, enabling full CSS styling and JavaScript DOM manipulation of inner paths.
_Avoid_: SVG image tag, external vector link

**Yoyo Animation**:
A property (`yoyo: true`) that reverses the animation back to its starting values on alternating iterations when paired with a repeat count.
_Avoid_: alternating loop, bounce timer

**Elastic Easing (`elastic.out`)**:
An easing curve that overshoots the target destination before oscillating into resting position, simulating physical spring/rubber dynamics.
_Avoid_: spring simulation, physics plugin
```

---

### `gsap-svg-animation/references/examples.md`

```markdown
# GSAP & SVG Animation Examples

## Complete Cookie Modal Implementation

### 1. HTML Markup (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cookie Popup</title>
  <link rel="stylesheet" href="./style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="cookie-container">
    <svg class="cookie" width="98" height="98" viewBox="0 0 98 98" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="cookie">
        <path d="M49 0C21.9 0 0 21.9 0 49C0 76.1 21.9 98 49 98C76.1 98 98 76.1 98 49C98 47.7 97.9 46.4 97.8 45.1C93.4 46.3 88.7 44.8 85.9 41.2C82.7 37.1 83.4 31.2 87.5 28C88.6 27.1 89.9 26.5 91.3 26.2C88.5 21.5 84.4 17.8 79.5 15.6C78.9 19.8 75.8 23.3 71.6 24.3C66.8 25.5 61.9 22.5 60.7 17.7C59.9 14.5 61.1 11.2 63.4 9.1C59 6.8 54.1 5.3 49 5.3V0Z" fill="#E8B074"/>
        <circle cx="28" cy="35" r="5" fill="#6B4423"/>
        <circle cx="45" cy="65" r="6" fill="#6B4423"/>
        <circle cx="68" cy="48" r="4" fill="#6B4423"/>
      </g>
      <g id="crumbs">
        <circle cx="92" cy="18" r="3" fill="#E8B074"/>
        <circle cx="85" cy="10" r="2" fill="#E8B074"/>
      </g>
    </svg>

    <div class="text">
      <h2 class="cookie-title">Cookie Policy</h2>
      <p class="cookie-subtitle">We use analytical cookies (yum) to make your experience on this website better.</p>
      <button type="button">Okay, got it</button>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="./app.js"></script>
</body>
</html>
```

### 2. CSS Styling (`style.css`)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.cookie-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 25rem;
  padding: 1rem;
  border-radius: 1.2rem;
  background: linear-gradient(260deg, #9b6c50 0%, #4f2626 100%);
  color: white;
}

.cookie {
  transform: scale(0.6);
  padding-right: 1rem;
  overflow: visible;
}

.text {
  width: 70%;
}

.cookie-title {
  font-size: 1rem;
  font-weight: lighter;
}

.cookie-subtitle {
  font-size: 0.6rem;
  font-weight: bold;
  padding: 0.5rem 0;
}

button {
  border-style: none;
  padding: 0.5rem 1rem;
  background: white;
  color: #4f2626;
  font-family: 'Poppins', sans-serif;
  font-size: 0.6rem;
  font-weight: bold;
  border-radius: 0.3rem;
  cursor: pointer;
}
```

### 3. JavaScript Animation Logic (`app.js`)

```javascript
// 1. Initialize timeline with shared defaults
const tl = gsap.timeline({
  defaults: { duration: 0.75, ease: "power1.out" }
});

// 2. Entrance sequence with synchronized choreography
tl.fromTo('.cookie-container', 
  { scale: 0 }, 
  { scale: 1, ease: "elastic.out(1, 0.4)", duration: 1.5 }
)
.fromTo('.cookie', 
  { opacity: 0, x: -50, rotation: '-45deg' }, 
  { opacity: 1, x: 0, rotation: '0deg' }, 
  '<50%'
)
.fromTo('.text', 
  { x: 30, opacity: 0 }, 
  { x: 0, opacity: 1 }, 
  '<'
);

// 3. Persistent idle floating & yoyo oscillation
tl.fromTo('.cookie', 
  { y: 0, rotation: '0deg' }, 
  { y: -20, rotation: '-20deg', yoyo: true, repeat: -1 }
)
.fromTo('#crumbs', 
  { y: 0 }, 
  { y: -20, yoyo: true, repeat: -1 }, 
  '<'
);

// 4. Interactive modal dismissal
const button = document.querySelector('button');
button.addEventListener('click', () => {
  gsap.to('.cookie-container', {
    opacity: 0,
    y: 100,
    duration: 0.75,
    ease: 'power1.out'
  });
});
```
```

---

## Phase 5: Validation

### Source Fidelity Check
- [x] **Figma layer preparation & grouping**: Represented in Phase 1 and `examples.md`.
- [x] **Inline SVG DOM access requirement**: Documented in Phase 2 and `terminology.md`.
- [x] **CSS absolute centering & `overflow: visible` invariant**: Enforced in Phase 2, Constraint `ku-030`, and `style.css`.
- [x] **GSAP CDN installation**: Detailed in Phase 3.
- [x] **GSAP Timeline sequencing with `<` and `<50%` position parameters**: Specified in Phase 4 and `app.js`.
- [x] **Elastic easing (`elastic.out(1, 0.4)`) & Power easing (`power1.out`)**: Defined in Phase 4 and defaults configuration.
- [x] **Yoyo looping (`repeat: -1`, `yoyo: true`) on isolated groups (`#crumbs`)**: Verified in Phase 4.
- [x] **Interactive dismissal tween**: Implemented in Phase 4 and `examples.md`.

### Operational Test Scenarios

1. **Scenario 1: New animated SVG banner creation**
   - *Trace*: Designer isolates banner elements in Figma, exports as inline SVG with IDs, applies CSS centering with `overflow: visible`, and constructs a `gsap.timeline` with entrance parameters.
   - *Result*: Pass.

2. **Scenario 2: Vector clipping during rotation/bounce**
   - *Trace*: Developer checks Phase 2 completion gate, finds missing `overflow: visible;` on the SVG class and removes `<clipPath>` definition.
   - *Result*: Pass.

3. **Scenario 3: Multi-element simultaneous entrance**
   - *Trace*: Developer uses the position parameter `'<'` on subsequent `fromTo` calls on the timeline.
   - *Result*: Pass.

---

## Delivery Summary

1. **Knowledge Units Extracted**: 12 (3 concepts, 3 principles, 4 procedures, 1 constraint, 1 counterexample).
2. **Artifacts Produced**:
   - `gsap-svg-animation/SKILL.md` (Operational workflow and phase gates under 500 lines)
   - `gsap-svg-animation/references/terminology.md` (Glossary with `_Avoid_` terms)
   - `gsap-svg-animation/references/examples.md` (Full HTML/CSS/JS reference implementation)
3. **Key Conflicts / Edge Cases Resolved**: Diagnosed and documented the SVG clipping bug caused by internal `<clipPath>` and default SVG overflow properties during rotation/translation tweens.
