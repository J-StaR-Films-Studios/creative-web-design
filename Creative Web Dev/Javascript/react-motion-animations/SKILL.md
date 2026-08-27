---
name: react-motion-animations
description: |
  Implement professional, smooth, physics-based UI animations in React applications using Motion (`motion/react`).
  Use when: adding entrance/mount animations, hover/tap micro-interactions, staggered list reveals with variants,
  draggable UI elements with boundaries, exit animations on unmount (`AnimatePresence`), auto-animating container
  resizing (`layout`), pulsing keyframe loops, or page route transitions with React Router.
  Triggers: react animation, framer motion, motion/react, animate react component, staggered animation,
  draggable card react, page transition react, exit animation react, AnimatePresence.
---

# React Motion Animation Engine

Apply declarative, performant animations in React using `motion/react`. Focus on physical realism, natural easing curves, and clean exit/entry lifecycles.

## Ground Rules

1. **Import Source**: Always import from `motion/react` (not `framer-motion`).
2. **Relative Coordinates**: `x` and `y` values represent pixel offsets relative to the element's natural layout position.
3. **Physics vs Duration**: Use spring physics (`type: "spring"`) for user gestures (clicks, hovers, drags); use easing and duration for passive transitions.
4. **AnimatePresence Invariants**: Every direct child of `<AnimatePresence>` must have a unique `key` and an `exit` definition.

---

## Workflow

```
1. Setup & Primitives → 2. Mount & Transitions → 3. Gestures → 4. Variants & Staggering → 5. Drag & Boundaries → 6. Exit & Route Transitions → 7. Layout Reflows
```

For canonical terms and definitions, see [terminology.md](references/terminology.md).
For specific property configuration tables and defaults, see [animation-properties.md](references/animation-properties.md).
For complete worked components, see [examples.md](references/examples.md).

---

## Phase 1: Primitives & Mount Animations

Convert target HTML tags into `motion.<tag>` primitives and define mount transitions.

1. Convert HTML tags to Motion elements: `<div>` → `<motion.div>`, `<button>` → `<motion.button>`.
2. Define the starting state in `initial` (e.g., `{ opacity: 0, y: -20 }`).
3. Define the destination state in `animate` (e.g., `{ opacity: 1, y: 0 }`).
4. Configure the trajectory in `transition`:
   - Set `duration` in seconds (e.g., `0.35` for snappy UI, `0.8` for hero text).
   - Set `ease`: `"easeOut"` (entering from outside/settling), `"easeIn"` (accelerating away), or `"easeInOut"` (cinematic).

### Completion Gate
- [ ] Element uses `<motion.<tag>>` primitive.
- [ ] `initial` and `animate` states are declared.
- [ ] `transition` has explicit duration and easing curve.

---

## Phase 2: Gestures & Micro-Interactions

Add tactile feedback for interactive components like buttons, links, and cards.

1. Define `whileHover` with target transforms (e.g., `{ scale: 1.05, y: -2 }`).
2. Define `whileTap` with compression transforms (e.g., `{ scale: 0.95, y: 1 }`).
3. Set spring physics in `transition`:
   - Set `type: "spring"`.
   - Set `stiffness`: `300` (snappy button) to `100` (gentle).
   - Set `damping`: `15` to `20` (prevents lingering oscillations).
4. Encapsulate into reusable components passing `{children}` and forwarding props.

### Completion Gate
- [ ] Element reacts to hover and press with distinct tactile states.
- [ ] Spring physics configured with balanced stiffness and damping.

---

## Phase 3: Variants & Staggered Hierarchies

Coordinate sequenced multi-element entrance animations without prop duplication.

1. Declare a parent variant object outside the component:
   ```javascript
   const containerVariants = {
     hidden: { opacity: 0 },
     visible: {
       opacity: 1,
       transition: { staggerChildren: 0.15, delayChildren: 0.2 }
     }
   };
   ```
2. Declare a child variant object with identical state keys:
   ```javascript
   const itemVariants = {
     hidden: { opacity: 0, y: 20 },
     visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
   };
   ```
3. Attach to parent: `<motion.ul variants={containerVariants} initial="hidden" animate="visible">`.
4. Attach to children: `<motion.li variants={itemVariants}>` on every mapped item. Do not repeat `initial` or `animate` on children.

### Completion Gate
- [ ] Parent and child variants share identical state keys (e.g., `hidden` / `visible`).
- [ ] Parent defines `staggerChildren` inside its transition.
- [ ] Child elements inherit execution state automatically.

---

## Phase 4: Draggable Interfaces & Boundaries

Implement draggable cards, modals, or sheets with elastic constraint boundaries.

1. Add `drag` prop (or `drag="x"` / `drag="y"` for single axis constraint).
2. Set pixel boundary limits using `dragConstraints`:
   ```jsx
   <motion.div
     drag
     dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
     dragElastic={0.2}
   />
   ```
3. Set `dragElastic` between `0` (hard wall) and `1` (full stretch). Use `0.2` for balanced tactile resistance.

### Completion Gate
- [ ] `drag` is enabled on the element.
- [ ] `dragConstraints` enclose allowable movement box.
- [ ] `dragElastic` prevents card from getting lost outside viewport.
