// src/App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin imports

import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AssignTask from "./pages/admin/AssignTask";
import Users from "./pages/admin/Users";
import ManageLeaves from "./pages/admin/ManageLeaves";
import AdminReports from "./pages/admin/AdminReports";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";

import ProjectsDashboard from "./pages/admin/ProjectsDashboard";
import Departments from "./pages/admin/Department/Departments";
import Projects from "./pages/admin/Projects";
import AdminReport from "./pages/reportAnalytics/AdminReport";
import EmployeeList from "./pages/admin/EmployeeList";

// Employee imports
import UserAttendance from "./pages/employee/UserAttendance";
import UserDashboard from "./pages/employee/UserDashboard";
import ProjectTeam from "./pages/employee/ProjectTeam";
import Task from "./pages/employee/Task";
import UserReports from "./pages/employee/UserReports";
import LeaveRequest from "./pages/employee/LeaveRequest";
import UserAnnouncements from "./pages/employee/UserAnnouncements";
import CreateTaskForm from "./pages/TeamLeader/CreateTaskForm";
import TaskHistory from "./pages/TeamLeader/TaskHistory";
import Login from "./pages/Login";
import TaskDetail from "./pages/employee/TaskDetail";

import { Navigate } from "react-router-dom";
//import AdminReport from "./pages/reportAnalytics/AdminReport";
import { useState } from "react";
//import EmployeeList from './pages/admin/EmployeeList';
import EditEmployee from './pages/admin/EditEmployee';
import ApproveUser from './pages/admin/ApproveUser';
import Sidebar from './components/sidebar/Sidebar';
import DashboardUI from './components/DashboardUI';
import ProjectDetails from './pages/employee/ProjectDetails';
import DepartmentDetails from './pages/admin/Department/ViewDepartment';
import SystemSettings from './pages/systemSetting/SystemSettings';
import CompanyInfoSettings from './pages/systemSetting/CompanyInfoSettings';
import ProfileSettings from './pages/systemSetting/ProfileSettings';
import RolesAttendanceSettings from './pages/systemSetting/RolesAttendanceSettings';
import WorkingHoursSettings from './pages/systemSetting/WorkingHoursSettings';

import ProjectDetailsAdmin from './pages/admin/ProjectDetaisAdmin';
import ManagerDashboard from './pages/manager/managerDashboard';
import SignUp from './pages/Signup';
import UserProfile from './pages/employee/UserProfile';
import UserProfileEdit from './pages/employee/UserProfileEdit';
import AnnouncementsPage from './pages/AnnouncementsPage';
// import AnnouncementsManagement from './pages/AnnouncementsManagement';
// import AnnouncementDetail from './pages/admin/AnnouncementDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to login */}
        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* System Settings (Tabs)*/}
        <Route path="/admin/system-settings" element={<SystemSettings />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="company-info" element={<CompanyInfoSettings />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route
            path="roles-attendance"
            element={<RolesAttendanceSettings />}
          />
          <Route path="working-hours" element={<WorkingHoursSettings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<EmployeeList />} />
        <Route path="/admin/edit-employee/:id" element={<EditEmployee />} />
        <Route path="/admin/assign-task" element={<AssignTask />} />
        <Route path="/admin/manage-leaves" element={<ManageLeaves />} />
        <Route path="/admin/reports" element={<AdminReport />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/projects" element={<ProjectsDashboard />} />
        <Route path="/admin/projects/:id" element={<ProjectDetailsAdmin />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/admin/Approve" element={<ApproveUser />} />
        <Route path="/admin/D-details/:id" element={<DepartmentDetails />} />

        {/* Employee Routes */}
        <Route path="/user/dashboard" element={<DashboardUI />} />
        <Route path="/user/project-team" element={<ProjectTeam />} />
        <Route path="/user/task" element={<Task />} />
        <Route path="/user/attendance" element={<UserAttendance />} />
        <Route path="/user/reports" element={<UserReports />} />
        <Route path="/user/announcements" element={<UserAnnouncements />} />
        <Route path="/user/leave-request" element={<LeaveRequest />} />
        <Route path="/user/user-dashboard" element={<DashboardUI />} />
        <Route path="/user/project-team/:id" element={<ProjectDetails />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/profile/edit" element={<UserProfileEdit />} />
        <Route path="/task-details/:id" element={<TaskDetail />} />


        {/* Team Leader - Employee Routes */}
        <Route path="/create-task" element={<CreateTaskForm />} />
        <Route path="/edit-task/:taskId" element={<CreateTaskForm />} />
        <Route path="/task-history" element={<TaskHistory />} />

        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />

        {/* New Route for AnnouncementsPage */}
        <Route path="/announcements" element={<AnnouncementsPage />} />
//         <Route path="/announcements-management" element={<AnnouncementsManagement />} />
//         <Route path="/announcement-detail" element={<AnnouncementDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
