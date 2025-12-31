import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import { Edit2, Trash2, X } from "lucide-react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

// -------------------- Custom Alert Modal --------------------
const CustomAlert = ({ message, type, onClose }) => {
  const colors = {
    success: { 
      border: "border-[#087990]", 
      bg: "bg-[#E6F4F6]", 
      icon: <AiOutlineCheckCircle className="w-12 h-12 text-[#087990]" />,
      text: "text-[#087990]"
    },
    error: { 
      border: "border-red-500", 
      bg: "bg-red-50", 
      icon: <AiOutlineCloseCircle className="w-12 h-12 text-red-500" />,
      text: "text-red-800"
    },
  };
  const color = colors[type] || colors.error;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className={`relative p-6 rounded-2xl w-full max-w-md text-center shadow-2xl border-l-4 transform transition-all duration-300 scale-100 ${color.border} ${color.bg}`}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
        <div className="mb-4 flex items-center justify-center gap-3">{color.icon}</div>
        <p className={`mb-6 text-lg font-medium ${color.text}`}>{message}</p>
        <button onClick={onClose} className="bg-[#087990] hover:bg-[#06657a] text-white px-6 py-2 rounded-xl transition-colors duration-200 font-medium">
          OK
        </button>
      </div>
    </div>
  );
};

