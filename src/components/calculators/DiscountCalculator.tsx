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
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto w-full">
        <form onSubmit={calculateDiscount} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price ($)</label>
            <input
              type="number"
              step="any"
              required
              min="0"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 120"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Percentage (%)</label>
            <input
              type="number"
              step="any"
              required
              min="0"
              max="100"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="e.g. 15"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100"
          >
            Calculate final price
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex justify-between items-center">
              <span className="text-green-800 font-medium">Final Price You Pay</span>
              <span className="text-2xl font-bold text-green-900">${result.finalPrice}</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
              <span className="text-blue-800 font-medium">Amount Saved</span>
              <span className="text-xl font-bold text-blue-900">${result.saved}</span>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-gray-600">
        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">How to Calculate Shopping Discounts</h2>
          <p>
            Whether you are navigating Black Friday deals, seasonal clearance events, or applying an online promo code, calculating the final price before checkout ensures you are getting the value you expect. A discount is simply a percentage reduction off the sticker price of a good or service.
          </p>
          <p>
            To figure out the final price manually, you first find the discount amount by multiplying the original price by the discount percentage represented as a decimal (e.g., 20% becomes 0.20). Then, you subtract that discount amount from the original price to reveal the net cost. Our automated Discount Calculator sidesteps the complicated mental math, processing both the raw savings and your final checkout cost instantly.
          </p>
          <p>
            Always verify massive discount claims. A common retail tactic involves artificially inflating the baseline price before offering a "huge" percentage off. 
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Does the cost calculation include sales tax?</h3>
              <p>No. This tool calculates the base pre-tax cost. Sales and state taxes are usually applied to the final discounted amount at checkout.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I stack multiple discounts?</h3>
              <p>Stacking usually involves successive discounts. If a $100 item has a 20% discount plus an extra 10% coupon, the first discount drops it to $80. The 10% coupon applies to the $80, dropping it another $8 to a final $72 (not a flat 30% off).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
