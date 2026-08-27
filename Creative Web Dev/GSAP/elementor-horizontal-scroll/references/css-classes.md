# CSS Classes and Configuration Reference

## Driver Code Template

Embed inside an Elementor HTML widget on the target page:

```html
<style>
/* Horizontal Scroll Configuration */
:root {
  --progress-bar: true;
  --progress-bar-color: #FFF00;
  --progress-bar-height: 2px;
}

body {
  --disable-movement-desktop: false;
  --disable-movement-tablet: false;
  --disable-movement-mobile: true;
  --hide-default-scrollbar: false;
  --disable-horizontal-scroll-mobile: false;
}
</style>
```

---

## Class Naming Conventions

### 1. Structural Classes
| CSS Class | Target Element | Description |
|---|---|---|
| `mdw-horizontal-scroll` | Outer Viewport Container | Activates horizontal scroll driver on container |
| `[custom-name]` (e.g., `mdw-section-1`) | Slide Container | Target anchor identifier for jump links |

---

### 2. Parallax Motion Classes
Syntax: `mdw-hs-movement-[property]-[axis]-[speed][-reverse]`

| CSS Class | Effect |
|---|---|
| `mdw-hs-movement-translate-x-20` | Shifts element along X-axis at speed 20 |
| `mdw-hs-movement-translate-x-50` | Fast shift along X-axis at speed 50 |
| `mdw-hs-movement-translate-x-50-reverse` | Shifts element along X-axis in opposite scroll direction |
| `mdw-hs-movement-translate-y-20` | Shifts element along Y-axis at speed 20 |
| `mdw-hs-movement-translate-y-50-reverse` | Shifts element along Y-axis in opposite direction |
| `mdw-hs-movement-translate-x-20 mdw-hs-movement-translate-y-20` | Multi-axis diagonal parallax shift |

---

### 3. Rotational Classes
Syntax: `mdw-hs-movement-rotate-[speed][-reverse]`

| CSS Class | Effect |
|---|---|
| `mdw-hs-movement-rotate-10` | Rotates element clockwise proportional to scroll |
| `mdw-hs-movement-rotate-10-reverse` | Rotates element counter-clockwise proportional to scroll |
| `mdw-hs-movement-rotate-30` | High-speed clockwise rotation |

---

### 4. Entrance Reveal Classes
Syntax: `mdw-reveal-animation-[direction]`

*Note: Requires widget/container Entrance Animation set to `Fade In` with duration `Slow`.*

| CSS Class | Reveal Direction |
|---|---|
| `mdw-reveal-animation-left` | Slide reveals entering from the left |
| `mdw-reveal-animation-right` | Slide reveals entering from the right |
| `mdw-reveal-animation-top` | Slide reveals entering from top |
| `mdw-reveal-animation-bottom` | Slide reveals entering from bottom |
```

***
