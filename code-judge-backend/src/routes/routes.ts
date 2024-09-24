import express, { Router } from "express";
import { codeJudgeController } from "../controllers";
import { authenticate } from "../middleware/authenticator";

export class CodeJudgeRouter {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Apply authenticate middleware to all routes
    this.router.use(authenticate);

    // Get all problems
    this.router.get("/problems", codeJudgeController.getAllProblems);

    // Get problem description
    this.router.get("/problems/:titleSlug", codeJudgeController.getProblemDescription);

    // Get sample
    this.router.get("/problems/:titleSlug/sample", codeJudgeController.getSample);

    // Create a new submission
    this.router.post("/submissions", codeJudgeController.createSubmission);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export const codeJudgeRouter = new CodeJudgeRouter().getRouter();


