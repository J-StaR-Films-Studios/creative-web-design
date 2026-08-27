Here is the complete compilation of the video source material into an operational agent skill following the **Source-to-Skill** pipeline.

---

# Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / technical walkthrough |
| **Title** | *GSAP SplitText Plugin: Complete Guide, Features, Animation & Accessibility* |
| **Authority** | Cassie Evans (Lead Developer & Educator at GSAP / GreenSock) — Official author credibility on GSAP architecture |
| **Coverage** | SplitText installation & core architecture, text splitting granularity (chars, words, lines), config options (`wordsClass`, `propIndex`, `smartWrap`, `ignore`, `prepareText`), font loading lifecycle management, GSAP staggers and randomization, responsive auto-splitting (`autoSplit`, `onSplit` callback lifecycle & progress preservation), CSS overflow masking (`mask`), accessibility (screen reader `aria-label`/`aria-hidden`, decorative `role="img"`, nested semantic links with `.sr-only` patterns), and clean-up / reverting (`split.revert()`). |

### Coverage Gaps Identified
- *Framework-specific wrappers (React `useGSAP`, Vue lifecycle hooks)*: The source focuses on vanilla JS / DOM APIs. Framework integration is noted where relevant, but core DOM patterns remain canonical.

---

# Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# KNOWLEDGE SPEC: GSAP SplitText Methodology
# ==============================================================================

# --- CONCEPTS ---
- id: ku-001
  type: concept
  name: SplitText
  source: src-01, "00:05-00:45"
  confidence: high
  definition: >
    A GSAP utility plugin that decomposes HTML text into individual DOM elements 
    (characters, words, lines) wrapped in inline-block containers for granular animation.
  attributes: [standalone capability, DOM mutation, GSAP core integration]
  avoid_terms: [text parser, letter cutter, DOM slicer]

- id: ku-002
  type: concept
  name: autoSplit
  source: src-01, "10:28-11:06"
  confidence: high
  definition: >
    An automated responsive observer in SplitText that tracks element width changes 
    via ResizeObserver and dynamically re-splits text across lines when viewport sizes shift.
  attributes: [ResizeObserver-backed, debounced, line-reflow management]
  avoid_terms: [auto-resize, responsive wrapper, media query watcher]

- id: ku-003
  type: concept
  name: Grapheme Cluster
  source: src-01, "07:35-08:15"
  confidence: high
  definition: >
    A user-perceived character composed of multiple Unicode code points 
    (e.g., emojis with zero-width joiners, complex Hindi/Devanagari conjuncts).
  attributes: [Unicode normalization, multi-codepoint, zero-width joiners]
  avoid_terms: [compound letter, merged glyph]

- id: ku-004
  type: concept
  name: Overflow Masking (mask)
  source: src-01, "12:56-13:37"
  confidence: high
  definition: >
    The automatic generation of parent wrapper container elements with overflow clipping 
    around split lines, words, or characters to create wipe/slide reveal animations.
  attributes: [wrapper injection, overflow-hidden, suffix .line-mask]
  avoid_terms: [clip-path wrapper, hidden layer]

# --- PRINCIPLES ---
- id: ku-010
  type: principle
  name: Minimal Granularity Principle
  source: src-01, "01:49-01:56"
  confidence: high
  statement: >
    Only split text by the granular units (lines, words, or chars) strictly required 
    by the animation effect.
  rationale: >
    Each split character or word creates additional DOM nodes and styles. Splitting 
    unneeded units wastes browser layout, style recalculation, and composite memory.
  applies_to: [ku-020, ku-021]

- id: ku-011
  type: principle
  name: Font Loading Synchronization
  source: src-01, "05:40-06:29"
  confidence: high
  statement: >
    Always defer SplitText instantiation until all custom web fonts have fully loaded 
    and rendered in the DOM.
  rationale: >
    Splitting text before fallback fonts swap to web fonts results in incorrect bounding 
    box measurements, broken line wraps, and misplaced masks.
  applies_to: [ku-020, ku-022]

