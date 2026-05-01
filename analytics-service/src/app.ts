import express from "express";
import cors from "cors";
import analyticsRouter from "./analytics.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", analyticsRouter);

app.listen(3001, () => {
  console.log("Analytics Service running on port 3001");
});
