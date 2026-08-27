---
name: gsap-splittext-animator
description: |
  Author, configure, animate, and troubleshoot GSAP SplitText implementations.
  Use when: breaking HTML text into characters, words, or lines for animation;
  building responsive typography animations with autoSplit and onSplit; implementing
  text masks and staggered reveals; or resolving font loading, grapheme, and
  screen reader accessibility issues in GSAP.
---

# GSAP SplitText Animator

Implement high-performance, accessible, and responsive text animations using GSAP's `SplitText` plugin.

## Ground Rules

1. **Split only what you animate**: Requesting unused levels (`type: "chars,words,lines"` when only animating lines) wastes DOM memory and CPU cycles.
2. **Never split before fonts load**: Always synchronize initialization with `document.fonts.ready`.
3. **Always return tweens in `onSplit`**: Returning the tween allows SplitText to manage lifecycle cleanup and preserve playback progress during responsive resizes.
4. **Preserve accessibility by design**: Verify screen reader compatibility for every split using native attributes or screen-reader-only duplicates for nested links.

---

## Phase 1: Environment & Font Synchronization

Initialize the plugin and guard against font-loading layout shifts.

1. Register `SplitText` with GSAP:
   ```javascript
   gsap.registerPlugin(SplitText);
   ```
2. Wrap SplitText instantiation in the `document.fonts.ready` promise:
   ```javascript
   document.fonts.ready.then(() => {
     // Safe initialization
   });
   ```

### Completion Gate
- [ ] `SplitText` registered in GSAP core.
- [ ] Initialization code executes after `document.fonts.ready` resolves.

---

## Phase 2: Splitting & Configuration

Configure text splitting with optimal DOM granularity and class hooks.

For the complete property schema and internationalization options, see [configuration.md](references/configuration.md).

1. Determine the required animation targets:
   - Characters only: `type: "chars"` (pair with `smartWrap: true` to preserve natural word wrapping).
   - Words only: `type: "words"`
   - Lines only: `type: "lines"`
   - Multi-tier: `type: "words,lines"` or `type: "chars,words"`
2. Configure class names and indexing:
   - Use `wordsClass: "word"`, `charsClass: "char"`, or `linesClass: "line"`.
   - Append `++` for sequential numbering: `wordsClass: "word++"` generates `word1`, `word2`, etc.
   - Use `propIndex: true` to inject CSS custom properties (`--word: 1;`, `--line: 2;`).
3. Configure masks for slide/reveal effects:
   - Add `mask: "lines"` (or `"words"`, `"chars"`) to generate overflow-clipped wrappers (`.line-mask`).
4. Handle special content:
   - Ignore nested elements: `ignore: "sup, .badge"` keeps nested tags inside their parent word.
   - Preserve formatting/whitespace: set `reduceWhiteSpace: false` for `<pre>` or code blocks.

### Completion Gate
- [ ] Only required split types are defined.
- [ ] Class hooks or CSS variables attached as needed.
- [ ] Special elements (e.g. `<sup>`, badges) marked with `ignore` if they should not split.

---

## Phase 3: Responsive Auto-Splitting & Animation Binding

Construct the animation while supporting viewport resizing without layout corruption.

For worked animation patterns and staggers, see [examples.md](references/examples.md).

1. Enable automated resize handling using `autoSplit: true`.
2. Define the `onSplit: (self)` callback to build and return the GSAP animation:
   ```javascript
   let split = SplitText.create(".target", {
     type: "lines",
     autoSplit: true,
     mask: "lines",
     onSplit: (self) => {
       return gsap.from(self.lines, {
         yPercent: 100,
         opacity: 0,
         duration: 0.8,
         stagger: 0.1,
         ease: "power3.out"
       });
     }
   });
   ```
3. When building complex staggers, use config objects:
   - Timing distribution: `stagger: { amount: 0.6, from: "center" }` (total duration) vs `stagger: { each: 0.05, from: "random" }`.
   - Looping: Place `repeat: -1, yoyo: true` inside the `stagger` object for independent letter loops, or in the tween config for the entire block.
4. Inject organic variation using `gsap.utils.random()`:
   ```javascript
   yPercent: "random([-100, 100])",
   rotation: "random(-25, 25)",
   ```

### Completion Gate
- [ ] `autoSplit: true` enabled on line-split or character-split text.
- [ ] `onSplit` callback receives `(self)` and explicitly returns the created tween or timeline.
- [ ] Resizing the browser window recalculates lines and preserves animation state.

---

## Phase 4: Accessibility Hardening & Cleanup

Ensure assistive technology reads the content correctly and clean up DOM allocations.

For detailed patterns on nested links and screen readers, see [accessibility.md](references/accessibility.md).

1. Assess text content for nested interactive semantics (links, buttons):
   - **Plain text (Standard)**: Retain default SplitText behavior (`aria-label` applied to parent, `aria-hidden="true"` applied to split nodes).
   - **Nested Links/Interactive (Dual DOM pattern)**:
     1. Create duplicate `<p class="sr-only">` with intact semantic tags (`<a href="...">`).
     2. Set `aria: "hidden"` on the visual animated element's SplitText config.
   - **Purely Decorative Animations**:
     1. Set `aria: "none"` in SplitText config.
     2. Add `role="img"` and `aria-label="Description of effect"` to the parent container.
2. If the animation is a one-time entrance, restore clean DOM on complete:
   ```javascript
   onComplete: () => split.revert()
   ```

### Completion Gate
- [ ] Screen readers pronounce natural words rather than spelling single letters.
- [ ] Links and buttons inside animated text remain focusable and readable.
- [ ] One-off animations clean up injected DOM spans upon completion.
