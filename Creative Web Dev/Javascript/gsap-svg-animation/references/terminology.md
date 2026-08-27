# Terminology

**GSAP Timeline (`gsap.timeline`)**:
A powerful sequencing tool that acts as a container for tweens, coordinating timing, delays, and global defaults across multiple animated elements.
_Avoid_: animation chain, setTimeout queue

**Position Parameter**:
An argument in GSAP timeline methods (`'<50%'`, `'<'`, `'+=1'`) that defines when a tween starts relative to other tweens in the timeline.
_Avoid_: hardcoded delay, manual timer

**Inline SVG**:
Raw SVG XML elements embedded directly within the HTML document body, enabling full CSS styling and JavaScript DOM manipulation of inner paths.
_Avoid_: SVG image tag, external vector link

**Yoyo Animation**:
A property (`yoyo: true`) that reverses the animation back to its starting values on alternating iterations when paired with a repeat count.
_Avoid_: alternating loop, bounce timer

**Elastic Easing (`elastic.out`)**:
An easing curve that overshoots the target destination before oscillating into resting position, simulating physical spring/rubber dynamics.
_Avoid_: spring simulation, physics plugin
