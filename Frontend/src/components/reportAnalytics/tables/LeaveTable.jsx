import React from "react";

export default function LeaveTable({ data }) {
  const handleExport = (type) => {
    window.open(
      `http://localhost:8090/api/v1/leave-request/getUserLeaveReport?type=${type}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      {/* Header with Export Buttons */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Leave Report</h2>
        <div>
          <button
            onClick={() => handleExport("pdf")}
            className="bg-[#087990] text-white px-4 py-2 rounded mr-2 hover:text-[#087990] hover:bg-gray-200 transition"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="bg-white text-[#087990] px-4 py-2 rounded border border-gray-400 hover:bg-[#087990] hover:text-white hover:border-gray-300 transition"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="min-w-full border-separate border-spacing-0 rounded-xl">
          <thead className="bg-gray-300 sticky top-0 z-20">
            <tr>
              <th className="px-4 py-3 border text-left">Leave Type</th>
              <th className="px-4 py-3 border text-left">Reason</th>
              <th className="px-4 py-3 border text-left">Status</th>
              <th className="px-4 py-3 border text-left">StartDate</th>
              <th className="px-4 py-3 border text-left">EndDate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((leave, i) => (
              <tr
                key={i}
                className={`text-center ${
                  i % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                }`}
              >
                <td className="px-4 py-2 border">{leave.leaveType}</td>
                <td className="px-4 py-2 border">{leave.reason}</td>
                <td className="px-4 py-2 border">{leave.sts}</td>
                <td className="px-4 py-2 border">
                  {new Date(leave.startDate).toLocaleDateString("en-CA")}
                </td>

                <td className="px-4 py-2 border">
                  {new Date(leave.endDate).toLocaleDateString("en-CA")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
