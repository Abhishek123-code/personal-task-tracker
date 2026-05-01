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
};
const TaskList = ({ taskData, loading, onPageChange }: props) => {
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
  {
    console.log(page + " " + totalPages);
  }

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
            <h3 className="font-medium text-slate-800">{task.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
              <span>Priority: {task.priority}</span>
              <span>Status: {task.status}</span>
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
