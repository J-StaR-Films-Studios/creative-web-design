---
name: gsap-react-animations
description: |
  Engineer production-grade, scroll-driven, kinetic web animations using GSAP 3,
  @gsap/react (useGSAP), ScrollTrigger, SplitText, and Tailwind CSS.
  Use when building award-winning landing pages, interactive storytelling, frame-by-frame
  video scrubbing, SVG/CSS masked reveals, kinetic typography, and responsive micro-interactions.
  Triggers: gsap, useGSAP, ScrollTrigger, SplitText, web animation, scroll scrub, parallax,
  kinetic typography, video scrub on scroll, masked animation.
---

# GSAP & React Animation Engineering

Build high-performance, 60fps interactive web animations using GSAP and React.

## Principles & Core Rules

1. **Memory Isolation**: Never use raw `useEffect` for GSAP. Always wrap in `useGSAP(() => {...}, { scope: containerRef, dependencies: [...] })` to automate garbage collection and prevent ghost tweens.
2. **Plugin Registration Invariant**: Register all plugins globally (`ScrollTrigger`, `SplitText`) at the application root prior to component mounting.
3. **Motion-Driven Performance**: Keep staggers between `0.02s` and `0.06s`. Use modern hardware-accelerated transforms (`x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation`, `opacity`).
4. **Keyframe-Per-Frame Scrubbing**: Video scrubbed via ScrollTrigger must have keyframe interval = 1 (`-g 1` via FFmpeg).

---

## Phase 1: Environment & Project Setup

Initialize the project with React, Tailwind CSS, and the required GSAP animation packages.

1. **Install Dependencies**:
   ```bash
   npm install gsap @gsap/react react-responsive
   ```

2. **Register Global Plugins**:
   In your root app file (`App.jsx` or `layout.tsx`):
   ```javascript
   import gsap from 'gsap';
   import { ScrollTrigger, SplitText } from 'gsap/all';

   gsap.registerPlugin(ScrollTrigger, SplitText);
   ```

3. **Configure Responsive Masking & Theme Utilities**:
   In `index.css`:
   ```css
   @import 'tailwindcss';

   @utility abs-center {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
   }

   @utility text-gradient {
     background: linear-gradient(to bottom, #ffffff, #898989);
     -webkit-background-clip: text;
     color: transparent;
   }

   @utility masked-img {
     mask-repeat: no-repeat;
     mask-position: center;
     mask-size: 50%;
   }
   ```

### Completion Gate
- [ ] Dependencies installed without peer conflict.
- [ ] `ScrollTrigger` and `SplitText` registered.
- [ ] Global utility classes defined.

---

## Phase 2: Core Animation Primitives in React

Implement fundamental animations with `@gsap/react`.

For foundational terms and patterns, consult [terminology.md](references/terminology.md).

1. **State-to-State Transformations (`to`, `from`, `fromTo`)**:
   ```javascript
   useGSAP(() => {
     // gsap.to: current state -> destination
     gsap.to('#target-id', { x: 250, duration: 1, ease: 'power1.inOut' });

     // gsap.from: initial state -> current state
     gsap.from('#target-id', { opacity: 0, y: 100, duration: 1 });

     // gsap.fromTo: explicit state A -> explicit state B
     gsap.fromTo(
       '#target-id',
       { opacity: 0, scale: 0.5, borderRadius: '0%' },
       { opacity: 1, scale: 1, borderRadius: '100%', duration: 1.5, ease: 'expo.out' }
     );
   }, { scope: containerRef });
   ```

2. **Staggered Multi-Element Animations**:
   Animate batches of items using selectors or array targets:
   ```javascript
   gsap.from('.item-card', {
     yPercent: 100,
     opacity: 0,
     duration: 1,
     stagger: {
       amount: 0.5,
       from: 'center',
       ease: 'power1.inOut'
     }
   });
   ```

### Completion Gate
- [ ] Tweens target scoped elements.
- [ ] Ease functions applied matching natural deceleration curves.

