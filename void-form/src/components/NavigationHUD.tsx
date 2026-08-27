import React, { useEffect, useState } from 'react';
import { SoundToggle } from './SoundToggle';
import { cursorEngine } from '../core/cursor-engine';
import { audioSynthesizer } from '../core/audio-synthesizer';

interface NavigationHUDProps {
  onNavigate: (sectionId: string) => void;
}

export const NavigationHUD: React.FC<NavigationHUDProps> = ({ onNavigate }) => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollPercent(Math.round((window.scrollY / total) * 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'GENESIS' },
    { id: 'void', label: 'THE VOID' },
    { id: 'gallery', label: 'FLUID' },
    { id: 'projects', label: 'ARCHIVE' },
    { id: 'manifesto', label: 'MANIFESTO' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 flex items-center justify-between pointer-events-none">
      {/* Left: Studio Identity */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <button
          onClick={() => onNavigate('hero')}
          onMouseEnter={() => {
            cursorEngine.setState('hover', 'VOID');
            audioSynthesizer.playMechanicalTick(1.5);
          }}
          onMouseLeave={() => cursorEngine.resetState()}
          className="group text-left"
        >
          <span className="font-display font-black text-xl tracking-tighter text-[#EDE8DE] group-hover:text-[#FF3B00] transition-colors">
            VOID/FORM
          </span>
          <span className="block font-mono-tech text-[9px] tracking-widest text-[#8E929A] uppercase">
            CREATIVE TECH / 2026
          </span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#242834] bg-[#060709]/60 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B00] animate-pulse" />
          <span className="font-mono-tech text-[9px] text-[#8E929A] uppercase tracking-wider">
            POS: {String(scrollPercent).padStart(2, '0')}%
          </span>
        </div>
      </div>

      {/* Center: Monospace Nav Links (Desktop) */}
      <nav className="hidden lg:flex items-center gap-8 pointer-events-auto px-6 py-2 rounded-full border border-[#EDE8DE]/10 bg-[#060709]/80 backdrop-blur-md">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            onMouseEnter={() => {
              cursorEngine.setState('hover', 'JUMP');
              audioSynthesizer.playMechanicalTick(1.1);
            }}
            onMouseLeave={() => cursorEngine.resetState()}
            className="group relative font-mono-tech text-[10px] tracking-widest text-[#8E929A] hover:text-[#EDE8DE] uppercase transition-colors"
          >
            <span className="text-[#FF3B00] opacity-0 group-hover:opacity-100 transition-opacity mr-1">/</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right: Audio Control */}
      <div className="pointer-events-auto flex items-center gap-4">
        <SoundToggle />
      </div>
    </header>
  );
};
