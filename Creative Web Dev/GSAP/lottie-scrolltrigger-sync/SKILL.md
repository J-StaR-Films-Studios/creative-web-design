---
name: lottie-scrolltrigger-sync
description: |
  Synchronize and scrub Lottie vector animations to scroll position using GSAP ScrollTrigger.
  Use when: creating scroll-driven animations, building scrollytelling web pages,
  binding Lottie JSON playback to scroll progress, or controlling vector playheads with scrollbars.
  Triggers: lottie scrolltrigger, scrub lottie, scroll driven lottie, sync lottie with scroll,
  gsap lottie animation, scrollytelling lottie.
---

# Lottie & GSAP ScrollTrigger Synchronization

Control vector Lottie animation playback interactively via scrollbar position by binding normalized ScrollTrigger progress directly to Lottie frame indices.

For domain definitions and anti-patterns, see [terminology.md](references/terminology.md).
For complete standalone code implementations, see [examples.md](references/examples.md).

---

## Phase 1: Dependency & DOM Setup

Prepare the HTML document with necessary scripts and container elements.

1. Load `lottie-web` (`v5.x` or higher) via package manager or CDN.
2. Load `gsap` core and `ScrollTrigger` plugin (`v3.x` or higher).
3. Create a dedicated container element with a unique ID (e.g., `<div id="lottie-container"></div>`).
4. Ensure the page or parent document contains sufficient scrollable height for testing.

### Completion gate
- [ ] `lottie` is available on the global/module scope.
- [ ] `gsap` and `ScrollTrigger` are available on the global/module scope.
- [ ] Container element exists in the DOM.

---

## Phase 2: Instantiate Lottie with Scrub Configuration

Initialize the Lottie player in a static, non-autoplay state.

1. Invoke `lottie.loadAnimation()` with an options configuration object.
2. Assign `container` to the DOM element (`document.getElementById("...")`).
3. Set `renderer` to `"svg"` for resolution-independent vector scaling.
4. Set `path` to the local or remote Lottie JSON file.
5. Set `autoplay: false` and `loop: false` to allow external playhead control.
6. Store the returned animation instance in a constant (e.g., `const animation`).

### Completion gate
- [ ] `autoplay` is explicitly set to `false`.
- [ ] `renderer` is set to `"svg"`.
- [ ] Animation instance is stored in a referenceable variable.

---

## Phase 3: Register and Configure GSAP ScrollTrigger

Bind scroll progress to the animation container.

1. Register the plugin once:
   ```javascript
   gsap.registerPlugin(ScrollTrigger);
   ```
2. Create a standalone ScrollTrigger instance via `ScrollTrigger.create()`.
3. Set `trigger` to the container ID selector (e.g., `"#lottie-container"`).
4. Set `scrub: true` to bind the playhead directly to the scrollbar movement.

### Completion gate
- [ ] `gsap.registerPlugin(ScrollTrigger)` is called prior to instance creation.
- [ ] `trigger` points to the valid container selector.
- [ ] `scrub` is enabled (`true` or numeric lag value).

---

## Phase 4: Map Scroll Progress to Animation Frames

Synchronize the scroll position to discrete Lottie frame playback using the `onUpdate` hook.

1. Add an `onUpdate` callback to the `ScrollTrigger.create()` options:
   ```javascript
   onUpdate: function (self) {
     const progress = self.progress;
     animation.goToAndStop(animation.totalFrames * progress, true);
   }
   ```
2. Extract `self.progress` (normalized float between `0.0` and `1.0`).
3. Calculate target frame index: `animation.totalFrames * self.progress`.
4. Call `animation.goToAndStop(targetFrame, true)`. The second parameter (`isFrame: true`) is mandatory to enforce frame-based scrubbing rather than milliseconds.

### Completion gate
- [ ] `onUpdate` receives `self` and extracts `self.progress`.
- [ ] `animation.goToAndStop()` is called with `true` as the second argument.
- [ ] Scrolling from top to bottom of trigger sweeps animation from frame 0 to `totalFrames`.
