# Motion Systems, Kinetic Typography & Scroll Orchestration

A comprehensive engineering reference for GSAP 3, ScrollTrigger, Lenis smooth scrolling, SplitText typography choreography, and multi-page routing transitions.

---

## 1. Lenis & GSAP Ticker Synchronization

To eliminate visual jitter and frame desynchronization between smooth momentum scrolling and GSAP tweens, bind Lenis directly to the GSAP animation ticker and disable lag smoothing.

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis with tuned inertia
export const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential decay curve
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
});

// 2. Synchronize Lenis scroll updates with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// 3. Drive Lenis tick via GSAP master ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// 4. Disable lag smoothing to prevent stutter after heavy frame drops
gsap.ticker.lagSmoothing(0);
```

---

## 2. Kinetic Typography & SplitText Masking Mechanics

### DOM Masking Architecture
High-impact character and line reveals require nested inline elements: an outer overflow-hidden masking container and an inner transforming element.

```
[Outer Container (.char-mask)] overflow: hidden; display: inline-block;
      └── [Inner Element (.char-inner)] display: inline-block; transform: translateY(110%);
```

### Typographic Split Implementation
```javascript
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export function buildKineticTextReveal(targetSelector) {
  // 1. Split text into characters and words
  const split = new SplitText(targetSelector, {
    type: 'chars,words,lines',
    charsClass: 'char-inner',
    linesClass: 'line-mask',
  });

  // 2. Wrap each char-inner in an overflow-hidden mask span
  split.chars.forEach((char) => {
    const parent = char.parentNode;
    const wrapper = document.createElement('span');
    wrapper.style.display = 'inline-block';
    wrapper.style.overflow = 'hidden';
    wrapper.style.verticalAlign = 'top';
    parent.insertBefore(wrapper, char);
    wrapper.appendChild(char);
  });

  // 3. Construct staggered entry timeline
  const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.0 } });
  tl.fromTo(
    split.chars,
    {
      yPercent: 120,
      rotateX: -45,
      opacity: 0,
    },
    {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      stagger: {
        amount: 0.6,
        from: 'start', // 'start' | 'center' | 'edges' | 'random'
      },
    }
  );

  return { split, tl };
}
```

---

## 3. Pinned Viewports & Buffer Math

### Pinning & Scroll Scrubbing Principles
1. **Scrub Factor Selection**:
   - `scrub: true`: Instant 1:1 binding between scroll position and timeline progress. Recommended for typography and color grading.
   - `scrub: 1` or `scrub: 1.5`: Damped inertial binding. Recommended for physical 3D mesh rotations, cameras, and heavy scale transforms.
2. **Buffer Zone Sizing**:
   - Always finish core visual sequences at `progress = 0.90`.
   - Allocate the final 10% ($p \in [0.90, 1.00]$) as a buffer zone so elements settle into their resting state before the section unpins.

```javascript
// Master Pinned Showcase Timeline
export function createPinnedShowcase(containerSelector) {
  const container = document.querySelector(containerSelector);
  const totalScrollDistance = window.innerHeight * 4; // 400vh virtual track

  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${totalScrollDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Stage 1: Headline exit (0.00 -> 0.30)
  masterTl.to('.hero-heading', { yPercent: -100, opacity: 0, ease: 'power2.inOut' }, 0);

  // Stage 2: Product scale & rotation (0.10 -> 0.70)
  masterTl.to('.product-mesh-wrapper', { scale: 1.5, rotateY: 180, ease: 'none' }, 0.1);

  // Stage 3: Feature callout reveals (0.50 -> 0.90)
  masterTl.fromTo(
    '.feature-callout',
    { xPercent: 50, opacity: 0 },
    { xPercent: 0, opacity: 1, stagger: 0.1, ease: 'power3.out' },
    0.5
  );

  // 0.90 -> 1.00: Buffer rest zone (No animation, allows visual absorption before unpin)
  masterTl.to({}, { duration: 0.1 }, 0.9);

  return masterTl;
}
```

---

## 4. Horizontal Smooth Scroll Tracks

Transform vertical user scroll input into seamless horizontal translation using `xPercent`.

```javascript
export function createHorizontalScrollSection(sectionSelector, trackSelector) {
  const section = document.querySelector(sectionSelector);
  const track = document.querySelector(trackSelector);
  const cards = gsap.utils.toArray(`${trackSelector} > .card`);

  const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

  const horizontalTween = gsap.to(track, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${track.scrollWidth - window.innerWidth}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // Staggered parallax depth on inner card media
  cards.forEach((card) => {
    const media = card.querySelector('.card-media');
    if (!media) return;

    gsap.fromTo(
      media,
      { xPercent: -15 },
      {
        xPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalTween, // Bind to horizontal parent tween
          start: 'left right',
          end: 'right left',
          scrub: true,
        },
      }
    );
  });
}
```

---

## 5. Page Transition Lifecycle Architecture

Implement seamless SPA or multi-page transitions using the 4-phase lifecycle: `Leave -> Fetch/Mount -> Enter -> Cleanup`.

```
[User Clicks Link]
       │
       ▼
1. LEAVE PHASE: Play exit animation (shrink content, slide wipe overlay, lock scroll)
       │
       ▼
2. FETCH / MOUNT: Load target route DOM / render new Next.js / Barba view
       │
       ▼
3. ENTER PHASE: Reset scroll position to top (0,0); play incoming reveal timeline
       │
       ▼
4. CLEANUP PHASE: Destroy old ScrollTrigger instances; unbind dead listeners; reinit Lenis
```

```javascript
export const PageTransitionController = {
  isTransitioning: false,

  async executeTransition(nextUrl, renderCallback) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // 1. Lock scroll
    lenis.stop();

    // 2. Play Leave Timeline (Curtain Wipe)
    const overlay = document.querySelector('.transition-overlay');
    await gsap.to(overlay, {
      scaleY: 1,
      transformOrigin: 'bottom center',
      duration: 0.6,
      ease: 'expo.inOut',
    });

    // 3. Kill old ScrollTriggers and purge listeners
    ScrollTrigger.getAll().forEach((st) => st.kill());

    // 4. Execute Route Swap
    await renderCallback();

    // 5. Reset Scroll Position
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // 6. Play Enter Timeline
    await gsap.to(overlay, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 0.6,
      ease: 'expo.inOut',
    });

    // 7. Refresh ScrollTrigger & unlock Lenis
    ScrollTrigger.refresh();
    lenis.start();
    this.isTransitioning = false;
  },
};
```
