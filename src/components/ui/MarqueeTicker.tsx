"use client";

const items = [
  { text: "Gel Extensions",     type: "serif" },
  { text: "Chrome Powder",      type: "sans"  },
  { text: "Custom Nail Art",    type: "serif" },
  { text: "French Ombré",       type: "sans"  },
  { text: "Nail Sculpting",     type: "serif" },
  { text: "Non-Toxic Products", type: "sans"  },
  { text: "Bespoke Designs",    type: "serif" },
  { text: "Est. 2016",          type: "sans"  },
];

export default function MarqueeTicker() {
  const doubled = [...items, ...items];
  return (
    <div style={{
      borderTop: "1px solid #E8E4DE",
      borderBottom: "1px solid #E8E4DE",
      background: "#FAF8F5",
      overflow: "hidden",
      padding: "0.8rem 0",
    }}>
      <div style={{ display: "flex", width: "max-content", animation: "marquee 30s linear infinite" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "0 2rem" }}>
            {item.type === "serif" ? (
              <span style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "0.78rem",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#555",
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
              }}>
                {item.text}
              </span>
            ) : (
              <span style={{
                fontFamily: "var(--font-poppins)",
                fontSize: "0.52rem",
                fontWeight: 500,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#bbb",
                whiteSpace: "nowrap",
              }}>
                {item.text}
              </span>
            )}
            <span style={{
              marginLeft: "2rem",
              width: 3, height: 3,
              borderRadius: "50%",
              background: "#8B1930",
              display: "inline-block",
              flexShrink: 0,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}
