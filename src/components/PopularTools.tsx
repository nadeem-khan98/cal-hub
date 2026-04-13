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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">⭐ Popular Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool: any) => (
          <Link 
            key={tool._id.toString()} 
            href={`/tools/${tool.slug}`}
            className="group p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all flex flex-col h-full relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
              <Calculator size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1 line-clamp-2">{tool.description}</p>
            <div className="mt-auto text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center">
              Use Tool <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