- id: ku-012
  type: principle
  name: Animation Return Contract in onSplit
  source: src-01, "11:51-12:39"
  confidence: high
  statement: >
    When using autoSplit, always return the newly created GSAP tween/timeline from 
    the onSplit callback.
  rationale: >
    Returning the tween allows SplitText to automatically revert the obsolete animation, 
    clean inline transforms, create the new tween on fresh split nodes, and restore 
    exact playback progress seamlessly.
  applies_to: [ku-022]

- id: ku-013
  type: principle
  name: Accessibility Semantics Preservation
  source: src-01, "14:11-16:07"
  confidence: high
  statement: >
    Preserve native semantic hierarchy for assistive technologies by default using 
    aria-label, or use dual-element patterns (.sr-only duplicate) when interactive 
    elements (links, buttons) are nested.
  rationale: >
    Splitting text disrupts natural screen reader pronunciation (spelling out single chars) 
    and flattens nested interactive tags when using aria-label alone.
  applies_to: [ku-020, ku-024]

# --- PROCEDURES ---
- id: ku-020
  type: procedure
  name: Safe SplitText Initialization
  source: src-01, "00:55-02:15, 06:12-06:29"
  confidence: high
  goal: Safely register, configure, and instantiate SplitText on DOM text elements
  prerequisites: [GSAP core and SplitText plugin loaded]
  steps:
    - action: Register SplitText with GSAP via gsap.registerPlugin(SplitText)
      criterion: SplitText is recognized by GSAP core
    - action: Await document.fonts.ready promise
      criterion: All web fonts are active and layout geometry is stable
    - action: Call SplitText.create(target, config) specifying minimum needed type
      criterion: Text is cleanly partitioned into target DOM spans/divs with proper aria attributes
  outputs: [SplitText instance with .chars, .words, and/or .lines node arrays]

- id: ku-021
  type: procedure
  name: Staggered Text Animation Implementation
  source: src-01, "01:56-02:37, 03:53-05:36"
  confidence: high
  goal: Create staggered reveal or transform animations using GSAP tweens and split arrays
  prerequisites: [SplitText instance created]
  steps:
    - action: Target split.chars, split.words, or split.lines in a gsap.from/fromTo tween
      criterion: Target array matches the configured split type
    - action: Configure stagger object with amount or each, from origin, and distribution
      criterion: Timing sequence matches intended visual motion pattern
    - action: Apply random utility functions for organic/chaotic text entrances if desired
      criterion: Random values bounded within safe visual ranges
  outputs: [Active GSAP Tween or Timeline executing on split elements]

- id: ku-022
  type: procedure
  name: Responsive Auto-Splitting Setup
  source: src-01, "10:28-12:44"
  confidence: high
  goal: Maintain correct word wrapping, line breaks, and animation progress during window resize
  prerequisites: [SplitText instance configured with lines or chars/words]
  steps:
    - action: Set autoSplit: true in SplitText configuration
      criterion: ResizeObserver is bound to the target container
    - action: Define onSplit: (self) callback
      criterion: Callback receives the SplitText instance argument
    - action: Instantiate and return the GSAP tween inside onSplit
      criterion: Return statement passes tween back to SplitText internal lifecycle manager
  outputs: [Responsive SplitText instance with seamless resize handling and progress preservation]

- id: ku-023
  type: procedure
  name: Overflow Mask Reveal Configuration
  source: src-01, "12:56-13:37"
  confidence: high
  goal: Create clean slide-in reveal animations without visible text bleeding outside line containers
  prerequisites: [SplitText instance configured]
  steps:
    - action: Add mask: "lines" (or "words"/"chars") to SplitText configuration
      criterion: SplitText injects wrapper divs with overflow: hidden / clip
    - action: Animate split.lines from yPercent: 100 or y: "100%" with autoAlpha / opacity
      criterion: Text translates from beneath the mask into view smoothly
  outputs: [Masked reveal animation]

