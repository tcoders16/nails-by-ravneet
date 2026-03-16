"use client";

import { motion } from "framer-motion";
import SectionReveal from "@/components/ui/SectionReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    num: "01",
    title: "Consultation",
    desc: "We start with a conversation — your lifestyle, nail goals, and the exact look you're dreaming of.",
    detail: "Complimentary & unhurried",
  },
  {
    num: "02",
    title: "Bespoke Design",
    desc: "I handcraft a custom design just for you — every shape, colour, and detail tailored to perfection.",
    detail: "Fully personalised",
  },
  {
    num: "03",
    title: "Perfect Set",
    desc: "Leave with nails that feel as good as they look — sealed, finished, and photographed for your memory.",
    detail: "Lasting 3–4 weeks",
  },
];

export default function Process() {
  return (
    <section style={{ background: "#FAF8F5", padding: "5rem 0", borderTop: "1px solid #E8E4DE" }}>
      <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>

        <SectionReveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid #E8E4DE", paddingBottom: "2.5rem", marginBottom: "4rem" }}>
            <div>
              <span className="eyebrow">The Experience</span>
              <h2 style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2.2rem, 6vw, 4rem)",
                fontWeight: 700, lineHeight: 1,
                color: "#111", marginTop: "0.6rem",
              }}>
                How It Works
              </h2>
            </div>
            <p style={{
              fontFamily: "var(--font-poppins)", fontSize: "0.84rem",
              color: "#888", lineHeight: 1.7, maxWidth: "320px",
            }}>
              Three steps to your dream nails — designed around you, every time.
            </p>
          </div>
        </SectionReveal>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "0" }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: EASE }}
              style={{
                padding: "2.5rem 2rem",
                borderRight: i < 2 ? "1px solid #E8E4DE" : "none",
                borderBottom: "none",
                position: "relative",
              }}
              className="md:border-r-[1px] border-r-0 border-b-[1px] last:border-b-0 md:last:border-b-0 md:border-b-0"
            >
              {/* Connector line — desktop only */}
              {i < 2 && (
                <div
                  className="hidden md:block"
                  style={{
                    position: "absolute", top: "3.2rem", right: "-1px",
                    width: 1, height: 28,
                    background: "linear-gradient(to bottom, #8B1930, transparent)",
                  }}
                />
              )}

              {/* Step number */}
              <div style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                fontWeight: 800,
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: "1.5px #E0D8D1",
                marginBottom: "1.25rem",
                userSelect: "none",
              }}>
                {step.num}
              </div>

              {/* Wine accent line */}
              <div style={{ width: 24, height: 2, background: "#8B1930", marginBottom: "1.25rem" }} />

              <h3 style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "1.4rem", fontWeight: 700,
                color: "#111", marginBottom: "0.75rem", lineHeight: 1.2,
              }}>
                {step.title}
              </h3>

              <p style={{
                fontFamily: "var(--font-poppins)", fontSize: "0.84rem",
                color: "#666", lineHeight: 1.75, marginBottom: "1.25rem",
              }}>
                {step.desc}
              </p>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.45rem",
                background: "#F2EDE8",
                padding: "0.35rem 0.85rem",
                borderRadius: "100px",
              }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#8B1930", flexShrink: 0 }} />
                <span style={{
                  fontFamily: "var(--font-poppins)", fontSize: "0.58rem",
                  fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "#8B1930",
                }}>
                  {step.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
