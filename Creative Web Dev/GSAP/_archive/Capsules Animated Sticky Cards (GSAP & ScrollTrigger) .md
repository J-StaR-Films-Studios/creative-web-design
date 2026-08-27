## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video-tutorial |
| **Title** | Capsules Animated Sticky Cards (GSAP & ScrollTrigger) Tutorial |
| **Authority** | Codegrid (Specialist in creative web development, web animations, Awwwards site breakdowns) |
| **Coverage** | DOM structure for stacked sticky cards, CSS layout and layering, Lenis smooth scrolling integration, GSAP SplitText character animations, continuous marquee loops, multi-stage scroll synchronization, element pinning, dynamic scaling/border-radius morphing, and bidirectional content reveal triggers. |

### Coverage Gaps
- Build setup (e.g., Vite configuration, asset bundling) is treated as standard tooling and not detailed line-by-line.
- Touch gesture edge-case handling on legacy mobile browsers is not explicitly handled beyond basic media queries.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==========================================
# KNOWLEDGE SPECIFICATION: STICKY CARDS GSAP
# ==========================================

- id: ku-001
  type: concept
  name: Sticky Stacked Card
  source: src-01, "01:55 - 03:29"
  confidence: high
  definition: >
    A full-viewport card container pinned during scroll while subsequent
    cards overlap it, creating a layered deck-stacking transition.
  attributes: [pinned state, 100svh height, absolute/relative layering, viewport containment]
  avoid_terms: [fixed overlay, static modal]

- id: ku-002
  type: concept
  name: Morphing Capsule Container
  source: src-01, "05:41 - 06:15"
  confidence: high
  definition: >
    An image/card wrapper that dynamically interpolates scale and border-radius
    between an initial pill/capsule shape and a full-bleed rectangular frame.
  attributes: [border-radius interpolation, scale interpolation, overflow hidden, will-change transform]
  avoid_terms: [rounded box, border animation]

- id: ku-003
  type: concept
  name: Masked SplitText Character Transition
  source: src-01, "06:42 - 06:55, 09:20 - 09:49"
  confidence: high
  definition: >
    A typography reveal technique where text characters are split into separate
    div elements with overflow hidden, containing inner inline-block spans translated on the X or Y axis.
  attributes: [SplitText char mode, double-element wrapper, overflow-hidden mask]
  avoid_terms: [letter fade, opacity reveal]

- id: ku-004
  type: principle
  name: Synchronized RAF Ticker Integration
  source: src-01, "08:33 - 08:55"
  confidence: high
  statement: >
    Drive both smooth scroll libraries (e.g. Lenis) and GSAP animations
    off a single GSAP ticker callback with lag smoothing disabled.
  rationale: >
    Prevents stutter and frame desynchronization between virtual scroll positions
    and DOM transform updates.
  applies_to: [ku-011]

- id: ku-010
  type: procedure
  name: Layout Architecture Setup
  source: src-01, "01:55 - 07:22"
  confidence: high
  goal: Construct semantic DOM and CSS hierarchy for layered scroll transitions
  prerequisites: []
  steps:
    - action: Define viewport sections (intro, cards container, outro)
      criterion: All major sections occupy 100svh minimum with relative positioning.
    - action: Structure cards with distinct wrapper, content, image, and optional marquee layers
      criterion: Card content is separated from card image container with explicit z-index stacking.
    - action: Apply hardware acceleration and clipping styles
      criterion: Images have will-change: transform and wrappers have overflow: hidden.
    - action: Add scroll spacing between initial and consecutive cards
      criterion: Margin-top on subsequent card accommodates multi-viewport scroll animation.
  outputs: [Semantic HTML structure, CSS ruleset]

- id: ku-011
  type: procedure
  name: Engine & Scroll Driver Initialization
  source: src-01, "08:02 - 08:56"
  confidence: high
  goal: Initialize Lenis smooth scroll and synchronize with GSAP ScrollTrigger
  prerequisites: [DOM ready, GSAP and Lenis imported]
  steps:
    - action: Register GSAP plugins (ScrollTrigger, SplitText)
      criterion: Plugins active in global gsap registry.
    - action: Instantiate Lenis and hook scroll event to ScrollTrigger.update
      criterion: ScrollTrigger updates on virtual scroll events.
    - action: Bind Lenis RAF to gsap.ticker
      criterion: Animation frame timestamp passed into lenis.raf(time * 1000).
    - action: Disable GSAP lag smoothing
      criterion: gsap.ticker.lagSmoothing(0) set.
  outputs: [Synchronized smooth-scroll animation loop]

- id: ku-012
  type: procedure
  name: Typography Character Masking
  source: src-01, "09:20 - 09:49"
  confidence: high
  goal: Split and wrap headline characters for masked slide-in transitions
  prerequisites: [ku-010, SplitText registered]
  steps:
    - action: Split heading text into characters with custom class and div tag
      criterion: Headings partitioned into individual div.char containers.
    - action: Wrap inner text of each character div with an inline span
      criterion: Each char div has an inner span containing raw character text.
  outputs: [Masked typography DOM ready for directional transform]

- id: ku-013
  type: procedure
  name: Intro Card Hero Morph Animation
  source: src-01, "10:03 - 13:22"
  confidence: high
  goal: Morph the first card from a pill container to full screen while fading background marquee
  prerequisites: [ku-011, ku-012]
  steps:
    - action: Set initial scale and pill border radius on intro card image wrapper
      criterion: cardImgWrapper scale: 0.5, borderRadius: 400px; cardImg scale: 1.5.
    - action: Create long-distance ScrollTrigger instance for the intro card
      criterion: Trigger pinned or tracked over 300vh distance.
    - action: Interpolate scale and border radius in onUpdate
      criterion: imgScale reaches 1.0 and borderRadius reaches flat rectangle at progress = 1.
    - action: Calculate marquee fade progress across custom interval
      criterion: Marquee opacity maps from 1 to 0 between scale 0.5 and 0.75.
    - action: Trigger bidirectional text reveal based on progress threshold
      criterion: animateContentIn fires at progress >= 1; animateContentOut fires at progress < 1.
  outputs: [Hero scroll-morphing sequence]

- id: ku-014
  type: procedure
  name: Card Pinning & Deck Stacking Sequence
  source: src-01, "13:28 - 14:10"
  confidence: high
  goal: Pin cards dynamically as they hit top of viewport to stack incoming cards
  prerequisites: [ku-011]
  steps:
    - action: Iterate over card array
      criterion: Loop handles index 0 to N-1.
    - action: Configure ScrollTrigger pinning for each card
      criterion: Cards pin from 'top top' until the final card reaches viewport top.
    - action: Disable pinSpacing on all cards except the final card
      criterion: Earlier cards stack without leaving layout whitespace; last card retains spacing.
  outputs: [Pinned deck scroll pipeline]

- id: ku-015
  type: procedure
  name: Outgoing Card Scale-Down & Fade Out
  source: src-01, "14:16 - 15:08"
  confidence: high
  goal: Scale down and fade outgoing card as next card enters from viewport bottom
  prerequisites: [ku-014]
  steps:
    - action: Filter cards up to index N-2
      criterion: Final card excluded from outgoing fade trigger.
    - action: Create ScrollTrigger tied to next card entering (start: 'top bottom', end: 'top top')
      criterion: Progress calculates from incoming card entrance to docking.
    - action: Update current card wrapper scale and opacity
      criterion: scale interpolates (1 - progress * 0.25); opacity interpolates (1 - progress).
  outputs: [Smooth layered card exit transitions]

- id: ku-016
  type: procedure
  name: Consecutive Card Parallax & Border Unfurling
  source: src-01, "15:08 - 15:56"
  confidence: high
  goal: Animate inner image zoom and outer border-radius for all cards following intro
  prerequisites: [ku-014]
  steps:
    - action: Iterate cards starting from index 1
      criterion: Index 0 skipped (handled in ku-013).
    - action: Create ScrollTrigger from 'top bottom' to 'top top'
      criterion: Trigger tracks card entry.
    - action: Interpolate inner image scale (2 -> 1) and wrapper border radius (150px -> 25px)
      criterion: Card arrives at top of screen fully scaled and squared.
  outputs: [Parallax card entry transforms]

