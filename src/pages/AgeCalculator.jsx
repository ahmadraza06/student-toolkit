
import { useState } from "react";
import  {Helmet} from "react-helmet-async";
import { trackEvent } from "../services/analytics";

function AgeCalculator() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function calculateAge() {
    setError("");
    setResult(null);

    if (!dateOfBirth) {
      setError("Please select your date of birth.");
      return;
    }

    const birthDate = new Date(`${dateOfBirth}T00:00:00`);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime())) {
      setError("Please enter a valid date.");
      return;
    }

    if (birthDate > today) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;

      const previousMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );

      days += previousMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor(
      (today - birthDate) / (1000 * 60 * 60 * 24)
    );

    setResult({
      years,
      months,
      days,
      totalDays,
    });
    trackEvent("age_calculated");
  }

  function resetCalculator() {
    setDateOfBirth("");
    setResult(null);
    setError("");
  }

  return (
    <> 
    <Helmet>
      <title>Age Calculator — Calculate Your Age Online | Student Toolkit</title>

      <meta
        name="description"
        content="Calculate your exact age in years, months, and days with the free Student Toolkit Age Calculator."
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <link
        rel="canonical"
        href="https://student-toolkit-zeta-seven.vercel.app/tools/age-calculator"
      />
    </Helmet> 
    
    <section className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Student Tool
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Age Calculator
        </h1>

        <p className="mt-4 text-gray-600">
          Calculate your exact age in years, months, and days
          from your date of birth.
        </p>
      </div>

      {/* Calculator */}
      <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <div>
          <label
            htmlFor="dateOfBirth"
            className="mb-2 block text-sm font-medium"
          >
            Date of Birth
          </label>

          <input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
              setResult(null);
              setError("");
            }}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
          />
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
            onClick={calculateAge}
            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Calculate Age
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
      {result && (
        <div className="mt-8 rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Your Exact Age
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-4xl font-bold">
                {result.years}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Years
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-4xl font-bold">
                {result.months}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Months
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-4xl font-bold">
                {result.days}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Days
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Approximate total days lived
            </p>

            <p className="mt-2 text-2xl font-bold">
              {result.totalDays.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">
          How does the age calculator work?
        </h2>

        <p className="mt-4 leading-7 text-gray-600">
          The calculator compares your date of birth with today's
          date. It calculates the difference in years, then adjusts
          the remaining months and days to give you an exact age.
        </p>
      </div>

      {/* Example */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          Example
        </h2>

        <p className="mt-4 text-gray-600">
          If someone was born on 15 January 2005, the calculator
          compares that date with today's date and displays their
          completed years, remaining months, and remaining days.
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-semibold">
              Can I select a future date?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              No. A date of birth cannot be in the future.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Does it calculate months and days too?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Yes. The result shows your age in completed years,
              remaining months, and remaining days.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Does the calculator use today's date?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Yes. The calculation uses the current date whenever
              you click Calculate Age.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default AgeCalculator;