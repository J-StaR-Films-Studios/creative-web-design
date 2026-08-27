/**
 * High-DPI Canvas Backing Scale & Context Configuration
 * Clamps DPR to 2.0 to protect GPU fill rate while delivering crisp Retina rendering.
 */
export interface HighDPIContext {
  ctx: CanvasRenderingContext2D;
  dpr: number;
  width: number;
  height: number;
}

export function configureHighDPICanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  maxDPR = 2.0
): HighDPIContext {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Failed to acquire 2D rendering context');

  const dpr = Math.min(window.devicePixelRatio || 1, maxDPR);

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
  ctx.scale(dpr, dpr);

  return { ctx, dpr, width, height };
}
