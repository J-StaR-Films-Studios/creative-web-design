# Worked Animation Examples

## 1. Interactive Sliding Sidebar Navigation

**Scenario**: A sliding navigation sidebar controlled via an interactive toggle button.

```javascript
// Baseline setup
gsap.set(".sidebar", { x: -240 });

const toggleBtn = document.querySelector(".toggle-btn");
let isOpen = false;

const sidebarTween = gsap.to(".sidebar", {
  x: 0,
  duration: 0.6,
  ease: "power2.out",
  paused: true
});

toggleBtn.addEventListener("click", () => {
  if (!isOpen) {
    sidebarTween.play();
  } else {
    sidebarTween.reverse();
  }
  isOpen = !isOpen;
});
```

**Key lesson**: Use `paused: true` and `.reverse()` to create clean two-way UI toggles with a single tween instance.

---

## 2. Advanced 2D Grid Stagger Reveal

**Scenario**: Revealing a grid of card elements emanating from the center outward.

```javascript
gsap.fromTo(".card", 
  {
    scale: 0,
    opacity: 0,
    borderRadius: "100px"
  },
  {
    scale: 1,
    opacity: 1,
    borderRadius: "8px",
    duration: 0.8,
    stagger: {
      amount: 1.2,
      from: "center",
      grid: [4, 6],
      ease: "power1.out"
    },
    ease: "back.out(1.7)"
  }
);
```

**Key lesson**: `stagger.amount` guarantees the total distribution time across all cards regardless of grid item count.

---

## 3. Coordinated Hero Landing Page Sequence

**Scenario**: A choreographed landing page reveal with sliding sidebar, hero image entrance, rotated title, and text content.

```javascript
const heroTimeline = gsap.timeline({
  defaults: {
    duration: 1,
    ease: "power2.out"
  }
});

heroTimeline
  // Step 1: Sidebar reveals from left
  .fromTo(".sidebar", 
    { width: 0, opacity: 0 }, 
    { width: "30%", opacity: 1, duration: 1.2 }
  )
  // Step 2: Main image slides in with slight overlap
  .fromTo(".main-img", 
    { x: 150, opacity: 0 }, 
    { x: 0, opacity: 1 }, 
    "-=0.4"
  )
  // Step 3: Rotated main headline reveals
  .fromTo(".main-title", 
    { y: -100, rotate: -90, opacity: 0 }, 
    { y: 0, rotate: -90, opacity: 1 }
  )
  // Step 4: Body copy fades in smoothly
  .fromTo(".main-info", 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0 }, 
    "-=0.5"
  );
```

**Key lesson**: Timeline defaults reduce code duplication while position parameter offsets (`"-=0.4"`) create natural motion overlaps.
