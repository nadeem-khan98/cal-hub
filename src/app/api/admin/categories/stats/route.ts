import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Tool from "@/models/Tool";

// GET /api/admin/categories/stats
// Returns each category with its tool count and list of tools
export async function GET() {
  try {
    await connectDB();

    const [categories, tools] = await Promise.all([
      Category.find({}).sort({ name: 1 }).lean(),
      Tool.find({}).select("name slug category").lean(),
    ]);

    const stats = categories.map((cat: any) => {
      const catTools = tools.filter((t: any) => t.category === cat.slug);
      return {
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        toolCount: catTools.length,
        tools: catTools.map((t: any) => ({ name: t.name, slug: t.slug })),
      };
    });

    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
