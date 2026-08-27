import React, { useEffect, useRef, useState } from 'react';
import { cursorEngine } from '../core/cursor-engine';
import type { CursorPosition } from '../core/cursor-engine';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState<CursorPosition>(() => cursorEngine.getPosition());
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cursorEngine.init();
    const unsubscribe = cursorEngine.subscribe((newPos) => {
      setPos(newPos);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Compute velocity-based stretch factor and angle for the follower
  const velocityStretch = Math.min(pos.speed * 0.035, 1.6);
  const scaleX = 1 + velocityStretch;
  const scaleY = 1 / (1 + velocityStretch * 0.7);
  const rotDeg = (pos.angle * 180) / Math.PI;

  const isInteractive = pos.state !== 'default' && pos.state !== 'hidden';
  const isHidden = pos.targetX < 0 || pos.state === 'hidden';

  if (isHidden) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none" aria-hidden="true">
      {/* 1. Instant 1:1 Hardware Precision Dot (Always visible, ZERO delay) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-[3px] -mt-[3px] z-50 transition-opacity duration-150"
        style={{
          transform: `translate3d(${pos.targetX}px, ${pos.targetY}px, 0)`,
          willChange: 'transform',
        }}
      >
        <div className="w-[6px] h-[6px] rounded-full bg-[#EDE8DE] shadow-[0_0_6px_#fff,0_0_12px_rgba(255,255,255,0.6)] ring-1 ring-black/80" />
      </div>

      {/* 2. Outer Smooth Spring Follower Ring / Interactive Badge (Has physical mass & lag) */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full transition-all duration-300 ${
          isInteractive
            ? 'w-24 h-24 -ml-12 -mt-12 bg-[#FF3B00] text-black shadow-[0_0_30px_rgba(255,59,0,0.7)]'
            : 'w-9 h-9 -ml-[18px] -mt-[18px] border border-[#EDE8DE]/40 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${isInteractive ? 0 : rotDeg}deg) scale(${isInteractive ? 1 : scaleX}, ${isInteractive ? 1 : scaleY})`,
          willChange: 'transform',
        }}
      >
        {isInteractive && pos.textBadge && (
          <span
            ref={badgeRef}
            className="font-display font-extrabold text-[10px] tracking-widest uppercase text-black select-none pointer-events-none"
          >
            {pos.textBadge}
          </span>
        )}
      </div>

      {/* 3. Precision Crosshair indicator on instantaneous coordinate */}
      {!isInteractive && (
        <div
          className="fixed top-0 left-0 opacity-25 pointer-events-none"
          style={{
            transform: `translate3d(${pos.targetX - 10}px, ${pos.targetY - 10}px, 0)`,
          }}
        >
          <div className="w-5 h-5 border-t border-l border-[#EDE8DE]" />
        </div>
      )}
    </div>
  );
};
