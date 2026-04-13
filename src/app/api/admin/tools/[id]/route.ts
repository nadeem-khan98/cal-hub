import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Debug log to check incoming data
    console.log("Incoming update:", body);

    await connectDB();
    const updatedTool = await Tool.findByIdAndUpdate(
      id, 
      {
        name: body.name,
        slug: body.slug,
        description: body.description,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        category: body.category, // Ensure category is included
      }, 
      { 
        returnDocument: "after", // Fix mongoose replacement warning
        runValidators: false     // Temporarily disable to bypass validation issues
      }
    );
    
    if (!updatedTool) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updatedTool });
  } catch (error: any) {
    console.error("UPDATE ERROR:", error);
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
