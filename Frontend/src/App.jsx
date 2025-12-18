import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import AdminReport from "./pages/reportAnalytics/AdminReport";

// System Settings Layout + Pages
import SystemSettingLayout from "./layouts/systemsetting/SystemSettingLayout";
import ProfileSettings from "./pages/systemSetting/ProfileSettings";
import WorkingHoursSettings from "./pages/systemSetting/WorkingHoursSettings";
import CompanyInfoSettings from "./pages/systemSetting/CompanyInfoSettings";
import RolesAttendanceSettings from "./pages/systemSetting/RolesAttendanceSettings";

function App() {
  const location = useLocation();

  // Sidebar active item mapping
  const activeItemMap = {
    "/reports": "reports",
    "/settings": "system-settings",
  };

  const activeItem = Object.keys(activeItemMap).find((path) =>
    location.pathname.startsWith(path)
  )
    ? activeItemMap[
        Object.keys(activeItemMap).find((path) =>
          location.pathname.startsWith(path)
        )
      ]
    : "dashboard";

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex gap-6 px-6 py-8">
      <Sidebar role="admin" activeItem={activeItem} />

      <Routes>
        {/* REPORTS */}
        <Route path="Admin/reports" element={<AdminReport />} />

        {/* SYSTEM SETTINGS (NESTED ROUTES) */}
        <Route path="/settings" element={<SystemSettingLayout />}>
          {/* Default redirect */}
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="profile/edit" element={<ProfileSettings />} />{" "}
          {/* Temporary until EditProfile is created */}
          <Route path="working-hours" element={<WorkingHoursSettings />} />
          <Route path="company-info" element={<CompanyInfoSettings />} />
          <Route path="roles" element={<RolesAttendanceSettings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
