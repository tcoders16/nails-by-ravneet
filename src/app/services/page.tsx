"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientLayout from "@/components/ClientLayout";
import { services } from "@/data/services";
import type { Service } from "@/data/services";
import { Clock } from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/cursor/CustomCursor"), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;

const CATEGORIES = [
  { key: "all",        label: "All Services" },
  { key: "manicure",   label: "Manicure" },
  { key: "extensions", label: "Extensions" },
  { key: "nail-art",   label: "Nail Art" },
  { key: "specialty",  label: "Specialty" },
  { key: "pedicure",   label: "Pedicure" },
] as const;

function ServiceCard({ svc, i }: { svc: Service; i: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
      className="group"
      style={{
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid #EEE9E3",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
        <img
          src={svc.image}
          alt={svc.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)" }}
          className="group-hover:scale-[1.06]"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 55%)" }} />
        {svc.featured && (
          <div style={{ position: "absolute", top: "0.85rem", right: "0.85rem", fontFamily: "var(--font-poppins)", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", background: "#8B1930", color: "#fff", padding: "0.28rem 0.65rem", borderRadius: "100px" }}>
            Popular
          </div>
        )}
        <div style={{ position: "absolute", bottom: "0.85rem", left: "0.85rem", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)", borderRadius: "8px", padding: "0.3rem 0.7rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <Clock size={10} style={{ color: "#8B1930" }} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", fontWeight: 600, color: "#444" }}>{svc.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.4rem 1.5rem 1.6rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.55rem" }}>
          <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 600, color: "#111", lineHeight: 1.2 }}>
            {svc.title}
          </h3>
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: "0.95rem", fontWeight: 600, color: "#8B1930", flexShrink: 0, paddingLeft: "0.75rem" }}>
            {svc.price}
          </span>
        </div>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#888", lineHeight: 1.65, marginBottom: "1.25rem", flex: 1 }}>
          {svc.description}
        </p>
        <a
          href="/book"
          style={{ fontFamily: "var(--font-poppins)", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#111", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem", borderBottom: "1px solid #111", paddingBottom: "1px", transition: "color 0.2s, border-color 0.2s", alignSelf: "flex-start" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#8B1930"; e.currentTarget.style.borderBottomColor = "#8B1930"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#111"; e.currentTarget.style.borderBottomColor = "#111"; }}
        >
          Book this →
        </a>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <ClientLayout>
      <CustomCursor />
      <Navbar />

      <main style={{ background: "#FAF8F5", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E8E4DE", paddingTop: "7rem", paddingBottom: "3.5rem" }}>
          <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "#8B1930" }}>
                What I Offer
              </span>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.8rem, 7vw, 5rem)", fontWeight: 700, lineHeight: 1, color: "#111", marginTop: "0.6rem", marginBottom: "1rem" }}>
                Services
              </h1>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.9rem", color: "#777", lineHeight: 1.75, maxWidth: 480 }}>
                Every treatment is tailored to your nails, your vision, and your lifestyle — using only premium, non-toxic products.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: "3rem", paddingBottom: "6rem" }}>

          {/* Category filter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  fontFamily: "var(--font-poppins)", fontSize: "0.7rem", fontWeight: 500,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "0.55rem 1.2rem", borderRadius: "100px",
                  border: activeCategory === cat.key ? "1.5px solid #111" : "1.5px solid #E8E4DE",
                  background: activeCategory === cat.key ? "#111" : "#fff",
                  color: activeCategory === cat.key ? "#fff" : "#888",
                  cursor: "pointer", transition: "all 0.18s",
                }}
              >
                {cat.label}
                {activeCategory === cat.key && cat.key !== "all" && (
                  <span style={{ marginLeft: "0.4rem", opacity: 0.6, fontSize: "0.62rem" }}>
                    ({services.filter(s => s.category === cat.key).length})
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Count */}
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", color: "#aaa", marginBottom: "2rem" }}>
            {filtered.length} service{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((svc, i) => (
                <ServiceCard key={svc.id} svc={svc} i={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ marginTop: "5rem", paddingTop: "3.5rem", borderTop: "1px solid #E8E4DE", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.25rem" }}
          >
            <p style={{ fontFamily: "var(--font-great-vibes)", fontSize: "2rem", color: "#8B1930" }}>Ready to get started?</p>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.84rem", color: "#888", maxWidth: 380, lineHeight: 1.7 }}>
              Not sure which service is right for you? Book a free video consultation and we&apos;ll figure it out together.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a href="/book" className="btn-dark" style={{ padding: "0.85rem 2rem" }}>Book an Appointment</a>
              <a href="/contact" className="btn-outline" style={{ padding: "0.85rem 2rem" }}>Ask a Question</a>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </ClientLayout>
  );
}
