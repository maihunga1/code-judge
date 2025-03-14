import express, { Router } from "express";
import { problemController } from "../controllers";

export class ProblemRouter {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get all problems
    this.router.get("/problems", problemController.listProblems);

    // Get problem description
    this.router.get(
      "/problems/:titleSlug",
      problemController.getProblemByTitleSlug
    );

    this.router.get(
      "/problems/:titleSlug/test-cases",
      problemController.getTestCases
    )
  }

  public getRouter(): Router {
    return this.router;
  }
}

export const problemRouter = new ProblemRouter().getRouter();
