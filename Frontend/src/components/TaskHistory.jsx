import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  Search,
  Calendar,
  Filter,
  ChevronRight,
  Edit,
  Trash2,
  AlertCircle,
  User,
  Folder,
} from 'lucide-react';

// Define API base URL
const API_URL = 'http://localhost:8090/api/v1';

// Mock Data for development
const MOCK_TASKS = [
  {
    _id: '61a1b2c3d4e5f67890123456',
    title: 'Design Homepage UI',
    description:
      'Mock data for development.',
    deadline: '2024-12-20T23:59:59.000Z',
    priority: 'High',
    status: 'In Progress',
    milestoneId: '61a1b2c3d4e5f67890123457',
    assignedTo: ['61a1b2c3d4e5f67890123458', '61a1b2c3d4e5f67890123459'],
    createdAt: '2024-11-15T10:30:00.000Z',
    updatedAt: '2024-11-28T14:45:00.000Z',
  },
  {
    _id: '61a1b2c3d4e5f6789012345a',
    title: 'Implement User Authentication',
    description:
      'Mock data for development.',
    deadline: '2024-12-10T23:59:59.000Z',
    priority: 'Medium',
    status: 'Pending',
    milestoneId: '61a1b2c3d4e5f6789012345b',
    assignedTo: ['61a1b2c3d4e5f67890123458'],
    createdAt: '2024-11-10T09:15:00.000Z',
    updatedAt: '2024-11-25T16:20:00.000Z',
  },
];

const MOCK_USERS = [
  {
    _id: '61a1b2c3d4e5f67890123458',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'developer',
  },
  {
    _id: '61a1b2c3d4e5f67890123459',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'designer',
  },
];

const MOCK_MILESTONES = [
  {
    _id: '61a1b2c3d4e5f67890123457',
    milestoneName: 'UI/UX Design Phase',
    description: 'Complete all design work for the application',
    deadline: '2024-12-25T23:59:59.000Z',
    status: 'In Progress',
  },
  {
    _id: '61a1b2c3d4e5f6789012345b',
    milestoneName: 'Authentication System',
    description: 'Implement secure user authentication and authorization',
    deadline: '2024-12-15T23:59:59.000Z',
    status: 'Pending',
  },
];

// Flag to control whether to use mock data (set to true for development)
const USE_MOCK_DATA = true;

const TaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
  });
  const navigate = useNavigate();

  // Get token from cookies
  const getToken = () => {
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      if (USE_MOCK_DATA) {
        // Use mock data for development
        setTasks(MOCK_TASKS);
        setUsers(MOCK_USERS);
        setMilestones(MOCK_MILESTONES);
        calculateStats(MOCK_TASKS);
      } else {
        // Try to fetch from actual API
        await Promise.all([fetchTasks(), fetchUsers(), fetchMilestones()]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data if API fails
      setTasks(MOCK_TASKS);
      setUsers(MOCK_USERS);
      setMilestones(MOCK_MILESTONES);
      calculateStats(MOCK_TASKS);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/task`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setTasks(result.data);
        calculateStats(result.data);
      } else if (result.tasks) {
        setTasks(result.tasks);
        calculateStats(result.tasks);
      } else {
        throw new Error('Invalid response structure from tasks API');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error; // Re-throw to trigger mock data fallback
    }
  };

  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/userAuth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setUsers(result.data);
      } else if (result.users) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Re-throw to trigger mock data fallback
    }
  };

  const fetchMilestones = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/millestone`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setMilestones(result.data);
      } else if (result.milestones) {
        setMilestones(result.milestones);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
      throw error; // Re-throw to trigger mock data fallback
    }
  };

  const calculateStats = (tasks) => {
    const stats = {
      total: tasks.length,
      active: tasks.filter(
        (task) => task.status?.toLowerCase() === 'in progress'
      ).length,
      pending: tasks.filter((task) => task.status?.toLowerCase() === 'pending')
        .length,
      completed: tasks.filter(
        (task) => task.status?.toLowerCase() === 'completed'
      ).length,
    };
    setStats(stats);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        if (USE_MOCK_DATA) {
          // Mock delete operation
          const updatedTasks = tasks.filter((task) => task._id !== taskId);
          setTasks(updatedTasks);
          calculateStats(updatedTasks);
          alert('Task deleted successfully (mock)!');
        } else {
          // Actual API call
          const token = getToken();
          if (!token) {
            throw new Error('No authentication token found');
          }

          const response = await fetch(`${API_URL}/task/${taskId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const result = await response.json();

          if (result.success) {
            alert('Task deleted successfully!');
            fetchTasks(); // Refresh the task list
          } else {
            throw new Error(result.message || 'Failed to delete task');
          }
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const getUserName = (userId) => {
    if (!userId) return 'Unassigned';
    const user = users.find((u) => u._id === userId);
    return user ? user.name : `User (${userId.substring(0, 6)}...)`;
  };

  const getMilestoneName = (milestoneId) => {
    if (!milestoneId) return 'No Milestone';
    const milestone = milestones.find((m) => m._id === milestoneId);
    return milestone
      ? milestone.milestoneName
      : `Milestone (${milestoneId.substring(0, 6)}...)`;
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm === '' ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      selectedPriority === '' ||
      task.priority?.toLowerCase() === selectedPriority.toLowerCase();

    const matchesUser =
      selectedUser === '' ||
      (Array.isArray(task.assignedTo) &&
        task.assignedTo.includes(selectedUser));

    const matchesDate =
      dateRange.start === '' ||
      dateRange.end === '' ||
      (task.deadline &&
        new Date(task.deadline) >= new Date(dateRange.start) &&
        new Date(task.deadline) <= new Date(dateRange.end));

    return matchesSearch && matchesPriority && matchesUser && matchesDate;
  });

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role="employee" activeItem="task" />

      {/* Main Content */}
      <div className="flex-1 ml-4">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Task Management
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => navigate('/create-task')}
                className="flex items-center gap-2 px-4 py-2 bg-[#087990] text-white font-medium rounded-lg hover:bg-blue-700"
              >
                + Create Task
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Total Tasks:</span>
              <span className="font-medium text-gray-800">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-sm text-gray-600">In Progress:</span>
              <span className="font-medium text-blue-600">{stats.active}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="text-sm text-gray-600">Pending:</span>
              <span className="font-medium text-yellow-600">
                {stats.pending}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm text-gray-600">Completed:</span>
              <span className="font-medium text-green-600">
                {stats.completed}
              </span>
            </div>
            {USE_MOCK_DATA && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span className="text-sm text-gray-600">Mock Data:</span>
                <span className="font-medium text-purple-600">Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          {/* Filters Section */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Filters</span>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />
                  <span className="self-center text-sm text-gray-500">to</span>
                  <input
                    type="date"
                    className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Assigned To
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">All Users</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-36">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="self-end">
                <button
                  onClick={() => {
                    setDateRange({ start: '', end: '' });
                    setSelectedUser('');
                    setSelectedPriority('');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-600 mb-6">
                  {tasks.length === 0
                    ? 'No tasks have been created yet. Create your first task!'
                    : 'No tasks match your filters. Try adjusting your search criteria.'}
                </p>
                <button
                  onClick={() => navigate('/create-task')}
                  className="inline-flex items-center px-6 py-3 bg-[#087990] text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  + Create Task
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const daysRemaining = getDaysRemaining(task.deadline);
                return (
                  <div
                    key={task._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {task.title}
                          </h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/edit-task/${task._id}`)}
                              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task._id)}
                              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{task.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Deadline:</span>
                            <span className="text-gray-700">
                              {formatDate(task.deadline)}
                              {daysRemaining !== null && (
                                <span
                                  className={`ml-2 ${
                                    daysRemaining < 0
                                      ? 'text-red-600'
                                      : daysRemaining <= 3
                                      ? 'text-yellow-600'
                                      : 'text-green-600'
                                  }`}
                                >
                                  (
                                  {daysRemaining < 0
                                    ? `${Math.abs(daysRemaining)} days overdue`
                                    : `${daysRemaining} days left`}
                                  )
                                </span>
                              )}
                            </span>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority} Priority
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full font-medium ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Folder className="w-4 h-4" />
                        <span className="font-medium">Milestone:</span>
                        <span>{getMilestoneName(task.milestoneId)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Assigned to:</span>{' '}
                        {Array.isArray(task.assignedTo) &&
                        task.assignedTo.length > 0 ? (
                          <div className="flex gap-2 mt-1">
                            {task.assignedTo.map((userId) => (
                              <span
                                key={userId}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                              >
                                {getUserName(userId)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskHistory;