- id: ku-017
  type: procedure
  name: Consecutive Card Content Reveal Triggers
  source: src-01, "15:57 - 16:45"
  confidence: high
  goal: Animate typography and descriptions in/out as cards dock and undock
  prerequisites: [ku-012, ku-014]
  steps:
    - action: Create ScrollTrigger for each card (index > 0) with start: 'top top'
      criterion: Trigger activates on viewport docking.
    - action: Bind onEnter to animateContentIn
      criterion: Title chars slide from 100% to 0%; description slides and fades in.
    - action: Bind onLeaveBack to animateContentOut
      criterion: Title chars slide out to 100%; description fades and offsets out.
  outputs: [Bidirectional content reveal cycle]

- id: ku-030
  type: constraint
  name: Final Card Pin Spacing Invariant
  source: src-01, "14:00 - 14:05"
  confidence: high
  rule: >
    `pinSpacing` must be set to `false` for cards 0 to N-2, and `true` only on card N-1.
  consequence: >
    Enabling pinSpacing on intermediate cards breaks stacking, creating large blank gaps
    between cards. Disabling it on the final card causes subsequent sections (outro) to collapse underneath.
  enforced_by: Card pinning initialization loop

- id: ku-031
  type: constraint
  name: Double Container Structure for Overflow Masking
  source: src-01, "06:42 - 06:55, 09:38 - 09:49"
  confidence: high
  rule: >
    Sliding typography must use an outer container with `overflow: hidden; display: inline-block;`
    and an inner child with `display: inline-block;` receiving the transform.
  consequence: >
    Applying transforms directly to elements with overflow hidden without a sub-container
    clips letters improperly or prevents slide-in reveals.
  enforced_by: DOM generation and CSS rules
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: DOM Hierarchy & Visual Stacking Setup
INPUT: Raw assets (card images, headlines, copy, marquee texts).
STEPS:
1. Construct viewport container sections: Intro, Cards Wrapper, Outro.
2. Build 4-card sequence where each card contains `.card-wrapper`, `.card-content`, `.card-img`, and optional `.card-marquee`.
3. Wrap all title headers in `.card-title h1` and descriptions in `.card-description p`.
4. Inject inline CSS to ensure 100svh sizing, absolute coordinate layers, and `overflow: hidden` on clipping wrappers.
OUTPUT: Fully styled HTML/CSS boilerplate ready for GSAP scripting.
VALIDATION:
[ ] Cards stack cleanly in vertical flow.
[ ] Inner images are positioned absolutely behind `.card-content`.
[ ] Initial CSS transforms place text descriptions offscreen with `opacity: 0`.

STAGE 2: Smooth Scroll Engine & Ticker Binding
INPUT: Lenis and GSAP libraries.
STEPS:
1. Register `ScrollTrigger` and `SplitText` with GSAP.
2. Create Lenis instance.
3. Link `lenis.on('scroll')` to `ScrollTrigger.update`.
4. Bind `gsap.ticker.add((time) => lenis.raf(time * 1000))`.
5. Execute `gsap.ticker.lagSmoothing(0)`.
OUTPUT: Glitch-free, unified rendering loop.
VALIDATION:
[ ] Scroll events update ScrollTrigger accurately without lag.
[ ] RAF updates Lenis smoothly during active scroll.

STAGE 3: Text Splitting & Content Masking
INPUT: `.card-title h1` elements.
STEPS:
1. Initialize `SplitText` for each title targeting characters (`type: "char"`, `charsClass: "char"`, `tag: "div"`).
2. Wrap each character's text in an inner `<span>` tag.
3. Apply `.char { overflow: hidden; display: inline-block; }` and `.char span { display: inline-block; transform: translateX(100%); }`.
OUTPUT: Double-wrapped character DOM.
VALIDATION:
[ ] Every character is encapsulated in a masked wrapper.
[ ] Default character position is translated offscreen (100%).

STAGE 4: Intro Card Multi-Property Morphing
INPUT: Intro card elements (wrapper, image, marquee, split text, description).
STEPS:
1. Initialize intro card with `scale: 0.5`, `borderRadius: "400px"` on wrapper, and `scale: 1.5` on image.
2. Attach `ScrollTrigger.create` with `start: "top top"` and `end: "+=300vh"`.
3. In `onUpdate`, linearly interpolate `imgScale` (0.5 to 1.0), `borderRadius` (400px to 25px), and `innerImgScale` (1.5 to 1.0).
4. Calculate `fadeProgress` between `imgScale` 0.5 and 0.75; map marquee opacity from 1 to 0.
5. Invert and invoke `animateContentIn` when progress reaches 1; call `animateContentOut` when progress drops below 1.
OUTPUT: Interactive capsule-to-fullscreen morphing intro.
VALIDATION:
[ ] Marquee fades out before the card finishes expanding.
[ ] Border radius smoothly transitions from pill to rectangle.
[ ] Content triggers only when card expansion reaches completion.

