"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SectionReveal({ children, direction = "up", delay = 0, className }: Props) {
  const ref  = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const initial = {
    up:    { opacity: 0, y: 32,  x: 0  },
    left:  { opacity: 0, x: -40, y: 0  },
    right: { opacity: 0, x:  40, y: 0  },
  }[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
