import { Metadata } from "next";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";
import Category from "@/models/Category";
import ToolCategoryFilter from "@/components/ToolCategoryFilter";

export const metadata: Metadata = {
  title: "All Calculator Tools - CalcHub",
  description:
    "Browse free online calculators for finance, math, health, and more. Fast, accurate, and easy-to-use tools.",
};

export const revalidate = 3600;

export default async function ToolsIndex() {
  await connectDB();

  const [tools, categories] = await Promise.all([
    Tool.find({})
      .select("name slug description category")
      .sort({ createdAt: -1 })
      .lean(),

    Category.find({})
      .select("name slug")
      .sort({ name: 1 })
      .lean(),
  ]);

  // ✅ Safe serialization
  const serializedTools =
    tools?.map((t: any) => ({
      _id: t._id.toString(),
      name: t.name,
      slug: t.slug,
      description: t.description,
      category: t.category || "other",
    })) || [];

  const serializedCategories =
    categories?.map((c: any) => ({
      _id: c._id.toString(),
      name: c.name,
      slug: c.slug,
    })) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      
      {/* 🔥 HEADER */}
      <div className="max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 
          bg-gradient-to-r from-blue-600 to-indigo-500 
          bg-clip-text text-transparent">
          All Calculator Tools
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore our collection of fast, accurate, and free calculators for finance,
          math, health, and daily use.
        </p>
      </div>

      {/* 🔥 CATEGORY + TOOLS (CLIENT COMPONENT) */}
      <ToolCategoryFilter
        tools={serializedTools}
        categories={serializedCategories}
      />
    </div>
  );
}