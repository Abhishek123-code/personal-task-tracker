import express from "express";
import cors from "cors";
import taskRouter from "./routes/tasks.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", taskRouter);

app.listen(3000, () => {
  console.log("Taskservice is running on port 3000");
});
