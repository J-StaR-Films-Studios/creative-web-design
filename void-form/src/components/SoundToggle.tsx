import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioSynthesizer } from '../core/audio-synthesizer';
import { cursorEngine } from '../core/cursor-engine';

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(() => audioSynthesizer.getIsMuted());

  const handleToggle = () => {
    const unmuted = audioSynthesizer.toggleMute();
    setIsMuted(!unmuted);
    if (unmuted) {
      audioSynthesizer.playMechanicalTick(1.4);
    }
  };

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={() => {
        cursorEngine.setState('hover', 'SOUND');
        audioSynthesizer.playMechanicalTick(1.2);
      }}
      onMouseLeave={() => cursorEngine.resetState()}
      className="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#EDE8DE]/20 bg-[#060709]/80 backdrop-blur-md transition-all duration-300 hover:border-[#FF3B00] hover:bg-[#12141a]"
      aria-label={isMuted ? 'Enable procedural audio experience' : 'Mute audio experience'}
    >
      <div className="flex items-center gap-0.5 h-3">
        {/* Animated acoustic frequency bars when unmuted */}
        <span
          className={`w-0.5 bg-[#FF3B00] rounded-full transition-all duration-300 ${
            !isMuted ? 'h-3 animate-pulse' : 'h-1 bg-[#8E929A]'
          }`}
        />
        <span
          className={`w-0.5 bg-[#FF3B00] rounded-full transition-all duration-300 ${
            !isMuted ? 'h-2 animate-bounce' : 'h-1.5 bg-[#8E929A]'
          }`}
          style={{ animationDelay: '150ms' }}
        />
        <span
          className={`w-0.5 bg-[#FF3B00] rounded-full transition-all duration-300 ${
            !isMuted ? 'h-3.5 animate-pulse' : 'h-1 bg-[#8E929A]'
          }`}
          style={{ animationDelay: '300ms' }}
        />
      </div>

      <span className="font-mono-tech text-[10px] tracking-wider uppercase text-[#EDE8DE] group-hover:text-[#FF3B00] transition-colors">
        {isMuted ? 'SOUND / OFF' : 'SOUND / ACTIVE'}
      </span>

      {isMuted ? (
        <VolumeX className="w-3 h-3 text-[#8E929A] group-hover:text-[#FF3B00] transition-colors" />
      ) : (
        <Volume2 className="w-3 h-3 text-[#FF3B00] transition-colors" />
      )}
    </button>
  );
};
