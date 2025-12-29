import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#7C3AED", "#087990"]; // purple, gray

export default function TaskDonut({ data = [] }) {
  const completed = data.filter((t) => t.status === "Completed").length;
  const pending = data.filter((t) => t.status !== "Completed").length;

  const chartData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  return (
    <div className="bg-white p-4 shadow text-center rounded-xl">
      <h3 className="font-semibold mb-4">Task Status</h3>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Completed: {completed}, Pending: {pending}
      </p>
    </div>
  );
}
