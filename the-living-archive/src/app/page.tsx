'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArchiveEngine } from '@/lib/archive-engine';
import { ArchiveParticleEngine } from '@/lib/particle-system';
import { CustomCursor } from '@/components/CustomCursor';
import { ArchiveIndex } from '@/components/ArchiveIndex';
import { SearchOverlay } from '@/components/SearchOverlay';
import { ArtifactModal } from '@/components/ArtifactModal';
import { OpeningSequence } from '@/components/OpeningSequence';
import { Navigation } from '@/components/Navigation';
import { MemoryCounter } from '@/components/MemoryCounter';
import { MemoryGhosts } from '@/components/MemoryGhosts';
import { ArchiveArtifact, CursorState, RoomId } from '@/lib/types';
import { globalAudio } from '@/lib/audio-engine';

gsap.registerPlugin(ScrollTrigger);

interface SectorCuratorialData {
  tag: string;
  title: string;
  description: string;
  accessionRange: string;
}

const SECTOR_METADATA: Record<RoomId, SectorCuratorialData> = {
  image: {
    tag: 'SECTOR 01 // PHOTOGRAPHIC MONOLITHS',
    title: 'IMAGE',
    description: 'Enormous silver gelatin surfaces suspended in maritime mist. Photochemical grain structures and raw brutalist geometry preserved across time.',
    accessionRange: 'ACCESSION: ARC-001000 — ARC-009999',
  },
  sound: {
    tag: 'SECTOR 02 // ACOUSTIC RESONATORS',
    title: 'SOUND',
    description: 'Musical masterworks manifested as physical geometric forms. Infrasonic sub-bass scales monoliths; harmonic resonance modulates geometry.',
    accessionRange: 'SPECTRUM: 16 HZ — 20 KHZ',
  },
  typography: {
    tag: 'SECTOR 03 // MONUMENTAL LETTERFORMS',
    title: 'TYPOGRAPHY',
    description: 'Words exist as architectural structures: FORM, LANGUAGE, MEMORY, TIME, SPACE. Monolithic slabs sculpted with light cutouts and parallax depth.',
    accessionRange: 'SPECIMENS: 1928 — 1967',
  },
  objects: {
    tag: 'SECTOR 04 // INDUSTRIAL INSTRUMENTS',
    title: 'OBJECTS',
    description: 'Strange physical artifacts preserved in state: 1953 cantilever chair, 1974 optical rangefinder camera, 1979 dual-trace oscilloscope.',
    accessionRange: 'COLLECTION: TACTILE INSTRUMENTS',
  },
  film: {
    tag: 'SECTOR 05 // CINEMATOGRAPHIC PORTAL',
    title: 'FILM',
    description: 'Terminus cinema projection. As the observer approaches, optical wave distortion and celluloid grain draw the viewer directly into the motion sequence.',
    accessionRange: '35MM CELLULOID MONTAGE: 1962',
  },
  digital: {
    tag: 'SECTOR 06 // SILICON ARCHAEOLOGY',
    title: 'DIGITAL MEMORY',
    description: 'Fragments of early cybernetic interfaces: 1-bit bitmapped resource forks, phosphor CRT scanlines, and preserved binary memory blocks.',
    accessionRange: 'BINARY FORKS: 1984 — 1991',
  },
  finale: {
    tag: 'SECTOR 07 // RECOLLECTION VOID',
    title: 'THE VOID',
    description: 'Physical architecture dissolves into pure memory. All examined artifacts converge in the personal cognitive constellation.',
    accessionRange: 'THE ARCHIVE REMEMBERS FOR YOU',
  },
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ArchiveEngine | null>(null);
  const particleEngineRef = useRef<ArchiveParticleEngine | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // States
  const [isLoaded, setIsLoaded] = useState(false);
  const [showIndex, setShowIndex] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<ArchiveArtifact | null>(null);
  const [activeRoom, setActiveRoom] = useState<RoomId>('image');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [objectCount, setObjectCount] = useState('01,847,293');
  const [cursorState, setCursorState] = useState<CursorState>('DEFAULT');
  const [cursorLabel, setCursorLabel] = useState<string | undefined>(undefined);
  const [rememberedCount, setRememberedCount] = useState(0);
  const [rememberedArtifacts, setRememberedArtifacts] = useState<ArchiveArtifact[]>([]);

  // Initialize Engines & Synchronized Scroll Ticker
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Lenis Smooth Scroll Engine
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    });

    lenis.on('scroll', (e: { velocity?: number }) => {
      ScrollTrigger.update();
      if (particleEngineRef.current) {
        particleEngineRef.current.updateScrollVelocity(e.velocity || 0);
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenis;

    // 2. Three.js Spatial Archive Engine
    const engine = new ArchiveEngine(containerRef.current, lenis);
    engineRef.current = engine;

    engine.onProgress((progress, room) => {
      setScrollProgress(progress);
      setActiveRoom(room);
    });

    engine.onLoaded(() => {
      setIsLoaded(true);
    });

    engine.onHover((artifact) => {
      if (artifact) {
        setCursorState(artifact.category === 'IMAGE' ? 'VIEW' : 'EXAMINE');
        setCursorLabel(artifact.category === 'IMAGE' ? 'VIEW' : 'EXAMINE');
      } else {
        setCursorState('DEFAULT');
        setCursorLabel(undefined);
      }
    });

    engine.onInspect((artifact) => {
      setActiveArtifact(artifact);
      setRememberedCount(engine.getRememberedCount());
      setRememberedArtifacts(engine.getRememberedArtifacts());
    });

    // 3. Canvas 2D Particle Engine
    if (particleCanvasRef.current) {
      const particleEngine = new ArchiveParticleEngine(particleCanvasRef.current);
      particleEngine.start();
      particleEngineRef.current = particleEngine;
    }

    // 4. Indexing ticker simulation
    const tickerInterval = setInterval(() => {
      const base = 1847293;
      const variation = Math.floor(Math.sin(Date.now() * 0.0012) * 85);
      setObjectCount(String(base + variation).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }, 1200);

    return () => {
      engine.dispose();
      particleEngineRef.current?.dispose();
      lenis.destroy();
      ScrollTrigger.killAll();
      clearInterval(tickerInterval);
    };
  }, []);

  // Handlers
  const handleEnterArchive = useCallback(() => {
    engineRef.current?.enterArchive();
  }, []);

  const toggleIndex = useCallback(() => {
    setShowIndex((prev) => {
      const next = !prev;
      engineRef.current?.toggleFreeze(next);
      return next;
    });
  }, []);

  const toggleSearch = useCallback(() => {
    setShowSearch((prev) => !prev);
  }, []);

  const handleWarpToRoom = useCallback((roomId: RoomId) => {
    engineRef.current?.warpToRoom(roomId);
    if (particleEngineRef.current) {
      if (roomId === 'image') particleEngineRef.current.morphTo('ARCHIVE');
      else if (roomId === 'sound') particleEngineRef.current.morphTo('CIRCLE');
      else if (roomId === 'typography') particleEngineRef.current.morphTo('MEMORY');
      else if (roomId === 'digital') particleEngineRef.current.morphTo('MATRIX');
      else particleEngineRef.current.morphTo('DISPERSED');
    }
  }, []);

  const handleTriggerDestruction = useCallback(() => {
    engineRef.current?.triggerDestruction();
    particleEngineRef.current?.triggerExplosion();
  }, []);

  const handleResetExperience = useCallback(() => {
    globalAudio.playHarmonicChime(440);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 2.0 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const currentSector = SECTOR_METADATA[activeRoom] || SECTOR_METADATA.image;
  const isFinale = activeRoom === 'finale';

  return (
    <main
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#11141a] overflow-hidden select-none"
    >
      {/* 1. Fixed Three.js WebGL Spatial Canvas */}
      <canvas id="archive-canvas" className="fixed inset-0 w-full h-full" />

      {/* 2. Fixed Canvas 2D Particle System */}
      <canvas id="particle-canvas" ref={particleCanvasRef} className="fixed inset-0 w-full h-full" />

      {/* 3. Subtle Film Grain Vignette */}
      <div className="fixed inset-0 cinema-scanlines z-[5] pointer-events-none opacity-30" />

      {/* 4. Velocity-Stretching Custom Cursor */}
      <CustomCursor cursorState={cursorState} customLabel={cursorLabel} />

      {/* 5. Opening Door Sequence */}
      <OpeningSequence
        isLoaded={isLoaded}
        onEnter={handleEnterArchive}
        objectCount={objectCount}
      />

      {/* 6. Top Editorial Navigation */}
      <Navigation
        onIndexToggle={toggleIndex}
        onSearchToggle={toggleSearch}
        onDestructionTrigger={handleTriggerDestruction}
        activeRoom={activeRoom}
        scrollProgress={scrollProgress}
      />

      {/* 7. Fullscreen Classification Index */}
      <ArchiveIndex
        isActive={showIndex}
        onToggle={toggleIndex}
        onSelectCategory={handleWarpToRoom}
      />

      {/* 8. Fullscreen Giant Typography Search Overlay */}
      <SearchOverlay
        isActive={showSearch}
        onToggle={toggleSearch}
        onSelectArtifact={(artifact) => {
          setActiveArtifact(artifact);
          engineRef.current?.rememberArtifact(artifact);
          setRememberedCount(engineRef.current?.getRememberedCount() || 0);
          setRememberedArtifacts(engineRef.current?.getRememberedArtifacts() || []);
        }}
        onWarpToRoom={handleWarpToRoom}
      />

      {/* 9. Fullscreen Artifact Specimen Modal */}
      <ArtifactModal
        artifact={activeArtifact}
        onClose={() => setActiveArtifact(null)}
      />

      {/* 10. Objects Remembered Live Counter */}
      <MemoryCounter count={rememberedCount} />

      {/* 11. Memory Ghost Fragments */}
      <MemoryGhosts
        rememberedArtifacts={rememberedArtifacts}
        onSelectArtifact={(a) => setActiveArtifact(a)}
      />

      {/* 12. Pinned Architectural Sector HUD (Cross-fades smoothly per sector with zero overlapping text) */}
      {!isFinale && (
        <div className="fixed bottom-12 left-8 md:left-14 z-20 max-w-xl pointer-events-none transition-all duration-700">
          <div className="arch-panel p-6 md:p-8 space-y-3 pointer-events-auto">
            <span className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-[#c86432] uppercase block font-semibold">
              {currentSector.tag}
            </span>
            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tight text-[#ffffff]">
              {currentSector.title}
            </h2>
            <p className="text-xs md:text-sm font-mono text-[#ccd2dc] leading-relaxed">
              {currentSector.description}
            </p>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-[#8c94a4] uppercase tracking-wider">
              <span>{currentSector.accessionRange}</span>
              <span className="text-[#c86432]">CLICK OBJECTS TO EXAMINE</span>
            </div>
          </div>
        </div>
      )}

      {/* 13. Finale Recollection Void Overlay (Appears gracefully in Sector 07) */}
      {isFinale && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-8 text-center bg-[#11141a]/90 backdrop-blur-md animate-in fade-in duration-1000">
          <div className="max-w-3xl space-y-8 arch-panel p-10 md:p-16">
            <span className="text-xs font-mono tracking-[0.5em] text-[#c86432] uppercase block">
              FINAL RECOLLECTION
            </span>

            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-[#ffffff]">
              WHAT DO YOU REMEMBER?
            </h2>

            <div className="font-mono text-sm tracking-[0.3em] text-[#ccd2dc] uppercase">
              YOU REMEMBERED {rememberedCount} ARTIFACTS ON THIS JOURNEY.
            </div>

            {/* Remembered fragments constellation summary */}
            {rememberedArtifacts.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto py-4">
                {rememberedArtifacts.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setActiveArtifact(a)}
                    className="px-3.5 py-1.5 arch-panel text-[11px] font-mono text-[#c86432] hover:text-[#ffffff] hover:border-[#c86432] transition-colors cursor-pointer"
                  >
                    {a.title} ({a.year})
                  </button>
                ))}
              </div>
            )}

            <p className="text-xl md:text-2xl font-light text-[#f5f0e8] tracking-wide">
              THE ARCHIVE REMEMBERS FOR YOU.
            </p>

            <div className="pt-6">
              <button
                onClick={handleResetExperience}
                className="group relative px-10 py-4 arch-panel border-white/20 hover:border-[#c86432] text-[#ffffff] hover:text-[#0a0a0b] hover:bg-[#c86432] font-mono text-xs tracking-[0.4em] uppercase transition-all duration-300 cursor-pointer shadow-2xl"
              >
                ENTER AGAIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 14. Smooth Virtual Scroll Driver Track */}
      <div id="main-content" className="scroll-container w-full" style={{ height: '700vh' }} />
    </main>
  );
}
