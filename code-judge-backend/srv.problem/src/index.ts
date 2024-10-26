import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { configService } from "./services/config.service";
import preparedStatements from "./db/statement";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;



async function startServer() {
  try {
    await configService.initialize();
    await preparedStatements.initialize();

    // import the problemRouter after the configService is initialized since problemRouter depends on the configService
    const { problemRouter } = await import("./routes");

    app.use(problemRouter);

    app.get("/health", (_, res) => {
      res.status(200).json({ status: "healthy" });
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
