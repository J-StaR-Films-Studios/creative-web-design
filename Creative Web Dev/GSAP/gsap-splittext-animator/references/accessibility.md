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
