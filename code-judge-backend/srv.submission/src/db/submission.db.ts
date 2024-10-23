import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import { SubmissionModel } from "./models/submission.model";

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
          ":userID": userID,
        },
      })
    );

    return (
      (response.Items || []).map(
        (item) =>
          new SubmissionModel({
            "qut-username": this.qutUsername,
            submission_id: item.submission_id,
            user_id: item.user_id,
            title_slug: item.title_slug,
            language: item.language,
            result: item.result,
            message: item.message,
            created: item.created ? new Date(item.created) : new Date(),
          })
      ) || []
    );
  }

  async putSubmission(submission: SubmissionModel): Promise<void> {
    const item: any = {
      "qut-username": this.qutUsername,
      submission_id: submission.submissionID,
      user_id: submission.userID,
      title_slug: submission.titleSlug,
      result: submission.result,
      language: submission.language,
      message: submission.message,
      created: submission.created.toISOString(),
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
