'use client';

import { useEffect, useRef } from 'react';
import { ArchiveArtifact } from '@/lib/types';
import { globalAudio } from '@/lib/audio-engine';

interface ArtifactModalProps {
  artifact: ArchiveArtifact | null;
  onClose: () => void;
}

export function ArtifactModal({ artifact, onClose }: ArtifactModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!artifact) return;
    globalAudio.playHarmonicChime(720);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [artifact, onClose]);

  // Render high-res archival specimen on canvas
  useEffect(() => {
    if (!artifact || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = Math.floor(1200 / artifact.visualData.aspectRatio);

    // Background tone
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, artifact.visualData.colorPalette[0] || '#0a0a0a');
    grad.addColorStop(0.5, artifact.visualData.colorPalette[1] || '#222222');
    grad.addColorStop(1, artifact.visualData.colorPalette[artifact.visualData.colorPalette.length - 1] || '#ffffff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texture-specific rendering
    if (artifact.visualData.textureType === 'photograph') {
      ctx.fillStyle = '#f5f0e8';
      ctx.globalAlpha = 0.06;
      for (let i = 0; i < 200; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 80 + 20, 1.5);
      }
    } else if (artifact.visualData.textureType === 'waveform') {
      ctx.strokeStyle = '#c86432';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 4) {
        const y = canvas.height / 2 + Math.sin(x * 0.02) * Math.cos(x * 0.005) * (canvas.height * 0.3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (artifact.visualData.textureType === 'typographic') {
      ctx.fillStyle = '#f5f0e8';
      ctx.font = '900 240px var(--font-geist-sans), sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(artifact.visualData.glyph || 'ARCHIVE', canvas.width / 2, canvas.height / 2);
    } else if (artifact.visualData.textureType === 'blueprint') {
      ctx.strokeStyle = 'rgba(200, 100, 50, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Archival Plate Metadata Overlay
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#e5e9ec';
    ctx.font = '700 24px monospace';
    ctx.fillText(`ACCESSION NO. ${artifact.id}`, 50, canvas.height - 50);
    ctx.fillText(`${artifact.title.toUpperCase()}`, 50, 60);
  }, [artifact]);

  if (!artifact) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-[#0a0a0b]/98 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-12 overflow-y-auto animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex justify-between items-start border-b border-[#20232b] pb-4">
        <div>
          <span className="text-[11px] font-mono tracking-[0.35em] text-[#c86432] uppercase">
            SPECIMEN EXAMINATION // {artifact.category}
          </span>
          <h2 className="text-xl md:text-3xl font-extrabold text-[#e5e9ec] tracking-tight mt-1">
            {artifact.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-mono tracking-[0.3em] uppercase text-[#8c93a0] hover:text-[#c86432] transition-colors cursor-pointer px-4 py-2 border border-[#262933] hover:border-[#c86432]"
        >
          [ ESC / CLOSE ]
        </button>
      </div>

      {/* Main Specimen & Curatorial Layout */}
      <div className="my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Specimen High-Res Visual Frame */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative border border-[#2b2e36] bg-[#000000] p-2 md:p-4 shadow-2xl w-full">
            <canvas
              ref={canvasRef}
              className="w-full h-auto object-contain block max-h-[60vh]"
            />
            <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-[#787d85] uppercase">
              <span>RESOLUTION: 1200 DPI DIRECT CAPTURE</span>
              <span className="text-[#c86432]">MEMORY: REGISTERED</span>
            </div>
          </div>
        </div>

        {/* Curatorial Archival Dossier */}
        <div className="lg:col-span-5 flex flex-col gap-6 font-mono text-left">
          <div className="space-y-4 border-l-2 border-[#c86432] pl-6">
            <div>
              <span className="text-[10px] text-[#6b6b6b] tracking-[0.3em] uppercase block">
                CATALOG IDENTIFIER
              </span>
              <span className="text-sm font-bold text-[#e5e9ec]">{artifact.id}</span>
            </div>

            <div>
              <span className="text-[10px] text-[#6b6b6b] tracking-[0.3em] uppercase block">
                CREATOR / MAKER
              </span>
              <span className="text-sm text-[#e5e9ec]">{artifact.maker}</span>
            </div>

            <div>
              <span className="text-[10px] text-[#6b6b6b] tracking-[0.3em] uppercase block">
                DATE OF ORIGIN
              </span>
              <span className="text-sm text-[#e5e9ec]">{artifact.year}</span>
            </div>

            <div>
              <span className="text-[10px] text-[#6b6b6b] tracking-[0.3em] uppercase block">
                PHYSICAL MEDIUM
              </span>
              <span className="text-sm text-[#e5e9ec]">{artifact.medium}</span>
            </div>

            {artifact.dimensions && (
              <div>
                <span className="text-[10px] text-[#6b6b6b] tracking-[0.3em] uppercase block">
                  PHYSICAL SCALE
                </span>
                <span className="text-sm text-[#e5e9ec]">{artifact.dimensions}</span>
              </div>
            )}

            <div>
              <span className="text-[10px] text-[#6b6b6b] tracking-[0.3em] uppercase block">
                PROVENANCE
              </span>
              <span className="text-xs text-[#8c93a0]">{artifact.provenance}</span>
            </div>
          </div>

          <div className="border-t border-[#20232b] pt-4">
            <span className="text-[10px] text-[#6b6b6b] tracking-[0.3em] uppercase block mb-2">
              CURATORIAL SUMMARY
            </span>
            <p className="text-xs md:text-sm font-sans text-[#a8adb8] leading-relaxed">
              {artifact.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.3em] text-[#555a64] uppercase border-t border-[#20232b] pt-4">
        <span>ARCHIVE CITATION: {artifact.id} {'//'} PERMANENT RETENTION</span>
        <span>THE LIVING ARCHIVE COGNITIVE SYSTEM</span>
      </div>
    </div>
  );
}
