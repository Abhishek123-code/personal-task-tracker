import axios from "axios";
import express from "express";
const analyticsRouter = express.Router();

const TASK_SERVICE_URL =
  process.env.TASK_SERVICE_URL || "http://localhost:3000";

analyticsRouter.get("/analytics", async (req, res) => {
  try {
    // Use /task (singular) and a high limit to retrieve tasks for accurate analytics
    const taskData = await axios.get(`${TASK_SERVICE_URL}/task?limit=1000`);

    const tasks = taskData.data.tasks;
    const totalTasks = taskData.data.totalTasks;
    const completedTasks = tasks.filter(
      (task: any) => task.status === "DONE",
    ).length;
    let completionRate = 0;
    if (totalTasks > 0) {
      completionRate = (completedTasks / totalTasks) * 100;
    }
    res.status(200).json({
      totalTasks,
      completedTasks,
      completionRate,
    });
  } catch (err) {
    res.status(500).send("Error fetching task data" + err);
  }
});

export default analyticsRouter;
