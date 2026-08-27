# Worked Examples

## Example 1: Basic Line-by-Line Reveal

**Scenario**: A clean paragraph or heading reveal where lines slide up smoothly.

```html
<h1 class="reveal-text">Creative GSAP Text Reveal</h1>

<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(SplitText);

    let split = SplitText.create(".reveal-text", { type: "lines" });

    gsap.from(split.lines, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    });
  });
</script>
```

**Outcome**: Lines slide up sequentially from 30px offset with a 0.2s delay between lines.

---

## Example 2: Word-by-Word Reveal with Center Origin

**Scenario**: A bold headline revealing outward from the center word.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

  let split = SplitText.create(".reveal-text", { type: "words" });

  gsap.from(split.words, {
    y: 25,
    opacity: 0,
    duration: 0.7,
    stagger: {
      each: 0.15,
      from: "center"
    }
  });
});
```

**Outcome**: Middle words animate first, cascading outward to the start and end words.

---

## Example 3: Character-by-Character Random Reveal

**Scenario**: A stylized title effect where characters fade and rise randomly.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

  let split = SplitText.create(".reveal-text", { type: "chars" });

  gsap.from(split.chars, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: {
      each: 0.05,
      from: "random"
    }
  });
});
```

**Outcome**: Individual characters pop in randomly across the text block until fully legible.
```

---

## Delivery Summary

1. **Extraction Count**:
   - 2 Concepts (`SplitText Plugin`, `Stagger Property`)
   - 3 Procedures (`Environment & CDN Setup`, `Plugin Registration and Text Splitting`, `Entrance Animation Configuration`)
   - 2 Principles (`Prefer gsap.from Over gsap.to`, `Match Split Type to Design Scope`)
   - 1 Constraint (`Script Load Order Precedence`)
   - 1 Worked Example extracted directly from demonstration
2. **Key Methodology Encoded**:
   - Explicit script inclusion order for GSAP core, SplitText, and app script.
   - Decomposing text using `SplitText.create()`.
   - Tween construction using `gsap.from()`.
   - Direct numerical vs. object-based stagger configurations (`from: 'start' | 'end' | 'center' | 'random'`).
3. **Artifacts Produced**:
   - `SKILL.md` (under 500 lines, imperative, completion-gate governed)
   - `references/terminology.md`
   - `references/examples.md`
