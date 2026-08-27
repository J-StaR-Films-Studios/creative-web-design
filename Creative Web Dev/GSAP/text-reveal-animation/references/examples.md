# Examples & Implementation Patterns

## Example 1: Standard Bottom-Up Staggered Text Reveal

**Scenario**: Hero headline reveal on initial page load.

### HTML
```html
<header>
  <h1 id="headline">Gary.Simon</h1>
</header>

<script src="https://unpkg.com/split-type"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.2/gsap.min.js"></script>
```

### CSS (`main.css`)
```css
header {
  display: grid;
  place-content: center;
  height: 100vh;
}

h1 {
  font-size: 7rem;
  text-transform: uppercase;
  font-family: 'Bebas Neue', sans-serif;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  line-height: 5.9rem;
}

.char {
  transform: translateY(115px);
  transition: transform 0.5s;
}
```

### JavaScript
```javascript
const myText = new SplitType('#headline');

gsap.to('.char', {
  y: 0,
  stagger: 0.05,
  delay: 0.2,
  duration: 0.1
});
```

---

## Example 2: Inverted Top-Down Reveal

**Scenario**: Downward letter entrance for secondary headings or hover states.

### CSS Alteration
```css
.char {
  transform: translateY(-115px);
}
```

### JavaScript
```javascript
const myText = new SplitType('#subhead');

gsap.to('.char', {
  y: 0,
  stagger: 0.04,
  delay: 0.1,
  duration: 0.15,
  ease: 'back.out(1.7)'
});
```
