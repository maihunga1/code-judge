import mysql from "mysql2/promise";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import dotenv from "dotenv";
dotenv.config();

async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManagerClient({ region: "ap-southeast-2" });
  const command = new GetSecretValueCommand({ SecretId: secretName });

  const response = await client.send(command);

  if (response.SecretString) {
    return response.SecretString;
  } else {
    throw new Error("Secret string not found");
  }
}

export enum StatementName {
  GET_USER_BY_ID = "getUserById",
  GET_PROBLEM_BY_TITLE_SLUG = "getProblemByTitleSlug",
  LIST_PROBLEMS = "listProblems",
}

class PreparedStatements {
  private pool!: mysql.Pool;
  private preparedStatements: Record<string, mysql.PreparedStatementInfo> = {};

  constructor() {
    this.initializePool();
  }

  private async initializePool() {
    const secret = await getSecret("n11744260-rds-secret");
    const secretJSON = JSON.parse(secret);

    this.pool = mysql.createPool({
      host: secretJSON.host,
      user: secretJSON.username,
      password: secretJSON.password,
      database: secretJSON.dbInstanceIdentifier,
      port: secretJSON.port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await this.pool.getConnection();
    await connection.ping();
    connection.release();
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
