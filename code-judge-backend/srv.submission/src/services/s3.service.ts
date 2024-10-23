import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { fileService } from "./file.service";

export class S3Service {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: "ap-southeast-2",
    });
  }

  async fetchProblem(titleSlug: string): Promise<void> {
    const listCommand = new ListObjectsV2Command({
      Bucket: "n11744260-leetcode",
      Prefix: `problems/${titleSlug}`,
    });

    try {
      const listResponse = await this.s3Client.send(listCommand);
      const objects = listResponse.Contents || [];

      await Promise.all(
        objects.map(async (object) => {
          const getCommand = new GetObjectCommand({
            Bucket: "n11744260-leetcode",
            Key: object.Key,
          });

          const response = await this.s3Client.send(getCommand);
          const content = await this.streamToString(response.Body);

          if (!object.Key) throw new Error("Object key is undefined");

          await fileService.writeS3Object(object.Key, content);
        })
      );
    } catch (error) {
      console.error("Error fetching objects:", error);
      throw error;
    }
  }

  private async streamToString(stream: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
  }
}

export const s3Service = new S3Service();
