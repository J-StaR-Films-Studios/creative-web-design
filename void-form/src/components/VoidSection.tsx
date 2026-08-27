import React, { useEffect, useRef } from 'react';
import { VoidCoreScene } from '../webgl/void-core-scene';
import { cursorEngine } from '../core/cursor-engine';
import { audioSynthesizer } from '../core/audio-synthesizer';

export const VoidSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHolderRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<VoidCoreScene | null>(null);

  useEffect(() => {
    if (!canvasHolderRef.current) return;

    const scene = new VoidCoreScene(canvasHolderRef.current);
    sceneRef.current = scene;

    let animId: number;
    let startTime = performance.now();

    const tick = (currentTime: number) => {
      const time = (currentTime - startTime) / 1000;
      const pos = cursorEngine.getPosition();

      // Normalize mouse to [0, 1] relative to window
      const normX = pos.x / window.innerWidth;
      const normY = pos.y / window.innerHeight;
      scene.onMouseMove(normX, normY);

      // Calculate scroll progress within the void section
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const sectionHeight = rect.height;
        const visibleTop = -rect.top;
        const progress = Math.min(Math.max(visibleTop / (sectionHeight - window.innerHeight || 1), 0), 1);
        scene.setScrollProgress(progress);
        audioSynthesizer.modulateDrone(progress);
      }

      scene.update(time, 0.016);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (canvasHolderRef.current) {
        scene.resize(canvasHolderRef.current.clientWidth, canvasHolderRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="void"
      className="relative min-h-[120svh] w-full bg-[#050608] flex flex-col justify-between px-6 md:px-16 py-24 select-none overflow-hidden"
      onMouseEnter={() => cursorEngine.setState('explore', 'ORBIT')}
      onMouseLeave={() => cursorEngine.resetState()}
    >
      {/* 3D WebGL Canvas Holder (Positioned in Background) */}
      <div
        ref={canvasHolderRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
      />

      {/* Floating Spatial UI Overlay */}
      <div className="relative z-10 max-w-sm pointer-events-none">
        <div className="flex items-center gap-2 font-mono-tech text-[10px] tracking-widest text-[#FF3B00] uppercase mb-2">
          <span>02</span>
          <span>//</span>
          <span>THE VOID CORE</span>
        </div>
        <h2 className="font-display font-black text-3xl md:text-5xl text-[#EDE8DE] tracking-tight mb-4">
          NON-EUCLIDEAN DYNAMICS
        </h2>
        <p className="font-sans-body text-xs text-[#8E929A] leading-relaxed">
          Move your cursor around the core to destabilize its topological equilibrium. Surface normals displace dynamically via 3D Simplex noise kernels and reactive studio lighting.
        </p>
      </div>

      {/* Real-time Telemetry Readout */}
      <div className="relative z-10 text-right font-mono-tech text-[10px] text-[#8E929A] space-y-1 pointer-events-none">
        <p className="text-[#EDE8DE]">MANIFOLD: ICOSAHEDRON D4</p>
        <p>VERTICES: 10,242 DISPLACED</p>
        <p>NORMAL SHIFT: <span className="text-[#FF3B00]">REAL-TIME GLSL</span></p>
        <p>EQUILIBRIUM: UNSTABLE</p>
      </div>
    </section>
  );
};
