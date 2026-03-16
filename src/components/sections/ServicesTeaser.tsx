"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
import SectionReveal from "@/components/ui/SectionReveal";

const EASE = [0.22, 1, 0.36, 1] as const;
const featured = services.filter(s => s.featured).slice(0, 3);

export default function ServicesTeaser() {
  return (
    <section id="services" style={{ background: "#fff", padding: "5rem 0" }}>
      <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>

        <SectionReveal>
          <div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-3"
            style={{ borderBottom: "1px solid #E8E4DE", paddingBottom: "2.5rem", marginBottom: "3rem" }}
          >
            <div>
              <span className="eyebrow">What I Offer</span>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 700, lineHeight: 1, marginTop: "0.6rem", color: "#111" }}>
                The Services
              </h2>
            </div>
            <a
              href="/services"
              className="hidden md:inline-flex"
              style={{ fontFamily: "var(--font-poppins)", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8B1930", textDecoration: "none", borderBottom: "1px solid #8B1930", paddingBottom: "1px", alignSelf: "flex-end", whiteSpace: "nowrap" }}
            >
              View all services →
            </a>
          </div>
        </SectionReveal>

        {/* 3 featured cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
          {featured.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px 0px" }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.09 }}
              className="group"
              style={{ background: "#FAF8F5", borderRadius: "20px", overflow: "hidden", border: "1px solid #EEE9E3", cursor: "default" }}
              whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(0,0,0,0.09)" }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
                <img
                  src={svc.image} alt={svc.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)" }}
                  className="group-hover:scale-[1.06]"
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", top: "0.85rem", right: "0.85rem", fontFamily: "var(--font-poppins)", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", background: "#8B1930", color: "#fff", padding: "0.28rem 0.65rem", borderRadius: "100px" }}>
                  Popular
                </div>
              </div>
              <div style={{ padding: "1.25rem 1.4rem 1.4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                  <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 600, color: "#111", lineHeight: 1.2 }}>{svc.title}</h3>
                  <span style={{ fontFamily: "var(--font-playfair)", fontSize: "0.9rem", fontWeight: 600, color: "#8B1930", paddingLeft: "0.6rem", flexShrink: 0 }}>{svc.price}</span>
                </div>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.76rem", color: "#888", lineHeight: 1.6, marginBottom: "1rem" }}>{svc.description}</p>
                <a href="/book" style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#111", textDecoration: "none", borderBottom: "1px solid #111", paddingBottom: "1px", transition: "color 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#8B1930"; e.currentTarget.style.borderBottomColor = "#8B1930"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#111"; e.currentTarget.style.borderBottomColor = "#111"; }}
                >
                  Book this service →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <SectionReveal delay={0.1}>
          <div style={{ paddingTop: "2.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <a href="/services" className="btn-dark" style={{ padding: "0.85rem 2rem" }}>See All Services</a>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#aaa" }}>12 treatments available</span>
          </div>
        </SectionReveal>

      </div>
    </section>
  );
}
