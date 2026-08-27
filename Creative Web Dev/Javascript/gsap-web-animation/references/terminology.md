# Terminology

**GSAP (GreenSock Animation Platform)**:
The high-performance JavaScript animation library used to animate CSS properties, SVG, canvas, and generic JavaScript objects.
_Avoid_: CSS animator, animation engine script

**Tween**:
A single animation instance that interpolates property values of target objects over a specified duration.
_Avoid_: CSS keyframe, transition script

**Timeline**:
A container for sequencing, nesting, and managing multiple tweens and callbacks along a synchronized global playhead.
_Avoid_: animation chain, timeout queue

**Vars Object**:
The JavaScript key-value configuration object passed to GSAP methods defining destination values, timing, easing, and callbacks.
_Avoid_: options object, style dictionary

**Stagger**:
An animation parameter that offsets the start time of animations across an array of target elements matching a single selector.
_Avoid_: delay loop, manual interval

**Ease**:
The mathematical acceleration and deceleration curve governing the rate of property change throughout a tween's duration.
_Avoid_: speed curve, timing function

**Zero-Duration Tween (gsap.set)**:
An instantaneous property assignment executed through GSAP to establish baseline visual states without time-based interpolation.
_Avoid_: manual CSS override, instant animation
