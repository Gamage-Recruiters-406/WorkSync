import React, { useState } from 'react';
import { Users, Shield, UserCog, Filter, Download, Check, Trash2, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import TopBar from '../../components/sidebar/Topbar';
import { useNavigate } from 'react-router-dom';

const UserRolesPage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@worksync.com',
      avatar: 'JS',
      avatarColor: 'bg-purple-500',
      role: 'Admin',
      roleColor: 'bg-red-100 text-red-600',
      department: 'Information Technology',
      status: 'Approved',
      statusColor: 'bg-green-100 text-green-600',
      statusIcon: true,
      joinedDate: 'Jan 15, 2024'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@sync.com',
      avatar: 'SJ',
      avatarColor: 'bg-green-500',
      role: 'HR',
      roleColor: 'bg-purple-100 text-purple-600',
      department: 'Human Resources',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-600',
      statusIcon: false,
      joinedDate: 'Jan 20, 2024'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@devteam.com',
      avatar: 'MC',
      avatarColor: 'bg-orange-500',
      role: 'Manager',
      roleColor: 'bg-orange-100 text-orange-600',
      department: 'Sales',
      status: 'Reject',
      statusColor: 'bg-red-100 text-red-600',
      statusIcon: false,
      joinedDate: 'Feb 05, 2024'
    },
    {
      id: 4,
      name: 'John Smith',
      email: 'john.smith@worksync.com',
      avatar: 'JS',
      avatarColor: 'bg-purple-500',
      role: 'Admin',
      roleColor: 'bg-red-100 text-red-600',
      department: 'Information Technology',
      status: 'Approved',
      statusColor: 'bg-green-100 text-green-600',
      statusIcon: true,
      joinedDate: 'Jan 15, 2024'
    }
  ]);

  const [notification, setNotification] = useState(null);


  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleApprove = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        showNotification('success', `${user.name} has been approved successfully!`);
        return {
          ...user,
          status: 'Approved',
          statusColor: 'bg-green-100 text-green-600',
          statusIcon: true
        };
      }
      return user;
    }));
  };

  const handleReject = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      showNotification('error', `${user.name} has been rejected.`);
      setUsers(users.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'Reject',
            statusColor: 'bg-red-100 text-red-600',
            statusIcon: false
          };
        }
        return u;
      }));
    }
  };

  const isApproveDisabled = (status) => {
    return status === 'Approved' || status === 'Reject';
  };

  const isRejectDisabled = (status) => {
    return status === 'Reject';
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        {/* Notification Popup */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-50 border-l-4 border-green-500' 
                : notification.type === 'error'
                ? 'bg-red-50 border-l-4 border-red-500'
                : 'bg-yellow-50 border-l-4 border-yellow-500'
            }`}>
              {notification.type === 'success' && <CheckCircle className="text-green-600" size={24} />}
              {notification.type === 'error' && <XCircle className="text-red-600" size={24} />}
              {notification.type === 'warning' && <AlertCircle className="text-yellow-600" size={24} />}
              
              <span className={`text-sm font-medium ${
                notification.type === 'success' 
                  ? 'text-green-800' 
                  : notification.type === 'error'
                  ? 'text-red-800'
                  : 'text-yellow-800'
              }`}>
                {notification.message}
              </span>
              
              <button 
                onClick={() => setNotification(null)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
            Employees &gt; Manage Employees &gt; Roles
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Employees */}
            <div className="bg-white rounded-xl p-5" style={{ boxShadow: '4px  4px rgba(8, 121, 144, 0.2)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="text-gray-600 text-xs mb-1">Total Employees</div>
              <div className="text-3xl font-bold text-gray-800">248</div>
            </div>

            {/* Active Employees */}
            <div className="bg-white rounded-xl p-5" style={{ boxShadow: '4px  4px rgba(8, 121, 144, 0.2)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <UserCog className="text-green-600" size={24} />
                </div>
              </div>
              <div className="text-gray-600 text-xs mb-1">Active Employees</div>
              <div className="text-3xl font-bold text-gray-800">235</div>
            </div>

            {/* Administrators */}
            <div className="bg-white rounded-xl p-5" style={{ boxShadow: '4px  4px rgba(8, 121, 144, 0.2)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Shield className="text-orange-600" size={24} />
                </div>
              </div>
              <div className="text-gray-600 text-xs mb-1">Administrators</div>
              <div className="text-3xl font-bold text-gray-800">5</div>
            </div>

            {/* Managers */}
            <div className="bg-white rounded-xl p-5" style={{ boxShadow: '4px  4px rgba(8, 121, 144, 0.2)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="text-gray-600 text-xs mb-1">Managers</div>
              <div className="text-3xl font-bold text-gray-800">18</div>
            </div>
          </div>

          {/* Grant User Roles Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Grant User Roles</h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter size={16} />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Employee</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Grant Role</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Department</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Joined Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`${user.avatarColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 text-sm">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`${user.roleColor} px-3 py-1 rounded-full text-xs font-medium`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-sm text-gray-700">{user.department}</td>

                      <td className="py-4 px-4">
                        <span className={`${user.statusColor} px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1`}>
                          {user.statusIcon && <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>}
                          {user.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-sm text-gray-700">{user.joinedDate}</td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleApprove(user.id)}
                            disabled={isApproveDisabled(user.status)}
                            className={`p-2 rounded-lg transition-colors ${
                              isApproveDisabled(user.status)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleReject(user.id)}
                            disabled={isRejectDisabled(user.status)}
                            className={`p-2 rounded-lg transition-colors ${
                              isRejectDisabled(user.status)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserRolesPage;