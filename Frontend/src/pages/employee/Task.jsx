import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Search,
  RefreshCw,
  Eye,
  Download,
  File,
} from 'lucide-react';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) {
        return [];
      }

      const endpoints = [
        'http://localhost:8090/api/v1/userAuth/getAllUsers',
        'http://localhost:8090/api/v1/user/getAll',
        'http://localhost:8090/api/v1/users',
      ];

      let usersData = [];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              usersData = Array.isArray(result.data) ? result.data : [];
              if (usersData.length > 0) {
                break;
              }
            } else if (result.users) {
              usersData = Array.isArray(result.users) ? result.users : [];
              if (usersData.length > 0) {
                break;
              }
            }
          }
        } catch {
          continue;
        }
      }

      setUsers(usersData);
      return usersData;
    } catch {
      return [];
    }
  };

  const getCurrentUser = () => {
    try {
      // Try localStorage first
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (
            parsedUser &&
            (parsedUser._id || parsedUser.id || parsedUser.userid)
          ) {
            const userId = parsedUser._id || parsedUser.id || parsedUser.userid;

            let userName = 'User';
            if (parsedUser.FirstName && parsedUser.LastName) {
              userName =
                `${parsedUser.FirstName} ${parsedUser.LastName}`.trim();
            } else if (parsedUser.firstName && parsedUser.lastName) {
              userName =
                `${parsedUser.firstName} ${parsedUser.lastName}`.trim();
            } else if (parsedUser.name) {
              userName = parsedUser.name;
            } else if (parsedUser.username) {
              userName = parsedUser.username;
            } else if (parsedUser.email) {
              userName = parsedUser.email.split('@')[0];
            }

            return {
              id: userId,
              _id: userId,
              name: userName,
              email: parsedUser.email || 'user@example.com',
              role: parsedUser.role || 1,
            };
          }
        } catch {
          // Continue to token decoding
        }
      }

      // Get token from cookies
      const token = getToken();
      if (!token) {
        return null;
      }

      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          return null;
        }

        let payload;
        try {
          const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join('')
          );
          payload = JSON.parse(jsonPayload);
        } catch {
          payload = JSON.parse(atob(parts[1]));
        }

        const userId =
          payload.userid ||
          payload.userId ||
          payload._id ||
          payload.id ||
          payload.sub ||
          payload.user?.id ||
          payload.user?._id;
        const userEmail =
          payload.email || payload.user?.email || 'user@example.com';

        let userName = 'User';
        if (payload.FirstName && payload.LastName) {
          userName = `${payload.FirstName} ${payload.LastName}`.trim();
        } else if (payload.firstName && payload.lastName) {
          userName = `${payload.firstName} ${payload.lastName}`.trim();
        } else if (payload.name) {
          userName = payload.name;
        } else if (payload.username) {
          userName = payload.username;
        } else if (userEmail) {
          userName = userEmail.split('@')[0];
        }

        if (!userId) {
          return null;
        }

        return {
          id: userId,
          _id: userId,
          name: userName,
          email: userEmail,
          role: payload.role || payload.user?.role || 1,
        };
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  };

  const transformTasks = (tasksData) => {
    return tasksData.map((task) => {
      let assignees = [];
      if (Array.isArray(task.assignedTo)) {
        assignees = task.assignedTo.map((user) => {
          if (typeof user === 'object' && user !== null && user.email) {
            return user.email;
          }
          if (typeof user === 'string' && user.includes('@')) {
            return user;
          }
          if (typeof user === 'object' && user.name) {
            return user.name;
          }
          if (typeof user === 'object' && (user.firstName || user.lastName)) {
            return `${user.firstName || ''} ${user.lastName || ''}`.trim();
          }
          if (typeof user === 'object' && user._id) {
            const foundUser = users.find((u) => u._id === user._id);
            return foundUser
              ? foundUser.email ||
                  foundUser.name ||
                  `User ${user._id.substring(0, 6)}`
              : `User ${user._id.substring(0, 6)}`;
          }
          if (typeof user === 'string' && !user.includes('@')) {
            const foundUser = users.find((u) => u._id === user);
            return foundUser
              ? foundUser.email ||
                  foundUser.name ||
                  `User ${user.substring(0, 6)}`
              : `User ${user.substring(0, 6)}`;
          }
          return 'Unknown User';
        });
      }

      let milestoneName = 'No Milestone';
      if (task.milestone) {
        if (
          typeof task.milestone === 'object' &&
          task.milestone.milestoneName
        ) {
          milestoneName = task.milestone.milestoneName;
        } else if (typeof task.milestone === 'string') {
          milestoneName = task.milestone;
        }
      }

      const status = (task.status || 'pending').toLowerCase();

      let progress = 0;
      if (status === 'completed') {
        progress = 100;
      } else if (status === 'in progress') {
        progress = 50;
      }

      let formattedDeadline = 'No deadline';
      if (task.deadline) {
        try {
          const date = new Date(task.deadline);
          if (!isNaN(date.getTime())) {
            formattedDeadline = date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error('Error formatting deadline:', e);
        }
      }

      const pdfAttachments = (task.attachments || []).filter(
        (att) =>
          att.fileType?.toLowerCase() === 'application/pdf' ||
          att.originalName?.toLowerCase().endsWith('.pdf') ||
          att.filename?.toLowerCase().endsWith('.pdf')
      );

      return {
        id: task._id,
        _id: task._id,
        title: task.title || 'Untitled Task',
        milestone: milestoneName,
        milestoneId: task.milestone?._id || task.milestone,
        deadline: formattedDeadline,
        priority: (task.priority || 'medium').toLowerCase(),
        status: status,
        assignees: assignees.length > 0 ? assignees : ['Unassigned'],
        assigneesData: task.assignedTo || [],
        description: task.description || 'No description provided',
        attachments: task.attachments || [],
        pdfAttachments: pdfAttachments,
        createdAt: task.createdAt,
        progress: progress,
        originalData: task,
      };
    });
  };

  const fetchUserTasks = async () => {
    try {
      setLoading(true);
      setError('');

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }

      await fetchUsers();

      const response = await fetch(
        'http://localhost:8090/api/v1/task/getAllTasks',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const userEmail = user?.email;
        if (!userEmail) {
          setError('Unable to identify current user');
          return;
        }

        const userTasks = result.data.filter((task) => {
          if (!task.assignedTo || !Array.isArray(task.assignedTo)) {
            return false;
          }

          return task.assignedTo.some((assigned) => {
            if (typeof assigned === 'object' && assigned.email === userEmail) {
              return true;
            }
            if (typeof assigned === 'string' && assigned === userEmail) {
              return true;
            }
            if (typeof assigned === 'object' && assigned._id === user?._id) {
              return true;
            }
            if (typeof assigned === 'string' && assigned === user?._id) {
              return true;
            }
            return false;
          });
        });

        const transformedTasks = transformTasks(userTasks);
        setTasks(transformedTasks);
      } else {
        setError(result.message || 'No tasks found');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const handleMarkAsDone = async (taskId) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch(
        `http://localhost:8090/api/v1/task/updateTaskStatus/${taskId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'Completed' }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          fetchUserTasks();
        } else {
          throw new Error(result.message || 'Failed to update task');
        }
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task: ' + error.message);
    }
  };

  const handleInProgress = async (taskId) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch(
        `http://localhost:8090/api/v1/task/updateTaskStatus/${taskId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'In Progress' }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorText.substring(0, 100)}`
        );
      }

      const result = await response.json();
      if (result.success) {
        fetchUserTasks();
      } else {
        throw new Error(result.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleViewTask = (taskId, e) => {
    if (e) {
      e.stopPropagation();
    }
    // Fixed: Changed from /task-details to /tasks
    navigate(`/task-details/${taskId}`);
  };

  const handleViewPDF = (task, pdfAttachment, e) => {
    if (e) {
      e.stopPropagation();
    }

    if (pdfAttachment) {
      const previewUrl = `http://localhost:8090/api/v1/task/${task._id}/attachments/${pdfAttachment._id}/preview`;
      setPdfUrl(previewUrl);
      setSelectedTask(task);
      setShowPdfModal(true);
    }
  };

  const handleDownloadPDF = async (task, pdfAttachment, e) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      const token = getToken();
      if (!token) {
        alert('Please login again');
        return;
      }

      const downloadUrl = `http://localhost:8090/api/v1/task/${task._id}/attachments/${pdfAttachment._id}/download`;

      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download =
          pdfAttachment.originalName || `Task-${task?.title || 'document'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'No deadline') return 'No deadline';

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string received:', dateString);
        return dateString;
      }

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string as fallback
    }
  };

  const isOverdue = (deadline) => {
    if (!deadline || deadline === 'No deadline') return false;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadlineDate = new Date(deadline);
      return deadlineDate < today;
    } catch (error) {
      // Log the error for debugging
      console.error('Error checking if deadline is overdue:', error);
      console.error('Deadline value that caused error:', deadline);
      return false;
    }
  };

  const getPriorityColor = (priority) => {
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
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'in progress':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  // ADDED THIS FUNCTION FOR YELLOW ACCENT LINE
  const getAccentColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.milestone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignees.some((assignee) =>
        assignee.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const closePdfModal = () => {
    setShowPdfModal(false);
    setPdfUrl(null);
    setSelectedTask(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar role="employee" activeItem="task" />
        <main className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your tasks...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar role="employee" activeItem="task" />
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Tasks</h1>
              {currentUser && (
                <p className="text-gray-600 mt-1">
                  Welcome back, {currentUser.name}! You have {tasks.length} task
                  {tasks.length !== 1 ? 's' : ''} assigned.
                </p>
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
                onClick={() => fetchUserTasks()}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Refresh tasks"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-medium">Error loading tasks:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Task Rows Container */}
          <div className="max-w-7xl mx-auto">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'No matching tasks found' : 'No tasks assigned'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : "You don't have any tasks assigned to you yet."}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => fetchUserTasks()}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center gap-2 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id || task.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex">
                      {/* ADDED: Left Accent Column with Yellow Line */}
                      <div className={`w-2 ${getAccentColor(task.priority)}`} />

                      {/* Main Content */}
                      <div className="flex-1 p-5">
                        {/* Task Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {task.title}
                              {task.pdfAttachments &&
                                task.pdfAttachments.length > 0 && (
                                  <button
                                    onClick={(e) =>
                                      handleViewPDF(
                                        task,
                                        task.pdfAttachments[0],
                                        e
                                      )
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
                              Milestone: {task.milestone}
                            </div>
                          </div>
                        </div>

                        {/* Task Metadata */}
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
                              {task.priority.charAt(0).toUpperCase() +
                                task.priority.slice(1)}
                            </span>
                          </div>
                          <div>
                            <strong>Status:</strong>{' '}
                            <span
                              className={`font-semibold ${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status.charAt(0).toUpperCase() +
                                task.status.slice(1)}
                            </span>
                          </div>
                          <div>
                            <strong>Progress:</strong>{' '}
                            <span className="font-semibold text-blue-600">
                              {task.progress}%
                            </span>
                          </div>
                          <div>
                            <strong>Assignees:</strong>{' '}
                            <span className="text-gray-800">
                              {task.assignees.join(', ')}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        {task.description && (
                          <div className="mt-3 text-sm text-gray-600">
                            {task.description.length > 150 ? (
                              <>
                                {task.description.substring(0, 150)}...
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewTask(task._id || task.id, e);
                                  }}
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

                        {/* PDF Attachments */}
                        {task.pdfAttachments &&
                          task.pdfAttachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {task.pdfAttachments.map((pdf, index) => (
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
                                      onClick={(e) =>
                                        handleViewPDF(task, pdf, e)
                                      }
                                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                                      title="View PDF"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) =>
                                        handleDownloadPDF(task, pdf, e)
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
                      </div>

                      {/* Action Buttons Column */}
                      <div className="p-5 border-l border-gray-200 flex flex-col justify-center items-center gap-3 min-w-[200px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInProgress(task._id || task.id);
                          }}
                          disabled={
                            task.status === 'completed' ||
                            task.status === 'in progress'
                          }
                          className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border-2 border-green-600 ${
                            task.status === 'in progress'
                              ? 'text-green-600 bg-green-50 cursor-default'
                              : 'text-green-600 bg-white hover:bg-green-600 hover:text-white'
                          } transition-all duration-300 font-semibold`}
                        >
                          <Clock className="w-4 h-4" />
                          {task.status === 'in progress'
                            ? 'In Progress'
                            : 'Mark as In Progress'}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsDone(task._id || task.id);
                          }}
                          disabled={task.status === 'completed'}
                          className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border-2 border-red-600 ${
                            task.status === 'completed'
                              ? 'text-red-600 bg-red-50 cursor-default'
                              : 'text-red-600 bg-white hover:bg-red-600 hover:text-white'
                          } transition-all duration-300 font-semibold`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          {task.status === 'completed'
                            ? 'Completed'
                            : 'Mark as Done'}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTask(task._id || task.id, e);
                          }}
                          className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 font-semibold border border-gray-300"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PDF Modal */}
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

export default Task;