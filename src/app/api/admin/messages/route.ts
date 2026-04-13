import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";

// GET /api/admin/messages - returns all messages with unread count
export async function GET() {
  try {
    await connectDB();
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    const unreadCount = await Contact.countDocuments({ read: false });
    return NextResponse.json({ success: true, data: messages, unreadCount }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
