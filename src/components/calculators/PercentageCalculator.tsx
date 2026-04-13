"use client";

import { useState } from "react";

export default function PercentageCalculator() {
  const [percent, setPercent] = useState("");
  const [total, setTotal] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const calculatePercentage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(percent);
    const t = parseFloat(total);
    if (isNaN(p) || isNaN(t)) return;
    const final = (p / 100) * t;
    setResult(final.toString());
  };

  return (
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto w-full">
        <form onSubmit={calculatePercentage} className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">What is</label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800 pr-8"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  placeholder="20"
                />
                <span className="absolute right-3 top-3 text-gray-500 font-bold">%</span>
              </div>
            </div>
            <div className="pt-8 text-gray-500 font-medium">of</div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Number</label>
              <input
                type="number"
                step="any"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="150"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100"
          >
            Calculate
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm text-green-700 font-medium mb-1">{percent}% of {total} is</p>
            <p className="text-5xl font-bold text-green-900 tracking-tight">{result}</p>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-gray-600">
        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">Understanding Percentages</h2>
          <p>
            A percentage represents a fraction of 100. It is a mathematical concept used extensively in daily life, from figuring out the tip at a restaurant to calculating taxes, discounts during shopping sales, or interest rates on your savings account.
          </p>
          <p>
            The simplest way to calculate a percentage manually is to multiply the base number by the percentage value divided by 100. For instance, finding 20% of 150 means you calculate <code>150 × (20/100)</code>, which equals 30. Our free percentage calculator automates this logic so you can get immediate, error-free results, saving time and mental energy.
          </p>
          <p>
            By using this tool, you can simplify financial planning, academic grading, and routine shopping calculations with a click of a button.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I find the percentage of a total?</h3>
              <p>Divide the part by the total, then multiply by 100. For example, if you scored 45 out of 50 on a test: (45 ÷ 50) × 100 = 90%.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What does "percent" actually mean?</h3>
              <p>The word comes from the Latin "per centum," which means "by a hundred" or "for every hundred."</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can a percentage be greater than 100?</h3>
              <p>Yes. A percentage over 100 simply indicates that you have a quantity larger than the original base number. For example, 200% of 50 is 100.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
