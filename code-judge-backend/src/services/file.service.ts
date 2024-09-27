import tar from "tar-stream";
import zlib from "zlib";
import fs from "fs";
import stream from "stream";
import { containerService } from "../services/docker.service";

export interface BufferEntry {
  fileName: string;
  content: string;
  type: "fileContent" | "filePath";
}

interface ContentStrategy {
  getContent(entry: BufferEntry): Buffer;
}

class FileContentStrategy implements ContentStrategy {
  getContent(entry: BufferEntry): Buffer {
    return Buffer.from(entry.content, "utf-8");
  }
}

class FilePathStrategy implements ContentStrategy {
  getContent(entry: BufferEntry): Buffer {
    return fs.readFileSync(entry.content);
  }
}

export class FileService {
  // Paths
  getFileProblemDescriptionPath(titleSlug: string): string {
    return `./problems/${titleSlug}/description.txt`;
  }

  getFileTestCasePath(titleSlug: string): string {
    return `./problems/${titleSlug}/test-case.txt`;
  }

  getFileCodeTemplatePath(titleSlug: string): string {
    return `./problems/${titleSlug}/sample.js`;
  }

  getFileContent(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8");
  }

  // Creating Tar Buffer
  async createTarBuffer(entries: BufferEntry[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const pack = tar.pack();

      entries.forEach((entry) => {
        const buffer = this.getContentStrategy(entry).getContent(entry);
        pack.entry({ name: entry.fileName }, buffer, (err) => {
          if (err) reject(err);
        });
      });

      pack.finalize();
      const passThrough = new stream.PassThrough();
      pack.pipe(zlib.createGzip()).pipe(passThrough);

      const chunks: Buffer[] = [];
      passThrough.on("data", (chunk) => chunks.push(chunk));
      passThrough.on("end", () => resolve(Buffer.concat(chunks)));
      passThrough.on("error", (err) => reject("Error creating compressed buffer: " + err));
    });
  }

  private getContentStrategy(entry: BufferEntry): ContentStrategy {
    return entry.type === "fileContent" ? new FileContentStrategy() : new FilePathStrategy();
  }

  // Getting all problems
  async getAllProblems(): Promise<{ titleSlug: string }[]> {
    const problemsDir = "./problems";
    const titleSlugs = await fs.promises.readdir(problemsDir);

    return titleSlugs.map((titleSlug) => ({ titleSlug }));
  }

  // Getting problem description
  async getProblemDescription(titleSlug: string): Promise<string> {
    const filePath = this.getFileProblemDescriptionPath(titleSlug);
    return this.getFileContent(filePath);
  }

  // Getting code sample
  async getSample(titleSlug: string): Promise<string> {
    const filePath = this.getFileCodeTemplatePath(titleSlug);
    return this.getFileContent(filePath);
  }
}

export const fileService = new FileService();