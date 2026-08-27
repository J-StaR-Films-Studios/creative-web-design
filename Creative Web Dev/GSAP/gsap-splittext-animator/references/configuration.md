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
