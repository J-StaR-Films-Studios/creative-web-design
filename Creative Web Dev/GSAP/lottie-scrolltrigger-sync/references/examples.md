# Implementation Examples

## Minimal Working Example (HTML + JS)

### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lottie + ScrollTrigger</title>
  <style>
    body {
      margin: 0;
      background-color: #b8ecf4;
    }
    .spacer {
      height: 100vh;
    }
    #lottie-container {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <div class="spacer"></div>
  <div id="lottie-container"></div>
  <div class="spacer"></div>

  <!-- CDN Dependencies -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

### `app.js`
```javascript
// 1. Initialize Lottie Animation
const animation = lottie.loadAnimation({
  container: document.getElementById("lottie-container"),
  path: "lottie/airplane.json",
  renderer: "svg",
  autoplay: false,
  loop: false
});

// 2. Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// 3. Bind ScrollTrigger to Frame Scrubbing
ScrollTrigger.create({
  trigger: "#lottie-container",
  start: "top bottom",
  end: "bottom top",
  scrub: true,
  onUpdate: function (self) {
    const progress = self.progress;
    if (animation.totalFrames) {
      animation.goToAndStop(animation.totalFrames * progress, true);
    }
  }
});
```
