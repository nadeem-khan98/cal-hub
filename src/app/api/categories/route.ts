import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

// GET /api/categories — public endpoint for frontend
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({})
      .select("name slug description")
      .sort({ name: 1 })
      .lean();
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
