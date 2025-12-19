export default function AttendanceBar({ data = [] }) {
  const present = data.filter((a) => a.status === "Present").length;
  const absent = data.filter((a) => a.status === "Absent").length;
  const leave = data.filter((a) => a.status === "leave").length;
  return (
    <div className="bg-white p-4 rounded shadow  rounded-xl">
      <h3 className="font-semibold mb-4">Attendance Overview</h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm">Present</p>
          <div
            className="h-4 bg-green-500 rounded"
            style={{ width: `${present}%` }}
          />
        </div>
        <div>
          <p className="text-sm">Absent</p>
          <div
            className="h-4 bg-red-500 rounded"
            style={{ width: `${absent}%` }}
          />
        </div>
        <div>
          <p className="text-sm">leave</p>
          <div
            className="h-4 bg-red-500 rounded"
            style={{ width: `${leave}%` }}
          />
        </div>
      </div>
    </div>
  );
}
