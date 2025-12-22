export default function LeaveDonut({ data = [] }) {
  const pending = data.filter((l) => l.status === "Pending").length;
  const approved = data.filter((l) => l.status === "Approved").length;

  return (
    <div className="bg-white p-4 shadow text-center  rounded-xl">
      <h3 className="font-semibold mb-4">Leave Status</h3>
      <div className="mx-auto h-32 w-32 rounded-full border-8 border-blue-500 border-t-gray-200" />
      <p className="mt-3 text-sm text-gray-500">
        Pending: {pending}, Approved: {approved}
      </p>
    </div>
  );
}
