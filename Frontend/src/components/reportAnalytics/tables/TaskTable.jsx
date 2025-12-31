export default function TaskTable({ data }) {
  const handleExport = (type) => {
    window.open(`/api/v1/tasks/export?type=${type}`, "_blank"); // make sure backend route exists
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Tasks Report</h2>
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
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse rounded-xl overflow-hidden">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 border text-left">Task Name</th>
              <th className="px-4 py-2 border text-left">createdAt</th>
              <th className="px-4 py-2 border text-left">Priority</th>
              <th className="px-4 py-2 border text-left">Deadline</th>
              <th className="px-4 py-2 border text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((task, i) => (
              <tr
                key={i}
                className={`text-center ${
                  i % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                }`}
              >
                <td className="px-4 py-2 border">{task.title}</td>
                <td className="px-4 py-2 border">
                  {task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2 border">{task.priority}</td>
                <td className="px-4 py-2 border">
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2 border">{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
