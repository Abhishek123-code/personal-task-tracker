import { useState } from "react";
import type { TaskStatus } from "./types";

type TaskFormProps = {
  onAddTask: (title: string, priority: string, status: TaskStatus) => void;
};

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [status, setStatus] = useState<TaskStatus>("TODO");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAddTask(title, priority, status);
    setTitle("");
    setPriority("LOW");
    setStatus("TODO");
  };

  return (
    <div className="mb-6 border-b border-slate-100 pb-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">
        Add a New Task
      </h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
