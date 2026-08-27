import React, { useEffect, useRef, useState } from 'react';
import type { Project } from '../data/projects';
import { cursorEngine } from '../core/cursor-engine';
import { audioSynthesizer } from '../core/audio-synthesizer';
import { SoundToggle } from './SoundToggle';
import { X, ExternalLink, Cpu, Layers, Activity, Palette, Sparkles, Image as ImageIcon } from 'lucide-react';
import { gsap } from 'gsap';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!project) return;

    setActiveImageIndex(0);
    setIsSimulating(false);
    audioSynthesizer.playTransitionImpact();

    // GSAP Spatial expansion transition
    if (modalRef.current && contentRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, delay: 0.1, ease: 'power3.out' }
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project]);

  const handleClose = () => {
    audioSynthesizer.playMechanicalTick(1.6);
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!project) return null;

  const currentImageUrl = project.gallery?.[activeImageIndex] || project.image;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-[500] bg-[#060709]/98 backdrop-blur-3xl overflow-y-auto select-none"
    >
      {/* Sticky Header with prominent Return Button and Sound Control */}
      <div className="sticky top-0 z-50 px-6 md:px-16 py-5 flex items-center justify-between bg-[#060709]/90 backdrop-blur-md border-b border-[#242834]">
        <div className="flex items-center gap-4 font-mono-tech text-xs tracking-widest text-[#8E929A]">
          <span className="text-[#FF3B00] font-bold">PROJECT / {project.number}</span>
          <span>//</span>
          <span>{project.title}</span>
          <span className="hidden sm:inline text-[#242834]">|</span>
          <span className="hidden sm:inline">{project.year}</span>
        </div>

        <div className="flex items-center gap-4">
          <SoundToggle />

          <button
            onClick={handleClose}
            onMouseEnter={() => {
              cursorEngine.setState('hover', 'CLOSE');
              audioSynthesizer.playMechanicalTick(1.3);
            }}
            onMouseLeave={() => cursorEngine.resetState()}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#EDE8DE]/30 bg-[#12141a] text-xs font-mono-tech text-[#EDE8DE] hover:border-[#FF3B00] hover:text-[#FF3B00] hover:bg-[#1a1d26] transition-all duration-200"
            aria-label="Close project modal (ESC)"
          >
            <span>RETURN TO VOID</span>
            <X className="w-4 h-4 text-[#FF3B00]" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Content Container */}
      <div ref={contentRef} className="max-w-6xl mx-auto px-6 md:px-16 py-12 space-y-16">
        {/* Header Hero */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full border border-[#FF3B00]/40 bg-[#FF3B00]/10 font-mono-tech text-[11px] tracking-widest text-[#FF3B00] uppercase">
              {project.discipline}
            </span>
            <span className="font-mono-tech text-xs text-[#8E929A]">
              COMMISSIONED BY: {project.client}
            </span>
          </div>

          <h2
            id="project-modal-title"
            className="font-display font-black text-5xl sm:text-7xl md:text-8xl text-[#EDE8DE] tracking-tight leading-none"
          >
            {project.title}
          </h2>
          <p className="font-sans-body text-xl md:text-2xl text-[#8E929A] font-light max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>
        </div>

        {/* Full-Color Vibrant Media Showcase */}
        <div className="space-y-4">
          <div className="relative w-full h-[55vh] md:h-[72vh] rounded-2xl overflow-hidden border border-[#242834] shadow-[0_16px_48px_rgba(0,0,0,0.8)] bg-[#0B0D12]">
            <img
              src={currentImageUrl}
              alt={project.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isSimulating ? 'scale-105 filter saturate-150 contrast-125' : 'scale-100'
              }`}
            />
            
            {/* Ambient Lighting Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-black/30 pointer-events-none" />

            {/* Simulation Overlay Badge */}
            {isSimulating && (
              <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF3B00] text-black font-mono-tech text-xs font-bold animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEURAL COMPUTATION ACTIVE</span>
              </div>
            )}

            {/* Bottom Color Swatches Bar */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto bg-[#060709]/80 backdrop-blur-md px-3 py-2 rounded-xl border border-[#242834]">
                <Palette className="w-3.5 h-3.5 text-[#FF3B00]" />
                <span className="font-mono-tech text-[10px] text-[#8E929A] uppercase tracking-wider mr-1">PALETTE:</span>
                {project.palette.map((color, idx) => (
                  <span
                    key={idx}
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <div className="font-mono-tech text-[10px] text-[#EDE8DE]/80 uppercase tracking-widest bg-[#060709]/80 backdrop-blur-md px-3 py-2 rounded-xl border border-[#242834]">
                IMAGE {activeImageIndex + 1} OF {(project.gallery?.length || 1)}
              </div>
            </div>
          </div>

          {/* Image Gallery Switcher Tabs */}
          {project.gallery && project.gallery.length > 1 && (
            <div className="flex items-center gap-3 pt-2">
              <span className="font-mono-tech text-xs text-[#8E929A] uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#FF3B00]" />
                <span>PERSPECTIVES:</span>
              </span>
              {project.gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    audioSynthesizer.playMechanicalTick(1.2);
                  }}
                  onMouseEnter={() => cursorEngine.setState('hover', `VIEW 0${idx + 1}`)}
                  onMouseLeave={() => cursorEngine.resetState()}
                  className={`px-3 py-1.5 rounded-lg font-mono-tech text-xs transition-all duration-200 ${
                    activeImageIndex === idx
                      ? 'bg-[#FF3B00] text-black font-bold shadow-[0_0_12px_rgba(255,59,0,0.5)]'
                      : 'bg-[#12141a] border border-[#242834] text-[#EDE8DE] hover:border-[#FF3B00]'
                  }`}
                >
                  VIEW 0{idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Manifesto & Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-[#242834]">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-mono-tech text-xs text-[#FF3B00] tracking-widest uppercase">
              <Layers className="w-4 h-4" />
              <span>THEORETICAL FRAMEWORK</span>
            </div>
            <blockquote className="font-editorial text-2xl md:text-3xl text-[#EDE8DE] italic leading-snug">
              “{project.manifesto}”
            </blockquote>
            <p className="font-sans-body text-base text-[#8E929A] leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-2 font-mono-tech text-xs text-[#FF3B00] tracking-widest uppercase">
              <Cpu className="w-4 h-4" />
              <span>SYSTEM TELEMETRY & SPECS</span>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[#242834] bg-[#0B0D12]">
                  <span className="font-mono-tech text-[9px] text-[#8E929A] tracking-wider uppercase block mb-1">
                    {m.label}
                  </span>
                  <span className="font-display font-bold text-lg text-[#EDE8DE]">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Technology Stack Tags */}
            <div className="space-y-3">
              <span className="font-mono-tech text-xs text-[#8E929A] uppercase tracking-wider block">
                COMPUTATIONAL STACK
              </span>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full border border-[#242834] bg-[#12141a] font-mono-tech text-[10px] text-[#EDE8DE]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Interactive Action */}
            <div className="pt-4">
              <button
                onClick={() => {
                  setIsSimulating(!isSimulating);
                  audioSynthesizer.playTransitionImpact();
                }}
                onMouseEnter={() => {
                  cursorEngine.setState('hover', isSimulating ? 'HALT' : 'MUTATE');
                  audioSynthesizer.playMechanicalTick(1.1);
                }}
                onMouseLeave={() => cursorEngine.resetState()}
                className="w-full py-4 rounded-xl bg-[#FF3B00] text-black font-display font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#EDE8DE] transition-all duration-200 shadow-[0_0_20px_rgba(255,59,0,0.4)]"
              >
                <Activity className="w-4 h-4" />
                <span>{isSimulating ? 'HALT VOLUMETRIC SIMULATION' : 'INITIALIZE VOLUMETRIC SIMULATION'}</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
