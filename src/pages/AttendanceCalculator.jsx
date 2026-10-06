
import { useState } from "react";

function AttendanceCalculator() {
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [targetAttendance, setTargetAttendance] = useState("75");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function calculateAttendance() {
    setError("");
    setResult(null);

    if (
      totalClasses === "" ||
      attendedClasses === "" ||
      targetAttendance === ""
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const total = Number(totalClasses);
    const attended = Number(attendedClasses);
    const target = Number(targetAttendance);

    if (
      !Number.isFinite(total) ||
      !Number.isFinite(attended) ||
      !Number.isFinite(target)
    ) {
      setError("Please enter valid numbers.");
      return;
    }

    if (total <= 0) {
      setError("Total classes must be greater than 0.");
      return;
    }

    if (attended < 0) {
      setError("Attended classes cannot be negative.");
      return;
    }

    if (attended > total) {
      setError("Attended classes cannot be greater than total classes.");
      return;
    }

    if (target <= 0 || target > 100) {
      setError("Target attendance must be between 1% and 100%.");
      return;
    }

    const currentAttendance = (attended / total) * 100;

    let classesNeeded = 0;
    let classesCanMiss = 0;

    if (currentAttendance < target) {
      /*
        We need:

        (attended + x) / (total + x) >= target / 100

        Solve for x:

        100(attended + x) >= target(total + x)

        100attended + 100x >= targetTotal + targetx

        x(100 - target) >= targetTotal - 100attended

        x >=
        (targetTotal - 100attended) / (100 - target)
      */

      if (target === 100) {
        classesNeeded = total - attended;
      } else {
        classesNeeded = Math.ceil(
          (target * total - 100 * attended) / (100 - target)
        );
      }
    } else {
      /*
        We want:

        attended / (total + x) >= target / 100

        Solve for x:

        100attended >= target(total + x)

        x <= (100attended - targetTotal) / target
      */

      classesCanMiss = Math.floor(
        (100 * attended - target * total) / target
      );
    }

    setResult({
      currentAttendance: currentAttendance.toFixed(2),
      classesNeeded,
      classesCanMiss,
      target,
    });
  }

  function resetCalculator() {
    setTotalClasses("");
    setAttendedClasses("");
    setTargetAttendance("75");
    setResult(null);
    setError("");
  }

  return (
    <>
    <Helmet>
      <title>Attendance Calculator — Calculate Student Attendance | Student Toolkit</title>

      <meta
        name="description"
        content="Calculate your attendance percentage and find out how many classes you need to attend with the Student Toolkit Attendance Calculator."
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <link
        rel="canonical"
        href="https://student-vercel.app/attendance-calculator"
      />
    </Helmet>
    
    <section className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Student Tool
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Attendance Calculator
        </h1>

        <p className="mt-4 text-gray-600">
          Calculate your current attendance and find out how
          many classes you need to attend or can miss.
        </p>
      </div>

      {/* Calculator */}
      <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Total Classes */}
          <div>
            <label
              htmlFor="totalClasses"
              className="mb-2 block text-sm font-medium"
            >
              Total Classes
            </label>

            <input
              id="totalClasses"
              type="number"
              min="1"
              value={totalClasses}
              onChange={(e) => {
                setTotalClasses(e.target.value);
                setResult(null);
                setError("");
              }}
              placeholder="e.g. 40"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Attended Classes */}
          <div>
            <label
              htmlFor="attendedClasses"
              className="mb-2 block text-sm font-medium"
            >
              Classes Attended
            </label>

            <input
              id="attendedClasses"
              type="number"
              min="0"
              value={attendedClasses}
              onChange={(e) => {
                setAttendedClasses(e.target.value);
                setResult(null);
                setError("");
              }}
              placeholder="e.g. 32"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Target */}
          <div>
            <label
              htmlFor="targetAttendance"
              className="mb-2 block text-sm font-medium"
            >
              Target Attendance (%)
            </label>

            <input
              id="targetAttendance"
              type="number"
              min="1"
              max="100"
              value={targetAttendance}
              onChange={(e) => {
                setTargetAttendance(e.target.value);
                setResult(null);
                setError("");
              }}
              placeholder="e.g. 75"
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
            onClick={calculateAttendance}
            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Calculate Attendance
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
        <div className="mt-8 space-y-6">
          {/* Current Attendance */}
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Current Attendance
            </p>

            <p className="mt-2 text-5xl font-bold">
              {result.currentAttendance}%
            </p>

            <p className="mt-3 text-gray-600">
              Target: {result.target}%
            </p>
          </div>

          {/* Recommendation */}
          {result.currentAttendance < result.target ? (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Classes You Need to Attend
              </h2>

              <p className="mt-3 text-gray-600">
                You need to attend at least{" "}
                <span className="font-bold text-black">
                  {result.classesNeeded}
                </span>{" "}
                consecutive classes to reach {result.target}% attendance.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Classes You Can Miss
              </h2>

              <p className="mt-3 text-gray-600">
                You can miss up to{" "}
                <span className="font-bold text-black">
                  {result.classesCanMiss}
                </span>{" "}
                classes and still maintain at least {result.target}% attendance.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Formula */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">
          Attendance Formula
        </h2>

        <p className="mt-4 text-gray-600">
          Your attendance percentage is calculated using:
        </p>

        <div className="mt-5 rounded-xl border bg-gray-50 p-5">
          <p className="font-semibold">
            Attendance = (Classes Attended ÷ Total Classes) × 100
          </p>
        </div>
      </div>

      {/* Example */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          Example
        </h2>

        <p className="mt-4 text-gray-600">
          Suppose you attended 32 out of 40 classes.
        </p>

        <div className="mt-4 rounded-xl border bg-white p-5">
          <p className="font-medium">
            (32 ÷ 40) × 100 = 80%
          </p>
        </div>

        <p className="mt-4 text-gray-600">
          If your target is 75%, you can still miss some
          upcoming classes while remaining above the target.
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
              How is attendance calculated?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Divide the number of classes attended by the total
              number of classes and multiply by 100.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              What if my attendance is below the target?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              The calculator estimates the minimum number of
              consecutive classes you need to attend to reach
              your target.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              What if my attendance is already above the target?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              The calculator estimates how many upcoming classes
              you can miss while maintaining your target attendance.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default AttendanceCalculator;