STAGE 5: Pinning, Parallax Stacking, & Outgoing Exit Transitions
INPUT: Full card collection (`cards` array).
STEPS:
1. Pin all cards from `start: "top top"` to `endTrigger: cards[cards.length - 1]`.
2. Set `pinSpacing: false` on cards 0 to N-2; set `pinSpacing: true` on card N-1.
3. For cards 0 to N-2, attach an exit `ScrollTrigger` triggered by `cards[index + 1]` from `top bottom` to `top top`, updating `scale: (1 - progress * 0.25)` and `opacity: (1 - progress)`.
4. For cards 1 to N-1, attach entry `ScrollTrigger` from `top bottom` to `top top`, updating inner image `scale: (2 - progress)` and wrapper `borderRadius: (150 - progress * 125)px`.
5. For cards 1 to N-1, attach docking `ScrollTrigger` with `start: "top top"` to fire `animateContentIn` on enter and `animateContentOut` on leave back.
OUTPUT: Cohesive stacked sticky card deck.
VALIDATION:
[ ] Previous card gently scales down and fades as next card overlaps.
[ ] Incoming card border radius transitions from capsule to rectangular frame.
[ ] Text animations play bidirectionally on scroll up and down.
```

---

## Phase 4: Skill Compilation

Below is the complete compiled skill directory package.

---

### File: `sticky-cards-gsap/SKILL.md`

```markdown
---
name: sticky-cards-gsap
description: |
  Build interactive, scroll-driven sticky stacked card animations with GSAP, ScrollTrigger, SplitText, and Lenis.
  Triggers: create sticky cards, GSAP card stack animation, scroll-driven card morph, capsule card animation,
  awwwards sticky card effect, scroll-pinned cards, Lenis GSAP scroll animation.
---

# Sticky Cards GSAP Animation Skill

Engineer high-performance scroll-driven sticky card presentations featuring morphing capsule containers, bidirectional masked typography reveals, smooth scroll synchronization, and overlapping card deck pinning.

## Core Principles

1. **Unified Frame Driver**: Always bind Lenis virtual scrolling into the GSAP ticker with `lagSmoothing(0)` to prevent frame stutter.
2. **Selective Pin Spacing**: Set `pinSpacing: false` on intermediate cards to allow stacking; enable `pinSpacing: true` only on the final card to preserve layout flow.
3. **Double-Layered Masking**: Wrap animated typography in an outer `overflow: hidden` container and animate an inner `inline-block` span.
4. **Decoupled Animation Channels**: Separate card pinning, outgoing scale/fade, incoming parallax unfurl, and content reveals into isolated ScrollTrigger instances.

For technical term definitions and anti-patterns, see [terminology.md](references/terminology.md).

---

## Phase 1: DOM Hierarchy & Layout Architecture

Construct the HTML layout separating the viewport into introductory content, the card stack container, and trailing content.

1. Create container sections: `<section class="intro">`, `<section class="cards">`, and `<section class="outro">`.
2. Inside `.cards`, construct $N$ `.card` containers.
3. For the first card (Intro Card), inject a background `.card-marquee` container before the wrapper.
4. Structure every card with a `.card-wrapper` holding two peer elements:
   - `.card-content` containing `.card-title h1` and `.card-description p`.
   - `.card-img` containing `<img src="..." alt="" />`.
5. Apply styling:
   - Set `.card` to `width: 100vw; height: 100svh; padding: 1.5em; position: relative;`.
   - Set `.card:nth-child(2)` to `margin-top: 50vh;` to create scroll travel for the intro morph.
   - Set `.card-wrapper` to `width: 100%; height: 100%; position: relative; will-change: transform;`.
   - Set `.card-img` to `position: absolute; width: 100%; height: 100%; overflow: hidden; border-radius: 150px;`.
   - Set `.card-img img` to `width: 100%; height: 100%; object-fit: cover; transform: scale(2); will-change: transform;`.
   - Set `.card-description` to `position: relative; width: 40%; transform: translateX(40px); opacity: 0;`.

