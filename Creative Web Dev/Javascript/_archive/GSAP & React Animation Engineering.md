# Source-to-Skill Compilation: GSAP & React Animation Engineering

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-notes / tutorial transcript |
| **Title** | Full Stack GSAP & React Landing Page Crash Course & Project Build (JS Mastery / Adrian) |
| **Authority** | Adrian Hajdin (Founder, JS Mastery) — Industry Frontend & Animation Educator |
| **Coverage** | GSAP core methods (`to`, `from`, `fromTo`, `timeline`, `stagger`), plugins (`ScrollTrigger`, `SplitText`), React integration via `@gsap/react` (`useGSAP`), responsive scroll-driven animations, video scrub optimization via FFmpeg, and modular landing page construction with Tailwind CSS. |

### Coverage Gaps
- Advanced custom SVG path morphing (`MorphSVGPlugin`) and canvas/WebGL integrations (Three.js/GSAP) are referenced as advanced concepts but not detailed in the codebase.
- SSR hydration constraints with Next.js (video focuses on Vite/React with `@gsap/react`).

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
- id: ku-001
  type: concept
  name: Tween
  source: src-01, "GSAP Basics"
  confidence: high
  definition: >
    The foundational animation unit in GSAP that manipulates object/DOM properties
    over a specified duration from one value to another.
  attributes: [duration, ease, delay, repeat, yoyo]
  avoid_terms: [CSS transition, frame loop]

- id: ku-002
  type: concept
  name: useGSAP Hook
  source: src-01, "React Integration"
  confidence: high
  definition: >
    A specialized React lifecycle hook provided by @gsap/react that wraps GSAP animations
    in an automatic context cleanup lifecycle, preventing memory leaks and orphaned tweens.
  attributes: [scope, dependencies, context]
  avoid_terms: [useEffect with gsap, manual cleanup]

- id: ku-003
  type: concept
  name: ScrollTrigger
  source: src-01, "ScrollTrigger Section"
  confidence: high
  definition: >
    A GSAP plugin that binds tween or timeline progress to the viewport scroll position,
    handling trigger boundaries, pinning, and scrub synchronization.
  attributes: [trigger, start, end, scrub, pin, markers]

- id: ku-004
  type: concept
  name: SplitText
  source: src-01, "SplitText Plugin"
  confidence: high
  definition: >
    A GSAP plugin that parses text DOM elements into discrete spans of characters, words,
    or lines without breaking document flow, enabling staggered kinetic typography.
  attributes: [type (chars/words/lines), chars, words, lines]

- id: ku-010
  type: principle
  name: Model Keyframes for Smooth Scrubbing
  source: src-01, "Hero Video Animation"
  confidence: high
  statement: >
    HTML5 video scrubbed via ScrollTrigger must have an intra-frame (GOP) interval of 1
    (every frame is a keyframe / I-frame). Standard compressed video only stores keyframes
    every few seconds, causing choppy seeking during scroll scrub.
  rationale: >
    Browsers must decode from the preceding keyframe up to the current timestamp.
    Frequent keyframes eliminate seek latency.
  applies_to: [ku-024]

- id: ku-011
  type: principle
  name: Emotion-Driven Motion Timing
  source: src-01, "Hero & Menu Section"
  confidence: high
  statement: >
    Keep micro-animations (staggers, text reveals) under 0.05s-0.08s stagger delays and
    1.0s-1.8s durations with natural deceleration easing (e.g., expo.out, power1.inOut).
  rationale: >
    Slow animations degrade user experience and perceived site speed. Motion must feel
    crisp and tactile without delaying content access.

- id: ku-020
  type: procedure
  name: GSAP Base Method Execution
  source: src-01, "GSAP Crash Course"
  confidence: high
  goal: Execute element transformations between states
  steps:
    - action: Determine target element selector, ref, or array of nodes
      criterion: Target is mounted in DOM
    - action: Select method (`gsap.to` for current->target, `gsap.from` for initial->current, `gsap.fromTo` for explicit A->B)
      criterion: Directionality matches UX requirement
    - action: Configure vars object with properties (x, yPercent, rotation, opacity, duration, ease, stagger)
      criterion: All animatable values are CSS/DOM valid
  outputs: [Tween Instance]

- id: ku-021
  type: procedure
  name: Timeline Sequencing & Scoping
  source: src-01, "GSAP Timeline"
  confidence: high
  goal: Create coordinated multi-element animation sequences
  steps:
    - action: Instantiate timeline via `gsap.timeline({ scrollTrigger?: {...} })`
      criterion: Timeline variable initialized
    - action: Chain `.to()`, `.from()`, or `.fromTo()` tweens sequentially or with position offsets (`"<"`, `"-=0.5"`)
      criterion: Overlaps and pauses execute as designed
    - action: Wrap inside `useGSAP({ scope: containerRef })` in React
      criterion: Selectors inside scope auto-resolve to container children
  outputs: [Coordinated Timeline Instance]

