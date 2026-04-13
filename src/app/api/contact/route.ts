import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import { sendContactNotificationEmail } from "@/lib/email";

// Very basic in-memory rate limiter (per process — resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3;

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    // Reset window
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    const key = getRateLimitKey(req);
    if (isRateLimited(key)) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const { firstName, lastName, email, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
    }

    // Basic honeypot / spam word check
    const spamPatterns = /\b(viagra|casino|loan offer|click here|free money|earn \$|bitcoin investment)\b/i;
    if (spamPatterns.test(message)) {
      return NextResponse.json({ success: false, error: "Your message was flagged as spam." }, { status: 400 });
    }

    await connectDB();
    const newContact = await Contact.create({ firstName, lastName, email, message });

    // Send email notification (fire and forget — doesn't block response)
    sendContactNotificationEmail({ firstName, lastName, email, message });

    return NextResponse.json({ success: true, data: newContact }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
