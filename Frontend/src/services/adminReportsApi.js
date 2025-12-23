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

// ---------------------
// Get single user attendance (for user report)
// ---------------------
export const getSingleUserAttendance = (userId) =>
  api.get(`/attendance/get-single-user-attendance/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// ---------------------
// Get leaves by user (for user report)
// ---------------------
export const getLeavesByUser = (userId) =>
  api.get(`/leave-request/getLeave/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// ---------------------
// NGet all tasks for a user (for user report)
// ---------------------
export const getAllUserTasks = () =>
  api.get("/task/getAllUserTasks", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// ---------------------
// Get single user (optional for profile or reports)
// ---------------------
export const getSingleUser = (userId) =>
  api.get(`/userAuth/getUser/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
