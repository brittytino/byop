"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type MotionFadeProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function MotionFade({ children, delay = 0, className }: MotionFadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