// -------------------- Delete Confirm Modal --------------------
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel}></div>
      <div className="relative bg-red-50 p-6 rounded-2xl w-full max-w-md text-center shadow-2xl border-l-4 border-red-500">
        <button onClick={onCancel} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
        <div className="mb-4 flex items-center justify-center gap-3">
          <AiOutlineCloseCircle className="w-12 h-12 text-red-500" />
        </div>
        <p className="mb-6 text-lg font-medium text-red-800">{message}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-colors duration-200 font-medium">Confirm</button>
          <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-xl transition-colors duration-200 font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// -------------------- Main Component --------------------
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

  // Modal State
  const [alert, setAlert] = useState({ open: false, message: "", type: "success" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, leaveId: null });

  // 1. Get User ID from Local Storage (Hard-coding අයින් කර ඇත)
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id || userData?._id || userData?.userid;

  // -------------------- Fetch Functions --------------------
  const fetchLeaveHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:8090/api/v1/leave-request/getLeave/${userId}`,
        { withCredentials: true }
      );
      setLeaveHistory(res.data.data || []);
    } catch (error) {
      console.error("History error:", error);
    }
  }, [userId]);

  const fetchLeaveBalance = useCallback(async () => {
  try {
    const res = await axios.get(
      "http://localhost:8090/api/v1/leave-request/leave-balance",
      { withCredentials: true }
    );
    console.log("Leave Balance API:", res.data); // මෙහෙම එක එකතු කරන්න
    setLeaveBalance(res.data);
  } catch (err) {
    console.error("Balance error:", err);
  }
}, []);


  useEffect(() => {
    if (userId) {
      fetchLeaveHistory();
      fetchLeaveBalance();
    }
  }, [userId, fetchLeaveHistory, fetchLeaveBalance]);

  // -------------------- Handlers --------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLeaveId) {
        await axios.put(
          `http://localhost:8090/api/v1/leave-request/updateLeave/${editingLeaveId}`, 
          formData, { withCredentials: true });
        setAlert({ open: true, message: "Leave updated successfully", type: "success" });
        setEditingLeaveId(null);
      } else {
        await axios.post(
          "http://localhost:8090/api/v1/leave-request/addLeave", 
          formData, { withCredentials: true });
        setAlert({ open: true, message: "Leave request submitted successfully", type: "success" });
      }

      setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" });
      fetchLeaveHistory();
      fetchLeaveBalance();
    } catch (error) {
      setAlert({ open: true, message: error.response?.data?.message || "Something went wrong", type: "error" });
    }
  };

  const handleEdit = (leave) => {
    setEditingLeaveId(leave._id);
    setFormData({
      leaveType: leave.leaveType,
      startDate: leave.startDate?.split("T")[0],
      endDate: leave.endDate?.split("T")[0],
      reason: leave.reason,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8090/api/v1/leave-request/deleteLeave/${confirmDelete.leaveId}`, 
        { withCredentials: true });
      setAlert({ open: true, message: "Leave deleted successfully", type: "success" });
      fetchLeaveHistory();
      fetchLeaveBalance();
    } catch (error) {
      setAlert({ open: true, message: "Failed to delete leave", type: "error" });
    } finally {
      setConfirmDelete({ open: false, leaveId: null });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 space-y-6 border rounded-3xl bg-white overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow p-4 border border-gray-200">
            <h2 className="text-lg font-medium mb-4">{editingLeaveId ? "Update Leave" : "Leave Request Form"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-gray-600 text-sm">Leave Type</label>
                  <select name="leaveType" value={formData.leaveType} onChange={handleChange} className="w-full border rounded-lg p-2 mt-2 text-sm" required>
                    <option value="">Select Type</option>
                    <option value="annual">Annual Leave</option>
                    <option value="casual">Casual Leave</option>
                    <option value="sick">Sick Leave</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-600 text-sm">Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full border rounded-lg p-2 mt-2 text-sm" required />
                </div>
                <div>
                  <label className="text-gray-600 text-sm">End Date</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full border rounded-lg p-2 mt-2 text-sm" required />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-600 text-sm">Reason</label>
                  <textarea name="reason" value={formData.reason} onChange={handleChange} rows="4" className="w-full h-32 border rounded-lg p-2 mt-2 text-sm resize-none" required />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="submit" className="bg-[#087990] hover:bg-[#06657a] text-white px-4 py-2 w-40 rounded-lg transition-colors">{editingLeaveId ? "Update" : "Submit"}</button>
                  <button type="button" onClick={() => { setEditingLeaveId(null); setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" }); }} className="border-2 border-[#087990] text-[#087990] px-4 py-2 w-40 rounded-lg">Cancel</button>
                </div>
              </div>
            </form>
          </div>

          {/* Balance Section */}
          {leaveBalance && (
            <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Leave Balance</h2>
              {[
                { label: "Annual", value: leaveBalance.balance.annual, color: "bg-blue-500" },
                { label: "Casual", value: leaveBalance.balance.casual, color: "bg-green-500" },
                { label: "Sick", value: leaveBalance.balance.sick, color: "bg-purple-500" },
              ].map((leave, idx) => {
                const [used, total] = leave.value.split("/").map(Number);
                const percent = `${(used / total) * 100}%`;
                return (
                  <div key={idx} className="mb-6">
                    <div className="flex justify-between text-sm mb-1"><span>{leave.label} Leave</span><span className="font-semibold">{leave.value}</span></div>
                    <div className="w-full h-4 bg-gray-200 rounded-full"><div className={`${leave.color} h-4 rounded-full`} style={{ width: percent }}></div></div>
                  </div>
                );
              })}
              <div className="flex justify-around text-center pt-4 border-t">
                <div><span className="px-3 py-1 bg-[#E6F4F6] text-[#087990] rounded-full font-semibold">{leaveBalance.counts.approved}</span><p className="text-xs text-gray-500 mt-1">Approved</p></div>
                <div><span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">{leaveBalance.counts.pending}</span><p className="text-xs text-gray-500 mt-1">Pending</p></div>
                <div><span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">{leaveBalance.counts.rejected}</span><p className="text-xs text-gray-500 mt-1">Rejected</p></div>
              </div>
            </div>
          )}
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl shadow p-4 overflow-hidden">
          <h2 className="text-lg font-medium mb-4">Leave History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-[#087990] text-white">
                <tr>
                  <th className="py-3 px-2 border-r border-white">Leave ID</th>
                  <th className="px-2 border-r border-white">Leave Type</th>
                  <th className="px-2 border-r border-white">Start Date</th>
                  <th className="px-2 border-r border-white">End Date</th>
                  <th className="px-2 border-r border-white">Status</th>
                  <th className="px-2 border-r border-white">Approved By</th>
                  <th className="px-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-50 divide-y divide-white">
                {leaveHistory.length > 0 ? leaveHistory.map((leave) => (
                  <tr key={leave._id} className="text-center hover:bg-gray-100">
                    <td className="py-3 px-2 border-r border-white">{leave.leaveId || leave._id.slice(-6)}</td>
                    <td className="px-2 border-r border-white capitalize">{leave.leaveType}</td>
                    <td className="px-2 border-r border-white">{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td className="px-2 border-r border-white">{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td className="px-2 border-r border-white">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${leave.sts === "approved" ? "bg-cyan-100 text-cyan-700" : leave.sts === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {leave.sts.charAt(0).toUpperCase() + leave.sts.slice(1)}
                      </span>
                    </td>
                    <td className="px-2 border-r border-white">{leave.approvedBy?.fullName || leave.approvedBy?.email}</td>
                    <td className="px-2 flex justify-center gap-2 py-3">
                      <button onClick={() => handleEdit(leave)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => setConfirmDelete({ open: true, leaveId: leave._id })} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="7" className="py-10 text-center text-gray-400">No records found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {alert.open && <CustomAlert {...alert} onClose={() => setAlert({ ...alert, open: false })} />}
      {confirmDelete.open && <ConfirmModal message="Delete this request?" onConfirm={handleDeleteConfirm} onCancel={() => setConfirmDelete({ open: false, leaveId: null })} />}
    </div>
  );
};

export default LeaveRequest;