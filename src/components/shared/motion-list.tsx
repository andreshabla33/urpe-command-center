"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.025, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function MotionList({ children }: { children: ReactNode }) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {items.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
