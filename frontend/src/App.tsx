import axios from "axios";
import { useEffect, useState } from "react";
import AnalyticsOverview from "./componets/analytics";
import type { Task, TaskStatus } from "./componets/types";
import TaskList from "./componets/taskList";
import TaskForm from "./componets/taskform";

const TASK_API_URL =
  import.meta.env.VITE_TASK_API_URL ?? "http://localhost:3000/task";

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
        const response = await axios.get(`${TASK_API_URL}?page=${currentPage}`);
        setTaskData(response.data);
      } catch (err) {
        console.error("Error fetching tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [currentPage]);

  // CREATE
  const handleAddTask = async (
    title: string,
    priority: string,
    status: TaskStatus,
  ) => {
    try {
      const response = await axios.post(TASK_API_URL, {
        title,
        priority,
        status,
      });
      if (taskData) {
        setTaskData({
          ...taskData,
          tasks: [response.data, ...taskData.tasks],
          totalTasks: taskData.totalTasks + 1,
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // UPDATE
  const handleToggleStatus = async (task: Task) => {
    const nextStatusByStatus: Record<TaskStatus, TaskStatus> = {
      TODO: "IN_PROGRESS",
      IN_PROGRESS: "DONE",
      DONE: "TODO",
    };
    const newStatus = nextStatusByStatus[task.status];
    try {
      const response = await axios.patch(`${TASK_API_URL}/${task.id}`, {
        ...task,
        status: newStatus,
      });
      if (taskData) {
        setTaskData({
          ...taskData,
          tasks: taskData.tasks.map((t) =>
            t.id === task.id ? response.data : t,
          ),
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // DELETE
  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${TASK_API_URL}/${taskId}`);
      if (taskData) {
        setTaskData({
          ...taskData,
          tasks: taskData.tasks.filter((t) => t.id !== taskId),
          totalTasks: taskData.totalTasks - 1,
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

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
          <TaskForm onAddTask={handleAddTask} />
          <TaskList
            taskData={taskData}
            loading={loading}
            onPageChange={setCurrentPage}
            onToggleStatus={handleToggleStatus}
            onDeleteTask={handleDeleteTask}
          />
        </section>

        {/* RIGHT COLUMN */}
        <AnalyticsOverview />
      </main>
    </div>
  );
}

export default App;
