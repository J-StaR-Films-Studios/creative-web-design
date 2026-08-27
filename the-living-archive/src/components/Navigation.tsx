'use client';

import { AudioControls } from './AudioControls';
import { RoomId } from '@/lib/types';

interface NavigationProps {
  onIndexToggle: () => void;
  onSearchToggle: () => void;
  onDestructionTrigger: () => void;
  activeRoom: RoomId;
  scrollProgress: number;
}

export function Navigation({
  onIndexToggle,
  onSearchToggle,
  onDestructionTrigger,
  activeRoom,
  scrollProgress,
}: NavigationProps) {
  const roomLabels: Record<RoomId, string> = {
    image: '01 // IMAGE',
    sound: '02 // SOUND',
    typography: '03 // TYPE',
    objects: '04 // OBJECT',
    film: '05 // FILM',
    digital: '06 // DIGITAL',
    finale: '07 // VOID',
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 p-4 md:p-6 flex flex-col gap-2 pointer-events-none select-none">
      <div className="flex justify-between items-center w-full">
        {/* Brand & Active Sector Indicator */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="arch-panel px-3.5 py-1.5 text-[11px] font-mono tracking-[0.3em] uppercase text-[#e5e9ec] font-bold">
            THE LIVING ARCHIVE
          </div>
          <div className="hidden sm:flex items-center gap-2 arch-panel px-3.5 py-1.5 font-mono text-[10px] tracking-[0.25em] text-[#a0a6b4]">
            <span className="opacity-60">SECTOR:</span>
            <span className="text-[#c86432] font-semibold">{roomLabels[activeRoom]}</span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <AudioControls />

          <button
            onClick={onSearchToggle}
            className="arch-panel px-3.5 py-1.5 text-[11px] font-mono tracking-[0.25em] uppercase text-[#a0a6b4] hover:text-[#c86432] transition-colors cursor-pointer"
            aria-label="Open search query overlay"
          >
            SEARCH <span className="text-[#c86432] hidden md:inline">[/]</span>
          </button>

          <button
            onClick={onIndexToggle}
            className="arch-panel px-3.5 py-1.5 text-[11px] font-mono tracking-[0.25em] uppercase text-[#a0a6b4] hover:text-[#c86432] transition-colors cursor-pointer"
            aria-label="Open master classification index"
          >
            INDEX <span className="text-[#c86432] hidden md:inline">[I]</span>
          </button>

          <button
            onClick={onDestructionTrigger}
            className="hidden lg:block arch-panel px-3 py-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-[#8890a0] hover:text-red-400 hover:border-red-500/50 transition-colors cursor-pointer"
            title="Trigger architectural collapse and elastic memory reconstruction"
          >
            COLLAPSE
          </button>
        </div>
      </div>

      {/* Thin Architectural Linear Progress Track */}
      <div className="w-full h-[1px] bg-white/10 mt-1 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#c86432] transition-all duration-75"
          style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
        />
      </div>
    </header>
  );
}
