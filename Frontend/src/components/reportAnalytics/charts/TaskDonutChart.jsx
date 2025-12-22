export default function TaskDonut({ data = [] }) {
  const completed = data.filter((t) => t.status === "Completed").length;
  const pending = data.filter((t) => t.status !== "Completed").length;

  return (
    <div className="bg-white p-4 shadow text-center  rounded-xl">
      <h3 className="font-semibold mb-4">Task Status</h3>
      <div className="mx-auto h-32 w-32 rounded-full border-8 border-purple-500 border-t-gray-200" />
      <p className="mt-3 text-sm text-gray-500">
        Completed: {completed}, Pending: {pending}
      </p>
    </div>
  );
}
