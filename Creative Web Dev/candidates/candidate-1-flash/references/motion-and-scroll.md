# Motion Orchestration, GSAP 3, ScrollTrigger & Lenis

A comprehensive operational manual for building synchronized, high-performance scroll-driven animations, kinetic typography, and seamless page transitions.

---

## 1. Unified Ticker Architecture

Unify the execution loop across Lenis smooth scroll, GSAP ScrollTrigger, and custom WebGL renderers to prevent timing discrepancies and visual jitter.

```
[Hardware RAF Event]
         │
         ▼
[GSAP Central Ticker] (lagSmoothing: 0)
         │
         ├───────────────────────────────┐
         ▼                               ▼
[Lenis.raf(time * 1000)]       [ScrollTrigger.update()]
         │                               │
         ▼                               ▼
[Interpolate Scroll Physics]    [Evaluate Timeline Progress]
         │                               │
         └───────────────┬───────────────┘
                         ▼
             [Render DOM & 3D WebGL]
```

### Complete Implementation Pattern

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// 1. Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// 2. Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
  infinite: false,
});

// 3. Synchronize Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// 4. Drive Lenis via GSAP Ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// 5. Disable Lag Smoothing for Real-Time Scrubber Sync
gsap.ticker.lagSmoothing(0);
```

---

## 2. Pinned Scrollytelling & Pin Buffer Mathematics

Pinned scrollytelling locks the viewport while scrubbed timelines unfold across an extended scroll track.

### Pin Buffer Distance Calculation

To calculate the scroll track length for an $N$-stage sequence:

$$\text{Scroll Distance} = \text{Viewport Height} \times \text{Multiplier} \quad (\text{e.g., } 400\% = 4 \times \text{window.innerHeight})$$

```javascript
ScrollTrigger.create({
  trigger: '.scrolly-section',
  start: 'top top',
  end: () => `+=${window.innerHeight * 4}`,
  pin: true,
  pinSpacing: true,
  scrub: 1, // 1-second smoothing catch-up
  onUpdate: (self) => {
    orchestrateStages(self.progress);
  },
});
```

### Multi-Stage Normalization & Progress Mapping

Use `gsap.utils.clamp` and `gsap.utils.mapRange` to partition the master progress ($0.0 \to 1.0$) into discrete sub-stage intervals:

```javascript
function orchestrateStages(progress) {
  // Stage 1: Headline Slide & Fade (0.00 -> 0.25)
  const p1 = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.00, 0.25, 0, 1, progress));
  gsap.set('.hero-title', {
    xPercent: -100 * p1,
    opacity: 1 - p1,
  });

  // Stage 2: Circular Mask Expansion (0.20 -> 0.50)
  const p2 = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.20, 0.50, 0, 1, progress));
  const maskRadius = p2 * 100;
  gsap.set('.circular-mask', {
    clipPath: `circle(${maskRadius}% at 50% 50%)`,
  });

  // Stage 3: Spec Tooltip Stagger (0.50 -> 0.85)
  const p3 = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.50, 0.85, 0, 1, progress));
  gsap.set('.tooltip-divider', {
    scaleX: p3,
  });

  // Stage 4: Outro Clean Exit (0.85 -> 1.00)
  const p4 = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.85, 1.00, 0, 1, progress));
  gsap.set('.scrolly-content', {
    opacity: 1 - p4,
    yPercent: -20 * p4,
  });
}
```

---

## 3. Kinetic Typography & SplitText Mechanics

Deconstruct text into character, word, or line units and choreograph high-impact entrance and hover reveals.

### Safe Initialization Pipeline

```javascript
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

// Always defer splitting until all web fonts are loaded
document.fonts.ready.then(() => {
  initSplitText();
});

