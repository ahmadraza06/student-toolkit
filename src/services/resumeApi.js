import { apiRequest } from "./api.js";
import {
  fromApiResume,
  toApiResume
} from "../utils/resumeMapper.js";

export async function saveResume(resume, title = "My Resume") {
  const result = await apiRequest("/resumes", {
    method: "POST",
    body: JSON.stringify(toApiResume(resume, title)),
  });

  return result;
}

export async function fetchMyResumes() {
  const result = await apiRequest("/resumes");
  return result;
}

export async function fetchResumeById(id) {
  const result = await apiRequest(`/resumes/${id}`);
  return fromApiResume(result.data.resume);
}

export async function updateResume(id, resume, title = "My Resume") {
  const result = await apiRequest(`/resumes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(toApiResume(resume, title)),
  });

  return result;
}

export async function deleteResume(id) {
  return apiRequest(`/resumes/${id}`, {
    method: "DELETE",
  });
}