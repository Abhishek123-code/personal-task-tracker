export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  title: string;
  priority: string;
  status: TaskStatus;
  createdAt: string;
};
