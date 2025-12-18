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
import Sidebar from "../../components/Sidebar";

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
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar role="admin" activeItem="attendance" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white px-6 py-4">
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
            {/* All Employees Card */}
            <div className="bg-gray-100 p-5 rounded-lg shadow-sm border border-gray-200 relative">
              <div className="absolute top-4 left-4">
                <Users size={24} className="text-gray-800" />
              </div>
              <div className="text-center pt-1">
                <p className="text-2xl font-bold text-gray-800">70</p>
                <p className="text-sm text-gray-600 mt-1">All Employees</p>
              </div>
            </div>

            {/* Present Card */}
            <div className="bg-gray-100 p-5 rounded-lg shadow-sm border border-gray-200 relative">
              <div className="absolute top-4 left-4">
                <CheckCircle size={24} className="text-gray-800" />
              </div>
              <div className="text-center pt-1">
                <p className="text-2xl font-bold text-gray-800">60</p>
                <p className="text-sm text-gray-600 mt-1">Present</p>
              </div>
            </div>

            {/* Late Card */}
            <div className="bg-gray-100 p-5 rounded-lg shadow-sm border border-gray-200 relative">
              <div className="absolute top-4 left-4">
                <Clock size={24} className="text-gray-800" />
              </div>
              <div className="text-center pt-1">
                <p className="text-2xl font-bold text-gray-800">5</p>
                <p className="text-sm text-gray-600 mt-1">Late</p>
              </div>
            </div>

            {/* Absent Card */}
            <div className="bg-gray-100 p-5 rounded-lg shadow-sm border border-gray-200 relative">
              <div className="absolute top-4 left-4">
                <XCircle size={24} className="text-gray-800" />
              </div>
              <div className="text-center pt-1">
                <p className="text-2xl font-bold text-gray-800">5</p>
                <p className="text-sm text-gray-600 mt-1">Absent</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-white border-b border-gray-200">
              <div className="flex gap-1 p-2">
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`px-4 py-2 rounded-md transition ${
                    activeTab === "logs"
                      ? "text-white"
                      : "text-gray-600 border border-[#087990] hover:bg-gray-200"
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
                      : "text-gray-600 border border-[#087990] hover:bg-gray-200"
                  }`}
                  style={
                    activeTab === "corrections"
                      ? { backgroundColor: "#087990" }
                      : {}
                  }
                >
                  Correction Approvals
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
                      : "text-gray-600 border border-[#087990] hover:bg-gray-200"
                  }`}
                  style={
                    activeTab === "reports"
                      ? { backgroundColor: "#087990" }
                      : {}
                  }
                >
                  Attendance Reports
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
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#087990]"
                      />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 placeholder:text-[#087990] bg-white"
                        style={{ focusRingColor: "#087990" }}
                      />
                    </div>
                  </div>

                  {/* Date Filter Dropdown */}
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white"
                    style={{ focusRingColor: "#087990" }}
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="custom">Custom Range</option>
                  </select>

                  {/* Status Filter Dropdown */}
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white"
                    style={{ focusRingColor: "#087990" }}
                  >
                    <option value="all">All Employees</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="working">Working</option>
                  </select>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Attendance Logs
                </h3>

                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-[#087990]">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white border-r border-white">
                          Attendee ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white border-r border-white">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white border-r border-white">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white border-r border-white">
                          Check IN
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white border-r border-white">
                          Check Out
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white border-r border-white">
                          Hours
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white bg-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          EPM001
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800 border-r border-white">
                          John Doe
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 border-r border-white">
                          2025-12-10
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          9.00 AM
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          5.00 PM
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          8h 0m
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          <span className="px-3 py-1 text-xs font-medium text-green-600">
                            Present
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-white bg-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          EMP002
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800 border-r border-white">
                          Jane Smith
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 border-r border-white">
                          2025-12-10
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          8.45 AM
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          5.00 PM
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          8h 15m
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          <span className="px-3 py-1 text-xs font-medium text-green-600">
                            Present
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-white bg-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          EMP003
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800 border-r border-white">
                          Mike Jnonson
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 border-r border-white">
                          2025-12-10
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          -
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          -
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          -
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          <span className="px-3 py-1 text-xs font-medium text-red-600">
                            Absent
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-white bg-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          EMP004
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800 border-r border-white">
                          David Brown
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 border-r border-white">
                          2025-12-10
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          9.10 AM
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          -
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          -
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          <span className="px-3 py-1 text-xs font-medium text-blue-600">
                            Working
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-white bg-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          EMP005
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800 border-r border-white">
                          Dwayne Smith
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 border-r border-white">
                          2025-12-10
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          9.15 AM
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          5.30 PM
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                          8h 15m
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          <span className="px-3 py-1 text-xs font-medium text-yellow-600">
                            Late
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* PAGINATION */}
                  <div className="flex justify-between items-center p-4 bg-gray-100 border-t border-gray-200">
                    <div className="flex items-center gap-1 ml-auto">
                      <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                      </button>
                      <button className="px-3 py-1 text-sm bg-[#087990] text-white rounded">
                        1
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded">
                        2
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded">
                        3
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded">
                        4
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
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
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
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
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between">
                          {/* Left content */}
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

                            {/* Reason with background rectangle - decreased width */}
                            <div className="bg-gray-50 rounded p-3 mt-3 w-fit">
                              <div className="flex items-start gap-2">
                                <p className="text-sm text-gray-500 whitespace-nowrap">
                                  Reason:
                                </p>
                                <p className="text-sm text-gray-700">
                                  {correction.reason}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right side buttons - vertically centered */}
                          <div className="flex flex-col gap-2 ml-6 justify-center">
                            <button
                              onClick={() =>
                                handleApproveCorrection(correction)
                              }
                              className="px-6 py-2.5 text-white rounded-lg hover:opacity-90 transition w-32"
                              style={{ backgroundColor: "#087990" }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectCorrection(correction)}
                              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-32"
                            >
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
                  {/* Daily Report Card */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    <div className="p-4" style={{ backgroundColor: "#087990" }}>
                      <div className="flex items-center justify-center gap-2">
                        <FileText size={20} className="text-black" />
                        <h4 className="font-semibold text-black text-base">
                          Daily Report
                        </h4>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-1xl text-black font-semibold text-left">
                        Attendance for today
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-800">Present</p>
                          <p className="text-xl font-semibold text-gray-800">
                            60
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-800">Late</p>
                          <p className="text-xl font-semibold text-gray-800">
                            05
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-800">Absent</p>
                          <p className="text-xl font-semibold text-gray-800">
                            05
                          </p>
                        </div>
                      </div>

                      <button
                        className="w-full py-2.5 text-white rounded-lg hover:opacity-90 transition"
                        style={{ backgroundColor: "#087990" }}
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>

                  {/* Weekly Report Card */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    <div className="p-4" style={{ backgroundColor: "#087990" }}>
                      <div className="flex items-center justify-center gap-2">
                        <FileText size={20} className="text-black" />
                        <h4 className="font-semibold text-black text-base">
                          Weekly Report
                        </h4>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-1xl text-black font-semibold text-left">
                        Attendance for this week
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-800">Working Days</p>
                          <p className="text-xl font-semibold text-gray-800">
                            05
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-800">Most Late</p>
                          <p className="text-base font-semibold text-gray-800">
                            Jane Smith
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-800">Most Absent</p>
                          <p className="text-base font-semibold text-gray-800">
                            Dwayne Smith
                          </p>
                        </div>
                      </div>

                      <button
                        className="w-full py-2.5 text-white rounded-lg hover:opacity-90 transition"
                        style={{ backgroundColor: "#087990" }}
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>

                  {/* Monthly Report Card */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    <div className="p-4" style={{ backgroundColor: "#087990" }}>
                      <div className="flex items-center justify-center gap-2">
                        <FileText size={20} className="text-black" />
                        <h4 className="font-semibold text-black text-base">
                          Monthly Report
                        </h4>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-1xl text-black font-semibold text-left">
                        Attendance for this month
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-800">Working Days</p>
                          <p className="text-xl font-semibold text-gray-800">
                            20
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-800">Most Late</p>
                          <p className="text-base font-semibold text-gray-800">
                            Jane Smith
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-800">Most Absent</p>
                          <p className="text-base font-semibold text-gray-800">
                            Dwayne Smith
                          </p>
                        </div>
                      </div>

                      <button
                        className="w-full py-2.5 text-white rounded-lg hover:opacity-90 transition"
                        style={{ backgroundColor: "#087990" }}
                      >
                        Generate Report
                      </button>
                    </div>
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
