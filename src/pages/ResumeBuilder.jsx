
import { useLocation, useNavigate } from "react-router-dom";

import { useState,useEffect } from "react";
import { validateResume } from "../utils/validation";
import {
  saveResume,
  fetchMyResumes,
  fetchResumeById,
  updateResume,
  deleteResume
} from "../services/resumeApi";

import {fromApiResume} from "../utils/resumeMapper"
import { trackEvent } from "../services/analytics";


const initialResume = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  education: [
    {
      id: 1,
      degree: "",
      institution: "",
      year: "",
      score: "",
    },
  ],
  skills: "",
  projects: [
    {
      id: 1,
      name: "",
      description: "",
      technologies: "",
      link: "",
    },
  ],
  experience: [
    {
      id: 1,
      role: "",
      company: "",
      duration: "",
      description: "",
    },
  ],
};

function ResumeBuilder() {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingResumeId = location.state?.resumeId ?? null;
  const incomingResume = location.state?.resume ?? null;
  const STORAGE_KEY = "student-toolkit-resume";
  const [localSaveStatus, setLocalSaveStatus] = useState("Saved locally");
  const [resumeId, setResumeId] = useState(incomingResumeId);
  const [savedResumes, setSavedResumes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [resume, setResume] = useState(() => {
      try {
          const savedResume = localStorage.getItem(STORAGE_KEY);

          if (savedResume) {
          return {
              ...initialResume,
              ...JSON.parse(savedResume),
          };
          }
      } catch (error) {
              console.error("Could not load saved resume:", error);
      }

      return structuredClone(initialResume);
      }
  );
  
  const [cloudResumeId, setCloudResumeId] = useState(
  location.state?.resumeId || null);

  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudMessage, setCloudMessage] = useState(""); 
  useEffect(() => {
    const incomingResume = location.state?.resume;

    if (incomingResume) {
      const mappedResume = fromApiResume(incomingResume);

      setResume(mappedResume);

      if (incomingResume._id) {
        setCloudResumeId(incomingResume._id);
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(mappedResume)
      );
    }
  }, [location.state]);
  async function handleCloudSave() {
    const validationErrors = validateResume(resume);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setCloudLoading(true);
      setCloudMessage("");

      let result;

      if (cloudResumeId) {
        result = await updateResume(cloudResumeId, resume);
        trackEvent("resume_updated");
      } else {
        result = await saveResume(resume);
         trackEvent("resume_created");
      }

      const savedResume = result.data.resume;

      setCloudResumeId(savedResume._id);

      setCloudMessage("Resume saved successfully.");
    } catch (error) {
      setCloudMessage(
        error.message || "Could not save resume."
      );
    } finally {
      setCloudLoading(false);
    }
  }


  
  async function handleSaveToCloud() {
  setSaving(true);
  setApiMessage("");

  try {
    if (resumeId) {
      await updateResume(resumeId, resume);
      setApiMessage("Resume updated in your account.");
    } else {
      const saved = await saveResume(resume);
      setResumeId(saved._id);
      setApiMessage("Resume saved to your account.");
    }

    const resumes = await fetchMyResumes();
    setSavedResumes(resumes);
  } catch (error) {
    setApiMessage(error.message);
  } finally {
    setSaving(false);
  }
}

