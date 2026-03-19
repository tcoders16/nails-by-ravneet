"use client";

import { motion } from "framer-motion";
import { Video, Clock, Calendar } from "lucide-react";
import { CLIENT } from "@/config/client";
import SectionReveal from "@/components/ui/SectionReveal";

export default function ConsultationTeaser() {
  return (
    <section id="consultation" style={{ background: "#0F0F0F", padding: "5rem 0" }}>
      <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "3rem", alignItems: "center" }}>

          {/* Left — copy */}
          <SectionReveal direction="left">
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
              ✦ &nbsp; Free 30-Min Call
            </span>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.5rem,7vw,4.5rem)", fontWeight: 700, lineHeight: 0.95, color: "#fff", marginTop: "0.6rem", marginBottom: "1.25rem" }}>
              Meet {CLIENT.artistName},<br />Face to Face
            </h2>
            <div style={{ width: 32, height: 1.5, background: "#8B1930", marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.86rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 360, marginBottom: "2.5rem" }}>
              Book a free video consultation to plan your dream nails before your appointment — no commitment, just conversation.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2.5rem" }}>
              {[
                { icon: <Video size={14} />, label: "Live WebRTC video call" },
                { icon: <Clock size={14} />, label: "30 minutes, completely free" },
                { icon: <Calendar size={14} />, label: "One booking per week" },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#8B1930" }}>{icon}</span>
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}>{label}</span>
                </div>
              ))}
            </div>

            <a href="/book" style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              background: "#fff", color: "#111",
              fontFamily: "var(--font-poppins)", fontSize: "0.64rem",
              fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase",
              padding: "0.9rem 2rem", borderRadius: "100px", textDecoration: "none",
              transition: "background 0.22s, color 0.22s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.border = "1.5px solid #fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#111"; e.currentTarget.style.border = "1.5px solid transparent"; }}
            >
              <Video size={13} />
              Book Consultation
            </a>
          </SectionReveal>

          {/* Right — visual */}
          <SectionReveal direction="right" delay={0.15}>
            <motion.div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative glow */}
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,25,48,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

              {/* Mock call UI */}
              <div style={{ background: "#1A1A1A", borderRadius: "16px", aspectRatio: "16/9", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "url('/images/hero/hero.jpg') center/cover", opacity: 0.35 }} />
                <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(139,25,48,0.8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.5rem" }}>
                    <Video size={18} style={{ color: "#fff" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}>Live Consultation</span>
                </div>
                {/* Connected badge */}
                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: "rgba(0,0,0,0.6)", padding: "0.3rem 0.7rem", borderRadius: "100px", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "ping 1.5s infinite" }} />
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.55rem", color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em" }}>LIVE</span>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
                {["Mic", "Camera", "End"].map((ctrl, i) => (
                  <div key={ctrl} style={{ width: 36, height: 36, borderRadius: "50%", background: i === 2 ? "rgba(192,57,43,0.3)" : "rgba(255,255,255,0.06)", border: `1px solid ${i === 2 ? "rgba(192,57,43,0.4)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.45rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{ctrl}</span>
                  </div>
                ))}
              </div>

              {/* Bottom info */}
              <div style={{ marginTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>
                  30:00 · Virtual Consultation
                </div>
                <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1rem", color: "rgba(255,255,255,0.4)" }}>Tisha</div>
              </div>
            </motion.div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
