# Implementation Examples

## Example 1: 5-Column Staggered Wipe & Content Entrance

### HTML Structure (`index.html` & `services.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Transition Example</title>
  <link rel="stylesheet" href="css/main.css">
</head>
<body data-barba="wrapper">
  <!-- Persistent Transition Curtain -->
  <ul class="transition">
    <li></li><li></li><li></li><li></li><li></li>
  </ul>

  <div class="wrapper">
    <header>
      <nav>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="services.html">Services</a></li>
        </ul>
      </nav>
    </header>

    <!-- Dynamic Container -->
    <main data-barba="container" data-barba-namespace="home">
      <div class="left">
        <h1>An Ongoing Experience</h1>
        <a href="services.html" class="cta">Explore Services</a>
      </div>
      <img src="photo.jpg" alt="Interior Architecture">
    </main>
  </div>

  <script src="https://unpkg.com/@barba/core"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>
  <script src="js/index.js"></script>
</body>
</html>
```

### JavaScript Implementation (`js/index.js`)
```javascript
function delay(n) {
  n = n || 2000;
  return new Promise((done) => setTimeout(done, n));
}

function pageTransition() {
  var tl = gsap.timeline();

  // Curtain rises up
  tl.to('ul.transition li', {
    duration: 0.5,
    scaleY: 1,
    transformOrigin: 'bottom left',
    stagger: 0.2
  });

  // Curtain drops down
  tl.to('ul.transition li', {
    duration: 0.5,
    scaleY: 0,
    transformOrigin: 'bottom left',
    stagger: 0.1,
    delay: 0.1
  });
}

function contentAnimation() {
  var tl = gsap.timeline();

  tl.from('.left', {
    duration: 1.5,
    translateY: 50,
    opacity: 0
  });

  tl.to('img', {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
  }, '-=1.1');
}

barba.init({
  sync: true,
  transitions: [
    {
      async leave(data) {
        const done = this.async();
        pageTransition();
        await delay(1500);
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
