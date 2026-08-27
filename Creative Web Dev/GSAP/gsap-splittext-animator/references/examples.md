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
