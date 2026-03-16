"use client";
import { useRef } from "react";
import { motion, useSpring } from "framer-motion";

interface Props {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

export default function MagneticButton({
  children,
  variant = "primary",
  href,
  onClick,
  disabled,
  type = "button",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 16 });
  const y = useSpring(0, { stiffness: 180, damping: 16 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.3);
    y.set((e.clientY - r.top  - r.height / 2) * 0.3);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const cls = variant === "primary" ? "btn-dark" : "btn-outline";

  return href ? (
    <motion.a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      className={cls}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.a>
  ) : (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.button>
  );
}
