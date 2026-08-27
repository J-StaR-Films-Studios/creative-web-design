# Implementation Examples

## Minimal Complete Multi-Page Setup

### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Home</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body data-barba="wrapper">
  <div class="transition"></div>
  <div class="wrapper">
    <nav class="nav">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
    </nav>
    <main data-barba="container" data-barba-namespace="home" class="container">
      <div class="header">
        <h1>Homebase</h1>
        <div class="header-revealer"></div>
      </div>
      <div class="footer">(01)</div>
    </main>
  </div>

  <script src="https://unpkg.com/@barba/core"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.6/gsap.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

### `styles.css`
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: "Neue Montreal", sans-serif;
  background: #0f0f0f;
  color: #ffffff;
}

.wrapper {
  width: 100%;
  height: 100%;
}

.nav {
  width: 100%;
  display: flex;
  gap: 2em;
  padding: 2em 2.5em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

a {
  text-decoration: none;
  color: #ffffff;
}

.footer {
  position: absolute;
  bottom: 0;
  padding: 4em 2em;
  color: #5f5f5f;
}

.transition {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  background: #ffffff;
  -webkit-transform: scaleY(0);
  transform: scaleY(0);
}

.container {
  padding: 2em;
}

.header {
  position: relative;
  width: max-content;
  height: max-content;
}

h1 {
  position: relative;
  line-height: 1;
  font-size: 120px;
  font-weight: 400;
  color: #ffffff;
  top: 120px;
}

.header-revealer {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.header-revealer::after {
  content: "";
  position: absolute;
  top: 120px;
  left: 0;
  width: 110%;
  height: 110%;
  background: #0f0f0f;
}
```

### `script.js`
```javascript
function pageTransition() {
  const tl = gsap.timeline();
  tl.to(".transition", {
    duration: 1,
    scaleY: 1,
    transformOrigin: "bottom",
    ease: "power4.inOut"
  });
  tl.to(".transition", {
    duration: 1,
    scaleY: 0,
    transformOrigin: "top",
    ease: "power4.inOut",
    delay: 0.2
  });
}

function contentAnimation() {
  const tl = gsap.timeline();
  tl.to("h1", {
    top: 0,
    duration: 1,
    ease: "power3.inOut",
    delay: 0.75
  });
}

function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

barba.init({
  sync: true,
  transitions: [
    {
      async leave(data) {
        const done = this.async();
        pageTransition();
        await delay(1000);
        done();
      },
      async enter(data) {
        contentAnimation();
      },
      async once(data) {
        contentAnimation();
      }
    }
  ]
});
```
