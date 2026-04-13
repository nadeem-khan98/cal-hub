import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";
import Link from "next/link";
import { ArrowLeft, Calculator, HelpCircle, ArrowRight } from "lucide-react";

import BMICalculator from "@/components/calculators/BMICalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import EMICalculator from "@/components/calculators/EMICalculator";
import PercentageCalculator from "@/components/calculators/PercentageCalculator";
import DiscountCalculator from "@/components/calculators/DiscountCalculator";
import GPACalculator from "@/components/calculators/GPACalculator";
import CalorieCalculator from "@/components/calculators/CalorieCalculator";
import TimeDurationCalculator from "@/components/calculators/TimeDurationCalculator";
import TipCalculator from "@/components/calculators/TipCalculator";
import LoanInterestCalculator from "@/components/calculators/LoanInterestCalculator";
import AdSlot from "@/components/AdSlot";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const tool = await Tool.findOne({ slug }).lean();

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  return {
    title: tool.metaTitle || `${tool.name} - CalcHub`,
    description: tool.metaDescription || tool.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/tools/${tool.slug}`,
    },
  };
}

const ToolComponents: Record<string, React.FC> = {
  "bmi-calculator": BMICalculator,
  "age-calculator": AgeCalculator,
  "emi-calculator": EMICalculator,
  "percentage-calculator": PercentageCalculator,
  "discount-calculator": DiscountCalculator,
  "gpa-calculator": GPACalculator,
  "calorie-calculator": CalorieCalculator,
  "time-duration-calculator": TimeDurationCalculator,
  "tip-calculator": TipCalculator,
  "loan-interest-calculator": LoanInterestCalculator,
};

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  
  // Fetch current tool and some related tools
  const tool = await Tool.findOne({ slug }).lean();
  const allTools = await Tool.find({ _id: { $ne: tool?._id } }).limit(3).lean();

  if (!tool) {
    notFound();
  }

  const ActiveCalculator = ToolComponents[slug] || null;

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/tools" className="inline-flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-10 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Tools
        </Link>

        {/* Header */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 shadow-sm">
            <Calculator size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
            {tool.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed text-balance">
            {tool.description}
          </p>
        </div>

        <AdSlot position="Top of Tool" />

        {/* Main Calculator Area */}
        <div className="mb-16">
          {ActiveCalculator ? (
            <div className="p-1 sm:p-2 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <ActiveCalculator />
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 p-8 rounded-2xl text-center">
              <p>This calculator logic is currently being implemented.</p>
            </div>
          )}
        </div>

        <AdSlot position="Middle Setup" />

        {/* Explanation Section */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to use the {tool.name}</h2>
          <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <p>
              Using the <strong>{tool.name}</strong> is simple and straightforward. Just enter your details into the input fields above, and the tool will instantly compute the results. Our calculators are designed to give you perfectly accurate outputs based on standard formulas.
            </p>
            <p>
              Whether you are planning your finances, tracking health metrics, or doing quick daily math, this tool ensures you don't have to worry about the underlying complex equations. The results update in real-time, allowing you to tweak your inputs and instantly see the outcome.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <HelpCircle className="mr-3 text-blue-500" /> Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Is this tool free to use?</h3>
              <p className="text-gray-600 dark:text-gray-400">Yes! All our tools are 100% free with no sign-ups required. We believe in providing accessible utilities for everyone.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Are my inputs saved or tracked?</h3>
              <p className="text-gray-600 dark:text-gray-400">No, all calculations are performed locally in your browser. We prioritize your privacy and do not store any sensitive data you input into our calculators.</p>
            </div>
          </div>
        </section>

        <AdSlot position="Bottom of Tool" />

        {/* Related Tools */}
        <div className="pt-16 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {allTools.map((t: any) => (
              <Link 
                key={t._id.toString()} 
                href={`/tools/${t.slug}`}
                className="group p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all flex flex-col h-full"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{t.description}</p>
                <div className="mt-auto text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex items-center">
                  Try Tool <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center pb-8 border-t border-gray-100 dark:border-gray-800 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need more insights?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Check out our related articles and guides to make the most of our tools.</p>
            <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition">
              Browse Blog Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
