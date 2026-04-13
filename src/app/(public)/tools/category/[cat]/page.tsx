import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calculator, ArrowLeft } from "lucide-react";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";
import Category from "@/models/Category";

type Props = {
  params: Promise<{ cat: string }>;
};

// Fallback metadata for categories that might not have a description in the DB
const DEFAULT_META: Record<string, { emoji: string; headline_prefix: string }> = {
  finance: { emoji: "💰", headline_prefix: "Finance" },
  math: { emoji: "📐", headline_prefix: "Math" },
  health: { emoji: "❤️", headline_prefix: "Health" },
  converter: { emoji: "🔄", headline_prefix: "Unit" },
};

export async function generateStaticParams() {
  await connectDB();
  const categories = await Category.find({}).select("slug").lean();
  return categories.map((cat: any) => ({ cat: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  await connectDB();
  const category = await Category.findOne({ slug: cat }).lean();
  
  if (!category) {
    return { title: "Category Not Found" };
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  return {
    title: `${category.name} Calculators — Free Online Tools | CalcHub`,
    description: category.description || `Browse our collection of free ${category.name} calculators and tools on CalcHub.`,
    alternates: {
      canonical: `${baseUrl}/tools/category/${cat}`,
    },
  };
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: Props) {
  const { cat } = await params;

  await connectDB();
  
  const [category, categories, tools] = await Promise.all([
    Category.findOne({ slug: cat }).lean(),
    Category.find({}).select("name slug").sort({ name: 1 }).lean(),
    Tool.find({ category: cat })
      .select("name slug description category")
      .sort({ createdAt: -1 })
      .lean()
  ]);

  if (!category) {
    notFound();
  }

  const meta = DEFAULT_META[cat] || { emoji: "🔧", headline_prefix: "" };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Back link */}
      <Link
        href="/tools"
        className="inline-flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-10 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1.5" />
        All Tools
      </Link>

      {/* Header */}
      <div className="mb-12">
        <div className="text-5xl mb-4">{meta.emoji}</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          {category.name} {meta.headline_prefix ? "" : "Calculators"}
          {meta.headline_prefix && `${meta.headline_prefix} Calculators`}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
          {category.description || `Free and accurate ${category.name.toLowerCase()} calculators to help you solve everyday problems.`}
        </p>
      </div>

      {/* Category pills (links to sibling categories from DB) */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((c: any) => (
          <Link
            key={c.slug}
            href={`/tools/category/${c.slug}`}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
              c.slug === cat
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            {DEFAULT_META[c.slug]?.emoji || "🔧"} {c.name}
          </Link>
        ))}
      </div>

      {/* Tools Grid */}
      {tools.length === 0 ? (
        <div className="py-20 text-center text-gray-400 dark:text-gray-500">
          <Calculator size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No tools in this category yet.</p>
          <p className="text-sm mt-2">
            <Link href="/tools" className="text-blue-500 hover:underline">
              Browse all tools →
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool: any) => (
            <Link
              key={tool._id.toString()}
              href={`/tools/${tool.slug}`}
              className="group p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md dark:hover:shadow-blue-900/10 transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 transition-colors">
                <Calculator size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {tool.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Start Calculating &rarr;
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
