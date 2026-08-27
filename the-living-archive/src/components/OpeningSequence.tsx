'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface OpeningSequenceProps {
  isLoaded: boolean;
  onEnter: () => void;
  objectCount: string;
}

export function OpeningSequence({ isLoaded, onEnter, objectCount }: OpeningSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLHeadingElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const [showEnterPrompt, setShowEnterPrompt] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Mouse inertia coordinates
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0 });
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Show "ENTER THE ARCHIVE" prompt after brief indexing delay
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => {
      setShowEnterPrompt(true);
    }, 2400);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Mouse physics loop on typography
  useEffect(() => {
    if (hasEntered) return;

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized from center (-1 to 1)
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current.targetX = normX;
      mouse.current.targetY = normY;
    };

    const updateLetterPhysics = () => {
      // Damped interpolation with inertia
      const dx = mouse.current.targetX - mouse.current.x;
      const dy = mouse.current.targetY - mouse.current.y;
      mouse.current.vx += dx * 0.05;
      mouse.current.vy += dy * 0.05;
      mouse.current.vx *= 0.88;
      mouse.current.vy *= 0.88;

      mouse.current.x += mouse.current.vx;
      mouse.current.y += mouse.current.vy;

      // Distance from center: center compresses, edges expand
      const distFromCenter = Math.hypot(mouse.current.x, mouse.current.y);
      const letterSpread = gsap.utils.mapRange(0, 1.4, -0.05, 0.12, distFromCenter);

      lettersRef.current.forEach((span, idx) => {
        if (!span || isExiting) return;
        const total = lettersRef.current.length;
        const offsetFromMid = idx - (total - 1) / 2;
        const letterX = offsetFromMid * letterSpread * 80 + (mouse.current.vx * 30);
        const letterRotY = mouse.current.x * 12;
        const letterSkewX = mouse.current.vx * -10;

        span.style.transform = `translate3d(${letterX}px, ${mouse.current.y * 15}px, 0) rotateY(${letterRotY}deg) skewX(${letterSkewX}deg)`;
      });

      animId = requestAnimationFrame(updateLetterPhysics);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(updateLetterPhysics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [hasEntered, isExiting]);

  const triggerEntrance = useCallback(() => {
    if (isExiting || hasEntered) return;
    setIsExiting(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setHasEntered(true);
        onEnter();
      },
    });

    // 1. Enter button dissolves
    if (enterBtnRef.current) {
      tl.to(enterBtnRef.current, { opacity: 0, scale: 0.9, duration: 0.4, ease: 'power2.in' });
    }

    // 2. Letters split apart dramatically into 3D space
    lettersRef.current.forEach((span, i) => {
      if (!span) return;
      const isLeft = i < 3;
      const xDistance = isLeft ? -window.innerWidth * 0.9 : window.innerWidth * 0.9;
      const zDistance = 600;
      const rotZ = (i - 3) * 15;

      tl.to(
        span,
        {
          x: xDistance,
          z: zDistance,
          rotateZ: rotZ,
          opacity: 0,
          duration: 1.6,
          ease: 'power3.inOut',
        },
        0.1
      );
    });

    // 3. Subtitle falls away
    tl.to(
      '#hero-subtitle',
      {
        y: 80,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
      },
      0.2
    );

    // 4. Background curtain reveals the spatial 3D archive
    if (containerRef.current) {
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 1.0,
          ease: 'power2.inOut',
        },
        0.8
      );
    }
  }, [isExiting, hasEntered, onEnter]);

  // Handle Enter keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !hasEntered) {
        triggerEntrance();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEntered, triggerEntrance]);

  if (hasEntered) return null;

  const titleText = 'ARCHIVE';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0b] select-none pointer-events-auto"
      style={{ perspective: '1200px' }}
    >
      {/* Editorial Accession Stamp */}
      <div className="absolute top-8 left-8 text-[11px] tracking-[0.35em] text-[#6b6b6b] uppercase font-mono">
        THE LIVING ARCHIVE // FOUNDATION 1974
      </div>

      <div className="absolute top-8 right-8 text-[11px] tracking-[0.35em] text-[#6b6b6b] uppercase font-mono">
        SYSTEM: ONLINE
      </div>

      {/* Monumental Kinetic Door Typography */}
      <h1
        ref={titleContainerRef}
        className="hero-title text-center text-[#e5e9ec] tracking-tighter flex items-center justify-center overflow-visible"
        aria-label="ARCHIVE"
        style={{
          transformStyle: 'preserve-3d',
          fontSize: 'clamp(4.5rem, 18vw, 15rem)',
          fontWeight: 900,
          lineHeight: 0.85,
        }}
      >
        {titleText.split('').map((char, index) => (
          <span
            key={index}
            ref={(el) => {
              lettersRef.current[index] = el;
            }}
            className="inline-block transition-transform duration-75 will-change-transform"
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </h1>

      {/* Index Counter */}
      <p
        id="hero-subtitle"
        className="hero-subtitle mt-8 font-mono text-[12px] md:text-sm tracking-[0.35em] uppercase text-[#787d85]"
      >
        {objectCount} OBJECTS INDEXED
      </p>

      {/* Door Passage Interaction */}
      <div className="h-16 mt-8 flex items-center justify-center">
        {showEnterPrompt && (
          <button
            ref={enterBtnRef}
            onClick={triggerEntrance}
            className="group relative px-8 py-3.5 border border-[#333740] hover:border-[#c86432] text-[#e5e9ec] hover:text-[#c86432] text-xs font-mono tracking-[0.35em] uppercase transition-all duration-300 backdrop-blur-sm cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>ENTER THE ARCHIVE</span>
              <span className="w-1.5 h-1.5 bg-[#c86432] rounded-full animate-ping" />
            </span>
            <div className="absolute inset-0 bg-[#c86432]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        )}
      </div>

      {/* Bottom Telemetry */}
      <div className="absolute bottom-8 text-[10px] tracking-[0.4em] text-[#555a64] uppercase font-mono">
        PRESS ENTER OR CLICK TO PENETRATE THE ARCHIVE
      </div>
    </div>
  );
}
