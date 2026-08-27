---
name: webflow-gsap-split-text
description: |
  Implement and configure GSAP SplitText animations in Webflow using the native GSAP visual UI.
  Covers page load text reveals, scroll-scrubbed split text, color highlights, and viewport-triggered
  stagger animations with masking and replay resets.
  Triggers: webflow gsap, split text webflow, text reveal animation, scroll scrub text, webflow text stagger,
  gsap text animation, splittext mask.
---

# Webflow GSAP SplitText Animation

Configure text reveal and scroll interactions in Webflow using the built-in GSAP visual UI.

## Core Principles

1. **Native Masking Over Manual Wrappers**: Use the built-in `Mask` dropdown on SplitText rather than manually nesting `overflow: hidden` wrapper divs.
2. **Explicit Trigger Mode Selection**:
   - Use **Scrub on scroll** when the animation timeline must bind directly to scroll progress.
   - Use **Trigger actions** when an animation must play at full speed once a scroll boundary is reached.
3. **Class-Level Targeting**: Apply interactions to classes rather than individual element instances to ensure consistency and reusability across pages.

For terminology and canonical definitions, see [terminology.md](references/terminology.md).

---

## Phase 1: Selector & Trigger Initialization

1. Select the target heading or paragraph element in the Webflow Designer.
2. Open the **Interactions** panel (shortcut: `H`).
3. Ensure the interactions engine is set to **Interactions with GSAP (new)**.
4. Select the trigger based on requirement:
   - **Page Load**: For hero section headers and intro elements.
   - **Scroll**: For section headers, body copy, and scroll-revealed statements.

### Completion gate
- [ ] Correct text element selected with an explicit class assigned
- [ ] GSAP interaction engine active
- [ ] Trigger type set to Page Load or Scroll

---

## Phase 2: Action & Property Definition

1. Under **Actions**, click **Add an action** and select **Custom**.
2. Set **Target** to `Class` (or `Element` / `Custom selector` depending on scope).
3. Set **Type** to `From` (defines the starting values, animating to the element's default style).
4. Configure starting properties:
   - **Opacity**: Set to `0%` (animating to `100%`).
   - **Move Y**: Set to positive offset (e.g., `50px`) for upward entrance.
   - **Duration**: Set base tween duration (standard: `0.5s` to `1.0s`).
   - **Ease**: Choose easing curve (`Power 1 out` for soft landing, `Power 4 out` for punchy deceleration).

For worked configurations and property variations, see [examples.md](references/examples.md).

### Completion gate
- [ ] Action target properly bound to class or element
- [ ] Direction set to `From` with initial opacity and offset specified
- [ ] Easing and base duration selected

---

## Phase 3: SplitText & Masking Configuration

1. In the Custom Action settings, toggle **Split text** to enabled.
2. In the **Split by** dropdown, choose the granularity:
   - `Letter`: Best for short display titles and dramatic hero headers.
   - `Word`: Standard for headings and callouts.
   - `Line`: Best for multi-line body paragraphs and editorial text.
3. Configure **Stagger**:
   - Set mode to **Total time** (e.g., `0.8s` to `1.0s`).
   - Set **From** position (`Start` for standard left-to-right reading order).
4. Configure **Mask**:
   - Select matching unit (`Word` or `Line`) to clip text as it slides up from below.
   - Select `None` if text should fade/slide freely without boundary clipping.

### Completion gate
- [ ] SplitText enabled with target unit selected (`Word`, `Line`, or `Letter`)
- [ ] Stagger total time defined
- [ ] Masking mode set and verified on the canvas

---

## Phase 4: Scroll Trigger Calibration (Scroll-Triggered Only)

If using a **Scroll** trigger, calibrate the boundary controls:

### Branch A: Continuous Scroll Scrubbing
1. In trigger settings, select **Scrub on scroll**.
2. Set **Smooth** factor (default: `0.8s` to `1.0s` for fluid inertia).
3. Adjust **Start** marker: Set Element position (e.g., `Top`) relative to Viewport position (e.g., `Bottom` or `80%`).
4. Adjust **End** marker: Set Element position (e.g., `Bottom`) relative to Viewport position (e.g., `50%` or `Center`).

### Branch B: Discrete Viewport Trigger Actions
1. In trigger settings, switch from Scrub to **Trigger actions**.
2. Configure lifecycle events:
   - **Enter**: `Play` (starts reveal when element enters viewport).
   - **Leave**: `None`.
   - **Enter back**: `None`.
   - **Leave back**: `Reset` or `Reverse` (resets state when user scrolls back to the top).
3. Set action **Duration** (e.g., `1.0s`) and verify full autonomous playback on trigger hit.

### Completion gate
- [ ] Start and End scroll markers calibrated to visible viewport thresholds
- [ ] Scrubbing inertia or Trigger Action lifecycle events configured
- [ ] Reverse-scroll behavior handles reset/replay cleanly
