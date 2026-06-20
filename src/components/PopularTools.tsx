import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";

export const revalidate = 3600; // Cache for 1 hour

export default async function PopularTools({ limit = 3 }: { limit?: number }) {
  await connectDB();
  const tools = await Tool.find({}).sort({ createdAt: -1 }).limit(limit).lean();

  if (!tools || tools.length === 0) return null;

  return (
    <section className="my-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Popular Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool: any) => (
          <Link 
            key={tool._id.toString()} 
            href={`/tools/${tool.slug}`}
            className="group p-8 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 transition-all duration-300">
              <Calculator size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{tool.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 flex-1 leading-relaxed line-clamp-2">{tool.description}</p>
            <div className="mt-auto inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400">
              Use Tool <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
