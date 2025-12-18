import { NavLink, Outlet } from "react-router-dom";

const SystemSettingsLayout = () => {
  const tabClass = ({ isActive }) =>
    `px-6 py-2 rounded-md border text-sm font-medium ${
      isActive
        ? "bg-[#087990] text-white border-[#087990]"
        : "border-[#087990] text-[#087990]  hover:text-[#087990]"
    }`;

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-8 p-">
      {/* TOP TABS */}
      <div className="flex gap-4 mb-6 font ">
        <NavLink to="profile" className={tabClass}>
          Profile
        </NavLink>

        <NavLink to="working-hours" className={tabClass}>
          Working hours & Leave Types
        </NavLink>

        <NavLink to="company-info" className={tabClass}>
          Company system Info
        </NavLink>

        <NavLink to="roles" className={tabClass}>
          Roles & Attendance Rules
        </NavLink>
      </div>

      {/* PAGE CONTENT */}
      <div className="bg-white rounded-lg shadow p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SystemSettingsLayout;
