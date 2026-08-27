export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  year: string;
  discipline: string;
  client: string;
  description: string;
  manifesto: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  image: string;
  gallery: string[];
  palette: string[];
}

export const PROJECTS: Project[] = [
  {
    id: 'afterimage',
    number: '01',
    title: 'AFTERIMAGE',
    subtitle: 'Neural Radiance Fields & Temporal Light Scenography',
    year: '2025',
    discipline: 'Spatial Computing / Volumetric Synthesis',
    client: 'Venice Biennale of Architecture & Tokyo Sound Lab',
    description: 'An exploration of photonic persistence in ephemeral computational spaces. Using custom Gaussian Splatting kernels and real-time volumetric raymarching, Afterimage captures the transient ghosts of physical architectural forms before demolition.',
    manifesto: 'Light does not end when its emitter extinguishes. In the afterglow of digital computation, residual energy forms new spatial topographies that exist only for the observing eye.',
    technologies: ['Custom WebGL 2.0', 'Gaussian Splatting', 'Compute Shaders', 'Volumetric Raymarching', 'Spatial Audio'],
    metrics: [
      { label: 'Volumetric Depth', value: '4.8M Splats' },
      { label: 'Raymarch Step Delta', value: '0.0012ms' },
      { label: 'Frame Coherence', value: '99.8%' }
    ],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=90'
    ],
    palette: ['#0B0D12', '#EDE8DE', '#242834', '#FF3B00']
  },
  {
    id: 'soft-machine',
    number: '02',
    title: 'SOFT MACHINE',
    subtitle: 'Bio-Digital Synthetic Interfaces & Organic Latency',
    year: '2025',
    discipline: 'Physical Computing / Haptic Telepresence',
    client: 'Institute of Contemporary Synthetic Media',
    description: 'A physical-digital hybrid installation where pneumatic silicone membranes deform in response to collective global network traffic, translating abstract cryptographic transactions into visceral, breathing muscular contractions.',
    manifesto: 'The machine is not cold metal. When fed the collective pulse of human intent, algorithmic systems behave with the elasticity and vulnerability of living tissue.',
    technologies: ['Three.js Cloth Sim', 'Differential Geometry', 'Pneumatic Actuators', 'WebSocket Telemetry'],
    metrics: [
      { label: 'Deformation Rate', value: '120Hz' },
      { label: 'Haptic Feedback Resolution', value: '64 Channels' },
      { label: 'Latency', value: '4.2ms' }
    ],
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=90'
    ],
    palette: ['#060709', '#EDE8DE', '#8E929A', '#D4380D']
  },
  {
    id: 'zero-gravity',
    number: '03',
    title: 'ZERO GRAVITY',
    subtitle: 'Non-Euclidean Kinetic Sculptures & Orbital Physics',
    year: '2024',
    discipline: 'Generative Art / Kinetic Computation',
    client: 'Zurich Kinetic Arts Foundation',
    description: 'A monumental kinetic sculpture floating within magnetic levitation fields. Its physical facets reconfigure according to tidal forces and orbital satellite passes in real time, defying Euclidean geometric assumptions.',
    manifesto: 'Gravity is merely an initial condition. When computational forces supersede physical mass, objects navigate uncharted multidimensional geometries.',
    technologies: ['GLSL Custom Vertex Pipeline', 'Verlet Physics Engine', 'Magnetic Field Sensors', 'Instanced Arrays'],
    metrics: [
      { label: 'Levitation Precision', value: '0.05mm' },
      { label: 'Realtime Nodes', value: '16,384' },
      { label: 'Tidal Sync Period', value: '12.4 hrs' }
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=90'
    ],
    palette: ['#090A0D', '#EDE8DE', '#3A3F4D', '#E25A24']
  },
  {
    id: 'digital-skin',
    number: '04',
    title: 'DIGITAL SKIN',
    subtitle: 'Subsurface Tactile Shaders & Micro-Texture Synthesis',
    year: '2024',
    discipline: 'Computer Graphics / Material Research',
    client: 'Maison Margiela Digital Archives',
    description: 'A real-time procedural tactile shader simulating microscopic cellular deformation and subsurface melanin scattering. Touching the digital viewport simulates the thermal conductance and resistance of biological skin.',
    manifesto: 'To see is to touch from a distance. By encoding optical friction into fragment shaders, we bridge the chasm between optical perception and epidermal memory.',
    technologies: ['Subsurface Scattering GLSL', 'Custom BRDF Kernels', 'Multi-Scale Normal Blending', 'HDR Lighting'],
    metrics: [
      { label: 'Scattering Radius', value: '3.2mm' },
      { label: 'Texture Stride', value: '8K Tileable' },
      { label: 'Specular Anisotropy', value: '0.87' }
    ],
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=90'
    ],
    palette: ['#0A0B0F', '#EDE8DE', '#636875', '#FF4E1A']
  },
  {
    id: 'unfinished',
    number: '05',
    title: 'UNFINISHED',
    subtitle: 'Speculative Ephemeral Architectures & Continuous Decay',
    year: '2026',
    discipline: 'Autonomous Environments / Procedural Decay',
    client: 'Centre Pompidou & Future Heritage Protocol',
    description: 'A monument programmed to dismantle and reassemble itself endlessly. Never reaching a completed state, the structure challenges the permanence of cultural artifacts in an era of rapid technological obsolescence.',
    manifesto: 'Completion is the death of possibility. Only in the state of perpetual incompleteness can a digital architecture remain eternally alive and endlessly malleable.',
    technologies: ['Recursive Spatial Graphs', 'Decay Shaders', 'Cellular Automata', 'WebGL Post-Processing'],
    metrics: [
      { label: 'Entropy Coefficient', value: '0.73' },
      { label: 'Reconfiguration Cycles', value: 'Continuous' },
      { label: 'Architectural States', value: 'Infinite' }
    ],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=90'
    ],
    palette: ['#050608', '#EDE8DE', '#4E5362', '#FF3B00']
  }
];
