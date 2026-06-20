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
const formatted = parseFloat(final.toFixed(2));
setResult(formatted.toString());
  };

  return (
    <div className="w-full">
      <form onSubmit={calculatePercentage} className="space-y-6">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">What is</label>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-8"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                placeholder="20"
              />
              <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 font-bold">%</span>
            </div>
          </div>
          <div className="pb-3 hidden sm:block text-gray-500 dark:text-gray-400 font-medium">of</div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Number</label>
            <input
              type="number"
              step="any"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="150"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          Calculate Percentage
        </button>
      </form>

      {result && (
        <div className="mt-10 p-8 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-2xl text-center animate-in fade-in zoom-in duration-300">
          <p className="text-sm text-green-800 dark:text-green-400 font-bold uppercase tracking-wider mb-2">{percent}% of {total} is</p>
          <div className="text-5xl font-bold text-green-700 dark:text-green-300 tracking-tight">{result}</div>
        </div>
      )}
    </div>
  );
}
