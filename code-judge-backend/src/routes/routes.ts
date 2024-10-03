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
    this.router.get("/problems", codeJudgeController.listProblems);

    // Get problem description
    this.router.get(
      "/problems/:titleSlug",
      codeJudgeController.getProblemByTitleSlug
    );

    // Create a new submission
    this.router.post("/submissions", codeJudgeController.createSubmission);

    this.router.get("/user/:userID", codeJudgeController.getUserByID);

    this.router.get(
      "/submissions/:userID",
      codeJudgeController.listSubmissionsByUserID
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export const codeJudgeRouter = new CodeJudgeRouter().getRouter();
