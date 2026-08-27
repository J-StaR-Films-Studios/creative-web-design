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
