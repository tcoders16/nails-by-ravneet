"use client";

import { motion } from "framer-motion";
import SectionReveal from "@/components/ui/SectionReveal";
import MagneticButton from "@/components/ui/MagneticButton";

const EASE = [0.22, 1, 0.36, 1] as const;
const stats  = [{ n: "500+", label: "Clients" }, { n: "8+", label: "Years" }, { n: "50+", label: "Styles" }];
const values = [
  "Non-toxic, cruelty-free products only",
  "Tools sterilised before every single client",
  "Tailored to your nail health & lifestyle",
];

export default function About() {
  return (
    <section id="about" style={{ background: "#fff", padding: "5rem 0" }}>
      <div
        className="px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
        style={{ maxWidth: 1280, margin: "0 auto" }}
      >

        {/* Image panel */}
        <SectionReveal direction="left">
          <div style={{ position: "relative" }}>
            <img
              src="/images/hero/about.jpg"
              alt="Tisha — Nail Artist"
              style={{
                width: "100%", maxWidth: 460,
                aspectRatio: "3/4",
                objectFit: "cover", display: "block",
                borderRadius: "20px",
              }}
            />

            {/* Stat cards — desktop only to avoid overflow */}
            {stats.map(({ n, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: EASE }}
                className="hidden md:block"
                style={{
                  position: "absolute",
                  top: `${12 + i * 29}%`,
                  right: "-1.5rem",
                  background: "#fff",
                  padding: "0.85rem 1.1rem",
                  borderTop: "2px solid #8B1930",
                  minWidth: "100px",
                  borderRadius: "0 12px 12px 0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.4rem", fontWeight: 700, color: "#111", lineHeight: 1 }}>{n}</div>
                <div className="eyebrow" style={{ marginTop: "0.2rem" }}>{label}</div>
              </motion.div>
            ))}

            {/* Name tag */}
            <div style={{
              position: "absolute", bottom: "1.5rem", left: "1.5rem",
              background: "rgba(255,255,255,0.92)",
              padding: "0.6rem 1rem",
              backdropFilter: "blur(6px)",
              borderLeft: "2px solid #8B1930",
              borderRadius: "10px",
            }}>
              <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.3rem", color: "#111", lineHeight: 1 }}>Tisha</div>
              <div className="eyebrow" style={{ marginTop: "2px" }}>Nail Artist & Educator</div>
            </div>
          </div>

          {/* Stat strip — mobile only */}
          <div className="flex md:hidden" style={{ marginTop: "1.25rem", borderTop: "1px solid #E8E4DE" }}>
            {stats.map(({ n, label }, i) => (
              <div key={label} style={{
                flex: 1, padding: "1rem 0.5rem", textAlign: "center",
                borderRight: i < 2 ? "1px solid #E8E4DE" : "none",
              }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.4rem", fontWeight: 700, color: "#111", lineHeight: 1 }}>{n}</div>
                <div className="eyebrow" style={{ marginTop: "0.2rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Text panel */}
        <SectionReveal direction="right" delay={0.15}>
          <span className="eyebrow">The Artist</span>
          <h2 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 700, lineHeight: 1.1,
            color: "#111", marginTop: "0.6rem", marginBottom: "0.5rem",
          }}>
            Behind Every<br />Perfect Set
          </h2>
          <div style={{ width: 32, height: 1.5, background: "#8B1930", marginBottom: "1.5rem" }} />

          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.87rem", color: "#555", lineHeight: 1.8, marginBottom: "1rem" }}>
            It started at age fourteen with a bottle of drugstore polish and a bathroom mirror. Tisha
            wasn&apos;t trying to build a brand — she was just obsessed. Flash-forward eight years, and that
            obsession turned into a studio where every client leaves with nails that feel like a piece of
            wearable art.
          </p>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.87rem", color: "#555", lineHeight: 1.8, marginBottom: "2rem" }}>
            No rushed appointments. No cookie-cutter sets. Just Tisha, her tools, and a genuine
            conversation about exactly what you want — then delivering it better than you imagined.
          </p>

          <div style={{ borderTop: "1px solid #E8E4DE", paddingTop: "1.5rem", marginBottom: "2rem" }}>
            {values.map(v => (
              <div key={v} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.7rem" }}>
                <span style={{ width: 4, height: 4, background: "#8B1930", borderRadius: "50%", flexShrink: 0, marginTop: "0.5rem" }} />
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.83rem", color: "#555" }}>{v}</span>
              </div>
            ))}
          </div>

          <MagneticButton href="#booking">Book with Tisha</MagneticButton>
        </SectionReveal>
      </div>
    </section>
  );
}
