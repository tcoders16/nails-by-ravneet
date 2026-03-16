"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { label: "Services", href: "/services" },
  { label: "Shop",     href: "/shop"     },
  { label: "Gallery",  href: "/#gallery" },
  { label: "About",    href: "/#about"   },
  { label: "Contact",  href: "/contact"  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled || open ? "rgba(255,255,255,0.97)" : "transparent",
          borderBottom: scrolled || open ? "1px solid #E8E4DE" : "1px solid transparent",
          backdropFilter: scrolled || open ? "blur(14px)" : "none",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1280, margin: "0 auto",
            padding: "0 1.5rem", height: "64px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          {/* ── Logo mark ── */}
          <a href="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: "0.75rem" }} onClick={close}>

            {/* SVG emblem */}
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              {/* Outer ring */}
              <circle cx="21" cy="21" r="20" stroke="#8B1930" strokeWidth="1.1"/>
              {/* Inner ring */}
              <circle cx="21" cy="21" r="15.5" stroke="#8B1930" strokeWidth="0.45" opacity="0.45"/>
              {/* Small top diamond pip */}
              <path d="M21 4.5 L22.3 6.5 L21 8.5 L19.7 6.5Z" fill="#8B1930"/>
              {/* R letterform — stem */}
              <line x1="14.5" y1="13" x2="14.5" y2="30" stroke="#8B1930" strokeWidth="1.9" strokeLinecap="round"/>
              {/* R bowl */}
              <path d="M14.5 13 L20.5 13 C24 13 26.5 15 26.5 18 C26.5 21 24 22.8 20.5 22.8 L14.5 22.8" stroke="#8B1930" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              {/* R leg */}
              <line x1="20" y1="22.8" x2="27.5" y2="30" stroke="#8B1930" strokeWidth="1.9" strokeLinecap="round"/>
            </svg>

            {/* Wordmark */}
            <div style={{ lineHeight: 1 }}>
              <div style={{
                fontFamily: "var(--font-poppins)",
                fontSize: "0.38rem",
                fontWeight: 600,
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "#8B1930",
                marginBottom: "1px",
                whiteSpace: "nowrap",
              }}>
                Nails by
              </div>
              <div style={{
                fontFamily: "var(--font-great-vibes)",
                fontSize: "1.75rem",
                color: "#111",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}>
                Ravneet
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "3px" }}>
                <div style={{ width: 18, height: 1, background: "#8B1930" }} />
                <div style={{
                  fontFamily: "var(--font-poppins)",
                  fontSize: "0.35rem",
                  fontWeight: 500,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#bbb",
                  whiteSpace: "nowrap",
                }}>
                  Luxury Nail Studio
                </div>
              </div>
            </div>
          </a>

          {/* ── Desktop nav (hidden below lg) ── */}
          <nav
            className="hidden lg:flex"
            style={{ alignItems: "center", gap: "2rem" }}
          >
            {links.map(l => (
              <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </nav>

          {/* ── Desktop CTA + Admin (hidden below lg) ── */}
          <div className="hidden lg:flex" style={{ alignItems: "center", gap: "1.25rem" }}>
            <a href="/book" className="btn-dark" style={{ padding: "0.6rem 1.3rem", fontSize: "0.65rem" }}>
              Book Appointment
            </a>
            <a
              href="/admin"
              style={{
                fontFamily: "var(--font-poppins)", fontSize: "0.55rem",
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "#ccc", textDecoration: "none", transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#888"}
              onMouseLeave={e => e.currentTarget.style.color = "#ccc"}
            >
              Admin
            </a>
          </div>

          {/* ── Mobile hamburger (shown below lg) ── */}
          <button
            className="lg:hidden"
            onClick={() => setOpen(o => !o)}
            style={{
              background: "none", border: "none",
              padding: "6px", cursor: "pointer",
              lineHeight: 0, color: "#111",
              borderRadius: "8px",
            }}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden"
            style={{
              position: "fixed", top: 64, left: 0, right: 0, bottom: 0,
              background: "#fff", zIndex: 99,
              display: "flex", flexDirection: "column",
              padding: "2rem 1.75rem 2.5rem",
              overflowY: "auto",
            }}
          >
            {/* Nav links */}
            {links.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                onClick={close}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(1.8rem, 7vw, 2.5rem)", fontWeight: 700,
                  color: "#111", textDecoration: "none",
                  borderBottom: "1px solid #E8E4DE",
                  paddingBottom: "1.1rem", marginBottom: "1.1rem",
                  display: "block",
                }}
              >
                {l.label}
              </motion.a>
            ))}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.3 }}
              style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <a href="/book" onClick={close} className="btn-dark" style={{ textAlign: "center" }}>
                Book Appointment
              </a>
              <a
                href="/admin"
                onClick={close}
                style={{
                  fontFamily: "var(--font-poppins)", fontSize: "0.6rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#ccc", textDecoration: "none", textAlign: "center",
                  paddingTop: "0.5rem",
                }}
              >
                Admin
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
