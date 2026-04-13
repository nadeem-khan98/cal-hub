import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";

export default async function ToolCTA({ slug }: { slug: string }) {
  await connectDB();
  const tool = await Tool.findOne({ slug }).lean();

  if (!tool) return null;

  return (
    <div className="my-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mr-4">
            <Calculator size={24} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">💡 Try this tool:</span>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-0">{tool.name}</h4>
          </div>
        </div>
        <Link 
          href={`/tools/${tool.slug}`} 
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          Use {tool.name.split(" ")[0]} <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
