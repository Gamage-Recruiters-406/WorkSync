import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  Users,
  FileText,
  Flag,
  Download,
  Eye,
  Trash2,
  FileIcon,
  Paperclip,
  Target,
  Folder,
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';

// Define API base URL
const API_URL = 'http://localhost:8090/api/v1';

const CreateTaskForm = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: [],
    deadline: '',
    priority: 'Medium',
    status: 'Pending',
    milestone: '',
    projectId: '',
  });

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);

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

  // Fetch employees, projects, milestones and task data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setEmployeesLoading(true);
        setProjectsLoading(true);

        await Promise.all([fetchEmployeesByRole(), fetchProjects()]);

        if (taskId) {
          setIsEditMode(true);
          await fetchTaskDetails(taskId);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to load initial data. Please refresh the page.');
      } finally {
        setEmployeesLoading(false);
        setProjectsLoading(false);
      }
    };

    initializeData();
  }, [taskId]);

  // Fetch employees by role (role 1 = employees)
  const fetchEmployeesByRole = async () => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_URL}/employee/getEmloyeesByRole`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access forbidden. You may not have permission to access employees.');
        } else if (response.status === 404) {
          throw new Error('Employees endpoint not found.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Employees API response:', result);

      // Handle response structure based on your backend
      let employeeData = [];
      if (result.success && result.Employees && Array.isArray(result.Employees)) {
        employeeData = result.Employees;
      } else if (result.employees && Array.isArray(result.employees)) {
        employeeData = result.employees;
      } else if (Array.isArray(result)) {
        employeeData = result;
      } else {
        console.error('Invalid response structure:', result);
        throw new Error('Invalid response structure from employees API');
      }

      // Transform employee data to match expected structure
      const transformedEmployees = employeeData.map((employee) => ({
        _id: employee._id || employee.id,
        id: employee._id || employee.id,
        userId: employee._id || employee.id,
        name: employee.FirstName && employee.LastName 
          ? `${employee.FirstName} ${employee.LastName}`.trim()
          : employee.name || employee.username || employee.email || 'Unknown Employee',
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

      setEmployees(transformedEmployees);
      console.log(`Loaded ${transformedEmployees.length} employees`);
      
      // If no employees found, show a message
      if (transformedEmployees.length === 0) {
        setError('No employees found. Please ensure employees are registered in the system.');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(`Failed to load employees: ${error.message}`);
      setEmployees([]);
    }
  };

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/projects/getAllProjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Projects API response:', result);

      if (result.success && Array.isArray(result.data)) {
        setProjects(result.data);
        console.log(`Loaded ${result.data.length} projects`);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  // Fetch milestones for a specific project
  const fetchMilestonesForProject = async (projectId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!projectId) {
        setMilestones([]);
        return;
      }

      setMilestonesLoading(true);
      
      const response = await fetch(`${API_URL}/millestone/getAllMilestones/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        // If no milestones found for this project, it's okay
        if (response.status === 404) {
          console.log('No milestones found for this project');
          setMilestones([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Milestones API response:', result);
      
      if (result.success && Array.isArray(result.data)) {
        setMilestones(result.data);
        console.log(`Loaded ${result.data.length} milestones for project ${projectId}`);
      } else {
        setMilestones([]);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
      setMilestones([]);
    } finally {
      setMilestonesLoading(false);
    }
  };

  // Fetch task details including attachments
  const fetchTaskDetails = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/task/taskDetails/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Task not found. It may have been deleted.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const task = result.data;

        const formattedTask = {
          title: task.title || '',
          description: task.description || '',
          assignedTo: task.assignedTo
            ? task.assignedTo.map((employee) => employee._id || employee)
            : [],
          deadline: task.deadline ? task.deadline.split('T')[0] : '',
          priority: task.priority || 'Medium',
          status: task.status || 'Pending',
          milestone: task.milestone?._id || task.milestone || '',
          projectId: task.projectId || task.project?._id || '',
        };

        setFormData(formattedTask);

        // Fetch milestones for this project if projectId exists
        if (formattedTask.projectId) {
          await fetchMilestonesForProject(formattedTask.projectId);
        }

        // Set attachments if available
        if (task.attachments && Array.isArray(task.attachments)) {
          setAttachments(task.attachments);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch task');
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      setError(`Failed to load task: ${error.message}`);
      navigate('/create-task');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If project is changed, fetch milestones for the new project
    if (name === 'projectId' && value) {
      fetchMilestonesForProject(value);
      // Clear milestone selection when project changes
      setFormData(prev => ({
        ...prev,
        milestone: ''
      }));
    }
  };

  const handleEmployeeSelect = (e) => {
    // Get all selected options
    const selectedOptions = Array.from(e.target.options)
      .filter((option) => option.selected && option.value)
      .map((option) => option.value);

    setFormData((prev) => ({
      ...prev,
      assignedTo: selectedOptions,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file count
    if (attachments.length + files.length > 5) {
      alert('Maximum 5 attachments allowed per task');
      return;
    }

    // Validate file size (10MB)
    const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Some files exceed 10MB limit');
      return;
    }

    setFileInput(files);
  };

  // Remove attachment
  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Download attachment
  const handleDownloadAttachment = async (taskId, attachmentId, filename) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${API_URL}/task/${taskId}/attachments/${attachmentId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert(`Download failed: ${error.message}`);
    }
  };

  // Preview attachment
  const handlePreviewAttachment = (taskId, attachmentId) => {
    const token = getToken();
    if (!token) return;

    const url = `${API_URL}/task/${taskId}/attachments/${attachmentId}/preview`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // For images and PDFs, open in new tab
    window.open(url, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Please enter a task title');
      }

      if (!formData.deadline) {
        throw new Error('Please select a deadline');
      }

      if (formData.assignedTo.length === 0) {
        throw new Error('Please assign the task to at least one employee');
      }

      if (!formData.projectId && !isEditMode) {
        throw new Error('Please select a project');
      }

      // Prepare data differently for edit vs create
      let payload;
      let url, method;

      if (isEditMode) {
        // For edit mode - use JSON with PUT
        url = `${API_URL}/task/updateTask/${taskId}`;
        method = 'PUT';
        payload = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          deadline: formData.deadline,
          priority: formData.priority,
          status: formData.status,
          milestone: formData.milestone || '',
          projectId: formData.projectId || '',
          assignedTo: formData.assignedTo, // This should be array of employee IDs
        };
      } else {
        // For create mode - use FormData with POST
        url = `${API_URL}/task/createTask`;
        method = 'POST';
        payload = new FormData();
        payload.append('title', formData.title.trim());
        payload.append('description', formData.description.trim());
        payload.append('deadline', formData.deadline);
        payload.append('priority', formData.priority);
        payload.append('status', formData.status);
        payload.append('milestone', formData.milestone || '');
        payload.append('projectId', formData.projectId);

        // Append assigned employees
        formData.assignedTo.forEach((employeeId) => {
          payload.append('assignedTo', employeeId);
        });

        // Append files if any
        if (fileInput) {
          Array.from(fileInput).forEach((file) => {
            payload.append('attachments', file);
          });
        }
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Add Content-Type header only for JSON (edit mode)
      if (isEditMode) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method: method,
        headers: headers,
        credentials: 'include',
        body: isEditMode ? JSON.stringify(payload) : payload,
      });

      const result = await response.json();

      if (result.success) {
        alert(`Task ${isEditMode ? 'updated' : 'created'} successfully!`);

        // If in edit mode, refresh task details
        if (isEditMode) {
          await fetchTaskDetails(taskId);
        }

        navigate('/task-history');
      } else {
        const errorMsg =
          result.message ||
          result.error ||
          `Failed to ${isEditMode ? 'update' : 'create'} task (Status: ${
            response.status
          })`;
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Refresh employees function
  const refreshEmployees = async () => {
    setEmployeesLoading(true);
    await fetchEmployeesByRole();
    setEmployeesLoading(false);
  };

  // Refresh projects function
  const refreshProjects = async () => {
    setProjectsLoading(true);
    await fetchProjects();
    setProjectsLoading(false);
  };

  // Helper to get employee ID from any format
  const getEmployeeId = (employee) => {
    if (!employee) return null;
    return employee._id || employee.id || employee.userId || employee.userid || null;
  };

  // Helper to get employee display name
  const getEmployeeDisplayName = (employee) => {
    if (!employee) return 'Unknown Employee';

    // Use full name if available, otherwise email
    if (employee.FirstName || employee.LastName) {
      return `${employee.FirstName || ''} ${employee.LastName || ''}`.trim();
    }

    return employee.name || employee.email || 'Unnamed Employee';
  };

  // Helper to get file icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.includes('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet'))
      return '📊';
    if (fileType.includes('zip') || fileType.includes('compressed'))
      return '🗜️';
    return '📎';
  };

  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="employee" activeItem="task" />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            ← Back
          </button>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditMode ? 'Edit Task' : 'Assign Tasks'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={refreshEmployees}
                disabled={employeesLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                {employeesLoading ? 'Refreshing...' : 'Refresh Employees'}
              </button>
              <button
                onClick={refreshProjects}
                disabled={projectsLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                {projectsLoading ? 'Refreshing...' : 'Refresh Projects'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter the task title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Project *
                {projectsLoading && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Loading...)
                  </span>
                )}
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                disabled={loading || projectsLoading || (isEditMode && formData.projectId)}
                required={!isEditMode}
              >
                <option value="">Select a Project</option>
                {projectsLoading ? (
                  <option value="" disabled>Loading projects...</option>
                ) : projects.length === 0 ? (
                  <option value="" disabled>No projects available</option>
                ) : (
                  projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))
                )}
              </select>
              {isEditMode && formData.projectId && (
                <p className="text-xs text-gray-500 mt-1">
                  Project cannot be changed for existing tasks
                </p>
              )}
            </div>

            {/* Deadline, Priority, and Milestone Row */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  disabled={loading}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Milestone
                  {milestonesLoading && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Loading...)
                    </span>
                  )}
                </label>
                <select
                  name="milestone"
                  value={formData.milestone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  disabled={loading || milestonesLoading || !formData.projectId}
                >
                  <option value="">No Milestone</option>
                  {!formData.projectId ? (
                    <option value="" disabled>
                      Select a project first
                    </option>
                  ) : milestonesLoading ? (
                    <option value="" disabled>
                      Loading milestones...
                    </option>
                  ) : milestones.length === 0 ? (
                    <option value="" disabled>
                      No milestones available for this project
                    </option>
                  ) : (
                    milestones.map((milestone) => (
                      <option key={milestone._id} value={milestone._id}>
                        {milestone.milestoneName || milestone.name} 
                        {milestone.Status ? ` (${milestone.Status})` : ''}
                        {milestone.Start_Date ? ` - Starts: ${new Date(milestone.Start_Date).toLocaleDateString()}` : ''}
                      </option>
                    ))
                  )}
                </select>
                {formData.projectId && milestones.length === 0 && !milestonesLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    No milestones created for this project yet
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                disabled={loading}
              />
            </div>

            {/* Attachments Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments
                <span className="text-xs text-gray-500 font-normal">
                  (Max 5 files, 10MB each)
                </span>
              </label>

              {/* File Upload */}
              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={
                    loading || uploadingFiles || attachments.length >= 5
                  }
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, Word, Excel, Images, Text
                </p>
              </div>

              {/* Selected Files Preview */}
              {fileInput && fileInput.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    New Files to Upload:
                  </h4>
                  <div className="space-y-2">
                    {Array.from(fileInput).map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileIcon className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = Array.from(fileInput);
                            newFiles.splice(index, 1);
                            setFileInput(newFiles.length > 0 ? newFiles : null);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Attachments */}
              {attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Current Attachments:
                  </h4>
                  <div className="space-y-2">
                    {attachments.map((attachment, index) => (
                      <div
                        key={attachment._id || index}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {getFileIcon(attachment.fileType)}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                              {attachment.originalName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {attachment.fileType} •{' '}
                              {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handlePreviewAttachment(taskId, attachment._id)
                            }
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadAttachment(
                                taskId,
                                attachment._id,
                                attachment.originalName
                              )
                            }
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {isEditMode && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(index)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Assigned To - Now using Employees */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assign to Employees *
                {employeesLoading && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Loading...)
                  </span>
                )}
              </label>
              <select
                name="assignedTo"
                multiple
                onChange={handleEmployeeSelect}
                value={formData.assignedTo}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[120px]"
                disabled={loading || employeesLoading}
                size="5"
              >
                {employeesLoading ? (
                  <option value="" disabled>
                    Loading employees...
                  </option>
                ) : employees.length === 0 ? (
                  <option value="" disabled>
                    No employees available. Please ensure employees are registered in the system.
                  </option>
                ) : (
                  <>
                    <option value="" disabled>
                      -- Select Employees (Hold Ctrl/Cmd for multiple) --
                    </option>
                    {employees.map((employee) => {
                      const employeeId = getEmployeeId(employee);
                      const displayName = getEmployeeDisplayName(employee);
                      const roleText =
                        employee.role === 1
                          ? 'Employee'
                          : employee.role === 2
                          ? 'Manager'
                          : employee.role === 3
                          ? 'Admin'
                          : '';

                      return (
                        <option
                          key={employeeId}
                          value={employeeId}
                          title={`${displayName}${
                            employee.email ? ` (${employee.email})` : ''
                          }${roleText ? ` - ${roleText}` : ''}`}
                        >
                          {displayName}
                          {employee.email ? ` (${employee.email})` : ''}
                          {roleText ? ` [${roleText}]` : ''}
                        </option>
                      );
                    })}
                  </>
                )}
              </select>
              <div className="mt-2 flex flex-col gap-1">
                <p className="text-xs text-gray-500">
                  Hold Ctrl/Cmd to select multiple employees
                </p>
                {formData.assignedTo.length > 0 && (
                  <div className="mt-1">
                    <p className="text-xs text-green-600 font-medium">
                      Selected: {formData.assignedTo.length} employee
                      {formData.assignedTo.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.assignedTo.map((employeeId) => {
                        const employee = employees.find((emp) => getEmployeeId(emp) === employeeId);
                        return employee ? (
                          <span
                            key={employeeId}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {getEmployeeDisplayName(employee)}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  assignedTo: prev.assignedTo.filter(
                                    (id) => id !== employeeId
                                  ),
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-600">
                    {employees.length} employee{employees.length !== 1 ? 's' : ''} available
                  </span>
                  <button
                    type="button"
                    onClick={refreshEmployees}
                    disabled={employeesLoading}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {employeesLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                disabled={loading}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {formData.status === 'In Progress' && (
                <p className="text-xs text-blue-600 mt-1">
                  ⚡ Task is currently in progress (50% complete)
                </p>
              )}
              {formData.status === 'Completed' && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ Task is completed (100% complete)
                </p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/task-history')}
                disabled={loading || uploadingFiles}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  employeesLoading ||
                  employees.length === 0 ||
                  formData.assignedTo.length === 0 ||
                  uploadingFiles ||
                  (!formData.projectId && !isEditMode)
                }
                className="px-8 py-3 bg-[#087990] text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditMode ? 'Updating Task...' : 'Creating Task...'}
                  </>
                ) : (
                  <>
                    {isEditMode ? 'Update Task' : 'Create Task'}
                    {fileInput &&
                      ` (${fileInput.length} file${
                        fileInput.length !== 1 ? 's' : ''
                      })`}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskForm;