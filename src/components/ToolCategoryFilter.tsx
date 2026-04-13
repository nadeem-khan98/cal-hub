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
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
            active === "all"
              ? "bg-blue-600 text-white border-blue-600 shadow"
              : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          <span className="text-base">⚡</span>
          All
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              active === "all"
                ? "bg-white/20 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            }`}
          >
            {tools?.length || 0}
          </span>
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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                active === cat.slug
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {/* ✅ ICON */}
              <span className="text-base">
                {categoryIcons[cat.slug?.toLowerCase()] || "📁"}
              </span>

              {/* NAME */}
              {cat.name}

              {/* COUNT */}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  active === cat.slug
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {count}
              </span>
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
              className="group p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-300 flex flex-col h-full"
            >
              {/* ICON BOX */}
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition">
                <Calculator size={24} />
              </div>

              {/* CATEGORY TAG */}
              {tool.category && tool.category !== "other" && (
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500 mb-2">
                  {tool.category}
                </span>
              )}

              {/* TITLE */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {tool.name}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {tool.description}
              </p>

              {/* CTA */}
              <span className="mt-auto text-sm font-medium text-blue-600 group-hover:underline">
                Start Calculating →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}