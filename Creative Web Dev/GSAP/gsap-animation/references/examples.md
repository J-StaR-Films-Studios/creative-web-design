# GSAP Code Examples

## 1. Controlled Tween with Callback

**Scenario**: Animate an element with rotation and color change, controllable via HTML buttons.

```javascript
const boxTween = gsap.to(".box", {
  x: 300,
  rotation: 360,
  backgroundColor: "red",
  duration: 3,
  ease: "elastic",
  onComplete: () => console.log("Animation Completed")
});

document.querySelector("#play").onclick = () => boxTween.play();
document.querySelector("#pause").onclick = () => boxTween.pause();
document.querySelector("#resume").onclick = () => boxTween.resume();
document.querySelector("#reverse").onclick = () => boxTween.reverse();
document.querySelector("#restart").onclick = () => boxTween.restart();
```

---

## 2. Timeline with Overlapping Labels and Position Parameters

**Scenario**: Orchestrate three sequential elements where Box 3 starts concurrently with Box 1.

```javascript
const tl = gsap.timeline({ delay: 1 });

tl.to(".box1", { x: 400, opacity: 0.2, duration: 3 }, "startPoint")
  .to(".box2", { x: 400, rotation: 360, duration: 2 }, "+=1") // 1s after box1 ends
  .to(".box3", { x: 400, y: 200, duration: 2, ease: "power3.out" }, "startPoint+=1"); // 1s after startPoint label
```

---

## 3. Scroll-Linked Progress Bar with ScrollTrigger

**Scenario**: Horizontal reading progress bar filling up as user scrolls the page.

```html
<div class="progress-bar" style="position:fixed; top:0; left:0; height:8px; width:0; background:greenyellow;"></div>
```

```javascript
gsap.to(".progress-bar", {
  width: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1 // Smooth catch-up
  }
});
```
