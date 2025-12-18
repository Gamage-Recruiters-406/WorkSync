import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, FileText, Flag, Folder, Upload } from 'lucide-react';

// Define API base URL
const API_URL = 'http://localhost:8090/api/v1';

const CreateTaskForm = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: [],
    deadline: '',
    priority: 'Medium',
    status: 'Pending',
    milestoneId: '',
    attachment: null,
  });

  const [users, setUsers] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');

  // Get token from cookies
  const getToken = () => {
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
  };

  // Fetch users, milestones, and task data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([fetchUsers(), fetchMilestones()]);

        if (taskId) {
          setIsEditMode(true);
          await fetchTask(taskId);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to load initial data. Please refresh the page.');
      }
    };

    initializeData();
  }, [taskId]);

  // Fetch users
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
      } else {
        throw new Error('Invalid response structure from users API');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Failed to load users: ${error.message}`);
      setUsers([]);
    }
  };

  // Fetch milestones
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
      } else {
        throw new Error('Invalid response structure from milestones API');
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
      setError(`Failed to load milestones: ${error.message}`);
      setMilestones([]);
    }
  };

  const fetchTask = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/task/${id}`, {
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
        const task = result.data;

        const formattedTask = {
          title: task.title || '',
          description: task.description || '',
          assignedTo: task.assignedTo
            ? task.assignedTo.map((user) => user._id || user)
            : [],
          deadline: task.deadline ? task.deadline.split('T')[0] : '',
          priority: task.priority || 'Medium',
          status: task.status || 'Pending',
          milestoneId: task.milestoneId
            ? task.milestoneId._id || task.milestoneId
            : '',
          attachment: null,
        };

        setFormData(formattedTask);
      } else {
        throw new Error(result.message || 'Failed to fetch task');
      }
    } catch (error) {
      console.error('Error fetching task:', error);
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
  };

  const handleUserSelect = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({
      ...prev,
      assignedTo: selectedOptions,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      attachment: e.target.files[0],
    }));
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

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('deadline', formData.deadline);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('status', formData.status);

      if (formData.assignedTo.length === 0) {
        throw new Error('Please assign the task to at least one user');
      }

      formData.assignedTo.forEach((userId) => {
        formDataToSend.append('assignedTo', userId);
      });

      if (formData.milestoneId && formData.milestoneId.trim() !== '') {
        formDataToSend.append('milestoneId', formData.milestoneId);
      }

      if (formData.attachment) {
        formDataToSend.append('attachment', formData.attachment);
      }

      let url, method;
      if (isEditMode) {
        url = `${API_URL}/task/${taskId}`;
        method = 'PUT';
      } else {
        url = `${API_URL}/task/createTask`;
        method = 'POST';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        alert(`Task ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate('/task-history');
      } else {
        throw new Error(
          result.message || `Failed to ${isEditMode ? 'update' : 'create'} task`
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      
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
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Assign Tasks</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Task Title
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

            {/* Deadline and Priority Row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
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
                placeholder="Enter your description"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                disabled={loading}
              />
            </div>

            {/* Assigned To and Attachments Row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Assigned To
                </label>
                <select
                  name="assignedTo"
                  multiple
                  onChange={handleUserSelect}
                  value={formData.assignedTo}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[120px]"
                  disabled={loading || users.length === 0}
                >
                  {users.length === 0 ? (
                    <option value="" disabled>
                      Loading users...
                    </option>
                  ) : (
                    <>
                      <option value="">Select Users</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email}){' '}
                          {user.departmentID
                            ? `- Dept: ${user.departmentID}`
                            : ''}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Hold Ctrl/Cmd to select multiple users
                </p>
                {users.length === 0 && !loading && (
                  <p className="text-xs text-red-500 mt-2">
                    No users available. Please check your connection or contact
                    admin.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                  <input
                    type="file"
                    name="attachment"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={loading}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
                {formData.attachment && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {formData.attachment.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, attachment: null }))
                      }
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Milestone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Milestone
              </label>
              <select
                name="milestoneId"
                value={formData.milestoneId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                disabled={loading || milestones.length === 0}
              >
                {milestones.length === 0 ? (
                  <option value="" disabled>
                    Loading milestones...
                  </option>
                ) : (
                  <>
                    <option value="">Select Milestone (Optional)</option>
                    {milestones.map((milestone) => (
                      <option key={milestone._id} value={milestone._id}>
                        {milestone.milestoneName}
                        {milestone.Description
                          ? ` - ${milestone.Description}`
                          : ''}
                        {milestone.Start_Date
                          ? ` (${new Date(
                              milestone.Start_Date
                            ).toLocaleDateString()}`
                          : ''}
                        {milestone.End_Date
                          ? ` to ${new Date(
                              milestone.End_Date
                            ).toLocaleDateString()})`
                          : ''}
                        {milestone.Status ? ` - ${milestone.Status}` : ''}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {milestones.length === 0 && !loading && (
                <p className="text-xs text-gray-500 mt-2">
                  No milestones available. You can create a task without a
                  milestone.
                </p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/task-history')}
                disabled={loading}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
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
                  <>{isEditMode ? 'Update Task' : 'Create Task'}</>
                )}
              </button>
              <button
                onClick={() => navigate('/task-history')}
                className="px-4 py-2 bg-[#087990] text-white rounded"
              >
                Go to Task History
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskForm;
