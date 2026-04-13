import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";

export async function GET() {
  try {
    await connectDB();
    const tools = await Tool.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: tools });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const tool = await Tool.create(body);
    return NextResponse.json({ success: true, data: tool }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
