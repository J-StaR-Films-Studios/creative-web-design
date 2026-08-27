'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    lenisRef.current = lenis;

    // Animate room reveals
    const reveals = document.querySelectorAll('[data-reveal]');
    reveals.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: el as Element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
      });
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(() => {});
      ScrollTrigger.killAll();
    };
  }, []);
}
