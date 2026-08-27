import React, { useState } from 'react';
import { cursorEngine } from '../core/cursor-engine';
import { audioSynthesizer } from '../core/audio-synthesizer';
import { Mail, Check, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const words = ["LET'S", "MAKE", "SOMETHING."];
  const email = 'HELLO@VOIDFORM.STUDIO';

  const handleCopy = () => {
    audioSynthesizer.playMechanicalTick(1.8);
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  let globalCharIndex = 0;

  return (
    <section
      id="contact"
      className="relative min-h-[100svh] w-full bg-[#060709] px-6 md:px-16 py-32 flex flex-col justify-between select-none"
    >
      {/* Top Eyebrow */}
      <div className="flex items-center justify-between border-b border-[#242834] pb-6">
        <div className="flex items-center gap-3 font-mono-tech text-xs tracking-widest text-[#FF3B00] uppercase">
          <span>07</span>
          <span>//</span>
          <span>RESOLUTION</span>
        </div>
        <span className="font-mono-tech text-xs text-[#8E929A]">TRANSIENT CONTACT</span>
      </div>

      {/* Main Quiet Typography Container with Letter Separation Physics */}
      <div className="my-auto flex flex-col items-center justify-center text-center space-y-12">
        <div
          onMouseEnter={() => {
            setIsHovered(true);
            cursorEngine.setState('send', 'SEND');
            audioSynthesizer.playMechanicalTick(1.4);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            cursorEngine.resetState();
          }}
          className="group cursor-pointer py-8"
        >
          {/* Main Statement with Word-Preserving Letter Separation */}
          <div className="flex flex-wrap justify-center items-center overflow-visible leading-none">
            {words.map((word, wordIdx) => (
              <span
                key={wordIdx}
                className="whitespace-nowrap inline-flex mr-4 md:mr-8 my-2"
              >
                {word.split('').map((char, charIdx) => {
                  const currentIndex = globalCharIndex++;
                  return (
                    <span
                      key={charIdx}
                      className="inline-block font-display font-black text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight text-[#EDE8DE] group-hover:text-[#FF3B00] transition-all duration-500 ease-out"
                      style={{
                        transform: isHovered
                          ? `translateY(${Math.sin(currentIndex * 0.8) * 12}px) rotate(${Math.sin(currentIndex) * 6}deg)`
                          : 'translateY(0px) rotate(0deg)',
                        marginRight: isHovered ? '0.08em' : '0.01em',
                        willChange: 'transform, margin',
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            ))}
          </div>

          {/* Email Reveal */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <a
              href={`mailto:${email}`}
              onClick={handleCopy}
              onMouseEnter={() => cursorEngine.setState('send', 'SEND')}
              onMouseLeave={() => cursorEngine.resetState()}
              className="inline-flex items-center gap-3 font-mono-tech text-lg sm:text-2xl md:text-3xl text-[#EDE8DE] hover:text-[#FF3B00] transition-colors border-b border-[#FF3B00] pb-2"
            >
              <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#FF3B00]" />
              <span>{email}</span>
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-[#8E929A] group-hover:text-[#FF3B00] transition-colors" />
            </a>

            {copied && (
              <span className="inline-flex items-center gap-1.5 font-mono-tech text-xs text-[#FF3B00] animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>COPIED TO CLIPBOARD</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#242834] font-mono-tech text-[10px] text-[#8E929A] uppercase tracking-widest">
        <span>© 2026 VOID/FORM STUDIO. ALL CODE IS TEMPORARY.</span>
        <span>ENGINEERED FOR AESTHETIC & SPATIAL PERFECTION</span>
      </div>
    </section>
  );
};
