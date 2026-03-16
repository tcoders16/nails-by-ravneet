"use client";

import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

const EASE = [0.22, 1, 0.36, 1] as const;
const stats = [
  { n: "500+", label: "Happy Clients" },
  { n: "8+",   label: "Years of Art"  },
  { n: "50+",  label: "Nail Styles"   },
];

export default function Hero() {
  return (
    <section style={{ background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ─────────────────────────────────────────────────── */}
      {/*  MOBILE layout (hidden on md+)                      */}
      {/* ─────────────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col" style={{ flex: 1, paddingTop: "5rem" }}>

        {/* Portfolio card — padded from navbar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ position: "relative", margin: "0 1.25rem", flexShrink: 0 }}
        >
          {/* Image */}
          <div style={{
            borderRadius: "20px",
            overflow: "hidden",
            aspectRatio: "3/4",
            boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
          }}>
            <img
              src="https://images.unsplash.com/photo-1672815554809-37e355eddd24?auto=format&fit=crop&w=900&q=80"
              alt="Nail art by Ravneet"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
            {/* Bottom gradient */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
              background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)",
              borderRadius: "0 0 20px 20px",
            }} />
          </div>

          {/* Name pill — bottom center of image */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
            style={{
              position: "absolute", bottom: "1.25rem",
              left: "50%", transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.93)",
              backdropFilter: "blur(12px)",
              padding: "0.5rem 1.1rem",
              borderRadius: "100px",
              display: "flex", alignItems: "center", gap: "0.6rem",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#8B1930", flexShrink: 0 }} />
            <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1rem", color: "#111", lineHeight: 1 }}>Ravneet</div>
            <div style={{ width: 1, height: 12, background: "#E0DDD8" }} />
            <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.45rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#777" }}>Nail Artist</div>
          </motion.div>

          {/* Est. badge — top left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            style={{
              position: "absolute", top: "1rem", left: "1rem",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              padding: "0.3rem 0.75rem",
              borderRadius: "100px",
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}
          >
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#8B1930" }} />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.45rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#777" }}>Est. 2016</span>
          </motion.div>
        </motion.div>

        {/* Text section */}
        <div style={{ padding: "1.75rem 1.5rem 1.5rem", flex: 1 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <span className="eyebrow" style={{ marginBottom: "0.75rem", display: "flex" }}>Luxury Nail Studio</span>
          </motion.div>

          {["The Art", "of Perfect", "Nails."].map((line, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.65, ease: EASE, delay: 0.4 + i * 0.08 }}
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(2.8rem, 11vw, 4.5rem)",
                  fontWeight: 700,
                  lineHeight: 0.92,
                  letterSpacing: "-0.02em",
                  color: "#111",
                  display: "block",
                }}
              >
                {line}
              </motion.h1>
            </div>
          ))}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.75 }}
            style={{
              fontFamily: "var(--font-poppins)", fontSize: "0.8rem",
              color: "#777", lineHeight: 1.75,
              marginTop: "1.1rem", marginBottom: "1.75rem",
            }}
          >
            Bespoke gel, chrome & hand-painted nail art.
            Every set, a wearable masterpiece.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.88 }}
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            <a
              href="#booking"
              style={{
                fontFamily: "var(--font-poppins)", fontSize: "0.64rem",
                fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase",
                background: "#111", color: "#fff",
                padding: "1rem 0", textAlign: "center", textDecoration: "none",
                display: "block", borderRadius: "100px",
                border: "1.5px solid #111",
              }}
            >
              Book an Appointment
            </a>
            <a
              href="#gallery"
              style={{
                fontFamily: "var(--font-poppins)", fontSize: "0.62rem",
                fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#999", textDecoration: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
              }}
            >
              View Portfolio →
            </a>
          </motion.div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────── */}
      {/*  DESKTOP layout (hidden on mobile)                  */}
      {/* ─────────────────────────────────────────────────── */}
      <div style={{ height: "5rem" }} className="hidden md:block" />

      <div
        className="hidden md:grid md:grid-cols-2 gap-12 px-10"
        style={{
          flex: 1,
          maxWidth: 1280, margin: "0 auto", width: "100%",
          paddingTop: "2.5rem", paddingBottom: "2rem",
          alignItems: "center",
        }}
      >
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}
          >
            <div style={{ width: 24, height: 1, background: "#8B1930", flexShrink: 0 }} />
            <span className="eyebrow">Luxury Nail Studio — Est. 2016</span>
          </motion.div>

          {["The Art", "of Perfect", "Nails."].map((line, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.32 + i * 0.1 }}
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(2.8rem, 10vw, 9rem)",
                  fontWeight: 700,
                  lineHeight: 0.92,
                  letterSpacing: "-0.025em",
                  color: "#111",
                  display: "block",
                }}
              >
                {line}
              </motion.h1>
            </div>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
            style={{
              fontFamily: "var(--font-poppins)", fontSize: "0.87rem",
              color: "#777", lineHeight: 1.8,
              maxWidth: "360px", marginTop: "2rem", marginBottom: "2rem",
            }}
          >
            Bespoke gel, chrome & hand-painted nail art by Ravneet.
            Every set, a wearable masterpiece.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.88 }}
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}
          >
            <MagneticButton href="#booking">Book an Appointment</MagneticButton>
            <a
              href="#gallery"
              style={{
                fontFamily: "var(--font-poppins)", fontSize: "0.7rem",
                fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#555", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                borderBottom: "1px solid transparent",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#111"; e.currentTarget.style.borderBottomColor = "#111"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderBottomColor = "transparent"; }}
            >
              View Portfolio <span style={{ fontSize: "1em" }}>→</span>
            </a>
          </motion.div>
        </div>

        {/* Right: Portfolio card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.4 }}
          style={{ position: "relative", display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Image frame */}
          <div style={{
            position: "relative",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
            aspectRatio: "4/5",
            width: "100%",
          }}>
            <img
              src="https://images.unsplash.com/photo-1672815554809-37e355eddd24?auto=format&fit=crop&w=900&q=80"
              alt="Nail art by Ravneet"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />

            {/* Subtle gradient at bottom for name tag legibility */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 35%, transparent 65%)",
            }} />

            {/* Name tag — bottom center */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.93)",
                backdropFilter: "blur(12px)",
                padding: "0.65rem 1.4rem",
                borderRadius: "100px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                boxShadow: "0 2px 20px rgba(0,0,0,0.12)",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B1930", flexShrink: 0 }} />
              <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.15rem", color: "#111", lineHeight: 1 }}>Ravneet</div>
              <div style={{ width: 1, height: 14, background: "#E0DDD8", flexShrink: 0 }} />
              <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.5rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#777" }}>Nail Artist</div>
            </motion.div>
          </div>

          {/* Stats strip below image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5, ease: EASE }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #EEE9E3",
              overflow: "hidden",
            }}
          >
            {stats.map(({ n, label }, i) => (
              <div key={label} style={{
                padding: "1.1rem 1rem",
                textAlign: "center",
                borderRight: i < 2 ? "1px solid #EEE9E3" : "none",
              }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.5rem", fontWeight: 700, color: "#111", lineHeight: 1 }}>{n}</div>
                <div className="eyebrow" style={{ marginTop: "0.35rem" }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Desktop stats bar: hidden — stats are on image */}

      {/* Desktop scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        style={{ padding: "1.25rem", gap: "0.4rem" }}
        className="hidden md:flex flex-col items-center"
      >
        <span className="eyebrow">Scroll</span>
        <motion.div
          style={{ width: 1, height: 32, background: "#ddd", transformOrigin: "top" }}
          animate={{ scaleY: [1, 0.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Mobile stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 1.0 }}
        className="md:hidden flex"
        style={{ borderTop: "1px solid #E8E4DE" }}
      >
        {stats.map(({ n, label }, i) => (
          <div key={label} style={{ flex: 1, padding: "1.1rem 0.5rem", textAlign: "center", borderRight: i < 2 ? "1px solid #E8E4DE" : "none" }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.4rem", fontWeight: 700, color: "#111" }}>{n}</div>
            <div className="eyebrow" style={{ marginTop: "0.2rem" }}>{label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
