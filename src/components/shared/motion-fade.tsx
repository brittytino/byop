"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ReactNode, useRef } from "react";

type MotionFadeProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function MotionFade({ children, delay = 0, className }: MotionFadeProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    gsap.fromTo(
      container.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, delay, ease: "power2.out" }
    );
  }, { scope: container });

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  );
}
