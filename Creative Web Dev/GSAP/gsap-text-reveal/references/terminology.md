# Terminology

**SplitText**:
A specialized GSAP plugin that breaks text content inside HTML elements into nested inline-block `div` wrappers representing lines, words, and characters while preserving accessibility attributes.
_Avoid_: text chopper, CSS span slicer, DOM string parser

**gsap.from()**:
A GSAP tween method that defines the initial starting values of target properties, animating them towards their default CSS rendered state.
_Avoid_: gsap.to entrance, reverse tweening

**Stagger**:
A timing controller in GSAP that introduces an incremental delay between each element in an array of animation targets.
_Avoid_: loop delay, keyframe delay, setTimeout cascade

**Split Types**:
The granularity levels specified during SplitText initialization: `lines`, `words`, and `chars`.
_Avoid_: text tokens, character nodes
