# Architectural Rationale

This document outlines the strategic decision-making behind the structure of the `creative-web-development` agent skill.

## 1. Why Progressive Disclosure?
Agents, much like human engineers, experience context degradation when subjected to dense, monolithic files. By restricting `SKILL.md` to under 500 lines and acting solely as a **routing and execution matrix**, the agent maintains sharp focus on the *pipeline*. Heavy mathematical implementations (GLSL, Particle Physics) are quarantined in `/references`, injected into the agent's context window only at the exact moment they are required.

## 2. Why Imperative Operational Language?
Awwwards-tier development relies heavily on precise timing and memory management. Passive descriptions ("You can use GSAP to animate things") lead to non-deterministic agent outputs. Imperative phrasing ("Construct the typographic motion") forces the agent to generate direct, actionable code rather than meandering boilerplate.

## 3. The Unification of the Playhead
The most critical architectural decision is enforcing the concept of the **Unified Playhead**. Modern creative sites fail when DOM scrolling, Canvas animations, and WebGL renders operate on independent temporal loops. By explicitly instructing the synchronization of Lenis `scroll`, GSAP `ScrollTrigger`, and GLSL `uTime`, we eliminate visual desync and jitter. 

## 4. Hybrid Cinematics vs. Pure WebGL
We formalized the "Hybrid 3D Cinematic" approach (the Apple / ORYZO paradigm) because pure WebGL rendering of photorealistic scenes with raytraced lighting is impossible on mobile devices within a 60fps constraint. Mapping high-keyframe video scrubbing to the scroll playhead is the definitive solution for achieving art-directed, high-fidelity motion on the web, paired with lightweight WebGL overlays for interactivity.

## 5. Performance as an Absolute Guardrail
Creative development is effectively systems programming for the browser. By establishing strict memory pre-allocation rules (no instantiation inside RAF) and clamping the Device Pixel Ratio, we preempt the most common failure modes of AI-generated interactive web code: thermal throttling and memory leaks.
