import { Request, Response } from "express";
import { submissionService, problemService, userService } from "../services";

export class CodeJudgeController {
  async createSubmission(req: Request, res: Response): Promise<void> {
    const { titleSlug, codeFileContent, language: lang } = req.body;

    try {
      const result = await submissionService.createSubmission(
        titleSlug,
        codeFileContent,
        lang
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async listProblems(_: Request, res: Response): Promise<void> {
    const problems = await problemService.listProblems();

    res.status(200).json(problems);
  }

  async getProblemByTitleSlug(req: Request, res: Response): Promise<void> {
    const { titleSlug } = req.params;

    const problem = await problemService.getProblemByTitleSlug(titleSlug);

    res.status(200).json(problem);
  }

  async getUserByID(req: Request, res: Response): Promise<void> {
    const { userID } = req.params;
    const user = await userService.getUserByID(userID);
    res.status(200).json(user);
  }

  async listSubmissionsByUserID(req: Request, res: Response): Promise<void> {
    const { userID } = req.params;
    const submissions = await submissionService.listSubmissionsByUserID(userID);

    res.status(200).json(submissions);
  }
}

export const codeJudgeController = new CodeJudgeController();
