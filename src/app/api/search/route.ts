import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";
import Blog from "@/models/Blog";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ tools: [], blogs: [] });
    }

    await connectDB();

    const regex = new RegExp(q, "i");

    const [tools, blogs] = await Promise.all([
      Tool.find({
        $or: [{ name: regex }, { description: regex }],
      })
        .select("name slug description category")
        .limit(5)
        .lean(),

      Blog.find({
        $or: [{ title: regex }, { content: regex }],
      })
        .select("title slug metaDescription")
        .limit(5)
        .lean(),
    ]);

    return NextResponse.json({ tools, blogs });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, tools: [], blogs: [] },
      { status: 500 }
    );
  }
}
