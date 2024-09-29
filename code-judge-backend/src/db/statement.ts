import mysql from "mysql2/promise";

export enum StatementName {
  GET_USER_BY_ID = "getUserById",
  GET_PROBLEM_BY_TITLE_SLUG = "getProblemByTitleSlug",
  LIST_PROBLEMS = "listProblems",
}

class PreparedStatements {
  private pool: mysql.Pool;
  private preparedStatements: Record<string, mysql.PreparedStatementInfo> = {};

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "leetcode",
      port: parseInt(process.env.DB_PORT || "3306"),
      connectionLimit: 10, // Set the maximum number of connections in the pool
      queueLimit: 0, // Unlimited queue
      waitForConnections: true, // Wait for available connection
    });
  }

  public async initialize() {
    const connection = await this.pool.getConnection();

    this.preparedStatements[StatementName.GET_USER_BY_ID] =
      await connection.prepare("SELECT * FROM user WHERE userID = ? LIMIT 1");

    this.preparedStatements[StatementName.GET_PROBLEM_BY_TITLE_SLUG] =
      await connection.prepare(
        "SELECT * FROM problem WHERE title_slug = ? LIMIT 1"
      );

    this.preparedStatements[StatementName.LIST_PROBLEMS] =
      await connection.prepare("SELECT * FROM problem");

    connection.release();
  }

  public getPreparedStatement(
    statementName: StatementName
  ): mysql.PreparedStatementInfo {
    return this.preparedStatements[statementName];
  }
}

export default new PreparedStatements();
