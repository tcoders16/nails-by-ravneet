"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientLayout from "@/components/ClientLayout";
import { MapPin, Phone, Mail, Clock, Instagram, Send } from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/cursor/CustomCursor"), { ssr: false });
const EASE = [0.22, 1, 0.36, 1] as const;

const INFO = [
  {
    icon: <MapPin size={18} />,
    label: "Studio Location",
    lines: ["123 Rose Petal Lane, Suite 2B", "City, State 00000"],
  },
  {
    icon: <Phone size={18} />,
    label: "Phone",
    lines: ["(555) 012-3456"],
    note: "Text or call — I reply same day",
  },
  {
    icon: <Mail size={18} />,
    label: "Email",
    lines: ["hello@nailsbytisha.com"],
    note: "I respond within 24 hours",
  },
  {
    icon: <Clock size={18} />,
    label: "Studio Hours",
    lines: ["Tue – Fri: 10 am – 7 pm", "Saturday: 9 am – 5 pm"],
    note: "Closed Sun & Mon",
  },
];

const inputBase: React.CSSProperties = {
  fontFamily: "var(--font-poppins)", fontSize: "0.85rem",
  color: "#111", background: "#fff",
  border: "1.5px solid #E8E4DE",
  padding: "0.85rem 1rem", width: "100%",
  outline: "none", borderRadius: "12px",
  transition: "border-color 0.2s, box-shadow 0.2s",
  WebkitAppearance: "none", appearance: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block", marginBottom: "0.5rem",
  fontFamily: "var(--font-poppins)", fontSize: "0.6rem",
  fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase", color: "#888",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#8B1930";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,25,48,0.08)";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#E8E4DE";
  e.currentTarget.style.boxShadow = "none";
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  }

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
                Get In Touch
              </span>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.8rem, 7vw, 5rem)", fontWeight: 700, lineHeight: 1, color: "#111", marginTop: "0.6rem", marginBottom: "1rem" }}>
                Contact
              </h1>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.9rem", color: "#777", lineHeight: 1.75, maxWidth: 440 }}>
                Have a question about a service, want to discuss your next set, or just want to say hi? I&apos;d love to hear from you.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: "4rem", paddingBottom: "6rem" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Left — contact info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }}>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", fontWeight: 700, color: "#111", marginBottom: "2rem" }}>
                Studio Details
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem" }}>
                {INFO.map(({ icon, label, lines, note }) => (
                  <div key={label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{ width: 42, height: 42, borderRadius: "12px", background: "rgba(139,25,48,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B1930", flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.3rem" }}>{label}</div>
                      {lines.map(l => (
                        <div key={l} style={{ fontFamily: "var(--font-poppins)", fontSize: "0.88rem", color: "#111", lineHeight: 1.5 }}>{l}</div>
                      ))}
                      {note && <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", color: "#aaa", marginTop: "0.2rem" }}>{note}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div style={{ borderTop: "1px solid #E8E4DE", paddingTop: "2rem" }}>
                <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: "1rem" }}>Follow Along</div>
                <a
                  href="https://instagram.com"
                  target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", fontFamily: "var(--font-poppins)", fontSize: "0.85rem", color: "#111", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#8B1930"}
                  onMouseLeave={e => e.currentTarget.style.color = "#111"}
                >
                  <Instagram size={18} />
                  @nailsbytisha
                </a>
              </div>

              {/* Quick book nudge */}
              <div style={{ marginTop: "2.5rem", background: "#fff", border: "1px solid #E8E4DE", borderLeft: "3px solid #8B1930", borderRadius: "12px", padding: "1.25rem 1.5rem" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1rem", fontWeight: 600, color: "#111", marginBottom: "0.4rem" }}>Want to book directly?</div>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#888", lineHeight: 1.6, marginBottom: "0.9rem" }}>
                  Skip the wait — pick your slot and get confirmed instantly.
                </p>
                <a href="/book" className="btn-dark" style={{ fontSize: "0.65rem", padding: "0.6rem 1.3rem" }}>Book Now →</a>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: EASE }}>
              <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid #E8E4DE", padding: "2.5rem", boxShadow: "0 2px 24px rgba(0,0,0,0.04)" }}>
                {sent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "3rem 1rem" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(139,25,48,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                      <Send size={22} style={{ color: "#8B1930" }} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#111", marginBottom: "0.75rem" }}>Message Sent!</h3>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.82rem", color: "#888", lineHeight: 1.7 }}>
                      Thanks for reaching out, {form.name}. I&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#111", marginBottom: "0.4rem" }}>Send a Message</h2>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#aaa", marginBottom: "2rem" }}>I read every message personally.</p>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label style={labelStyle}>Your Name</label>
                          <input type="text" placeholder="Tisha" style={inputBase} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onFocus={onFocus} onBlur={onBlur} required />
                        </div>
                        <div>
                          <label style={labelStyle}>Email</label>
                          <input type="email" placeholder="you@email.com" style={inputBase} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onFocus={onFocus} onBlur={onBlur} required />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Subject</label>
                        <select style={inputBase} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} onFocus={onFocus} onBlur={onBlur}>
                          <option value="">Choose a topic…</option>
                          <option>Service enquiry</option>
                          <option>Pricing question</option>
                          <option>Bridal / event nails</option>
                          <option>Product from shop</option>
                          <option>Something else</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Message</label>
                        <textarea
                          placeholder="Tell me what's on your mind…"
                          rows={5}
                          style={{ ...inputBase, resize: "none", minHeight: "130px" }}
                          value={form.message}
                          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                          onFocus={onFocus} onBlur={onBlur}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={sending || !form.name || !form.email || !form.message}
                        className="btn-dark"
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: sending ? 0.6 : 1 }}
                      >
                        {sending ? (
                          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Sending…</>
                        ) : (
                          <><Send size={14} />Send Message</>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </ClientLayout>
  );
}