function initSplitText() {
  const splitHeading = SplitText.create('.kinetic-heading', {
    type: 'lines,words,chars',
    linesClass: 'line-wrapper',
    wordsClass: 'word-wrapper',
    charsClass: 'char-inner',
    mask: 'lines', // Wrap lines in overflow-hidden containers
    autoSplit: true, // Recalculate line breaks on window resize
    onSplit: (self) => {
      // Return tween to enable automated resize recalculations
      return gsap.from(self.chars, {
        yPercent: 120,
        rotateZ: 8,
        opacity: 0,
        duration: 1.0,
        stagger: {
          each: 0.02,
          from: 'start',
          ease: 'power2.out',
        },
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.kinetic-heading',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
  });
}
```

### Dual-DOM Accessibility Structure

When splitting text containing links, formatted spans, or screen-reader sensitive copy, use the Dual-DOM pattern:

```html
<!-- Intact Semantic Copy for Screen Readers -->
<h1 class="sr-only">
  Pioneering Creative Engineering &amp; GPU Visual Computation
</h1>

<!-- Animated Visual Representation -->
<h1 class="visual-heading" aria-hidden="true">
  Pioneering Creative Engineering &amp; GPU Visual Computation
</h1>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.visual-heading .line-wrapper {
  overflow: hidden;
  display: block;
}

.visual-heading .char-inner {
  display: inline-block;
  will-change: transform, opacity;
}
```

---

## 4. Split-Card Expansion & 3D Spatial Flips

Choreograph a hero sequence where a single unified visual image scales up, splits into separated aspect-ratio panels via flexbox gap and border-radius transitions, and performs a 3D flip revealing back-face content cards.

### Structural HTML & 3D CSS Setup

```html
<section class="pinned-cards-track">
  <div class="cards-wrapper">
    <!-- Card 1 -->
    <div class="split-card" id="split-card-1">
      <div class="card-face card-front">
        <img src="/assets/hero-slice-1.jpg" alt="Slice 1" />
      </div>
      <div class="card-face card-back">
        <h3>Architecture</h3>
        <p>Decoupled WebGL and DOM rendering pipeline.</p>
      </div>
    </div>
    <!-- Card 2 -->
    <div class="split-card" id="split-card-2">
      <div class="card-face card-front">
        <img src="/assets/hero-slice-2.jpg" alt="Slice 2" />
      </div>
      <div class="card-face card-back">
        <h3>Performance</h3>
        <p>Instanced draw calls and clamped DPR scaling.</p>
      </div>
    </div>
    <!-- Card 3 -->
    <div class="split-card" id="split-card-3">
      <div class="card-face card-front">
        <img src="/assets/hero-slice-3.jpg" alt="Slice 3" />
      </div>
      <div class="card-face card-back">
        <h3>Restraint</h3>
        <p>Purpose-driven motion serving the core art direction.</p>
      </div>
    </div>
  </div>
</section>
```

```css
.pinned-cards-track {
  width: 100vw;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #09090b;
}

.cards-wrapper {
  display: flex;
  gap: 0px;
  width: 75vw;
  max-width: 1200px;
  perspective: 1200px;
  transform-style: preserve-3d;
  transition: gap 0.4s ease;
}

.split-card {
  flex: 1;
  aspect-ratio: 5 / 7;
  position: relative;
  transform-style: preserve-3d;
  transform-origin: center center;
  border-radius: 0px;
  will-change: transform, border-radius;
}

/* Initial seamless outer border radii */
#split-card-1 { border-top-left-radius: 24px; border-bottom-left-radius: 24px; }
#split-card-3 { border-top-right-radius: 24px; border-bottom-right-radius: 24px; }

.card-face {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: inherit;
  overflow: hidden;
}

.card-front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-back {
  background: #18181b;
  color: #fafafa;
  transform: rotateY(180deg);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### State-Guarded GSAP ScrollTrigger Orchestrator

```javascript
let isSplitTriggered = false;
let isFlipTriggered = false;

ScrollTrigger.create({
  trigger: '.pinned-cards-track',
  start: 'top top',
  end: () => `+=${window.innerHeight * 3.5}`,
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;

    // Stage 1: Card Width & Scale Expansion (0.00 -> 0.30)
    if (progress <= 0.30) {
      const scale = gsap.utils.mapRange(0, 0.30, 0.8, 1.0, progress);
      gsap.set('.cards-wrapper', { scale });
    }

    // Stage 2: Gap Expansion & Border Radius Normalization (Threshold: 0.35)
    if (progress >= 0.35 && !isSplitTriggered) {
      gsap.to('.cards-wrapper', { gap: '24px', duration: 0.6, ease: 'power3.out' });
      gsap.to('.split-card', { borderRadius: '24px', duration: 0.6, ease: 'power3.out' });
      isSplitTriggered = true;
    } else if (progress < 0.35 && isSplitTriggered) {
      gsap.to('.cards-wrapper', { gap: '0px', duration: 0.6, ease: 'power3.out' });
      gsap.to('#split-card-1', { borderRadius: '24px 0 0 24px', duration: 0.6, ease: 'power3.out' });
      gsap.to('#split-card-2', { borderRadius: '0px', duration: 0.6, ease: 'power3.out' });
      gsap.to('#split-card-3', { borderRadius: '0 24px 24px 0', duration: 0.6, ease: 'power3.out' });
      isSplitTriggered = false;
    }

    // Stage 3: 3D Flip & Spatial Tilt (Threshold: 0.65)
    if (progress >= 0.65 && !isFlipTriggered) {
      gsap.to('.split-card', {
        rotationY: 180,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.inOut',
      });
      // Outer card spatial fanning
      gsap.to('#split-card-1', { rotationZ: -8, y: 20, duration: 0.8, ease: 'power3.out' });
      gsap.to('#split-card-3', { rotationZ: 8, y: 20, duration: 0.8, ease: 'power3.out' });
      isFlipTriggered = true;
    } else if (progress < 0.65 && isFlipTriggered) {
      gsap.to('.split-card', {
        rotationY: 0,
        duration: 0.8,
        stagger: -0.1,
        ease: 'power3.inOut',
      });
      gsap.to(['#split-card-1', '#split-card-3'], { rotationZ: 0, y: 0, duration: 0.8, ease: 'power3.out' });
      isFlipTriggered = false;
    }
  },
});
```

---

## 5. Seamless Multi-Page Cinematic Shutter Transitions

Eliminate white flash between multi-page application (MPA) navigations with a Promise-orchestrated opposing-row shutter curtain.

### DOM Overlay Scaffolding

```html
<div class="transition-container" aria-hidden="true">
  <div class="shutter-row row-top">
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
  </div>
  <div class="shutter-row row-bottom">
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
    <div class="shutter-block"></div>
  </div>
</div>
```

```css
.transition-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  pointer-events: none;
}

.shutter-row {
  display: flex;
  flex: 1;
  width: 100%;
}

.shutter-block {
  flex: 1;
  background-color: #09090b;
  transform: scaleY(1);
  will-change: transform;
}

/* Opposing transform origins */
.row-top .shutter-block {
  transform-origin: top center;
}

.row-bottom .shutter-block {
  transform-origin: bottom center;
}
```

### Promise-Orchestrated Navigation Interceptor

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State: Fully covering screen
  gsap.set('.shutter-block', { visibility: 'visible', scaleY: 1 });

  // 2. Play Entrance Reveal
  revealShutter().then(() => {
    gsap.set('.shutter-block', { visibility: 'hidden' });
  });

  // 3. Bind Link Interception
  attachPageTransitions();
});

function revealShutter() {
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    tl.to('.row-top .shutter-block', {
      scaleY: 0,
      duration: 0.9,
      stagger: { each: 0.08, from: 'start' },
      ease: 'expo.inOut',
    })
    .to('.row-bottom .shutter-block', {
      scaleY: 0,
      duration: 0.9,
      stagger: { each: 0.08, from: 'start' },
      ease: 'expo.inOut',
    }, '<');
  });
}

