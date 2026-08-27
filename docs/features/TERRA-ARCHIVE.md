# Feature: TERRA ARCHIVE — Subterranean LIDAR & Cartographic Journey

## Goal
Build an interactive subterranean cartography and archaeological discovery experience designed like a documentary film opening, descending from Earth's crust (0m) to Archaean bedrock (-3,500m).

## Visual Identity & Design System
- **Palette**: Raw Subterranean Umber (`#141312`), Chalk Bone (`#EDE8DE`), Terracotta Ochre (`#C86432`), Silt (`#8C8275`).
- **Typography**: `Playfair Display` serif paired with `Space Grotesk` & `JetBrains Mono` cartographic sans.
- **Guardrails**: Zero generic AI purple gradients or neon cyberpunk tropes.

## Cinematic 4-Shot Choreography
1. **Shot 1 (0%–25% Scroll)**: "THE TOPOGRAPHIC SURFACE"
   - Fullscreen Canvas 2D generative contour isolines via 2D Perlin noise.
   - Interactive cursor elevation ripple displacement.
2. **Shot 2 (25%–55% Scroll)**: "STRATIGRAPHIC BREAKDOWN"
   - Pinned 3D perspective section with 4 layered topographic strata slices separating along Z-axis at 45°.
   - Title decomposes into fine sand/dust particles cascading downward under gravity.
3. **Shot 3 (55%–85% Scroll)**: "THE ARCHAEOLOGICAL SPECIMEN"
   - Pinned horizontal gallery showcasing 3 scanned relics (Obsidian Antikythera Core, Proto-Elamite Basalt Cylinder, Cuneiform Geodetic Monolith).
   - Interactive optical loupe with 2.4x zoom and RGB chromatic aberration on hover.
4. **Shot 4 (85%–100% Scroll)**: "THE CODEX RECONSTRUCTION"
   - Dispersed sand particles re-converge into the thesis statement *"WHAT LIES BENEATH SURVIVES ALL ERAS"*.
   - Immutable anchor memory (`baseX`, `baseY`), cursor repulsion force field, and Hooke's Law elastic spring return.

## Architecture & Data Flow
```
[Lenis Smooth Scroll] ──► [GSAP Central Ticker (lagSmoothing: 0)] ──► [ScrollTrigger Orchestrator]
                                                                               │
       ┌───────────────────────────────┬───────────────────────────────────────┼──────────────────────────────┐
       ▼                               ▼                                       ▼                              ▼
[ContourCanvas (Shot 1)]   [StratigraphicStack (Shot 2)]           [SpecimenGallery (Shot 3)]    [SandParticleEngine (Shots 2 & 4)]
• Perlin Noise Field       • 3D Perspective Strata Cards           • Horizontal Scroll Track     • Offscreen Typography Sampling
• Cursor Wave Ripple       • Z-Axis Separation                     • High-DPI Procedural Canvases • Gravity Drift & Hooke's Law
• Telemetry Scanlines      • Petrological Strata Dossiers          • Chromatic Aberration Loupe  • Anchor Memory Re-Convergence
```

## Subterranean Audio
Procedural Web Audio API engine (52Hz sub-bass oscillator + lowpass filter + brown noise seismic resonance + sonar chirps) with interactive mute toggle.
