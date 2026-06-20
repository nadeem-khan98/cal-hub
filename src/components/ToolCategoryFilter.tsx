"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { categoryIcons } from "@/lib/categoryIcons";

interface Tool {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ToolCategoryFilter({
  tools = [],
  categories = [],
}: {
  tools: Tool[];
  categories: Category[];
}) {
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all"
      ? tools
      : tools.filter((t) => t.category === active);

  return (
    <div>
      {/* 🔥 CATEGORY FILTER */}
      <div className="flex flex-wrap gap-3 mb-10">
        
        {/* ALL BUTTON */}
        <button
          onClick={() => setActive("all")}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${
            active === "all"
              ? "bg-blue-600 text-white border-blue-600 shadow-md translate-y-[-1px]"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All Tools
        </button>

        {/* CATEGORY BUTTONS */}
        {categories.map((cat) => {
          const count = tools.filter(
            (t) => t.category === cat.slug
          ).length;

          if (count === 0) return null;

          return (
            <button
              key={cat.slug}
              onClick={() => setActive(cat.slug)}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${
                active === cat.slug
                  ? "bg-blue-600 text-white border-blue-600 shadow-md translate-y-[-1px]"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 🔥 TOOL GRID */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400 dark:text-gray-500">
          <Calculator size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No tools in this category yet.</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((tool) => (
            <Link
              key={tool._id}
              href={`/tools/${tool.slug}`}
              className="group p-8 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 transition-all duration-300">
                <Calculator size={28} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                {tool.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-8 flex-1 leading-relaxed">
                {tool.description}
              </p>

              <div className="mt-auto inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400">
                Use Tool <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}