function animateShutterClose() {
  return new Promise((resolve) => {
    gsap.set('.shutter-block', { visibility: 'visible', scaleY: 0 });

    const tl = gsap.timeline({ onComplete: resolve });

    tl.to('.row-top .shutter-block', {
      scaleY: 1,
      duration: 0.9,
      stagger: { each: 0.08, from: 'end' },
      ease: 'expo.inOut',
    })
    .to('.row-bottom .shutter-block', {
      scaleY: 1,
      duration: 0.9,
      stagger: { each: 0.08, from: 'end' },
      ease: 'expo.inOut',
    }, '<');
  });
}

function attachPageTransitions() {
  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetHref = link.getAttribute('href');

      // Guard: Ignore external, hash links, or current route
      if (
        !targetHref ||
        targetHref.startsWith('#') ||
        targetHref.startsWith('mailto:') ||
        link.target === '_blank' ||
        targetHref === window.location.pathname ||
        targetHref === window.location.href
      ) {
        return;
      }

      event.preventDefault();

      animateShutterClose().then(() => {
        window.location.href = targetHref;
      });
    });
  });
}
```

---

## 6. Horizontal Smooth Scroll & Parallax Gallery

Transform vertical scroll gestures into horizontal gallery translation with synchronized image parallax offsets.

```javascript
const gallery = document.querySelector('.horizontal-gallery');
const slides = gsap.utils.toArray('.gallery-slide');

gsap.to(slides, {
  xPercent: -100 * (slides.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-section',
    pin: true,
    scrub: 1,
    start: 'top top',
    end: () => `+=${gallery.offsetWidth}`,
    invalidateOnRefresh: true,
  },
});

// Inner Image Parallax Translation
slides.forEach((slide) => {
  const image = slide.querySelector('img');
  gsap.fromTo(
    image,
    { xPercent: -20 },
    {
      xPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: slide,
        containerAnimation: true, // Ties tween to horizontal parent
        start: 'left right',
        end: 'right left',
        scrub: true,
      },
    }
  );
});
```
