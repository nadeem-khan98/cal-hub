"use client";

import { useState } from "react";

export default function GPACalculator() {
  const [courses, setCourses] = useState([{ grade: "A", credits: "3" }]);
  const [result, setResult] = useState<string | null>(null);

  const gradeMap: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0,
  };

  const addCourse = () => {
    setCourses([...courses, { grade: "A", credits: "3" }]);
  };

  const updateCourse = (index: number, field: "grade" | "credits", value: string) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const calculateGPA = (e: React.FormEvent) => {
    e.preventDefault();
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((c) => {
      const cr = parseFloat(c.credits);
      if (!isNaN(cr) && cr > 0) {
        totalCredits += cr;
        totalPoints += gradeMap[c.grade] * cr;
      }
    });

    if (totalCredits > 0) {
      setResult((totalPoints / totalCredits).toFixed(2));
    } else {
      setResult("0.00");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={calculateGPA} className="space-y-6">
        <div className="space-y-3">
          {courses.map((course, index) => (
            <div key={index} className="flex gap-3 items-end group">
              <div className="flex-[2] min-w-0">
                {index === 0 && <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Grade</label>}
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={course.grade}
                  onChange={(e) => updateCourse(index, "grade", e.target.value)}
                >
                  {Object.keys(gradeMap).map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-0">
                {index === 0 && <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Credits</label>}
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={course.credits}
                  onChange={(e) => updateCourse(index, "credits", e.target.value)}
                />
              </div>
              <div className="pb-1 text-center">
                {courses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCourse(index)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button
            type="button"
            onClick={addCourse}
            className="w-full sm:w-auto px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
          >
            + Add Class
          </button>
          <button
            type="submit"
            className="w-full sm:flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Calculate GPA
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-10 p-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl text-center animate-in fade-in zoom-in duration-300">
          <p className="text-sm text-blue-800 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">Cumulative GPA</p>
          <div className="text-5xl font-bold text-blue-900 dark:text-blue-300 tracking-tight">{result}</div>
        </div>
      )}
    </div>
  );
}
