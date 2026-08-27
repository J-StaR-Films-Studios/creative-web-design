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
