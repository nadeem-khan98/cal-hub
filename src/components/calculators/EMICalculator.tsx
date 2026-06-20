"use client";

import { useState } from "react";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState<null | { emi: string; totalInterest: string; totalPayment: string }>(null);

  const calculateEMI = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100; // Monthly interest rate
    const n = parseFloat(time) * 12; // Total number of months

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) return;

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    setResult({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2)
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={calculateEMI} className="space-y-6">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Loan Amount ($)</label>
            <input
              type="number"
              required
              min="1000"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="e.g. 50000"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Interest Rate (%)</label>
              <input
                type="number"
                step="any"
                required
                min="0.1"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g. 5.5"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tenure (Years)</label>
              <input
                type="number"
                required
                min="1"
                max="40"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          Calculate EMI
        </button>
      </form>

      {result && (
        <div className="mt-10 space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="p-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-sm text-blue-800 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">Monthly EMI</span>
            <span className="text-4xl font-bold text-blue-900 dark:text-blue-300 tracking-tight">${result.emi}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-2xl text-center">
              <span className="block text-sm text-green-800 dark:text-green-400 font-bold uppercase tracking-wider mb-1">Total Interest</span>
              <span className="text-xl font-bold text-green-700 dark:text-green-300">${result.totalInterest}</span>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-center">
              <span className="block text-sm text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Total Payment</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">${result.totalPayment}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
