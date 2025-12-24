
// src/App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminAttendance from "./pages/admin/AdminAttendance";
import UserAttendance from "./pages/employee/UserAttendance";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AssignTask from "./pages/admin/AssignTask";
import Users from "./pages/admin/Users";
import ManageLeaves from "./pages/admin/ManageLeaves";
import AdminReports from "./pages/admin/AdminReports";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import Departments from "./pages/admin/Department/Departments";
import Projects from "./pages/admin/Projects";
import UserDashboard from "./pages/employee/UserDashboard";
import ProjectTeam from "./pages/employee/ProjectTeam";
import Task from "./pages/employee/Task";
import UserReports from "./pages/employee/UserReports";
import LeaveRequest from "./pages/employee/LeaveRequest";
import UserAnnouncements from "./pages/employee/UserAnnouncements";
import CreateTaskForm from "./pages/TeamLeader/CreateTaskForm";
import TaskHistory from "./pages/TeamLeader/TaskHistory";
import Login from "./Pages/Login";
import SignUp from "./Pages/Signup";
import { Navigate } from "react-router-dom";
import AdminReport from "./pages/reportAnalytics/AdminReport";
import { useState } from 'react';
import EmployeeList from './pages/admin/EmployeeList';
import ApproveUser from "./pages/admin/ApproveUser";
import Sidebar from './components/sidebar/Sidebar'; 
import DashboardUI from './components/DashboardUI';
import ProjectDetails from "./pages/employee/ProjectDetails";
import DepartmentDetails from "./pages/admin/Department/ViewDepartment";

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Routes>
         {/* Default route - redirect to login */}
        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
        
        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> 

        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<EmployeeList />} />
        <Route path="/admin/employee-list" element={<EmployeeList />} />
        <Route path="/admin/assign-task" element={<AssignTask />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/manage-leaves" element={<ManageLeaves />} />
        <Route path="/admin/reports" element={<AdminReport />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/projects" element={<Projects />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
         <Route path="/admin/Approve" element={<ApproveUser />} />
        <Route path="/admin/D-details/:id" element={<DepartmentDetails />} />

        {/* Employee Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/project-team" element={<ProjectTeam />} />
        <Route path="/user/task" element={<Task />} />
        <Route path="/user/attendance" element={<UserAttendance />} />
        <Route path="/user/reports" element={<UserReports />} />
        <Route path="/user/announcements" element={<UserAnnouncements />} />
        <Route path="/user/leave-request" element={<LeaveRequest />} />
        <Route path="/user/user-dashboard" element={<DashboardUI />} />
        <Route path="/user/project-team/:id" element={<ProjectDetails />} />

        {/* Team Leader - Employee Routes */}
        <Route path="/create-task" element={<CreateTaskForm />} />
        <Route path="/edit-task/:taskId" element={<CreateTaskForm />} />
        <Route path="/task-history" element={<TaskHistory />} />
      </Routes>

    </Router>
  );
}

export default App;
