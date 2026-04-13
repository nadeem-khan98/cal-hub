"use client";

import { useState } from "react";

export default function LoanInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<null | { totalInterest: string; totalAmount: string }>(null);

  const calculateInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);

    if (isNaN(p) || isNaN(r) || isNaN(y)) return;

    // Simple Interest Formula: I = P * R * T / 100
    const interest = (p * r * y) / 100;
    const total = p + interest;

    setResult({
      totalInterest: interest.toFixed(2),
      totalAmount: total.toFixed(2),
    });
  };

  return (
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto w-full">
        <form onSubmit={calculateInterest} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Amount / Principal ($)</label>
            <input
              type="number"
              step="any"
              required
              min="0"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="10000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Interest Rate (%)</label>
            <input
              type="number"
              step="any"
              required
              min="0"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="5"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Time (Years)</label>
            <input
              type="number"
              step="any"
              required
              min="0"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="3"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100"
          >
            Calculate Interest
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
              <span className="text-blue-800 font-medium">Total Interest Accrued</span>
              <span className="text-xl font-bold text-blue-900">${result.totalInterest}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Repayment Amount</span>
              <span className="text-xl font-bold text-gray-900">${result.totalAmount}</span>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-gray-600">
        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">Understanding Simple Loan Interest</h2>
          <p>
            When you take out a personal loan or borrow money, you are usually charged a fee for the privilege of accessing those funds. This fee is called interest. Calculating exactly how much total interest you will pay is the first step in responsible financial planning.
          </p>
          <p>
            This tool handles a fundamental **Simple Interest** calculation. The formula is `Interest = Principal × Rate × Time`. It allows you to quickly figure out how much a loan will actually cost you over its entire lifespan. If you borrow $10,000 at a 5% simple annual rate for 3 years, you owe exactly $1,500 in pure interest.
          </p>
          <p>
            By playing with the numbers, you can visibly see how extending a loan from 3 years to 5 years dramatically inflates the total amount paid back to the bank, even if the monthly rate looks appealing. 
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is the difference between Simple and Compound Interest?</h3>
              <p>Simple interest calculates costs purely based on the initial borrowed principal. Compound interest calculates costs on the principal PLUS all previously accumulated interest. Mortgages typically use a compound calculation.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use this for credit cards?</h3>
              <p>Credit cards do not use simple interest—they use daily compounding interest. This calculator is best for flat personal loans or family loans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
