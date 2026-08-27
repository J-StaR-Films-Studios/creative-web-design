'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { ARCHIVE_ARTIFACTS } from '@/lib/archive-data';
import { ArchiveArtifact, RoomId } from '@/lib/types';
import { globalAudio } from '@/lib/audio-engine';

interface SearchOverlayProps {
  isActive: boolean;
  onToggle: () => void;
  onSelectArtifact: (artifact: ArchiveArtifact) => void;
  onWarpToRoom: (roomId: RoomId) => void;
}

export function SearchOverlay({
  isActive,
  onToggle,
  onSelectArtifact,
  onWarpToRoom,
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      inputRef.current?.focus();
      globalAudio.playHarmonicChime(580);
    }
  }, [isActive]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        onToggle();
      } else if (e.key === '/' && !isActive) {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onToggle]);

  // Live filter matching artifacts
  const filteredArtifacts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ARCHIVE_ARTIFACTS.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.maker.toLowerCase().includes(q) ||
        a.year.includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
    );
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    globalAudio.playTick(2800, 0.01, 0.04);
  };

  const handleSelect = (artifact: ArchiveArtifact) => {
    onSelectArtifact(artifact);
    onWarpToRoom(artifact.roomId);
    setQuery('');
    onToggle();
  };

  const handleClose = () => {
    setQuery('');
    onToggle();
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0a0a0b]/95 backdrop-blur-xl transition-all duration-700 flex flex-col justify-between p-8 md:p-16 ${
        isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center text-xs font-mono tracking-[0.3em] text-[#787d85] uppercase">
        <span>ARCHIVE COGNITIVE QUERY // LEXICAL SCAN</span>
        <button
          onClick={handleClose}
          className="hover:text-[#c86432] transition-colors cursor-pointer text-sm"
        >
          [ ESC / CLOSE ]
        </button>
      </div>

      {/* Center Giant Typographic Input */}
      <div className="max-w-6xl w-full mx-auto my-auto text-left">
        <label htmlFor="search-giant-input" className="block text-xs font-mono tracking-[0.4em] text-[#c86432] uppercase mb-4">
          DIRECT QUERY INPUT
        </label>

        <div className="relative border-b-2 border-[#2b2e36] focus-within:border-[#c86432] transition-colors pb-4">
          <input
            id="search-giant-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="SEARCH: PHOTOGRAPHY, 1974, CHAIR..."
            className="w-full bg-transparent text-[#e5e9ec] text-3xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight outline-none placeholder:text-[#333740]"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Live Matching Archival Results */}
        {query && (
          <div className="mt-8 max-h-[45vh] overflow-y-auto pr-4 space-y-4">
            <div className="text-xs font-mono tracking-[0.3em] text-[#787d85] uppercase mb-4">
              MATCHED ARTIFACTS: {filteredArtifacts.length} FOUND
            </div>

            {filteredArtifacts.length === 0 ? (
              <div className="py-8 text-[#555a64] font-mono text-sm tracking-[0.2em]">
                NO DIRECT ARTIFACT RESIDUE DETECTED FOR &ldquo;{query.toUpperCase()}&rdquo;.
              </div>
            ) : (
              filteredArtifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  onClick={() => handleSelect(artifact)}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-4 border border-[#1e2026] hover:border-[#c86432] bg-[#101216]/60 hover:bg-[#15171d] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#c86432] tracking-wider">
                      {artifact.id}
                    </span>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-[#e5e9ec] group-hover:text-[#c86432] transition-colors">
                        {artifact.title}
                      </h4>
                      <p className="text-xs font-mono text-[#787d85] mt-0.5">
                        {artifact.maker} • {artifact.year} • {artifact.medium}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 md:mt-0 flex items-center gap-4">
                    <span className="text-[10px] font-mono tracking-[0.2em] px-2.5 py-1 border border-[#2b2e36] text-[#8c93a0] uppercase">
                      ROOM: {artifact.roomId}
                    </span>
                    <span className="text-xs font-mono text-[#c86432] opacity-0 group-hover:opacity-100 transition-opacity">
                      WARP →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Telemetry */}
      <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.3em] text-[#555a64] uppercase">
        <span>TOTAL REPOSITORY CORPUS: 1,847,293 ENTRIES</span>
        <span>KEYBOARD SHORTCUT: [/] TO SEARCH</span>
      </div>
    </div>
  );
}
