'use client';

import { useEffect, useState } from 'react';
import { RoomId } from '@/lib/types';
import { globalAudio } from '@/lib/audio-engine';

interface ArchiveIndexProps {
  isActive: boolean;
  onToggle: () => void;
  onSelectCategory: (roomId: RoomId) => void;
}

interface CategoryItem {
  name: string;
  roomId: RoomId;
  accessionCount: string;
  descriptor: string;
}

const CATEGORIES: CategoryItem[] = [
  { name: 'IMAGE', roomId: 'image', accessionCount: '482,109', descriptor: 'SILVER GELATIN & MONOLITHIC PLANES' },
  { name: 'SOUND', roomId: 'sound', accessionCount: '194,820', descriptor: 'ACOUSTIC GEOMETRIES & HARMONICS' },
  { name: 'TYPE', roomId: 'typography', accessionCount: '318,042', descriptor: 'ARCHITECTURAL LETTERFORMS & SPECIMENS' },
  { name: 'OBJECT', roomId: 'objects', accessionCount: '241,500', descriptor: 'TACTILE ARTIFACTS & INDUSTRIAL INSTRUMENTS' },
  { name: 'FILM', roomId: 'film', accessionCount: '185,910', descriptor: '35MM CELLULOID & TEMPORAL DISSECTION' },
  { name: 'DIGITAL', roomId: 'digital', accessionCount: '424,912', descriptor: 'BITMAPPED RESOURCE FORKS & SILICON ARCHAEOLOGY' },
];

export function ArchiveIndex({ isActive, onToggle, onSelectCategory }: ArchiveIndexProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        onToggle();
      } else if ((e.key === 'i' || e.key === 'I') && !isActive) {
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onToggle]);

  const handleHover = (index: number | null) => {
    setHoveredIndex(index);
    if (index !== null) {
      globalAudio.playTick(2600, 0.015, 0.04);
    }
  };

  const handleCategoryClick = (roomId: RoomId) => {
    globalAudio.playHarmonicChime(600);
    onSelectCategory(roomId);
    onToggle();
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0a0a0b]/98 backdrop-blur-2xl transition-all duration-700 flex flex-col justify-between p-8 md:p-16 ${
        isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Editorial Header */}
      <div className="flex justify-between items-start border-b border-[#20232b] pb-6">
        <div>
          <h2 className="text-xs font-mono tracking-[0.4em] text-[#c86432] uppercase">
            MASTER CLASSIFICATION INDEX
          </h2>
          <p className="text-[11px] font-mono text-[#6b6b6b] tracking-[0.25em] uppercase mt-1">
            ALL PHYSICAL AND DIGITAL STRATA ACROSS 6 SECTORS
          </p>
        </div>
        <button
          onClick={onToggle}
          className="text-xs font-mono tracking-[0.3em] uppercase text-[#8c93a0] hover:text-[#c86432] transition-colors cursor-pointer"
        >
          [ ESC / RESUME ]
        </button>
      </div>

      {/* Monumental Typographic Categories */}
      <nav className="my-auto flex flex-col gap-2 md:gap-3">
        {CATEGORIES.map((cat, idx) => {
          const isHovered = hoveredIndex === idx;
          const isOtherHovered = hoveredIndex !== null && hoveredIndex !== idx;

          return (
            <div
              key={cat.name}
              onMouseEnter={() => handleHover(idx)}
              onMouseLeave={() => handleHover(null)}
              onClick={() => handleCategoryClick(cat.roomId)}
              className="group flex items-baseline justify-between py-1 md:py-2 border-b border-[#181a20] hover:border-[#c86432] transition-all duration-300 cursor-pointer"
              style={{
                opacity: isOtherHovered ? 0.25 : 1.0,
                transform: isHovered ? 'translateX(18px)' : 'translateX(0)',
              }}
            >
              <div className="flex items-baseline gap-6 md:gap-12">
                <span className="text-xs md:text-sm font-mono text-[#787d85] group-hover:text-[#c86432] transition-colors">
                  0{idx + 1}
                </span>
                <span
                  className="text-4xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-[#e5e9ec] group-hover:text-[#c86432] transition-colors duration-200"
                  style={{
                    letterSpacing: isHovered ? '0.02em' : '-0.03em',
                  }}
                >
                  {cat.name}
                </span>
              </div>

              <div className="hidden lg:flex flex-col items-end text-right font-mono">
                <span className="text-xs text-[#c86432] tracking-widest">
                  {cat.accessionCount} ARTIFACTS
                </span>
                <span className="text-[10px] text-[#6b6b6b] tracking-[0.2em] uppercase mt-0.5">
                  {cat.descriptor}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Editorial Footer Telemetry */}
      <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.3em] text-[#555a64] uppercase border-t border-[#181a20] pt-6">
        <span>SECTOR SELECTOR: DIRECT PHYSICAL JUMP</span>
        <span>INDEX ACCESSIBILITY: KEYBOARD [I]</span>
      </div>
    </div>
  );
}