---

## Phase 3: Scroll-Driven Timelines & Typography

Construct synchronized scroll interactions. For complete recipe implementations, see [gsap-patterns.md](references/gsap-patterns.md).

1. **Responsive Viewport Collision Triggers**:
   Define responsive `start` and `end` bounds using `useMediaQuery`:
   ```javascript
   const isMobile = useMediaQuery({ maxWidth: 767 });

   const startValue = isMobile ? 'top 50%' : 'center 60%';
   const endValue = isMobile ? '120% top' : 'bottom top';
   ```

2. **Kinetic Typography Split & Reveal**:
   ```javascript
   useGSAP(() => {
     const titleSplit = SplitText.create('.hero-title', { type: 'chars, words' });
     
     // Apply styling classes to individual character spans
     titleSplit.chars.forEach(char => char.classList.add('text-gradient'));

     gsap.from(titleSplit.chars, {
       yPercent: 100,
       opacity: 0,
       duration: 1.8,
       ease: 'expo.out',
       stagger: 0.05
     });
   }, { scope: containerRef });
   ```

3. **Multi-Track Scroll Timeline with Parallax**:
   ```javascript
   const tl = gsap.timeline({
     scrollTrigger: {
       trigger: '#section-id',
       start: 'top center',
       end: 'bottom top',
       scrub: 1.5,
       pin: true
     }
   });

   tl.from('.left-floating-asset', { x: -150, y: 100, ease: 'power1.inOut' })
     .from('.right-floating-asset', { x: 150, y: -100, ease: 'power1.inOut' }, '<');
   ```

### Completion Gate
- [ ] Scroll triggers properly offset on mobile and desktop viewports.
- [ ] Pinned sections do not overlap or break downstream page flow.
- [ ] Kinetic typography splits cleanly without causing layout shifts.

---

## Phase 4: Advanced Video & Masked Animation Scrubbing

1. **Pre-Process Video Keyframes**:
   Convert background/interactive video using FFmpeg before embedding:
   ```bash
   ffmpeg -i input.mp4 -vf scale=960:-1 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p output.mp4
   ```

2. **Video Scrubbing Timeline**:
   Bind `currentTime` to ScrollTrigger timeline:
   ```javascript
   useGSAP(() => {
     const video = videoRef.current;
     if (!video) return;

     video.onloadedmetadata = () => {
       const videoTl = gsap.timeline({
         scrollTrigger: {
           trigger: '#hero-video-container',
           start: startValue,
           end: endValue,
           scrub: true,
           pin: true
         }
       });

       videoTl.to(video, {
         currentTime: video.duration,
         ease: 'none'
       });
     };
   }, { scope: containerRef });
   ```

3. **Expanding SVG/CSS Mask Reveal**:
   ```javascript
   const maskTl = gsap.timeline({
     scrollTrigger: {
       trigger: '#mask-section',
       start: 'top top',
       end: 'bottom center',
       scrub: 1.5,
       pin: true
     }
   });

   maskTl
     .to('.will-fade', { opacity: 0, stagger: 0.2, ease: 'power1.inOut' })
     .to('.masked-img', { scale: 1.3, maskSize: '400%', ease: 'power1.inOut' }, '-=0.5')
     .to('.masked-content', { opacity: 1, duration: 1, ease: 'power1.inOut' });
   ```

### Completion Gate
- [ ] Video scrub is jitter-free in all modern browsers.
- [ ] Mask scale smoothly reaches 100% viewport coverage.

---

## Validation & Verification

1. **Test Lifecycle Resets**: Verify that navigating away or resizing does not spawn duplicate ScrollTrigger listeners or memory leaks.
2. **Performance Profile**: Open DevTools Rendering panel. Verify paint flashing is localized and FPS maintains 60fps during scrubbing.
3. **Mobile Responsive Check**: Ensure pins release properly on small screens and touch-scroll scrub has zero hitching.
