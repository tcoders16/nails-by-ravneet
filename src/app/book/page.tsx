"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Video, Sparkles, ChevronLeft, ChevronRight,
  RefreshCw, Loader2, CheckCircle, Clock, MapPin,
} from "lucide-react";
import type { Slot } from "@/lib/store";

const CustomCursor = dynamic(() => import("@/components/cursor/CustomCursor"), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;

function isoDate(d: Date) { return d.toISOString().slice(0, 10); }
function to12hr(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

const labelStyle: React.CSSProperties = {
  display: "block", marginBottom: "0.5rem",
  fontFamily: "var(--font-poppins)", fontSize: "0.62rem",
  fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase",
  color: "#888",
};
const inputBase: React.CSSProperties = {
  fontFamily: "var(--font-poppins)", fontSize: "0.85rem",
  color: "#111", background: "#fff",
  border: "1.5px solid #E8E4DE",
  padding: "0.8rem 1rem", width: "100%",
  outline: "none", borderRadius: "10px",
  WebkitAppearance: "none", appearance: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#8B1930";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,25,48,0.08)";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#E8E4DE";
  e.currentTarget.style.boxShadow = "none";
};

const SERVICES = [
  { value: "gel-extensions",   label: "Gel Extensions" },
  { value: "chrome-powder",    label: "Chrome Powder" },
  { value: "custom-nail-art",  label: "Custom Nail Art" },
  { value: "french-ombre",     label: "French Ombré" },
  { value: "nail-sculpting",   label: "Nail Sculpting" },
  { value: "nail-restoration", label: "Nail Restoration" },
];

type BookingType = "consultation" | "nail";
type Step = "pick-date" | "pick-time" | "form" | "done";

export default function BookPage() {
  const [bookingType, setBookingType] = useState<BookingType>("consultation");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [step, setStep] = useState<Step>("pick-date");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Consultation form
  const [consForm, setConsForm] = useState({ name: "", email: "" });
  // Nail form
  const [nailForm, setNailForm] = useState({ name: "", email: "", phone: "", service: "", notes: "" });

  const [booking, setBooking] = useState<{ roomId: string; date: string; time: string; type: BookingType } | null>(null);
  const [slotTakenToast, setSlotTakenToast] = useState(false);

  const fetchSlots = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch("/api/availability?t=" + Date.now());
      if (res.ok) {
        const data: Slot[] = await res.json();
        setSlots(data);
        setLastRefreshed(new Date());
        setSelectedSlot(prev => {
          if (!prev) return null;
          const fresh = data.find(s => s.id === prev.id);
          if (!fresh || !fresh.available || fresh.booked) {
            if (silent) setSlotTakenToast(true);
            return null;
          }
          return fresh;
        });
      }
    } finally { if (!silent) setRefreshing(false); }
  }, []);

  useEffect(() => {
    fetchSlots();
    const t = setInterval(() => fetchSlots(true), 15_000);
    return () => clearInterval(t);
  }, [fetchSlots]);

  useEffect(() => {
    if (!slotTakenToast) return;
    const t = setTimeout(() => setSlotTakenToast(false), 5000);
    return () => clearTimeout(t);
  }, [slotTakenToast]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d;
  });

  function availableForDate(date: string) {
    return slots.filter(s => s.date === date && s.available && !s.booked);
  }
  function slotsForDate(date: string) {
    return slots.filter(s => s.date === date);
  }

  function resetFlow(type: BookingType) {
    setBookingType(type);
    setStep("pick-date");
    setSelectedDate(null);
    setSelectedSlot(null);
    setError("");
    setWeekOffset(0);
  }

  async function handleBook() {
    if (!selectedSlot) return;
    const isNail = bookingType === "nail";
    const name = isNail ? nailForm.name : consForm.name;
    const email = isNail ? nailForm.email : consForm.email;
    if (!name || !email) return;
    if (isNail && !nailForm.service) return;

    setLoading(true); setError("");
    try {
      const body = isNail
        ? { slotId: selectedSlot.id, clientName: name, clientEmail: email, type: "nail", phone: nailForm.phone, service: nailForm.service, notes: nailForm.notes }
        : { slotId: selectedSlot.id, clientName: name, clientEmail: email, type: "consultation" };

      const res = await fetch("/api/appointments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Booking failed"); setLoading(false); return; }
      setBooking({ roomId: data.roomId, date: data.date, time: data.time, type: bookingType });
      setStep("done");
      fetchSlots(true);
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  }

  const callUrl = booking && typeof window !== "undefined"
    ? `${window.location.origin}/call/${booking.roomId}` : "";

  const totalAvailable = slots.filter(s => s.available && !s.booked).length;
  const isNail = bookingType === "nail";

  /* ── Date picker ── */
  const DatePicker = (
    <motion.div key="pick-date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B1930", marginBottom: "0.25rem" }}>Step 1 of 3</div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#111", margin: 0 }}>Select a Date</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button onClick={() => setWeekOffset(o => Math.max(0, o - 1))} disabled={weekOffset === 0}
            style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #E8E4DE", background: "#fff", cursor: weekOffset === 0 ? "default" : "pointer", opacity: weekOffset === 0 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={15} />
          </button>
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", fontWeight: 500, color: "#555", whiteSpace: "nowrap" }}>
            {days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {days[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <button onClick={() => setWeekOffset(o => o + 1)}
            style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #E8E4DE", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.6rem", marginBottom: "2rem" }}>
        {days.map(d => {
          const dateStr = isoDate(d);
          const avail = availableForDate(dateStr);
          const isPast = d < today;
          const isSelected = selectedDate === dateStr;
          const hasSlots = avail.length > 0;
          return (
            <motion.div key={dateStr}
              whileHover={!isPast && hasSlots ? { y: -2 } : {}}
              onClick={() => { if (!isPast && hasSlots) { setSelectedDate(dateStr); setStep("pick-time"); } }}
              style={{
                borderRadius: "16px",
                border: isSelected ? "2px solid #8B1930" : "1.5px solid #E8E4DE",
                background: isSelected ? "#8B1930" : isPast ? "#fafafa" : hasSlots ? "#fff" : "#fafafa",
                padding: "1rem 0.5rem", textAlign: "center",
                cursor: !isPast && hasSlots ? "pointer" : "default",
                opacity: isPast ? 0.35 : 1, transition: "all 0.18s",
              }}>
              <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.56rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: isSelected ? "rgba(255,255,255,0.7)" : "#aaa", marginBottom: "0.3rem" }}>
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.4rem", fontWeight: 700, lineHeight: 1, color: isSelected ? "#fff" : "#111" }}>
                {d.getDate()}
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                {hasSlots
                  ? <span style={{
                      fontFamily: "var(--font-poppins)", fontSize: "0.52rem", fontWeight: 600, letterSpacing: "0.04em",
                      color: isSelected ? "rgba(255,255,255,0.8)" : avail.length <= 3 ? "#f59e0b" : "#22c55e",
                    }}>
                      {avail.length <= 3 ? `${avail.length} left!` : `${avail.length} open`}
                    </span>
                  : <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.52rem", color: isSelected ? "rgba(255,255,255,0.5)" : "#ccc" }}>full</span>
                }
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        {(isNail
          ? [{ icon: <MapPin size={13} />, text: "In-studio appointment" }, { icon: <Clock size={13} />, text: "60–90 minutes" }]
          : [{ icon: <Video size={13} />, text: "Live video call" }, { icon: <Clock size={13} />, text: "30 minutes, completely free" }]
        ).map(({ icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span style={{ color: "#8B1930" }}>{icon}</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", color: "#777" }}>{text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  /* ── Time picker ── */
  const TimePicker = selectedDate && (
    <motion.div key="pick-time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <button onClick={() => { setStep("pick-date"); setSelectedSlot(null); }}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.75rem", color: "#888", fontFamily: "var(--font-poppins)", fontSize: "0.75rem" }}>
        <ChevronLeft size={14} /> Back to dates
      </button>
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B1930", marginBottom: "0.25rem" }}>Step 2 of 3</div>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#111", margin: 0 }}>
          {new Date(selectedDate + "T12:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </h2>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "#999", marginTop: "0.3rem" }}>
          {availableForDate(selectedDate).length} time slots available
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.6rem", marginBottom: "2rem" }}>
        {slotsForDate(selectedDate).map(slot => {
          const isPast = new Date(`${slot.date}T${slot.time}`) < new Date();
          const isAvail = slot.available && !slot.booked && !isPast;
          const isSel = selectedSlot?.id === slot.id;
          const isBooked = slot.booked;
          const isBlocked = !slot.available && !slot.booked && !isPast;
          return (
            <motion.button key={slot.id}
              whileHover={isAvail ? { scale: 1.03 } : {}} whileTap={isAvail ? { scale: 0.97 } : {}}
              onClick={() => isAvail && setSelectedSlot(isSel ? null : slot)}
              disabled={!isAvail}
              title={isBooked ? "Already booked" : isBlocked ? "Unavailable" : isPast ? "Past" : ""}
              style={{
                fontFamily: "var(--font-poppins)", fontSize: "0.82rem",
                fontWeight: isSel ? 600 : 500,
                border: isSel ? "2px solid #8B1930" : isBooked ? "1.5px solid #FFCDD2" : "1.5px solid #E8E4DE",
                borderRadius: "12px", padding: "0.85rem 0.5rem",
                background: isSel ? "#8B1930" : isBooked ? "#FFF5F5" : isBlocked ? "#f5f5f5" : isAvail ? "#fff" : "#f9f9f9",
                color: isSel ? "#fff" : isBooked ? "#e07070" : isAvail ? "#111" : "#ccc",
                cursor: isAvail ? "pointer" : "default",
                transition: "all 0.18s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", position: "relative",
              }}>
              <span style={{ textDecoration: isBooked ? "line-through" : "none" }}>{to12hr(slot.time).split(" ")[0]}</span>
              <span style={{ fontSize: "0.58rem", opacity: 0.7, textDecoration: isBooked ? "line-through" : "none" }}>{to12hr(slot.time).split(" ")[1]}</span>
              {isBooked && <span style={{ fontSize: "0.45rem", fontWeight: 600, color: "#e07070", letterSpacing: "0.06em", marginTop: "1px" }}>TAKEN</span>}
              {isBlocked && <span style={{ fontSize: "0.45rem", fontWeight: 600, color: "#ccc", letterSpacing: "0.06em", marginTop: "1px" }}>BLOCKED</span>}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedSlot && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <div style={{ background: "#fff", borderRadius: "16px", border: "1.5px solid #E8E4DE", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.62rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.2rem" }}>Selected time</div>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.2rem", fontWeight: 700, color: "#111" }}>
                  {to12hr(selectedSlot.time)} · {new Date(selectedDate + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
              <button onClick={() => setStep("form")} className="btn-dark"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Continue →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  /* ── Form ── */
  const FormStep = selectedSlot && (
    <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <button onClick={() => setStep("pick-time")}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.75rem", color: "#888", fontFamily: "var(--font-poppins)", fontSize: "0.75rem" }}>
        <ChevronLeft size={14} /> Back to times
      </button>

      <div style={{ display: "grid", gap: "2rem" }} className="grid-cols-1 md:grid-cols-[1fr_1.4fr]">
        {/* Summary card */}
        <div style={{ background: "#111", borderRadius: "20px", padding: "2rem", color: "#fff", alignSelf: "start" }}>
          <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.25rem" }}>Step 3 of 3 · Your Booking</div>
          <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.4rem", color: "rgba(255,255,255,0.5)", marginBottom: "1rem" }}>Nails by Ravneet</div>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "14px", padding: "1.25rem", marginBottom: "1rem" }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.4rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
              {new Date(selectedSlot.date + "T12:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.6rem" }}>
              <Clock size={13} style={{ color: "#8B1930" }} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>
                {to12hr(selectedSlot.time)}
              </span>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
                · {isNail ? "60–90 min" : "30 min"}
              </span>
            </div>
          </div>
          {(isNail
            ? ["In-studio appointment", "Confirmation via email", "Cancellation ≥24 hrs notice"]
            : ["Free video consultation", "Call link sent to your email", "No commitment required"]
          ).map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#8B1930", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>{t}</span>
            </div>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input style={inputBase} type="text" placeholder="Your full name"
                value={isNail ? nailForm.name : consForm.name}
                onChange={e => isNail ? setNailForm(f => ({ ...f, name: e.target.value })) : setConsForm(f => ({ ...f, name: e.target.value }))}
                onFocus={onFocus} onBlur={onBlur} />
            </div>
            {isNail && (
              <div>
                <label style={labelStyle}>Phone</label>
                <input style={inputBase} type="tel" placeholder="(555) 000-0000"
                  value={nailForm.phone}
                  onChange={e => setNailForm(f => ({ ...f, phone: e.target.value }))}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Email Address *</label>
            <input style={inputBase} type="email" placeholder="your@email.com"
              value={isNail ? nailForm.email : consForm.email}
              onChange={e => isNail ? setNailForm(f => ({ ...f, email: e.target.value })) : setConsForm(f => ({ ...f, email: e.target.value }))}
              onFocus={onFocus} onBlur={onBlur} />
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", color: "#aaa", marginTop: "0.4rem" }}>
              {isNail ? "Confirmation details will be sent here." : "Your video call link will be sent here. Max 1 booking per week."}
            </p>
          </div>

          {isNail && (
            <>
              <div>
                <label style={labelStyle}>Service *</label>
                <select style={{ ...inputBase, color: nailForm.service ? "#111" : "#aaa" }}
                  value={nailForm.service}
                  onChange={e => setNailForm(f => ({ ...f, service: e.target.value }))}
                  onFocus={onFocus} onBlur={onBlur}>
                  <option value="" disabled>Select a service</option>
                  {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Notes (optional)</label>
                <textarea
                  style={{ ...inputBase, resize: "none", minHeight: "90px" }}
                  placeholder="Nail length, style inspo, any questions…"
                  rows={3} value={nailForm.notes}
                  onChange={e => setNailForm(f => ({ ...f, notes: e.target.value }))}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>
            </>
          )}

          {error && (
            <div style={{ background: "#FFF0F0", border: "1px solid #FFCDD2", borderRadius: "10px", padding: "0.75rem 1rem" }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#c0392b", margin: 0 }}>{error}</p>
            </div>
          )}

          <button onClick={handleBook}
            disabled={loading || !(isNail ? nailForm.name && nailForm.email && nailForm.service : consForm.name && consForm.email)}
            className="btn-dark"
            style={{ opacity: loading ? 0.5 : 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            {loading ? <><Loader2 size={14} className="animate-spin" />Confirming…</> : isNail ? "Confirm Appointment →" : "Confirm Consultation →"}
          </button>
        </div>
      </div>
    </motion.div>
  );

  /* ── Done ── */
  const DoneStep = booking && (
    <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }} style={{ maxWidth: 520 }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(139,25,48,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <CheckCircle size={28} style={{ color: "#8B1930" }} />
      </div>
      <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,6vw,3rem)", fontWeight: 700, color: "#111", lineHeight: 1, marginBottom: "0.75rem" }}>
        {booking.type === "nail" ? "Appointment Booked!" : "You're all set!"}
      </h2>
      <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.84rem", color: "#666", lineHeight: 1.8, marginBottom: "2rem" }}>
        {booking.type === "nail"
          ? <>Confirmation sent to <strong>{nailForm.email}</strong>. Ravneet will confirm within 24 hours.</>
          : <>Confirmation sent to <strong>{consForm.email}</strong>. Ravneet has been notified and will be ready for your call.</>
        }
      </p>

      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E8E4DE", padding: "1.75rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", marginBottom: booking.type === "consultation" ? "1.5rem" : 0 }}>
          <div style={{ background: "#8B1930", width: 56, height: 56, borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.3rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
              {new Date(`${booking.date}T12:00`).getDate()}
            </div>
            <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.52rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
              {new Date(`${booking.date}T12:00`).toLocaleDateString("en-US", { month: "short" })}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 700, color: "#111" }}>
              {new Date(`${booking.date}T12:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "4px" }}>
              <Clock size={12} style={{ color: "#8B1930" }} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#666" }}>
                {to12hr(booking.time)} · {booking.type === "nail" ? "60–90 min · In Studio" : "30 min · Virtual"}
              </span>
            </div>
          </div>
        </div>

        {booking.type === "consultation" && (
          <div style={{ background: "#FAF3F5", borderRadius: "12px", padding: "1rem 1.25rem" }}>
            <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B1930", marginBottom: "0.4rem" }}>Video Call Link</div>
            <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.73rem", color: "#555", wordBreak: "break-all", marginBottom: "0.75rem" }}>{callUrl}</div>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <button onClick={() => { navigator.clipboard.writeText(callUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.6rem" }}>
                {copied ? "Copied ✓" : "Copy Link"}
              </button>
              <a href={callUrl} target="_blank" rel="noreferrer" className="btn-dark" style={{ padding: "0.5rem 1rem", fontSize: "0.6rem" }}>
                Join Call →
              </a>
            </div>
          </div>
        )}
      </div>

      <a href="/" style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", color: "#aaa", textDecoration: "none", borderBottom: "1px solid #E8E4DE" }}>
        ← Back to Nails by Ravneet
      </a>
    </motion.div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5" }}>
      <CustomCursor />

      {/* Slot-taken toast */}
      <AnimatePresence>
        {slotTakenToast && (
          <motion.div
            initial={{ opacity: 0, y: -16, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -16, x: "-50%" }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              position: "fixed", top: "1.25rem", left: "50%", zIndex: 200,
              background: "#111", color: "#fff", borderRadius: "12px",
              padding: "0.75rem 1.25rem", display: "flex", alignItems: "center", gap: "0.6rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              fontFamily: "var(--font-poppins)", fontSize: "0.78rem", fontWeight: 500,
              whiteSpace: "nowrap",
            }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171", display: "block", flexShrink: 0 }} />
            That slot was just taken — please choose another time.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E4DE", padding: "1.1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.6rem", color: "#111", lineHeight: 1 }}>Nails by Ravneet</div>
          <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.48rem", fontWeight: 500, letterSpacing: "0.35em", textTransform: "uppercase", color: "#bbb", marginTop: "3px" }}>Luxury Nail Studio</div>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {step !== "done" && totalAvailable > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button onClick={() => fetchSlots()} title="Refresh availability" style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", lineHeight: 0 }}>
                <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", padding: "0.2rem 0.6rem 0.2rem 0.45rem" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "block", boxShadow: "0 0 0 2px rgba(34,197,94,0.25)", animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.58rem", fontWeight: 600, color: "#22c55e", letterSpacing: "0.06em" }}>LIVE</span>
              </div>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", color: "#bbb" }}>
                {lastRefreshed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
              </span>
            </div>
          )}
          <a href="/" className="btn-outline" style={{ padding: "0.5rem 1.1rem", fontSize: "0.6rem" }}>← Back</a>
        </div>
      </div>

      <div className="px-6 md:px-10" style={{ maxWidth: 860, margin: "0 auto", paddingTop: "3rem", paddingBottom: "5rem" }}>

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }} style={{ marginBottom: "2.5rem" }}>
          <span className="eyebrow">Reserve Your Spot</span>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.2rem,6vw,3.8rem)", fontWeight: 700, lineHeight: 1, color: "#111", marginTop: "0.5rem", marginBottom: "1rem" }}>
            Book an Appointment
          </h1>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.85rem", color: "#666", lineHeight: 1.75, maxWidth: 440 }}>
            Pick a free video consultation or book your nail appointment directly — both use the same simple slot selection.
          </p>
        </motion.div>

        {/* Type tabs — only show on step pick-date or if done */}
        {(step === "pick-date" || step === "done") && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
            style={{ display: "flex", gap: "0.75rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {([
              { key: "consultation" as BookingType, icon: <Video size={15} />, label: "Video Consultation", sub: "Free · 30 min" },
              { key: "nail" as BookingType,         icon: <Sparkles size={15} />, label: "Nail Appointment", sub: "In-studio · 60–90 min" },
            ]).map(({ key, icon, label, sub }) => (
              <button key={key} onClick={() => resetFlow(key)}
                style={{
                  fontFamily: "var(--font-poppins)", display: "flex", alignItems: "center", gap: "0.75rem",
                  background: bookingType === key ? "#111" : "#fff",
                  color: bookingType === key ? "#fff" : "#555",
                  border: bookingType === key ? "1.5px solid #111" : "1.5px solid #E8E4DE",
                  borderRadius: "14px", padding: "0.9rem 1.5rem", cursor: "pointer",
                  transition: "all 0.2s", textAlign: "left",
                }}>
                <span style={{ color: bookingType === key ? "#fff" : "#8B1930" }}>{icon}</span>
                <span>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, lineHeight: 1 }}>{label}</div>
                  <div style={{ fontSize: "0.62rem", opacity: 0.6, marginTop: "3px" }}>{sub}</div>
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === "pick-date" && DatePicker}
          {step === "pick-time" && TimePicker}
          {step === "form" && FormStep}
          {step === "done" && DoneStep}
        </AnimatePresence>
      </div>
    </div>
  );
}
