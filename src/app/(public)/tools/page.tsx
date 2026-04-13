import Link from "next/link";
import { Metadata } from "next";
import { Calculator } from "lucide-react";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";

export const metadata: Metadata = {
  title: "All Tools - CalcHub",
  description: "Browse our collection of free online calculators including BMI, Age, EMI, and more. Clean and accurate.",
};

export const revalidate = 3600;

export default async function ToolsIndex() {
  await connectDB();
  const tools = await Tool.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 bg-white text-gray-800">
      <div className="max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          All Calculator Tools
        </h1>
        <p className="text-lg text-gray-500">
          Select a tool below to quickly solve your math, health, and financial calculations.
        </p>
      </div>

      {tools.length === 0 ? (
        <div className="py-20 text-gray-500">
          <p>No tools available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool: any) => (
            <Link 
              key={tool._id.toString()} 
              href={`/tools/${tool.slug}`}
              className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Calculator size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-50 text-sm font-semibold text-blue-600">
                Start Calculating &rarr;
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
