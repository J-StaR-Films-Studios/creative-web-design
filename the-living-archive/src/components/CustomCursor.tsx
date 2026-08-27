'use client';

import { useEffect, useRef, useState } from 'react';
import { CursorState } from '@/lib/types';

interface CustomCursorProps {
  cursorState?: CursorState;
  customLabel?: string;
}

export function CustomCursor({ cursorState = 'DEFAULT', customLabel }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0, speed: 0 });

  // Compute label synchronously
  const internalLabel = customLabel || (cursorState !== 'DEFAULT' ? (cursorState === 'SOUND' ? 'AUDIO' : cursorState) : '');

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const animate = () => {
      // Damped trailing spring for ring
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      ringPos.current.x += dx * 0.18;
      ringPos.current.y += dy * 0.18;

      // Compute velocity for deformation & stretching
      const vX = mousePos.current.x - prevMousePos.current.x;
      const vY = mousePos.current.y - prevMousePos.current.y;
      prevMousePos.current.x = mousePos.current.x;
      prevMousePos.current.y = mousePos.current.y;

      velocity.current.x += (vX - velocity.current.x) * 0.2;
      velocity.current.y += (vY - velocity.current.y) * 0.2;
      const speed = Math.hypot(velocity.current.x, velocity.current.y);
      const angle = Math.atan2(velocity.current.y, velocity.current.x);

      // Velocity deformation parameters
      const stretch = Math.min(speed * 0.04, 0.8);
      const scaleX = 1 + stretch;
      const scaleY = Math.max(0.4, 1 - stretch * 0.5);

      if (ring) {
        ring.style.transform = `translate(${ringPos.current.x - 24}px, ${ringPos.current.y - 24}px) rotate(${angle}rad) scale(${scaleX}, ${scaleY})`;
      }

      if (label) {
        label.style.transform = `translate(${ringPos.current.x + 20}px, ${ringPos.current.y - 12}px)`;
      }

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className={`cursor-ring cursor-${cursorState.toLowerCase()}`}
        style={{ opacity: visible ? 1 : 0 }}
      />
      {internalLabel && (
        <div
          ref={labelRef}
          className="cursor-label"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {internalLabel}
        </div>
      )}
    </>
  );
}
