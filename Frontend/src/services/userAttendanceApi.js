import axios from "axios";

// Dedicated Axios instance for user attendance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_VERSION}`,
  withCredentials: true,
});

// Send device date in body as required by backend controllers
export const clockIn = (date) => api.post("/attendance/startAttendent", { date });

// Route requires a path param but controller uses body date; param value is unused
export const clockOut = (date) => api.patch("/attendance/EndAttendance/today", { date });

// Request correction for attendance
export const requestCorrection = (attendanceId, outTime, status) =>
  api.put(`/attendance/update/${attendanceId}`, { outTime, status });
