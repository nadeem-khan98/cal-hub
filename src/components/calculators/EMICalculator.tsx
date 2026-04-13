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
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto w-full">
        <form onSubmit={calculateEMI} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Amount ($)</label>
            <input
              type="number"
              required
              min="1000"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="e.g. 50000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Interest Rate (%)</label>
            <input
              type="number"
              step="any"
              required
              min="0.1"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 5.5"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Tenure (Years)</label>
            <input
              type="number"
              required
              min="1"
              max="40"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100"
          >
            Calculate EMI
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
              <span className="text-blue-800 font-medium text-lg">Monthly EMI</span>
              <span className="text-3xl font-bold text-blue-900 tracking-tight">${result.emi}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Interest</span>
              <span className="text-xl font-bold text-gray-900">${result.totalInterest}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Payment (Principal + Interest)</span>
              <span className="text-xl font-bold text-gray-900">${result.totalPayment}</span>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-gray-600">
        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">Understanding Equated Monthly Installment (EMI)</h2>
          <p>
            An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. Equated monthly installments are used to pay off both interest and principal each month so that over a specified number of years, the loan is fully paid off.
          </p>
          <p>
            Our EMI calculator handles complex amortization schedules instantaneously. By playing with the variables—the principal amount, the interest rate, and the timeline—you can reverse-engineer what kind of home, car, or personal loan actually fits into your monthly budget. Remember that extending the loan term will drastically reduce the monthly payment, but will significantly increase the total overall interest you pay to the bank.
          </p>
          <p>
            Always attempt to put more money towards your starting principal amount (down payment) to heavily cut down the overall loan cost burden.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can EMI change over time?</h3>
              <p>For a fixed-rate loan, the EMI amount remains completely static for the duration of the loan. However, for a floating/variable interest rate loan, the EMI amount will fluctuate along with market interest rates.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What does amortization mean?</h3>
              <p>Amortization refers to spreading out your loan into a series of fixed payments. At the beginning of the loan, most of your EMI goes towards interest. At the end of the loan, the majority of the EMI goes towards the principal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
