import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { audioSynthesizer } from '../core/audio-synthesizer';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [flashingImage, setFlashingImage] = useState<string | null>(null);

  const sampleImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=70',
  ];

  useEffect(() => {
    // 1. Ambient Particle Genesis Canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let animId: number;
    const renderParticles = () => {
      ctx.fillStyle = 'rgba(6, 7, 9, 0.2)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = '#EDE8DE';
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animId = requestAnimationFrame(renderParticles);
    };
    renderParticles();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 2. Real Telemetry Loading Progress
    const tl = gsap.timeline({
      onComplete: () => {
        audioSynthesizer.playTransitionImpact();
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.05,
          filter: 'blur(12px)',
          duration: 1.1,
          ease: 'power3.inOut',
          onComplete: () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
            onComplete();
          },
        });
      },
    });

    const progressObj = { value: 0 };
    tl.to(progressObj, {
      value: 100,
      duration: 2.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.floor(progressObj.value);
        setProgress(val);

        // Intermittent flash of project fragments at specific progress intervals
        if (val === 28) setFlashingImage(sampleImages[0]);
        else if (val === 33) setFlashingImage(null);
        else if (val === 62) setFlashingImage(sampleImages[1]);
        else if (val === 67) setFlashingImage(null);
        else if (val === 84) setFlashingImage(sampleImages[2]);
        else if (val === 89) setFlashingImage(null);
      },
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      tl.kill();
    };
  }, [onComplete]);

  const letters = 'VOID/FORM'.split('');

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#060709] select-none pointer-events-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Brief imagery flash fragment */}
      {flashingImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-screen transition-opacity duration-150 filter grayscale contrast-150"
          style={{ backgroundImage: `url(${flashingImage})` }}
        />
      )}

      {/* Center Studio Title with Independent Moving Letters */}
      <div className="relative z-10 flex items-center mb-8">
        {letters.map((char, index) => {
          // Independent subtle floating animation
          const delay = index * 0.12;
          return (
            <span
              key={index}
              className="inline-block font-display font-black text-4xl md:text-6xl tracking-tight text-[#EDE8DE] animate-pulse"
              style={{
                animationDuration: `${2.5 + (index % 3) * 0.6}s`,
                animationDelay: `${delay}s`,
                transform: `translateY(${Math.sin(index + progress * 0.05) * 4}px)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Telemetry Progress Readout */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 font-mono-tech text-xs tracking-widest text-[#8E929A]">
          <span>INIT</span>
          <span className="text-[#FF3B00]">[{String(progress).padStart(3, '0')}%]</span>
          <span>COMPUTATION</span>
        </div>

        <div className="w-48 h-[2px] bg-[#1a1d26] rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-[#FF3B00] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="font-mono-tech text-[9px] tracking-wider text-[#8E929A]/60 mt-3 uppercase">
          “Everything is temporary.”
        </p>
      </div>
    </div>
  );
};
