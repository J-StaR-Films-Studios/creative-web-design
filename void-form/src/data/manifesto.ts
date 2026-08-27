export interface ManifestoItem {
  id: string;
  number: string;
  statement: string;
  subtext: string;
  interactionType: 'dissolve' | 'stretch' | 'invert' | 'shear';
  actionHint: string;
  description: string;
}

export const MANIFESTO_ITEMS: ManifestoItem[] = [
  {
    id: 'strange',
    number: '01',
    statement: 'MAKE IT STRANGE.',
    subtext: 'Reject the safety of standard patterns. Unfamiliarity sparks genuine human attention.',
    interactionType: 'dissolve',
    actionHint: 'Hover or press to dissolve typography into molecular particle dust',
    description: 'When typography breaks its rigid grid into free-floating dust particles, the illusion of digital solidity dissolves.'
  },
  {
    id: 'useful',
    number: '02',
    statement: 'MAKE IT USEFUL.',
    subtext: 'Experimental does not mean non-functional. Deep utility validates radical aesthetics.',
    interactionType: 'stretch',
    actionHint: 'Drag cursor through words to stretch typography along elastic kinetic vectors',
    description: 'Letters dynamically stretch and deform under cursor tension, maintaining physical mass and spring restitution.'
  },
  {
    id: 'move',
    number: '03',
    statement: 'MAKE IT MOVE.',
    subtext: 'Static interfaces are dead relics. Life exists exclusively in state transitions.',
    interactionType: 'invert',
    actionHint: 'Hover to invert chromatic polarities and trigger spatial glitch ripples',
    description: 'Inverts local photonic contrast, turning dark matter into blinding luminance with chromatic aberration.'
  },
  {
    id: 'matter',
    number: '04',
    statement: 'MAKE IT MATTER.',
    subtext: 'If it leaves no impression in memory, it might as well have never been rendered.',
    interactionType: 'shear',
    actionHint: 'Accelerate cursor to generate real-time fluid shear wave distortion',
    description: 'Cursor velocity injects Navier-Stokes fluid energy directly into the typographic coordinates.'
  }
];
