import React, { useState } from 'react';
import { MANIFESTO_ITEMS } from '../data/manifesto';
import { cursorEngine } from '../core/cursor-engine';
import { audioSynthesizer } from '../core/audio-synthesizer';

export const ManifestoSection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [inverted, setInverted] = useState(false);
  const [usefulOffset, setUsefulOffset] = useState({ x: 0, y: 0, skew: 0 });
  const [matterWave, setMatterWave] = useState(0);

  const handleMouseEnter = (id: string, type: string) => {
    setActiveItem(id);
    audioSynthesizer.playMechanicalTick(1.4);

    if (type === 'dissolve') {
      cursorEngine.setState('hover', 'DISSOLVE');
    } else if (type === 'stretch') {
      cursorEngine.setState('hover', 'STRETCH');
    } else if (type === 'invert') {
      cursorEngine.setState('hover', 'INVERT');
      setInverted(true);
    } else if (type === 'shear') {
      cursorEngine.setState('hover', 'SHEAR');
    }
  };

  const handleMouseLeave = (type: string) => {
    setActiveItem(null);
    cursorEngine.resetState();
    if (type === 'invert') {
      setInverted(false);
    }
    if (type === 'stretch') {
      setUsefulOffset({ x: 0, y: 0, skew: 0 });
    }
  };

  const handleMouseMoveUseful = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) * 0.4;
    const relY = (e.clientY - (rect.top + rect.height / 2)) * 0.4;
    const skew = (relX / rect.width) * 35;
    setUsefulOffset({ x: relX, y: relY, skew });
  };

  const handleMouseMoveMatter = (_e: React.MouseEvent<HTMLDivElement>) => {
    const speed = cursorEngine.speed;
    setMatterWave(speed * 0.8);
    if (speed > 10) {
      audioSynthesizer.playHarmonicSweep(speed * 0.08);
    }
  };

  return (
    <section
      id="manifesto"
      className={`relative min-h-screen w-full px-6 md:px-16 py-32 select-none transition-colors duration-500 ${
        inverted ? 'bg-[#EDE8DE] text-[#060709]' : 'bg-[#060709] text-[#EDE8DE]'
      }`}
    >
      {/* Eyebrow */}
      <div className={`flex items-center justify-between border-b pb-6 mb-20 ${
        inverted ? 'border-[#060709]/30' : 'border-[#242834]'
      }`}>
        <div className="flex items-center gap-3 font-mono-tech text-xs tracking-widest text-[#FF3B00] uppercase">
          <span>05</span>
          <span>//</span>
          <span>INTERACTIVE MANIFESTO</span>
        </div>
        <span className={`font-mono-tech text-xs ${inverted ? 'text-[#060709]/70' : 'text-[#8E929A]'}`}>
          04 ACTIVE AXIOMS
        </span>
      </div>

      {/* 4 Statement Modules */}
      <div className="space-y-20 max-w-6xl mx-auto">
        {/* 1. MAKE IT STRANGE */}
        <div
          onMouseEnter={() => handleMouseEnter('strange', 'dissolve')}
          onMouseLeave={() => handleMouseLeave('dissolve')}
          className="group relative border-b border-[#242834]/60 pb-16"
        >
          <div className="flex items-center gap-3 font-mono-tech text-xs text-[#FF3B00] mb-3">
            <span>AXIOM 01</span>
            <span>/</span>
            <span>PARTICLE DUST DISSOLUTION</span>
          </div>
          <h3
            className={`font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight transition-all duration-700 ${
              activeItem === 'strange'
                ? 'opacity-30 blur-sm scale-105 tracking-widest text-[#FF3B00]'
                : ''
            }`}
          >
            MAKE IT STRANGE.
          </h3>
          <p className={`font-sans-body text-sm md:text-base mt-4 max-w-xl ${
            inverted ? 'text-[#060709]/80' : 'text-[#8E929A]'
          }`}>
            {MANIFESTO_ITEMS[0].subtext}
          </p>
        </div>

        {/* 2. MAKE IT USEFUL */}
        <div
          onMouseEnter={() => handleMouseEnter('useful', 'stretch')}
          onMouseLeave={() => handleMouseLeave('stretch')}
          onMouseMove={handleMouseMoveUseful}
          className="group relative border-b border-[#242834]/60 pb-16"
        >
          <div className="flex items-center gap-3 font-mono-tech text-xs text-[#FF3B00] mb-3">
            <span>AXIOM 02</span>
            <span>/</span>
            <span>ELASTIC KINETIC TENSION</span>
          </div>
          <div
            style={{
              transform: `translate3d(${usefulOffset.x}px, ${usefulOffset.y}px, 0) skewX(${usefulOffset.skew}deg)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            <h3 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#EDE8DE] group-hover:text-[#FF3B00]">
              MAKE IT USEFUL.
            </h3>
          </div>
          <p className={`font-sans-body text-sm md:text-base mt-4 max-w-xl ${
            inverted ? 'text-[#060709]/80' : 'text-[#8E929A]'
          }`}>
            {MANIFESTO_ITEMS[1].subtext}
          </p>
        </div>

        {/* 3. MAKE IT MOVE */}
        <div
          onMouseEnter={() => handleMouseEnter('move', 'invert')}
          onMouseLeave={() => handleMouseLeave('invert')}
          className="group relative border-b border-[#242834]/60 pb-16"
        >
          <div className="flex items-center gap-3 font-mono-tech text-xs text-[#FF3B00] mb-3">
            <span>AXIOM 03</span>
            <span>/</span>
            <span>PHOTONIC INVERSION & GLITCH</span>
          </div>
          <h3 className={`font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight ${
            inverted ? 'text-[#060709]' : 'text-[#EDE8DE]'
          }`}>
            MAKE IT MOVE.
          </h3>
          <p className={`font-sans-body text-sm md:text-base mt-4 max-w-xl ${
            inverted ? 'text-[#060709]/80' : 'text-[#8E929A]'
          }`}>
            {MANIFESTO_ITEMS[2].subtext}
          </p>
        </div>

        {/* 4. MAKE IT MATTER */}
        <div
          onMouseEnter={() => handleMouseEnter('matter', 'shear')}
          onMouseLeave={() => handleMouseLeave('shear')}
          onMouseMove={handleMouseMoveMatter}
          className="group relative border-b border-[#242834]/60 pb-16"
        >
          <div className="flex items-center gap-3 font-mono-tech text-xs text-[#FF3B00] mb-3">
            <span>AXIOM 04</span>
            <span>/</span>
            <span>VELOCITY FLUID SHEAR WAVE</span>
          </div>
          <h3
            className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#EDE8DE] group-hover:text-[#FF3B00] transition-colors"
            style={{
              transform: `scaleY(${1 + Math.min(matterWave * 0.02, 0.5)}) skewY(${Math.min(matterWave * 0.2, 12)}deg)`,
              transition: 'transform 0.08s ease-out',
            }}
          >
            MAKE IT MATTER.
          </h3>
          <p className={`font-sans-body text-sm md:text-base mt-4 max-w-xl ${
            inverted ? 'text-[#060709]/80' : 'text-[#8E929A]'
          }`}>
            {MANIFESTO_ITEMS[3].subtext}
          </p>
        </div>
      </div>
    </section>
  );
};