- id: ku-022
  type: procedure
  name: Kinetic Text Splitting
  source: src-01, "GSAP Text & Hero Split"
  confidence: high
  goal: Decompose headings/paragraphs for staggered character or word entrance
  steps:
    - action: Register plugin via `gsap.registerPlugin(SplitText)`
      criterion: SplitText loaded in runtime
    - action: Instantiate `new SplitText(target, { type: "chars, words" | "lines" })`
      criterion: DOM tree populated with character/word spans
    - action: Apply utility classes (e.g. text-gradient) directly to character list if needed
      criterion: Inline styling preserved
    - action: Animate `.chars` or `.lines` via `gsap.from()` with stagger (`0.02s` - `0.06s`) and `expo.out`
      criterion: Smooth wave entrance executed
  outputs: [Splitted Text DOM Structure & Tween]

- id: ku-023
  type: procedure
  name: Scroll-Triggered Parallax Masking
  source: src-01, "Art Section Build"
  confidence: high
  goal: Reveal background imagery through expanding SVG/CSS masks on scroll
  steps:
    - action: Define masked container with CSS `-webkit-mask-image` / `mask-image` centered
      criterion: Mask applies correctly to underlying image
    - action: Set up pinned timeline with `scrollTrigger: { trigger, start, end, scrub: 1.5, pin: true }`
      criterion: Section locks in place on viewport entry
    - action: Animate surrounding text opacity to 0
      criterion: Viewport focus shifts to mask
    - action: Scale mask size (`maskSize: "400%"`, `scale: 1.3`) to reveal full photo
      criterion: Image transitions seamlessly from silhouette to full-bleed photo
  outputs: [Full Scroll-Driven Mask Reveal]

- id: ku-024
  type: procedure
  name: Video Scroll Scrubbing Setup
  source: src-01, "Hero Video Animation"
  confidence: high
  goal: Scrub video frame-by-frame smoothly tied to scroll position
  steps:
    - action: Process source video through FFmpeg: `ffmpeg -i input.mp4 -vf scale=960:-1 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p output.mp4`
      criterion: Output video has GOP size 1 (keyframe every frame)
    - action: Embed HTML5 video with `muted`, `playsInline`, `preload="auto"`
      criterion: Video does not auto-play and allows frame seeking
    - action: Bind GSAP timeline with ScrollTrigger scrub to `currentTime` of `videoRef.current`
      criterion: Scroll position directly controls `currentTime` smoothly
  outputs: [Optimized Video Scroll Scrub]

- id: ku-030
  type: constraint
  name: Plugin Registration Invariant
  source: src-01, "App.jsx Setup"
  confidence: high
  rule: >
    Always register plugins (`ScrollTrigger`, `SplitText`) via `gsap.registerPlugin()`
    globally before any animation component mounts.
  scope: Global application entry point
  consequence: Animations fail silently or crash on SSR/DOM mount.
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Setup & Plugin Architecture
INPUT: Node environment, React app, source assets.
STEPS:
1. Install `gsap`, `@gsap/react`, and responsive utility packages.
2. Register GSAP plugins globally (`ScrollTrigger`, `SplitText`).
3. Configure global styles and Tailwind custom utility classes.
OUTPUT: Initialized application with GSAP context.

STAGE 2: React Component Animation Scoping
INPUT: DOM elements, ref attachments.
STEPS:
1. Wrap component logic in `useGSAP()`.
2. Define `scope: containerRef` for selector containment.
3. Handle responsive breakpoint differences using `useMediaQuery`.
OUTPUT: Isolated, memory-safe animation scope.

STAGE 3: Scroll & Timeline Orchestration
INPUT: Target elements, scroll trigger bounds, positioning logic.
STEPS:
1. Formulate start/end viewport collision strings (`"top top"`, `"center 60%"`).
2. Instantiate timeline with `scrub: true | number` and `pin: true` where pinning is required.
3. Chain tweens with directional coordinates and position markers (`"<"`, `"-=0.5"`).
OUTPUT: Scroll-synchronized timeline.

STAGE 4: Performance & Video Scrub Optimization
INPUT: Raw video assets, dynamic text elements.
STEPS:
1. Transcode video with `-g 1` flag for intra-frame keyframes.
2. Bind timeline tween directly to `videoElement.currentTime`.
3. Use `SplitText` with micro-staggers (`0.02s` - `0.06s`) for kinetic text reveals.
OUTPUT: 60fps buttery-smooth scrub and text transitions.
```

---

## Phase 4: Skill Compilation

Below is the compiled agent skill package ready for deployment.

```
gsap-react-animations/
├── SKILL.md
└── references/
    ├── terminology.md
    └── gsap-patterns.md
```

### File: `gsap-react-animations/SKILL.md`

```markdown
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
```

---

### File: `gsap-react-animations/references/terminology.md`

```markdown
# GSAP & React Animation Terminology

**Tween**:
The foundational animation instance created by `gsap.to()`, `gsap.from()`, or `gsap.fromTo()` that interpolates properties of objects/DOM nodes over time.
_Avoid_: CSS keyframe, transition block

**Timeline (`gsap.timeline`)**:
A sequencing container that manages multiple tweens and callbacks, controlling their execution relative to a single playhead.
_Avoid_: animation chain, setTimeout queue

