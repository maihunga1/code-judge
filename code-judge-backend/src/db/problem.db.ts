import { RowDataPacket } from "mysql2";
import preparedStatements, { StatementName } from "./statement";
import { Problem, ProblemModel } from "./models/problem.model";
import { memcacheClient } from "./cache";

export class ProblemDB {
  async getProblemByTitleSlug(titleSlug: string): Promise<ProblemModel | null> {
    const statement = preparedStatements.getPreparedStatement(
      StatementName.GET_PROBLEM_BY_TITLE_SLUG
    );

    try {
      const [rows] = await statement.execute([titleSlug]);

      if (Array.isArray(rows) && rows.length > 0) {
        const problemData = rows[0] as Problem & RowDataPacket;

        return new ProblemModel(problemData);
      }

      return null;
    } catch (error) {
      console.error("Error fetching problem by title slug:", error);
      throw error;
    }
  }

  async listProblems(): Promise<ProblemModel[]> {
    const cachedProblems = await memcacheClient.get<ProblemModel[]>("problems");
    if (cachedProblems) return cachedProblems;

    const statement = preparedStatements.getPreparedStatement(
      StatementName.LIST_PROBLEMS
    );

    try {
      const [rows] = await statement.execute([]);

      if (!Array.isArray(rows) || rows.length === 0) return [];

      const problems = rows.map(
        (row) => new ProblemModel(row as Problem & RowDataPacket)
      );

      await memcacheClient.set("problems", problems, 60 * 60 * 24);

      return problems;
    } catch (error) {
      console.error("Error listing problems:", error);
      throw error;
    }
  }
}

export const problemDB = new ProblemDB();
