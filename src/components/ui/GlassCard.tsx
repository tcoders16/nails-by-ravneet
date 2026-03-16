"use client";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
}

export default function GlassCard({ children, className = "", featured = false }: GlassCardProps) {
  return (
    <motion.div
      className={className}
      style={{
        background: "#fff",
        borderTop: `2px solid ${featured ? "#8B1930" : "#E8E4DE"}`,
        padding: "1.75rem",
      }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
