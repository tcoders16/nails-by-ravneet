"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { charReveal, staggerContainer, EASE } from "@/utils/animations";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  wordByWord?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  wordByWord = false,
  as: Tag = "h2",
}: TextRevealProps) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  const units = wordByWord ? text.split(" ") : Array.from(text);

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer(wordByWord ? 0.07 : 0.03, delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      aria-label={text}
      className={`overflow-hidden ${className}`}
    >
      <Tag className="inline-block" aria-hidden="true">
        {units.map((unit, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden"
            style={wordByWord ? { marginRight: "0.25em" } : {}}
          >
            <motion.span
              variants={charReveal}
              className="inline-block"
              transition={{ duration: 0.55, ease: EASE }}
            >
              {unit === " " ? "\u00A0" : unit}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}
