import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}${
    import.meta.env.VITE_API_VERSION
  }`,
  withCredentials: false,
});

// =====================
// Attendance
// =====================
export const getAttendance = () =>
  api.get("/attendance/getAttendent", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getAttendanceReport = () =>
  api.get("/attendance/attendanceReport", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================
// Leaves
// =====================
export const getAllLeaves = () =>
  api.get("/leave-request/getAllLeaves", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================
// Tasks
// =====================
export const getAllTasks = () =>
  api.get("/task/getAllTasks", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getTaskReport = () =>
  api.get("/task/taskReport", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================
// Projects
// =====================
export const getAllProjects = () =>
  api.get("/projects/getAllProjects", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getProjectReport = () =>
  api.get("/projects/projectReport", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================
// Users
// =====================
export const getAllUsers = () =>
  api.get("/userAuth/getAllUsers", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
