import express, { Router } from "express";
import { codeJudgeController } from "../controllers";

export class CodeJudgeRouter {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    //login
    this.router.post("/login", codeJudgeController.loginUser);

    //register
    this.router.post("/register", codeJudgeController.registerUser);

    // Get all problems
    this.router.get("/problems", codeJudgeController.getAllProblems);

    // Get problem description
    this.router.get(
      "/problems/:titleSlug",
      codeJudgeController.getProblemDescription
    );

    // Create a new submission
    this.router.post("/submissions", codeJudgeController.createSubmission);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export const codeJudgeRouter = new CodeJudgeRouter().getRouter();


