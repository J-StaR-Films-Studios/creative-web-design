# Architectural Rationale & Synthesis Briefing

## 1. Executive Summary

This Master Skill for **Creative Web Development** synthesizes 44 extracted modular skills and the foundational Immersive Web Development Learning Specification into a single, production-grade operational framework. It addresses the exact technical tier represented by world-class creative studios (Awwwards / FWA / CSSDA tier: Huy Phan, BUNQ LABS, Butter, Superlocal, and ORYZO AI).

---

## 2. Core Architectural Decisions & Trade-Offs

### A. Input-to-Computation Pipeline Over "Animation"
- **Decision**: Reject treating motion as isolated visual styling; model all interactions as an explicit **Input-to-Computation Pipeline** (Pointer/Scroll Input $\rightarrow$ Damped State/Uniforms $\rightarrow$ Computation/GPU Shaders/Canvas Buffers $\rightarrow$ Rendered Output).
- **Rationale**: This mental model bridges DOM manipulation, 2D Canvas physics, and WebGL/GLSL shaders under a unified mathematical framework.

### B. Frame Sequences Over Native `<video>` Tags (Hybrid Cinematics)
- **Decision**: Mandate extracted frame sequence scrubbing on HTML5 Canvas rather than scrubbing native `<video>.currentTime`.
- **Rationale**: `<video>` scrub operations suffer from hardware GOP keyframe decoding latency, frame drops, and browser inconsistencies. Preloading high-efficiency WebP/JPEG arrays guarantees deterministic, 60 FPS frame-exact playback synchronized with real-time WebGL overlays (the ORYZO / Superlocal paradigm).

### C. Anchor Memory & Spring Restitution in Particle Systems
- **Decision**: Standardize on immutable anchor memory `(baseX, baseY)` and linear spring-back damping ($x_{t+1} = x_t - (x_t - baseX) / \text{damping}$) for text and image particle systems.
- **Rationale**: Provides physical kinetic weight during mouse proximity scattering while guaranteeing 100% legibility reconstruction when interaction concludes.

### D. Hard DPR Clamping & Memory Pre-Allocation Invariants
- **Decision**: Strictly enforce $\min(\text{DPR}, 2.0)$ and zero object instantiation in RAF loops (`useFrame`, `requestAnimationFrame`).
- **Rationale**: Eliminates GPU fill-rate throttling on high-DPI (Retina/4K) displays and prevents JavaScript engine Garbage Collection (GC) sweeps from causing frame stutter.

---

## 3. Structure & Agent Engineering Integrity

- **`SKILL.md` (Router & Master Pipeline)**: Kept strictly concise (209 lines, well under the 500-line ceiling) focusing on the operational execution pipeline, decision matrix, and checkable completion gates.
- **`references/` (Deep Blueprints & Mathematical Knowledge)**: Modularized across 8 specialized domains, containing exact formulas (Photometric Luminance, Stride math, GLSL Simplex/FBM Noise), and production-grade recipes.
- **Positive Steering & Imperative Commands**: Direct, actionable instructions ("Construct the particle buffer", "Clamp devicePixelRatio") eliminating descriptive sprawl.
