# Terminology

**Normalized Card Progress**:
The mapped progress value (clamped 0 to 1) describing the specific animation life-cycle of a single card within the total global scroll distance.
_Avoid_: scroll percent, step count

**Distance Multiplier**:
An index-dependent attenuation scalar (`1 - index * factor`) applied to diagonal exit coordinates to vary stacking depth across cards.
_Avoid_: random jitter, arbitrary gap

**Zero-Duration Transform**:
The technique of applying transforms with `duration: 0, ease: "none"` inside continuous frame callbacks to force immediate GPU matrix updates.
_Avoid_: instant tween, zero delay

**Lag Smoothing**:
GSAP's internal mechanism to prevent animation jumps after CPU lag spikes. Must be zeroed (`lagSmoothing(0)`) when linked to smooth scroll engines.
_Avoid_: frame drop compensation, jitter filter
