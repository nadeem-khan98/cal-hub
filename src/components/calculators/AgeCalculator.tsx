"use client";

import { useState } from "react";
import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<null | { years: number; months: number; days: number }>(null);

  const calculateAge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      alert("Date of birth cannot be in the future");
      return;
    }

    const years = differenceInYears(today, birthDate);
    const dateAfterYears = new Date(birthDate);
    dateAfterYears.setFullYear(dateAfterYears.getFullYear() + years);
    
    const months = differenceInMonths(today, dateAfterYears);
    const dateAfterMonths = new Date(dateAfterYears);
    dateAfterMonths.setMonth(dateAfterMonths.getMonth() + months);
    
    const days = differenceInDays(today, dateAfterMonths);

    setResult({ years, months, days });
  };

  return (
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto w-full">
        <form onSubmit={calculateAge} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100"
          >
            Calculate Exact Age
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm text-blue-800 font-medium mb-4">Your exact age today</p>
            <div className="flex justify-center items-end space-x-6">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-extrabold text-blue-900 tracking-tight">{result.years}</span>
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide mt-1">Years</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-extrabold text-blue-900 tracking-tight">{result.months}</span>
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide mt-1">Months</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-extrabold text-blue-900 tracking-tight">{result.days}</span>
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide mt-1">Days</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-gray-600">
        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">Why Use an Age Calculator?</h2>
          <p>
            An age calculator determines your exact chronological age from the provided date of birth up to the current day. This measurement is calculated accurately in years, months, and days. But why do we need a digital tool for this?
          </p>
          <p>
            While calculating the year difference is simple, calculating the precise months and days manually quickly becomes complicated. Leap years, months possessing varying day counts (30 vs 31), and February’s shortened 28-day schedule can easily disrupt manual math resulting in incorrect filings.
          </p>
          <p>
            Our tool uses precise computational date functions to guarantee you get a result matching legal and standard Western calendrical standards. This makes our tool vital for applications involving hospital administration, official passport documents, and insurance agency applications!
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Does this calculator adapt to leap years?</h3>
              <p>Yes. The underlying system library correctly accounts for leap years historically ensuring that February 29th cycles do not skew your result.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use this for historical figures?</h3>
              <p>Yes! Simply input the birth date of any individual, and the calculator determines their exact age relative to today’s standard date.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
