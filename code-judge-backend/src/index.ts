import express, { Express } from "express";
import cors from "cors";
import { codeJudgeRouter } from "./routes";
import dotenv from "dotenv";
import { ConfigService } from "./services/config.service";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(codeJudgeRouter);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    const configService = ConfigService.getInstance();
    await configService.initialize();

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
