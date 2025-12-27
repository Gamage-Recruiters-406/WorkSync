import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function LeaveDonutChart({ data = [] }) {
  const annual = data.filter((l) => l.leaveType === "Annual").length;
  const casual = data.filter((l) => l.leaveType === "Casual").length;
  const sick = data.filter((l) => l.leaveType === "Sick").length;

  const chartData = [
    { name: "Annual", value: annual },
    { name: "Casual", value: casual },
    { name: "Sick", value: sick },
  ];

  const COLORS = ["#fbbf24", "#34d399"]; // yellow, green

  return (
    <div className="bg-white p-4 shadow text-center rounded-xl">
      <h3 className="font-semibold mb-4">Leave Status</h3>

      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        annual: {annual}, casual: {casual}
      </p>
    </div>
  );
}
