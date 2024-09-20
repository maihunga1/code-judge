import express, { Router } from "express";
import { codeJudgeController } from "../controllers";
import { userController } from "../controllers";


export class CodeJudgeRouter {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    //login
    this.router.post("/login", userController.loginUser);

    //register
    this.router.post("/register", userController.registerUser);

    // Get all problems
    this.router.get("/problems", codeJudgeController.getAllProblems);

    // Get problem description
    this.router.get(
      "/problems/:titleSlug",
      codeJudgeController.getProblemDescription
    );

    //Get sample
    this.router.get(
      "/problems/:titleSlug/sample/:language",
      codeJudgeController.getSample
    );

    // Create a new submission
    this.router.post("/submissions", codeJudgeController.createSubmission);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export const codeJudgeRouter = new CodeJudgeRouter().getRouter();


