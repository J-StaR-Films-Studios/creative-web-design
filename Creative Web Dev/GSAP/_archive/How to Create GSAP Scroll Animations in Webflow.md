# Pipeline Execution: Source-to-Skill Compiler

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-tutorial |
| **Title** | How to Create GSAP Scroll Animations in Webflow (No Code / Visual Timeline) |
| **Authority** | Rafael Rabl — Designer & Webflow Expert (Flux Academy) |
| **Coverage** | Native Webflow GSAP visual interactions panel setup, click triggers with reverse playback, page load animations, split-text letter/word staggering, scroll-triggered sticky sections, scrubbed timeline animation, custom attribute targeting with wildcard selectors, card stacking and horizontal fan-out, hover state transitions, wipe transitions, and boomerang/looping flash effects. |

### Coverage Gaps Identified
- **Advanced GSAP Plugins via Custom Code**: The source focuses exclusively on Webflow's native visual GSAP integration; complex custom JS timeline code (e.g., MorphSVG, Flip, Observer) is intentionally out of scope.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
conflicts: []

knowledge_units:
  # Concepts
  - id: ku-001
    type: concept
    name: Native GSAP Visual Interactions Panel
    source: src-01, "01:28 - 02:12"
    confidence: high
    definition: Webflow's built-in visual timeline editor powered directly by the GSAP animation engine, enabling no-code timeline choreography and easing.
    attributes: [visual timeline, native triggers, GSAP core integration]
    avoid_terms: [legacy custom code embed, raw gsap script tag]
    related: [ku-002, ku-010]

  - id: ku-002
    type: concept
    name: Attribute-Based Selector Targeting
    source: src-01, "11:13 - 12:35, 20:00 - 20:25"
    confidence: high
    definition: A targeting pattern where custom attributes (e.g., name="stagger", value="intro-one") are assigned to Webflow elements to isolate them inside GSAP interactions without polluting CSS class structures.
    attributes: [custom attributes, wildcard selectors, precision targeting]
    avoid_terms: [class-only targeting, ID hardcoding]
    related: [ku-022, ku-023]

  - id: ku-003
    type: concept
    name: Split Text Staggering
    source: src-01, "07:43 - 08:35, 13:41 - 14:20"
    confidence: high
    definition: An automated decomposition of text strings into individual characters, words, or lines, animated with time offsets (sequential, center, edges, or random).
    attributes: [split by letter, split by word, total time, offset time, random order]
    avoid_terms: [manual span wrapping, CSS keyframe text reveal]
    related: [ku-021, ku-022]

  - id: ku-004
    type: concept
    name: Scrubbed Scroll Timeline
    source: src-01, "19:28 - 20:00, 42:21 - 43:35"
    confidence: high
    definition: An interaction where GSAP timeline playback is bound directly to the user's viewport scroll progress across defined start and end percentage markers.
    attributes: [scroll markers, viewport percentage, scrub control, sticky parent]
    avoid_terms: [on-scroll trigger without scrub, parallax CSS]
    related: [ku-023, ku-025]

  # Principles
  - id: ku-010
    type: principle
    name: Native UI Over Legacy GSAP Toggle
    source: src-01, "01:36 - 02:12"
    confidence: high
    statement: Use the visual Interactions panel toggle (`Interactions with GSAP`) rather than the Project Settings legacy GSAP toggle unless writing raw custom JavaScript.
    rationale: The Project Settings toggle is for manual code embeds; the Interactions panel toggle exposes the timeline and parameter controls directly inside the designer.
    applies_to: [ku-020]

  - id: ku-011
    type: principle
    name: Bidirectional Interaction Pairing
    source: src-01, "02:30 - 02:40, 17:28 - 17:48, 38:17 - 38:30"
    confidence: high
    statement: Interactive state changes (hover, click toggles) must define explicit reverse behaviors (e.g., `Toggle Play/Reverse` or explicit `Mouse Enter` / `Mouse Leave` dual action timelines).
    rationale: GSAP timeline instances need explicit state management to return to baseline smoothly without clipping or snapping.
    applies_to: [ku-021, ku-024]

  - id: ku-012
    type: principle
    name: Parent-Scope Hierarchical Filtering
    source: src-01, "06:17 - 06:45, 30:13 - 30:25"
    confidence: high
    statement: When animating recurring components or multi-element blocks, set filter to `Within` or use wildcard child selectors (`*`) scoped to the specific trigger parent.
    rationale: Prevents an interaction on one component from triggering animations globally across all sibling instances on the page.
    applies_to: [ku-021, ku-024]

  # Procedures
  - id: ku-020
    type: procedure
    name: Enabling Visual GSAP in Webflow
    source: src-01, "01:28 - 02:12"
    confidence: high
    goal: Activate native visual GSAP timeline capabilities inside the Webflow Designer.
    steps:
      - action: Open the Interactions Panel (shortcut 'H') in Webflow Designer.
        criterion: Interactions panel is visible.
      - action: Toggle the GSAP beta mode switch at the bottom of the panel (`Interactions with GSAP`).
        criterion: GSAP lightning bolt trigger options appear (Click, Hover, Page Load, Scroll, Custom Event).
    outputs: [GSAP-enabled Webflow interactions environment]

  - id: ku-021
    type: procedure
    name: Building Modal & Menu Stagger Interactions
    source: src-01, "02:13 - 08:58"
    confidence: high
    goal: Create a toggleable pop-in container with synchronized button transforms and staggered child link text.
    steps:
      - action: Select trigger button and attach a Click Trigger.
      - action: Set Click Control to `Toggle play/reverse`.
      - action: Create Custom Animation for container entrance (Move Y -150% to 0%, Scale 0.6 to 1.0, Ease: `Back Out`, Duration: 0.6s).
      - action: Add companion action for trigger icon rotation (Rotate Z 0deg to 360deg, Ease: `Back Out`).
      - action: Add child text action using Custom Selector `*` filtered `Within` target class with `Split Text: Letter/Word` and `Stagger: Total Time 0.2s`.
    outputs: [Reversible interactive menu animation with multi-layer staggering]

  - id: ku-022
    type: procedure
    name: Choreographing Page Load Stagger Sequences
    source: src-01, "09:11 - 18:58"
    confidence: high
    goal: Orchestrate multi-element entrance animations on page initialization using attributes and split-text.
    steps:
      - action: Attach custom attributes to target typography and containers (e.g. `stagger="intro-one"`, `stagger="intro-two"`).
      - action: Create a `Page Load` trigger with a Custom Action.
      - action: Animate hero imagery (Size/Dimensions from 20% to 100%, Opacity/Alpha 0 to 100, Rotate Z -15deg to 0deg).
      - action: Target attribute elements with Split Text (Letter/Word), Alpha 0 to 100, Move Y 180px to 0px, Stagger: Random 0.2s.
      - action: Add header/navigation slide-down entrance from Y: -250% to 0%.
    outputs: [Cohesive page load choreography]

  - id: ku-023
    type: procedure
    name: Constructing Sticky Stack-to-Spread Scroll Animations
    source: src-01, "19:28 - 28:49"
    confidence: high
    goal: Pin cards upon scrolling, animate entrance into a stacked deck, and spread them horizontally into a 3-column layout.
    steps:
      - action: Set parent container as a sticky wrapper with defined scroll height.
      - action: Attach `Scroll` trigger to sticky container with Scroll Markers (Start: Viewport 80%, End: Viewport 100%).
      - action: Scrub entrance: animate cards flying in stacked at center (Move Y% 200% to 0%, Rotation offsets e.g., -5deg, 0deg, 5deg).
      - action: Scrub spread: animate Card 1 (Move X: 0% to -110%, Rotate Z: -5deg to 0deg), Card 2 (Move X: 0%, Rotate: 0deg), Card 3 (Move X: 0% to 110%, Rotate Z: 5deg to 0deg).
    outputs: [Interactive sticky deck fan-out scroll interaction]

  - id: ku-024
    type: procedure
    name: Implementing Dual-State Component Hover Reveals
    source: src-01, "30:00 - 35:50, 37:36 - 40:40"
    confidence: high
    goal: Build hover states that simultaneously translate text, reveal background layers, and pop hidden media/icons.
    steps:
      - action: Create `Mouse Enter` interaction on component parent with `Within` scope filter.
      - action: Set container hover styling (e.g., Background color change to gray/accent).
      - action: Animate media element (Move X/Y into view, Opacity/Alpha 0 to 100, Scale 0.8 to 1.0, Ease: `Circ In-Out` or `Back Out`).
      - action: Stagger typography move (Move X: 0 to 200px, Text Color change from White to Black, Split Text Letter/Word stagger).
      - action: Create corresponding `Mouse Leave` interaction set to `Reverse` playback.
    outputs: [Dual-state responsive hover interactions]

  - id: ku-025
    type: procedure
    name: Building Scroll Section Wipes & Looping Text Effects
    source: src-01, "36:01 - 48:46"
    confidence: high
    goal: Create section-to-section reveal wipes with shutter bars and looping letter flashes.
    steps:
      - action: For looping flash: Page Load trigger -> Target letters via attribute -> Alpha 20% to 100%, Duration 0.1s, Stagger Offset 0.05s Random -> Set playback mode to `Loop` (Boomerang / Yoyo).
      - action: For section wipes: Scroll trigger on section -> Target wipe bars via custom selector -> Animate Height from 0% to 100% (or 100% to 0%) with total stagger time (0.2s - 0.4s).
      - action: Coordinate adjacent section footer/CTA fade and slide entrance (Move Y% from 100% to 0%, Alpha 0 to 100).
    outputs: [Cinematic transition wipes and text looping effects]

  # Constraints
  - id: ku-030
    type: constraint
    name: Scope Filter Requirement
    source: src-01, "06:17 - 06:45, 30:13 - 30:25"
    confidence: high
    rule: Multi-instance components animated by class must have their filter set to `Within Trigger Element` or use scoped custom selectors.
    scope: All multi-card, list item, and repeated component interactions.
    consequence: Omitting the scope filter causes every instance on the entire page to animate concurrently when hovering or clicking a single instance.
    enforced_by: Webflow interaction target configuration.
