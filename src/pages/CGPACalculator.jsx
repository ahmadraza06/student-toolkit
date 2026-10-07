import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { trackEvent } from "../services/analytics";
const initialSubject = {
  subject: "",
  grade: "",
  credit: "",
};

function CGPACalculator() {
  const [subjects, setSubjects] = useState([
    { ...initialSubject },
  ]);

  const [cgpa, setCgpa] = useState(null);
  const [error, setError] = useState("");

  function addSubject() {
    setSubjects([
      ...subjects,
      { ...initialSubject },
    ]);

    setCgpa(null);
    setError("");
  }

  function removeSubject(index) {
    if (subjects.length === 1) {
      setError("You need at least one subject.");
      return;
    }

    setSubjects(
      subjects.filter((_, i) => i !== index)
    );

    setCgpa(null);
    setError("");
  }

  function handleChange(index, field, value) {
    const updatedSubjects = [...subjects];

    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value,
    };

    setSubjects(updatedSubjects);

    setCgpa(null);
    setError("");
  }

  function calculateCGPA() {
    setError("");
    setCgpa(null);

    let totalWeightedPoints = 0;
    let totalCredits = 0;
    const breakdown = [];

    for (const subject of subjects) {
      const grade = Number(subject.grade);
      const credit = Number(subject.credit);

      if (
        subject.grade === "" ||
        subject.credit === ""
      ) {
        setError("Please fill in all grade and credit fields.");
        return;
      }

      if (
        !Number.isFinite(grade) ||
        !Number.isFinite(credit)
      ) {
        setError("Please enter valid numbers.");
        return;
      }

      if (grade < 0 || grade > 10) {
        setError("Grade point must be between 0 and 10.");
        return;
      }

      if (credit <= 0) {
        setError("Credit must be greater than 0.");
        return;
      }

        const weightedPoints = grade * credit;

        totalWeightedPoints += weightedPoints;
        totalCredits += credit;

        breakdown.push({
        subject: subject.subject || `Subject ${breakdown.length + 1}`,
        grade,
        credit,
        weightedPoints,
        });

    }

    if (totalCredits === 0) {
      setError("Total credits must be greater than 0.");
      return;
    }

    const result =
      totalWeightedPoints / totalCredits;

    setCgpa({
        value: result.toFixed(2),
        breakdown,
        totalCredits,
        totalWeightedPoints,
    });
    trackEvent("cgpa_calculated")
  }

  function resetCalculator() {
    setSubjects([
      { ...initialSubject },
    ]);

    setCgpa(null);
    setError("");
  }

  return (
    <>

    <Helmet>
      <title>CGPA Calculator — Free Online CGPA Calculator | Student Toolkit</title>

      <meta
        name="description"
        content="Calculate your CGPA quickly with the free Student Toolkit CGPA Calculator. Simple and easy to use for students."
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <link
        rel="canonical"
        href="https://student-toolkit-zeta-seven.vercel.app/tools/cgpa-calculator"
      />
    </Helmet>
    
    
    <section className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Student Tool
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          CGPA Calculator
        </h1>

        <p className="mt-4 text-gray-600">
          Enter your subjects, grade points and credits
          to calculate your CGPA.
        </p>
      </div>

      {/* Subjects */}
      <div className="mt-10 space-y-4">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">
                Subject {index + 1}
              </h2>

              <button
                type="button"
                onClick={() => removeSubject(index)}
                className="text-sm text-red-600"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Mathematics"
                  value={subject.subject}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "subject",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                />
              </div>

              {/* Grade */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Grade Point
                </label>

                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  placeholder="9"
                  value={subject.grade}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "grade",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                />
              </div>

              {/* Credit */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Credits
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="4"
                  value={subject.credit}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "credit",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addSubject}
          className="rounded-lg border px-5 py-3 font-medium"
        >
          + Add Subject
        </button>

        <button
          type="button"
          onClick={calculateCGPA}
          className="rounded-lg bg-black px-5 py-3 font-medium text-white"
        >
          Calculate CGPA
        </button>

        <button
          type="button"
          onClick={resetCalculator}
          className="rounded-lg border px-5 py-3 font-medium"
        >
          Reset
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Result */}
      {cgpa !== null && (
        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
                Your CGPA
            </p>

            <p className="mt-2 text-6xl font-bold">
                {cgpa.value}
            </p>
            </div>

            <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-125 text-left text-sm">
                <thead>
                <tr className="border-b">
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Credits</th>
                    <th className="px-4 py-3">
                    Grade × Credit
                    </th>
                </tr>
                </thead>

                <tbody>
                {cgpa.breakdown.map((item, index) => (
                    <tr key={index} className="border-b">
                    <td className="px-4 py-3">
                        {item.subject}
                    </td>

                    <td className="px-4 py-3">
                        {item.grade}
                    </td>

                    <td className="px-4 py-3">
                        {item.credit}
                    </td>

                    <td className="px-4 py-3">
                        {item.weightedPoints.toFixed(2)}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm">
            <p>
                Total Credits:{" "}
                <strong>{cgpa.totalCredits}</strong>
            </p>

            <p className="mt-2">
                Total Weighted Points:{" "}
                <strong>
                {cgpa.totalWeightedPoints.toFixed(2)}
                </strong>
            </p>

            <p className="mt-2">
                CGPA = Total Weighted Points ÷ Total Credits
            </p>
            </div>
        </div>
        )}
        <div className="mt-12 rounded-2xl border bg-white p-6">
  <h2 className="text-2xl font-bold">
    How to calculate CGPA
  </h2>

  <p className="mt-4 leading-7 text-gray-600">
    CGPA is calculated by multiplying each subject's
    grade point by its credit, adding the weighted
    points, and dividing the result by the total number
    of credits.
  </p>

  <div className="mt-6 rounded-lg bg-gray-50 p-4">
    <p className="font-medium">
      CGPA = Σ(Grade Point × Credit) ÷ Σ(Credits)
    </p>
  </div>
</div>
<div className="mt-8">
  <h2 className="text-2xl font-bold">
    Frequently Asked Questions
  </h2>

  <div className="mt-6 space-y-4">
    <details className="rounded-xl border bg-white p-5">
      <summary className="cursor-pointer font-semibold">
        What is CGPA?
      </summary>

      <p className="mt-3 text-gray-600">
        CGPA is a cumulative measure of academic
        performance based on grade points earned across
        subjects or semesters.
      </p>
    </details>

    <details className="rounded-xl border bg-white p-5">
      <summary className="cursor-pointer font-semibold">
        How is CGPA calculated?
      </summary>

      <p className="mt-3 text-gray-600">
        Multiply each grade point by the corresponding
        credit, add the results, and divide by total
        credits.
      </p>
    </details>

    <details className="rounded-xl border bg-white p-5">
      <summary className="cursor-pointer font-semibold">
        Can I use decimal grade points?
      </summary>

      <p className="mt-3 text-gray-600">
        Yes. The calculator accepts decimal grade points
        within the 0–10 range.
      </p>
    </details>
  </div>
</div>
    </section>
    </>

  );
}

export default CGPACalculator;