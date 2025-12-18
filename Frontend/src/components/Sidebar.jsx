import {
  LayoutDashboard,
  Users,
  CheckSquare,
  CalendarCheck,
  BarChart3,
  Megaphone,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';

const sidebarContent = {
  admin: {
    title: 'WorkSync',
    main: [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'assign-task', label: 'Assign Task' },
      { key: 'users', label: 'Users' },
      { key: 'manage-leaves', label: 'Manage Leaves' },
      { key: 'reports', label: 'Reports & Analytics' },
      { key: 'announcements', label: 'Announcements' },
      { key: 'departments', label: 'Departments' },
      { key: 'projects', label: 'Projects' },
      { key: 'attendance', label: 'Attendance' },
    ],
    footer: [
      { key: 'system-settings', label: 'System Settings' },
      { key: 'support', label: 'Feedback & Support' },
      { key: 'logout', label: 'Logout' },
    ],
  },
  employee: {
    title: 'WorkSync',
    main: [
      { key: 'dashboard', label: 'dashboard' },
      { key: 'project-team', label: 'Project Team' },
      { key: 'task', label: 'Task' },
      { key: 'attendance', label: 'Attendance' },
      { key: 'reports', label: 'Reports & Analytics' },
      { key: 'announcements', label: 'Announcements' },
      { key: 'leave-request', label: 'Leave Request' },
    ],
    footer: [
      { key: 'system-settings', label: 'System Settings' },
      { key: 'support', label: 'Support' },
      { key: 'logout', label: 'Logout' },
    ],
  },
};

const iconMap = {
  dashboard: LayoutDashboard,
  'assign-task': CheckSquare,
  users: Users,
  'manage-leaves': CalendarCheck,
  reports: BarChart3,
  announcements: Megaphone,
  departments: Users,
  projects: FileText,
  attendance: CalendarCheck,
  'project-team': Users,
  task: CheckSquare,
  'leave-request': CalendarCheck,
  'system-settings': Settings,
  support: HelpCircle,
  logout: LogOut,
};

function ItemIcon({ label, iconKey }) {
  const Icon = iconMap[iconKey];
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card text-primary text-sm font-semibold shadow-sm">
      {Icon ? <Icon size={18} /> : <span className="text-[12px] text-primary">{label.slice(0, 2).toUpperCase()}</span>}
    </div>
  );
}

function NavSection({ items, activeItem }) {
  return (
    <nav className="grid gap-2">
      {items.map((item) => {
        const isActive = activeItem === item.key;
        return (
          <button
            key={item.key}
            type="button"
            className={`flex items-center gap-3 rounded-[12px] px-3 py-2 text-left font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-text-primary hover:bg-white hover:shadow-sm'
            }`}
          >
            <ItemIcon label={item.label} iconKey={item.key} />
            <span className="capitalize">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Sidebar({ role = 'admin', activeItem }) {
  const content = sidebarContent[role] ?? sidebarContent.admin;
  const selected = activeItem || content.main[0]?.key;

  return (
    <aside className="flex w-[260px] flex-col gap-6 rounded-[16px] bg-sidebar px-4 py-6 shadow-sm">
      <header className="flex items-center gap-3 rounded-[12px] bg-card px-3 py-2 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl font-bold text-primary">
          W
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-text-primary">{content.title}</span>
          <span className="text-[11px] text-text-secondary">Role: {role}</span>
        </div>
      </header>

      <NavSection items={content.main} activeItem={selected} />

      <div className="mt-auto border-t border-border/80 pt-4">
        <NavSection items={content.footer} activeItem={selected} />
      </div>
    </aside>
  );
}

export default Sidebar;
