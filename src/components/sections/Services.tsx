"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
import SectionReveal from "@/components/ui/SectionReveal";
import MagneticButton from "@/components/ui/MagneticButton";

const EASE = [0.22, 1, 0.36, 1] as const;

function ServiceCard({ svc, i }: { svc: (typeof services)[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
      className="group"
      style={{
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid #EEE9E3",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        cursor: "default",
      }}
      whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
    >
      {/* Photo */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
        <img
          src={svc.image}
          alt={svc.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
          className="group-hover:scale-[1.06]"
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 55%)",
        }} />
        {/* Featured badge */}
        {svc.featured && (
          <div style={{
            position: "absolute", top: "0.85rem", right: "0.85rem",
            fontFamily: "var(--font-poppins)", fontSize: "0.52rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            background: "#8B1930", color: "#fff",
            padding: "0.28rem 0.65rem",
            borderRadius: "100px",
          }}>
            Popular
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "1.4rem 1.5rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.55rem" }}>
          <h3 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "1.15rem",
            fontWeight: 600,
            color: "#111",
            lineHeight: 1.2,
          }}>
            {svc.title}
          </h3>
          <span style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#8B1930",
            flexShrink: 0,
            paddingLeft: "0.75rem",
          }}>
            {svc.price}
          </span>
        </div>

        <p style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "0.78rem",
          color: "#888",
          lineHeight: 1.65,
          marginBottom: "1.1rem",
        }}>
          {svc.description}
        </p>

        <a
          href="#booking"
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.62rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#111",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            borderBottom: "1px solid #111",
            paddingBottom: "1px",
            transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#8B1930";
            e.currentTarget.style.borderBottomColor = "#8B1930";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "#111";
            e.currentTarget.style.borderBottomColor = "#111";
          }}
        >
          Book this service →
        </a>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" style={{ background: "#fff", padding: "5rem 0" }}>
      <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <SectionReveal>
          <div
            style={{ borderBottom: "1px solid #E8E4DE", paddingBottom: "2.5rem", marginBottom: "3rem" }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4"
          >
            <div>
              <span className="eyebrow">What I Offer</span>
              <h2 style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2.2rem, 6vw, 4rem)",
                fontWeight: 700, lineHeight: 1,
                marginTop: "0.6rem", color: "#111",
              }}>
                The Services
              </h2>
            </div>
            <p className="hidden md:block" style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "0.84rem", color: "#777",
              maxWidth: "300px", lineHeight: 1.7,
            }}>
              Every treatment is tailored to your vision — using only premium, non-toxic products.
            </p>
          </div>
        </SectionReveal>

        {/* Card grid — 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} i={i} />
          ))}
        </div>

        <SectionReveal delay={0.1}>
          <div style={{ paddingTop: "3rem" }}>
            <MagneticButton href="#booking">Book a Service</MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
