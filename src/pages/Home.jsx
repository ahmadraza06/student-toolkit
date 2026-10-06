
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <>
      <Helmet>
        <title>Student Toolkit — Free Student Productivity Tools</title>

        <meta
          name="description"
          content="Student Toolkit offers free tools for CGPA, percentage, attendance, age calculation, study planning, and resume building."
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href="https://student-toolkit-zeta-seven.vercel.app/"
        />

        <meta
          property="og:title"
          content="Student Toolkit — Free Student Productivity Tools"
        />

        <meta
          property="og:description"
          content="Free calculators, study planning tools, and career tools designed to help students study and prepare for their careers."
        />

        <meta
          property="og:url"
          content="https://student-toolkit-zeta-seven.vercel.app/"
        />

        <meta
          property="og:type"
          content="website"
        />
      </Helmet>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-600">
            Built for Students
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Free Student Productivity Tools
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Student Toolkit brings useful academic, study, and career tools
            together in one simple platform. Calculate your CGPA, percentage,
            attendance, and age, create study plans, and build your resume.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/tools"
              className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Explore Student Tools
            </Link>

            <Link
              to="/resume-builder"
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-50"
            >
              Build Your Resume
            </Link>
          </div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="border-y bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need in one place
            </h2>

            <p className="mt-4 text-gray-600">
              Use practical tools to manage your academic calculations,
              organize your study time, and prepare for your career.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">
                Academic Calculators
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Calculate CGPA, percentage, attendance, age, and other useful
                academic values quickly.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">
                Study Planning
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Create a personalized timetable and organize your study time
                around your subjects and priorities.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">
                Resume Builder
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Create and manage a professional resume with your education,
                skills, projects, and experience.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">
                Student Friendly
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Simple tools designed to save students time and make everyday
                academic tasks easier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Popular Student Tools
            </h2>

            <p className="mt-3 text-gray-600">
              Quickly access the tools students use most.
            </p>
          </div>

          <Link
            to="/tools"
            className="font-medium text-blue-600 hover:underline"
          >
            View all tools →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/tools"
            className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="font-semibold">CGPA Calculator</h3>
            <p className="mt-2 text-sm text-gray-600">
              Calculate your CGPA quickly and easily.
            </p>
          </Link>

          <Link
            to="/tools"
            className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="font-semibold">Percentage Calculator</h3>
            <p className="mt-2 text-sm text-gray-600">
              Calculate marks percentage in seconds.
            </p>
          </Link>

          <Link
            to="/tools"
            className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="font-semibold">Attendance Calculator</h3>
            <p className="mt-2 text-sm text-gray-600">
              Check your current attendance and requirements.
            </p>
          </Link>

          <Link
            to="/tools"
            className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="font-semibold">Study Timetable</h3>
            <p className="mt-2 text-sm text-gray-600">
              Plan your study schedule around your subjects.
            </p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">
              Make your student life a little easier
            </h2>

            <p className="mt-4 leading-7 text-gray-300">
              Start with a calculator, create a study plan, or build your
              resume. Student Toolkit keeps useful student tools accessible
              from one place.
            </p>

            <div className="mt-8">
              <Link
                to="/tools"
                className="inline-block rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200"
              >
                Explore Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
