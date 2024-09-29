import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import { SubmissionModel } from "./models/submission.model";

export class SubmissionDB {
  private readonly dynamoDBDocumentClient: DynamoDBDocumentClient;
  private readonly tableName = "n11744260-leetcode";

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
}

export const submissionDB = new SubmissionDB();