**useGSAP**:
The React-specific hook from `@gsap/react` that provides automatic context-based scoping, cleanup, and dependency tracking for GSAP animations.
_Avoid_: useEffect animation wrapper, componentDidMount tween

**ScrollTrigger**:
The GSAP plugin responsible for binding tween or timeline progress to scrollbar coordinates, supporting features like pinning, scrubbing, and snapping.
_Avoid_: scroll listener, intersection observer animation

**Scrub (`scrub`)**:
A ScrollTrigger property that ties playhead progress directly to the scrollbar movement. Setting a numeric value (e.g. `scrub: 1.5`) smooths the catch-up response.
_Avoid_: scroll trigger on-scroll event

**Pinning (`pin`)**:
Locking a DOM element in place in the viewport while the scrollbar continues to progress over a specified scroll distance.
_Avoid_: sticky positioning hack, fixed position toggle

**SplitText**:
A utility plugin that parses text nodes into nested `span` arrays (`chars`, `words`, `lines`) for kinetic typography.
_Avoid_: custom span splitter, regex text parser

**GOP Size (Group of Pictures)**:
The frequency of keyframes (I-frames) in video encoding. For scroll-scrubbed video, GOP must equal 1 (`-g 1`).
_Avoid_: standard video compression, variable keyframe interval
```

---

### File: `gsap-react-animations/references/gsap-patterns.md`

```markdown
# GSAP Production Patterns & Code Recipes

## Pattern 1: Infinite Modular Slider via Remainder Operator

Use the modulo / remainder operator `%` to create looping sliders without state bounds:

```javascript
const goToSlide = (index) => {
  // Safe circular index calculation
  const newIndex = ((index % totalItems) + totalItems) % totalItems;
  setCurrentIndex(newIndex);
};

// Auto re-run animation on dependency change
useGSAP(() => {
  gsap.fromTo(
    '.slider-image',
    { opacity: 0, xPercent: -100 },
    { opacity: 1, xPercent: 0, duration: 1, ease: 'power1.inOut' }
  );
  gsap.fromTo(
    '.slider-title',
    { opacity: 0, yPercent: 100 },
    { opacity: 1, yPercent: 0, duration: 1, ease: 'power1.inOut' }
  );
}, { scope: containerRef, dependencies: [currentIndex] });
```

---

## Pattern 2: Position Offsets and Relative Timing in Timelines

Control tween overlap and synchronization with position parameters:

```javascript
const tl = gsap.timeline();

tl.to('#box1', { x: 200, duration: 1 })
  // Start at the exact same time as #box1
  .to('#box2', { y: 200, duration: 1 }, '<')
  // Start 0.5s before previous tween ends
  .to('#box3', { scale: 1.5, duration: 1 }, '-=0.5')
  // Absolute timestamp (at 3 seconds)
  .to('#box4', { opacity: 0, duration: 1 }, 3);
```

---

## Pattern 3: Array Conversion & DOM Target Extraction

Convert React child refs or NodeLists into GSAP-compatible arrays:

```javascript
useGSAP(() => {
  const boxArray = gsap.utils.toArray(containerRef.current.children);

  boxArray.forEach((box, index) => {
    gsap.to(box, {
      x: 150 * (index + 1),
      rotation: 360,
      scrollTrigger: {
        trigger: box,
        start: 'bottom bottom',
        end: 'top 20%',
        scrub: true
      }
    });
  });
}, { scope: containerRef });
```

---

## Pattern 4: Responsive Parallax Dual-Asset Scroll

```javascript
useGSAP(() => {
  const isMobile = window.innerWidth < 768;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#footer-contact',
      start: isMobile ? 'top 80%' : 'top center',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  tl.to('#f-right-leaf', { y: -50, duration: 1, ease: 'power1.inOut' })
    .to('#f-left-leaf', { y: 50, duration: 1, ease: 'power1.inOut' }, '<');
}, { scope: containerRef });
```
```

---

## Phase 5: Validation & Delivery

### Extraction & Mapping Summary
- **Extracted Units**: 7 Concepts, 2 Principles, 5 Procedures, 1 Constraint.
- **Components Built**: `Navbar`, `Hero` (video scrub & typography split), `Cocktails` (scroll parallax), `About` (grid reveals), `Art` (expanding image mask), `Menu` (modular active item carousel), `Contact` (footer parallax).
- **Core Technology Stack Encoded**: React, GSAP 3 Core, `@gsap/react` (`useGSAP`), `ScrollTrigger`, `SplitText`, Tailwind CSS utilities, and FFmpeg video pipeline.

### Known Limitations
1. **Video Codec Compatibility on Old Safari**: HTML5 video scrubbing with `-g 1` requires standard H.264 profile (`yuv420p`). Higher bit-depths (e.g. HEVC 10-bit) will stutter on mobile Safari.
2. **ScrollTrigger Pinning in Overflow Containers**: If any parent container has `overflow: hidden` or `overflow: auto`, ScrollTrigger calculations for pin coordinates will break. Always keep pinning containers inside natural document flow.
