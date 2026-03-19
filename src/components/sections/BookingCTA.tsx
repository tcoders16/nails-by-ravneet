"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";

interface FormData { name: string; email: string; subject: string; message: string; }
type Status = "idle" | "loading" | "success" | "error";

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-poppins)", fontSize: "0.85rem",
  color: "#fff", background: "rgba(255,255,255,0.05)",
  border: "1.5px solid rgba(255,255,255,0.12)",
  padding: "0.8rem 1rem", width: "100%",
  outline: "none", borderRadius: "10px",
  WebkitAppearance: "none", appearance: "none",
  transition: "border-color 0.2s, background 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block", marginBottom: "0.5rem",
  fontFamily: "var(--font-poppins)", fontSize: "0.62rem",
  fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
};

export default function BookingCTA() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    await new Promise(r => setTimeout(r, 800));
    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section id="booking" style={{ background: "#0F0F0F", padding: "5rem 0" }}>
      <div
        className="px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start"
        style={{ maxWidth: 1280, margin: "0 auto" }}
      >

        {/* Copy */}
        <SectionReveal direction="left">
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Got a question?
          </span>
          <h2 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            fontWeight: 700, lineHeight: 0.95,
            color: "#fff", marginTop: "0.6rem", marginBottom: "0.5rem",
          }}>
            Ask Your<br />Question.
          </h2>
          <div style={{ width: 32, height: 1.5, background: "#8B1930", marginBottom: "1.5rem" }} />
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: "340px", marginBottom: "2rem" }}>
            Curious about a service, pricing, or what style suits you best? Send me a message — I read every one personally.
          </p>
          {["Reply within 24 hours", "No question is too small", "Free nail consultation available"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.65rem" }}>
              <span style={{ width: 4, height: 4, background: "#8B1930", borderRadius: "50%", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>{t}</span>
            </div>
          ))}
          <a
            href="/book"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              marginTop: "2rem",
              fontFamily: "var(--font-poppins)", fontSize: "0.65rem",
              fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)", textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: "1px",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)"; }}
          >
            Ready to book instead? →
          </a>
        </SectionReveal>

        {/* Form */}
        <SectionReveal direction="right" delay={0.1}>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: "2rem" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(139,25,48,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                  <Check size={22} style={{ color: "#8B1930" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>Message Sent!</h3>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.83rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                  Thanks for reaching out. Tisha will get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>Your Name *</label>
                    <input type="text" name="name" placeholder="Your name" required value={form.name} onChange={onChange}
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" name="email" placeholder="you@email.com" required value={form.email} onChange={onChange}
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label style={labelStyle}>What&apos;s it about?</label>
                  <select name="subject" value={form.subject} onChange={onChange}
                    style={{ ...inputStyle, color: form.subject ? "#fff" : "rgba(255,255,255,0.3)" }}
                    onFocus={onFocus} onBlur={onBlur}>
                    <option value="" style={{ background: "#0F0F0F" }}>Choose a topic…</option>
                    <option value="service-query" style={{ background: "#0F0F0F" }}>Service enquiry</option>
                    <option value="pricing" style={{ background: "#0F0F0F" }}>Pricing question</option>
                    <option value="nail-style" style={{ background: "#0F0F0F" }}>Nail style advice</option>
                    <option value="bridal" style={{ background: "#0F0F0F" }}>Bridal / event nails</option>
                    <option value="other" style={{ background: "#0F0F0F" }}>Something else</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>Your Question *</label>
                  <textarea name="message" placeholder="What's on your mind? Ask away…" rows={5} required
                    value={form.message} onChange={onChange}
                    style={{ ...inputStyle, resize: "none", minHeight: "120px" }}
                    onFocus={onFocus} onBlur={onBlur} />
                </div>

                {status === "error" && (
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#d08080" }}>
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    fontFamily: "var(--font-poppins)", fontSize: "0.68rem",
                    fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase",
                    background: "#fff", color: "#111",
                    padding: "0.9rem 2rem", border: "1.5px solid #fff",
                    borderRadius: "100px", alignSelf: "flex-start",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    transition: "background 0.22s, color 0.22s",
                    opacity: status === "loading" ? 0.6 : 1,
                    cursor: status === "loading" ? "default" : "pointer",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#111"; }}
                >
                  {status === "loading"
                    ? <><Loader2 size={14} className="animate-spin" />Sending…</>
                    : <><Send size={13} />Send Message</>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </SectionReveal>
      </div>
    </section>
  );
}
