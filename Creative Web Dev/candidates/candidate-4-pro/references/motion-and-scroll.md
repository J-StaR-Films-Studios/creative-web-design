# Motion and Scroll Choreography

Implement scroll-driven animations using GSAP and Lenis.

## 1. Lenis Initialization
Wrap the DOM in smooth scrolling.
```javascript
const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 1,
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

## 2. Kinetic Typography (SplitText)
Decompose text for staggering.
```javascript
// Using vanilla JS span wrapping
function splitWords(element) {
  const words = element.innerText.split(' ');
  element.innerHTML = '';
  words.forEach(word => {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.overflow = 'hidden';
    
    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.innerText = word + ' ';
    inner.classList.add('word-inner');
    
    span.appendChild(inner);
    element.appendChild(span);
  });
}
```

## 3. Scrubbed Timelines
Bind GSAP timelines to scroll position.
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "bottom top",
    scrub: 1, // 1 second smoothing
    pin: true
  }
});

tl.to(".hero-model", {
  rotationY: Math.PI * 2,
  z: -500,
  ease: "none"
});
```
