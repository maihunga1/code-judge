import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { configService } from "./services/config.service";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await configService.initialize();
    console.log("Config service initialized");

    // import the codeJudgeRouter after the configService is initialized since codeJudgeRouter depends on the configService
    const { codeJudgeRouter } = await import("./routes");

    app.use(codeJudgeRouter);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
