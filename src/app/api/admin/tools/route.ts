import { NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Debug log to check if category is coming through
    console.log("Incoming create:", body);

    await connectDB();
    const tool = await Tool.create({
      name: body.name,
      slug: body.slug,
      description: body.description,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      category: body.category || "other", // ✅ IMPORTANT FIX: default to 'other'
      inputs: body.inputs || [],
    });
    
    return NextResponse.json({ success: true, data: tool }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
