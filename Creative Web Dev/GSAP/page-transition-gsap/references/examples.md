# Implementation Examples

## Example 1: Standard Dual-Row Shutter Transition

**Scenario**: Multi-page agency portfolio (`index.html`, `about.html`, `contact.html`) requiring a seamless black-and-white shutter wipe.

### HTML Structure (`index.html` & `about.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agency Home</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="transitionContainer">
    <div class="transition-row row-1">
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
    </div>
    <div class="transition-row row-2">
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
    </div>
  </div>

  <nav class="nav">
    <a href="index.html" class="logo">STUDIO</a>
    <div class="nav-items">
      <a href="index.html">HOME</a>
      <a href="about.html">ABOUT</a>
    </div>
  </nav>

  <main>
    <div class="title">
      <h1>HOME</h1>
    </div>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

### CSS Styling (`style.css`)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #111111;
  color: #ffffff;
  font-family: monospace;
  overflow: hidden;
}

main {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title h1 {
  font-size: 10vw;
  font-weight: 900;
  text-transform: uppercase;
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}

nav a {
  color: #ffffff;
  text-decoration: none;
  font-size: 1.2rem;
  margin-left: 1.5rem;
}

.transitionContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 50;
  pointer-events: none;
}

.transition-row {
  display: flex;
  flex: 1;
}

.transition-row.row-1 .block {
  transform-origin: top;
}

.transition-row.row-2 .block {
  transform-origin: bottom;
}

.block {
  flex: 1;
  background-color: #ffffff;
  transform: scaleY(1);
  will-change: transform;
}
```

### Orchestration Script (`app.js`)
```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.set(".block", { visibility: "visible", scaleY: 1 });

  revealTransition().then(() => {
    gsap.set(".block", { visibility: "hidden" });
  });

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href === window.location.pathname) return;

      e.preventDefault();
      animateTransition().then(() => {
        window.location.href = href;
      });
    });
  });
});

function revealTransition() {
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    tl.fromTo(
      ".row-1 .block",
      { scaleY: 1 },
      {
        scaleY: 0,
        duration: 1,
        delay: 0.2,
        stagger: { each: 0.1, from: "start", grid: [1, 5], axis: "x" },
        ease: "expo.inOut"
      }
    ).fromTo(
      ".row-2 .block",
      { scaleY: 1 },
      {
        scaleY: 0,
        duration: 1,
        delay: 0.2,
        stagger: { each: 0.1, from: "start", grid: [1, 5], axis: "x" },
        ease: "expo.inOut"
      },
      "<"
    );
  });
}

function animateTransition() {
  return new Promise((resolve) => {
    gsap.set(".block", { visibility: "visible", scaleY: 0 });

    const tl = gsap.timeline({ onComplete: resolve });

    tl.fromTo(
      ".row-1 .block",
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1,
        delay: 0.2,
        stagger: { each: 0.1, from: "end", grid: [1, 5], axis: "x" },
        ease: "expo.out"
      }
    ).fromTo(
      ".row-2 .block",
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1,
        delay: 0.2,
        stagger: { each: 0.1, from: "end", grid: [1, 5], axis: "x" },
        ease: "expo.out"
      },
      "<"
    );
  });
}
```
