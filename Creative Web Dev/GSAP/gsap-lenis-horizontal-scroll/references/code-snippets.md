# Code Snippets & Boilerplates

## CDN Bundle Imports

```html
<!-- Lenis Smooth Scroll CSS -->
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.8/dist/lenis.css">

<!-- GSAP Core & ScrollTrigger Plugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>

<!-- Lenis Smooth Scroll JS -->
<script src="https://unpkg.com/lenis@1.3.8/dist/lenis.min.js"></script>
```

## HTML Structure

```html
<!-- Intro / Hero Section -->
<section class="intro">
  <h1 class="heading"><span>Horizontal</span> Smooth Scroll</h1>
  <div class="content">
    <p>Experience <span>smooth scrolling</span> like never before.</p>
    <p>Dive into a horizontal showcase powered by <span>GSAP</span> + <span>Lenis</span>.</p>
  </div>
</section>

<!-- Horizontal Showcase Section -->
<section id="horizontal-scroll">
  <div class="horizontal-scroll-wrapper">
    <div class="horizontal">
      <div class="card"><div class="count">01</div><h2>Design Bold.</h2></div>
      <div class="card"><div class="count">02</div><h2>Code Smart.</h2></div>
      <div class="card"><div class="count">03</div><h2>Animate Fluid.</h2></div>
      <div class="card"><div class="count">04</div><h2>Scroll Seamless.</h2></div>
      <div class="card"><div class="count">05</div><h2>Build Creative.</h2></div>
      <div class="card"><div class="count">06</div><h2>Experience Different.</h2></div>
    </div>
  </div>
</section>

<!-- Footer Section -->
<footer>
  <h2 class="heading">So we build<br><span>web scrolling</span></h2>
  <div class="content">
    <div class="heading">as it should be</div>
  </div>
</footer>
```

## CSS Core Rules

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #121200;
  color: #ffffff;
  font-family: 'Oswald', sans-serif;
  overflow-x: hidden;
}

.intro, footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rem;
  height: 100vh;
}

#horizontal-scroll {
  padding: 160px 0;
}

.horizontal-scroll-wrapper {
  overflow: hidden;
  height: 55vh;
}

.horizontal {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 45vw;
}

.horizontal > div,
.horizontal .card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 28vw;
  padding: 50px 40px;
  border: 2px solid #ffffff;
  margin: 0 4vw;
  flex-shrink: 0;
}

.card .count {
  font-size: 7vw;
  font-weight: bold;
  color: #bbbb4f;
  line-height: 1.4;
}

.card h2 {
  font-size: 3vw;
  font-weight: 300;
}
```
