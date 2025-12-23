import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import { Edit2, Trash2 } from "lucide-react";

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [leaveHistory, setLeaveHistory] = useState([]);
  const [editingLeaveId, setEditingLeaveId] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);

  // -------------------- Form change --------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -------------------- Fetch leave history --------------------
  const fetchLeaveHistory = async () => {
    try {
      const userId = "6943b5b7c357c931da00fef2"; // TEMP
      const res = await axios.get(
        `http://localhost:8090/api/v1/leave-request/getLeave/${userId}`,
        { withCredentials: true }
      );
      setLeaveHistory(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch leave history");
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  // -------------------- Submit / Update --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLeaveId) {
        await axios.put(
          `http://localhost:8090/api/v1/leave-request/updateLeave/${editingLeaveId}`,
          formData,
          { withCredentials: true }
        );
        alert("Leave updated successfully");
        setEditingLeaveId(null);
      } else {
        await axios.post(
          "http://localhost:8090/api/v1/leave-request/addLeave",
          formData,
          { withCredentials: true }
        );
        alert("Leave request submitted successfully");
      }

      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });

      fetchLeaveHistory();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // -------------------- Edit --------------------
  const handleEdit = (leave) => {
    setEditingLeaveId(leave._id);
    setFormData({
      leaveType: leave.leaveType,
      startDate: leave.startDate?.split("T")[0],
      endDate: leave.endDate?.split("T")[0],
      reason: leave.reason,
    });
  };

  // -------------------- Delete --------------------
  const handleDelete = async (leaveId) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;
    try {
      await axios.delete(
        `http://localhost:8090/api/v1/leave-request/deleteLeave/${leaveId}`,
        { withCredentials: true }
      );
      alert("Leave deleted successfully");
      fetchLeaveHistory();
    } catch (error) {
      console.error(error);
      alert("Failed to delete leave");
    }
  };

  // -------------------- Leave Balance --------------------

  const fetchLeaveBalance = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8090/api/v1/leave-request/leave-balance",
        { withCredentials: true }
      );
      setLeaveBalance(res.data);
      } catch (err) {
        console.error(err);
      }
    };

  useEffect(() => {
    fetchLeaveBalance();
  }, []);

  // -------------------- UI --------------------
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6 border rounded-3xl bg-white">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Request Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow p-4 border border-gray-200">
            <h2 className="text-lg font-medium mb-4">
              {editingLeaveId ? "Update Leave" : "Leave Request Form"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-3">
                <div>
                  <label className="text-gray-600">Leave Type</label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-2"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Annual">Annual Leave</option>
                    <option value="Casual">Casual Leave</option>
                    <option value="Sick">Sick Leave</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-600">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-2"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-gray-600">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-2"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-600">Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows="4"
                    className="w-full h-32 border rounded-lg p-2 mt-2"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button className="bg-[#087990] text-white px-4 py-2 w-40 rounded-lg">
                    {editingLeaveId ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLeaveId(null);
                      setFormData({
                        leaveType: "",
                        startDate: "",
                        endDate: "",
                        reason: "",
                      });
                    }}
                    className="border-2 border-[#087990] px-4 py-2 w-40 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Leave Balance UI */}
          {leaveBalance && (
            <div className="bg-white rounded-2xl shadow p-4 border border-gray-200 max-w-md">
              <h2 className="text-lg font-medium mb-4">Leave Balance</h2>

              {/* Leave Types with Bars */}
              {[
                { label: "Annual", value: leaveBalance.balance.annual, color: "bg-blue-500" },
                { label: "Casual", value: leaveBalance.balance.casual, color: "bg-green-500" },
                { label: "Sick", value: leaveBalance.balance.sick, color: "bg-purple-500" },
              ].map((leave, idx) => {
                let used = 0;
                let total = 1;

                if (leave.value.includes("/")) {
                  const parts = leave.value.split("/");
                  used = Number(parts[0]);
                  total = Number(parts[1]);
                }

                const percent = `${(used / total) * 100}%`;

                return (
                  <div key={idx} className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{leave.label} Leave</span>
                      <span className="font-semibold">{leave.value}</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full">
                      <div className={`${leave.color} h-4 rounded-full`} style={{ width: percent }}></div>
                    </div>
                  </div>
                );
              })}

              <hr className="border-gray-200 mb-6" />

              {/* Status Counts */}
              <div className="flex justify-around text-center">
                <div className="flex flex-col items-center">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                    {leaveBalance.counts.approved}
                  </span>
                  <span className="text-gray-500 text-sm mt-1">Approved</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                    {leaveBalance.counts.pending}
                  </span>
                  <span className="text-gray-500 text-sm mt-1">Pending</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                    {leaveBalance.counts.rejected}
                  </span>
                  <span className="text-gray-500 text-sm mt-1">Rejected</span>
                </div>
              </div>
            </div>
          )}
      </div>

        {/* Leave History Table */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">Leave History</h2>
          <table className="w-full text-sm">
            <thead className="bg-[#087990] text-white">
              <tr>
                <th className="py-3 px-2 text-center border-r border-white">Leave ID</th>
                <th className="text-center border-r border-white">Leave Type</th>
                <th className="text-center border-r border-white">Start Date</th>
                <th className="text-center border-r border-white">End Date</th>
                <th className="text-center border-r border-white">Reason</th>
                <th className="text-center border-r border-white">Status</th>
                <th className="text-center border-r border-white">Approved By</th>
                <th className="text-center border-r border-white">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#E5E7EB] divide-y divide-x divide-white">
              {leaveHistory.length > 0 ? (
                leaveHistory.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-200">
                    <td className="py-3 px-2 text-center border-r border-white">
                      {leave.leaveId || leave._id}
                    </td>
                    <td className="text-center border-r border-white">{leave.leaveType}</td>
                    <td className="text-center border-r border-white">
                      {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="text-center border-r border-white">
                      {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="text-center border-r border-white">{leave.reason || "-"}</td>
                    <td className="text-center border-r border-white">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          leave.sts === "approved"
                            ? "bg-green-100 text-green-700"
                            : leave.sts === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {leave.sts ? leave.sts.charAt(0).toUpperCase() + leave.sts.slice(1) : "-"}
                      </span>
                    </td>
                    <td className="text-center border-r border-white">{leave.approvedBy?.fullName || "-"}</td>
                    <td className="text-center border-r border-white flex justify-center gap-2 items-center mt-3">
                      <button onClick={() => handleEdit(leave)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(leave._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No leave history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
