

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyResumes,
  fetchResumeById,
  deleteResume,
} from "../services/resumeApi";

export default function MyResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function loadResumes() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchMyResumes();
      setResumes(data.data.resumes);
    } catch (err) {
      setError(err.message || "Could not load resumes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResumes();
  }, []);

  function createNewResume() {
    navigate("/resume-builder", {
      state: { resumeId: null, resume: null },
    });
  }

  async function handleEdit(id) {
    setError("");

    try {
      const resume = await fetchResumeById(id);

      navigate("/resume-builder", {
        state: {
          resumeId: id,
          resume,
        },
      });
    } catch (err) {
      setError(err.message || "Could not open resume.");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      await deleteResume(id);

      setResumes((current) =>
        current.filter((resume) => resume._id !== id)
      );
    } catch (err) {
      setError(err.message || "Could not delete resume.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p className="p-6">Loading your resumes...</p>;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <p className="mt-2 text-gray-600">
            Manage your saved resumes.
          </p>
        </div>

        <button
          onClick={createNewResume}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + Create Resume
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold">
            No saved resumes yet
          </h2>
          <p className="my-3 text-gray-600">
            Create your first resume to get started.
          </p>
          <button
            onClick={createNewResume}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Create Resume
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <article
              key={resume._id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <h2 className="truncate text-xl font-semibold">
                {resume.title || "Untitled Resume"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {resume.personalInfo?.fullName ||
                  "Name not provided"}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Updated:{" "}
                {resume.updatedAt
                  ? new Date(resume.updatedAt).toLocaleDateString()
                  : "Unknown"}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => handleEdit(resume._id)}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                >
                  Edit
                </button>

                <button
                  disabled={deletingId === resume._id}
                  onClick={() => handleDelete(resume._id)}
                  className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 disabled:opacity-50"
                >
                  {deletingId === resume._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
