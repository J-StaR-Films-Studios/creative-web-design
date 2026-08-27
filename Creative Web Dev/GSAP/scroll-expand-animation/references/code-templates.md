# Code Templates

## 1. HTML Layout

```html
<div class="container">
  <section class="hero"></section>
  <section class="services">
    <div class="services-header">
      <div class="col"></div>
      <div class="col"><h1>All Services</h1></div>
    </div>
    
    <!-- Repeatable Service Item -->
    <div class="service">
      <div class="service-info">
        <h1>Service Title</h1>
        <p>Service description content goes here.</p>
      </div>
      <div class="service-img">
        <div class="img">
          <img src="./assets/img1.jpg" alt="Service preview" />
        </div>
      </div>
    </div>
  </section>
  <section class="footer"></section>
</div>
```

## 2. JavaScript Engine Implementation

```javascript
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lenis & Sync with GSAP
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Select Elements & Define Observer
  const services = gsap.utils.toArray(".service");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const service = entry.target;
        const imgContainer = service.querySelector(".img");

        // Width Scrub Animation (30% -> 100%)
        ScrollTrigger.create({
          trigger: service,
          start: "bottom bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            let newWidth = 30 + 70 * self.progress;
            gsap.to(imgContainer, {
              width: `${newWidth}%`,
              duration: 0.1,
              ease: "none",
            });
          },
        });

        // Height Scrub Animation (150px -> 450px)
        ScrollTrigger.create({
          trigger: service,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            let newHeight = 150 + 300 * self.progress;
            gsap.to(service, {
              height: `${newHeight}px`,
              duration: 0.1,
              ease: "none",
            });
          },
        });

        // Clean up observer
        observer.unobserve(service);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  services.forEach((service) => observer.observe(service));
});
```
