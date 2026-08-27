/**
 * Lenis Smooth Scrolling + GSAP ScrollTrigger Cinematic Scrollytelling Choreography
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ScrollChoreographer {
  public lenis: Lenis;
  private progressBar: HTMLElement;

  constructor() {
    this.progressBar = document.getElementById('scroll-progress-bar')!;

    // Initialize Lenis with high-inertia smooth physics
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    this.initTimelineChoreography();
  }

  private initTimelineChoreography() {
    // 1. Progress Bar Binding
    this.lenis.on('scroll', (e: any) => {
      const progress = e.progress * 100;
      this.progressBar.style.width = `${progress}%`;
    });

    // 2. SHOT 2: Exploded Schematic 3D Separation Timeline
    const shot2 = document.getElementById('shot-2')!;
    const explodedCards = [
      document.getElementById('layer-bezel')!,
      document.getElementById('layer-crystal')!,
      document.getElementById('layer-movement')!,
      document.getElementById('layer-baseplate')!
    ];

    const tlExploded = gsap.timeline({
      scrollTrigger: {
        trigger: shot2,
        start: 'top top',
        end: '+=1500',
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    tlExploded
      .fromTo(explodedCards[0], { y: 150, rotateX: 30, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 1 })
      .fromTo(explodedCards[1], { y: 150, rotateX: 30, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 1 }, '-=0.6')
      .fromTo(explodedCards[2], { y: 150, rotateX: 30, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 1 }, '-=0.6')
      .fromTo(explodedCards[3], { y: 150, rotateX: 30, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 1 }, '-=0.6');

    // 3. SHOT 3: Horizontal Gear Train Track
    const shot3 = document.getElementById('shot-3')!;
    const track = document.getElementById('horizontal-track')!;

    gsap.to(track, {
      xPercent: -75,
      ease: 'none',
      scrollTrigger: {
        trigger: shot3,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    // 4. SHOT 4: Resolution Convergence
    const shot4 = document.getElementById('shot-4')!;
    const resTitle = shot4.querySelector('.res-title')!;
    const resDesc = shot4.querySelector('.res-desc')!;
    const cta = shot4.querySelector('.cta-box')!;

    gsap.from([resTitle, resDesc, cta], {
      y: 60,
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: shot4,
        start: 'top 70%'
      }
    });
  }
}
