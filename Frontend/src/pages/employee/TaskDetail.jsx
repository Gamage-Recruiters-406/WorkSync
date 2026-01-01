import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfAttachment, setPdfAttachment] = useState(null);
  const [allAttachments, setAllAttachments] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

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

  // Get current user from token OR localStorage
  const getCurrentUser = () => {
    try {
      // Try localStorage first
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          // Get user ID from various possible fields
          let userId = parsedUser._id || parsedUser.id || parsedUser.userid;

          // If userId is an object, get the string value
          if (userId && typeof userId === 'object') {
            userId = userId._id || userId.id || userId.userid;
          }

          if (userId) {
            return {
              id: userId,
              _id: userId,
              name: parsedUser.FirstName
                ? `${parsedUser.FirstName} ${parsedUser.LastName || ''}`.trim()
                : parsedUser.name || parsedUser.username || 'User',
              email: parsedUser.email || 'user@example.com',
              role: parsedUser.role || 1, // Default to employee role (1)
            };
          }
        } catch (e) {
          return null;
        }
      }

      // Get token from cookies
      const token = getToken();
      if (!token) {
        return null;
      }

      try {
        // Decode JWT token
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
        } catch (decodeError) {
          payload = JSON.parse(atob(parts[1]));
        }

        // Extract user ID from various possible fields
        let userId =
          payload.userid ||
          payload.userId ||
          payload._id ||
          payload.id ||
          payload.sub ||
          payload.user?.id ||
          payload.user?._id;

        // If userId is an object, get the string value
        if (userId && typeof userId === 'object') {
          userId = userId._id || userId.id || userId.userid;
        }

        const userName =
          payload.name ||
          payload.username ||
          payload.FirstName ||
          payload.user?.name ||
          payload.user?.username ||
          'User';

        if (!userId) {
          return null;
        }

        return {
          id: userId,
          _id: userId,
          name: userName,
          email: payload.email || payload.user?.email || 'user@example.com',
          role: payload.role || payload.user?.role || 1,
        };
      } catch (decodeError) {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  // Check authentication and initialize current user
  useEffect(() => {
    const user = getCurrentUser();
    const token = getToken();

    if (!token || !user) {
      alert('Your session has expired. Please login again.');
      navigate('/login');
      return;
    }

    setCurrentUser(user);

    // Fetch task details if ID exists
    if (id) {
      fetchTaskDetail();
    } else {
      setError('No task ID provided');
      setLoading(false);
    }
  }, [id, navigate]);

  // Enhanced PDF Viewer Component
  const PDFViewer = ({ pdfUrl, attachment, onDownload }) => {
    const [viewerLoading, setViewerLoading] = useState(true);
    const [viewerError, setViewerError] = useState(null);

    const handleLoad = () => {
      setViewerLoading(false);
    };

    const handleError = () => {
      setViewerError(
        'Unable to display PDF preview. Try downloading the file.'
      );
      setViewerLoading(false);
    };

    return (
      <div className="relative h-[500px] border-2 border-gray-200 rounded-lg overflow-hidden">
        {/* Loading overlay */}
        {viewerLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600">Loading PDF preview...</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {viewerError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 z-10 p-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-800 mb-1">
              Preview Unavailable
            </h3>
            <p className="text-gray-600 text-center mb-4">{viewerError}</p>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <i className="fas fa-download"></i>
              Download PDF
            </button>
          </div>
        )}

        {/* PDF Object tag - Primary method */}
        <object
          data={pdfUrl}
          type="application/pdf"
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
          title={`PDF Preview: ${attachment?.originalName || 'Document'}`}
        >
          {/* Fallback content if object tag fails */}
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-file-pdf text-blue-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              PDF Preview Not Supported
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Your browser doesn't support embedded PDF preview. Please download
              the file to view it.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <i className="fas fa-download"></i>
                Download PDF
              </button>
              <button
                onClick={() => window.open(pdfUrl, '_blank')}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <i className="fas fa-external-link-alt"></i>
                Open in New Tab
              </button>
            </div>
          </div>
        </object>

        {/* PDF Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-95 rounded-lg shadow-lg border border-gray-200 p-2 flex gap-2">
          <button
            onClick={onDownload}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
            title="Download PDF"
          >
            <i className="fas fa-download"></i>
            Download
          </button>
          <button
            onClick={() => window.open(pdfUrl, '_blank')}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm font-medium"
            title="Open in new tab"
          >
            <i className="fas fa-external-link-alt"></i>
            Open Tab
          </button>
          {attachment && (
            <div className="px-3 py-2 text-xs text-gray-500 border-l border-gray-300 ml-2 pl-2">
              {formatFileSize(attachment.fileSize)}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Fetch task details from API
  const fetchTaskDetail = async () => {
    try {
      setLoading(true);
      setError('');
      setPdfLoading(true);
      setPdfError('');
      setPdfUrl(null);
      setPdfAttachment(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const user = getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }

      // First, try to fetch the specific task directly
      try {
        const response = await fetch(
          `http://localhost:8090/api/v1/task/taskDetails/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        if (response.ok) {
          const result = await response.json();

          if (result.success && result.data) {
            const formattedTask = transformTask(result.data);
            setTask(formattedTask);

            // Process attachments from backend response
            if (
              result.data.attachments &&
              Array.isArray(result.data.attachments)
            ) {
              const attachments = result.data.attachments;
              setAllAttachments(attachments);

              // Find PDF attachments
              const pdfAttachments = attachments.filter((att) => {
                const isPDF =
                  att.fileType?.toLowerCase() === 'application/pdf' ||
                  att.originalName?.toLowerCase().endsWith('.pdf') ||
                  att.filename?.toLowerCase().endsWith('.pdf');
                return isPDF;
              });

              if (pdfAttachments.length > 0) {
                const pdfAttachment = pdfAttachments[0];

                setPdfAttachment(pdfAttachment);

                // Always try preview URL first
                const previewUrl = `http://localhost:8090/api/v1/task/${id}/attachments/${pdfAttachment._id}/preview`;
                setPdfUrl(previewUrl); // Set it directly

                // Let the PDFViewer component handle errors
                setPdfError('');
              } else {
                setPdfError('No PDF documents attached to this task');
              }
            } else {
              setPdfError('No documents attached to this task');
            }

            setPdfLoading(false);
            setLoading(false); // Add this line
            return;
          } else {
            // If direct fetch returns but no success, use fallback
            await fetchAllTasksAndFindTask(user);
          }
        } else {
          // If direct fetch fails, use fallback
          await fetchAllTasksAndFindTask(user);
        }
      } catch (directError) {
        console.error('Direct fetch error:', directError);
        // If direct fetch throws an error, use fallback
        await fetchAllTasksAndFindTask(user);
      }
    } catch (error) {
      console.error('Error in fetchTaskDetail:', error);
      setError(error.message || 'Failed to load task details');
      setPdfError('Failed to load task details');
      setPdfLoading(false);
      setLoading(false);
    }
  };
  // Test if a URL is accessible
  const testUrlAccessibility = async (url) => {
    try {
      const token = getToken();
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error testing URL accessibility:', error);
      return false;
    }
  };

  // Fetch all tasks and find the specific task
  // Fetch all tasks and find the specific task
  const fetchAllTasksAndFindTask = async (user) => {
    try {
      const token = getToken();
      if (!token) {
        setError('No authentication token');
        setLoading(false);
        return;
      }

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
        setError(`Failed to fetch tasks: ${response.status}`);
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (!result.success || !result.data || !Array.isArray(result.data)) {
        setError('No tasks found for this user');
        setLoading(false);
        return;
      }

      const tasks = result.data;

      // Find the specific task by ID
      const foundTask = tasks.find((task) => task._id === id);

      if (!foundTask) {
        setError(`Task with ID ${id} not found in your tasks`);
        setLoading(false);
        return;
      }

      const formattedTask = transformTask(foundTask);
      setTask(formattedTask);

      // Fetch attachments separately
      await fetchTaskAttachments(id);
    } catch (error) {
      console.error('Error in fetchAllTasksAndFindTask:', error);
      setError(error.message || 'Failed to load task from tasks list');
      setLoading(false);
    }
  };
  // Fetch attachments separately
  const fetchTaskAttachments = async (taskId) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `http://localhost:8090/api/v1/task/taskDetails/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.attachments) {
          const attachments = result.data.attachments;
          setAllAttachments(attachments);

          // Find PDF attachments
          const pdfAttachments = attachments.filter(
            (att) =>
              att.fileType?.toLowerCase() === 'application/pdf' ||
              att.originalName?.toLowerCase().endsWith('.pdf') ||
              att.filename?.toLowerCase().endsWith('.pdf')
          );

          if (pdfAttachments.length > 0) {
            const pdfAttachment = pdfAttachments[0];
            setPdfAttachment(pdfAttachment);

            // Generate PDF preview URL
            const pdfUrl = `http://localhost:8090/api/v1/task/${taskId}/attachments/${pdfAttachment._id}/preview`;

            // Test URL
            const isAccessible = await testUrlAccessibility(pdfUrl);
            if (isAccessible) {
              setPdfUrl(pdfUrl);
            } else {
              // Fallback to download URL if preview doesn't work
              const downloadUrl = `http://localhost:8090/api/v1/task/${taskId}/attachments/${pdfAttachment._id}/download`;
              setPdfUrl(downloadUrl);
            }

            setPdfError('');
          } else {
            setPdfError('No PDF documents attached to this task');
          }
        }
      }
    } catch (error) {
      setPdfError('Failed to load attachments');
      console.error('Error in fetchTaskAttachments:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  // Transform single task to UI format
  const transformTask = (taskData) => {
    let assignees = [];
    if (Array.isArray(taskData.assignedTo)) {
      assignees = taskData.assignedTo.map((user) => {
        if (typeof user === 'object' && user !== null) {
          return {
            id: user._id || user.id || user.userId,
            _id: user._id || user.id || user.userId,
            name:
              user.name ||
              (user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`.trim()
                : '') ||
              (user.FirstName && user.LastName
                ? `${user.FirstName} ${user.LastName}`.trim()
                : '') ||
              user.username ||
              user.email ||
              'Unknown User',
            email: user.email || 'No email',
            avatar: (
              user.name ||
              user.username ||
              user.firstName ||
              user.FirstName ||
              'U'
            )
              .charAt(0)
              .toUpperCase(),
          };
        }

        if (typeof user === 'string') {
          return {
            id: user,
            _id: user,
            name: `User ${user.substring(0, 6)}`,
            email: 'No email',
            avatar: 'U',
          };
        }

        return {
          id: 'unknown',
          _id: 'unknown',
          name: 'Unknown User',
          email: 'No email',
          avatar: 'U',
        };
      });
    }

    let milestone = 'No Milestone';
    if (taskData.milestone) {
      if (typeof taskData.milestone === 'object') {
        milestone =
          taskData.milestone.milestoneName ||
          taskData.milestone.name ||
          `M-${taskData.milestone._id?.slice(-4)}`;
      } else {
        milestone = taskData.milestone;
      }
    }

    const status = (taskData.status || 'pending').toLowerCase();
    let progress = 0;
    if (status === 'completed' || taskData.status === 'Completed') {
      progress = 100;
    } else if (
      status === 'in progress' ||
      status === 'in-progress' ||
      taskData.status === 'In Progress'
    ) {
      progress = 50;
    }

    let createdBy = 'Unknown';
    if (taskData.createdBy) {
      if (typeof taskData.createdBy === 'object') {
        createdBy =
          taskData.createdBy.name ||
          (taskData.createdBy.firstName && taskData.createdBy.lastName
            ? `${taskData.createdBy.firstName} ${taskData.createdBy.lastName}`.trim()
            : taskData.createdBy.username ||
              taskData.createdBy.email ||
              'Unknown');
      } else {
        createdBy = taskData.createdBy;
      }
    }

    return {
      id: taskData._id || taskData.id,
      _id: taskData._id || taskData.id,
      title: taskData.title || 'Untitled Task',
      milestone: milestone,
      deadline: taskData.deadline
        ? new Date(taskData.deadline).toISOString().split('T')[0]
        : 'No deadline',
      deadlineTime: taskData.deadline
        ? new Date(taskData.deadline).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : null,
      priority: (taskData.priority || 'medium').toLowerCase(),
      status: status,
      assignees:
        assignees.length > 0
          ? assignees
          : [{ id: 'unassigned', name: 'Unassigned', email: '', avatar: 'U' }],
      attachments: taskData.attachments || [],
      description: taskData.description || 'No description provided',
      progress: progress,
      createdAt: taskData.createdAt
        ? new Date(taskData.createdAt).toLocaleDateString()
        : 'Unknown',
      createdBy: createdBy,
      tags: taskData.tags || [],
      estimatedHours: taskData.estimatedHours || 0,
      actualHours: taskData.actualHours || 0,
      dependencies: taskData.dependencies || [],
    };
  };

  // Update task status
  const handleUpdateStatus = async (newStatus) => {
    if (readOnly) {
      alert('You can only update status for tasks assigned to you.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch(
        `http://localhost:8090/api/v1/task/updateTaskStatus/${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert(`Task marked as ${newStatus}!`);
          setTask((prev) => ({
            ...prev,
            status: newStatus.toLowerCase(),
            progress:
              newStatus === 'Completed'
                ? 100
                : newStatus === 'In Progress'
                ? 50
                : 0,
          }));
        } else {
          throw new Error(result.message || 'Failed to update task status');
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to update status:', errorText);


        setTask((prev) => ({
          ...prev,
          status: newStatus.toLowerCase(),
          progress:
            newStatus === 'Completed'
              ? 100
              : newStatus === 'In Progress'
              ? 50
              : 0,
        }));

        alert(`Task marked as ${newStatus} (local update)!`);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setTask((prev) => ({
        ...prev,
        status: newStatus.toLowerCase(),
        progress:
          newStatus === 'Completed'
            ? 100
            : newStatus === 'In Progress'
            ? 50
            : 0,
      }));

      alert(`Task marked as ${newStatus} (local update due to error)!`);
    }
  };

  // Handle PDF download
  const handleDownloadPdf = async () => {
    if (!pdfAttachment) {
      alert('No PDF available for download');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('Please login again');
        return;
      }

      const downloadUrl = `http://localhost:8090/api/v1/task/${id}/attachments/${pdfAttachment._id}/download`;

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

  // Handle attachment download
  const handleDownloadAttachment = async (attachment) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Please login again');
        return;
      }

      const downloadUrl = `http://localhost:8090/api/v1/task/${id}/attachments/${attachment._id}/download`;

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
          attachment.originalName || `attachment-${attachment._id}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download attachment');
      }
    } catch (error) {
      alert('Error downloading attachment');
      console.error('Error downloading attachment:', error);
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'border-red-500 text-red-600';
      case 'medium':
        return 'border-yellow-500 text-yellow-600';
      case 'low':
        return 'border-green-500 text-green-600';
      default:
        return 'border-gray-500 text-gray-600';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'No deadline') return 'No deadline';

    try {
      const date = new Date(dateString);
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
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar role={currentUser?.role || 'employee'} activeItem="task" />
        <main className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading task details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="flex h-screen">
        <Sidebar role={currentUser?.role || 'employee'} activeItem="task" />
        <main className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Task Not Found
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/tasks')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <i className="fas fa-arrow-left"></i>
                Back to Tasks
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={currentUser?.role || 'employee'} activeItem="task" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Back button and title */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/tasks')}
              className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Tasks
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Task: {task?.title || 'Untitled Task'}
            </h1>

            {/* Task metadata */}
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <i className="fas fa-flag text-gray-400"></i>
                <span>
                  Milestone:{' '}
                  <strong className="text-gray-800">
                    {task?.milestone || 'No Milestone'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <i className="far fa-calendar-alt text-gray-400"></i>
                <span>
                  Created:{' '}
                  <strong className="text-gray-800">{task?.createdAt}</strong>
                </span>
              </div>
              <div
                className={`border px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                  task?.priority || 'medium'
                )}`}
              >
                {task?.priority?.charAt(0).toUpperCase() +
                  task?.priority?.slice(1) || 'Medium'}{' '}
                Priority
              </div>
            </div>
          </div>

          {/* Warning for read-only access */}
          {readOnly && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
              <div className="flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                <p className="font-medium">Read-only Access</p>
              </div>
              <p className="text-sm mt-1">
                You are viewing this task in read-only mode because you are not
                assigned to it.
              </p>
            </div>
          )}

          {/* Error message if any */}
          {error && !readOnly && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Main Content - Task Details + PDF Preview */}
          {task && (
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-8">
              <div className="flex gap-8">
                {/* LEFT: Task Details Section */}
                <div className="flex-1 border-2 border-gray-200 rounded-lg p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Task Details
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Task:</h3>
                      <p className="text-gray-900 text-lg font-medium">
                        {task.title}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">
                        Objective:
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-line">
                          {task.description || 'No description provided'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-700 mb-1">
                          Deadline:
                        </h3>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-calendar text-gray-500"></i>
                          <span
                            className={`text-lg font-semibold ${
                              task.deadline &&
                              task.deadline !== 'No deadline' &&
                              new Date(task.deadline) < new Date()
                                ? 'text-red-600'
                                : 'text-gray-800'
                            }`}
                          >
                            {formatDate(task.deadline)}
                          </span>
                          {task.deadline &&
                            task.deadline !== 'No deadline' &&
                            new Date(task.deadline) < new Date() && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                Overdue
                              </span>
                            )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-700 mb-1">
                          Priority:
                        </h3>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              task.priority === 'high'
                                ? 'bg-red-500'
                                : task.priority === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                          ></div>
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">
                        Assignees:
                      </h3>
                      <div className="space-y-2">
                        {task.assignees.map((assignee, index) => (
                          <div
                            key={assignee.id || index}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                          >
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                              {assignee.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {assignee.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {assignee.email}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">
                        Status:
                      </h3>
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'in progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {task.status?.charAt(0).toUpperCase() +
                            task.status?.slice(1)}
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            task.status === 'completed'
                              ? 'bg-green-500'
                              : task.status === 'in progress'
                              ? 'bg-blue-500'
                              : 'bg-gray-400'
                          }`}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">
                        Progress:
                      </h3>
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>0%</span>
                          <span className="font-medium">
                            {task.progress}% Complete
                          </span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* All Attachments List */}
                  {allAttachments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="font-medium text-gray-700 mb-2">
                        All Attachments ({allAttachments.length}):
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {allAttachments.map((attachment) => (
                          <div
                            key={attachment._id}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                {attachment.fileType?.includes('pdf') ? (
                                  <i className="fas fa-file-pdf text-red-500 text-xl"></i>
                                ) : attachment.fileType?.includes('word') ||
                                  attachment.originalName?.endsWith('.docx') ||
                                  attachment.originalName?.endsWith('.doc') ? (
                                  <i className="fas fa-file-word text-blue-500 text-xl"></i>
                                ) : attachment.fileType?.includes('image') ? (
                                  <i className="fas fa-file-image text-green-500 text-xl"></i>
                                ) : (
                                  <i className="fas fa-file text-gray-500 text-xl"></i>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">
                                  {attachment.originalName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(attachment.fileSize)} •{' '}
                                  {attachment.fileType || 'Unknown type'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleDownloadAttachment(attachment)
                              }
                              className="ml-2 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Download"
                            >
                              <i className="fas fa-download"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT: PDF Preview Section */}
                <div className="flex-1">
                  <div className="border-2 border-gray-200 rounded-lg p-4 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-file-pdf text-red-500"></i>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {pdfAttachment
                              ? pdfAttachment.originalName
                              : 'Document Preview'}
                          </h3>
                          {pdfAttachment && (
                            <p className="text-sm text-gray-500">
                              {formatFileSize(pdfAttachment.fileSize)} • PDF
                              Document
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Download PDF Button - ADDED HERE */}
                      {pdfAttachment && (
                        <button
                          onClick={handleDownloadPdf}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors duration-200"
                          title="Download PDF"
                        >
                          <i className="fas fa-download"></i>
                          Download PDF
                        </button>
                      )}
                    </div>

                    {pdfLoading ? (
                      <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                          <p className="text-gray-600">
                            Loading PDF document...
                          </p>
                        </div>
                      </div>
                    ) : pdfUrl && pdfAttachment ? (
                      <PDFViewer
                        pdfUrl={pdfUrl}
                        attachment={pdfAttachment}
                        onDownload={handleDownloadPdf}
                      />
                    ) : pdfError ? (
                      <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <i className="fas fa-file-pdf text-4xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                          No PDF Document
                        </h3>
                        <p className="text-gray-600 text-center mb-6 max-w-md">
                          {pdfError}
                        </p>
                        {/* Download button for error state */}
                        {pdfAttachment && (
                          <button
                            onClick={handleDownloadPdf}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                          >
                            <i className="fas fa-download"></i>
                            Download PDF
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <i className="fas fa-file-pdf text-4xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                          No Document Attached
                        </h3>
                        <p className="text-gray-600 text-center mb-6 max-w-md">
                          This task doesn't have any attached PDF documents.
                        </p>
                      </div>
                    )}

                    {pdfError && !pdfLoading && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700">
                          <i className="fas fa-exclamation-circle"></i>
                          <p className="font-medium">Document Error</p>
                        </div>
                        <p className="text-sm text-red-600 mt-1">{pdfError}</p>
                        {/* Download button for error message */}
                        {pdfAttachment && (
                          <button
                            onClick={handleDownloadPdf}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                          >
                            <i className="fas fa-download"></i>
                            Download PDF
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => handleUpdateStatus('In Progress')}
              disabled={readOnly || task?.status === 'in progress'}
              className={`px-6 py-3 rounded-lg font-semibold border-2 flex items-center gap-2 ${
                readOnly || task?.status === 'in progress'
                  ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400'
                  : 'border-green-500 text-green-600 hover:bg-green-50'
              }`}
            >
              <i className="fas fa-play"></i>
              {task?.status === 'in progress'
                ? 'In Progress'
                : 'Mark as In Progress'}
            </button>

            <button
              onClick={() => handleUpdateStatus('Completed')}
              disabled={readOnly || task?.status === 'completed'}
              className={`px-6 py-3 rounded-lg font-semibold border-2 flex items-center gap-2 ${
                readOnly || task?.status === 'completed'
                  ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400'
                  : 'border-red-500 text-red-600 hover:bg-red-50'
              }`}
            >
              <i className="fas fa-check"></i>
              {task?.status === 'completed' ? 'Completed' : 'Mark as Completed'}
            </button>

            {!readOnly && (
              <button
                onClick={() => navigate(`/edit-task/${id}`)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2"
              >
                <i className="fas fa-edit"></i>
                Edit Task
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetail;
