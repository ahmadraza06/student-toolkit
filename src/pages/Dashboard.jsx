
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="max-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Student Toolkit
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>

        <p className="mt-3 text-gray-600">
          Manage your student tools, resumes, and study plans from one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/tools"
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            Student Tools
          </h2>

          <p className="mt-2 text-gray-600">
            Use CGPA, percentage, attendance and other student calculators.
          </p>

          <span className="mt-5 inline-block font-medium text-blue-600">
            Explore Tools →
          </span>
        </Link>

        <Link
          to="/resume-builder"
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            Resume Builder
          </h2>

          <p className="mt-2 text-gray-600">
            Create and manage your professional resume.
          </p>

          <span className="mt-5 inline-block font-medium text-blue-600">
            Build Resume →
          </span>
        </Link>

        <Link
          to="/my-resumes"
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            My Resumes
          </h2>

          <p className="mt-2 text-gray-600">
            View, edit and delete your saved resumes.
          </p>

          <span className="mt-5 inline-block font-medium text-blue-600">
            View Resumes →
          </span>
        </Link>

        <Link
          to="/timetable"
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            Timetable Generator
          </h2>

          <p className="mt-2 text-gray-600">
            Generate a personalized study timetable.
          </p>

          <span className="mt-5 inline-block font-medium text-blue-600">
            Create Timetable →
          </span>
        </Link>

        <Link
          to="/my-timetables"
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            My Timetables
          </h2>

          <p className="mt-2 text-gray-600">
            View and manage your saved study plans.
          </p>

          <span className="mt-5 inline-block font-medium text-blue-600">
            View Timetables →
          </span>
        </Link>
      </div>
    </main>
  );
}