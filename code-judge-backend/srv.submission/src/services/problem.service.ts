import { fileService } from "./file.service";

export class ProblemService {
  constructor() {}

  async ensureProblemExists(titleSlug: string): Promise<void> {
    if (await fileService.checkProblemExists(titleSlug)) return;
  }
}

export const problemService = new ProblemService();
