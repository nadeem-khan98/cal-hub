"use client";import { differenceInMinutes, parse } from "date-fns";
import { useState } from "react";

export default function TimeDurationCalculator() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [result, setResult] = useState<string | null>(null);

  const calculateDuration = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse time strings into date objects loosely
    const start = parse(startTime, "HH:mm", new Date());
    let end = parse(endTime, "HH:mm", new Date());

    if (end < start) {
      // Assuming it crosses midnight
      end.setDate(end.getDate() + 1);
    }

    const totalMinutes = differenceInMinutes(end, start);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    setResult(`${hours} Hours and ${minutes} Minutes`);
  };

  return (
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto w-full">
        <form onSubmit={calculateDuration} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-800"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100"
          >
            Calculate Time Difference
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm text-blue-800 font-medium mb-1">Time Elapsed</p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-900 tracking-tight">{result}</p>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-gray-600">
        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">Calculating Time Duration</h2>
          <p>
            Figuring out exactly how many hours and minutes have passed between a specific start and end time is a common requirement for employee timesheets, logging freelance billing hours, or just tracking how long you've been working on a hobby project.
          </p>
          <p>
            Depending on if a shift crosses midnight (e.g. starting at 10 PM and ending at 6 AM), doing this math via 12-hour AM/PM formats can lead to error-prone manual calculations. A time duration calculator bridges this gap by automatically accounting for the 24-hour cycle clock. Give it two intervals, and it hands you the total net duration formatted gracefully in hours and minutes.
          </p>
          <p>
            Use this tool daily to accurately manage your schedule, guarantee your paystubs are correct, and improve your personal time management workflows.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What if my end time goes past midnight?</h3>
              <p>Our tool automatically recognizes if the end time is numerically smaller than the start time and assumes a day roll-over, seamlessly calculating the time over midnight!</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Does this support seconds?</h3>
              <p>For ease of use and standard billing/timesheet applications, this calculator only relies on the Hour and Minute precision.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
