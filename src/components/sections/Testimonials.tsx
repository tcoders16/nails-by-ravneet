"use client";

import { testimonials } from "@/data/testimonials";
import SectionReveal from "@/components/ui/SectionReveal";
import { Star } from "lucide-react";

function Card({ item }: { item: (typeof testimonials)[0] }) {
  return (
    <div
      style={{
        width: "clamp(260px, 80vw, 320px)", flexShrink: 0,
        margin: "0 0.6rem",
        padding: "1.75rem",
        background: "#fff",
        borderRadius: "20px",
        border: "1px solid #EEE9E3",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", gap: "3px", marginBottom: "1rem" }}>
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} size={11} fill="#8B1930" style={{ color: "#8B1930" }} />
        ))}
      </div>
      <p style={{
        fontFamily: "var(--font-playfair)", fontSize: "0.95rem",
        color: "#333", lineHeight: 1.7, fontStyle: "italic",
        marginBottom: "1.25rem",
      }}>
        &ldquo;{item.quote}&rdquo;
      </p>
      <div style={{ borderTop: "1px solid #E8E4DE", paddingTop: "0.85rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <img
          src={item.avatar}
          alt={item.name}
          style={{
            width: 38, height: 38,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
            border: "2px solid #F0EDE9",
          }}
        />
        <div>
          <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.82rem", fontWeight: 600, color: "#111" }}>{item.name}</div>
          <div className="eyebrow" style={{ marginTop: "2px" }}>{item.service}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const d1 = [...testimonials, ...testimonials];
  const d2 = [...testimonials, ...testimonials];

  return (
    <section id="reviews" style={{ background: "#F8F5F1", padding: "5rem 0", overflow: "hidden" }}>
      <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionReveal>
          <div style={{ borderBottom: "1px solid #E0DDD8", paddingBottom: "2.5rem", marginBottom: "3rem" }}>
            <span className="eyebrow">Client Love</span>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 700, lineHeight: 1, marginTop: "0.6rem", color: "#111" }}>
              What They Say
            </h2>
          </div>
        </SectionReveal>
      </div>

      {/* Lane 1 */}
      <div className="group" style={{ overflow: "hidden", marginBottom: "0.75rem" }}>
        <div
          className="flex group-hover:[animation-play-state:paused]"
          style={{ animation: "marquee 36s linear infinite", width: "max-content" }}
        >
          {d1.map((item, i) => <Card key={`a-${i}`} item={item} />)}
        </div>
      </div>

      {/* Lane 2 */}
      <div className="group" style={{ overflow: "hidden" }}>
        <div
          className="flex group-hover:[animation-play-state:paused]"
          style={{ animation: "marquee-reverse 30s linear infinite", width: "max-content" }}
        >
          {d2.map((item, i) => <Card key={`b-${i}`} item={item} />)}
        </div>
      </div>
    </section>
  );
}
