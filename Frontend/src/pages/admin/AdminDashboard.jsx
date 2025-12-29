import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/sidebar/Sidebar";
import { 
  Users, 
  ClipboardList, 
  Briefcase, 
  FileText, 
  Building2, 
  Megaphone, 
  CalendarClock,
  Bell,
  UserPlus,
  ListChecks,
  FolderPlus,
  FileBarChart,
  UserCog,
  Settings,
  Building,
} from 'lucide-react';
import TopBar from "../../components/sidebar/Topbar";

const StatCard = ({ icon: Icon, label, value, action, bgColor, iconColor, link }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  return (
    <div 
      className="bg-white rounded-lg p-4 transition-all duration-300 cursor-pointer border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 2px 8px rgba(8, 121, 144, 0.3), 0 4px 16px rgba(8, 121, 144, 0.2)' 
          : '0 2px 8px rgba(8, 121, 144, 0.15)',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`${bgColor} p-2 rounded-lg`}>
          <Icon className={iconColor} size={20} />
        </div>
      </div>
      <div className="text-gray-600 text-xs mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <button
        onClick={() => link ? navigate(link) : null}
        className="text-[#087990] text-xs font-medium hover:underline flex items-center gap-1"
        role="link"
        tabIndex={0}
      >
        {action} →
      </button>
    </div>
  );
};

const ActivityItem = ({ title, description, time }) => (
  <div className="py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors">
    <div className="font-medium text-gray-800 text-sm mb-1">{title}</div>
    <div className="text-xs text-gray-500">{description} • {time}</div>
  </div>
);

