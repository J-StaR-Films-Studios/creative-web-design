# Examples & Reference Implementations

## Complete Reference Implementation

### HTML
```html
<section class="hero">
  <h1>Every new interface is a chance to rebuild the future.</h1>
</section>

<section class="sticky-cards">
  <div class="card">
    <div class="card-img"><img src="image-1.jpg" alt="Project 1" /></div>
    <div class="card-content"><h3>Awards & Glory</h3><p>Description text.</p></div>
  </div>
  <div class="card">
    <div class="card-img"><img src="image-2.jpg" alt="Project 2" /></div>
    <div class="card-content"><h3>Calls & Judo</h3><p>Description text.</p></div>
  </div>
  <div class="card">
    <div class="card-img"><img src="image-3.jpg" alt="Project 3" /></div>
    <div class="card-content"><h3>Cocktails & Creativity</h3><p>Description text.</p></div>
  </div>
  <div class="card">
    <div class="card-img"><img src="image-4.jpg" alt="Project 4" /></div>
    <div class="card-content"><h3>Travel & Tickets</h3><p>Description text.</p></div>
  </div>
  <div class="card">
    <div class="card-img"><img src="image-5.jpg" alt="Project 5" /></div>
    <div class="card-content"><h3>Pizza & Toppings</h3><p>Description text.</p></div>
  </div>
</section>

<section class="outro">
  <h1>The world will always evolve.</h1>
</section>
```

### CSS
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #0e1111;
  color: #fff;
}

.hero, .outro {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: #202020;
}

.sticky-cards {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #ededed;
}

.card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform;
  width: 450px;
  height: 550px;
  background-color: #fff;
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.card-img {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  flex: 0 0 auto;
  padding: 0.75rem 0.5rem 0.25rem;
  color: #111;
}

@media (max-width: 900px) {
  .card {
    width: 75vw;
    height: 60vh;
  }
}
```

### JavaScript (`script.js`)
```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Lenis Smooth Scroll Setup
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Initialize Cards
  const cards = gsap.utils.toArray(".card");
  const rotations = [-1, 30, -5, 5, -2];

  cards.forEach((card, index) => {
    gsap.set(card, {
      rotate: rotations[index] || 0,
      y: window.innerHeight,
      x: 0
    });
  });

  // 3. ScrollTrigger Instance
  ScrollTrigger.create({
    trigger: ".sticky-cards",
    start: "top top",
    end: "+=" + (window.innerHeight * 4) + "px",
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const totalCards = cards.length;
      const progressPerCard = 1 / totalCards;

      cards.forEach((card, index) => {
        const cardStart = index * progressPerCard;
        let cardProgress = (progress - cardStart) / progressPerCard;
        cardProgress = Math.min(Math.max(cardProgress, 0), 1);

        let yPos = window.innerHeight * (1 - cardProgress);
        let xPos = 0;

        if (cardProgress === 1 && index < totalCards - 1) {
          const remainingProgress = (progress - (cardStart + progressPerCard)) / (1 - (cardStart + progressPerCard));

          if (remainingProgress > 0) {
            const distanceMultiplier = 1 - index * 0.15;
            xPos = -window.innerWidth * 0.3 * distanceMultiplier * remainingProgress;
            yPos = -window.innerHeight * 0.3 * distanceMultiplier * remainingProgress;
          }
        }

        gsap.to(card, {
          x: xPos,
          y: yPos,
          duration: 0,
          ease: "none"
        });
      });
    }
  });
});
```