async function handleLoadResume(id) {
  try {
    const loadedResume = await fetchResumeById(id);

    setResume(loadedResume);
    setResumeId(id);
    setApiMessage("Resume loaded.");
  } catch (error) {
      setApiMessage(error.message);
    }
  }

  async function handleRefreshResumes() {
    try {
      const resumes = await fetchMyResumes();
      setSavedResumes(resumes);
      setApiMessage("");
    } catch (error) {
      setApiMessage(error.message);
    }
  }
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(resume)
      );

      setLocalSaveStatus("Draft saved in this browser");
    } catch (error) {
      console.error("Could not save local draft:", error);
      setLocalSaveStatus("Could not save draft");
    }
}, [resume]);
  useEffect(() => {
    if (incomingResume) {
      setResume(incomingResume);
      setResumeId(incomingResumeId);
    } else {
      setResumeId(null);
      setResume(initialResume);
    }
  }, [incomingResume, incomingResumeId]);

  const handleChange = (field, value) => {
    setResume((previousResume) => ({
      ...previousResume,
      [field]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [field]: undefined,
    }));
  };

  async function handleDeleteCloudResume() {
    if (!resumeId) {
      setApiMessage("Save or load a cloud resume first.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this resume from your account? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteResume(resumeId);

      setResumeId(null);
      setSavedResumes((previous) =>
        previous.filter((item) => item._id !== resumeId)
      );

      setApiMessage("Cloud resume deleted.");
    } catch (error) {
      setApiMessage(error.message);
    }
  }

  function handleArrayChange(section, id, field, value) {
    setResume((previous) => ({
      ...previous,
      [section]: previous[section].map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      ),
    }));
  }

  function addItem(section, newItem) {
    setResume((previous) => ({
      ...previous,
      [section]: [
        ...previous[section],
        {
          ...newItem,
          id: Date.now() + Math.random(),
        },
      ],
    }));
  }

  function removeItem(section, id) {
    setResume((previous) => ({
      ...previous,
      [section]: previous[section].filter(
        (item) => item.id !== id
      ),
    }));
  }

  function handlePrint() {
    const validationErrors = validateResume(resume);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    window.print();
  }

    function resetResume() {
      localStorage.removeItem(STORAGE_KEY);
      setResume(structuredClone(initialResume));
    }

    async function handleSaveToCloud() {
      setSaving(true);
      setApiMessage("");

      try {
        let saved;

        if (resumeId) {
          saved = await updateResume(
            resumeId,
            resume,
            "My Resume"
          );
        } else {
          saved = await saveResume(
            resume,
            "My Resume"
          );

          setResumeId(saved._id);
        }

        setApiMessage("Resume saved to your account.");
      } catch (error) {
        setApiMessage(
          error.message || "Could not save resume."
        );
      } finally {
        setSaving(false);
      }
    }
    function handleNewResume() {
      setResumeId(null);
      setResume(initialResume);
      setApiMessage("");

      navigate("/resume-builder", {
        replace: true,
        state: {
          resumeId: null,
          resume: null,
        },
      });
    }

  const skills = resume.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Student Toolkit
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Resume Builder
        </h1>

        <p className="mt-4 text-gray-600">
          Create a professional resume by entering your
          details. Your preview updates as you type.
        </p>
        <p className="mt-2 text-sm text-gray-500" role="status">
          {localSaveStatus}
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        {/* FORM */}
        <div className="space-y-6">
          {/* Personal Details */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Personal Details
            </h2>

            <div className="mt-5 space-y-4">
              <Field
                label="Full Name"
                value={resume.fullName}
                onChange={(value) =>
                  handleChange("fullName", value)
                }
                placeholder="Ahmad Raza"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">
                  {errors.fullName}
                </p>
              )}
              <Field
                label="Email"
                type="email"
                value={resume.email}
                onChange={(value) =>
                  handleChange("email", value)
                }
                placeholder="ahmad@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">
                  {errors.email}
                </p>
              )}
              <Field
                label="Phone"
                value={resume.phone}
                onChange={(value) =>
                  handleChange("phone", value)
                }
                placeholder="+91 98765 43210"
              />

              <Field
                label="Location"
                value={resume.location}
                onChange={(value) =>
                  handleChange("location", value)
                }
                placeholder="City, State"
              />

              <TextAreaField
                label="Professional Summary"
                value={resume.summary}
                onChange={(value) =>
                  handleChange("summary", value)
                }
                placeholder="Write 2–3 sentences about your skills and career goals."
              />
            </div>
          </div>

          {/* Education */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Education
            </h2>

            {resume.education.map((item) => (
              <div
                key={item.id}
                className="mt-5 space-y-4 rounded-xl border p-4"
              >
                <Field
                  label="Degree"
                  value={item.degree}
                  onChange={(value) =>
                    handleArrayChange(
                      "education",
                      item.id,
                      "degree",
                      value
                    )
                  }
                  placeholder="B.Tech Computer Science"
                />

                <Field
                  label="Institution"
                  value={item.institution}
                  onChange={(value) =>
                    handleArrayChange(
                      "education",
                      item.id,
                      "institution",
                      value
                    )
                  }
                  placeholder="College or university"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Year"
                    value={item.year}
                    onChange={(value) =>
                      handleArrayChange(
                        "education",
                        item.id,
                        "year",
                        value
                      )
                    }
                    placeholder="2022–2026"
                  />

                  <Field
                    label="Score"
                    value={item.score}
                    onChange={(value) =>
                      handleArrayChange(
                        "education",
                        item.id,
                        "score",
                        value
                      )
                    }
                    placeholder="8.5 CGPA"
                  />
                </div>

                <RemoveButton
                  onClick={() =>
                    removeItem("education", item.id)
                  }
                />
              </div>
            ))}

            <AddButton
              label="Add Education"
              onClick={() =>
                addItem("education", {
                  degree: "",
                  institution: "",
                  year: "",
                  score: "",
                })
              }
            />
          </div>

          {/* Skills */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Skills
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Separate each skill with a comma.
            </p>

            <TextAreaField
              label="Your Skills"
              value={resume.skills}
              onChange={(value) =>
                handleChange("skills", value)
              }
              placeholder="JavaScript, React, Node.js, MongoDB"
            />
          </div>

          {/* Projects */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Projects
            </h2>

            {resume.projects.map((item) => (
              <div
                key={item.id}
                className="mt-5 space-y-4 rounded-xl border p-4"
              >
                <Field
                  label="Project Name"
                  value={item.name}
                  onChange={(value) =>
                    handleArrayChange(
                      "projects",
                      item.id,
                      "name",
                      value
                    )
                  }
                  placeholder="Student Toolkit"
                />

                <TextAreaField
                  label="Description"
                  value={item.description}
                  onChange={(value) =>
                    handleArrayChange(
                      "projects",
                      item.id,
                      "description",
                      value
                    )
                  }
                  placeholder="What problem does your project solve?"
                />

                <Field
                  label="Technologies"
                  value={item.technologies}
                  onChange={(value) =>
                    handleArrayChange(
                      "projects",
                      item.id,
                      "technologies",
                      value
                    )
                  }
                  placeholder="React, Node.js, MongoDB"
                />

                <Field
                  label="Project Link"
                  value={item.link}
                  onChange={(value) =>
                    handleArrayChange(
                      "projects",
                      item.id,
                      "link",
                      value
                    )
                  }
                  placeholder="https://github.com/..."
                />

                <RemoveButton
                  onClick={() =>
                    removeItem("projects", item.id)
                  }
                />
              </div>
            ))}

            <AddButton
              label="Add Project"
              onClick={() =>
                addItem("projects", {
                  name: "",
                  description: "",
                  technologies: "",
                  link: "",
                })
              }
            />
          </div>

          {/* Experience */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Experience
            </h2>

            {resume.experience.map((item) => (
              <div
                key={item.id}
                className="mt-5 space-y-4 rounded-xl border p-4"
              >
                <Field
                  label="Role"
                  value={item.role}
                  onChange={(value) =>
                    handleArrayChange(
                      "experience",
                      item.id,
                      "role",
                      value
                    )
                  }
                  placeholder="Software Developer Intern"
                />

                <Field
                  label="Company"
                  value={item.company}
                  onChange={(value) =>
                    handleArrayChange(
                      "experience",
                      item.id,
                      "company",
                      value
                    )
                  }
                  placeholder="Company name"
                />

                <Field
                  label="Duration"
                  value={item.duration}
                  onChange={(value) =>
                    handleArrayChange(
                      "experience",
                      item.id,
                      "duration",
                      value
                    )
                  }
                  placeholder="June 2026 – August 2026"
                />

                <TextAreaField
                  label="Responsibilities"
                  value={item.description}
                  onChange={(value) =>
                    handleArrayChange(
                      "experience",
                      item.id,
                      "description",
                      value
                    )
                  }
                  placeholder="Describe your work and achievements."
                />

                <RemoveButton
                  onClick={() =>
                    removeItem("experience", item.id)
                  }
                />
              </div>
            ))}

            <AddButton
              label="Add Experience"
              onClick={() =>
                addItem("experience", {
                  role: "",
                  company: "",
                  duration: "",
                  description: "",
                })
              }
            />
          </div>

          <div className="flex flex-wrap gap-3">
            
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:opacity-90"
            >
              Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={handleCloudSave}
              disabled={cloudLoading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {cloudLoading ? "Saving..." : "Save to Cloud"}
            </button>
            {cloudMessage && (
              <p className="mt-3 text-sm text-gray-600">
                {cloudMessage}
              </p>
            )}
            <button
              type="button"
              onClick={resetResume}
              className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-50"
            >
              Reset Local Draft
            </button>
            <button
              type="button"
              onClick={handleSaveToCloud}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white disabled:opacity-50"
            >
              {saving
                ? "Saving to account..."
                : resumeId
                  ? "Update Cloud Resume"
                  : "Save to Account"}
            </button>

            <button
              type="button"
              onClick={handleRefreshResumes}
              className="rounded-lg border px-6 py-3 font-medium"
            >
              Refresh Saved Resumes
            </button>

            {apiMessage && (
              <p className="text-sm text-gray-700" role="status">
                {apiMessage}
              </p>
            )}
            <button
              type="button"
              onClick={handleSaveToCloud}
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save to Account"}
            </button>

            {apiMessage && (
              <p className="mt-2 text-sm" role="status">
                {apiMessage}
              </p>
            )}

            <div className="mt-4">
              <label htmlFor="saved-resume" className="mb-2 block font-medium">
                Load a saved resume
              </label>

              <select
                id="saved-resume"
                defaultValue=""
                onChange={(event) => {
                  if (event.target.value) {
                    handleLoadResume(event.target.value);
                  }
                }}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">Select a resume</option>

                {savedResumes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title || "Untitled Resume"}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleDeleteCloudResume}
              disabled={!resumeId}
              className="rounded-lg border border-red-300 px-6 py-3 font-medium text-red-600 disabled:opacity-40"
            >
              Delete Cloud Resume
            </button>
            <button
              type="button"
              onClick={handleNewResume}
              className="rounded-xl border px-5 py-3"
            >
              New Resume
            </button>
          </div>
        </div>

        {/* LIVE PREVIEW */}
        <div className="lg:sticky lg:top-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Live Preview
            </h2>

            <span className="text-sm text-gray-500">
              Updates automatically
            </span>
          </div>

          <div
            id="resume-preview"
            className="resume-paper min-h-200 bg-white p-8 shadow-md sm:p-10"
          >
            <header className="border-b-2 border-gray-800 pb-5">
              <h1 className="text-3xl font-bold uppercase tracking-wide">
                {resume.fullName || "Your Name"}
              </h1>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                {resume.email && <span>{resume.email}</span>}
                {resume.phone && <span>{resume.phone}</span>}
                {resume.location && (
                  <span>{resume.location}</span>
                )}
              </div>
            </header>

            {resume.summary && (
              <ResumeSection title="Professional Summary">
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {resume.summary}
                </p>
              </ResumeSection>
            )}

            {resume.education.some(
              (item) =>
                item.degree ||
                item.institution ||
                item.year ||
                item.score
            ) && (
              <ResumeSection title="Education">
                {resume.education.map((item) => (
                  <div key={item.id} className="mb-4">
                    {item.degree && (
                      <h3 className="font-semibold">
                        {item.degree}
                      </h3>
                    )}

                    {item.institution && (
                      <p className="text-sm text-gray-700">
                        {item.institution}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-gray-500">
                      {[item.year, item.score]
                        .filter(Boolean)
                        .join(" | ")}
                    </p>
                  </div>
                ))}
              </ResumeSection>
            )}

            {skills.length > 0 && (
              <ResumeSection title="Skills">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded bg-gray-100 px-2 py-1 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </ResumeSection>
            )}

            {resume.projects.some(
              (item) =>
                item.name ||
                item.description ||
                item.technologies ||
                item.link
            ) && (
              <ResumeSection title="Projects">
                {resume.projects.map((item) => (
                  <div key={item.id} className="mb-5">
                    {item.name && (
                      <h3 className="font-semibold">
                        {item.name}
                      </h3>
                    )}

                    {item.description && (
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {item.description}
                      </p>
                    )}

                    {item.technologies && (
                      <p className="mt-2 text-sm text-gray-600">
                        <strong>Technologies:</strong>{" "}
                        {item.technologies}
                      </p>
                    )}

                    {item.link && (
                      <p className="mt-1 break-all text-sm text-blue-700">
                        {item.link}
                      </p>
                    )}
                  </div>
                ))}
              </ResumeSection>
            )}

            {resume.experience.some(
              (item) =>
                item.role ||
                item.company ||
                item.duration ||
                item.description
            ) && (
              <ResumeSection title="Experience">
                {resume.experience.map((item) => (
                  <div key={item.id} className="mb-5">
                    {item.role && (
                      <h3 className="font-semibold">
                        {item.role}
                      </h3>
                    )}

                    {item.company && (
                      <p className="text-sm text-gray-700">
                        {item.company}
                      </p>
                    )}

                    {item.duration && (
                      <p className="mt-1 text-sm text-gray-500">
                        {item.duration}
                      </p>
                    )}

                    {item.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </ResumeSection>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>

      <textarea
        id={id}
        rows="3"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 rounded-lg border px-5 py-3 text-sm font-medium hover:bg-gray-50"
    >
      + {label}
    </button>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
    >
      Remove
    </button>
  );
}

function ResumeSection({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 border-b border-gray-300 pb-2 text-sm font-bold uppercase tracking-wider">
        {title}
      </h2>

      {children}
    </section>
  );
}

export default ResumeBuilder;