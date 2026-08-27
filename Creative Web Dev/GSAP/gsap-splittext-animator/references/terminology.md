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
