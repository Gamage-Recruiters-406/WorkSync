import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
const SystemSettings = () => {
  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <div className="flex flex-col h-full p-6">
            <h1 className="text-2xl font-semibold mb-6">System Settings</h1>

            {/* Tabs */}
            <div className="flex gap-10 border-b mb-6">
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  `pb-2 font-medium ${
                    isActive ? "border-b-2 border-[#087990] text-[#087990]" : ""
                  }`
                }
              >
                Profile
              </NavLink>

              <NavLink
                to="company-info"
                className={({ isActive }) =>
                  `pb-2 font-medium ${
                    isActive ? "border-b-2 border-[#087990] text-[#087990]" : ""
                  }`
                }
              >
                Company Info
              </NavLink>

              <NavLink
                to="roles-attendance"
                className={({ isActive }) =>
                  `pb-2 font-medium ${
                    isActive ? "border-b-2 border-[#087990] text-[#087990]" : ""
                  }`
                }
              >
                Roles & Attendance
              </NavLink>

              <NavLink
                to="working-hours"
                className={({ isActive }) =>
                  `pb-2 font-medium ${
                    isActive ? "border-b-2 border-[#087990] text-[#087990]" : ""
                  }`
                }
              >
                Working Hours
              </NavLink>
            </div>

            {/* Active tab renders here */}
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default SystemSettings;