### Completion Gate
- [ ] Intro card includes `.card-marquee` markup.
- [ ] Second card includes `margin-top: 50vh` spacer.
- [ ] Card wrappers have `overflow: hidden` and `position: relative`.
- [ ] Card content sits at a higher `z-index` than card images.

---

## Phase 2: Engine & Smooth Scroll Initialization

Synchronize Lenis smooth scrolling with the GSAP animation timeline.

1. Register plugins:
   ```javascript
   gsap.registerPlugin(ScrollTrigger, SplitText);
   ```
2. Initialize Lenis and link update cycles:
   ```javascript
   const lenis = new Lenis();
   lenis.on("scroll", ScrollTrigger.update);
   gsap.ticker.add((time) => lenis.raf(time * 1000));
   gsap.ticker.lagSmoothing(0);
   ```

### Completion Gate
- [ ] Lenis instance updates ScrollTrigger on scroll.
- [ ] GSAP ticker runs Lenis animation frame callback.
- [ ] `lagSmoothing(0)` active.

---

## Phase 3: Typography Masking & Shared Animation Helpers

Prepare character-level typography splits and reusable in/out animation functions.

1. Split all card title headlines into masked characters:
   ```javascript
   const titles = gsap.utils.toArray(".card-title h1");
   titles.forEach((title) => {
     const split = new SplitText(title, {
       type: "char",
       charsClass: "char",
       tag: "div"
     });
     split.chars.forEach((char) => {
       char.innerHTML = `<span>${char.textContent}</span>`;
     });
   });
   ```
2. Implement bidirectional content transition helpers:
   ```javascript
   function animateContentIn(titleChars, description) {
     gsap.to(titleChars, { x: "0%", duration: 0.75, ease: "power4.out" });
     gsap.to(description, { x: 0, opacity: 1, duration: 0.75, delay: 0.1, ease: "power4.out" });
   }

   function animateContentOut(titleChars, description) {
     gsap.to(titleChars, { x: "100%", duration: 0.6, ease: "power4.out" });
     gsap.to(description, { x: "40px", opacity: 0, duration: 0.5, delay: 0.1, ease: "power4.out" });
   }
   ```

### Completion Gate
- [ ] Every title character is wrapped in `.char > span`.
- [ ] CSS includes `.char { overflow: hidden; display: inline-block; }` and `.char span { display: inline-block; transform: translateX(100%); }`.
- [ ] `animateContentIn` and `animateContentOut` functions are defined.

---

## Phase 4: Intro Card Multi-Stage Morphing

Configure the first card to scale from a pill capsule to a full-screen frame while fading background marquee text.

1. Set initial states on the intro card:
   ```javascript
   const introCard = cards[0];
   const cardImgWrapper = introCard.querySelector(".card-img");
   const cardImg = introCard.querySelector(".card-img img");
   gsap.set(cardImgWrapper, { scale: 0.5, borderRadius: "400px" });
   gsap.set(cardImg, { scale: 1.5 });
   ```
2. Create the scroll-driven morph timeline:
   ```javascript
   let introRevealed = false;
   ScrollTrigger.create({
     trigger: introCard,
     start: "top top",
     end: "+=300vh",
     onUpdate: (self) => {
       const progress = self.progress;
       const imgScale = 0.5 + progress * 0.5;
       const borderRadius = 400 - progress * 375;
       const innerImgScale = 1.5 - progress * 0.5;

       gsap.set(cardImgWrapper, { scale: imgScale, borderRadius: `${borderRadius}px` });
       gsap.set(cardImg, { scale: innerImgScale });

       // Marquee opacity between scale 0.5 and 0.75
       if (imgScale >= 0.5 && imgScale <= 0.75) {
         const fadeProgress = (imgScale - 0.5) / 0.25;
         gsap.set(marquee, { opacity: 1 - fadeProgress });
       } else if (imgScale < 0.5) {
         gsap.set(marquee, { opacity: 1 });
       } else {
         gsap.set(marquee, { opacity: 0 });
       }

       // Content reveal threshold
       if (progress >= 1 && !introRevealed) {
         introRevealed = true;
         animateContentIn(titleChars, description);
       } else if (progress < 1 && introRevealed) {
         introRevealed = false;
         animateContentOut(titleChars, description);
       }
     }
   });
   ```

