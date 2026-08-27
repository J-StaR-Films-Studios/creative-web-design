/**
 * Fast 2D Simplex & Perlin Noise Generator
 * Deterministic permutation table for continuous elevation fields and contour generation.
 */
export class SimplexNoise2D {
  private p: Uint8Array;
  private perm: Uint8Array;
  private permMod12: Uint8Array;

  // Gradient vectors for 2D
  private static readonly G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  private static readonly F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  private static readonly GRAD2 = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [1, 0], [-1, 0],
    [0, 1], [0, -1], [0, 1], [0, -1]
  ];

  constructor(seed = 42) {
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      this.p[i] = i;
    }

    // Seeded shuffle (LCG)
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const j = Math.floor((s / 4294967296) * (i + 1));
      const temp = this.p[i];
      this.p[i] = this.p[j];
      this.p[j] = temp;
    }

    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  public noise(xin: number, yin: number): number {
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;

    // Skew the input space to determine which simplex cell we're in
    const s = (xin + yin) * SimplexNoise2D.F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * SimplexNoise2D.G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    // Determine simplex shape
    let i1: number, j1: number;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + SimplexNoise2D.G2;
    const y1 = y0 - j1 + SimplexNoise2D.G2;
    const x2 = x0 - 1.0 + 2.0 * SimplexNoise2D.G2;
    const y2 = y0 - 1.0 + 2.0 * SimplexNoise2D.G2;

    // Hash coordinates
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.permMod12[ii + this.perm[jj]];
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
    const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];

    // Calculate contribution from three corners
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      t0 *= t0;
      n0 = t0 * t0 * (SimplexNoise2D.GRAD2[gi0][0] * x0 + SimplexNoise2D.GRAD2[gi0][1] * y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      t1 *= t1;
      n1 = t1 * t1 * (SimplexNoise2D.GRAD2[gi1][0] * x1 + SimplexNoise2D.GRAD2[gi1][1] * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      t2 *= t2;
      n2 = t2 * t2 * (SimplexNoise2D.GRAD2[gi2][0] * x2 + SimplexNoise2D.GRAD2[gi2][1] * y2);
    }

    // Result mapped to [-1, 1]
    return 70.0 * (n0 + n1 + n2);
  }

  /**
   * 4-Octave Fractional Brownian Motion (FBM)
   */
  public fbm(x: number, y: number, octaves = 4, persistence = 0.5, lacunarity = 2.0): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.noise(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return total / maxValue;
  }
}
