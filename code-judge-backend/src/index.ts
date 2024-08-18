import express, { Express } from "express";
import { codeJudgeRouter } from "./routes";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(codeJudgeRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
