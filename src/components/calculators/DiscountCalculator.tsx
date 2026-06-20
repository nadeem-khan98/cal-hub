"use client";

import { useState } from "react";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [result, setResult] = useState<null | { saved: string; finalPrice: string }>(null);

  const calculateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);
    if (isNaN(price) || isNaN(discount)) return;

    const savedAmount = (price * discount) / 100;
    const final = price - savedAmount;

    setResult({
      saved: savedAmount.toFixed(2),
      finalPrice: final.toFixed(2),
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={calculateDiscount} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Original Price ($)</label>
            <input
              type="number"
              step="any"
              required
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 120"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Discount (%)</label>
            <input
              type="number"
              step="any"
              required
              min="0"
              max="100"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="e.g. 15"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          Calculate Discount
        </button>
      </form>

      {result && (
        <div className="mt-10 space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="p-8 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-2xl text-center">
            <span className="text-sm text-green-800 dark:text-green-400 font-bold uppercase tracking-wider mb-2">Final Price</span>
            <div className="text-4xl font-bold text-green-700 dark:text-green-300 tracking-tight">${result.finalPrice}</div>
          </div>
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl flex items-center justify-between px-8">
            <span className="text-blue-800 dark:text-blue-400 font-bold">Total Savings</span>
            <span className="text-xl font-bold text-blue-900 dark:text-blue-300">${result.saved}</span>
          </div>
        </div>
      )}
    </div>
  );
}
