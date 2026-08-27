# Terminology

**Continuity**:
The visual and spatial coherence maintained across route changes so that the interface feels like a single unified environment.
_Avoid_: page hopping, hard blinking

**Transition Lifecycle**:
The deterministic sequence of hooks (`leave`, `load`, `enter`, `cleanup`) executed during route changes.
_Avoid_: page loader script, transition hack

**Container Handoff**:
The process of swapping the outgoing page DOM container with the incoming page DOM container within a persistent shell.
_Avoid_: full page wipe, iframe reload

**Archetype**:
A standardized, reusable motion pattern (e.g., Column Wipe, Side-by-Side, Parallax) applied across routes.
_Avoid_: bespoke one-off animation

**Reduced Motion Fallback**:
An alternative minimal transition executed when users have enabled motion sensitivity settings at the OS level.
_Avoid_: ignoring accessibility settings
