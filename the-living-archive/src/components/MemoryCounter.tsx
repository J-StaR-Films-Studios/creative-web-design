'use client';

interface MemoryCounterProps {
  count: number;
}

export function MemoryCounter({ count }: MemoryCounterProps) {
  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 arch-panel px-4 py-2 font-mono text-[11px] tracking-[0.25em] text-[#a0a6b4] uppercase select-none"
    >
      <span className="w-2 h-2 rounded-full bg-[#c86432] animate-pulse" />
      <span className="opacity-70">OBJECTS REMEMBERED:</span>
      <span className="font-bold text-[#ffffff]">{String(count).padStart(6, '0')}</span>
    </div>
  );
}
