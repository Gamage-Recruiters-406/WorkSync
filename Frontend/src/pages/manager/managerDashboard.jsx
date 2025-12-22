import {
  AlertTriangle,
  Bell,
  FolderOpen,
  ListTodo,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import Sidebar from "../../components/sidebar/Sidebar";
import DashboardHeader from "../../components/DashboardHeader";

const ManagerDashboard = () => {
  const user = {
    name: "Kane",
    role: "Manager",
    image:
      "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2205.jpg",
  };

  const statsData = [
    {
      title: "Total Team Members",
      value: "24",
      icon: Users,
      color: "text-teal-600",
    },
    {
      title: "Active Tasks",
      value: "47",
      icon: ListTodo,
      color: "text-blue-600",
    },
    {
      title: "Overdue Tasks",
      value: "8",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Ongoing Projects",
      value: "12",
      icon: FolderOpen,
      color: "text-purple-600",
    },
    {
      title: "Team Utilization",
      value: "87%",
      icon: TrendingUp,
      color: "text-green-600",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <DashboardHeader user={user} />

        {/* Main Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
