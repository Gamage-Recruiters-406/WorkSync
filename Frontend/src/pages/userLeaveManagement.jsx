export default function UserLeaveManagement() {

  return (
    <div className="flex-1 p-6 space-y-6 border rounded-3xl bg-white">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Request Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow p-4 border border-gray-200">
          <h2 className="text-lg font-medium mb-4">
            Leave Request Form
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Side */}
            <div className="space-y-3">
              <div>
                <label className="text-gray-600">
                  Leave ID
                </label>
                <input
                  type="text"
                  placeholder="FR-LV-001"
                  className="w-full border rounded-lg p-2 mt-2"
                />
              </div>

              <div>
                <label className="text-gray-600">
                  Leave Type
                </label>
                <select className="w-full border rounded-lg p-2 mt-2">
                  <option className="text-gray-400" value="">Select Type</option>
                  <option>Annual Leave</option>
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                </select>
              </div>

              <div>
                <label className="text-gray-600">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2 mt-2"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-3">
              <div>
                <label className="text-gray-600">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2 mt-2"
                />
              </div>

              <div>
                <label className="text-gray-600">
                  Reason
                </label>
                <textarea
                  rows="4"
                  placeholder="Message"
                  className="w-full h-32 border rounded-lg p-2 mt-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-[#087990] text-white px-4 py42 w-40 rounded-lg hover:bg-[#]"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-white border-2 rounded-3xl border-[#087990] hover:bg-[#087990] hover:text-white
                  
                  text-gray-800 px-4 py-2 w-40 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Leave Balance */}
        <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
            <h2 className="text-lg font-medium mb-4">
                Leave Balance
            </h2>

        {/* Annual Leave */}
        <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
            <span>Annual Leave</span>
            <span className="font-semibold">12 / 20 Days</span>
            </div>
            <div className="w-full h-5 bg-gray-200 rounded-full">
            <div
                className="bg-[#087990] h-5 rounded-full"
                style={{ width: "60%" }}
            ></div>
            </div>
        </div>

        {/* Sick Leave */}
        <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
            <span>Sick Leave</span>
            <span className="font-semibold">5 / 10 Days</span>
            </div>
            <div className="w-full h-5 bg-gray-200 rounded-full">
            <div
                className="bg-[#087990] h-5 rounded-full"
                style={{ width: "50%" }}
            ></div>
            </div>
        </div>

        {/* Casual Leave */}
        <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
            <span>Casual Leave</span>
            <span className="font-semibold">6 / 10 Days</span>
            </div>
            <div className="w-full h-5 bg-gray-200 rounded-full">
            <div
                className="bg-[#087990] h-5 rounded-full"
                style={{ width: "60%" }}
            ></div>
            </div>
        </div>

        {/* Rejected Leave */}
        <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
            <span>Rejected Leave</span>
            <span className="font-semibold">4 Days</span>
            </div>
            <div className="w-full h-5 bg-gray-200 rounded-full">
            <div
                className="bg-red-500 h-5 rounded-full"
                style={{ width: "40%" }}
            ></div>
            </div>
        </div>

        {/* Pending Leave */}
        <div>
            <div className="flex justify-between text-sm mb-1">
            <span>Pending Leave</span>
            <span className="font-semibold">2 Days</span>
            </div>
            <div className="w-full h-5 bg-gray-200 rounded-full">
            <div
                className="bg-orange-500 h-5 rounded-full"
                style={{ width: "20%" }}
            ></div>
            </div>
        </div>
        
        </div>

      </div>

      {/* Leave History Table */}
    <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-medium mb-4">
            Leave History
        </h2>

        <table className="w-full text-sm">
            <thead className="bg-[#087990] text-white">
            <tr>
                <th className="py-3 px-2 text-left">Leave ID</th>
                <th className="text-left">Employee</th>
                <th className="text-left">Leave Type</th>
                <th className="text-left">Start Date</th>
                <th className="text-left">End Date</th>
                <th className="text-left">Reason</th>
                <th className="text-left">Status</th>
                <th className="text-left">Approved By</th>
            </tr>
            </thead>
            <tbody className="divide-y">
            <tr className="hover:bg-gray-50">
                <td className="py-3 px-2">FR-LV-001</td>
                <td>Kasun Perera</td>
                <td>Casual</td>
                <td>2025-02-10</td>
                <td>2025-02-11</td>
                <td>Personal errands</td>
                <td>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                    Pending
                </span>
                </td>
                <td>-</td>
            </tr>

            <tr className="hover:bg-gray-50">
                <td className="py-3 px-2">FR-LV-002</td>
                <td>Nimali Silva</td>
                <td>Annual</td>
                <td>2025-01-05</td>
                <td>2025-01-10</td>
                <td>Family vacation</td>
                <td>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Approved
                </span>
                </td>
                <td>Manager A</td>
            </tr>

            <tr className="hover:bg-gray-50">
                <td className="py-3 px-2">FR-LV-003</td>
                <td>Chamod Fernando</td>
                <td>Sick</td>
                <td>2025-01-18</td>
                <td>2025-01-19</td>
                <td>Fever</td>
                <td>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                    Rejected
                </span>
                </td>
                <td>Manager B</td>
            </tr>
            </tbody>
        </table>
    </div>

    </div>
  );
}