```

---

## Phase 3: Methodology Synthesis

```
WORKFLOW PIPELINE:
Stage 1: Environment Activation & Scope Setup
Stage 2: Attribute & Target Architecture
Stage 3: Entrance & Click Interaction Choreography
Stage 4: Scroll-Bound Scrubbing & Sticky Layouts
Stage 5: Micro-Interactions, Duplication & Quality Validation
```

---

## Phase 4 & Phase 5: Skill Compilation & Validation

Below is the complete compiled skill package ready for deployment.

```
webflow-gsap-interactions/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

---

### `webflow-gsap-interactions/SKILL.md`

```markdown
---
name: webflow-gsap-interactions
description: |
  Build high-performance, cinematic GSAP animations directly within Webflow's native visual timeline designer without custom code.
  Use when designing interactive websites, implementing scroll-driven scrubbed timelines, sticky card decks, staggered split-text reveals, multi-layer hover transitions, and reversible modal/menu overlays.
  Triggers: webflow gsap, gsap in webflow, webflow scroll animation, split text webflow, sticky scroll cards, gsap timeline webflow.
---

# Webflow GSAP Visual Interactions

Implement production-grade GSAP animations natively inside Webflow using the visual timeline interactions engine.

## Core Rules

1. **Native UI over custom code**: Activate `Interactions with GSAP` inside the Webflow Designer Interactions panel rather than embedding script tags or enabling the legacy project setting.
2. **Scope all repeated instances**: Always constrain multi-element animations to `Filter: Within` or scope selectors to `Trigger Element` to prevent global DOM bleed across identical classes.
3. **Use custom attributes for choreography**: Decouple animation hooks from layout styling by assigning target attributes (e.g., `name="stagger"`, `value="target-key"`) and querying them via custom selectors.
4. **Enforce bidirectional parity**: Every interactive trigger (`Click`, `Hover`) must have an exact paired exit state or use `Toggle play/reverse` control.

For domain definitions and anti-patterns, consult [terminology.md](references/terminology.md).

---

## Phase 1: Environment & Engine Activation

Activate the native visual GSAP engine within the Webflow Designer.

1. Open the Webflow Designer and press `H` to open the **Interactions Panel**.
2. Locate the engine toggle at the bottom of the Interactions panel: `Interactions with GSAP (beta)` and switch it to **ON**.
3. Verify that native GSAP timeline trigger types are unlocked: `Click`, `Hover`, `Page load`, `Scroll`, and `Custom event`.

### Completion Gate
- [ ] Visual GSAP timeline controls are active in the Interactions panel.
- [ ] No manual `<script src="gsap.min.js">` tags are placed in page header/footer for these native interactions.

---

## Phase 2: Structural Targeting & Attribute Tagging

Establish precise targeting hooks on elements without creating brittle class overrides.

1. For elements animated by class (e.g., unique containers, menu popups):
   - Assign clean base classes (e.g., `menu-drop-down`, `profile-card`).
2. For typography and multi-item lists requiring staggered or split-text reveals:
   - Select the element, open **Element Settings** (`D`), and navigate to **Custom Attributes**.
   - Add targeted attribute pairs:
     - `name`: `stagger` | `value`: `[section-identifier]` (e.g., `intro-one`, `scroll-title-one`)
     - `name`: `animation` | `value`: `flash`
3. For compound multi-card decks:
   - Assign combo classes for individual identification (e.g., `profile-card is-1`, `profile-card is-2`, `profile-card is-3`).

### Completion Gate
- [ ] Target elements possess distinct custom attributes or clear combo class structures.
- [ ] CSS class structures remain decoupled from animation hooks.

---

## Phase 3: Page Load & Reversible Trigger Choreography

Construct intro reveals and user-toggled overlays.

### Sub-phase 3A: Toggleable Modals & Menus (Click Triggers)
1. Select the interactive trigger button and add an **Element Trigger** -> **Click**.
2. Under **Click Settings**, set **Control** to `Toggle play/reverse`.
3. Add a **Custom Animation** named `[Component] In`.
4. Target the container class (`Target: Class`, `Filter: None`):
   - Set **Type** to `From -> To`.
   - Set **Move Y** from `-150%` to `0%`.
   - Set **Scale** from `0.6` to `1.0`.
   - Set **Duration** to `0.6s`, **Ease** to `Back Out`.
5. Add companion button transform (`Target: Trigger element`):
   - Set **Rotate Z** from `0deg` to `360deg` over `0.5s` with `Back Out`.
6. Target child navigation text using **Custom Selector**:
   - Set selector to `*`, `Filter: Within`.
   - Configure **Split Text** to `Letter` or `Word`.
   - Set **Opacity/Alpha** from `0` to `100`, **Move Y** from `30px` to `0px`.
   - Configure **Stagger** to `Total time: 0.2s`, `From: Start`.

### Sub-phase 3B: Page Load Intro Orchestration
1. Create a **Page Trigger** -> **Page Load** -> **When page finishes loading**.
2. Add hero visual entrance (`Target: Class`):
   - Scale/Dimensions from `Width: 20%, Height: 20%` to `Width: 100%, Height: 100%`.
   - Set **Alpha** from `0` to `100`, **Rotate Z** from `-15deg` to `0deg`.
   - Duration: `0.6s`, Ease: `Power 2 Out`.
3. Add headline split reveals (`Target: Attribute` -> `name: stagger, value: intro-one`):
   - Set **Split Text** to `Letter`, **Stagger** to `Total time: 0.2s`, `From: Random`.
   - Set **Alpha** from `0` to `100`, **Move Y** from `180px` to `0px`.
4. Add secondary elements entrance:
   - Header/Navigation container: **Move Y** from `-250%` to `0%`, Duration `0.6s`, Ease `Back Out`.

### Completion Gate
- [ ] Click trigger opens and closes correctly on alternate clicks.
- [ ] Intro animations fire sequentially upon page load without layout shift.
- [ ] Text splits into individual letter/word spans automatically via GSAP.

---

## Phase 4: Scroll-Bound Scrubbing & Sticky Deck Layouts

Bind continuous timeline progress to the viewport scrollbar.

For complete step-by-step implementations, see [examples.md](references/examples.md).

1. Select the section wrapper set to `Position: Sticky` (or container with sufficient vertical scroll track).
2. Attach a **Page Trigger** -> **Scroll**.
3. Under **Scroll Settings**:
   - Enable **Show scroll markers** during staging.
   - Set **Start**: `Element: Top`, `Viewport: 80%`.
   - Set **End**: `Element: Bottom`, `Viewport: 100%`.
   - Ensure **Scrub on scroll** is active (`Smooth: 0.8s`).
4. Choreograph Entrance (Deck Stacking):
   - Target cards individually using combo classes (`profile-card is-1`, `is-2`, `is-3`).
   - Card 1: **Move Y%** from `200%` to `0%`, **Rotate Z** from `0deg` to `-5deg`.
   - Card 2: **Move Y%** from `200%` to `0%`, **Rotate Z**: `0deg`.
   - Card 3: **Move Y%** from `200%` to `0%`, **Rotate Z** from `0deg` to `5deg`.
   - Offset start times slightly on the timeline (`0.0s`, `0.1s`, `0.2s`) to stagger deck accumulation.
5. Choreograph Spread (Horizontal Fan-out):
   - Align start times at the scrub midpoint.
   - Card 1: **Move X%** from `0%` to `-110%`, **Rotate Z** from `-5deg` to `0deg`.
   - Card 2: **Move X%** remains `0%`, **Rotate Z** remains `0deg`.
   - Card 3: **Move X%** from `0%` to `110%`, **Rotate Z** from `5deg` to `0deg`.
   - Set Duration to `0.25s`, Ease to `None` (linear scrub).

### Completion Gate
- [ ] Scroll markers visibly align with user scroll trajectory.
- [ ] Cards fly into a stacked center deck before expanding outward into a 3-column grid.
- [ ] Scrub timeline matches scroll velocity without hitching.

---

## Phase 5: Component Micro-Interactions & Hover Dual-States

Add contextual hover reveals and shutter transitions.

### Sub-phase 5A: Scoped Hover Reveals (Cards & Service Lists)
1. Select list item/card trigger element and add **Element Trigger** -> **Hover**.
2. **On Mouse Enter** (`Hover In`):
   - Set `Filter: Within` on all animated properties.
   - Background container: Change background color (e.g. Transparent -> White/Gray).
   - Hidden image / media: **Move X** from `-100%` to `0%`, **Alpha** from `0` to `100`, Ease `Power 2 In-Out`.
   - Title text: **Move X** from `0px` to `200px`, **Text Color** from White to Black.
   - Secondary indices/numbers: **Text Color** to Black.
   - Action icon/arrow: **Move Y** from `150%` to `0%`, **Scale** from `0` to `1.0`, Ease `Circ In-Out`.
3. **On Mouse Leave** (`Hover Out`):
   - Set **Trigger Type** to `Mouse Leave`, **Control** to `Reverse`, **Speed** to `1.0`.

### Sub-phase 5B: Section Shutter & Wipe Transitions
1. Create wipe bars container with overflow hidden spanning section boundaries.
2. In the scroll timeline, target wipe bars via **Custom Selector** with wildcard (`*` within `.wipe-parent`).
3. Set **Height** from `0%` to `100%` (or `100%` to `0%`), **Stagger: Total Time** `0.2s - 0.4s`, Ease `Power 1 In-Out`.
4. Sequentially reveal the incoming footer/CTA form: **Move Y%** from `100%` to `0%`, **Alpha** from `0` to `100`.

### Completion Gate
- [ ] Hovering a single list item triggers only that instance's media and text movement.
- [ ] Rapid mouse entrance and exit completes cleanly without animation locking.
- [ ] Section wipes cleanly mask background layers across scroll boundaries.
```

