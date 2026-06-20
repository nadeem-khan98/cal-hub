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
import FAQ from "@/components/FAQ";

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
    <div className="bg-background transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/tools" className="inline-flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Tools
        </Link>

        {/* 1. Header (title + description) */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 text-blue-600 dark:text-blue-400 mb-6 shadow-sm">
            <Calculator size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
            {tool.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {tool.description}
          </p>
        </div>

        {/* 2. Top Ad (AdSense) */}
        <div className="mb-12">
          <AdSlot position="Top of Tool" />
        </div>

        {/* 3. Calculator Card (centered) */}
        <div className="mb-20 max-w-2xl mx-auto">
          {ActiveCalculator ? (
            <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-1 sm:p-2">
              <ActiveCalculator />
            </div>
          ) : (
            <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 text-gray-500 p-12 rounded-2xl text-center">
              <p>This calculator logic is currently being implemented.</p>
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          {/* 4. SEO Content Section (clean readable guide) */}
          <section className="mb-16">
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">How to use the {tool.name} effectively</h2>
              <p>
                Whether you are planning your finances, tracking health metrics, or doing quick daily math, this tool ensures you don't have to worry about the underlying complex equations. The results update in real-time, allowing you to tweak your inputs and instantly see the outcome.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 my-10">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">Pro Tip</h3>
                <p className="text-blue-800 dark:text-blue-400 text-sm mb-0">
                  Always double-check your input values to ensure maximum precision. Our tools are built with the latest standardized formulas to provide industry-leading accuracy.
                </p>
              </div>

              <h3>Main Features</h3>
              <ul className="space-y-4">
                <li><strong>Real-time updates:</strong> See your results change as you adjust your values.</li>
                <li><strong>Mobile Optimized:</strong> Works perfectly on smartphones, tablets, and desktops.</li>
                <li><strong>Privacy First:</strong> No data is sent to our servers; everything happens in your browser.</li>
              </ul>
            </div>
          </section>

          {/* 5. FAQ Section (ONLY ONE) */}
          <div className="mb-16">
            <FAQ faqs={[
              {
                question: "Is this tool free to use?",
                answer: "Yes! All our tools are 100% free with no sign-ups required. We believe in providing accessible utilities for everyone."
              },
              {
                question: "Are my inputs saved or tracked?",
                answer: "No, all calculations are performed locally in your browser. We prioritize your privacy and do not store any sensitive data you input into our calculators."
              },
              {
                question: "How accurate are the results?",
                answer: "We use standard mathematical formulas and medical/financial industry benchmarks to ensure high precision in all results."
              }
            ]} />
          </div>
        </div>

        {/* 6. Related Tools */}
        <div className="pt-16 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Related Tools</h2>
            <Link href="/tools" className="text-sm font-bold text-blue-600 hover:underline">View all tools</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allTools.map((t: any) => (
              <Link 
                key={t._id.toString()} 
                href={`/tools/${t.slug}`}
                className="group p-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col h-full"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{t.description}</p>
                <div className="mt-auto text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center">
                  Try Tool <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 7. Bottom Ad */}
        <div className="mt-20">
          <AdSlot position="Bottom of Tool" />
        </div>
      </div>
    </div>
  );
}