- id: ku-024
  type: procedure
  name: Accessible Text Splitting Pattern Selection
  source: src-01, "13:38-16:30"
  confidence: high
  goal: Ensure WCAG-compliant screen reader accessibility for split text
  prerequisites: [HTML text structure analyzed]
  steps:
    - action: Check if text contains nested links, buttons, or semantic inline elements
      criterion: Branch decision made (Standard vs. Dual DOM vs. Pure Decorative)
    - action: For plain text, rely on default aria-label on parent and aria-hidden="true" on children
      criterion: Screen reader announces sentence naturally
    - action: For nested links, duplicate element with .sr-only and set aria: "hidden" on split target
      criterion: Screen reader retains interactive link focus while visual element animates
    - action: For purely decorative effects, set aria: "none", role="img", and descriptive aria-label
      criterion: Screen reader describes the visual art instead of raw characters
    - action: On one-off entrance animations, call split.revert() in onComplete
      criterion: Original semantic DOM is restored after animation finishes
  outputs: [Fully accessible text animation markup]

# --- CONSTRAINTS ---
- id: ku-030
  type: constraint
  name: No Splitting Before Fonts Ready
  source: src-01, "05:40-06:29"
  confidence: high
  rule: Never call SplitText.create() before document.fonts.ready resolves when using custom fonts.
  consequence: Layout calculations break, line splits misalign, and console warnings trigger.

- id: ku-031
  type: constraint
  name: Must Return Tween in onSplit
  source: src-01, "11:51-12:39"
  confidence: high
  rule: Must return the GSAP tween or timeline inside the onSplit callback when autoSplit: true.
  consequence: Obsolete tweens leak, conflicting transforms collide, and animation restarts on resize.
```

---

# Phase 3: Methodology Synthesis

```
STAGE 1: Environment & Font Preparation
INPUT: Target DOM text element, web fonts loaded in stylesheet.
STEPS:
1. Register plugin: gsap.registerPlugin(SplitText).
2. Await font promise: await document.fonts.ready (or wrap in document.fonts.ready.then()).
DECISION POINTS:
- If fonts are hosted locally with fallback swaps → Ensure font-display does not trigger layout shift after split.
OUTPUT: Stable DOM geometry ready for slicing.
VALIDATION:
[ ] SplitText registered without warnings.
[ ] document.fonts.ready resolved before SplitText execution.

STAGE 2: Splitting Strategy & Configuration
INPUT: Target selector, animation requirement, semantic structure of text.
STEPS:
1. Select minimal split type ("lines", "words", "chars", or combo).
2. Choose class hooks: wordsClass, charsClass, linesClass (use "name++" for indexed classes).
3. Evaluate special formatting needs:
   - If line-wrapping issues on char-split → add smartWrap: true.
   - If preformatted text / code blocks → set reduceWhiteSpace: false.
   - If nested superscript/tags to keep unified → add ignore: "sup, .no-split".
   - If non-space-delimited language (Chinese, Japanese) → provide custom prepareText and wordDelimiter.
4. Evaluate masking requirement → add mask: "lines" | "words" | "chars".
OUTPUT: Configured SplitText instance.
VALIDATION:
[ ] Only necessary types (chars/words/lines) requested.
[ ] Proper wrappers injected into DOM.

STAGE 3: Responsive & Animation Lifecycle Binding
INPUT: SplitText instance, target motion parameters (translate, opacity, rotation, stagger).
STEPS:
1. Enable autoSplit: true for responsive line wrapping.
2. Define onSplit: (self) callback.
3. Build GSAP tween inside onSplit targeting self.lines, self.words, or self.chars.
4. Apply stagger (amount/each, from: "start"|"center"|"end"|"random", yoyo, repeat).
5. RETURN the tween from onSplit callback.
OUTPUT: Self-recovering responsive text animation.
VALIDATION:
[ ] Tween returned from onSplit.
[ ] Window resizing re-splits text without breaking animation progress or stacking inline transforms.

