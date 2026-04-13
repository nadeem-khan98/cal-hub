



import { NextResponse } from "next/server";
import Category from "@/models/Category";
import dbConnect from "@/lib/db";

export async function GET() {
  await dbConnect();

  const categories = [
    "Finance","Math","Scientific","Unit Converter","Health","Fitness","Education","Business",
    "Engineering","Construction","Physics","Chemistry","Electrical","Computer","Network",
    "Data","Date & Time","Daily Life","Travel","Food & Nutrition","Sports","Gaming",
    "Security","Random Tools","Lifestyle","Shopping","Budget","Productivity","Salary","Tax"
  ];

  const created = [];

  for (let name of categories) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const exists = await Category.findOne({ slug });

    if (!exists) {
      const newCat = await Category.create({ name, slug });
      created.push(newCat);
    }
  }

  return NextResponse.json({
    message: "Categories seeded",
    count: created.length,
  });
}