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
  History,
} from 'lucide-react';
import { taskApi, getCurrentUserInfo, taskTransformers } from '../../services/taskApi';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get current user
      const user = await getCurrentUserInfo();
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      }

      // Fetch user tasks
      const tasksData = await taskApi.getUserTasks(user?.email, user?.id);
      setTasks(taskTransformers.transformTasks(tasksData));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      
      // Update local state immediately
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status: newStatus.toLowerCase(),
                progress:
                  newStatus.toLowerCase() === 'completed'
                    ? 100
                    : newStatus.toLowerCase() === 'in progress'
                    ? 50
                    : 0,
              }
            : task
        )
      );
      
      // Refresh tasks after a short delay
      setTimeout(() => fetchUserTasks(), 500);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task: ' + error.message);
      fetchUserTasks(); // Refresh on error
    }
  };

  const getStatusButtonConfig = (currentStatus) => {
    const status = currentStatus.toLowerCase();

    if (status === 'pending') {
      return {
        label: 'In Progress',
        nextStatus: 'In Progress',
        color: 'green',
        icon: <Clock className="w-4 h-4" />,
      };
    } else if (status === 'in progress') {
      return {
        label: 'Mark as Done',
        nextStatus: 'Completed',
        color: 'red',
        icon: <CheckCircle className="w-4 h-4" />,
      };
    } else if (status === 'completed') {
      return {
        label: 'Reopen Task',
        nextStatus: 'Pending',
        color: 'blue',
        icon: <Clock className="w-4 h-4" />,
      };
    }

    return {
      label: 'In Progress',
      nextStatus: 'In Progress',
      color: 'green',
      icon: <Clock className="w-4 h-4" />,
    };
  };

  const getButtonClasses = (color) => {
    return taskTransformers.getButtonClasses(color);
  };

  const handleViewTask = (taskId, e) => {
    if (e) e.stopPropagation();
    navigate(`/task-details/${taskId}`);
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

  const handleDownloadPDF = async (task, pdfAttachment, e) => {
    if (e) e.stopPropagation();
    try {
      const filename = pdfAttachment.originalName || `Task-${task?.title || 'document'}.pdf`;
      await taskApi.downloadAttachment(task._id, pdfAttachment._id, filename);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return taskTransformers.formatDate(dateString);
  };

  const isOverdue = (deadline) => {
    return taskTransformers.isOverdue(deadline);
  };

  const getPriorityColor = (priority) => {
    return taskTransformers.getPriorityColor(priority);
  };

  const getStatusColor = (status) => {
    return taskTransformers.getStatusColor(status);
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
          {/* HEADER SECTION WITH TASK HISTORY BUTTON */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Tasks</h1>
              {currentUser && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-600">
                    Welcome back, {currentUser.name}! You have {tasks.length}{' '}
                    task
                    {tasks.length !== 1 ? 's' : ''} assigned.
                  </p>
                  {currentUser.isTeamLeader && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
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

              {/* TASK HISTORY BUTTON - ONLY FOR TEAM LEADERS */}
              {currentUser?.isTeamLeader && (
                <button
                  onClick={() => navigate('/task-history')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#087990] text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  <History className="w-5 h-5" />
                  Task History
                  <span className="ml-1 px-2 py-0.5 bg-white/20 text-xs rounded-full">
                    Team Leader
                  </span>
                </button>
              )}

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
                <button
                  onClick={() => fetchUserTasks()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center gap-2 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => {
                  const buttonConfig = getStatusButtonConfig(task.status);

                  return (
                    <div
                      key={task._id || task.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="flex">
                        <div className="w-2 bg-[#087990]" />

                        <div className="flex-1 p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {task.title}
                                {task.pdfAttachments?.length > 0 && (
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
                          {task.pdfAttachments?.length > 0 && (
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
                        <div className="p-5 border-l border-gray-200 flex flex-col justify-center items-center gap-3 min-w-[200px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(
                                task._id || task.id,
                                buttonConfig.nextStatus
                              );
                            }}
                            className={getButtonClasses(buttonConfig.color)}
                          >
                            {buttonConfig.icon}
                            {buttonConfig.label}
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

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