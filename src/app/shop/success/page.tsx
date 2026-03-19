"use client";

import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/cursor/CustomCursor"), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ShopSuccess() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <CustomCursor />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ maxWidth: 500, width: "100%", textAlign: "center" }}
      >
        {/* Icon */}
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(139,25,48,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
          <CheckCircle size={34} style={{ color: "#8B1930" }} />
        </div>

        {/* Brand */}
        <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.5rem", color: "#8B1930", marginBottom: "1rem" }}>
          Nails by Tisha
        </div>

        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,6vw,3rem)", fontWeight: 700, color: "#111", lineHeight: 1, marginBottom: "1rem" }}>
          Order Confirmed!
        </h1>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.86rem", color: "#666", lineHeight: 1.8, marginBottom: "2.5rem" }}>
          Thank you for your order. A confirmation email has been sent with your receipt. Your order will be processed and shipped within 2–3 business days.
        </p>

        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E8E4DE", padding: "1.5rem", marginBottom: "2rem" }}>
          {[
            "Order confirmation sent to your email",
            "Tracked shipping with delivery updates",
            "Questions? Contact Ravneet directly",
          ].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8B1930", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "#666" }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/shop" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            fontFamily: "var(--font-poppins)", fontSize: "0.68rem", fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase",
            background: "#111", color: "#fff", borderRadius: "100px",
            padding: "0.85rem 1.75rem", textDecoration: "none",
          }}>
            <ShoppingBag size={13} /> Continue Shopping
          </a>
          <a href="/" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            fontFamily: "var(--font-poppins)", fontSize: "0.68rem", fontWeight: 500,
            color: "#888", textDecoration: "none",
          }}>
            Back to Nails by Tisha <ArrowRight size={13} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
