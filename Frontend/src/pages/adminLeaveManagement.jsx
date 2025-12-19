export default function UserLeaveManagement() {
  return (
    <div className="flex-1 p-6 space-y-6 border rounded-3xl bg-white">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Leave Management
      </h1>

      {/* Count Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-3xl border border-gray-300 shadow">
          <p className="text-lg text-black font-bold text-center">Total Leave Requests</p>
          <h2 className="bg-[#087990] w-12 h-12 mx-auto rounded-xl text-2xl font-bold text-white text-center flex items-center justify-center mt-2">12</h2>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-300 shadow">
          <p className="text-lg text-black font-bold text-center">Pending Leave Requests</p>
          <h2 className="bg-[#087990] w-12 h-12 mx-auto rounded-xl text-2xl font-bold text-white text-center flex items-center justify-center mt-2">3</h2>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-300 shadow">
          <p className="text-lg text-black font-bold text-center">Approved Leave Requests</p>
          <h2 className="bg-[#087990] w-12 h-12 mx-auto rounded-xl text-2xl font-bold text-white text-center flex items-center justify-center mt-2">7</h2>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-300 shadow">
          <p className="text-lg text-black font-bold text-center">Rejected Leave Requests</p>
          <h2 className="bg-[#087990] w-12 h-12 mx-auto rounded-xl text-2xl font-bold text-white text-center flex items-center justify-center mt-2">2</h2>
        </div>
      </div>

      {/* Leave History Table */}
      <div className="bg-white rounded-xl shadow p-4">
        {/* Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by User ID, Leave Type, Status..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087990]"
        />
      </div>

        <table className="w-full text-sm">
          <thead className="bg-[#087990] text-white">
            <tr>
              <th className="py-3 px-2 text-center border-r border-white">User ID</th>
              <th className="text-center border-r border-white">Leave Type</th>
              <th className="text-center border-r border-white">Start Date</th>
              <th className="text-center border-r border-white">End Date</th>
              <th className="text-center border-r border-white">Reason</th>
              <th className="text-center border-r border-white">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-[#E5E7EB] divide-y divide-white">
            <tr className="hover:bg-gray-200">
              <td className="py-3 px-2 text-center border-r border-white">USR-001</td>
              <td className="text-center border-r border-white">Casual</td>
              <td className="text-center border-r border-white">2025-02-10</td>
              <td className="text-center border-r border-white">2025-02-11</td>
              <td className="text-center border-r border-white">Personal errands</td>
              <td className="text-center border-r border-white">
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Pending</span>
              </td>
              <td className="text-center">
                <button className="text-sm px-3 py-1 bg-green-500 text-white rounded-lg mr-2">Approve</button>
                <button className="text-sm px-3 py-1 bg-red-500 text-white rounded-lg">Reject</button>
              </td>
            </tr>

            <tr className="hover:bg-gray-200">
              <td className="py-3 px-2 text-center border-r border-white">USR-002</td>
              <td className="text-center border-r border-white">Annual</td>
              <td className="text-center border-r border-white">2025-01-05</td>
              <td className="text-center border-r border-white">2025-01-10</td>
              <td className="text-center border-r border-white">Family vacation</td>
              <td className="text-center border-r border-white">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Approved</span>
              </td>
              <td className="text-center">-</td>
            </tr>

            <tr className="hover:bg-gray-200">
              <td className="py-3 px-2 text-center border-r border-white">USR-003</td>
              <td className="text-center border-r border-white">Sick</td>
              <td className="text-center border-r border-white">2025-01-18</td>
              <td className="text-center border-r border-white">2025-01-19</td>
              <td className="text-center border-r border-white">Fever</td>
              <td className="text-center border-r border-white">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Rejected</span>
              </td>
              <td className="text-center">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
