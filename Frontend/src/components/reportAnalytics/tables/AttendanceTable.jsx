export default function AttendanceTable({ data }) {
  const handleExport = (type) => {
    window.open(
      `http://localhost:8090/api/v1/attendance/attendanceReport?type=${type}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      {/* Header with Export Buttons */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Attendance Report
        </h2>
        <div>
          <button
            onClick={() => handleExport("pdf")}
            className="bg-[#087990] text-white px-4 py-2 rounded mr-2  hover:text-[#087990]  hover:bg-gray-200 transition"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="bg-white text-[#087990] px-4 py-2 rounded border border-gray-400 hover:bg-[#087990]  hover:text-white hover:border-gray-300 transition"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse rounded-xl overflow-hidden">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-3 border text-left">Employee Name</th>
              <th className="px-4 py-3 border text-left">Date</th>
              <th className="px-4 py-3 border text-left">Check In</th>
              <th className="px-4 py-3 border text-left">Check Out</th>
              <th className="px-4 py-3 border text-left">Status</th>
              <th className="px-4 py-3 border text-left">Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            {data.map((att, i) => (
              <tr
                key={i}
                className={`text-center ${
                  i % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                }`}
              >
                <td className="px-4 py-2 border">{att.userId?.name}</td>
                <td className="px-4 py-2 border">{att.date}</td>
                <td className="px-4 py-2 border">
                  {att.inTime ? new Date(att.inTime).toLocaleTimeString() : "-"}
                </td>
                <td className="px-4 py-2 border">
                  {att.outTime
                    ? new Date(att.outTime).toLocaleTimeString()
                    : "-"}
                </td>
                <td className="px-4 py-2 border">{att.status}</td>
                <td className="px-4 py-2 border">{att.hoursWorked || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
