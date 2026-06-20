"use client";

import { useState } from "react";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<null | { bmi: string; category: string }>(null);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;

    const bmiValue = w / (h * h);
    let category = "";

    if (bmiValue < 18.5) category = "Underweight";
    else if (bmiValue < 24.9) category = "Normal weight";
    else if (bmiValue < 29.9) category = "Overweight";
    else category = "Obesity";

    setResult({ bmi: bmiValue.toFixed(1), category });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Normal weight": return "text-emerald-600";
      case "Underweight": return "text-blue-600";
      case "Overweight": return "text-amber-500";
      case "Obesity": return "text-red-600";
      default: return "text-gray-900";
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={calculateBMI} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Height (cm)</label>
            <input
              type="number"
              required
              min="10"
              max="300"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 175"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
            <input
              type="number"
              required
              min="1"
              max="500"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 70"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          Calculate BMI
        </button>
      </form>

      {result && (
        <div className="mt-10 p-8 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-2xl text-center animate-in fade-in zoom-in duration-300">
          <p className="text-sm text-green-800 dark:text-green-400 font-bold uppercase tracking-wider mb-2">Your Result</p>
          <div className="text-5xl font-bold text-green-700 dark:text-green-300 mb-2 tracking-tight">
            {result.bmi}
          </div>
          <p className={`text-lg font-bold ${getCategoryColor(result.category)}`}>
            {result.category}
          </p>
        </div>
      )}
    </div>
  );
}
