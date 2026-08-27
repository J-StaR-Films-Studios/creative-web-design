# GSAP Terminology

**Tween**:
The single animation unit in GSAP that manipulates an object's properties over a duration from a start state to an end state.
_Avoid_: CSS animation, transition block, keyframe script

**Timeline**:
A container object that stores and orchestrates multiple Tweens along a shared temporal sequence.
_Avoid_: animation chain, callback queue, delay list

**Position Parameter**:
An optional argument in Timeline methods defining exactly when a Tween inserts relative to the timeline sequence or other labels.
_Avoid_: manual offset, setTimeout chain

**Scrub**:
A ScrollTrigger property that ties an animation's execution progress directly to the user's scrollbar position.
_Avoid_: scroll listener, scroll-jacking

**Trigger**:
The DOM element whose position in the viewport determines when a ScrollTrigger animation activates.
_Avoid_: scroll target, scroll observer

**Ease**:
A mathematical timing function that controls the acceleration and deceleration curve of an animated property.
_Avoid_: speed curve, transition timing
