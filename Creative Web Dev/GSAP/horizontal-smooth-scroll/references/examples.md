# Examples & Implementation Templates

## Full Implementation Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Horizontal Scroll Gallery</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { overflow-x: hidden; font-family: sans-serif; background: #f5f5f5; }
    
    h1.title { position: fixed; left: 4rem; top: 2rem; font-size: 4vw; z-index: 10; }
    .progress { position: fixed; bottom: 2rem; right: 4rem; font-size: 0.9rem; z-index: 10; display: flex; align-items: center; }
    .progress-amount { margin-left: 0.5rem; font-weight: bold; }

    .scroll-section { width: 100%; height: 100vh; overflow: hidden; position: relative; }
    .scroll-container { display: flex; align-items: flex-end; width: fit-content; height: 100%; padding: 0 4rem 8vh 4rem; gap: 2rem; }
    .card { width: 320px; flex-shrink: 0; }
    .card img { width: 100%; height: auto; object-fit: cover; display: block; }
    .card p { margin-top: 0.75rem; font-size: 0.85rem; }
  </style>
</head>
<body>

  <h1 class="title">WORKS</h1>
  <div class="progress">SCROLL DOWN TO EXPLORE <span class="progress-amount">(00%)</span></div>

  <section class="scroll-section">
    <div class="scroll-container">
      <div class="card"><img src="item1.jpg" alt="Item 1" /><p>01 / Project Alpha</p></div>
      <div class="card"><img src="item2.jpg" alt="Item 2" /><p>02 / Project Beta</p></div>
      <div class="card"><img src="item3.jpg" alt="Item 3" /><p>03 / Project Gamma</p></div>
      <div class="card"><img src="item4.jpg" alt="Item 4" /><p>04 / Project Delta</p></div>
    </div>
  </section>

  <!-- GSAP & Lenis CDNs -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      // 1. Lenis Smooth Scroll Setup
      const lenis = new Lenis();
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // 2. Element Selectors
      const scrollContainer = document.querySelector(".scroll-container");
      const section = document.querySelector(".scroll-section");
      const progressAmount = document.querySelector(".progress-amount");

      // 3. Dynamic Calculation
      function getScrollAmount() {
        const scrollWidth = scrollContainer.scrollWidth;
        const windowWidth = window.innerWidth;
        return -(scrollWidth - windowWidth);
      }

      // 4. GSAP Animation & Pinning
      gsap.to(scrollContainer, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: () => `+=${-getScrollAmount()}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const percent = (self.progress * 100).toFixed(0).padStart(2, "0");
            progressAmount.textContent = `(${percent}%)`;
          }
        }
      });
    });
  </script>
</body>
</html>
```
