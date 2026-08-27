import React, { useEffect, useRef, useState } from 'react';
import { FluidDistortionPlane } from '../webgl/fluid-distortion-plane';
import { cursorEngine } from '../core/cursor-engine';
import { audioSynthesizer } from '../core/audio-synthesizer';

export const DistortionGallerySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHolderRef = useRef<HTMLDivElement>(null);
  const distortionPlaneRef = useRef<FluidDistortionPlane | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=85',
      title: 'PHOTONIC LATENCY',
      meta: 'MONOLITH NO. 04 / 35MM VOLUMETRIC CAPTURE',
    },
    {
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1920&q=85',
      title: 'SYNTHETIC EPIDERMIS',
      meta: 'BIOLOGICAL ELASTOMER / HAPTIC SENSOR ARRAY',
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
      title: 'NON-EUCLIDEAN FORM',
      meta: 'ARCHITECTURAL VOID / SPECULATIVE TOPOLOGY',
    },
  ];

  useEffect(() => {
    if (!canvasHolderRef.current) return;

    const plane = new FluidDistortionPlane(canvasHolderRef.current, galleryImages[0].url);
    distortionPlaneRef.current = plane;

    let animId: number;
    let startTime = performance.now();

    const tick = (currentTime: number) => {
      const time = (currentTime - startTime) / 1000;
      const pos = cursorEngine.getPosition();

      if (canvasHolderRef.current) {
        const rect = canvasHolderRef.current.getBoundingClientRect();
        if (pos.x >= rect.left && pos.x <= rect.right && pos.y >= rect.top && pos.y <= rect.bottom) {
          const normX = (pos.x - rect.left) / rect.width;
          const normY = (pos.y - rect.top) / rect.height;
          plane.onMouseMove(normX, normY);

          if (pos.speed > 8) {
            audioSynthesizer.playHarmonicSweep(pos.speed * 0.08);
          }
        }
      }

      plane.update(time, 0.016);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (canvasHolderRef.current) {
        plane.resize(canvasHolderRef.current.clientWidth, canvasHolderRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      plane.destroy();
      distortionPlaneRef.current = null;
    };
  }, []);

  const switchImage = (index: number) => {
    setActiveImageIndex(index);
    if (distortionPlaneRef.current) {
      distortionPlaneRef.current.setImageUrl(galleryImages[index].url);
      audioSynthesizer.playTransitionImpact();
    }
  };

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="relative min-h-[100svh] w-full bg-[#060709] flex flex-col justify-between p-6 md:p-16 select-none overflow-hidden"
      onMouseEnter={() => cursorEngine.setState('drag', 'FLUID')}
      onMouseLeave={() => cursorEngine.resetState()}
    >
      {/* Fullscreen GLSL Shader Canvas */}
      <div
        ref={canvasHolderRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 font-mono-tech text-[10px] tracking-widest text-[#FF3B00] uppercase">
          <span>03</span>
          <span>//</span>
          <span>FLUID GLSL DISTORTION</span>
        </div>

        {/* Curation Image Tabs */}
        <div className="pointer-events-auto flex items-center gap-2">
          {galleryImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => switchImage(idx)}
              onMouseEnter={() => {
                cursorEngine.setState('hover', `0${idx + 1}`);
                audioSynthesizer.playMechanicalTick(1.2);
              }}
              onMouseLeave={() => cursorEngine.setState('drag', 'FLUID')}
              className={`px-3 py-1 rounded-full font-mono-tech text-[10px] transition-all duration-300 ${
                activeImageIndex === idx
                  ? 'bg-[#FF3B00] text-black font-bold'
                  : 'bg-[#060709]/80 border border-[#EDE8DE]/20 text-[#EDE8DE] hover:border-[#FF3B00]'
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Editorial Caption */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-none">
        <div className="max-w-md">
          <span className="font-mono-tech text-[10px] tracking-widest text-[#8E929A] uppercase block mb-1">
            {galleryImages[activeImageIndex].meta}
          </span>
          <h3 className="font-display font-black text-3xl md:text-5xl text-[#EDE8DE] tracking-tight">
            {galleryImages[activeImageIndex].title}
          </h3>
        </div>

        <div className="font-mono-tech text-[10px] text-[#8E929A] text-left md:text-right max-w-xs">
          <p className="text-[#EDE8DE]">VELOCITY-DRIVEN DISPLACEMENT</p>
          <p>4-OCTAVE FRACTIONAL BROWNIAN MOTION</p>
          <p className="text-[#FF3B00]">RGB CHROMATIC ABERRATION SPLIT</p>
        </div>
      </div>
    </section>
  );
};
