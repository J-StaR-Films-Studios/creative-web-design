# Worked Examples

## Example 1: Interactive Hero Entry with Clip-Path Reveal

**Scenario**: A landing page hero section requiring a smooth navbar dropdown, text rise with fade, and an image transitioning between geometric polygon masks.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Navbar drops down from above viewport
  tl.from(".navbar", {
    yPercent: -100,
    autoAlpha: 0,
    duration: 0.8
  })
  // Heading rises from bottom
  .from(".hero-title", {
    y: 60,
    autoAlpha: 0,
    duration: 1
  }, "-=0.4")
  // Subtitle & CTA appear
  .from(".hero-sub, .hero-cta", {
    y: 30,
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.15
  }, "-=0.6")
  // Hero image expands clip path
  .fromTo(".hero-image", 
    { clipPath: "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)" },
    { 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%, 0% 100%, 0% 0%)",
      duration: 1.5,
      ease: "power4.inOut"
    }, "-=1.0"
  );
});
```

---

## Example 2: Kinetic Dual-Direction Scroll Text

**Scenario**: Multiple text banners moving horizontally in alternating directions linked directly to scroll position with scrub.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".kinetic-section",
      start: "top bottom",     // Starts when top of section enters bottom of viewport
      end: "bottom top",       // Ends when bottom of section leaves top of viewport
      scrub: 1                 // Smooth 1-second lag catch-up
    }
  });

  scrollTl
    .to(".marquee-left", { x: -300 }, 0)
    .to(".marquee-right", { x: 300 }, 0);
});
```

---

## Example 3: Pinned Product Spec Comparison (Wireframe to Photo Reveal)

**Scenario**: A hardware showcase where scrolling locks the viewport and horizontally reveals a photorealistic render over a wireframe schematic.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const showcaseTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".gpu-showcase-container",
      start: "top top",
      end: "+=1200",           // User scrolls 1200px while pinned
      pin: true,               // Pin container in place
      scrub: 1,
      anticipatePin: 1
    }
  });

  // Photo container expands its width from 0% to 100% to reveal the real image
  showcaseTl.fromTo(".photo-overlay-container", 
    { width: "0%" },
    { width: "100%", ease: "none" }
  );
});
```

---

## Example 4: Interactive Timeline UI Controller

**Scenario**: A dashboard visualization with manual Play, Pause, Resume, Reverse, and Restart controls.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const anim = gsap.timeline({ paused: true });

  anim
    .to(".node-1", { x: 300, duration: 1, ease: "power2.out" })
    .to(".node-2", { x: 300, rotation: 360, duration: 1, ease: "power2.out" })
    .to(".node-3", { x: 300, scale: 1.2, duration: 1, ease: "bounce.out" });

  document.querySelector("#btn-play").onclick = () => anim.play();
  document.querySelector("#btn-pause").onclick = () => anim.pause();
  document.querySelector("#btn-resume").onclick = () => anim.resume();
  document.querySelector("#btn-reverse").onclick = () => anim.reverse();
  document.querySelector("#btn-restart").onclick = () => anim.restart();
});
```
