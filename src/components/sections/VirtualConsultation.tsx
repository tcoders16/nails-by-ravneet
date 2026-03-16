"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Calendar, Clock, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Slot } from "@/lib/store";

const EASE = [0.22, 1, 0.36, 1] as const;

const TIMES = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30",
];

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function VirtualConsultation() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [step, setStep] = useState<"pick" | "form" | "done">("pick");
  const [form, setForm] = useState({ name: "", email: "" });
  const [booking, setBooking] = useState<{ roomId: string; date: string; time: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then(setSlots)
      .catch(console.error);
  }, []);

  // Build week days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  function getSlot(date: Date, time: string): Slot | undefined {
    return slots.find((s) => s.date === isoDate(date) && s.time === time);
  }

  async function handleBook() {
    if (!selectedSlot || !form.name || !form.email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: selectedSlot.id, clientName: form.name, clientEmail: form.email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Booking failed"); setLoading(false); return; }
      setBooking({ roomId: data.roomId, date: data.date, time: data.time });
      setStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  const callUrl = booking ? `${window.location.origin}/call/${booking.roomId}` : "";

  return (
    <section id="consultation" style={{ background: "#fff", padding: "5rem 0", borderTop: "1px solid #E8E4DE" }}>
      <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: "3rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", borderBottom: "1px solid #E8E4DE", paddingBottom: "2.5rem" }}
        >
          <div>
            <span className="eyebrow">Free 30-Min Call</span>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 700, lineHeight: 1, color: "#111", marginTop: "0.6rem" }}>
              Virtual Consultation
            </h2>
          </div>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {[
              { icon: <Video size={15} />, label: "Live video call" },
              { icon: <Clock size={15} />, label: "30 minutes" },
              { icon: <Calendar size={15} />, label: "1 per week" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#8B1930" }}>{icon}</span>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "#666" }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* STEP: PICK */}
          {step === "pick" && (
            <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {/* Week nav */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <button
                  onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
                  disabled={weekOffset === 0}
                  style={{ background: "none", border: "1px solid #E8E4DE", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: weekOffset === 0 ? "default" : "pointer", opacity: weekOffset === 0 ? 0.3 : 1 }}
                >
                  <ChevronLeft size={14} />
                </button>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", fontWeight: 500, color: "#555" }}>
                  {formatDate(days[0])} – {formatDate(days[6])}
                </span>
                <button
                  onClick={() => setWeekOffset((o) => o + 1)}
                  style={{ background: "none", border: "1px solid #E8E4DE", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer" }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Calendar grid — desktop: 7 cols, mobile: scroll */}
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"] } as React.CSSProperties}>
                <div style={{ display: "grid", gridTemplateColumns: "auto repeat(7,1fr)", minWidth: 600, gap: 0 }}>

                  {/* Time column header */}
                  <div style={{ padding: "0.6rem 0.75rem", borderBottom: "1px solid #E8E4DE" }} />

                  {/* Day headers */}
                  {days.map((d) => (
                    <div key={d.toISOString()} style={{
                      padding: "0.6rem 0.5rem", borderBottom: "1px solid #E8E4DE", borderLeft: "1px solid #E8E4DE",
                      textAlign: "center",
                      background: isoDate(d) === isoDate(new Date()) ? "#FAF3F5" : "#fff",
                    }}>
                      <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999" }}>
                        {d.toLocaleDateString("en-GB", { weekday: "short" })}
                      </div>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 700, color: "#111", lineHeight: 1, marginTop: "2px" }}>
                        {d.getDate()}
                      </div>
                    </div>
                  ))}

                  {/* Time rows */}
                  {TIMES.map((time) => (
                    <>
                      <div key={`t-${time}`} style={{ padding: "0.45rem 0.75rem", borderBottom: "1px solid #F0ECE8", display: "flex", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.62rem", color: "#bbb", whiteSpace: "nowrap" }}>{time}</span>
                      </div>
                      {days.map((d) => {
                        const slot = getSlot(d, time);
                        const isPast = d < today;
                        const isSelected = !!slot && !!selectedSlot && selectedSlot.id === slot.id;
                        const isAvailable = slot?.available && !slot?.booked && !isPast;
                        return (
                          <div
                            key={`${isoDate(d)}-${time}`}
                            onClick={() => isAvailable && setSelectedSlot(slot!)}
                            style={{
                              borderBottom: "1px solid #F0ECE8",
                              borderLeft: "1px solid #F0ECE8",
                              padding: "0.35rem",
                              cursor: isAvailable ? "pointer" : "default",
                              background: isSelected ? "#8B1930" : isAvailable ? "#FFF5F7" : "transparent",
                              transition: "background 0.15s",
                              minHeight: "32px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            {isAvailable && (
                              <span style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: isSelected ? "#fff" : "#8B1930",
                                display: "block",
                              }} />
                            )}
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>

              {/* Legend + CTA */}
              <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B1930", display: "block" }} />
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", color: "#666" }}>Available</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E8E4DE", display: "block" }} />
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", color: "#666" }}>Unavailable</span>
                  </div>
                </div>
                {selectedSlot && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setStep("form")}
                    style={{
                      background: "#111", color: "#fff",
                      fontFamily: "var(--font-poppins)", fontSize: "0.64rem",
                      fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase",
                      padding: "0.75rem 1.75rem", borderRadius: "100px", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "0.5rem",
                    }}
                  >
                    <Video size={13} />
                    Book {selectedSlot.date} at {selectedSlot.time}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP: FORM */}
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: EASE }}
              style={{ maxWidth: 480 }}
            >
              <button onClick={() => setStep("pick")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "2rem", color: "#888", fontFamily: "var(--font-poppins)", fontSize: "0.75rem" }}>
                <ChevronLeft size={14} /> Back to calendar
              </button>

              <div style={{ background: "#FAF3F5", borderLeft: "3px solid #8B1930", padding: "1rem 1.25rem", borderRadius: "0 12px 12px 0", marginBottom: "2rem" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 600, color: "#111" }}>
                  {new Date(`${selectedSlot?.date}T${selectedSlot?.time}`).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                </div>
                <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", color: "#888", marginTop: "4px" }}>30-minute virtual consultation · Free</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-poppins)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: "0.5rem" }}>Your Name *</label>
                  <input className="form-input" type="text" placeholder="Your full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-poppins)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: "0.5rem" }}>Email Address *</label>
                  <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", color: "#aaa", marginTop: "0.4rem" }}>Your video call link will be sent here</p>
                </div>

                {error && <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#c0392b" }}>{error}</p>}

                <button
                  onClick={handleBook}
                  disabled={loading || !form.name || !form.email}
                  className="btn-dark"
                  style={{ opacity: loading || !form.name || !form.email ? 0.55 : 1 }}
                >
                  {loading ? "Booking…" : "Confirm Consultation"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP: DONE */}
          {step === "done" && booking && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}
              style={{ maxWidth: 520 }}
            >
              <CheckCircle size={32} style={{ color: "#8B1930", marginBottom: "1rem" }} />
              <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "2rem", fontWeight: 700, color: "#111", lineHeight: 1.1, marginBottom: "0.5rem" }}>
                You&apos;re booked!
              </h3>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.84rem", color: "#666", marginBottom: "2rem" }}>
                A confirmation with your call link has been sent to <strong>{form.email}</strong>. Save the link below — you&apos;ll need it at appointment time.
              </p>

              <div style={{ background: "#FAF3F5", border: "1.5px solid #E8C4CC", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B1930", marginBottom: "0.5rem" }}>Your Video Call Link</div>
                <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.82rem", color: "#111", wordBreak: "break-all", marginBottom: "1rem" }}>{callUrl}</div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => { navigator.clipboard.writeText(callUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="btn-outline"
                    style={{ padding: "0.55rem 1.25rem", fontSize: "0.6rem" }}
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                  <a href={callUrl} target="_blank" rel="noreferrer" className="btn-dark" style={{ padding: "0.55rem 1.25rem", fontSize: "0.6rem" }}>
                    Join Now →
                  </a>
                </div>
              </div>

              <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "#aaa" }}>
                {new Date(`${booking.date}T${booking.time}`).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })} · 30 minutes
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
