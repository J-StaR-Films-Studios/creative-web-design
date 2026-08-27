# Reference Implementation

## Full HTML / CSS / JS Boilerplate

### 1. `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tradition & Creation</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <section class="main_container">
    <!-- Entry Page -->
    <div class="page first_page">
      <p class="scroll-indicator">Scroll Down</p>
    </div>

    <!-- Interactive Canvas Page -->
    <div class="second_page">
      <div class="content">
        <h1 class="title">
          <span class="txt">tradition</span>
          <span class="txt">&</span>
          <span class="txt">creation</span>
        </h1>
        <p class="title_para">
          From handpicked spices to small-batch cooking, we capture the real taste of tradition in every spoonful.
        </p>
      </div>

      <!-- Floating Feature Cards -->
      <span class="img1 img">
        <div class="img_text">
          <p class="number">1</p>
          <p>Rooted in Indian culinary traditions</p>
        </div>
        <img src="./images/img01.jpg" alt="Culinary Tradition">
      </span>

      <span class="img2 img">
        <div class="img_text">
          <p class="number">2</p>
          <p>Carefully prepared in small batches</p>
        </div>
        <img src="./images/img02.jpg" alt="Small Batch Prep">
      </span>

      <span class="img3 img">
        <div class="img_text">
          <p class="number">3</p>
          <p>Bringing the warmth of home to your table</p>
        </div>
        <img src="./images/img03.jpg" alt="Home Style Warmth">
      </span>
    </div>

    <!-- Exit Page -->
    <div class="page last_page">
      <p>Done</p>
    </div>
  </section>

  <!-- Libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lenis@1.3.4/dist/lenis.min.js"></script>
  <script src="./script.js"></script>
</body>
</html>
```

### 2. `style.css`
```css
/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Page Base */
.page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* First Page */
.first_page {
  background-color: #281006;
}
.first_page p {
  color: #FAAE33;
  font-size: 5vw;
  font-weight: 800;
}

/* Main Animation Canvas */
.second_page {
  padding: 80px 30px 30px 30px;
  background-color: #E99D3A;
  width: 100%;
  position: relative;
  min-height: 330vh;
}

/* Title Styling */
.title {
  font-size: 7.5em;
  font-weight: 800;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  text-transform: uppercase;
  color: #c88430;
  width: 670px;
  line-height: 100px;
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.title_para {
  color: #4E2B15;
  font-size: larger;
  font-weight: 300;
  width: 340px;
  margin-top: 10px;
}

/* Badge & Caption Layout */
.img_text {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.img_text .number {
  background-color: #402011;
  width: 44px;
  height: 44px;
  color: #c88430;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
}

.img_text p {
  font-size: 13px;
  line-height: 1.4;
  color: #402011;
  width: 180px;
  font-weight: 600;
  text-transform: uppercase;
}

/* Absolute Card Coordinates */
.img1 {
  position: absolute;
  top: 63vh;
  left: 55vw;
}

.img2 {
  position: absolute;
  top: 140vh;
  left: 0;
}

.img3 {
  position: absolute;
  top: 230vh;
  left: 43vw;
}

/* Media Dimensions */
.img1 img {
  width: 30vw;
  height: 60vh;
  object-fit: cover;
  border-radius: 5px;
}

.img2 img,
.img3 img {
  width: 32vw;
  height: 82vh;
  object-fit: cover;
  border-radius: 5px;
}

/* Last Page */
.last_page {
  background-color: #E99D3A;
}
.last_page p {
  color: #281006;
  font-size: 5vw;
  font-weight: 800;
}
```

### 3. `script.js`
```javascript
// 1. Smooth Scrolling Setup
const lenis = new Lenis({
  duration: 2
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Text Staggered Color Reveal
gsap.to(".txt", {
  color: "rgb(64, 32, 17)",
  stagger: 0.5,
  scrollTrigger: {
    trigger: ".title",
    start: "top 80%",
    end: "top 40%",
    scrub: true
  }
});

// 3. Scroll-Linked Media Rotation
gsap.from(".img", {
  rotation: 11,
  scrollTrigger: {
    trigger: ".img",
    start: "top 90%",
    end: "top -250%",
    scrub: 1
  }
});
```
