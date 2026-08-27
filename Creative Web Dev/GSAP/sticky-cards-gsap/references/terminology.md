# Terminology

**Sticky Stacking**:
A layout pattern where multiple full-viewport cards pin to the viewport top sequentially, allowing following cards to slide directly over previous cards.
_Avoid_: static accordion, absolute card overlay

**Capsule Morphing**:
A geometric transition interpolating border radius from high pill dimensions (400px/150px) down to standard border radius (25px) synchronously with container scale.
_Avoid_: shape morph, svg clip path animation

**Double-Layer Character Masking**:
A technique where each character is housed in an outer `overflow: hidden` container and translated via an inner nested span.
_Avoid_: opacity letter fade, css text clip

**Pin Spacing**:
ScrollTrigger configuration parameter determining whether padding is injected below a pinned element to push downstream content down.
_Avoid_: sticky margin, scroll buffer
