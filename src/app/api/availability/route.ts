import { NextRequest, NextResponse } from "next/server";
import { generateSlots, toggleSlotBlock, toggleDayBlock } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const slots = generateSlots(today, 28);
  // Filter to only future slots
  const now = new Date().toISOString().slice(0, 16);
  return NextResponse.json(slots.filter((s) => s.id > now));
}

export async function POST(req: NextRequest) {
  const adminPass = req.headers.get("x-admin-password");
  if (adminPass !== (process.env.ADMIN_PASSWORD || "tisha123")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { date, time, blockDay } = body as { date: string; time?: string; blockDay?: boolean };
  if (!date) return NextResponse.json({ error: "Missing date" }, { status: 400 });

  if (blockDay) {
    const data = toggleDayBlock(date);
    return NextResponse.json(data);
  }
  if (!time) return NextResponse.json({ error: "Missing time" }, { status: 400 });
  const data = toggleSlotBlock(date, time);
  return NextResponse.json(data);
}
