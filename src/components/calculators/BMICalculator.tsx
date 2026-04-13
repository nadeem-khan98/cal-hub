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
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto w-full">
        <form onSubmit={calculateBMI} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm)</label>
            <input
              type="number"
              required
              min="10"
              max="300"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 175"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              required
              min="1"
              max="500"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 70"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100"
          >
            Calculate BMI
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm text-gray-500 font-medium mb-1">Your BMI Result</p>
            <p className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">{result.bmi}</p>
            <p className={`text-lg font-semibold ${getCategoryColor(result.category)}`}>
              {result.category}
            </p>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-gray-600">
        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">What is Body Mass Index (BMI)?</h2>
          <p>
            Body Mass Index (BMI) is a simple measurement using a person's height and weight to estimate how much body fat they have. The formula is universal and is widely used by healthcare professionals as a quick screening tool to identify possible weight problems for adults.
          </p>
          <p>
            While BMI is not a diagnostic tool, tracking it can be a valuable starting point for health discussions. A healthy BMI generally indicates a lower risk of chronic diseases such as heart disease, hypertension, and type 2 diabetes. However, BMI has limitations: it does not distinguish between fat and muscle. Therefore, athletes with high muscle mass may have a high BMI without necessarily being considered "overweight" in terms of fat.
          </p>
          <p>
            Maintaining a balanced diet and regular physical activity are key factors in achieving a healthy BMI range. Always consult a healthcare provider for a thorough health assessment.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is BMI accurate for everyone?</h3>
              <p>No. BMI does not account for muscle mass, bone density, or overall body composition. It might overestimate fat in athletes and underestimate fat in the elderly.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is a healthy BMI?</h3>
              <p>For most adults, a healthy BMI lies between 18.5 and 24.9. A value below 18.5 is considered underweight, while 25 or above is considered overweight.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Does age or sex affect BMI?</h3>
              <p>The standard BMI calculation is identical for both men and women, regardless of age. However, interpretation may vary slightly for older adults or specific demographics according to medical guidelines.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
