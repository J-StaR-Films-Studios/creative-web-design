# Worked ScrollTrigger Examples

## Example 1: Full-Span Scrubbed Horizontal Glide

**Scenario**: A card starts off-screen to the left and glides 800px to the right as the user scrolls through the middle section of the page.

**Application**:
```javascript
// Initial CSS: .card { position: relative; left: -400px; }
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.card',
    start: '-50% center', // Starts when 50% above card hits viewport center
    end: '200% center',   // Completes when 200% past card hits viewport center
    scrub: true,
    markers: false
  }
});

tl.to('.card', {
  x: 800,
  ease: 'none'
});
```

**Outcome**: Animation progress is perfectly tied to scrollbar distance across an extended trigger area.

---

## Example 2: Fast Scrub with Tight Hook Boundaries

**Scenario**: A card needs to snap across the screen rapidly over a very short scroll window.

**Application**:
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.card',
    start: '35% 80%',     // Starts near bottom of viewport
    end: 'bottom 20%',    // Ends near top of viewport
    scrub: true,
    markers: false
  }
});

tl.to('.card', {
  x: 800
});
```

**Outcome**: Narrowing the distance between trigger hooks creates high scroll responsiveness, requiring minimal scroll distance to finish the tween.

---

## Example 3: Reversible Event-Driven Slide-In

**Scenario**: A card animates into view over a fixed 0.5s duration when reached, but must cleanly reverse out when the user scrolls back up.

**Application**:
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.card',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: false,
    toggleActions: 'play pause reverse complete',
    markers: false
  }
});

tl.to('.card', {
  x: 800,
  duration: 0.5,
  ease: 'power2.out'
});
```

**Outcome**: When scrolled down past 80% viewport, the 0.5s tween plays. If scrolled back up past the bottom marker, it reverses smoothly.