STAGE 4: Accessibility Hardening & Cleanup
INPUT: Semantic text requirements, animation lifetime (one-off vs. loop).
STEPS:
1. Check for nested interactive tags (e.g. <a>, <button>):
   - If present: create duplicate with .sr-only class; set aria: "hidden" on animated split container.
   - If plain text: allow default aria-label / aria-hidden behavior.
   - If decorative art: set aria: "none", role="img", aria-label="Description".
2. If entrance animation runs once: add onComplete: () => split.revert() to restore clean DOM.
OUTPUT: WCAG-compliant DOM with clean post-animation footprint.
VALIDATION:
[ ] Screen reader reads original text or description without letter-by-letter spelling.
[ ] Semantic links remain accessible to keyboard and screen readers.
[ ] DOM cleanly reverted if animation is non-recurring.
```

---

# Phase 4: Skill Compilation

Below is the complete agent skill package ready for deployment.

### Directory Structure
```
gsap-splittext-animator/
├── SKILL.md
└── references/
    ├── terminology.md
    ├── configuration.md
    ├── accessibility.md
    └── examples.md
```

---

### File: `gsap-splittext-animator/SKILL.md`

```markdown
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
```

---

### File: `gsap-splittext-animator/references/terminology.md`

```markdown
# Terminology

**SplitText**:
The official GSAP plugin that partitions text nodes into nested HTML elements (`chars`, `words`, `lines`) for DOM-based animation.
_Avoid_: text parser, DOM slicer, text cutter

**autoSplit**:
A built-in ResizeObserver feature in SplitText that automatically re-calculates and re-partitions line breaks when an element changes width.
_Avoid_: window resize listener, auto-wrapper, responsive hack

**onSplit**:
The lifecycle callback executed immediately after text is partitioned (initially and on every `autoSplit` resize), which must return the active tween to preserve playhead progress and cleanly revert obsolete styles.
_Avoid_: onResize, onComplete, splitCallback

**smartWrap**:
A configuration setting that groups split characters into word spans to prevent browser layout engines from breaking mid-word during responsive text reflows.
_Avoid_: word grouping, letter bundling

**Overflow Mask (mask)**:
An automated wrapper element injected around split lines, words, or characters styled with `overflow: hidden` / `overflow: clip` to facilitate slide-in reveal animations without visual overflow.
_Avoid_: clip-path layer, hidden div

**Grapheme Cluster**:
A user-perceived Unicode character that consists of multiple code points (e.g. skin-tone emojis, Devanagari script conjuncts).
_Avoid_: multi-char, compound glyph

**Dual DOM Pattern**:
An accessibility technique using an invisible `.sr-only` clone containing full semantic HTML alongside a visually animated `aria-hidden="true"` element.
_Avoid_: hidden copy, double markup hack
```

---

### File: `gsap-splittext-animator/references/configuration.md`

```markdown
# SplitText Configuration Reference

Complete options reference for `SplitText.create(target, config)` or `new SplitText(target, config)`.

