"use client";

import { useState } from "react";

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("1");
  const [result, setResult] = useState<null | { tipAmount: string; totalBill: string; perPerson: string }>(null);

  const calculateTip = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(bill);
    const t = parseFloat(tipPercent);
    const p = parseInt(people, 10);

    if (isNaN(b) || isNaN(t) || isNaN(p) || p < 1) return;

    const tipAmount = (b * t) / 100;
    const totalBill = b + tipAmount;
    const perPerson = totalBill / p;

    setResult({
      tipAmount: tipAmount.toFixed(2),
      totalBill: totalBill.toFixed(2),
      perPerson: perPerson.toFixed(2),
    });
  };

  return (
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto w-full">
        <form onSubmit={calculateTip} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Bill Amount ($)</label>
            <input
              type="number"
              step="any"
              required
              min="0"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              placeholder="e.g. 85.50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tip (%)</label>
              <input
                type="number"
                step="any"
                required
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
                value={tipPercent}
                onChange={(e) => setTipPercent(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Split the Bill (People)</label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100"
          >
            Calculate Tip
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Tip Amount</span>
              <span className="text-xl font-bold text-gray-900">${result.tipAmount}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Bill (w/ Tip)</span>
              <span className="text-xl font-bold text-gray-900">${result.totalBill}</span>
            </div>
            {parseInt(people) > 1 && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
                <span className="text-blue-800 font-medium">Each Person Pays</span>
                <span className="text-2xl font-bold text-blue-900">${result.perPerson}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-gray-600">
        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">Mastering the Tip Split</h2>
          <p>
            Whether grabbing lunch by yourself or celebrating a massive dinner with twelve of your closest friends, calculating the precise tip and parsing the bill efficiently can be a headache. Tipping customs differ violently from country to country, but in places like North America, gratuity is historically baked into the service economy.
          </p>
          <p>
            A traditional benchmark for good restaurant table service rests between 15% and 20%. Calculating this involves taking the bill, determining the percentage based on the quality of service, and then distributing the total check equally amongst parties. Using an intuitive Tip & Bill Splitter streamlines this inherently stressful post-meal ritual. 
          </p>
          <p>
            Avoid the awkward smartphone calculator glare and get instant metrics showing the raw tip payout, total inflated bill amount, and a per-person breakdown.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Should I tip on the pre-tax or post-tax amount?</h3>
              <p>Etiquette experts generally agree that you should calculate your tip based on the pre-tax amount. However, many people simply tip on the post-tax total for numerical simplicity.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if the calculation gives an awkward decimal?</h3>
              <p>Our app securely rounds payouts to the nearest two standard decimal digits to match global currency standards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
