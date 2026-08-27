import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cursorEngine } from '../core/cursor-engine';
import { audioSynthesizer } from '../core/audio-synthesizer';
import { ParticleTextSystem } from '../core/particle-physics-engine';
import { Sparkles, Type } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [mode, setMode] = useState<'text' | 'particles'>('text');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleSystemRef = useRef<ParticleTextSystem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Structure by lines of words to guarantee NO mid-word line-wrapping
  const heroLines = [
    ['WE', 'BUILD', 'THINGS'],
    ['THAT', "SHOULDN'T"],
    ['EXIST', 'YET.'],
  ];

  // Character distortion state tracking
  const charOffsets = useRef<Array<{ x: number; y: number; rot: number; scale: number; vx: number; vy: number }>>([]);

  // Calculate total character count
  let totalCharacters = 0;
  heroLines.forEach((words) => {
    words.forEach((w) => {
      totalCharacters += w.length;
    });
  });

  // Initialize char physics
  useEffect(() => {
    charOffsets.current = Array.from({ length: totalCharacters }, () => ({
      x: 0,
      y: 0,
      rot: 0,
      scale: 1,
      vx: 0,
      vy: 0,
    }));
  }, [totalCharacters]);

  // Update granular character distortion on mouse movement
  const updateCharacterDistortion = useCallback((clientX: number, clientY: number) => {
    if (mode !== 'text') return;

    let charIdx = 0;
    charsRef.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const dx = clientX - charCenterX;
      const dy = clientY - charCenterY;
      const dist = Math.hypot(dx, dy);
      const radius = 120;

      const current = charOffsets.current[charIdx];
      if (!current) return;

      if (dist < radius && dist > 0.001) {
        const force = (radius - dist) / radius;
        const angle = Math.atan2(dy, dx);

        // Repel characters and tilt subtly
        current.vx -= Math.cos(angle) * force * 12;
        current.vy -= Math.sin(angle) * force * 12;
        current.rot = Math.sin(angle) * force * 20;
        current.scale = 1 + force * 0.2;

        audioSynthesizer.playMechanicalTick(0.8 + force * 0.6);
      }

      charIdx++;
    });
  }, [mode]);

  // Spring restitution loop for character distortion
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (mode === 'text') {
        let charIdx = 0;
        charsRef.current.forEach((el) => {
          if (!el) return;
          const current = charOffsets.current[charIdx];
          if (current) {
            // Spring back to equilibrium
            current.vx += (0 - current.x) * 0.09;
            current.vy += (0 - current.y) * 0.09;
            current.vx *= 0.84;
            current.vy *= 0.84;
            current.x += current.vx;
            current.y += current.vy;
            current.rot += (0 - current.rot) * 0.09;
            current.scale += (1 - current.scale) * 0.09;

            el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0) rotate(${current.rot.toFixed(2)}deg) scale(${current.scale.toFixed(2)})`;
          }
          charIdx++;
        });
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [mode]);

  // Handle particle simulation setup
  useEffect(() => {
    if (mode === 'particles' && canvasRef.current) {
      const canvas = canvasRef.current;
      const system = new ParticleTextSystem(
        canvas,
        'WE BUILD THINGS\nTHAT SHOULDN\'T\nEXIST YET.',
        'clamp(28px, 6vw, 84px)',
        'Syne, sans-serif'
      );
      particleSystemRef.current = system;
      system.resize(window.innerWidth, window.innerHeight);

      const handleResize = () => {
        system.resize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      let animId: number;

      const render = (time: number) => {
        const pos = cursorEngine.getPosition();
        system.updateAndDraw(pos.targetX, pos.targetY, 140, pos.vx, pos.vy, time / 1000);

        if (pos.speed > 5) {
          audioSynthesizer.playHarmonicSweep(pos.speed * 0.05);
        }

        animId = requestAnimationFrame(render);
      };
      animId = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        particleSystemRef.current = null;
      };
    }
  }, [mode]);

  const toggleMode = () => {
    const nextMode = mode === 'text' ? 'particles' : 'text';
    setMode(nextMode);
    audioSynthesizer.playTransitionImpact();
  };

  let globalCharIndex = 0;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] w-full flex flex-col justify-between px-6 md:px-16 pt-32 pb-16 overflow-hidden select-none"
      onMouseMove={(e) => {
        updateCharacterDistortion(e.clientX, e.clientY);
      }}
    >
      {/* Dual-DOM Accessibility H1 */}
      <h1 className="sr-only">WE BUILD THINGS THAT SHOULDN'T EXIST YET. — VOID/FORM</h1>

      {/* Top Telemetry & Mode Switch */}
      <div className="flex items-center justify-between border-b border-[#242834] pb-4">
        <div className="flex items-center gap-3 font-mono-tech text-[10px] tracking-widest text-[#8E929A] uppercase">
          <span className="text-[#FF3B00]">SYS.01</span>
          <span>//</span>
          <span>TEMPORARY TOPOGRAPHIES</span>
        </div>

        {/* Mode Toggle Button */}
        <button
          onClick={toggleMode}
          onMouseEnter={() => {
            cursorEngine.setState('hover', 'MUTATE');
            audioSynthesizer.playMechanicalTick(1.3);
          }}
          onMouseLeave={() => cursorEngine.resetState()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EDE8DE]/20 bg-[#0B0D12] text-xs font-mono-tech tracking-wider text-[#EDE8DE] hover:border-[#FF3B00] hover:text-[#FF3B00] transition-all duration-300"
          aria-label="Toggle between granular text and canvas particle matrix"
        >
          {mode === 'text' ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#FF3B00]" />
              <span>DISSOLVE TO DUST</span>
            </>
          ) : (
            <>
              <Type className="w-3.5 h-3.5 text-[#FF3B00]" />
              <span>RECONSTRUCT SOLID</span>
            </>
          )}
        </button>
      </div>

      {/* Main Massive Editorial Typography or Particle Canvas */}
      <div className="relative my-auto py-8 flex flex-col justify-center min-h-[50vh]">
        {mode === 'text' ? (
          <div className="flex flex-col gap-2 md:gap-4 max-w-full" aria-hidden="true">
            {heroLines.map((words, lineIdx) => (
              <div
                key={lineIdx}
                className="overflow-visible flex flex-wrap items-center leading-none"
              >
                {words.map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    className="whitespace-nowrap inline-flex mr-4 md:mr-8"
                  >
                    {word.split('').map((char, charIdx) => {
                      const currentIndex = globalCharIndex++;
                      return (
                        <span
                          key={charIdx}
                          ref={(el) => {
                            charsRef.current[currentIndex] = el;
                          }}
                          className="inline-block font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tighter text-[#EDE8DE] transition-colors duration-150 hover:text-[#FF3B00]"
                          style={{
                            willChange: 'transform',
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        )}
      </div>

      {/* Bottom Editorial Meta Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#242834]">
        <div className="flex flex-col gap-1">
          <span className="font-mono-tech text-[10px] text-[#8E929A] tracking-wider uppercase">01 / CONCEPT</span>
          <p className="font-sans-body text-xs text-[#EDE8DE]/80 max-w-xs">
            Everything is temporary. We investigate the liminal threshold where digital code collapses into physical artifact.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-mono-tech text-[10px] text-[#8E929A] tracking-wider uppercase">02 / INTERACTION</span>
          <p className="font-sans-body text-xs text-[#EDE8DE]/80 max-w-xs">
            Hover to distort character field. Toggle to dissolve glyphs into 2,000+ physics particles with Hooke's Law anchor memory.
          </p>
        </div>

        <div className="flex flex-col md:items-end justify-center">
          <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#8E929A] tracking-widest uppercase">
            <span>SCROLL TO DESCEND</span>
            <span className="text-[#FF3B00] animate-bounce">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
};