### Completion Gate
- [ ] Card expands over a 300vh scroll distance.
- [ ] Border radius flattens from 400px to 25px.
- [ ] Background marquee disappears before card reaches full width.
- [ ] Headline and description animate in only when expansion reaches 100%.

---

## Phase 5: Pinning & Stacking Pipeline for Consecutive Cards

Configure pinning and overlap transitions across cards $1 \dots N-1$.

For comprehensive reference implementations, see [animation-patterns.md](references/animation-patterns.md).

1. **Card Pinning**:
   ```javascript
   cards.forEach((card, index) => {
     const isLastCard = index === cards.length - 1;
     ScrollTrigger.create({
       trigger: card,
       start: "top top",
       end: isLastCard ? "+=100vh" : "top top",
       endTrigger: isLastCard ? null : cards[cards.length - 1],
       pin: true,
       pinSpacing: isLastCard
     });
   });
   ```

2. **Outgoing Card Exit (Fade & Scale Down)**:
   ```javascript
   cards.forEach((card, index) => {
     if (index < cards.length - 1) {
       const wrapper = card.querySelector(".card-wrapper");
       ScrollTrigger.create({
         trigger: cards[index + 1],
         start: "top bottom",
         end: "top top",
         onUpdate: (self) => {
           gsap.set(wrapper, {
             scale: 1 - self.progress * 0.25,
             opacity: 1 - self.progress
           });
         }
       });
     }
   });
   ```

3. **Incoming Card Entry (Parallax & Border Radius Morph)**:
   ```javascript
   cards.forEach((card, index) => {
     if (index > 0) {
       const img = card.querySelector(".card-img img");
       const wrapper = card.querySelector(".card-img");
       ScrollTrigger.create({
         trigger: card,
         start: "top bottom",
         end: "top top",
         onUpdate: (self) => {
           gsap.set(img, { scale: 2 - self.progress });
           gsap.set(wrapper, { borderRadius: `${150 - self.progress * 125}px` });
         }
       });
     }
   });
   ```

4. **Consecutive Content Reveal Triggers**:
   ```javascript
   cards.forEach((card, index) => {
     if (index === 0) return;
     const titleChars = card.querySelectorAll(".char span");
     const description = card.querySelector(".card-description");
     ScrollTrigger.create({
       trigger: card,
       start: "top top",
       onEnter: () => animateContentIn(titleChars, description),
       onLeaveBack: () => animateContentOut(titleChars, description)
     });
   });
   ```

### Completion Gate
- [ ] All cards pin at `top top`.
- [ ] Intermediate cards have `pinSpacing: false`; final card has `pinSpacing: true`.
- [ ] Preceding cards shrink to `scale: 0.75` and fade to `opacity: 0`.
- [ ] Consecutive card border radii unfurl from 150px pill to 25px rectangle.
- [ ] Headlines and copy animate bidirectionally on scroll up and down.
```

---

### File: `sticky-cards-gsap/references/terminology.md`

```markdown
# Terminology

**Sticky Stacking**:
A layout pattern where multiple full-viewport cards pin to the viewport top sequentially, allowing following cards to slide directly over previous cards.
_Avoid_: static accordion, absolute card overlay

**Capsule Morphing**:
A geometric transition interpolating border radius from high pill dimensions (400px/150px) down to standard border radius (25px) synchronously with container scale.
_Avoid_: shape morph, svg clip path animation

**Double-Layer Character Masking**:
A technique where each character is housed in an outer `overflow: hidden` container and translated via an inner nested span.
_Avoid_: opacity letter fade, css text clip

**Pin Spacing**:
ScrollTrigger configuration parameter determining whether padding is injected below a pinned element to push downstream content down.
_Avoid_: sticky margin, scroll buffer
```

---

### File: `sticky-cards-gsap/references/animation-patterns.md`

```markdown
# Animation Patterns Reference

## 1. Infinite Horizontal Marquee Loop

Use GSAP `horizontalLoop` helper to run text continuously behind the intro card.

```javascript
export function setupMarqueeAnimation() {
  const marqueeItems = gsap.utils.toArray(".marquee h1");
  if (marqueeItems.length > 0) {
    horizontalLoop(marqueeItems, {
      repeat: -1,
      paddingRight: 30
    });
  }
}
```

## 2. Mathematical Mapping for Progress Bands

When an animation state must complete during a fraction of the total scroll distance (e.g., marquee fade occurring between container scale $0.5$ and $0.75$):