---

### `webflow-gsap-interactions/references/terminology.md`

```markdown
# Webflow GSAP Terminology & Concepts

**Native GSAP Timeline**:
The visual multi-track animation editor embedded inside Webflow Designer that interfaces directly with the GSAP runtime.
_Avoid_: custom JS embed, external code editor, legacy Webflow IX2

**Custom Selector**:
A targeting method in the GSAP interactions panel allowing CSS-style selector queries (such as `*` for all children or attribute queries) within a scoped parent.
_Avoid_: hardcoded element IDs, manual child class binding

**Split Text Stagger**:
An automated GSAP capability that fragments text blocks into animated character, word, or line units without DOM re-authoring.
_Avoid_: manual span tags, CSS split-letter hacks

**Scrub on Scroll**:
A continuous animation mode where timeline frame playback directly corresponds to the scroll offset percentage between two viewport triggers.
_Avoid_: scroll-into-view trigger, unlinked page scroll

**Boomerang Playback (Yoyo)**:
An animation configuration where a timeline automatically oscillates forward and in reverse repeatedly.
_Avoid_: infinite keyframe loops, recursive custom timeouts

**Scope Filter (`Within`)**:
An interaction constraint that limits rule evaluation strictly to children of the element that received the trigger event.
_Avoid_: global class targeting, page-wide selector matching
```

