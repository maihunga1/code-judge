import express, { Express } from "express";
import cors from "cors";
import { codeJudgeRouter } from "./routes";
import { createTable } from "./utils/dynamoDbClient";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();

createTable();


app.use(cors());

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(codeJudgeRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