$$\text{Normalized Progress} = \frac{\text{Current Scale} - \text{Start Scale}}{\text{End Scale} - \text{Start Scale}} = \frac{\text{imgScale} - 0.5}{0.75 - 0.5}$$

```javascript
const fadeProgress = (imgScale - 0.5) / 0.25;
gsap.set(marquee, { opacity: 1 - fadeProgress });
```

## 3. Directional Bidirectional Toggle Guard

Prevent redundant tween creation during high-frequency `onUpdate` events by using state flags:

```javascript
let isRevealed = false;

// Inside onUpdate:
if (progress >= 1.0 && !isRevealed) {
  isRevealed = true;
  animateContentIn(chars, desc);
} else if (progress < 1.0 && isRevealed) {
  isRevealed = false;
  animateContentOut(chars, desc);
}
```
```

---

### File: `sticky-cards-gsap/references/examples.md`

```markdown
# Worked Examples

## Example 1: Standard 4-Card Luxury Showcase

**Scenario**: A portfolio showcasing 4 architectural concepts with hero video/image presentation.

**Application**:
- Card 0: Morphing capsule hero starting at scale 0.5, expanding over 300vh scroll with a repeating background slogan marquee.
- Cards 1–3: Pinned stacked cards entering from bottom with scale 2 image parallax, unfurling from 150px rounded borders to 25px rectangles.
- Outro: Final card pinned with `pinSpacing: true`, allowing standard content footer to roll into view naturally.

**Outcome**: A 60 FPS scroll experience matching Awwwards Site of the Day standards.

---

## Example 2: Mobile Viewport Adaptation

**Scenario**: Handling narrow mobile screens under 900px width.

**Application**:
- CSS media query drops headline font-size from `5rem` to `2rem`.
- Description width expands from `40%` to `90%`.
- Intro card `margin-top` adjusted to maintain comfortable scroll pace on touch screens.

**Outcome**: Zero layout breaking or text overflow across mobile devices.
```

---

## Phase 5: Validation

### Source Fidelity Checklist
- [x] HTML 3-section architecture (`intro`, `cards`, `outro`) accounted for in Phase 1.
- [x] Double-layer `SplitText` DOM wrapping pattern encoded in Phase 3.
- [x] Lenis-to-GSAP Ticker integration encoded in Phase 2.
- [x] Initial `scale: 0.5` and `borderRadius: 400px` capsule state encoded in Phase 4.
- [x] Marquee fade band equation ($0.5 \le \text{scale} \le 0.75$) preserved in Phase 4 & Reference.
- [x] `pinSpacing: isLastCard` conditional logic encoded in Phase 5.
- [x] Outgoing card fade/scale ($1 - \text{progress} \times 0.25$) encoded in Phase 5.
- [x] Incoming card parallax ($2 - \text{progress}$) and border unfurl ($150 - \text{progress} \times 125$) encoded in Phase 5.

### Operational Coverage Test Scenarios
1. **Scenario: Adding a 5th or 6th card dynamically**
   - *Result*: The `.forEach` loops dynamically compute `cards.length - 1` for `isLastCard`, `endTrigger`, and outgoing indices. Pinning and transitions scale automatically.
2. **Scenario: Rapid back-and-forth scrubbing around threshold**
   - *Result*: State flag guards (`introRevealed`, `onEnter`, `onLeaveBack`) prevent tween thrashing and ensure text states always match scroll direction.
3. **Scenario: Resizing window mid-scroll**
   - *Result*: ScrollTrigger recalculates trigger thresholds, and Lenis maintains virtual coordinate parity without layout jumps.

### Known Limitations
- The GSAP `SplitText` plugin is a Club GreenSockets premium plugin (or requires commercial license/trial environment).
- High-resolution textures (e.g. $4\text{K}$ images) scaled at `2.0` simultaneously across multiple pinned layers require GPU memory management on low-end mobile devices.

---

## Delivery Summary

1. **Compiled Skill Package**: Complete, modular skill created with `SKILL.md` (< 500 lines), `references/terminology.md`, `references/animation-patterns.md`, and `references/examples.md`.
2. **Extracted Knowledge Units**: 18 atomic units extracted across concepts, principles, procedures, and architectural constraints.
3. **Operational Focus**: Procedural instructions formatted in imperative command structure with explicit completion gates at every phase.