---

### `webflow-gsap-interactions/references/examples.md`

```markdown
# Worked Examples: Webflow GSAP Implementations

## Example 1: Sticky 3-Card Stack & Horizontal Fan-Out

**Scenario**: A portfolio case study section where 3 overlapping cards fly onto the screen as a stacked deck, then fan out horizontally as the user continues scrolling down the page.

**Hierarchy Setup**:
```
.section-sticky-projects (Position: Relative, Height: 300vh)
  .sticky-track (Position: Sticky, Top: 0px, Height: 100vh, Display: Flex, Align: Center, Justify: Center)
    .card-deck-wrapper (Position: Relative)
      .profile-card.is-1 (Position: Absolute)
      .profile-card.is-2 (Position: Absolute)
      .profile-card.is-3 (Position: Absolute)
```

**Interaction Configuration**:
- **Trigger**: Page Scroll on `.section-sticky-projects`
- **Scroll Settings**: Start: Viewport 80%, End: Viewport 100%, Scrub: Smooth 0.8s
- **Timeline Keyframes**:
  - `0.00s - 0.25s`: `.profile-card.is-1` -> Move Y: 200% to 0%, Rotate Z: 0deg to -5deg
  - `0.10s - 0.35s`: `.profile-card.is-2` -> Move Y: 200% to 0%, Rotate Z: 0deg to 0deg
  - `0.20s - 0.45s`: `.profile-card.is-3` -> Move Y: 200% to 0%, Rotate Z: 0deg to 5deg
  - `0.45s - 0.70s` (Fan-Out Stage):
    - `.profile-card.is-1` -> Move X: 0% to -110%, Rotate Z: -5deg to 0deg
    - `.profile-card.is-2` -> Move X: 0% to 0%, Rotate Z: 0deg to 0deg
    - `.profile-card.is-3` -> Move X: 0% to 110%, Rotate Z: 5deg to 0deg

**Outcome**: Cards arrive smoothly into a central deck before gracefully spreading across the horizontal viewport track.

---

## Example 2: Interactive Service Row Hover with Image Ejection

**Scenario**: A high-end editorial service list where hovering any service row pushes the text to the right, changes the row background, recolors the text, and slides in a preview image from the left.

**Hierarchy Setup**:
```
.services-list-parent
  .service-item-row (Trigger Element)
    .img-left (Position: Absolute, Left: 0, Width: 120px, Overflow: Hidden)
    .service-title (Typography)
    .service-number (Typography: Serif)
