import { fileService } from "./file.service";
import { s3Service } from "./s3.service";

export class ProblemService {
  constructor() {}

  async ensureProblemExists(titleSlug: string): Promise<void> {
    if (fileService.checkProblemExists(titleSlug)) return;

    await s3Service.fetchProblem(titleSlug);
  }
}

export const problemService = new ProblemService();
