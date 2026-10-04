
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyTimetables,
  deleteTimetable,
} from "../services/timetableApi";

export default function MyTimetables() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function loadTimetables() {
    try {
      setLoading(true);
      setError("");

      const result = await fetchMyTimetables();

      const savedTimetables = result?.data?.timetables || [];

      setTimetables(savedTimetables);
    } catch (err) {
      setError(err.message || "Could not load timetables.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
     loadTimetables();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this timetable?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteTimetable(id);

      setTimetables((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (err) {
      setError(err.message || "Could not delete timetable.");
    }
  }

  function handleOpen(timetable) {
    navigate("/timetable", {
      state: {
        timetable,
      },
    });
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-gray-600">Loading timetables...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Timetables
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage your saved schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/timetable")}
          className="rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800"
        >
          Create timetable
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {timetables.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            No saved timetables yet
          </h2>

          <p className="mt-2 text-gray-600">
            Generate a schedule and save it to see it here.
          </p>

          <button
            type="button"
            onClick={() => navigate("/timetable")}
            className="mt-6 rounded-lg bg-black px-5 py-3 text-white"
          >
            Create your first timetable
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {timetables.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {item.title || "Untitled timetable"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Updated{" "}
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleDateString()
                  : "recently"}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleOpen(item)}
                  className="rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
                >
                  Open / Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
