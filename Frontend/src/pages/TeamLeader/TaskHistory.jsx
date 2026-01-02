import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Filter,
  Edit,
  Trash2,
  AlertCircle,
  User,
  Download,
  Eye,
  Clock,
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';

// Define API base URL
const API_URL = 'http://localhost:8090/api/v1';

const TaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
  });
  const navigate = useNavigate();

  // Get token from cookies
  const getToken = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        return value;
      }
    }
    return null;
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTasks(),
        fetchEmployeesByRole(),
        fetchCurrentUser(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(
        'Failed to load tasks. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.warn('No authentication token found for current user fetch');
        return;
      }

      // Decode token to get user ID
      const decodeToken = (token) => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Decoded token payload:', payload);
          return {
            userId:
              payload.userid || payload.userId || payload._id || payload.id,
            role: payload.role,
            email: payload.email,
          };
        } catch (error) {
          console.error('Error decoding token:', error);
          return null;
        }
      };

      const decoded = decodeToken(token);
      if (!decoded || !decoded.userId) {
        console.error('Could not decode token or get userId');
        return;
      }

      console.log('Decoded user info from token:', decoded);

      // Fetch all users (as admin can access this)
      const endpoint = `${API_URL}/userAuth/getAllUsers`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('All users API response:', result);

        if (result.success && result.data && Array.isArray(result.data)) {
          // Find the current user from the list of all users
          const userData = result.data.find(
            (user) =>
              user._id === decoded.userId ||
              user.email === decoded.email ||
              (user.FirstName &&
                user.LastName &&
                `${user.FirstName} ${user.LastName}`.includes(decoded.userId))
          );

          if (userData) {
            console.log('Found current user in all users list:', userData);

            // Transform user data
            const transformedUser = {
              _id: userData._id || decoded.userId,
              id: userData._id || decoded.userId,
              userId: userData._id || decoded.userId,
              name:
                userData.FirstName && userData.LastName
                  ? `${userData.FirstName} ${userData.LastName}`.trim()
                  : userData.name ||
                    userData.username ||
                    userData.email ||
                    'Unknown User',
              username: userData.username || userData.email,
              email: userData.email || decoded.email,
              FirstName: userData.FirstName || userData.firstName,
              LastName: userData.LastName || userData.lastName,
              role: decoded.role, // Use role from token
              departmentID: userData.departmentID,
              NIC: userData.NIC,
              ContactNumber: userData.ContactNumber,
              Gender: userData.Gender,
              permissions: userData.permissions || [],
              isAdmin: decoded.role === 3,
              isManager: decoded.role === 2,
              isEmployee: decoded.role === 1,
            };

            console.log('Transformed current user:', transformedUser);
            setCurrentUser(transformedUser);

            // Store user in localStorage
            localStorage.setItem(
              'currentUser',
              JSON.stringify(transformedUser)
            );
            return;
          } else {
            console.log(
              'User not found in all users list, creating from token data'
            );
          }
        }
      }

      // Fallback: Create user from token data only
      const transformedUser = {
        _id: decoded.userId,
        id: decoded.userId,
        userId: decoded.userId,
        name: `User ${decoded.userId.substring(0, 6)}`,
        email: decoded.email || 'unknown@email.com',
        role: decoded.role || 1,
        isAdmin: decoded.role === 3,
        isManager: decoded.role === 2,
        isEmployee: decoded.role === 1,
      };

      console.log('Fallback user from token:', transformedUser);
      setCurrentUser(transformedUser);
      localStorage.setItem('currentUser', JSON.stringify(transformedUser));
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Fallback to localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  };

  const fetchTasks = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Use the getAllTasks endpoint
      const endpoint = `${API_URL}/task/getAllTasks`;

      console.log(`Fetching all tasks from: ${endpoint}`);
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);

        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      console.log('Tasks API response:', result);

      let tasksArray = [];

      // Handle response structure from backend
      if (result.success && result.data) {
        tasksArray = Array.isArray(result.data) ? result.data : [];
      } else if (result.tasks) {
        tasksArray = Array.isArray(result.tasks) ? result.tasks : [];
      } else if (result.data && result.data.tasks) {
        tasksArray = Array.isArray(result.data.tasks) ? result.data.tasks : [];
      } else if (Array.isArray(result)) {
        tasksArray = result;
      } else {
        console.warn('Unexpected task response structure:', result);
        tasksArray = [];
      }

      console.log('Parsed tasks:', tasksArray);
      setTasks(tasksArray);
      calculateStats(tasksArray);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      calculateStats([]);
    }
  };

  const fetchEmployeesByRole = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.warn('No authentication token found for employees fetch');
        setEmployees([]);
        return;
      }

      // Use the getEmloyeesByRole endpoint
      const endpoint = `${API_URL}/employee/getEmloyeesByRole`;

      console.log(`Fetching employees from: ${endpoint}`);
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Employees response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        console.log('Employees endpoint failed or unavailable');
        setEmployees([]);
        return;
      }

      const result = await response.json();
      console.log('Employees API response:', result);

      let employeesArray = [];

      // Handle response structure from backend
      if (result.success && result.Employees) {
        employeesArray = Array.isArray(result.Employees)
          ? result.Employees
          : [];
      } else if (result.employees) {
        employeesArray = Array.isArray(result.employees)
          ? result.employees
          : [];
      } else if (result.data && result.data.employees) {
        employeesArray = Array.isArray(result.data.employees)
          ? result.data.employees
          : [];
      } else if (Array.isArray(result)) {
        employeesArray = result;
      } else {
        console.warn('Unexpected employees response format:', result);
        employeesArray = [];
      }

      // Transform employee data to match expected structure
      const transformedEmployees = employeesArray.map((employee) => ({
        _id: employee._id || employee.id,
        id: employee._id || employee.id,
        userId: employee._id || employee.id,
        name:
          employee.FirstName && employee.LastName
            ? `${employee.FirstName} ${employee.LastName}`.trim()
            : employee.name ||
              employee.username ||
              employee.email ||
              'Unknown Employee',
        username: employee.username || employee.email,
        email: employee.email,
        FirstName: employee.FirstName || employee.firstName,
        LastName: employee.LastName || employee.lastName,
        role: employee.role,
        departmentID: employee.departmentID,
        NIC: employee.NIC,
        ContactNumber: employee.ContactNumber,
        Gender: employee.Gender,
      }));

      console.log('Parsed and transformed employees:', transformedEmployees);
      setEmployees(transformedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
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
    if (!taskId) {
      alert('Cannot delete task: Invalid task ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const endpoint = `${API_URL}/task/deleteTask/${taskId}`;

        console.log(`Deleting task from: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            alert('Task deleted successfully!');
            // Remove task from local state
            setTasks((prevTasks) =>
              prevTasks.filter((task) => task._id !== taskId)
            );
            // Recalculate stats
            calculateStats(tasks.filter((task) => task._id !== taskId));
          } else {
            throw new Error(result.message || 'Failed to delete task');
          }
        } else {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const navigateToTaskDetails = (taskId) => {
  navigate(`/task-details/${taskId}`,  {
      state: {
        currentUser: currentUser,
        userRole: currentUser?.role,
        userId: currentUser?._id,
        userName: currentUser?.name,
        userEmail: currentUser?.email,
        timestamp: new Date().toISOString(),
      },
    });
  };

  const navigateToEditTask = (taskId) => {
    navigate(`/edit-task/${taskId}`, {
      state: {
        currentUser: currentUser,
        userRole: currentUser?.role,
        userId: currentUser?._id,
        userName: currentUser?.name,
        userEmail: currentUser?.email,
        timestamp: new Date().toISOString(),
      },
    });
  };

  const navigateToCreateTask = () => {
    navigate('/create-task', {
      state: {
        currentUser: currentUser,
        userRole: currentUser?.role,
        userId: currentUser?._id,
        userName: currentUser?.name,
        userEmail: currentUser?.email,
        timestamp: new Date().toISOString(),
      },
    });
  };

  // Helper function to get milestone name
  const getMilestoneName = (milestone) => {
    if (!milestone) return null;
    
    if (typeof milestone === 'object' && milestone !== null) {
      return milestone.milestoneName || milestone.name || 'Unnamed Milestone';
    }
    
    if (typeof milestone === 'string') {
      return milestone;
    }
    
    return 'Unknown Milestone';
  };

  const getEmployeeName = (employeeOrId) => {
    if (!employeeOrId) return 'Unassigned';

    // If it's an object with name (populated employee from backend)
    if (typeof employeeOrId === 'object' && employeeOrId !== null) {
      return (
        (employeeOrId.FirstName && employeeOrId.LastName
          ? `${employeeOrId.FirstName} ${employeeOrId.LastName}`.trim()
          : null) ||
        employeeOrId.name ||
        employeeOrId.username ||
        employeeOrId.email ||
        `Employee ${employeeOrId._id?.substring(0, 6) || 'Unknown'}`
      );
    }

    // If it's a string ID
    if (typeof employeeOrId === 'string') {
      // Try to find the employee in the employees array
      const employee = employees.find((emp) => {
        const employeeIdFromEmp = emp._id || emp.id || emp.userId || emp.userid;
        return employeeIdFromEmp === employeeOrId;
      });

      return employee
        ? (employee.FirstName && employee.LastName
            ? `${employee.FirstName} ${employee.LastName}`.trim()
            : null) ||
            employee.name ||
            employee.username ||
            employee.email ||
            `Employee ${employeeOrId.substring(0, 6)}`
        : `Employee (${employeeOrId.substring(0, 6)}...)`;
    }

    return 'Unknown Employee';
  };

  const handleDownloadAttachment = async (taskId, attachmentId, filename) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      const endpoint = `${API_URL}/task/${taskId}/attachments/${attachmentId}/download`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorText = await response.text();
        alert(`Failed to download attachment: ${errorText}`);
      }
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Failed to download attachment. Please try again.');
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm === '' ||
      (task.title &&
        task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority =
      selectedPriority === '' ||
      (task.priority &&
        task.priority.toLowerCase() === selectedPriority.toLowerCase());

    const matchesStatus =
      selectedStatus === '' ||
      (task.status &&
        task.status.toLowerCase() === selectedStatus.toLowerCase());

    const matchesEmployee =
      selectedEmployee === '' ||
      (Array.isArray(task.assignedTo) &&
        task.assignedTo.some((employee) => {
          if (typeof employee === 'object') {
            return (
              employee._id === selectedEmployee ||
              employee.FirstName === selectedEmployee ||
              employee.LastName === selectedEmployee
            );
          }
          return employee === selectedEmployee;
        }));

    const matchesDate =
      dateRange.start === '' ||
      dateRange.end === '' ||
      (task.deadline &&
        new Date(task.deadline) >= new Date(dateRange.start) &&
        new Date(task.deadline) <= new Date(dateRange.end));

    return (
      matchesSearch &&
      matchesPriority &&
      matchesStatus &&
      matchesEmployee &&
      matchesDate
    );
  });

  const getPriorityColor = (priority) => {
    if (!priority) return 'bg-gray-100 text-gray-800';

    switch (priority.toLowerCase()) {
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
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status.toLowerCase()) {
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
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    try {
      const today = new Date();
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) return null;

      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      console.error('Error calculating days remaining:', error);
      return null;
    }
  };

  // Get role name for display
  const getRoleName = (roleNumber) => {
    switch (parseInt(roleNumber)) {
      case 1:
        return 'Employee';
      case 2:
        return 'Manager';
      case 3:
        return 'Admin';
      default:
        return `Role ${roleNumber}`;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        role={
          currentUser?.role
            ? getRoleName(currentUser.role).toLowerCase()
            : 'employee'
        }
        activeItem="task"
        userName={currentUser?.name}
        userEmail={currentUser?.email}
      />

      {/* Main Content */}
      <div className="flex-1 ml-15 p-6">
        {/* Top Navigation Bar with User Info */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Task History & Management
              </h1>
              {currentUser && (
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{currentUser.name}</span>
                  <span className="text-gray-500">•</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {getRoleName(currentUser.role)}
                  </span>
                  {currentUser.departmentID && (
                    <>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">
                        Dept: {currentUser.departmentID}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={navigateToCreateTask}
                className="flex items-center gap-2 px-4 py-2 bg-[#087990] text-white font-medium rounded-lg hover:bg-blue-700 transition"
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
              <span className="text-sm text-gray-600">Active:</span>
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
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Filters</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
                <span className="self-center text-sm text-gray-500">to</span>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Assigned Employee
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">All Employees</option>
                {employees.map((employee, index) => {
                  const employeeId =
                    employee._id || employee.id || `employee-${index}`;
                  const employeeName =
                    (employee.FirstName && employee.LastName
                      ? `${employee.FirstName} ${employee.LastName}`.trim()
                      : null) ||
                    employee.name ||
                    employee.username ||
                    employee.email ||
                    `Employee ${index + 1}`;
                  return (
                    <option key={employeeId} value={employeeId}>
                      {employeeName}
                      {employee.role ? ` (${getRoleName(employee.role)})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setDateRange({ start: '', end: '' });
                setSelectedEmployee('');
                setSelectedPriority('');
                setSelectedStatus('');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition"
            >
              Clear All Filters
            </button>
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
                {tasks.length === 0
                  ? 'No tasks found'
                  : 'No tasks match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {tasks.length === 0
                  ? 'No tasks have been created yet. Create your first task!'
                  : 'Try adjusting your search criteria.'}
              </p>
              <button
                onClick={navigateToCreateTask}
                className="inline-flex items-center px-6 py-3 bg-[#087990] text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                + Create Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const taskId = task._id;
              const daysRemaining = getDaysRemaining(task.deadline);

              return (
                <div
                  key={taskId}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {task.title || 'Untitled Task'}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigateToTaskDetails(taskId)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm transition"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => navigateToEditTask(taskId)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm transition"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(taskId)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {task.description || 'No description provided'}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
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

                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Created:</span>
                            <span className="text-gray-700">
                              {formatDateTime(task.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span
                            className={`px-3 py-1 rounded-full font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority || 'Not Set'} Priority
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full font-medium ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status || 'Not Set'}
                          </span>

                          {/* FIXED: Safely render milestone */}
                          {task.milestone && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                              Milestone: {getMilestoneName(task.milestone)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    {task.attachments && task.attachments.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Attachments:</span>
                        <div className="flex gap-2 mt-1">
                          {task.attachments.map((attachment, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                handleDownloadAttachment(
                                  taskId,
                                  attachment._id,
                                  attachment.originalName || attachment.filename
                                )
                              }
                              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition"
                            >
                              <Download className="w-3 h-3" />
                              {attachment.originalName || attachment.filename}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Assigned to:</span>
                      {task.assignedTo && task.assignedTo.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {task.assignedTo.map((employee, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {getEmployeeName(employee)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 ml-2">Unassigned</span>
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
  );
};

export default TaskHistory;