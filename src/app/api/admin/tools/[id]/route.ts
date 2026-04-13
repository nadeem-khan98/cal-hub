import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectDB();
    const tool = await Tool.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!tool) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: tool });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    await connectDB();
    const tool = await Tool.findByIdAndDelete(id);
    if (!tool) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
