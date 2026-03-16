"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingBookButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#booking"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            bottom: "1.75rem",
            right: "1.75rem",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#8B1930",
            color: "#fff",
            textDecoration: "none",
            padding: "0.75rem 1.4rem",
            borderRadius: "100px",
            boxShadow: "0 4px 24px rgba(139,25,48,0.35)",
            fontFamily: "var(--font-poppins)",
            fontSize: "0.62rem",
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
          whileHover={{ scale: 1.05, boxShadow: "0 6px 32px rgba(139,25,48,0.45)" }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Pulse ring */}
          <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{
              position: "absolute",
              width: 8, height: 8,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.6)",
              animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
            }} />
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "block", flexShrink: 0 }} />
          </span>
          Book Now
        </motion.a>
      )}
    </AnimatePresence>
  );
}
