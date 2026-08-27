'use client';

import { useEffect, useState } from 'react';
import { globalAudio } from '@/lib/audio-engine';

export function AudioControls() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const unsubscribe = globalAudio.onStateChange((state) => {
      setIsEnabled(state);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    globalAudio.toggle();
  };

  return (
    <button
      onClick={handleToggle}
      className="group flex items-center gap-2.5 px-3 py-1.5 arch-panel text-[11px] font-mono tracking-[0.25em] uppercase text-[#a0a6b4] hover:text-[#c86432] transition-all cursor-pointer"
      aria-label={isEnabled ? 'Mute procedural audio' : 'Enable procedural audio'}
    >
      <div className="flex items-end gap-[3px] h-3.5 w-3.5" aria-hidden="true">
        <span
          className={`w-[2px] bg-current transition-all duration-300 ${
            isEnabled ? 'h-3.5 animate-pulse' : 'h-1.5 opacity-40'
          }`}
        />
        <span
          className={`w-[2px] bg-current transition-all duration-300 ${
            isEnabled ? 'h-2.5 animate-bounce' : 'h-1.5 opacity-40'
          }`}
        />
        <span
          className={`w-[2px] bg-current transition-all duration-300 ${
            isEnabled ? 'h-3 animate-pulse delay-75' : 'h-1.5 opacity-40'
          }`}
        />
      </div>
      <span>{isEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
    </button>
  );
}
