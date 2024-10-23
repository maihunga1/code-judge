import { Request, Response } from "express";
import { submissionService } from "../services";

export class SubmissionController {
  async createSubmission(req: Request, res: Response): Promise<void> {
    const { titleSlug, codeFileContent, language: lang } = req.body;
    const { userId: userID } = req.user.identities[0];

    if (!userID) throw new Error("User ID not found in token");

    try {
      const result = await submissionService.createSubmission(
        titleSlug,
        codeFileContent,
        lang,
        userID
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async listSubmissionsByUserID(req: Request, res: Response): Promise<void> {
    const { userID } = req.params;
    const submissions = await submissionService.listSubmissionsByUserID(userID);

    res.status(200).json(submissions);
  }
}

export const submissionController = new SubmissionController();
