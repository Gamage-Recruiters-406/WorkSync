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
  FileText,
  File,
  Folder,
  Shield,
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import {
  taskApi,
  employeeApi,
  projectApi,
  getCurrentUserInfo,
  taskTransformers
} from '../../services/taskApi';

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
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [checkingTeamLeader, setCheckingTeamLeader] = useState(false);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Calculate stats directly from tasks
  const stats = {
    total: tasks.length,
    active: tasks.filter((task) => task.status?.toLowerCase() === 'in progress')
      .length,
    pending: tasks.filter((task) => task.status?.toLowerCase() === 'pending')
      .length,
    completed: tasks.filter(
      (task) => task.status?.toLowerCase() === 'completed'
    ).length,
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
        fetchProjects(),
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

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await projectApi.getAllProjects();
      if (response.success && Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      // Get user from our API helper
      const user = await getCurrentUserInfo();
      
      if (user) {
        // Create enhanced user object
        const enhancedUser = {
          ...user,
          isAdmin: user.role === 3,
          isManager: user.role === 2,
          isEmployee: user.role === 1,
        };
        
        setCurrentUser(enhancedUser);
        localStorage.setItem('currentUser', JSON.stringify(enhancedUser));
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem('currentUser');
        if (stored) setCurrentUser(JSON.parse(stored));
      }
    } catch (error) {
      const stored = localStorage.getItem('currentUser');
      if (stored) setCurrentUser(JSON.parse(stored));
      console.error('Error fetching current user:', error);
    } finally {
      setCheckingTeamLeader(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getAllTasks();
      let tasksArray = [];

      if (response.success && response.data)
        tasksArray = Array.isArray(response.data) ? response.data : [];
      else if (response.tasks)
        tasksArray = Array.isArray(response.tasks) ? response.tasks : [];
      else if (response.data?.tasks)
        tasksArray = Array.isArray(response.data.tasks) ? response.data.tasks : [];
      else if (Array.isArray(response)) tasksArray = response;

      setTasks(tasksArray);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const fetchEmployeesByRole = async () => {
    try {
      const response = await employeeApi.getEmployeesByRole();
      let employeesArray = [];

      if (response.success && response.Employees)
        employeesArray = Array.isArray(response.Employees)
          ? response.Employees
          : [];
      else if (response.employees)
        employeesArray = Array.isArray(response.employees)
          ? response.employees
          : [];
      else if (response.data?.employees)
        employeesArray = Array.isArray(response.data.employees)
          ? response.data.employees
          : [];
      else if (Array.isArray(response)) employeesArray = response;

      const transformedEmployees = employeesArray.map((employee) => ({
        _id: employee._id || employee.id,
        id: employee._id || employee.id,
        name:
          employee.FirstName && employee.LastName
            ? `${employee.FirstName} ${employee.LastName}`.trim()
            : employee.name || employee.email || 'Unknown Employee',
        email: employee.email,
        role: employee.role,
      }));

      setEmployees(transformedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  // Get project name for a task
  const getProjectName = (task) => {
    if (!task.project || !projects.length) return 'No Project';

    // Check if task has project ID
    if (task.project._id) {
      const project = projects.find((p) => p._id === task.project._id);
      return project ? project.name : 'Unknown Project';
    }

    // Check if task has project object directly
    if (typeof task.project === 'string') {
      const project = projects.find((p) => p._id === task.project);
      return project ? project.name : 'Unknown Project';
    }

    // Check if task has project name directly
    if (task.project?.name) {
      return task.project.name;
    }

    return 'No Project';
  };

  const handleDelete = async (taskId) => {
    if (
      !taskId ||
      !window.confirm('Are you sure you want to delete this task?')
    )
      return;

    try {
      await taskApi.deleteTask(taskId);
      alert('Task deleted successfully!');
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const navigateTo = (path, taskId = '') => {
    navigate(`/${path}${taskId ? `/${taskId}` : ''}`, {
      state: {
        currentUser,
        userRole: currentUser?.role,
        userId: currentUser?._id,
        userName: currentUser?.name,
        userEmail: currentUser?.email,
        timestamp: new Date().toISOString(),
      },
    });
  };

  // Function to get PDF attachments from task
  const getPdfAttachments = (task) => {
    return (task.attachments || []).filter(
      (att) =>
        att.fileType?.toLowerCase() === 'application/pdf' ||
        att.originalName?.toLowerCase().endsWith('.pdf') ||
        att.filename?.toLowerCase().endsWith('.pdf')
    );
  };

  const getMilestoneName = (milestone) => {
    if (!milestone) return null;
    if (typeof milestone === 'object')
      return milestone.milestoneName || milestone.name || 'Unnamed Milestone';
    if (typeof milestone === 'string') return milestone;
    return 'Unknown Milestone';
  };

  const getEmployeeName = (employeeOrId) => {
    if (!employeeOrId) return 'Unassigned';

    if (typeof employeeOrId === 'object') {
      return employeeOrId.FirstName && employeeOrId.LastName
        ? `${employeeOrId.FirstName} ${employeeOrId.LastName}`.trim()
        : employeeOrId.name ||
            employeeOrId.email ||
            `Employee ${employeeOrId._id?.substring(0, 6) || 'Unknown'}`;
    }

    if (typeof employeeOrId === 'string') {
      const employee = employees.find(
        (emp) => (emp._id || emp.id || emp.userId) === employeeOrId
      );
      return employee
        ? getEmployeeName(employee)
        : `Employee (${employeeOrId.substring(0, 6)}...)`;
    }

    return 'Unknown Employee';
  };

  const handleViewPDF = (task, pdfAttachment, e) => {
    if (e) e.stopPropagation();
    if (pdfAttachment) {
      const previewUrl = taskApi.getAttachmentPreviewUrl(task._id, pdfAttachment._id);
      setPdfUrl(previewUrl);
      setSelectedTask(task);
      setShowPdfModal(true);
    }
  };

  const handleDownloadAttachment = async (taskId, attachmentId, filename) => {
    try {
      await taskApi.downloadAttachment(taskId, attachmentId, filename);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Failed to download attachment. Please try again.');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchTerm ||
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProjectName(task).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getMilestoneName(task.milestone)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesPriority =
      !selectedPriority ||
      task.priority?.toLowerCase() === selectedPriority.toLowerCase();

    const matchesStatus =
      !selectedStatus ||
      task.status?.toLowerCase() === selectedStatus.toLowerCase();

    const matchesEmployee =
      !selectedEmployee ||
      (Array.isArray(task.assignedTo) &&
        task.assignedTo.some((employee) =>
          typeof employee === 'object'
            ? employee._id === selectedEmployee ||
              employee.FirstName === selectedEmployee ||
              employee.LastName === selectedEmployee
            : employee === selectedEmployee
        ));

    const matchesDate =
      !dateRange.start ||
      !dateRange.end ||
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
    return taskTransformers.getPriorityColor(priority);
  };

  const getStatusColor = (status) => {
    return taskTransformers.getStatusColor(status);
  };

  const formatDate = (dateString) => {
    return taskTransformers.formatDate(dateString);
  };

  const isOverdue = (deadline) => {
    return taskTransformers.isOverdue(deadline);
  };

  const formatDateTime = (dateString) => {
    return taskTransformers.formatDateTime(dateString);
  };

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

  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
    setSelectedEmployee('');
    setSelectedPriority('');
    setSelectedStatus('');
    setSearchTerm('');
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setPdfUrl(null);
    setSelectedTask(null);
  };

  // Only show loading when we're still checking team leader status
  if (loading || checkingTeamLeader) {
    return (
      <div className="flex h-screen">
        <Sidebar
          role={
            currentUser?.role
              ? getRoleName(currentUser.role).toLowerCase()
              : 'employee'
          }
          activeItem="task"
        />
        <main className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {checkingTeamLeader ? 'Checking permissions...' : 'Loading tasks...'}
            </p>
          </div>
        </main>
      </div>
    );
  }

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

      <div className="flex-1 ml-15 p-6">
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
                  {currentUser.isAdmin && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                  {currentUser.isTeamLeader && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Team Leader
                    </span>
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
              {/* showing CREATE TASK button  ONLY FOR TEAM LEADERS */}
              {currentUser?.isTeamLeader && (
                <button
                  onClick={() => navigateTo('create-task')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#087990] text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  + Create Task
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    key === 'total'
                      ? 'bg-gray-500'
                      : key === 'active'
                      ? 'bg-blue-500'
                      : key === 'pending'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                ></span>
                <span className="text-sm text-gray-600 capitalize">{key}:</span>
                <span
                  className={`font-medium ${
                    key === 'active'
                      ? 'text-blue-600'
                      : key === 'pending'
                      ? 'text-yellow-600'
                      : key === 'completed'
                      ? 'text-green-600'
                      : 'text-gray-800'
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

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
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}{' '}
                    {employee.role ? `(${getRoleName(employee.role)})` : ''}
                  </option>
                ))}
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
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        <div className="space-y-4 max-w-7xl mx-auto">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm ||
                selectedPriority ||
                selectedEmployee ||
                selectedStatus ||
                dateRange.start ||
                dateRange.end
                  ? 'No matching tasks found'
                  : 'No tasks found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ||
                selectedPriority ||
                selectedEmployee ||
                selectedStatus ||
                dateRange.start ||
                dateRange.end
                  ? 'Try adjusting your filters'
                  : 'There are no tasks in the system yet.'}
              </p>
              {/* SHOW CREATE TASK BUTTON ONLY FOR TEAM LEADERS */}
              {currentUser?.isTeamLeader && (
                <button
                  onClick={() => navigateTo('create-task')}
                  className="bg-[#087990] hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition"
                >
                  + Create Task
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => {
              const pdfAttachments = getPdfAttachments(task);
              const projectName = getProjectName(task);

              return (
                <div
                  key={task._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    <div className="w-2 bg-[#087990]" />

                    <div className="flex-1 p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {task.title || 'Untitled Task'}
                            {pdfAttachments?.length > 0 && (
                              <button
                                onClick={(e) =>
                                  handleViewPDF(task, pdfAttachments[0], e)
                                }
                                className="ml-3 px-2 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                              >
                                <span className="flex items-center gap-1">
                                  <File className="w-3 h-3" />
                                  view task.pdf
                                </span>
                              </button>
                            )}
                          </h3>
                          <div className="mt-1 text-gray-600 text-sm">
                            {projectName && projectName !== 'No Project' && (
                              <div className="flex items-center gap-1 mb-1">
                                <Folder className="w-3 h-3 text-gray-500" />
                                <span className="font-medium">Project:</span>
                                <span className="ml-1 text-gray-700">
                                  {projectName}
                                </span>
                              </div>
                            )}
                            {task.milestone && (
                              <div>
                                <span className="font-medium">Milestone:</span>
                                <span className="ml-1">
                                  {getMilestoneName(task.milestone)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigateTo('task-details', task._id)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm transition"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                          {/* SHOW EDIT AND DELETE BUTTONS ONLY FOR TEAM LEADERS */}
                          {currentUser?.isTeamLeader && (
                            <>
                              <button
                                onClick={() =>
                                  navigateTo('edit-task', task._id)
                                }
                                className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm transition"
                              >
                                <Edit className="w-4 h-4" /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(task._id)}
                                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm transition"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                        <div>
                          <strong>Deadline:</strong>{' '}
                          <span
                            className={
                              isOverdue(task.deadline)
                                ? 'text-red-600 font-semibold'
                                : ''
                            }
                          >
                            {formatDate(task.deadline)}
                            {isOverdue(task.deadline) && ' (Overdue)'}
                          </span>
                        </div>
                        <div>
                          <strong>Priority:</strong>{' '}
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority
                              ? task.priority.charAt(0).toUpperCase() +
                                task.priority.slice(1)
                              : 'Not Set'}
                          </span>
                        </div>
                        <div>
                          <strong>Status:</strong>{' '}
                          <span
                            className={`font-semibold ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status
                              ? task.status.charAt(0).toUpperCase() +
                                task.status.slice(1)
                              : 'Not Set'}
                          </span>
                        </div>
                        <div>
                          <strong>Created:</strong>{' '}
                          <span className="text-gray-800">
                            {formatDateTime(task.createdAt)}
                          </span>
                        </div>
                        {task.assignedTo?.length > 0 && (
                          <div>
                            <strong>Assignees:</strong>{' '}
                            <span className="text-gray-800">
                              {task.assignedTo.map(getEmployeeName).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {task.description && (
                        <div className="mt-3 text-sm text-gray-600">
                          {task.description.length > 150 ? (
                            <>
                              {task.description.substring(0, 150)}...
                              <button
                                onClick={() =>
                                  navigateTo('task-details', task._id)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                Read more
                              </button>
                            </>
                          ) : (
                            task.description
                          )}
                        </div>
                      )}

                      {pdfAttachments?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {pdfAttachments.map((pdf, index) => (
                            <div
                              key={pdf._id || index}
                              className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded border"
                            >
                              <FileText className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-gray-700 truncate max-w-[150px]">
                                {pdf.originalName ||
                                  `Document_${index + 1}.pdf`}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => handleViewPDF(task, pdf, e)}
                                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                                  title="View PDF"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDownloadAttachment(
                                      task._id,
                                      pdf._id,
                                      pdf.originalName || pdf.filename
                                    )
                                  }
                                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                                  title="Download PDF"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {task.attachments?.filter(
                        (att) =>
                          !att.fileType?.toLowerCase()?.includes('pdf') &&
                          !att.originalName?.toLowerCase()?.endsWith('.pdf') &&
                          !att.filename?.toLowerCase()?.endsWith('.pdf')
                      ).length > 0 && (
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="font-medium">
                            Other Attachments:
                          </span>
                          <div className="flex gap-2 mt-1">
                            {task.attachments
                              .filter(
                                (att) =>
                                  !att.fileType
                                    ?.toLowerCase()
                                    ?.includes('pdf') &&
                                  !att.originalName
                                    ?.toLowerCase()
                                    ?.endsWith('.pdf') &&
                                  !att.filename?.toLowerCase()?.endsWith('.pdf')
                              )
                              .map((attachment, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleDownloadAttachment(
                                      task._id,
                                      attachment._id,
                                      attachment.originalName ||
                                        attachment.filename
                                    )
                                  }
                                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition"
                                >
                                  <Download className="w-3 h-3" />{' '}
                                  {attachment.originalName ||
                                    attachment.filename}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showPdfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedTask?.title || 'Task Document'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Viewing PDF attachment
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (pdfUrl) {
                      const link = document.createElement('a');
                      link.href = pdfUrl;
                      link.target = '_blank';
                      link.rel = 'noopener noreferrer';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Open in New Tab
                </button>
                <button
                  onClick={closePdfModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Loading PDF...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskHistory;