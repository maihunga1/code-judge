import express, { Express } from "express";
import cors from "cors";
import { codeJudgeRouter } from "./routes";
import dotenv from "dotenv";

const app: Express = express();

app.use(cors());

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(codeJudgeRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
