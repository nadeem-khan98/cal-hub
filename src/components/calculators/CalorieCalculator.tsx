"use client";

import { useState } from "react";

export default function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState(""); // kg
  const [height, setHeight] = useState(""); // cm
  const [activity, setActivity] = useState("1.2"); // sedentary
  const [result, setResult] = useState<number | null>(null);

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const act = parseFloat(activity);

    if (isNaN(w) || isNaN(h) || isNaN(a) || isNaN(act)) return;

    // Mifflin-St Jeor Equation
    let bmr = 10 * w + 6.25 * h - 5 * a;
    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * act;
    setResult(Math.round(tdee));
  };

  return (
    <div className="space-y-12">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm max-w-xl mx-auto w-full transition-colors duration-300">
        <form onSubmit={calculateCalories} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Age</label>
              <input
                type="number"
                required
                min="15"
                max="80"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 dark:text-white"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
              <input
                type="number"
                required
                min="30"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 dark:text-white"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Height (cm)</label>
              <input
                type="number"
                required
                min="100"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 dark:text-white"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Activity Level</label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 dark:text-white"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            >
              <option value="1.2">Sedentary: little or no exercise</option>
              <option value="1.375">Light: exercise 1-3 times/week</option>
              <option value="1.55">Moderate: exercise 4-5 times/week</option>
              <option value="1.725">Active: daily exercise or intense exercise 3-4 times/week</option>
              <option value="1.9">Very Active: intense exercise 6-7 times/week</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-500/20 active:scale-[0.98]"
          >
            Calculate Maintenance Calories
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm text-orange-800 dark:text-orange-400 font-medium mb-1">You need to consume</p>
            <p className="text-4xl font-bold text-orange-900 dark:text-orange-300 tracking-tight">{result} <span className="text-xl">kcal/day</span></p>
            <p className="text-sm text-orange-700 dark:text-orange-400 font-medium mt-2">to maintain your current weight.</p>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-gray-600 dark:text-gray-400 transition-colors duration-300">
        <div className="prose prose-blue dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How to Calculate Your Maintenance Calories</h2>
          <p>
            Your Total Daily Energy Expenditure (TDEE) is an estimation of how many calories you burn per day when exercise is taken into account. Knowing this number is the single most important factor when figuring out how to build muscle effectively or lose body fat sustainably.
          </p>
          <p>
            This calculator is built using the universally accepted Mifflin-St Jeor equation. It first calculates your Basal Metabolic Rate (BMR)—the precise amount of energy your body uses just to keep your organs functioning while completely at rest. We multiply your BMR by your self-reported activity multiplier to generate your total output.
          </p>
          <p>
            If your goal is to lose weight, experts generally recommend subtracting 300 to 500 calories from your TDEE result. To pack on muscle mass, try adding a 300 to 500 calorie surplus!
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How accurate is the Mifflin-St Jeor equation?</h3>
              <p>It is widely considered the most accurate mathematical formula available without utilizing clinical-grade metabolic laboratory testing to gauge individual metabolism.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Should I eat the exact number of calories every day?</h3>
              <p>No, small daily fluctuations in calorie intake are completely normal! TDEE is an average target meant to guide your overall weekly caloric trend.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
