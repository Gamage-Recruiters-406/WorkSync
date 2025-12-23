import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    leaveId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8090/api/v1/leave-request/addLeave",
        formData,
        {
          withCredentials: true, // JWT cookie
        }
      );

      alert("Leave request submitted successfully");

      // Clear form
      setFormData({
        leaveId: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });

      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6 border rounded-3xl bg-white">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Request Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow p-4 border border-gray-200">
            <h2 className="text-lg font-medium mb-4">
              Leave Request Form
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Left Side */}
              <div className="space-y-3">
                <div>
                  <label className="text-gray-600">Leave ID</label>
                  <input
                    type="text"
                    name="leaveId"
                    value={formData.leaveId}
                    onChange={handleChange}
                    placeholder="FR-LV-001"
                    className="w-full border rounded-lg p-2 mt-2"
                    required
                  />
                </div>

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

              {/* Right Side */}
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
                    placeholder="Reason for leave"
                    className="w-full h-32 border rounded-lg p-2 mt-2"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-[#087990] text-white px-4 py-2 w-40 rounded-lg hover:bg-[#065c6f]"
                  >
                    Submit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        leaveId: "",
                        leaveType: "",
                        startDate: "",
                        endDate: "",
                        reason: "",
                      })
                    }
                    className="bg-white border-2 border-[#087990] text-gray-800 px-4 py-2 w-40 rounded-lg hover:bg-[#087990] hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Leave Balance */}
          <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Leave Balance</h2>

            {[
              { label: "Annual Leave", value: "12 / 20 Days", percent: "60%" },
              { label: "Sick Leave", value: "5 / 10 Days", percent: "50%" },
              { label: "Casual Leave", value: "6 / 10 Days", percent: "60%" },
            ].map((item, index) => (
              <div className="mb-4" key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
                <div className="w-full h-5 bg-gray-200 rounded-full">
                  <div
                    className="bg-[#087990] h-5 rounded-full"
                    style={{ width: item.percent }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave History (static – next step backend) */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">
              Leave History
          </h2>

          <table className="w-full text-sm">
              <thead className="bg-[#087990] text-white">
              <tr>
                  <th className="py-3 px-2 text-center border-r border-white">Leave ID</th>
                  <th className="text-center border-r border-white">Employee</th>
                  <th className="text-center border-r border-white">Leave Type</th>
                  <th className="text-center border-r border-white">Start Date</th>
                  <th className="text-center border-r border-white">End Date</th>
                  <th className="text-center border-r border-white">Reason</th>
                  <th className="text-center border-r border-white">Status</th>
                  <th className="text-center border-r border-white">Approved By</th>
              </tr>
              </thead>
              <tbody className="bg-[#E5E7EB] divide-y divide-x divide-white">
                <tr className="hover:bg-gray-200">
                  <td className="py-3 px-2 text-center border-r border-white">FR-LV-001</td>
                  <td className="text-center border-r border-white">Kasun Perera</td>
                  <td className="text-center border-r border-white">Casual</td>
                  <td className="text-center border-r border-white">2025-02-10</td>
                  <td className="text-center border-r border-white">2025-02-11</td>
                  <td className="text-center border-r border-white">Personal errands</td>
                  <td className="text-center border-r border-white">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                      Pending
                    </span>
                  </td>
                  <td className="text-center border-r border-white">-</td>
                </tr>

                <tr className="hover:bg-gray-200">
                  <td className="py-3 px-2 text-center border-r border-white">FR-LV-002</td>
                  <td className="text-center border-r border-white">Nimali Silva</td>
                  <td className="text-center border-r border-white">Annual</td>
                  <td className="text-center border-r border-white">2025-01-05</td>
                  <td className="text-center border-r border-white">2025-01-10</td>
                  <td className="text-center border-r border-white">Family vacation</td>
                  <td className="text-center border-r border-white">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      Approved
                    </span>
                  </td>
                  <td className="text-center border-r border-white">Manager A</td>
                </tr>

                <tr className="hover:bg-gray-200">
                  <td className="py-3 px-2 text-center border-r border-white">FR-LV-003</td>
                  <td className="text-center border-r border-white">Chamod Fernando</td>
                  <td className="text-center border-r border-white">Sick</td>
                  <td className="text-center border-r border-white">2025-01-18</td>
                  <td className="text-center border-r border-white">2025-01-19</td>
                  <td className="text-center border-r border-white">Fever</td>
                  <td className="text-center border-r border-white">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                      Rejected
                    </span>
                  </td>
                  <td className="text-center border-r border-white">Manager B</td>
                </tr>
              </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
