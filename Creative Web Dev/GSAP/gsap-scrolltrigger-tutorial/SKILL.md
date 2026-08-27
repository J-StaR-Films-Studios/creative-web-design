---
name: gsap-scrolltrigger
description: |
  Configure, time, and debug GSAP ScrollTrigger animations in web applications.
  Use when building scroll-driven animations, binding GSAP timelines/tweens to viewport scroll,
  calibrating start/end trigger hooks, configuring scrub mode vs toggleActions, or integrating
  smooth scroll (Lenis).
  Triggers: gsap scrolltrigger, scroll animation, scroll-driven animation, gsap scrub,
  toggleActions, scrolltrigger start end, animate on scroll, gsap lenis smooth scroll.
---

# GSAP ScrollTrigger Implementation

Implement precise scroll-driven animations using GSAP and the ScrollTrigger plugin. Follow this workflow to configure trigger hooks, calibrate scroll timing, select between scrubbed distance-based tracking and discrete event-driven playback, and eliminate scroll timing defects.

For full terminology and canonical parameter names, see [terminology.md](references/terminology.md).

---

## Ground Rules

1. **Visual Calibration First**: Always set `markers: true` during development. Never guess trigger hook coordinates without visual marker inspection.
2. **Mode Exclusivity**: Choose either **Scrub Mode** (`scrub: true` or numeric smoothing) or **ToggleActions Mode** (`scrub: false` + `toggleActions`). Never attempt to control timing with `duration` in scrub mode.
3. **Two-Token Coordinate Strings**: Always format `start` and `end` properties as `"[triggerHook] [scrollerHook]"` (e.g., `'top center'`, `'35% 80%'`).

---

## Phase 1: Environment & Initial State Preparation

Set up DOM elements in their initial resting positions before binding ScrollTrigger.

1. Load GSAP core (`gsap.min.js`) and the ScrollTrigger plugin (`ScrollTrigger.min.js`).
2. If using an ES module environment, register the plugin:
   ```javascript
   gsap.registerPlugin(ScrollTrigger);
   ```
3. (Optional) Initialize smooth scrolling (Lenis) to normalize scroll acceleration across platforms:
   ```javascript
   const lenis = new Lenis();
   function raf(time) {
     lenis.raf(time);
     requestAnimationFrame(raf);
   }
   requestAnimationFrame(raf);
   ```
4. Define the target element's starting CSS state (e.g., translated off-screen via `position: relative; left: -400px;` or `opacity: 0;`).

### Completion Gate
- [ ] GSAP and ScrollTrigger runtime objects are accessible without console errors
- [ ] Target element is visually positioned in its pre-animated state
- [ ] Viewport contains sufficient scrollable height (e.g., spacer sections) to allow testing

---

## Phase 2: Timeline & Trigger Definition

Instantiate a GSAP timeline bound to the target DOM element via ScrollTrigger.

1. Instantiate the timeline with the `scrollTrigger` configuration object:
   ```javascript
   let tl = gsap.timeline({
     scrollTrigger: {
       trigger: '.target-element',
       start: 'top center',
       end: 'bottom center',
       markers: true
     }
   });
   ```
2. Chain child tweens to the timeline specifying the target destination values:
   ```javascript
   tl.to('.target-element', {
     x: 800
   });
   ```

### Completion Gate
- [ ] Green (`start` / `scroller-start`) and red (`end` / `scroller-end`) markers appear in the viewport
- [ ] Scrolling causes the trigger element to cross the viewport marker threshold

---

## Phase 3: Coordinate Hook Calibration

Calibrate the entry (`start`) and exit (`end`) points to control when and where the animation executes.

1. Configure the **`start`** property using `"<trigger-hook> <scroller-hook>"`:
   - **First token** (Trigger Hook): Reference point on the target element (`top`, `center`, `bottom`, percentage `35%`, pixel offset `100px`, or negative value `-50%`).
   - **Second token** (Scroller Hook): Reference point in the viewport (`top`, `center`, `bottom`, percentage `80%`, or pixel position).
2. Configure the **`end`** property using `"<trigger-hook> <scroller-hook>"`:
   - Defines where the animation completes or unpins (e.g., `'bottom center'`, `'200% center'`, `'bottom 20%'`).
3. Tune scroll velocity/duration:
   - **To slow down the animation**: Increase the vertical distance between `scroller-start` and `scroller-end`.
   - **To speed up the animation**: Bring `scroller-start` and `scroller-end` closer together.

For complete hook coordinate formulas and worked visual layouts, see [examples.md](references/examples.md).

### Completion Gate
- [ ] Green `start` marker meets `scroller-start` at the exact desired trigger moment
- [ ] Red `end` marker meets `scroller-end` at the desired completion threshold

---

## Phase 4: Operational Mode Configuration

Select and implement the appropriate animation mode based on interaction requirements.

```
Decision Tree:
Is animation progress directly locked to the scrollbar position?
├── YES ──► Mode A: Scrub Mode
└── NO  ──► Mode B: ToggleActions Mode (Time-based discrete playback)
```

### Mode A: Scrub Mode (Scrollbar-Bound)
Use when the user directly scrubs the animation back and forth by scrolling.

1. Set `scrub: true` (or a number like `scrub: 1` for 1-second catch-up lag) inside the `scrollTrigger` object.
2. Remove any time-based `duration` assumptions on child tweens. Adjust pace purely by changing the distance between `start` and `end` hooks.

### Mode B: ToggleActions Mode (Discrete Playback)
Use when scrolling past a threshold should trigger a fixed-duration, time-based animation.

1. Set `scrub: false` in the `scrollTrigger` object.
2. Set explicit `duration` on child tweens (e.g., `duration: 0.5`).
3. Define the 4-token `toggleActions` string:
   ```javascript
   toggleActions: 'onEnter onLeave onEnterBack onLeaveBack'
   ```
   Choose actions for each event from: `play`, `pause`, `resume`, `reverse`, `restart`, `reset`, `complete`, `none`.

For all 8 action behaviors and common toggleAction combinations, see [toggle-actions.md](references/toggle-actions.md).

### Completion Gate
- [ ] If `scrub: true`: Animation advances smoothly forward/backward with scrollbar position
- [ ] If `scrub: false`: Animation plays over its specified duration when crossing marker thresholds without jitter
