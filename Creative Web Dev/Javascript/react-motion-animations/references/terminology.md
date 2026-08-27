# Motion Terminology

**Motion Element**:
A component primitive provided by `motion/react` prefixed with `motion.` (such as `<motion.div>`, `<motion.button>`) that intercepts props to handle CSS style updates and hardware-accelerated animations.
_Avoid_: animated div, framer tag

**Initial State**:
The visual CSS/transform properties applied to a motion element prior to mounting or before the animation initiates.
_Avoid_: starting CSS, mount style

**Animate State**:
The destination visual state that a motion element transitions toward once mounted or upon state change.
_Avoid_: target styling, active rule

**Exit State**:
The visual properties an element animates toward when removed from the React component tree, activated exclusively inside `<AnimatePresence>`.
_Avoid_: unmount css, destroy transition

**Variants**:
Structured objects defining named visual states (e.g., `hidden`, `visible`) across component hierarchies, enabling declarative animation reuse and parent-to-child coordination.
_Avoid_: animation presets, keyframe groups

**Stagger Children**:
A variant transition setting on a parent component that offsets the animation start time of each successive child by a specified number of seconds.
_Avoid_: cascading delay, loop offset

**Spring Physics**:
A motion algorithm driven by stiffness, damping, and mass simulating real elasticity rather than fixed time durations.
_Avoid_: bounce curve, cubic bezier bounce

**AnimatePresence**:
A React wrapper component that halts immediate DOM unmounting so that exit animations can play to completion.
_Avoid_: transition manager, DOM keeper

**Layout Animation**:
Automated GPU-driven translation and scaling computed automatically by Motion when an element's DOM bounding box changes size or position.
_Avoid_: auto reflow, dynamic height css
