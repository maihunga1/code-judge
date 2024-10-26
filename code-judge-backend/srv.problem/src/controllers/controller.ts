import { Request, Response } from "express";
import { problemService } from "../services";

export class ProblemController {
  async listProblems(_: Request, res: Response): Promise<void> {
    const problems = await problemService.listProblems();

    res.status(200).json(problems);
  }

  async getProblemByTitleSlug(req: Request, res: Response): Promise<void> {
    const { titleSlug } = req.params;

    const problem = await problemService.getProblemByTitleSlug(titleSlug);

    res.status(200).json(problem);
  }

  async getTestCases(req: Request, res: Response): Promise<void> {
    const { titleSlug } = req.params;

    const testCases = await problemService.getTestCases(titleSlug);

    res.status(200).json(testCases);
  }
}

export const problemController = new ProblemController();
