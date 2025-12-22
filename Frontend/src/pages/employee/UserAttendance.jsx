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
  X,
} from "lucide-react";
import Sidebar from "../../components/sidebar/Sidebar";
import { clockIn, clockOut, requestCorrection } from "../../services/userAttendanceApi";

const UserAttendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [correctionType, setCorrectionType] = useState("checkIn"); // "checkIn" or "checkOut"
  const [correctTime, setCorrectTime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getDeviceDate = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const handleCheckIn = async () => {
    try {
      const date = getDeviceDate();
      const res = await clockIn(date);
      if (res?.data?.success) {
        const now = new Date();
        setCheckInTime(now);
        setIsCheckedIn(true);
      } else {
        alert(res?.data?.message || "Check-in failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Error during check-in";
      alert(msg);
    }
  };

  const handleCheckOut = async () => {
    try {
      const date = getDeviceDate();
      const res = await clockOut(date);
      if (res?.data?.success) {
        setIsCheckedIn(false);
        setCheckInTime(null);
      } else {
        alert(res?.data?.message || "Check-out failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Error during check-out";
      alert(msg);
    }
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
    },
    {
      date: "2025-12-11",
      checkIn: "8.45 AM",
      checkOut: "5.00 PM",
      hours: "8h 15m",
      status: "Present",
    },
    {
      date: "2025-12-12",
      checkIn: "-",
      checkOut: "-",
      hours: "-",
      status: "Absent",
    },
    {
      date: "2025-12-13",
      checkIn: "9.10 AM",
      checkOut: "-",
      hours: "-",
      status: "Working",
    },
    {
      date: "2025-12-14",
      checkIn: "9.15 AM",
      checkOut: "5.30 PM",
      hours: "8h 15m",
      status: "Late",
    },
  ];

  const handleRequestCorrection = (row) => {
    setSelectedDate(row);
    setCorrectionType("checkIn");
    setCorrectTime("");
    setReason("");
    setShowCorrectionForm(true);
  };

  const handleSubmitCorrection = async () => {
    if (!correctTime.trim()) {
      alert("Please enter the correct time");
      return;
    }

    if (!reason.trim()) {
      alert("Please provide a reason for the correction");
      return;
    }

    try {
      // For demo, use selectedDate date as attendance ID reference
      // Backend needs actual attendanceId; using date as placeholder for now
      const res = await requestCorrection(selectedDate.date, correctTime, reason);
      
      if (res?.data?.success) {
        alert("Correction request submitted successfully");
        setShowCorrectionForm(false);
      } else {
        alert(res?.data?.message || "Failed to submit correction");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Error submitting correction";
      alert(msg);
    }
  };

  const getOriginalTime = () => {
    if (!selectedDate) return "";
    return correctionType === "checkIn"
      ? selectedDate.checkIn
      : selectedDate.checkOut;
  };

  // If correction form is shown, display it
  if (showCorrectionForm) {
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
            {/* Back Button and Header */}
            <div className="mb-6">
              <button
                onClick={() => setShowCorrectionForm(false)}
                className="flex items-center gap-2 text-[#087990] hover:text-[#065a70] mb-4"
              >
                <X size={20} />
                Back to Attendance
              </button>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  My Attendance
                </h1>
                <p className="text-sm text-gray-600">Welcome Back Jhon Doe</p>
              </div>
            </div>

            {/* Correction Form */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              {/* Four Cards Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* Date Card */}
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedDate?.date}
                  </p>
                </div>

                {/* Status Card */}
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedDate?.status}
                  </p>
                </div>

                {/* Check In Time Card */}
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Check In</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedDate?.checkIn}
                  </p>
                </div>

                {/* Check Out Time Card */}
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Check Out</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedDate?.checkOut}
                  </p>
                </div>
              </div>

              {/* What do you need to Correct? Section */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  What do you need to Correct?
                </h3>

                <div className="flex gap-12">
                  {/* Check In Time Rectangle */}
                  <div
                    onClick={() => setCorrectionType("checkIn")}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition text-center 
                  w-56 h-32 flex items-center justify-center ${
                    correctionType === "checkIn"
                      ? "border-[#087990] bg-[#087990] text-white shadow-md"
                      : "border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm"
                  }`}
                  >
                    <span className="font-medium text-lg">Check in Time</span>
                  </div>

                  {/* Check Out Time Rectangle */}
                  <div
                    onClick={() => setCorrectionType("checkOut")}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition text-center 
                  w-56 h-32 flex items-center justify-center ${
                    correctionType === "checkOut"
                      ? "border-[#087990] bg-[#087990] text-white shadow-md"
                      : "border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm"
                  }`}
                  >
                    <span className="font-medium text-lg">Check Out Time</span>
                  </div>
                </div>
              </div>

              {/* Original Time Section */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Original Time Display */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {correctionType === "checkIn"
                        ? "Original Check in Time"
                        : "Original Check Out Time"}
                    </h3>
                    <div className="bg-gray-100 p-6 rounded-lg mb-2">
                      <p className="text-xl font-bold text-gray-900 text-center">
                        {getOriginalTime() || "-"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Enter the correct time
                    </p>
                  </div>

                  {/* Requested Time Input */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Requested{" "}
                      {correctionType === "checkIn"
                        ? "Check in Time"
                        : "Check Out Time"}
                    </h3>
                    <div className="relative">
                      <input
                        type="time"
                        value={correctTime}
                        onChange={(e) => setCorrectTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087990] focus:border-transparent text-center text-lg appearance-none"
                        placeholder="--:--"
                      />
                      {!correctTime && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-gray-400 text-lg">------</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason For the Correction Section */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Reason For the Correction
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Please explain why you need this correction. Be specific and
                  honest. Example,
                </p>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      System was down and I could not check{" "}
                      {correctionType === "checkIn" ? "in" : "out"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Forgot to check{" "}
                      {correctionType === "checkIn" ? "in" : "out"} at correct
                      time
                    </span>
                  </li>
                </ul>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087990] focus:border-transparent"
                  placeholder="Type your reason here..."
                />
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={handleSubmitCorrection}
                  className="w-full py-3 text-white rounded-lg hover:opacity-90 transition text-lg font-medium"
                  style={{ backgroundColor: "#087990" }}
                >
                  Request Correction
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original main component
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
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#087990]">
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white border-r border-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-white bg-gray-100"
                    >
                      <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                        {row.date}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800 border-r border-white">
                        {row.checkIn}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                        {row.checkOut}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 border-r border-white">
                        {row.hours}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        <span
                          className={`px-3 py-1 text-xs font-medium ${
                            row.status === "Present"
                              ? "text-green-600"
                              : row.status === "Absent"
                              ? "text-red-600"
                              : row.status === "Late"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        <button
                          className="px-3 py-1 text-xs text-white rounded hover:opacity-90"
                          style={{ backgroundColor: "#087990" }}
                          onClick={() => handleRequestCorrection(row)}
                        >
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
