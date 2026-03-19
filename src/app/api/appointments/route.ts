import { NextRequest, NextResponse } from "next/server";
import { CLIENT } from "@/config/client";
import { getAppointments, bookSlot } from "@/lib/store";
import { sendBookingNotification } from "@/lib/email";

export async function GET(req: NextRequest) {
  const adminPass = req.headers.get("x-admin-password");
  if (adminPass !== (process.env.ADMIN_PASSWORD || CLIENT.adminPassword)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getAppointments());
}

export async function POST(req: NextRequest) {
  const { slotId, clientName, clientEmail, type, phone, service, notes } = await req.json();
  if (!slotId || !clientName || !clientEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const appt = bookSlot(slotId, clientName, clientEmail, { type, phone, service, notes });
    // Send email notifications (non-blocking)
    sendBookingNotification({
      clientName: appt.clientName,
      clientEmail: appt.clientEmail,
      date: appt.date,
      time: appt.time,
      roomId: appt.roomId,
    }).catch(console.error);
    return NextResponse.json(appt);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Booking failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
