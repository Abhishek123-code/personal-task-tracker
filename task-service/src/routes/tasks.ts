import { PrismaClient } from "../generated/prisma/client";
import express from "express";
const taskRouter = express.Router();

const prisma = new PrismaClient();

taskRouter.post("/task", async (req, res) => {
  try {
    const { title, priority, status } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        priority,
        status,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).send("Error Creating Task");
  }
});

taskRouter.get("/task", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const skip = (page - 1) * limit;

    const task = await prisma.task.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalTasks = await prisma.task.count();
    res.status(200).json({
      tasks: task,
      page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
    });
  } catch (err) {
    res.status(400).send("Error fetching tasks");
  }
});

taskRouter.patch("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, priority, status } = req.body;
    const taskUpdate = await prisma.task.update({
      where: { id },
      data: {
        title,
        priority,
        status,
      },
    });
    res.status(200).json(taskUpdate);
  } catch (err) {
    res.status(400).send("Error updating task");
  }
});

taskRouter.delete("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id },
    });

    res.status(204).json("Task deleted successfully");
  } catch (err) {
    res.status(400).send("Error deleting task");
  }
});
export default taskRouter;
