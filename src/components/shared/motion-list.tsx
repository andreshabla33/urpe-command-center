"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const SPRING = { type: "spring", stiffness: 280, damping: 24 } as const;

export function MotionList({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const items = Array.isArray(children) ? children : [children];

  if (reduced) {
    return <div>{items}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.025, delayChildren: 0.04 },
        },
      }}
    >
      {items.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0, transition: SPRING },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
