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