## Core Configuration Options

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `string` | `"chars,words,lines"` | Comma-separated list of splitting units: `"lines"`, `"words"`, `"chars"`. |
| `autoSplit` | `boolean` | `false` | Enables internal `ResizeObserver` on element to re-split on width change. |
| `onSplit` | `function(self)` | `undefined` | Callback invoked on initial split and every autoSplit. **Must return the tween.** |
| `mask` | `string` | `undefined` | Wraps split elements in overflow-clipped containers: `"lines"`, `"words"`, or `"chars"`. |
| `smartWrap` | `boolean` | `false` | Keeps characters bundled inside word wrappers to prevent broken word wraps. |
| `charsClass` | `string` | `undefined` | CSS class assigned to character elements. Append `++` for sequential IDs. |
| `wordsClass` | `string` | `undefined` | CSS class assigned to word elements. Append `++` for sequential IDs. |
| `linesClass` | `string` | `undefined` | CSS class assigned to line elements. Append `++` for sequential IDs. |
| `propIndex` | `boolean` | `false` | Injects CSS custom properties (`--line`, `--word`, `--char`) with 1-based indices. |
| `ignore` | `string` | `undefined` | CSS selector of child elements to keep unified rather than splitting (e.g., `"sup, sub"`). |
| `reduceWhiteSpace` | `boolean` | `true` | When `false`, preserves extra spaces and inserts `<br>` tags at preformatted line breaks. |
| `aria` | `string` | `"auto"` | Accessibility handling: `"auto"` (default aria-label), `"hidden"` (aria-hidden), or `"none"`. |
| `prepareText` | `function(text, el)`| `undefined` | Pre-processes text chunks before splitting (useful for custom regex/tokenization). |
| `wordDelimiter` | `string` / `RegExp` | `undefined` | Custom delimiter used to define word boundaries. |

---

## Non-Latin & Custom Word Boundary Splitting

For languages without standard whitespace word boundaries (e.g., Chinese, Japanese), pair `Intl.Segmenter` inside `prepareText` with zero-width spaces and a custom `wordDelimiter`:

```javascript
const segmenter = new Intl.Segmenter("zh", { granularity: "word" });

SplitText.create(".chinese-text", {
  type: "words",
  prepareText: (text) => {
    return Array.from(segmenter.segment(text))
      .map(s => s.segment)
      .join("\u200C"); // Join segments with zero-width non-joiner
  },
  wordDelimiter: "\u200C",
  autoSplit: true,
  onSplit: (self) => {
    return gsap.from(self.words, {
      y: 50,
      opacity: 0,
      stagger: 0.05,
      ease: "back.out(1.7)"
    });
  }
});
```

---

## Standalone Usage (Without GSAP Core)

SplitText can partition DOM nodes without GSAP core if you only need layout preparation:

```javascript
// Standalone DOM slicing
let split = SplitText.create("#header", {
  type: "words,chars",
  wordsClass: "word",
  charsClass: "char++"
});

// Access node arrays
console.log(split.words); // Array of HTMLElement
console.log(split.chars); // Array of HTMLElement

// Manual revert when done
split.revert();
```
```

---

### File: `gsap-splittext-animator/references/accessibility.md`

```markdown
# Accessibility Patterns for SplitText

Splitting text breaks native text flows into multiple `<span>` or `<div>` elements. Without proper accessibility handling, screen readers spell out individual characters or misread fragmented lines.

---

## Pattern 1: Standard Plain Text (Built-in Default)

SplitText automatically sets `aria-label="Full original text"` on the parent container and `aria-hidden="true"` on all split child nodes.

```html
<!-- Resulting DOM output from SplitText on plain text -->
<h2 class="split-heading" aria-label="Animate anything easily">
  <div class="line" aria-hidden="true">
    <div class="word" aria-hidden="true">Animate</div>
    <div class="word" aria-hidden="true">anything</div>
  </div>
  <div class="line" aria-hidden="true">
    <div class="word" aria-hidden="true">easily</div>
  </div>
</h2>
```

---

## Pattern 2: Dual DOM Pattern (Nested Links & Semantic Tags)

When text contains nested interactive elements (`<a>`, `<button>`, `<strong>`), `aria-label` on the parent flattens all internal semantics. Use the **Dual DOM Pattern**:

