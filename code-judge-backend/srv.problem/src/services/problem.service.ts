import { ProblemModel } from "../db/models/problem.model";
import { ProblemDB } from "../db/problem.db";
import { fileService } from "./file.service";
import { s3Service } from "./s3.service";

export class ProblemService {
  private readonly problemDB: ProblemDB;

  constructor() {
    this.problemDB = new ProblemDB();
  }

  async getProblemByTitleSlug(titleSlug: string): Promise<ProblemModel | null> {
    const problem = await this.problemDB.getProblemByTitleSlug(titleSlug);
    if (!problem) return null;

    await this.ensureProblemExists(titleSlug);

    // populate sample code and problem description
    const [sampleCode, problemDescription] = await Promise.all([
      fileService.getSample(titleSlug),
      fileService.getProblemDescription(titleSlug),
    ]);

    problem.sampleCode = sampleCode;
    problem.problemDescription = problemDescription;

    return problem;
  }

  async listProblems(): Promise<ProblemModel[]> {
    return this.problemDB.listProblems();
  }

  private async ensureProblemExists(titleSlug: string): Promise<void> {
    if (fileService.checkProblemExists(titleSlug)) return;

    await s3Service.fetchProblem(titleSlug);
  }
}

export const problemService = new ProblemService();
