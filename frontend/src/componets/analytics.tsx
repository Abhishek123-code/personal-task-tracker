import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// The exact data structure we will configure Microservice B to send us
type AnalyticsData = {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  tasksPerDay: { date: string; count: number }[];
};

// Clean styling colors for the pie chart
const COLORS = ["#22c55e", "#e2e8f0"]; // Green for completed, light grey for pending

const ANALYTICS_API_URL =
  import.meta.env.VITE_ANALYTICS_API_URL ?? "http://localhost:30002/analytics";

export default function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // FETCH ANALYTICS INDEPENDENTLY
  useEffect(() => {
    // Analytics service runs independently on port 3001.
    axios
      .get(ANALYTICS_API_URL)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Analytics fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, []); // Note: In a larger app, we'd poll this or use websockets. For this assessment, load once is fine!

  // UI STATE: Loading
  if (loading)
    return (
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex items-center justify-center">
        <p className="text-slate-500 animate-pulse font-medium">
          Calculating analytics...
        </p>
      </section>
    );

  // UI STATE: Error (Microservice B isn't built/running yet!)
  if (error || !data)
    return (
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-2">Analytics Overview</h2>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-500">
          <p className="font-medium">Awaiting Microservice B</p>
          <p className="text-sm mt-1">
            Start the Analytics Service on port 3001 to view charts.
          </p>
        </div>
      </section>
    );

  // Data format specifically required by Recharts PieChart
  const pieData = [
    { name: "Completed", value: data.completedTasks },
    { name: "Pending", value: data.totalTasks - data.completedTasks },
  ];

  // UI STATE: Success (The Dashboard)
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold mb-6">Analytics Overview</h2>

      {/* TOP ROW: KPIs and Pie Chart */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Completion Rate
            </p>
            <p className="text-3xl font-bold text-slate-800">
              {data.completionRate}%
            </p>
          </div>
          {/* Recharts PieChart */}
          <div className="w-16 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={20}
                  outerRadius={30}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Total Tasks</p>
          <p className="text-3xl font-bold text-slate-800">{data.totalTasks}</p>
        </div>
      </div>

      {/* BOTTOM ROW: Bar Chart */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">
          Tasks Created Per Day
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.tasksPerDay}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