### CSS
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### HTML
```html
<div class="text-wrapper">
  <!-- 1. Screen Reader element (Not animated, full semantics intact) -->
  <p class="sr-only">
    Read our <a href="/terms">terms of service</a> before proceeding.
  </p>

  <!-- 2. Visual element (Animated, hidden from screen readers) -->
  <p class="animate-text" aria-hidden="true">
    Read our <a href="/terms" tabindex="-1">terms of service</a> before proceeding.
  </p>
</div>
```

### JavaScript
```javascript
SplitText.create(".animate-text", {
  type: "lines,words",
  aria: "hidden", // Prevents SplitText from adding conflicting aria-labels
  autoSplit: true,
  onSplit: (self) => {
    return gsap.from(self.words, {
      y: 30,
      opacity: 0,
      stagger: 0.04
    });
  }
});
```

---

## Pattern 3: Purely Decorative Text FX

When text is an animated visual texture rather than critical reading content:

```javascript
SplitText.create(".kinetic-spiral", {
  type: "chars",
  aria: "none" // Disables all automated ARIA injection
});
```

```html
<div class="kinetic-spiral" role="img" aria-label="Decorative animated letter vortex">
  <!-- Split characters animated here -->
</div>
```

---

## Pattern 4: Post-Animation DOM Restoration (`revert`)

For one-off entrance animations, revert the DOM once animation finishes to restore standard semantic layout:

```javascript
SplitText.create(".intro-title", {
  type: "chars,words",
  autoSplit: true,
  onSplit: (self) => {
    return gsap.from(self.chars, {
      y: 100,
      opacity: 0,
      stagger: 0.03,
      onComplete: () => {
        // Restores original HTML, removes injected divs/spans
        self.revert();
      }
    });
  }
});
```
```

---

### File: `gsap-splittext-animator/references/examples.md`

```markdown
# SplitText Animation Examples

## 1. Masked Line Reveal (Hero Section Header)

**Scenario**: A clean editorial hero heading that slides up from behind masked line boundaries on page load with auto-reflow support on resize.

```javascript
document.fonts.ready.then(() => {
  SplitText.create(".hero-title", {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit: (self) => {
      return gsap.from(self.lines, {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out"
      });
    }
  });
});
```

---

## 2. Chaotic Character Explode / Gather Entrance

**Scenario**: Words drop in from randomized coordinate offsets and rotation angles with bounce easing.

```javascript
document.fonts.ready.then(() => {
  SplitText.create(".quote", {
    type: "chars,words",
    smartWrap: true,
    autoSplit: true,
    onSplit: (self) => {
      return gsap.from(self.chars, {
        yPercent: "random([-120, 120])",
        rotation: "random(-35, 35)",
        opacity: 0,
        duration: 1.2,
        ease: "back.out(2)",
        stagger: {
          amount: 0.8,
          from: "random"
        }
      });
    }
  });
});
```

---

## 3. Targeted Word Highlight with Custom CSS Variable Indexing

**Scenario**: Individual words animate with staggered delays and receive dynamic CSS variable hooks for custom styling.

```javascript
document.fonts.ready.then(() => {
  SplitText.create(".highlight-paragraph", {
    type: "words",
    wordsClass: "word++",
    propIndex: true,
    autoSplit: true,
    onSplit: (self) => {
      return gsap.from(self.words, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: "power2.out"
      });
    }
  });
});
```

### Accompanying CSS:
```css
.word {
  display: inline-block;
  transition: color 0.3s ease;
}

/* Target specific numbered word generated via wordsClass: "word++" */
.word3, .word7 {
  color: #ff5500;
  text-decoration: underline;
}
```

---

## 4. Reduced Motion & Responsive Viewport Wrapper (`matchMedia`)

**Scenario**: Integrating SplitText with `gsap.matchMedia` to respect accessibility user preferences (`prefers-reduced-motion`).

