import express, { Express } from "express";
import cors from "cors";
import { codeJudgeRouter } from "./routes";
import mongoose from "mongoose";

const app: Express = express();

const db = process.env.MONGO_URI || "mongodb://localhost:27017/code-judge";

mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors());

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(codeJudgeRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
