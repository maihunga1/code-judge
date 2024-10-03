import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import { SubmissionModel } from "./models/submission.model";
import { isLanguage } from "../utils";

export class SubmissionDB {
  private readonly dynamoDBDocumentClient: DynamoDBDocumentClient;
  private readonly tableName = "n11744260-leetcode";
  private readonly qutUsername = "n11744260@qut.edu.au";

  constructor() {
    const dynamoDBClient = new DynamoDBClient({
      region: "ap-southeast-2",
      credentials: fromEnv(), // TODO: remove when deploying since we'll be using IAM role
    });

    this.dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  async listSubmissionsByUserID(userID: string): Promise<SubmissionModel[]> {
    const response = await this.dynamoDBDocumentClient.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "user_id = :userID",
        ExpressionAttributeValues: {
          ":userID": { S: userID },
        },
      })
    );

    return (
      (response.Items || []).map(
        (item) =>
          new SubmissionModel({
            "qut-username": this.qutUsername,
            submission_id: item.submission_id?.S ?? "",
            user_id: item.user_id?.S ?? "",
            title_slug: item.title_slug?.S ?? "",
            code_file_url: item.code_file_url?.S ?? "",
            language: item.language?.S ?? "",
            result: item.result?.S ?? "",
            message: item.message?.S ?? "",
            created: item.created?.S ? new Date(item.created.S) : new Date(),
          })
      ) || []
    );
  }

  async putSubmission(submission: SubmissionModel): Promise<void> {
    const item = {
      "qut-username": { S: this.qutUsername },
      submission_id: { S: submission.submissionID },
      user_id: { S: submission.userID },
      title_slug: { S: submission.titleSlug },
      code_file_url: { S: submission.codeFileURL },
      language: { S: submission.language },
      result: { S: submission.result },
      message: { S: submission.message },
      created: { S: submission.created.toISOString() },
    };

    await this.dynamoDBDocumentClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }
}

export const submissionDB = new SubmissionDB();
