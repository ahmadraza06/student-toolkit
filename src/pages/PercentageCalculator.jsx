

import { useState } from "react";

function PercentageCalculator() {
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");
  const [percentage, setPercentage] = useState(null);
  const [error, setError] = useState("");

  function calculatePercentage() {
    setError("");
    setPercentage(null);

    if (obtained === "" || total === "") {
      setError("Please enter both obtained marks and total marks.");
      return;
    }

    const obtainedMarks = Number(obtained);
    const totalMarks = Number(total);

    if (!Number.isFinite(obtainedMarks) || !Number.isFinite(totalMarks)) {
      setError("Please enter valid numbers.");
      return;
    }

    if (totalMarks <= 0) {
      setError("Total marks must be greater than 0.");
      return;
    }

    if (obtainedMarks < 0) {
      setError("Obtained marks cannot be negative.");
      return;
    }

    if (obtainedMarks > totalMarks) {
      setError("Obtained marks cannot be greater than total marks.");
      return;
    }

    const result = (obtainedMarks / totalMarks) * 100;

    setPercentage(result.toFixed(2));
  }

  function resetCalculator() {
    setObtained("");
    setTotal("");
    setPercentage(null);
    setError("");
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Student Tool
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Percentage Calculator
        </h1>

        <p className="mt-4 text-gray-600">
          Calculate your percentage quickly using your obtained
          marks and total marks.
        </p>
      </div>

      {/* Calculator */}
      <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Obtained Marks */}
          <div>
            <label
              htmlFor="obtained"
              className="mb-2 block text-sm font-medium"
            >
              Obtained Marks
            </label>

            <input
              id="obtained"
              type="number"
              min="0"
              value={obtained}
              onChange={(e) => {
                setObtained(e.target.value);
                setPercentage(null);
                setError("");
              }}
              placeholder="e.g. 450"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Total Marks */}
          <div>
            <label
              htmlFor="total"
              className="mb-2 block text-sm font-medium"
            >
              Total Marks
            </label>

            <input
              id="total"
              type="number"
              min="1"
              value={total}
              onChange={(e) => {
                setTotal(e.target.value);
                setPercentage(null);
                setError("");
              }}
              placeholder="e.g. 500"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={calculatePercentage}
            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Calculate Percentage
          </button>

          <button
            type="button"
            onClick={resetCalculator}
            className="rounded-lg border px-6 py-3 font-medium transition hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Result */}
      {percentage !== null && (
        <div className="mt-8 rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Your Percentage
          </p>

          <p className="mt-2 text-5xl font-bold">
            {percentage}%
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-xl bg-gray-50 p-5 text-left">
            <p className="text-sm text-gray-600">
              Calculation
            </p>

            <p className="mt-2 font-medium">
              ({obtained} ÷ {total}) × 100
            </p>

            <p className="mt-2 text-gray-600">
              = {percentage}%
            </p>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">
          How to calculate percentage?
        </h2>

        <p className="mt-4 text-gray-600">
          Percentage is calculated by dividing obtained marks
          by total marks and multiplying the result by 100.
        </p>

        <div className="mt-5 rounded-xl border bg-gray-50 p-5">
          <p className="font-semibold">
            Percentage = (Obtained Marks ÷ Total Marks) × 100
          </p>
        </div>
      </div>

      {/* Example */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          Example
        </h2>

        <p className="mt-4 text-gray-600">
          Suppose you scored 450 marks out of 500:
        </p>

        <div className="mt-4 rounded-xl border bg-white p-5">
          <p className="font-medium">
            (450 ÷ 500) × 100 = 90%
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-semibold">
              How is percentage calculated?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Divide your obtained marks by your total marks and
              multiply the result by 100.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Can I enter decimal marks?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Yes. The calculator accepts decimal values.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Can obtained marks be greater than total marks?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              No. The calculator will show an error because
              obtained marks cannot exceed total marks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PercentageCalculator;