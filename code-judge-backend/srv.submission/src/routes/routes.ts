import express, { Router } from "express";
import { submissionController } from "../controllers";

export class SubmissionRouter {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Create a new submission
    this.router.post("/submissions", submissionController.createSubmission);

    this.router.get(
      "/submissions/:userID",
      submissionController.listSubmissionsByUserID
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export const submissionRouter = new SubmissionRouter().getRouter();
