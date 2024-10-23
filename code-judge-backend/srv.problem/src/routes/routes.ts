import express, { Router } from "express";
import { problemController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";

export class ProblemRouter {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Apply authenticate middleware to all routes
    this.router.use(authenticate);

    // Get all problems
    this.router.get("/problems", problemController.listProblems);

    // Get problem description
    this.router.get(
      "/problems/:titleSlug",
      problemController.getProblemByTitleSlug
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export const problemRouter = new ProblemRouter().getRouter();
