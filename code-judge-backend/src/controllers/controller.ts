import { Request, Response } from "express";
import { fileService } from "../services";
import { Language, isLanguage } from "../utils";
import { submissionService } from "../services/submission.service";

export class CodeJudgeController {
  public async getAllProblems(req: Request, res: Response) {
    try {
      const problems = await fileService.getAllProblems();
      res.status(200).json(problems);
    } catch (err) {
      console.error("Error reading problems directory:", err);
      res.status(500).json({ error: "Failed to fetch problems" });
    }
  }

  public getProblemDetails = async (req: Request, res: Response) => {
    const { titleSlug } = req.params;

    try {
      const description = await fileService.getProblemDescription(titleSlug);
      const sample = await fileService.getSample(titleSlug);
      res.status(200).json({ titleSlug, description, sample });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch problem details" });
    }
  };

  public async createSubmission(req: Request, res: Response): Promise<void> {
    const { titleSlug, codeFileContent, language: lang } = req.body;

    try {
      const result = await submissionService.createSubmission(titleSlug, codeFileContent, lang);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export const codeJudgeController = new CodeJudgeController();