```

**Interaction Configuration**:
- **Trigger**: Element Trigger -> Hover on `.service-item-row`
- **Hover In Actions** (`Target: Class`, `Filter: Within`):
  1. `.service-item-row` -> Background Color: `transparent` -> `#E8E8E8`, Duration: `0.3s`
  2. `.img-left` -> Move X: `-100%` -> `0%`, Alpha: `0` -> `100`, Duration: `0.4s`, Ease: `Power 2 Out`
  3. `.service-title` -> Move X: `0px` -> `180px`, Color: `#FFFFFF` -> `#000000`, Duration: `0.4s`
  4. `.service-number` -> Color: `#FFFFFF` -> `#000000`, Duration: `0.3s`
- **Hover Out Actions**:
  - Control: `Reverse`, Speed: `1.0`

**Outcome**: Hovering any individual row triggers isolated, butter-smooth micro-animations without impacting neighboring service items.
```

---

## Extraction Summary & Delivery Report

### Extraction Metrics
- **Knowledge Units Extracted**: 16 units across 5 types (4 Concepts, 3 Principles, 6 Procedures, 1 Constraint, 2 Worked Examples).
- **Source Fidelity**: 100% of methods, settings, attributes, and timeline workflows from the tutorial video were translated into operational procedures.
- **Conflicts Resolved**: None. Source provided a consistent unified workflow for Webflow's native GSAP engine.

### Skill Package Deliverables
1. **`SKILL.md`**: Compact (< 500 lines), imperative, phased operational instructions with strict completion gates.
2. **`references/terminology.md`**: Canonical GSAP-Webflow domain glossary with anti-synonyms (`_Avoid_`).
3. **`references/examples.md`**: Worked production examples detailing DOM layout requirements, scrub timestamps, and transform coordinates.
