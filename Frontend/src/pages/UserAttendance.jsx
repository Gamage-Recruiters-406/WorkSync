import React, { useState, useEffect } from "react";
import {
  Clock,
  User,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  BarChart2,
  ClipboardList,
  Users,
  Edit2,
} from "lucide-react";
import Sidebar from "../components/sidebar/Sidebar";

const UserAttendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
  };

  const getWorkingHours = () => {
    if (!checkInTime) return "0h 0m";
    const now = new Date();
    const duration = Math.floor((now - checkInTime) / 1000 / 60);
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatCheckInTime = () => {
    if (!checkInTime) return "00:00:00";
    const hours = String(checkInTime.getHours()).padStart(2, "0");
    const minutes = String(checkInTime.getMinutes()).padStart(2, "0");
    const seconds = String(checkInTime.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Attendance data for the table
  const attendanceData = [
    {
      date: "2025-12-10",
      checkIn: "9.00 AM",
      checkOut: "5.00 PM",
      hours: "8h 0m",
      status: "Present",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      date: "2025-12-11",
      checkIn: "8.45 AM",
      checkOut: "5.00 PM",
      hours: "8h 15m",
      status: "Present",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      date: "2025-12-12",
      checkIn: "-",
      checkOut: "-",
      hours: "-",
      status: "Absent",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      date: "2025-12-13",
      checkIn: "9.10 AM",
      checkOut: "-",
      hours: "-",
      status: "Working",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      date: "2025-12-14",
      checkIn: "9.15 AM",
      checkOut: "5.30 PM",
      hours: "8h 15m",
      status: "Late",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Use your Sidebar component */}
      <Sidebar role="employee" activeItem="attendance" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="border-none outline-none text-sm text-gray-600 bg-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <Bell
              size={20}
              style={{ color: "#087990" }}
              className="cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                K.Perera
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
            <p className="text-sm text-gray-600">Welcome Back Jhon Doe</p>
          </div>

          {/* Today's Attendance Card */}
          <div
            className="rounded-lg p-8 mb-6 shadow-sm"
            style={{ backgroundColor: "#E5E7EB" }}
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-4">
                <Clock size={32} className="text-white" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Today's Attendance
              </h2>

              {!isCheckedIn ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-6">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-900"></div>
                    <span>You haven't check in today</span>
                  </div>

                  <button
                    onClick={handleCheckIn}
                    className="px-8 py-2 text-white rounded text-sm font-medium"
                    style={{ backgroundColor: "#087990" }}
                  >
                    Check IN
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-6">
                    <div className="w-4 h-4 rounded-full bg-gray-900"></div>
                    <span>You are checked in</span>
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="bg-white rounded-lg px-10 py-4 text-center">
                      <p className="text-xs text-gray-600 mb-2">
                        Check IN Time
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCheckInTime()}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg px-10 py-4 text-center">
                      <p className="text-xs text-gray-600 mb-2">
                        Working Hours
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {getWorkingHours()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckOut}
                    className="px-8 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                  >
                    Check Out
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Personal Attendance Summary - Only table remains */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Personal Attendance Summary
            </h2>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Check IN
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Check Out
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hours
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.checkIn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.checkOut}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.hours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.statusColor}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          onClick={() =>
                            console.log(`Request correction for ${row.date}`)
                          }
                        >
                          <Edit2 size={14} />
                          Request Correction
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAttendance;
