
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createTimetable,
  updateTimetable,
} from "../services/timetableApi";
import { trackEvent } from "../services/analytics";

function Timetable() {
  const location = useLocation();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([
    {
      name: "",
      hours: "",
      priority: "Medium",
    },
  ]);

  const [studyHours, setStudyHours] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [error, setError] = useState("");

  const [timetableId, setTimetableId] = useState(
    location.state?.timetable?._id || null
  );

  const [title, setTitle] = useState(
    location.state?.timetable?.title || "My Weekly Timetable"
  );

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  /*
   * Load timetable received from MyTimetables.jsx
   */
  useEffect(() => {
    const savedTimetable = location.state?.timetable;

    if (!savedTimetable) return;

    const schedule = savedTimetable.schedule || {};

    setTimetableId(savedTimetable._id || null);
    setTitle(savedTimetable.title || "My Weekly Timetable");

    setStudyHours(
      schedule.studyHours !== undefined
        ? String(schedule.studyHours)
        : ""
    );

    setSubjects(
      Array.isArray(schedule.subjects) && schedule.subjects.length > 0
        ? schedule.subjects
        : [
            {
              name: "",
              hours: "",
              priority: "Medium",
            },
          ]
    );

    setTimetable(
      Array.isArray(schedule.timetable)
        ? schedule.timetable
        : []
    );
    trackEvent("timetable_created")
    setError("");
    setSaveMessage("");
  }, [location.state]);

  function addSubject() {
    setSubjects([
      ...subjects,
      {
        name: "",
        hours: "",
        priority: "Medium",
      },
    ]);

    setTimetable([]);
    setError("");
    setSaveMessage("");
  }

  function removeSubject(index) {
    if (subjects.length === 1) {
      setError("You need at least one subject.");
      return;
    }

    setSubjects(subjects.filter((_, i) => i !== index));
    setTimetable([]);
    setError("");
    setSaveMessage("");
  }

  function handleSubjectChange(index, field, value) {
    const updatedSubjects = [...subjects];

    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value,
    };

    setSubjects(updatedSubjects);
    setTimetable([]);
    setError("");
    setSaveMessage("");
  }

  function generateTimetable() {
    setError("");
    setSaveMessage("");
    setTimetable([]);

    if (!studyHours) {
      setError("Please enter your available study hours.");
      return;
    }

    const totalHours = Number(studyHours);

    if (!Number.isFinite(totalHours) || totalHours <= 0) {
      setError("Study hours must be greater than 0.");
      return;
    }

    for (const subject of subjects) {
      if (!subject.name.trim()) {
        setError("Please enter a name for every subject.");
        return;
      }

      if (!subject.hours) {
        setError("Please enter available hours for every subject.");
        return;
      }

      if (Number(subject.hours) <= 0) {
        setError("Subject hours must be greater than 0.");
        return;
      }
    }

    const priorityWeight = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const weightedSubjects = subjects.map(
      (subject) => ({
        ...subject,
        weight:
          Number(subject.hours) *
          priorityWeight[subject.priority],
      })
    );

    const totalWeight = weightedSubjects.reduce(
      (sum, subject) =>
        sum + subject.weight,
      0
    );

    const generated = weightedSubjects.map(
      (subject) => {
        const allocatedHours =
          (subject.weight / totalWeight) *
          totalHours;

        return {
          name: subject.name,
          priority: subject.priority,
          hours: Number(
            allocatedHours.toFixed(1)
          ),
        };
      }
    );

    setTimetable(generated);
  }

  async function handleSave() {
    setError("");
    setSaveMessage("");

    if (timetable.length === 0) {
      setError("Please generate a timetable before saving.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a timetable title.");
      return;
    }

    const schedule = {
      studyHours: Number(studyHours),
      subjects,
      timetable,
    };

    try {
      setSaving(true);

      let result;

      if (timetableId) {
        result = await updateTimetable(timetableId, {
          title: title.trim(),
          schedule,
        });
      } else {
        result = await createTimetable({
          title: title.trim(),
          schedule,
        });
      }

      const savedTimetable = result?.data?.timetable;

      if (savedTimetable?._id) {
        setTimetableId(savedTimetable._id);
      }

      setSaveMessage(
        timetableId
          ? "Timetable updated successfully."
          : "Timetable saved successfully."
      );
    } catch (err) {
      setError(
        err.message || "Could not save timetable."
      );
    } finally {
      setSaving(false);
    }
  }

  function resetTimetable() {
    setSubjects([
      {
        name: "",
        hours: "",
        priority: "Medium",
      },
    ]);

    setStudyHours("");
    setTimetable([]);
    setError("");
    setSaveMessage("");

    setTitle("My Weekly Timetable");
    setTimetableId(null);

    /*
     * Remove old router state by navigating to the same page
     * without the saved timetable.
     */
    navigate("/timetable", {
      replace: true,
      state: null,
    });
  }

  function createNewTimetable() {
    setSubjects([
      {
        name: "",
        hours: "",
        priority: "Medium",
      },
    ]);

    setStudyHours("");
    setTimetable([]);
    setError("");
    setSaveMessage("");
    setTitle("My Weekly Timetable");
    setTimetableId(null);

    navigate("/timetable", {
      replace: true,
      state: null,
    });
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Student Tool
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Study Timetable Generator
        </h1>

        <p className="mt-4 text-gray-600">
          Add your subjects, set their priorities, and generate
          a study schedule based on your available study time.
        </p>
      </div>

      {/* Saved timetable title */}
      <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <label
          htmlFor="timetableTitle"
          className="mb-2 block text-sm font-medium"
        >
          Timetable Name
        </label>

        <input
          id="timetableTitle"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSaveMessage("");
          }}
          placeholder="e.g. Semester Study Plan"
          maxLength={100}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
        />
      </div>

      {/* Available Study Hours */}
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <label
          htmlFor="studyHours"
          className="mb-2 block text-sm font-medium"
        >
          Available Study Hours
        </label>

        <input
          id="studyHours"
          type="number"
          min="1"
          step="0.5"
          value={studyHours}
          onChange={(e) => {
            setStudyHours(e.target.value);
            setTimetable([]);
            setError("");
            setSaveMessage("");
          }}
          placeholder="e.g. 4"
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black sm:max-w-sm"
        />

        <p className="mt-2 text-sm text-gray-500">
          Enter how many hours you can study each day.
        </p>
      </div>

      {/* Subjects */}
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold">
            Your Subjects
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Give more available hours to subjects that need
            more attention.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="rounded-xl border p-4"
            >
              <div className="grid gap-4 md:grid-cols-[1fr_160px_160px_auto]">
                {/* Subject Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Subject
                  </label>

                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) =>
                      handleSubjectChange(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Data Structures"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                {/* Hours */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Required Hours
                  </label>

                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={subject.hours}
                    onChange={(e) =>
                      handleSubjectChange(
                        index,
                        "hours",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 5"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Priority
                  </label>

                  <select
                    value={subject.priority}
                    onChange={(e) =>
                      handleSubjectChange(
                        index,
                        "priority",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Remove */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="w-full rounded-lg border px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 md:w-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Subject */}
        <button
          type="button"
          onClick={addSubject}
          className="mt-5 rounded-lg border px-5 py-3 text-sm font-medium hover:bg-gray-50"
        >
          + Add Subject
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success */}
      {saveMessage && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {saveMessage}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={generateTimetable}
          className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:opacity-90"
        >
          Generate Timetable
        </button>

        {timetable.length > 0 && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : timetableId
              ? "Update Timetable"
              : "Save to Cloud"}
          </button>
        )}

        <button
          type="button"
          onClick={resetTimetable}
          className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-50"
        >
          Reset
        </button>

        {timetableId && (
          <button
            type="button"
            onClick={createNewTimetable}
            className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-50"
          >
            New Timetable
          </button>
        )}
      </div>

      {/* Generated Timetable */}
      {timetable.length > 0 && (
        <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Your Study Plan
          </h2>

          <p className="mt-2 text-gray-600">
            Recommended daily study distribution based on your
            subject requirements.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-sm font-semibold">
                    Subject
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Priority
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Daily Hours
                  </th>
                </tr>
              </thead>

              <tbody>
                {timetable.map((subject) => (
                  <tr
                    key={subject.name}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-4 font-medium">
                      {subject.name}
                    </td>

                    <td className="px-4 py-4">
                      {subject.priority}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {subject.hours} hrs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">
          How does the timetable generator work?
        </h2>

        <p className="mt-4 leading-7 text-gray-600">
          The calculator distributes your available daily study
          time according to the relative number of hours assigned
          to each subject.
        </p>

        <div className="mt-5 rounded-xl border bg-gray-50 p-5">
          <p className="font-semibold">
            Subject Share = Subject Hours ÷ Total Subject Hours
          </p>

          <p className="mt-2 font-semibold">
            Daily Study Time = Subject Share × Available Study Hours
          </p>
        </div>
      </div>

      {/* Example */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          Example
        </h2>

        <p className="mt-4 text-gray-600">
          Suppose you have 4 hours available each day:
        </p>

        <div className="mt-5 overflow-x-auto rounded-xl border">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Required Hours</th>
                <th className="px-4 py-3">Priority</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3">DSA</td>
                <td className="px-4 py-3">5</td>
                <td className="px-4 py-3">High</td>
              </tr>

              <tr className="border-b">
                <td className="px-4 py-3">DBMS</td>
                <td className="px-4 py-3">3</td>
                <td className="px-4 py-3">Medium</td>
              </tr>

              <tr>
                <td className="px-4 py-3">Operating Systems</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">Low</td>
              </tr>
            </tbody>
          </table>
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
              Can I add multiple subjects?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Yes. You can dynamically add or remove subjects.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              What does priority do?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Priority currently organizes subjects before
              generating the plan. The actual hour allocation
              remains proportional to the required hours.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Can I save my timetable?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Yes. Sign in, generate your timetable, and use
              Save to Cloud to store it with your account.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Timetable;

