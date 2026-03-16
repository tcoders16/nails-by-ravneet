"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const photos = [
  "/images/gallery/g1.jpg",
  "/images/gallery/g5.jpg",
  "/images/gallery/g9.jpg",
  "/images/gallery/g3.jpg",
  "/images/gallery/g7.jpg",
  "/images/gallery/g11.jpg",
  "/images/gallery/g2.jpg",
  "/images/gallery/g6.jpg",
];

const labels = ["Chrome Powder", "Gel Extensions", "French Ombré", "Custom Art", "Nail Sculpting", "Bespoke Design", "Glitter Gel", "3D Art"];

export default function PhotoStrip() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div style={{ background: "#0F0F0F", padding: "4rem 0", overflow: "hidden" }}>

      {/* Header row */}
      <div
        className="px-6 md:px-10"
        style={{ maxWidth: 1280, margin: "0 auto 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}
      >
        <div>
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
            ✦ &nbsp; Portfolio
          </span>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 700, color: "#fff", marginTop: "0.4rem", lineHeight: 1 }}>
            Every Set, a Story
          </h2>
        </div>
        <a
          href="#gallery"
          style={{
            fontFamily: "var(--font-poppins)", fontSize: "0.62rem", fontWeight: 500,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)", textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,0.15)",
            paddingBottom: "2px",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
        >
          View Full Gallery →
        </a>
      </div>

      {/* Horizontal scroll strip */}
      <div
        ref={ref}
        style={{
          display: "flex",
          gap: "0.75rem",
          paddingLeft: "clamp(1.5rem, 5vw, 5rem)",
          paddingRight: "clamp(1.5rem, 5vw, 5rem)",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
        } as React.CSSProperties}
      >
        {photos.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              flexShrink: 0,
              width: "clamp(180px, 28vw, 260px)",
              scrollSnapAlign: "start",
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              aspectRatio: "3/4",
              cursor: "pointer",
            }}
            whileHover="hover"
          >
            <motion.img
              src={src}
              alt={labels[i]}
              variants={{ hover: { scale: 1.06 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* Label overlay */}
            <motion.div
              variants={{ hover: { opacity: 1 } }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
                display: "flex", alignItems: "flex-end",
                padding: "1.25rem 1rem",
              }}
            >
              <span style={{
                fontFamily: "var(--font-poppins)", fontSize: "0.6rem",
                fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                color: "#fff",
              }}>
                {labels[i]}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
          Scroll to explore
        </span>
      </div>
    </div>
  );
}
