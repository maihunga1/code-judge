import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { configService } from "./services/config.service";
import preparedStatements from "./db/statement";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await configService.initialize();
    await preparedStatements.initialize();

    // import the submissionRouter after the configService is initialized since submissionRouter depends on the configService
    const { submissionRouter } = await import("./routes");

    app.use(submissionRouter);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();