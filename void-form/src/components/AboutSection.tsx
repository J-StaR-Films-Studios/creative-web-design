import React, { useEffect, useRef, useState } from 'react';
import { cursorEngine } from '../core/cursor-engine';
import { audioSynthesizer } from '../core/audio-synthesizer';

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const total = rect.height + windowHeight;
      const current = windowHeight - rect.top;
      const progress = Math.min(Math.max(current / total, 0), 1);
      setScrollYProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const p = scrollYProgress;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-[120vh] w-full bg-[#060709] px-6 md:px-16 py-32 flex flex-col justify-between select-none overflow-hidden"
      onMouseEnter={() => {
        cursorEngine.setState('hover', 'SPATIAL');
        audioSynthesizer.playMechanicalTick(1.3);
      }}
      onMouseLeave={() => cursorEngine.resetState()}
    >
      {/* Eyebrow */}
      <div className="flex items-center justify-between border-b border-[#242834] pb-6 mb-16">
        <div className="flex items-center gap-3 font-mono-tech text-xs tracking-widest text-[#FF3B00] uppercase">
          <span>06</span>
          <span>//</span>
          <span>EDITORIAL POSTER</span>
        </div>
        <span className="font-mono-tech text-xs text-[#8E929A]">DIFFERENTIAL PARALLAX</span>
      </div>

      {/* Main Living Editorial Composition */}
      <div className="my-auto space-y-4 md:space-y-8 max-w-7xl">
        {/* Line 1: WE ARE INTERESTED */}
        <div className="flex flex-wrap items-baseline gap-4 md:gap-8">
          <span
            className="inline-block font-display font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#EDE8DE] uppercase transition-transform duration-75"
            style={{
              transform: `translate3d(${(p - 0.5) * -120}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            WE
          </span>
          <span
            className="inline-block font-editorial italic font-normal text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#FF3B00] transition-transform duration-75"
            style={{
              transform: `translate3d(${(p - 0.5) * 80}px, ${(p - 0.5) * 40}px, 0)`,
              willChange: 'transform',
            }}
          >
            ARE
          </span>
          <span
            className="inline-block font-display font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#EDE8DE] uppercase transition-transform duration-75"
            style={{
              transform: `translate3d(${(p - 0.5) * 40}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            INTERESTED
          </span>
        </div>

        {/* Line 2: IN THE SPACE BETWEEN */}
        <div className="flex flex-wrap items-baseline gap-4 md:gap-8 pl-0 md:pl-24">
          <span
            className="inline-block font-mono-tech text-2xl sm:text-4xl md:text-6xl text-[#8E929A] uppercase tracking-widest transition-transform duration-75"
            style={{
              transform: `translate3d(${(p - 0.5) * 140}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            IN
          </span>
          <span
            className="inline-block font-display font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#EDE8DE] uppercase transition-transform duration-75"
            style={{
              transform: `translate3d(${(p - 0.5) * -60}px, ${(p - 0.5) * -30}px, 0)`,
              willChange: 'transform',
            }}
          >
            THE
          </span>
          <span
            className="inline-block font-display font-light text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#EDE8DE] tracking-widest uppercase border-b-2 border-[#FF3B00] transition-transform duration-75"
            style={{
              transform: `translate3d(${(p - 0.5) * -160}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            SPACE
          </span>
          <span
            className="inline-block font-editorial italic text-3xl sm:text-5xl md:text-7xl text-[#8E929A] transition-transform duration-75"
            style={{
              transform: `translate3d(${(p - 0.5) * 100}px, ${(p - 0.5) * 20}px, 0)`,
              willChange: 'transform',
            }}
          >
            BETWEEN
          </span>
        </div>

        {/* Line 3: DESIGN AND TECHNOLOGY. */}
        <div className="flex flex-wrap items-baseline gap-4 md:gap-8 pl-0 md:pl-48">
          <span
            className="inline-block font-display font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#FF3B00] uppercase transition-transform duration-75"
            style={{
              transform: `translate3d(${(p - 0.5) * 180}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            DESIGN
          </span>
          <span
            className="inline-block font-mono-tech text-xl sm:text-3xl md:text-5xl text-[#8E929A] uppercase tracking-widest"
          >
            &
          </span>
          <span
            className="inline-block font-display font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#EDE8DE] uppercase transition-transform duration-75"
            style={{
              transform: `translate3d(${(p - 0.5) * -100}px, ${(p - 0.5) * -20}px, 0)`,
              willChange: 'transform',
            }}
          >
            TECHNOLOGY.
          </span>
        </div>
      </div>

      {/* Studio Thesis Subtext */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-[#242834]">
        <p className="font-sans-body text-sm md:text-base text-[#8E929A] leading-relaxed max-w-xl">
          We do not build commodity interfaces. We engineer bespoke computational instruments, custom shaders, and sensory interactive environments where every pixel responds with intention.
        </p>
        <div className="flex items-end justify-start md:justify-end font-mono-tech text-xs text-[#EDE8DE]/60 uppercase tracking-widest">
          STUDIO / TOKYO · BASEL · LONDON
        </div>
      </div>
    </section>
  );
};
