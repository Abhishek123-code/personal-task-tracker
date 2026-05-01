import axios from "axios";
import express from "express";
const analyticsRouter = express.Router();

const TASK_SERVICE_URL =
  process.env.TASK_SERVICE_URL || "http://localhost:3000";

type Task = {
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
};

type TaskServiceResponse = {
  tasks: Task[];
  totalTasks: number;
  totalPages: number;
};

const getTaskServiceErrorMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return err.response
      ? `Task service responded with ${err.response.status}`
      : err.message;
  }

  return err instanceof Error ? err.message : String(err);
};

analyticsRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

analyticsRouter.get("/analytics", async (req, res) => {
  try {
    const limit = 10;
    const firstPage = await axios.get<TaskServiceResponse>(
      `${TASK_SERVICE_URL}/task?page=1&limit=${limit}`,
    );

    const remainingPageRequests = Array.from(
      { length: Math.max(firstPage.data.totalPages - 1, 0) },
      (_, index) =>
        axios.get<TaskServiceResponse>(
          `${TASK_SERVICE_URL}/task?page=${index + 2}&limit=${limit}`,
        ),
    );

    const remainingPages = await Promise.all(remainingPageRequests);
    const tasks = [
      ...firstPage.data.tasks,
      ...remainingPages.flatMap((page) => page.data.tasks),
    ];

    const totalTasks = firstPage.data.totalTasks;
    const completedTasks = tasks.filter(
      (task) => task.status === "DONE",
    ).length;

    const tasksByDate = tasks.reduce<Record<string, number>>((acc, task) => {
      const date = new Date(task.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const tasksPerDay = Object.entries(tasksByDate).map(([date, count]) => ({
      date,
      count,
    }));

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      totalTasks,
      completedTasks,
      completionRate,
      tasksPerDay,
    });
  } catch (err) {
    res
      .status(500)
      .send(`Error fetching task data: ${getTaskServiceErrorMessage(err)}`);
  }
});

export default analyticsRouter;