```javascript
let mm = gsap.matchMedia();

document.fonts.ready.then(() => {
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    let split = SplitText.create(".headline", {
      type: "words,chars",
      smartWrap: true,
      autoSplit: true,
      onSplit: (self) => {
        return gsap.from(self.chars, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: "expo.out"
        });
      }
    });

    return () => split.revert(); // Cleanup on media query mismatch
  });
});
```
```

---

# Phase 5: Validation

### 1. Source Fidelity Check
- [x] **Registration & Core API**: `gsap.registerPlugin(SplitText)`, `SplitText.create()` encoded in Phase 1 & 2.
- [x] **Granularity Types & Performance**: `lines`, `words`, `chars` and performance guidelines encoded in Ground Rules and Phase 2.
- [x] **Class & Variable Indexing**: `wordsClass`, `charsClass`, `linesClass`, `"++"` numbering, and `propIndex: true` documented in configuration reference.
- [x] **Special Tag Handling**: `smartWrap: true`, `ignore: "selector"`, and `reduceWhiteSpace: false` covered in Phase 2 & config.
- [x] **Font Loading Caveat**: `document.fonts.ready` enforced as a hard completion gate in Phase 1.
- [x] **Staggers & Random Utility**: `amount`, `each`, `from`, `gsap.utils.random()`, and looping patterns covered in Phase 3 & examples.
- [x] **Responsive Line Splitting**: `autoSplit: true` and the return contract for `onSplit` covered in Phase 3.
- [x] **Masking**: `mask: "lines"|"words"|"chars"` with `.line-mask` detailed in Phase 2 & examples.
- [x] **Accessibility / A11y**: Standard `aria-label`/`aria-hidden`, Dual DOM `.sr-only` for links, decorative `role="img"`, and `split.revert()` lifecycle documented in Phase 4 & dedicated reference.
- [x] **Non-Latin Language Splitting**: `prepareText` with `Intl.Segmenter` and `wordDelimiter` documented in configuration reference.
- [x] **MatchMedia Integration**: `gsap.matchMedia()` with `prefers-reduced-motion` included in examples reference.

### 2. Operational Coverage Walkthrough Scenarios

| Scenario | Walkthrough Result | Status |
|---|---|---|
| **Scenario 1: Developer needs multi-line text to split by lines, slide up from behind an overflow mask, and not break when browser resizes.** | Follows Phase 1 (`document.fonts.ready`) → Phase 2 (`mask: "lines"`) → Phase 3 (`autoSplit: true`, returns tween in `onSplit`). Code handles resize smoothly with no transform stacking. | **PASSED** |
| **Scenario 2: Text contains an active `<a>` link inside a paragraph. Developer animates words with SplitText.** | Follows Phase 4 & `accessibility.md` (Pattern 2: Dual DOM). Creates `.sr-only` duplicate and sets `aria: "hidden"` on split container. Screen reader reads and focuses link correctly. | **PASSED** |
| **Scenario 3: Splitting Chinese characters by word segments rather than whitespace.** | Consults `configuration.md` (Non-Latin section). Implements `Intl.Segmenter` in `prepareText` with zero-width non-joiner delimiter. Words split cleanly. | **PASSED** |

---

# Delivery Summary

1. **Skill Name**: `gsap-splittext-animator`
2. **Knowledge Units Extracted**: 15 atomic knowledge units (4 concepts, 4 principles, 5 procedures, 2 constraints).
3. **Artifacts Produced**:
   - `SKILL.md` (Operational workflow under 500 lines)
   - `references/terminology.md` (Domain terms with definitions and anti-synonyms)
   - `references/configuration.md` (Full configuration options table, custom segmenters, standalone API)
   - `references/accessibility.md` (WCAG compliance patterns, screen reader handling, Dual DOM architecture)
   - `references/examples.md` (Production-ready code recipes for masked reveals, random staggers, CSS variables, and matchMedia)
4. **Known Limitations**:
   - SplitText relies on browser DOM geometry; Canvas or WebGL text rendering is outside this plugin's scope.
   - Dual DOM markup duplication for nested links requires CSS `.sr-only` utility support in the host project.
