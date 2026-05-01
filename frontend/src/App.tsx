import axios from "axios";
import { useEffect, useState } from "react";
import AnalyticsOverview from "./componets/analytics";
import type { Task } from "./componets/types";
import TaskList from "./componets/taskList";
import TaskForm from "./componets/taskform";

type TaskApiResponse = {
  tasks: Task[];
  page: number;
  totalPages: number;
  totalTasks: number;
};

function App() {
  const [taskData, setTaskData] = useState<TaskApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/task?page=${currentPage}`,
        );
        setTaskData(response.data);
      } catch (err) {
        console.error("Error fetching tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      <header className="mb-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600">Task Dashboard</h1>
        <p className="text-slate-500">
          Manage tasks and view real-time analytics.
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <TaskForm />
          <TaskList
            taskData={taskData}
            loading={loading}
            onPageChange={setCurrentPage}
          />
        </section>

        {/* RIGHT COLUMN */}
        <AnalyticsOverview />
      </main>
    </div>
  );
}

export default App;
