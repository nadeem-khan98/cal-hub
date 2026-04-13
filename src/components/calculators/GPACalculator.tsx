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
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-2xl mx-auto w-full">
        <form onSubmit={calculateGPA} className="space-y-6">
          <div className="space-y-4">
            {courses.map((course, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Grade</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800"
                    value={course.grade}
                    onChange={(e) => updateCourse(index, "grade", e.target.value)}
                  >
                    {Object.keys(gradeMap).map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Credits</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                    value={course.credits}
                    onChange={(e) => updateCourse(index, "credits", e.target.value)}
                  />
                </div>
                {courses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCourse(index)}
                    className="sm:mt-5 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={addCourse}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors border border-gray-200"
            >
              + Add Class
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100"
            >
              Calculate GPA
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm text-blue-800 font-medium mb-1">Your Semester GPA is</p>
            <p className="text-5xl font-bold text-blue-900 tracking-tight">{result}</p>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-gray-600">
        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">How to Calculate GPA</h2>
          <p>
            Your Grade Point Average (GPA) is the standard measurement used by schools worldwide to evaluate your overall academic performance across a semester or entire degree. Calculating it manually involves juggling grade weight scales and varying credit hours, which can quickly become confusing.
          </p>
          <p>
            To compute your GPA, each alphabet grade (like an "A" or "B-") is converted to a numerical value on a 4.0 scale. An 'A' is worth 4.0, a 'B' is worth 3.0, and so on. You then multiply that numerical value by the number of credits the class is worth to get your "Quality Points". Finally, you add up all your Quality Points and divide them by the total number of credits you attempted.
          </p>
          <p>
            This tool handles the heavy lifting. Just plug in your grades and the credit hours for each class, and we instantly output your standardized 4.0 GPA!
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is a 3.5 GPA good?</h3>
              <p>Yes. A 3.5 GPA indicates that you are averaging midway between an A and a B. Most universities consider anything above a 3.0 to be a solid academic achievement.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is a weighted GPA?</h3>
              <p>A weighted GPA takes class difficulty into account. Honors or Advanced Placement (AP) classes might grade on a 5.0 scale instead of a 4.0 scale. This calculator currently uses standard unweighted 4.0 scaling.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
