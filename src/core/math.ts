/**
 * Master Mathematical Kernels & Production Formulas
 * Verbatim from docs/EXHIBITION_WEBSITE_MASTER_BRIEF.md & creative-web-development
 */

/**
 * 1. Photometric Luminance (ITU-R BT.601)
 * Calculates perceived brightness from RGB byte values [0..255] -> [0..2.55]
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  return Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b) / 100;
}

/**
 * 2. 1D-to-2D Linear Byte Stride Index
 * For standard RGBA Uint8ClampedArray ImageData
 */
export function getPixelIndex(x: number, y: number, width: number): number {
  return (y * 4 * width) + (x * 4);
}

/**
 * 3. Hooke's Law Elastic Return & Proximity Repulsion
 * F_spring = -k * (x - x_base) - d * v
 */
export interface SpringState {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
}

export function updateSpringParticle(
  p: SpringState,
  mouseX: number,
  mouseY: number,
  k: number = 0.05,
  damping: number = 0.88,
  repelRadius: number = 100,
  repelForce: number = 8
): void {
  // Proximity Repulsion
  const dx = p.x - mouseX;
  const dy = p.y - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < repelRadius && dist > 0.0001) {
    const normX = dx / dist;
    const normY = dy / dist;
    const force = (1 - dist / repelRadius) * repelForce;
    p.vx += normX * force;
    p.vy += normY * force;
  }

  // Hooke's Elastic Return
  const springForceX = -k * (p.x - p.baseX);
  const springForceY = -k * (p.y - p.baseY);

  p.vx = (p.vx + springForceX) * damping;
  p.vy = (p.vy + springForceY) * damping;

  p.x += p.vx;
  p.y += p.vy;
}

/**
 * 4. Blender Sensor Height to Three.js PerspectiveCamera FOV Matching
 * FOV_vertical = 2 * arctan(SensorHeight / (2 * FocalLength)) * (180 / PI)
 */
export function calculateBlenderFov(sensorHeightMm: number, focalLengthMm: number): number {
  return 2 * Math.atan(sensorHeightMm / (2 * focalLengthMm)) * (180 / Math.PI);
}

/**
 * 5. Aspect-Corrected Cover UV Calculation (Canvas / GLSL equivalent)
 */
export function getCoverDimensions(
  containerWidth: number,
  containerHeight: number,
  mediaWidth: number,
  mediaHeight: number
): { width: number; height: number; offsetX: number; offsetY: number } {
  const containerRatio = containerWidth / containerHeight;
  const mediaRatio = mediaWidth / mediaHeight;

  let renderWidth: number;
  let renderHeight: number;

  if (containerRatio > mediaRatio) {
    renderWidth = containerWidth;
    renderHeight = containerWidth / mediaRatio;
  } else {
    renderHeight = containerHeight;
    renderWidth = containerHeight * mediaRatio;
  }

  const offsetX = (containerWidth - renderWidth) * 0.5;
  const offsetY = (containerHeight - renderHeight) * 0.5;

  return { width: renderWidth, height: renderHeight, offsetX, offsetY };
}

/**
 * 6. Upper-Triangular Constellation Distance Optimization (O(N(N-1)/2))
 */
export function computeConstellationLines(
  points: { x: number; y: number }[],
  maxDistance: number,
  onLine: (p1: { x: number; y: number }, p2: { x: number; y: number }, alpha: number) => void
): void {
  const count = points.length;
  const maxDistSq = maxDistance * maxDistance;

  for (let i = 0; i < count; i++) {
    const p1 = points[i];
    for (let j = i + 1; j < count; j++) {
      const p2 = points[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < maxDistSq) {
        const alpha = 1 - Math.sqrt(distSq) / maxDistance;
        onLine(p1, p2, alpha);
      }
    }
  }
}
