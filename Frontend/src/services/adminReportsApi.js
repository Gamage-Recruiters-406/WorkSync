import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}${
    import.meta.env.VITE_API_VERSION
  }`,
  withCredentials: true, // 🔥 SEND COOKIES
});

// =====================
// Attendance
// =====================
export const getAttendance = () => api.get("/attendance/getAttendent");

export const getAttendanceReport = () =>
  api.get("/attendance/attendanceReport");

// =====================
// Leaves
// =====================
export const getAllLeaves = () => api.get("/leave-request/getAllLeaves");

// =====================
// Tasks
// =====================
export const getAllTasks = () => api.get("/task/getAllTasks");

export const getTaskReport = () => api.get("/task/taskReport");

// =====================
// Projects
// =====================
export const getAllProjects = () => api.get("/projects/getAllProjects");

export const getProjectReport = () => api.get("/projects/projectReport");

// =====================
// Users
// =====================
export const getAllUsers = () => api.get("/userAuth/getAllUsers");
