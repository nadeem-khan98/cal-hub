import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";

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

// Map slugs to components exactly matching the DB seed
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
  const tool = await Tool.findOne({ slug }).lean();

  if (!tool) {
    notFound();
  }

  const ActiveCalculator = ToolComponents[slug] || null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-white">
      <Link href="/tools" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 mb-10 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Tools
      </Link>

      <div className="text-center mb-16 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6">
          <Calculator size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          {tool.name}
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed text-balance">
          {tool.description}
        </p>
      </div>

      <div className="mb-20">
        {ActiveCalculator ? (
          <ActiveCalculator />
        ) : (
          <div className="bg-gray-50 border border-gray-200 text-gray-500 p-8 rounded-2xl text-center">
            <p>This calculator logic is currently being implemented.</p>
          </div>
        )}
      </div>

      <div className="pt-12 border-t border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need more insights?</h2>
        <p className="text-gray-500 mb-6">Check out our related articles and guides to make the most of our tools.</p>
        <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
          Browse Blog Articles
        </Link>
      </div>
    </div>
  );
}
