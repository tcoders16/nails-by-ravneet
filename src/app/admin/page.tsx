"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Video, LogOut, Calendar, Clock, BanIcon, Eye, EyeOff, ShieldCheck, Sparkles, MapPin, Phone } from "lucide-react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/cursor/CustomCursor"), { ssr: false });
import type { Slot, Appointment } from "@/lib/store";

const EASE = [0.22, 1, 0.36, 1] as const;

const TIMES = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30",
];

function isoDate(d: Date) { return d.toISOString().slice(0, 10); }
function to12hr(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState<"availability" | "appointments">("availability");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = useCallback(async (pass: string) => {
    const [sRes, aRes] = await Promise.all([
      fetch("/api/availability?t=" + Date.now()),
      fetch("/api/appointments", { headers: { "x-admin-password": pass } }),
    ]);
    if (sRes.ok) setSlots(await sRes.json());
    if (aRes.ok) setAppointments(await aRes.json());
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_pass") || "";
    if (stored) { setAuthed(true); fetchData(stored); }
  }, [fetchData]);

  async function login() {
    if (!password) return;
    setLoginLoading(true); setLoginErr("");
    const res = await fetch("/api/admin", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem("admin_pass", password);
      setAuthed(true);
      fetchData(password);
    } else {
      setLoginErr("Incorrect password. Please try again.");
    }
    setLoginLoading(false);
  }

  function getPass() { return sessionStorage.getItem("admin_pass") || ""; }

  async function toggleSlot(date: string, time: string) {
    const key = `${date}T${time}`;
    setSaving(key);
    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": getPass() },
      body: JSON.stringify({ date, time }),
    });
    await fetchData(getPass());
    setSaving(null);
  }

  async function toggleDay(date: string) {
    setSaving(`day-${date}`);
    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": getPass() },
      body: JSON.stringify({ date, blockDay: true }),
    });
    await fetchData(getPass());
    setSaving(null);
  }

  function logout() { sessionStorage.removeItem("admin_pass"); setAuthed(false); setPassword(""); }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d;
  });

  function getSlot(date: Date, time: string): Slot | undefined {
    return slots.find(s => s.date === isoDate(date) && s.time === time);
  }
  function isDayBlocked(date: Date) {
    return slots.some(s => s.date === isoDate(date) && s.dayBlocked);
  }

  const upcoming = appointments
    .filter(a => a.status !== "cancelled" && new Date(`${a.date}T${a.time}`) >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const consultations = upcoming.filter(a => !a.type || a.type === "consultation");
  const nailAppts = upcoming.filter(a => a.type === "nail");

  /* ══ LOGIN PAGE ══ */
  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#0F0F0F", display: "flex" }}>
      <CustomCursor />

      {/* Left decorative panel */}
      <div className="hidden lg:flex" style={{
        width: "45%", background: "linear-gradient(135deg, #1a0a0f 0%, #0F0F0F 60%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        flexDirection: "column", justifyContent: "space-between",
        padding: "3rem",
      }}>
        {/* Logo */}
        <div>
          <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "2rem", color: "#fff", lineHeight: 1 }}>Nails by Tisha</div>
          <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.5rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: "4px" }}>Admin Portal</div>
        </div>

        {/* Center art */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{ position: "absolute", inset: "-60px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,25,48,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(4rem,8vw,7rem)", fontWeight: 700, lineHeight: 0.85, color: "rgba(255,255,255,0.04)", userSelect: "none" }}>
              Tisha
            </div>
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Manage your availability", "View upcoming appointments", "Join video consultations"].map((t, i) => (
                <motion.div key={t} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: EASE }}
                  style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#8B1930", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>{t}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>
          © {new Date().getFullYear()} Nails by Tisha · All rights reserved
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ width: "100%", maxWidth: 400 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ marginBottom: "2.5rem", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.8rem", color: "#fff", lineHeight: 1 }}>Nails by Tisha</div>
            <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>Admin Portal</div>
          </div>

          {/* Shield icon */}
          <div style={{ width: 52, height: 52, borderRadius: "14px", background: "rgba(139,25,48,0.15)", border: "1px solid rgba(139,25,48,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.75rem" }}>
            <ShieldCheck size={22} style={{ color: "#8B1930" }} />
          </div>

          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "2rem", fontWeight: 700, color: "#fff", lineHeight: 1, marginBottom: "0.5rem" }}>
            Welcome back,<br />Tisha
          </h1>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            Sign in to manage your calendar and appointments.
          </p>

          {/* Password field */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontFamily: "var(--font-poppins)", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.6rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginErr(""); }}
                onKeyDown={e => e.key === "Enter" && login()}
                style={{
                  fontFamily: "var(--font-poppins)", fontSize: "0.9rem",
                  width: "100%", padding: "0.95rem 3rem 0.95rem 1.1rem",
                  background: "rgba(255,255,255,0.05)",
                  border: loginErr ? "1.5px solid rgba(192,57,43,0.6)" : "1.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", color: "#fff", outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(139,25,48,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = loginErr ? "rgba(192,57,43,0.6)" : "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", lineHeight: 0 }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <AnimatePresence>
              {loginErr && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", color: "#e07070", marginTop: "0.5rem" }}>
                  {loginErr}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Sign in button */}
          <button
            onClick={login}
            disabled={loginLoading || !password}
            style={{
              width: "100%", fontFamily: "var(--font-poppins)", fontSize: "0.75rem",
              fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              background: loginLoading || !password ? "rgba(139,25,48,0.4)" : "#8B1930",
              color: "#fff", border: "none", borderRadius: "12px",
              padding: "1rem", cursor: loginLoading || !password ? "default" : "pointer",
              transition: "background 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            }}
            onMouseEnter={e => { if (!loginLoading && password) e.currentTarget.style.background = "#a01f38"; }}
            onMouseLeave={e => { e.currentTarget.style.background = loginLoading || !password ? "rgba(139,25,48,0.4)" : "#8B1930"; }}
          >
            {loginLoading ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Signing in…</>
            ) : "Sign In →"}
          </button>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <a href="/" style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>
              ← Back to main site
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );

  /* ══ DASHBOARD ══ */
  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5" }}>
      <CustomCursor />

      {/* Topbar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E4DE", padding: "0.9rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.3rem", color: "#111" }}>Nails by Tisha</div>
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", background: "#8B1930", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {(["availability", "appointments"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily: "var(--font-poppins)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "0.5rem 1rem", borderRadius: "100px", border: "none", cursor: "pointer",
              background: tab === t ? "#111" : "transparent", color: tab === t ? "#fff" : "#888",
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}>
              {t === "availability" ? <Calendar size={12} /> : <Sparkles size={12} />}
              {t === "availability" ? "Calendar" : `Bookings${upcoming.length > 0 ? ` (${upcoming.length})` : ""}`}
            </button>
          ))}
          <div style={{ width: "1px", height: 18, background: "#E8E4DE", margin: "0 0.25rem" }} />
          <button onClick={logout} title="Sign out"
            style={{ background: "none", border: "1px solid #E8E4DE", borderRadius: "8px", cursor: "pointer", color: "#aaa", display: "flex", alignItems: "center", padding: "0.4rem 0.6rem", gap: "0.4rem", fontFamily: "var(--font-poppins)", fontSize: "0.62rem" }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── AVAILABILITY TAB ── */}
        {tab === "availability" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: "1.75rem" }}>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "2rem", fontWeight: 700, color: "#111" }}>Block Your Calendar</h1>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#888", marginTop: "0.4rem", maxWidth: 520, lineHeight: 1.7 }}>
                All slots are <strong>open by default</strong>. Click a <strong>day header</strong> to block the entire day, or click individual time cells to block specific slots.
              </p>
            </div>

            {/* Week nav */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <button onClick={() => setWeekOffset(o => Math.max(0, o - 1))} disabled={weekOffset === 0}
                style={{ width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #E8E4DE", background: "#fff", cursor: weekOffset === 0 ? "default" : "pointer", opacity: weekOffset === 0 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", fontWeight: 500, color: "#555" }}>
                {days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {days[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <button onClick={() => setWeekOffset(o => o + 1)}
                style={{ width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #E8E4DE", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Grid */}
            <div style={{ overflowX: "auto", borderRadius: "16px", border: "1px solid #E8E4DE", background: "#fff" }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px repeat(7,1fr)", minWidth: 660 }}>

                {/* Corner */}
                <div style={{ padding: "0.75rem", borderBottom: "2px solid #E8E4DE", display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.55rem", color: "#ccc", textTransform: "uppercase", letterSpacing: "0.1em" }}>Time</span>
                </div>

                {/* Day headers */}
                {days.map(d => {
                  const isToday = isoDate(d) === isoDate(new Date());
                  const blocked = isDayBlocked(d);
                  const isSavingDay = saving === `day-${isoDate(d)}`;
                  return (
                    <div key={d.toISOString()}
                      onClick={() => !isSavingDay && toggleDay(isoDate(d))}
                      title={blocked ? "Click to unblock this day" : "Click to block entire day"}
                      style={{
                        padding: "0.75rem 0.5rem", borderBottom: "2px solid #E8E4DE", borderLeft: "1px solid #E8E4DE",
                        textAlign: "center", cursor: "pointer",
                        background: blocked ? "rgba(139,25,48,0.06)" : isToday ? "#FFF5F7" : "#fff",
                        transition: "background 0.15s", opacity: isSavingDay ? 0.5 : 1,
                      }}>
                      <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.56rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: blocked ? "#8B1930" : isToday ? "#8B1930" : "#aaa" }}>
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.2rem", fontWeight: 700, color: blocked ? "#8B1930" : "#111", lineHeight: 1, marginTop: "2px" }}>{d.getDate()}</div>
                      {blocked
                        ? <div style={{ fontSize: "0.45rem", fontFamily: "var(--font-poppins)", color: "#8B1930", letterSpacing: "0.08em", marginTop: "3px" }}>BLOCKED</div>
                        : <div style={{ fontSize: "0.45rem", fontFamily: "var(--font-poppins)", color: "rgba(0,0,0,0.2)", letterSpacing: "0.05em", marginTop: "3px" }}>tap to block</div>
                      }
                    </div>
                  );
                })}

                {/* Time rows */}
                {TIMES.map((time, ti) => (
                  <>
                    <div key={`t-${time}`} style={{ padding: "0.25rem 0.75rem", borderBottom: ti < TIMES.length - 1 ? "1px solid #F5F0EC" : "none", display: "flex", alignItems: "center", background: "#FAFAFA" }}>
                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", color: "#bbb", fontWeight: 500 }}>{to12hr(time)}</span>
                    </div>
                    {days.map(d => {
                      const slot = getSlot(d, time);
                      const slotId = `${isoDate(d)}T${time}`;
                      const isPast = new Date(slotId) < new Date();
                      const dayBlocked = isDayBlocked(d);
                      const slotBlocked = slot ? !slot.available && !slot.dayBlocked : false;
                      const isBooked = slot?.booked;
                      const isSavingThis = saving === slotId;

                      return (
                        <div key={slotId}
                          onClick={() => !isPast && !isBooked && !dayBlocked && toggleSlot(isoDate(d), time)}
                          title={
                            isBooked ? "Booked — cannot change" :
                            dayBlocked ? "Whole day is blocked" :
                            slotBlocked ? "Click to unblock" :
                            isPast ? "" :
                            "Click to block this slot"
                          }
                          style={{
                            borderLeft: "1px solid #F5F0EC",
                            borderBottom: ti < TIMES.length - 1 ? "1px solid #F5F0EC" : "none",
                            minHeight: 38,
                            cursor: isPast || isBooked || dayBlocked ? "default" : "pointer",
                            background: isBooked
                              ? "#FFF0F2"
                              : dayBlocked
                              ? "rgba(139,25,48,0.04)"
                              : slotBlocked
                              ? "rgba(139,25,48,0.1)"
                              : isPast ? "#fafafa" : "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: isSavingThis ? 0.35 : 1,
                            transition: "background 0.15s",
                          }}>
                          {isBooked && <span style={{ fontSize: "0.5rem", color: "#8B1930", fontFamily: "var(--font-poppins)", fontWeight: 600, letterSpacing: "0.04em" }}>BOOKED</span>}
                          {!isBooked && slotBlocked && !dayBlocked && <BanIcon size={11} style={{ color: "rgba(139,25,48,0.45)" }} />}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ marginTop: "1rem", display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
              {[
                { color: "#fff", border: "1px solid #E8E4DE", label: "Open" },
                { color: "rgba(139,25,48,0.1)", border: "1px solid rgba(139,25,48,0.2)", label: "Slot blocked" },
                { color: "rgba(139,25,48,0.06)", border: "1px solid rgba(139,25,48,0.12)", label: "Day blocked" },
                { color: "#FFF0F2", border: "1px solid #FFCDD2", label: "Booked" },
              ].map(({ color, border, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <span style={{ width: 14, height: 14, borderRadius: "4px", background: color, border, display: "block", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.67rem", color: "#777" }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── APPOINTMENTS TAB ── */}
        {tab === "appointments" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "2rem", fontWeight: 700, color: "#111" }}>Upcoming Appointments</h1>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#888", marginTop: "0.4rem" }}>
                {upcoming.length === 0 ? "No upcoming appointments." : `${upcoming.length} upcoming appointment${upcoming.length > 1 ? "s" : ""}`}
              </p>
            </div>

            {upcoming.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: "20px", border: "1px solid #E8E4DE" }}>
                <Calendar size={32} style={{ color: "#E8E4DE", margin: "0 auto 1rem", display: "block" }} />
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.82rem", color: "#aaa" }}>No appointments booked yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

                {/* ── Video Consultations ── */}
                {consultations.length > 0 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "8px", background: "rgba(100,100,240,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Video size={14} style={{ color: "#6464F0" }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", fontWeight: 600, color: "#111", letterSpacing: "0.04em" }}>
                        Video Consultations
                      </span>
                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", color: "#888", background: "#F5F0EC", borderRadius: "100px", padding: "0.15rem 0.6rem" }}>
                        {consultations.length}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {consultations.map(appt => {
                        const dt = new Date(`${appt.date}T${appt.time}`);
                        const isNow = Math.abs(Date.now() - dt.getTime()) < 30 * 60 * 1000;
                        return (
                          <motion.div key={appt.id}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            style={{
                              background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem",
                              border: isNow ? "1.5px solid #6464F0" : "1px solid #E8E4DE",
                              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
                            }}>
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                              <div style={{
                                background: isNow ? "#6464F0" : "#F5F0EC",
                                width: 48, height: 48, borderRadius: "12px",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0,
                              }}>
                                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 700, color: isNow ? "#fff" : "#111", lineHeight: 1 }}>{dt.getDate()}</div>
                                <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: isNow ? "rgba(255,255,255,0.7)" : "#aaa" }}>
                                  {dt.toLocaleDateString("en-US", { month: "short" })}
                                </div>
                              </div>
                              <div>
                                <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.88rem", fontWeight: 600, color: "#111" }}>{appt.clientName}</div>
                                <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", color: "#aaa", marginTop: "1px" }}>{appt.clientEmail}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "4px" }}>
                                  <Clock size={11} style={{ color: "#6464F0" }} />
                                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.7rem", color: "#666" }}>
                                    {to12hr(appt.time)} · {dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · 30 min
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                              {isNow && <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.58rem", fontWeight: 600, color: "#22c55e", letterSpacing: "0.1em", background: "rgba(34,197,94,0.1)", padding: "0.25rem 0.65rem", borderRadius: "100px" }}>LIVE NOW</span>}
                              <a href={`/call/${appt.roomId}`} target="_blank" rel="noreferrer"
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: "0.45rem",
                                  background: isNow ? "#6464F0" : "#111", color: "#fff",
                                  fontFamily: "var(--font-poppins)", fontSize: "0.62rem",
                                  fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                                  padding: "0.6rem 1.1rem", borderRadius: "100px", textDecoration: "none",
                                }}>
                                <Video size={12} />
                                {isNow ? "Join Now" : "Join"}
                              </a>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Nail Appointments ── */}
                {nailAppts.length > 0 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "8px", background: "rgba(139,25,48,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Sparkles size={14} style={{ color: "#8B1930" }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", fontWeight: 600, color: "#111", letterSpacing: "0.04em" }}>
                        Nail Appointments
                      </span>
                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", color: "#888", background: "#F5F0EC", borderRadius: "100px", padding: "0.15rem 0.6rem" }}>
                        {nailAppts.length}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {nailAppts.map(appt => {
                        const dt = new Date(`${appt.date}T${appt.time}`);
                        const isNow = Math.abs(Date.now() - dt.getTime()) < 30 * 60 * 1000;
                        return (
                          <motion.div key={appt.id}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            style={{
                              background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem",
                              border: isNow ? "1.5px solid #8B1930" : "1px solid #E8E4DE",
                            }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <div style={{
                                  background: isNow ? "#8B1930" : "#FFF0F3",
                                  width: 48, height: 48, borderRadius: "12px",
                                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 700, color: isNow ? "#fff" : "#8B1930", lineHeight: 1 }}>{dt.getDate()}</div>
                                  <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: isNow ? "rgba(255,255,255,0.7)" : "#c06" }}>
                                    {dt.toLocaleDateString("en-US", { month: "short" })}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                    <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.88rem", fontWeight: 600, color: "#111" }}>{appt.clientName}</div>
                                    {isNow && <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.58rem", fontWeight: 600, color: "#22c55e", letterSpacing: "0.1em", background: "rgba(34,197,94,0.1)", padding: "0.2rem 0.55rem", borderRadius: "100px" }}>NOW</span>}
                                  </div>
                                  <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", color: "#aaa", marginTop: "1px" }}>{appt.clientEmail}</div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "6px", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                      <Clock size={11} style={{ color: "#8B1930" }} />
                                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.7rem", color: "#666" }}>
                                        {to12hr(appt.time)} · {dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                      </span>
                                    </div>
                                    {appt.phone && (
                                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                        <Phone size={11} style={{ color: "#8B1930" }} />
                                        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.7rem", color: "#666" }}>{appt.phone}</span>
                                      </div>
                                    )}
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                      <MapPin size={11} style={{ color: "#8B1930" }} />
                                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.7rem", color: "#666" }}>In-studio</span>
                                    </div>
                                  </div>
                                  {appt.service && (
                                    <div style={{ marginTop: "8px" }}>
                                      <span style={{
                                        fontFamily: "var(--font-poppins)", fontSize: "0.62rem", fontWeight: 600,
                                        color: "#8B1930", background: "rgba(139,25,48,0.08)",
                                        padding: "0.25rem 0.7rem", borderRadius: "100px", letterSpacing: "0.04em",
                                      }}>
                                        {appt.service}
                                      </span>
                                    </div>
                                  )}
                                  {appt.notes && (
                                    <div style={{ marginTop: "8px", background: "#FAFAFA", borderRadius: "8px", padding: "0.5rem 0.75rem", maxWidth: 380 }}>
                                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", color: "#888", fontStyle: "italic" }}>&ldquo;{appt.notes}&rdquo;</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{
                                  display: "inline-flex", alignItems: "center", gap: "0.45rem",
                                  background: "#FFF0F3", color: "#8B1930",
                                  fontFamily: "var(--font-poppins)", fontSize: "0.62rem",
                                  fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                                  padding: "0.6rem 1.1rem", borderRadius: "100px",
                                }}>
                                  <Sparkles size={12} />
                                  In Studio
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
