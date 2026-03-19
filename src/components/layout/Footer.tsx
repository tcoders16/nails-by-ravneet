"use client";
import { CLIENT } from "@/config/client";

export default function Footer() {
  const nav = [
    { label: "Services",  href: "/services" },
    { label: "Shop",      href: "/shop"     },
    { label: "Gallery",   href: "/#gallery" },
    { label: "About",     href: "/#about"   },
    { label: "Contact",   href: "/contact"  },
  ];

  return (
    <footer style={{ background: "#111", color: "#fff", padding: "3.5rem 0 2rem" }}>
      <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Top row */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "2.5rem", marginBottom: "1.75rem" }}
        >
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "2rem", color: "#fff", lineHeight: 1 }}>{CLIENT.brandName}</div>
            <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#555", marginTop: "5px" }}>Luxury Nail Studio</div>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {nav.map(l => (
              <a
                key={l.label}
                href={l.href}
                style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "#777", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#777")}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Book CTA */}
          <a
            href="/book"
            style={{
              fontFamily: "var(--font-poppins)", fontSize: "0.62rem", fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px",
              padding: "0.65rem 1.5rem", color: "#fff", textDecoration: "none",
              transition: "background 0.2s, border-color 0.2s", whiteSpace: "nowrap",
              display: "inline-block",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          >
            Book Appointment →
          </a>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", color: "#444" }}>
            © {new Date().getFullYear()} {CLIENT.brandName}. All rights reserved.
          </p>
          <a href="/contact" style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", color: "#555", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#555"}
          >
            Contact Us
          </a>
        </div>

      </div>
    </footer>
  );
}
