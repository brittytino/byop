"use client";

import { motion, HTMLMotionProps } from "framer-motion";

export function MotionDiv(props: HTMLMotionProps<"div">) {
  return <motion.div {...props} />;
}
