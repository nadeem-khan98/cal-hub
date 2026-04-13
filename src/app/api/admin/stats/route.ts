import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Tool from "@/models/Tool";
import Contact from "@/models/Contact";

// GET /api/admin/stats - unified dashboard stats
export async function GET() {
  try {
    await connectDB();
    const [blogs, tools, messages, unreadMessages] = await Promise.all([
      Blog.countDocuments(),
      Tool.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ read: false }),
    ]);

    return NextResponse.json({
      success: true,
      data: { blogs, tools, messages, unreadMessages },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
