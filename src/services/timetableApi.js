
import { apiRequest } from "./api";

export function createTimetable(data) {
  return apiRequest("/timetables", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function fetchMyTimetables() {
  return apiRequest("/timetables");
}

export function fetchTimetableById(id) {
  return apiRequest(`/timetables/${id}`);
}

export function updateTimetable(id, data) {
  return apiRequest(`/timetables/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteTimetable(id) {
  return apiRequest(`/timetables/${id}`, {
    method: "DELETE",
  });
}