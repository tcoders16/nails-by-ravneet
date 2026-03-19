import { NextRequest, NextResponse } from "next/server";
import { CLIENT } from "@/config/client";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correct = process.env.ADMIN_PASSWORD || CLIENT.adminPassword;
  if (password === correct) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Wrong password" }, { status: 401 });
}
