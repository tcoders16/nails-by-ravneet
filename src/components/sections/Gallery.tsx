"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryItems, galleryCategories, type GalleryCategory } from "@/data/gallery";
import SectionReveal from "@/components/ui/SectionReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Gallery() {
  const [active, setActive] = useState<GalleryCategory>("All");
  const filtered = active === "All" ? galleryItems : galleryItems.filter(i => i.category === active);

  return (
    <section id="gallery" style={{ background: "#F8F5F1", padding: "5rem 0" }}>
      <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>

        <SectionReveal>
          <div
            style={{ borderBottom: "1px solid #E0DDD8", paddingBottom: "2.5rem", marginBottom: "2.5rem" }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-5"
          >
            <div>
              <span className="eyebrow">My Work</span>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 700, lineHeight: 1, marginTop: "0.6rem", color: "#111" }}>
                The Gallery
              </h2>
            </div>

            {/* Filter pills — horizontally scrollable on mobile */}
            <div
              style={{
                display: "flex", gap: "1.5rem",
                overflowX: "auto", paddingBottom: "2px",
                WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
                scrollbarWidth: "none",
              }}
              className="[&::-webkit-scrollbar]:hidden"
            >
              {galleryCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  style={{
                    fontFamily: "var(--font-poppins)", fontSize: "0.68rem",
                    fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
                    color: active === cat ? "#111" : "#aaa",
                    background: "none", border: "none", padding: "0",
                    borderBottom: active === cat ? "1px solid #111" : "1px solid transparent",
                    paddingBottom: "2px",
                    transition: "color 0.2s, border-color 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </SectionReveal>

        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE, delay: i * 0.02 }}
                className="group relative overflow-hidden"
                style={{
                  aspectRatio: item.span === "tall" ? "3/4" : "1/1",
                  ...(item.span === "wide" || item.span === "large" ? { gridColumn: "span 2" } : {}),
                  borderRadius: "14px",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                    display: "block",
                  }}
                  className="group-hover:scale-[1.04] transition-transform duration-500"
                />
                <div
                  style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)",
                    opacity: 0, transition: "opacity 0.3s ease",
                    display: "flex", flexDirection: "column", justifyContent: "flex-end",
                    padding: "0.75rem",
                  }}
                  className="group-hover:!opacity-100"
                >
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
                    {item.category}
                  </span>
                  <span style={{ fontFamily: "var(--font-playfair)", fontSize: "0.85rem", color: "#fff", fontStyle: "italic" }}>
                    {item.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