const QuickActionButton = ({ icon: Icon, label }) => (
  <button 
    className="text-white rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:shadow-md hover:opacity-90"
    style={{
      background: 'linear-gradient(135deg, #087990 0%, #D9D9D9 100%)'
    }}
  >
    <Icon size={20} />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const AdminDashboard = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, title: '', content: '' });

  const showTooltip = (e, title, content) => {
    // update position on mouse move
    const x = e.clientX;
    const y = e.clientY;
    setTooltip({ visible: true, x, y, title, content });
  };

  const hideTooltip = () => setTooltip({ ...tooltip, visible: false });

  const stats = [
    { icon: Users, label: 'Total Employees', value: '248', action: 'Manage Employees', link: '/admin/Approve', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { icon: UserCog, label: 'Present Today', value: '231', action: 'View Attendance', link: '/admin/attendance', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { icon: ClipboardList, label: 'Active Tasks', value: '186', action: 'Manage Tasks', link: '/admin/tasks', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    { icon: Briefcase, label: 'Active Projects', value: '24', action: 'View Projects', link: '/admin/projects', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    { icon: FileText, label: 'Pending Leaves', value: '12', action: 'Review Requests', link: '/admin/leaves', bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    { icon: Building2, label: 'Departments', value: '8', action: 'Manage Departments', link: '/admin/departments', bgColor: 'bg-teal-100', iconColor: 'text-teal-600' },
    { icon: Megaphone, label: 'Announcements', value: '5', action: 'View All', link: '/admin/announcements', bgColor: 'bg-pink-100', iconColor: 'text-pink-600' },
    { icon: CalendarClock, label: 'Overdue Tasks', value: '8', action: 'View Details', link: '/admin/tasks-overdue', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  ];

  const activities = [
    { title: 'New Employee Added', description: 'Sarah Johnson joined the Development Team', time: '2 hours ago' },
    { title: 'Project Milestone Completed', description: 'Website Redesign Phase 1 completed by Design team', time: '4 hours ago' },
    { title: 'Leave Request Approved', description: "Mike Chen's vacation leave approved for Dec 15-20", time: '5 hours ago' },
    { title: 'Task Assignment', description: '15 new tasks assigned to Marketing team', time: 'Yesterday' },
  ];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <TopBar/>
        

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-auto p-5">
          {/* WELCOME */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back, K. Perera!</h1>
            <p className="text-sm text-gray-600">Here's what's happening with your organization today</p>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            {/* ATTENDANCE TRENDS */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Attendance Trends<br /><span className="text-xs font-normal text-gray-500">(Last 7 Days)</span></h3>
                <button className="text-[#087990] text-xs font-medium hover:underline">View Report</button>
              </div>
              <div className="h-40 flex items-end justify-between gap-2">
                {[
                  { day: 'Mon', present: 180, absent: 20 },
                  { day: 'Tue', present: 190, absent: 15 },
                  { day: 'Wed', present: 185, absent: 18 },
                  { day: 'Thu', present: 195, absent: 12 },
                  { day: 'Fri', present: 188, absent: 16 },
                  { day: 'Sat', present: 175, absent: 25 },
                  { day: 'Sun', present: 170, absent: 30 },
                ].map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col gap-1">
                      <div
                        className="bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                        style={{ height: `${(data.present / 200) * 120}px` }}
                        onMouseEnter={(e) => showTooltip(e, `${data.day} — Present`, `${data.present} employees present`)}
                        onMouseMove={(e) => showTooltip(e, `${data.day} — Present`, `${data.present} employees present`)}
                        onMouseLeave={hideTooltip}
                      ></div>
                      <div
                        className="bg-red-500 rounded-b hover:bg-red-600 transition-colors cursor-pointer"
                        style={{ height: `${(data.absent / 200) * 120}px` }}
                        onMouseEnter={(e) => showTooltip(e, `${data.day} — Absent`, `${data.absent} employees absent`)}
                        onMouseMove={(e) => showTooltip(e, `${data.day} — Absent`, `${data.absent} employees absent`)}
                        onMouseLeave={hideTooltip}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-600 mt-1">{data.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-[10px] text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-[10px] text-gray-600">Absent</span>
                </div>
              </div>
            </div>

            {/* TASK STATUS DISTRIBUTION */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Task Status Distribution</h3>
                <button className="text-[#087990] text-xs font-medium hover:underline">View All Tasks</button>
              </div>
              <div className="flex items-center justify-center h-40">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="20"
                      strokeDasharray="75.4 251.2"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                      onMouseEnter={(e) => showTooltip(e, 'Completed', 'Completed: 62%')}
                      onMouseMove={(e) => showTooltip(e, 'Completed', 'Completed: 62%')}
                      onMouseLeave={hideTooltip}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="20"
                      strokeDasharray="50.3 251.2"
                      strokeDashoffset="-75.4"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                      onMouseEnter={(e) => showTooltip(e, 'In Progress', 'In Progress: 20%')}
                      onMouseMove={(e) => showTooltip(e, 'In Progress', 'In Progress: 20%')}
                      onMouseLeave={hideTooltip}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      strokeDasharray="62.8 251.2"
                      strokeDashoffset="-125.7"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                      onMouseEnter={(e) => showTooltip(e, 'Pending', 'Pending: 10%')}
                      onMouseMove={(e) => showTooltip(e, 'Pending', 'Pending: 10%')}
                      onMouseLeave={hideTooltip}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeDasharray="62.8 251.2"
                      strokeDashoffset="-188.5"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                      onMouseEnter={(e) => showTooltip(e, 'Overdue', 'Overdue: 8%')}
                      onMouseMove={(e) => showTooltip(e, 'Overdue', 'Overdue: 8%')}
                      onMouseLeave={hideTooltip}
                    />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="flex items-center gap-2" onMouseEnter={(e)=>showTooltip(e,'Completed','Completed: 62%')} onMouseMove={(e)=>showTooltip(e,'Completed','Completed: 62%')} onMouseLeave={hideTooltip}>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-[10px] text-gray-600">Completed</span>
                </div>
                <div className="flex items-center gap-2" onMouseEnter={(e)=>showTooltip(e,'In Progress','In Progress: 20%')} onMouseMove={(e)=>showTooltip(e,'In Progress','In Progress: 20%')} onMouseLeave={hideTooltip}>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-[10px] text-gray-600">In Progress</span>
                </div>
                <div className="flex items-center gap-2" onMouseEnter={(e)=>showTooltip(e,'Pending','Pending: 10%')} onMouseMove={(e)=>showTooltip(e,'Pending','Pending: 10%')} onMouseLeave={hideTooltip}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-[10px] text-gray-600">Pending</span>
                </div>
                <div className="flex items-center gap-2" onMouseEnter={(e)=>showTooltip(e,'Overdue','Overdue: 8%')} onMouseMove={(e)=>showTooltip(e,'Overdue','Overdue: 8%')} onMouseLeave={hideTooltip}>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-[10px] text-gray-600">Overdue</span>
                </div>
              </div>
            </div>

            {/* DEPARTMENT-WISE EMPLOYEES */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Department-wise<br />Employees</h3>
                <button className="text-[#087990] text-xs font-medium hover:underline">Manage Departments</button>
              </div>
              <div className="h-40 flex items-end justify-between gap-2">
                {[
                  { dept: 'IT', count: 45, color: 'bg-blue-500' },
                  { dept: 'HR', count: 28, color: 'bg-purple-500' },
                  { dept: 'Finance', count: 35, color: 'bg-orange-500' },
                  { dept: 'Marketing', count: 32, color: 'bg-teal-500' },
                  { dept: 'Sales', count: 38, color: 'bg-red-500' },
                  { dept: 'Operations', count: 30, color: 'bg-pink-500' },
                  { dept: 'Support', count: 25, color: 'bg-purple-600' },
                  { dept: 'Legal', count: 15, color: 'bg-blue-600' },
                ].map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-medium text-gray-700">{data.count}</span>
                    <div className={`w-full ${data.color} rounded-t group-hover:opacity-80 transition-opacity`} style={{ height: `${(data.count / 50) * 120}px` }}></div>
                    <span className="text-[10px] text-gray-600 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">{data.dept}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* RECENT ACTIVITIES */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Recent Activities</h3>
                <button className="text-[#087990] text-xs font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-1">
                {activities.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionButton icon={UserPlus} label="Add Employee" />
                <QuickActionButton icon={ListChecks} label="Create Task" />
                <QuickActionButton icon={FolderPlus} label="New Project" />
                <QuickActionButton icon={Megaphone} label="Announcement" />
                <QuickActionButton icon={Building2} label="Add New Department" />
                <QuickActionButton icon={FileText} label="Export Report" />
                <QuickActionButton icon={UserCog} label="Edit Profiles" />
                <QuickActionButton icon={Settings} label="Settings" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;