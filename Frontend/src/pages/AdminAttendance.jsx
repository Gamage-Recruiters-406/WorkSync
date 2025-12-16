import React, { useState } from "react";
import {
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  FileText,
  Search,
} from "lucide-react";
import Sidebar from "./../../components/Sidebar";

const AdminAttendance = () => {
  const [activeTab, setActiveTab] = useState("logs");
  const [dateFilter, setDateFilter] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedCorrection, setSelectedCorrection] = useState(null);

  // Sample data
  const attendanceLogs = [
    {
      id: 1,
      empId: "EMP001",
      name: "John Doe",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      date: "2024-12-09",
      status: "Present",
      hours: "9h 0m",
    },
    {
      id: 2,
      empId: "EMP002",
      name: "Jane Smith",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      date: "2024-12-09",
      status: "Present",
      hours: "8h 45m",
    },
    {
      id: 3,
      empId: "EMP003",
      name: "Mike Johnson",
      checkIn: "09:15 AM",
      checkOut: "06:15 PM",
      date: "2024-12-09",
      status: "Late",
      hours: "9h 0m",
    },
    {
      id: 4,
      empId: "EMP004",
      name: "Sarah Williams",
      checkIn: "09:00 AM",
      checkOut: "-",
      date: "2024-12-09",
      status: "Working",
      hours: "-",
    },
    {
      id: 5,
      empId: "EMP005",
      name: "David Brown",
      checkIn: "-",
      checkOut: "-",
      date: "2024-12-09",
      status: "Absent",
      hours: "-",
    },
  ];

  const corrections = [
    {
      id: 1,
      empId: "EMP002",
      name: "Jane Smith",
      date: "2024-12-08",
      originalCheckIn: "09:30 AM",
      requestedCheckIn: "09:00 AM",
      reason: "System error - was in office at 9 AM",
      status: "pending",
    },
    {
      id: 2,
      empId: "EMP003",
      name: "Mike Johnson",
      date: "2024-12-07",
      originalCheckOut: "-",
      requestedCheckOut: "06:00 PM",
      reason: "Forgot to check out",
      status: "pending",
    },
  ];

  const summaryData = {
    daily: { present: 85, absent: 5, late: 10, totalEmployees: 100 },
    weekly: { present: 425, absent: 25, late: 50, totalEmployees: 500 },
    monthly: { present: 1850, absent: 100, late: 150, totalEmployees: 2100 },
  };

  const handleApproveCorrection = (correction) => {
    alert(`Approved correction for ${correction.name}`);
    setShowCorrectionModal(false);
  };

  const handleRejectCorrection = (correction) => {
    alert(`Rejected correction for ${correction.name}`);
    setShowCorrectionModal(false);
  };

  const getSummaryByFilter = () => {
    switch (dateFilter) {
      case "today":
        return summaryData.daily;
      case "week":
        return summaryData.weekly;
      case "month":
        return summaryData.monthly;
      default:
        return summaryData.daily;
    }
  };

  const summary = getSummaryByFilter();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar role="admin" activeItem="attendance" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Attendance Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitor and manage employee attendance
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {summary.totalEmployees}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#E5E7EB" }}
                >
                  <Users size={24} className="text-gray-700" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Present</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summary.present}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Late</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {summary.late}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Absent</p>
                  <p className="text-2xl font-bold text-red-600">
                    {summary.absent}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle size={24} className="text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <div className="flex gap-1 p-2">
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`px-4 py-2 rounded-md transition ${
                    activeTab === "logs"
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={
                    activeTab === "logs" ? { backgroundColor: "#087990" } : {}
                  }
                >
                  Attendance Logs
                </button>
                <button
                  onClick={() => setActiveTab("corrections")}
                  className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${
                    activeTab === "corrections"
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={
                    activeTab === "corrections"
                      ? { backgroundColor: "#087990" }
                      : {}
                  }
                >
                  Pending Corrections
                  {corrections.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {corrections.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`px-4 py-2 rounded-md transition ${
                    activeTab === "reports"
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={
                    activeTab === "reports"
                      ? { backgroundColor: "#087990" }
                      : {}
                  }
                >
                  Reports
                </button>
              </div>
            </div>

            {/* Attendance Logs Tab */}
            {activeTab === "logs" && (
              <div className="p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Search by name or employee ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                        style={{ focusRingColor: "#087990" }}
                      />
                    </div>
                  </div>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#087990" }}
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="custom">Custom Range</option>
                  </select>

                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: "#087990" }}
                  >
                    <option value="all">All Employees</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Employee ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Check In
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Check Out
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Hours
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {log.empId}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">
                            {log.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {log.date}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {log.checkIn}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {log.checkOut}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {log.hours}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                log.status === "Present"
                                  ? "bg-green-100 text-green-700"
                                  : log.status === "Late"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : log.status === "Working"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Corrections Tab */}
            {activeTab === "corrections" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Pending Attendance Corrections
                </h3>

                {corrections.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle
                      size={48}
                      className="mx-auto text-gray-400 mb-3"
                    />
                    <p className="text-gray-600">No pending corrections</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {corrections.map((correction) => (
                      <div
                        key={correction.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-800">
                                {correction.name}
                              </h4>
                              <span className="text-sm text-gray-600">
                                ({correction.empId})
                              </span>
                              <span className="text-sm text-gray-500">
                                • {correction.date}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Original Time
                                </p>
                                <p className="text-sm text-gray-800">
                                  {correction.originalCheckIn ||
                                    correction.originalCheckOut}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Requested Time
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                  {correction.requestedCheckIn ||
                                    correction.requestedCheckOut}
                                </p>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded p-3 mb-3">
                              <p className="text-xs text-gray-500 mb-1">
                                Reason:
                              </p>
                              <p className="text-sm text-gray-700">
                                {correction.reason}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() =>
                                handleApproveCorrection(correction)
                              }
                              className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
                              style={{ backgroundColor: "#087990" }}
                            >
                              <CheckCircle size={16} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectCorrection(correction)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                            >
                              <XCircle size={16} />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Attendance Reports
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="text-gray-600" size={24} />
                      <h4 className="font-semibold text-gray-800">
                        Daily Report
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      View detailed attendance for today
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Present:</span>
                        <span className="font-medium text-green-600">
                          {summaryData.daily.present}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Late:</span>
                        <span className="font-medium text-yellow-600">
                          {summaryData.daily.late}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Absent:</span>
                        <span className="font-medium text-red-600">
                          {summaryData.daily.absent}
                        </span>
                      </div>
                    </div>
                    <button
                      className="w-full py-2 text-white rounded-lg hover:opacity-90 transition"
                      style={{ backgroundColor: "#087990" }}
                    >
                      Generate Report
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="text-gray-600" size={24} />
                      <h4 className="font-semibold text-gray-800">
                        Weekly Report
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      View attendance for this week
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Present:</span>
                        <span className="font-medium text-green-600">
                          {summaryData.weekly.present}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Late:</span>
                        <span className="font-medium text-yellow-600">
                          {summaryData.weekly.late}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Absent:</span>
                        <span className="font-medium text-red-600">
                          {summaryData.weekly.absent}
                        </span>
                      </div>
                    </div>
                    <button
                      className="w-full py-2 text-white rounded-lg hover:opacity-90 transition"
                      style={{ backgroundColor: "#087990" }}
                    >
                      Generate Report
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="text-gray-600" size={24} />
                      <h4 className="font-semibold text-gray-800">
                        Monthly Report
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      View attendance for this month
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Present:</span>
                        <span className="font-medium text-green-600">
                          {summaryData.monthly.present}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Late:</span>
                        <span className="font-medium text-yellow-600">
                          {summaryData.monthly.late}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Absent:</span>
                        <span className="font-medium text-red-600">
                          {summaryData.monthly.absent}
                        </span>
                      </div>
                    </div>
                    <button
                      className="w-full py-2 text-white rounded-lg hover:opacity-90 transition"
                      style={{ backgroundColor: "#087990" }}
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
