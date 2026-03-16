import { NextRequest, NextResponse } from "next/server";

interface BookingPayload {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingPayload = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.service) {
      return NextResponse.json(
        { error: "Name, email, and service are required." },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // ── Extend here: send email via Resend / SendGrid / Nodemailer ──
    // Example with Resend:
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@nailsbytisha.com',
    //   to: 'tisha@nailsbytisha.com',
    //   subject: `New Booking: ${body.service} from ${body.name}`,
    //   text: `Name: ${body.name}\nEmail: ${body.email}\nPhone: ${body.phone}\nService: ${body.service}\nMessage: ${body.message}`,
    // });

    // Log for now (replace with actual email service)
    console.log("📅 New booking request:", {
      name: body.name,
      email: body.email,
      phone: body.phone || "N/A",
      service: body.service,
      message: body.message || "N/A",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Booking request received. We will contact you within 24 hours!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

// GET — health check
export async function GET() {
  return NextResponse.json({ status: "ok", service: "Booking API" });
}
