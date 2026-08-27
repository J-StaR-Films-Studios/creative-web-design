# Terminology

**Shutter Transition**:
A multi-element visual wipe where partitioned geometric blocks expand from or contract toward viewport bounds to conceal page navigation.
_Avoid_: page loader, preloader spinner, slide transition

**Navigation Interceptor**:
An event handler bound to anchor tags that suppresses default browser navigation (`event.preventDefault()`) to execute an asynchronous exit timeline.
_Avoid_: link blocker, route kill

**Transform Origin Split**:
The deliberate assignment of opposing anchor points (`top` vs. `bottom`) across adjacent layout rows to enforce mirrored directional motion during scale transforms.
_Avoid_: directional flip, alignment invert

**Staggered Grid Animation**:
Sequential animation delays applied across structured DOM element sets based on directional flow parameters (`start`, `center`, `end`, `axis: "x"`).
_Avoid_: delay chain, manual timeout loop
