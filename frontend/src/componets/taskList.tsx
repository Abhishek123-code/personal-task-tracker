import type { Task } from "./types";

type TaskApiResponse = {
  tasks: Task[];
  page: number;
  totalPages: number;
  totalTasks: number;
};

type props = {
  taskData: TaskApiResponse | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onToggleStatus: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
};
const TaskList = ({
  taskData,
  loading,
  onPageChange,
  onToggleStatus,
  onDeleteTask,
}: props) => {
  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-semibold">Your tasks</h1>
        <p className="mt-4">Loading Tasks....</p>
      </div>
    );
  }

  if (!taskData || taskData.tasks.length === 0) {
    return (
      <div>
        <h1 className="text-xl font-semibold">Your tasks</h1>
        <p className="mt-4">No tasks found.</p>
      </div>
    );
  }

  const { tasks, page, totalPages, totalTasks } = taskData;

  const handlePrevPage = () => onPageChange(page - 1);
  const handleNextPage = () => onPageChange(page + 1);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Your tasks ({totalTasks})</h1>
        <span className="text-sm text-slate-500">
          Page {page} of {totalPages}
        </span>
      </div>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="border-b border-slate-200 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-800">{task.title}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span>Priority: {task.priority}</span>
                  <span>Status: {task.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onToggleStatus(task)}
                  className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  Toggle
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={handlePrevPage}
          disabled={page <= 1}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page >= totalPages}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default TaskList;
