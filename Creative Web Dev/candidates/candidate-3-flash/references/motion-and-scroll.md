# Motion Orchestration, Scroll Mechanics & Kinetic Typography

A deep technical guide to orchestrating high-performance, synchronized motion systems using GSAP 3, ScrollTrigger, Lenis Smooth Scroll, and SplitText kinetic typography.

---

## 1. Unified Virtual Playhead Synchronization (Lenis + GSAP)

To prevent visual stutter, layout desynchronization, and conflicting render loops, bind the smooth scroll virtual engine directly into the GSAP ticker.

### Master Initialization Protocol

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// 1. Instantiate Lenis with normalized physics parameters
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
  infinite: false,
});

// 2. Synchronize Lenis scroll updates with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// 3. Drive Lenis through the GSAP Ticker clock (unified RAF)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // GSAP provides seconds; Lenis requires milliseconds
});

// 4. Disable GSAP lag smoothing to maintain 1:1 playhead fidelity
gsap.ticker.lagSmoothing(0);
```

---

## 2. ScrollTrigger Pinning & Buffer Mathematics

Pinning locks a DOM element to the viewport for an extended virtual scroll distance while driving internal timelines.

### Dynamic Stride & Pin Configuration

```javascript
const section = document.querySelector('.pinned-hero');
const virtualScrollMultiplier = 4; // 400vh scroll travel distance

const masterTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: 'top top',
    end: () => `+=${window.innerHeight * virtualScrollMultiplier}`,
    pin: true,
    pinSpacing: true,
    scrub: 1, // 1-second lag smoothing for ultra-fluid response
    anticipatePin: 1, // Pre-calculates pin boundary to prevent visual snap
    invalidateOnRefresh: true, // Recalculates offsets on window resize
    onUpdate: (self) => {
      // self.progress ranges smoothly from 0.000 to 1.000
      handleScrubProgress(self.progress);
    }
  }
});

// Chain sequential phase tweens across normalized playhead intervals
masterTimeline
  .to('.hero-title', { opacity: 0, scale: 0.8, yPercent: -50, ease: 'none' }, 0.0)
  .fromTo('.product-card', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none' }, 0.2)
  .to('.product-card', { rotateY: 180, scale: 1.2, ease: 'none' }, 0.5)
  .to('.product-card', { yPercent: -100, opacity: 0, ease: 'none' }, 0.85);
```

### Stride Progress Mapping Table

| Normalized Progress | Active Component | Visual Transformation |
|---|---|---|
| `0.00 - 0.20` | Hero Typography | Opacity `1 -> 0`, Scale `1 -> 0.8`, `yPercent: 0 -> -50` |
| `0.20 - 0.50` | Foreground Card | Enters from bottom `yPercent: 100 -> 0`, Opacity `0 -> 1` |
| `0.50 - 0.85` | 3D Rotation / Mesh | Card rotates 180° around Y-axis, Scale expands to 1.2 |
| `0.85 - 1.00` | Outro Transition | Element exits top `yPercent: 0 -> -100`, unpins cleanly |

---

## 3. Kinetic Typography & SplitText Choreography

Kinetic typography transforms static copy into dynamic visual geometry through character, word, and line splitting with overflow masking.

### Character & Line Reveal with Overflow Clipping

```javascript
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

// Always wrap in document.fonts.ready to prevent layout calculation errors
document.fonts.ready.then(() => {
  const headline = document.querySelector('.kinetic-headline');

  // Split text into lines and characters with nested masking wrappers
  const split = new SplitText(headline, {
    type: 'lines,chars',
    linesClass: 'line-mask',
    charsClass: 'char',
    smartWrap: true, // Prevents mid-word line breaking
    autoSplit: true, // Automatically recalculates splits on viewport resize
    onSplit: (self) => {
      // Ensure CSS masks clip child characters:
      // .line-mask { overflow: hidden; display: block; }
      // .char { display: inline-block; will-change: transform; }

      return gsap.from(self.chars, {
        yPercent: 120,
        rotateX: -40,
        opacity: 0,
        stagger: {
          amount: 0.8, // Total duration distributed across all characters
          from: 'start', // Options: "start", "center", "edges", "random"
          ease: 'power2.out'
        },
        duration: 1.0,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: headline,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  });
});
```

### Accessibility Hardening Protocol
When splitting text into individual character spans, screen readers can mispronounce words as isolated letters. Preserve semantic access:

```javascript
function makeSplitAccessible(element, splitInstance) {
  // Store original raw string
  const originalText = element.textContent;
  
  // Set aria-label on parent container and hide split spans
  element.setAttribute('aria-label', originalText);
  splitInstance.chars.forEach((char) => char.setAttribute('aria-hidden', 'true'));
}
```

---

## 4. Horizontal Smooth Scroll Engine

Translate vertical wheel/touch scrolling into continuous horizontal translation along the X-axis.

```javascript
const horizontalSection = document.querySelector('.horizontal-container');
const horizontalTrack = document.querySelector('.horizontal-track');

function setupHorizontalScroll() {
  // Compute total horizontal scroll distance needed
  const calculateScrollDistance = () => horizontalTrack.scrollWidth - window.innerWidth;

  gsap.to(horizontalTrack, {
    x: () => -calculateScrollDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: horizontalSection,
      start: 'top top',
      end: () => `+=${calculateScrollDistance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1
    }
  });
}
```

---

## 5. 3D Card Stacking & Diagonal Parallax Drift

Create stacking card decks that scale down and recede into background depth as subsequent cards slide over them.

```javascript
const cards = gsap.utils.toArray('.stack-card');

cards.forEach((card, index) => {
  // Skip the final card from receding
  if (index === cards.length - 1) return;

  const nextCard = cards[index + 1];

  gsap.to(card, {
    scale: 0.9 - (cards.length - index) * 0.02,
    opacity: 0.4,
    yPercent: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: nextCard,
      start: 'top 80%',
      end: 'top 20%',
      scrub: true
    }
  });
});
```

---

## 6. Cursor Interpolation & Velocity Tracking

Calculate real-time pointer speed and smooth coordinates with linear interpolation (`lerp`) to drive dynamic magnetic UI elements and interaction force fields.

```javascript
class CursorVelocityTracker {
  constructor() {
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.current = { x: this.mouse.x, y: this.mouse.y };
    this.prev = { x: this.mouse.x, y: this.mouse.y };
    this.velocity = 0;
    this.lerpFactor = 0.15;

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.update();
  }

  update() {
    // 1. Interpolate coordinates toward target mouse position
    this.current.x += (this.mouse.x - this.current.x) * this.lerpFactor;
    this.current.y += (this.mouse.y - this.current.y) * this.lerpFactor;

    // 2. Compute instantaneous velocity vector magnitude
    const dx = this.current.x - this.prev.x;
    const dy = this.current.y - this.prev.y;
    this.velocity = Math.sqrt(dx * dx + dy * dy);

    // 3. Cache previous frame position
    this.prev.x = this.current.x;
    this.prev.y = this.current.y;

    requestAnimationFrame(this.update.bind(this));
  }
}
```
