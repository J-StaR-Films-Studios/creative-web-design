/**
 * Core mathematical utilities for interpolation, clamping, and geometric mapping.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function mapRange(
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  value: number
): number {
  if (inMax === inMin) return outMin;
  const normalized = (value - inMin) / (inMax - inMin);
  return outMin + normalized * (outMax - outMin);
}

export function distanceSq(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}
