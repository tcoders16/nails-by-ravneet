import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");

export interface Slot {
  id: string;        // "2026-03-20T14:00"
  date: string;      // "2026-03-20"
  time: string;      // "14:00"
  available: boolean; // false if blocked or day-blocked
  booked: boolean;
  dayBlocked?: boolean;
}

export interface Appointment {
  id: string;
  slotId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  roomId: string;
  bookedAt: string;
  status: "confirmed" | "completed" | "cancelled";
  type: "consultation" | "nail";
  phone?: string;
  service?: string;
  notes?: string;
}

interface BlockData {
  blockedDates: string[];   // full day blocks: "2026-03-20"
  blockedSlots: string[];   // individual slot blocks: "2026-03-20T14:00"
}

function readJSON<T>(file: string, fallback: T): T {
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return fallback;
  try { return JSON.parse(fs.readFileSync(fp, "utf-8")) as T; }
  catch { return fallback; }
}

function writeJSON(file: string, data: unknown) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

const WORK_TIMES = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30",
];

function isoDate(d: Date) { return d.toISOString().slice(0, 10); }

/* ── Block data ───────────────────────────────── */

function getBlockData(): BlockData {
  return readJSON<BlockData>("availability.json", { blockedDates: [], blockedSlots: [] });
}

function saveBlockData(data: BlockData) {
  writeJSON("availability.json", data);
}

/* ── Generate all slots for a date range ─────── */

export function generateSlots(fromDate: Date, days = 28): Slot[] {
  const { blockedDates, blockedSlots } = getBlockData();
  const appointments = getAppointments();
  const bookedSlotIds = new Set(
    appointments.filter((a) => a.status !== "cancelled").map((a) => a.slotId)
  );

  const slots: Slot[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(fromDate);
    d.setDate(fromDate.getDate() + i);
    const dateStr = isoDate(d);
    const dayBlocked = blockedDates.includes(dateStr);

    for (const time of WORK_TIMES) {
      const id = `${dateStr}T${time}`;
      const slotBlocked = blockedSlots.includes(id);
      const booked = bookedSlotIds.has(id);

      slots.push({
        id,
        date: dateStr,
        time,
        available: !dayBlocked && !slotBlocked,
        booked,
        dayBlocked,
      });
    }
  }
  return slots;
}

/* ── Toggle a single slot block ──────────────── */
export function toggleSlotBlock(date: string, time: string): BlockData {
  const data = getBlockData();
  const id = `${date}T${time}`;
  const idx = data.blockedSlots.indexOf(id);
  if (idx === -1) data.blockedSlots.push(id);
  else data.blockedSlots.splice(idx, 1);
  saveBlockData(data);
  return data;
}

/* ── Toggle an entire day block ──────────────── */
export function toggleDayBlock(date: string): BlockData {
  const data = getBlockData();
  const idx = data.blockedDates.indexOf(date);
  if (idx === -1) {
    data.blockedDates.push(date);
    // Remove individual slot blocks for this day (redundant)
    data.blockedSlots = data.blockedSlots.filter((s) => !s.startsWith(date));
  } else {
    data.blockedDates.splice(idx, 1);
  }
  saveBlockData(data);
  return data;
}

export function getBlockDataPublic(): BlockData {
  return getBlockData();
}

/* ── Appointments ─────────────────────────────── */

export function getAppointments(): Appointment[] {
  return readJSON<Appointment[]>("appointments.json", []);
}

export function saveAppointments(appts: Appointment[]) {
  writeJSON("appointments.json", appts);
}

export function getAppointmentById(id: string): Appointment | undefined {
  return getAppointments().find((a) => a.id === id);
}

export function hasBookingThisWeek(email: string): boolean {
  const appts = getAppointments();
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);

  return appts.some((a) => {
    if (a.clientEmail.toLowerCase() !== email.toLowerCase()) return false;
    if (a.status === "cancelled") return false;
    const d = new Date(a.date);
    return d >= monday && d < sunday;
  });
}

export function bookSlot(
  slotId: string,
  clientName: string,
  clientEmail: string,
  opts?: { type?: "consultation" | "nail"; phone?: string; service?: string; notes?: string }
): Appointment {
  const [date, time] = [slotId.slice(0, 10), slotId.slice(11)];
  const { blockedDates, blockedSlots } = getBlockData();

  if (blockedDates.includes(date)) throw new Error("Slot not available");
  if (blockedSlots.includes(slotId)) throw new Error("Slot not available");

  const appointments = getAppointments();
  const alreadyBooked = appointments.some(
    (a) => a.slotId === slotId && a.status !== "cancelled"
  );
  if (alreadyBooked) throw new Error("Slot already booked");

  if (hasBookingThisWeek(clientEmail)) throw new Error("One booking per week allowed");

  const appt: Appointment = {
    id: crypto.randomUUID(),
    slotId,
    clientName,
    clientEmail,
    date,
    time,
    roomId: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
    bookedAt: new Date().toISOString(),
    status: "confirmed",
    type: opts?.type ?? "consultation",
    phone: opts?.phone,
    service: opts?.service,
    notes: opts?.notes,
  };

  appointments.push(appt);
  saveAppointments(appointments);
  return appt;
}
