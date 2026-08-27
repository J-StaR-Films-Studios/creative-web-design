'use client';

import { ArchiveArtifact } from '@/lib/types';

interface MemoryGhostsProps {
  rememberedArtifacts: ArchiveArtifact[];
  onSelectArtifact: (artifact: ArchiveArtifact) => void;
}

export function MemoryGhosts({ rememberedArtifacts, onSelectArtifact }: MemoryGhostsProps) {
  if (rememberedArtifacts.length === 0) return null;

  return (
    <aside
      aria-label="Remembered Artifacts"
      className="fixed left-6 bottom-6 z-30 hidden md:flex flex-col gap-2 pointer-events-auto"
    >
      <div className="text-[10px] font-mono tracking-[0.3em] text-[#8c94a4] uppercase mb-1">
        MEMORY FRAGMENTS ({rememberedArtifacts.length})
      </div>
      <div className="flex items-center gap-2 max-w-md overflow-x-auto py-1">
        {rememberedArtifacts.slice(-4).map((artifact) => (
          <button
            key={artifact.id}
            onClick={() => onSelectArtifact(artifact)}
            className="group flex flex-col p-2.5 arch-panel transition-all text-left cursor-pointer"
            title={`Recall ${artifact.title}`}
          >
            <span className="font-mono text-[9px] text-[#c86432] tracking-wider font-semibold">
              {artifact.id}
            </span>
            <span className="font-mono text-[11px] text-[#ccd2dc] group-hover:text-[#ffffff] truncate max-w-[130px]">
              {artifact.title}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
