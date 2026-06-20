import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";

export default async function ToolCTA({ slug }: { slug: string }) {
  await connectDB();
  const tool = await Tool.findOne({ slug }).lean();

  if (!tool) return null;

  return (
    <div className="my-10 p-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-white dark:bg-[#111827] text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mr-5 shadow-sm">
            <Calculator size={28} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Featured Tool</span>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-1 shadow-current">{tool.name}</h4>
          </div>
        </div>
        <Link 
          href={`/tools/${tool.slug}`} 
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Use Now <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
