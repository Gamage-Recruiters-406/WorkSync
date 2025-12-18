import { useNavigate } from "react-router-dom";

const palette = {
  primary: "#087990",
  surface: "#E5E7EB",
  white: "#FFFFFF",
};

const sidebarContent = {
  admin: {
    title: "WorkSync",
    main: [
      { key: "dashboard", label: "Dashboard" },
      { key: "assign-task", label: "Assign Task" },
      { key: "users", label: "Users" },
      { key: "manage-leaves", label: "Manage Leaves" },
      { key: "reports", label: "Reports & Analytics" },
      { key: "announcements", label: "Announcements" },
      { key: "departments", label: "Departments" },
      { key: "projects", label: "Projects" },
      { key: "attendance", label: "Attendance" },
    ],
    footer: [
      { key: "system-settings", label: "System Settings" },
      { key: "support", label: "Feedback & Support" },
      { key: "logout", label: "Logout" },
    ],
  },
  employee: {
    title: "WorkSync",
    main: [
      { key: "dashboard", label: "Dashboard" },
      { key: "project-team", label: "Project Team" },
      { key: "task", label: "Task" },
      { key: "attendance", label: "Attendance" },
      { key: "reports", label: "Reports & Analytics" },
      { key: "announcements", label: "Announcements" },
      { key: "leave-request", label: "Leave Request" },
    ],
    footer: [
      { key: "system-settings", label: "System Settings" },
      { key: "support", label: "Support" },
      { key: "logout", label: "Logout" },
    ],
  },
};

/* 🔗 ROUTE MAP */
const routeMap = {
  dashboard: "/dashboard",
  reports: "Admin/reports",
  "system-settings": "/settings", // special case handled below
};

function ItemIcon({ label }) {
  return (
    <span
      aria-hidden
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/50 bg-white/90 text-sm font-semibold text-[#087990]"
    >
      {label.slice(0, 2).toUpperCase()}
    </span>
  );
}

function NavSection({ items, activeItem }) {
  const navigate = useNavigate();

  return (
    <nav className="grid gap-2">
      {items.map((item) => {
        const isActive = activeItem === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              if (!routeMap[item.key]) return;

              // System Settings opens profile page by default
              const path =
                item.key === "system-settings"
                  ? "/settings/profile"
                  : routeMap[item.key];

              navigate(path);
            }}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left font-medium transition-colors ${
              isActive
                ? "bg-white text-[#087990] shadow-sm"
                : "text-[#087990] hover:bg-white/90"
            }`}
          >
            <ItemIcon label={item.label} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Sidebar({ role = "admin", activeItem }) {
  const content = sidebarContent[role] ?? sidebarContent.admin;
  const selected = activeItem || content.main[0]?.key;

  return (
    <aside
      className="flex w-64 flex-col gap-6 rounded-3xl bg-[#E5E7EB] px-4 py-6 shadow-md"
      style={{ color: palette.primary }}
    >
      <header className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#087990]/10 text-xl font-bold text-[#087990]">
          W
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-[#087990]">
            {content.title}
          </span>
          <span className="text-[11px] text-[#087990]/70">Role: {role}</span>
        </div>
      </header>

      <NavSection items={content.main} activeItem={selected} />

      <div className="mt-auto border-t border-white/60 pt-4">
        <NavSection items={content.footer} activeItem={selected} />
      </div>
    </aside>
  );
}

export default Sidebar;
