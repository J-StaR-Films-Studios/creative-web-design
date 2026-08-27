# Worked Motion Examples

## 1. Reusable Tactile Button Component

```jsx
import { motion } from "motion/react";

export function AnimatedButton({
  children,
  stiffness = 300,
  damping = 15,
  onClick
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{
        type: "spring",
        stiffness,
        damping
      }}
      className="btn-primary"
    >
      {children}
    </motion.button>
  );
}
```

---

## 2. Staggered List with Parent/Child Variants

```jsx
import { motion } from "motion/react";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export function FeatureList({ features }) {
  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="feature-list"
    >
      {features.map((feature, idx) => (
        <motion.li key={idx} variants={itemVariants} className="feature-item">
          {feature}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

---

## 3. Draggable Card with Elastic Constraints

```jsx
import { motion } from "motion/react";

export function DraggableCard() {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -120, right: 120, top: -50, bottom: 50 }}
      dragElastic={0.2}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="drag-card"
    >
      <p>Drag me around</p>
    </motion.div>
  );
}
```

---

## 4. Multi-Step Switcher with AnimatePresence (`wait` mode)

```jsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function StepSwitcher() {
  const [step, setStep] = useState(1);

  return (
    <div className="step-container">
      <button onClick={() => setStep((s) => (s === 1 ? 2 : 1))}>
        Toggle Step
      </button>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="step-card"
          >
            <h3>Step One</h3>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="step-card"
          >
            <h3>Step Two</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## 5. Smooth Collapsible Accordion with Layout Auto-Animation

```jsx
import { useState } from "react";
import { motion } from "motion/react";

export function CollapsibleItem({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsOpen(!isOpen)}
      className="accordion-container"
    >
      <motion.h3 layout>{title}</motion.h3>
      {isOpen && (
        <motion.p
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.p>
      )}
    </motion.div>
  );
}
```

---

## 6. Pulsing Live Status Indicator

```jsx
import { motion } from "motion/react";

export function LiveBadge() {
  return (
    <motion.div
      className="live-badge"
      animate={{
        scale: [1, 1.12, 1],
        boxShadow: [
          "0 0 0px rgba(255, 0, 0, 0.4)",
          "0 0 10px rgba(255, 0, 0, 0.8)",
          "0 0 0px rgba(255, 0, 0, 0.4)"
        ]
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        repeatType: "mirror",
        repeatDelay: 0.5
      }}
    >
      LIVE
    </motion.div>
  );
}
```
