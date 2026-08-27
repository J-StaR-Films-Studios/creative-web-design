/**
 * Apple Optical Glass & Brushed Titanium Shaders
 * Pure optical refraction, Fresnel rim dispersion, and quiet physical micro-displacement.
 */

export const crystalVertexShader = `
uniform float uTime;
uniform float uReasoningBudget;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vDisplacement;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;

  // Normalized budget factor (0.0 to 1.0)
  float budgetNorm = clamp(log2(max(uReasoningBudget, 1.0)) / 9.0, 0.0, 1.0);

  // Subtle, elegant micro-ripple harmonic
  float ripple = sin(position.y * 4.0 + uTime * 1.5) * cos(position.x * 4.0 + uTime * 1.2);
  float displacement = ripple * 0.04 * (1.0 + budgetNorm * 0.8);
  vDisplacement = displacement;

  vec3 newPosition = position + normal * displacement;
  vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export const crystalFragmentShader = `
uniform float uTime;
uniform float uReasoningBudget;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vDisplacement;

void main() {
  // 1. Apple Optical Fresnel Glass Rim
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

  // 2. Monochromatic Titanium & Smoked Optical Glass Base
  vec3 baseGlass = vec3(0.06, 0.06, 0.08);
  vec3 titaniumEdge = vec3(0.92, 0.93, 0.96);

  // 3. Subtle internal light refraction
  float innerLuminance = smoothstep(-1.0, 1.0, vPosition.z) * 0.15;

  vec3 finalColor = mix(baseGlass, titaniumEdge, fresnel * 0.85) + vec3(innerLuminance);

  gl_FragColor = vec4(finalColor, 0.88 + fresnel * 0.12);
}
`;

/**
 * 2D Apple Ambient Spotlight Glow Shaders
 */
export const fluidVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

export const fluidFragmentShader = `
uniform vec2 uMouse;
uniform float uSpeed;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  // Gentle, serene radial ambient spotlight following cursor with falloff
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  float dist = distance(vUv * aspect, uMouse * aspect);
  
  // Soft, velvety falloff
  float spot = smoothstep(0.65, 0.0, dist) * 0.08;
  
  vec3 ambientGlow = vec3(0.12, 0.12, 0.15) * spot;

  gl_FragColor = vec4(ambientGlow, spot);
}
`;
