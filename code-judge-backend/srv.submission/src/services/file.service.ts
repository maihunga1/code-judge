import tar from "tar-stream";
import zlib from "zlib";
import fs from "fs";
import stream from "stream";

import {
  getFileExtByLanguage,
  Language,
  languageExt,
  SUPPORTED_LANGUAGES,
} from "../utils";
import path from "path";

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
  private readonly basePath: string;

  constructor() {
    this.basePath = path.join(__dirname, "..", ".."); // Go up two levels to reach the project root
  }

  getFileProblemDescriptionPath(titleSlug: string): string {
    return path.join(this.basePath, "problems", titleSlug, "description.txt");
  }

  getFileTestCasePath(titleSlug: string): string {
    return path.join(this.basePath, "problems", titleSlug, "test-case.txt");
  }

  getFileCodeTemplatePath(titleSlug: string, ext: languageExt): string {
    return path.join(this.basePath, "problems", titleSlug, `sample.${ext}`);
  }

  getFileContent(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8");
  }

  checkProblemExists(titleSlug: string): boolean {
    const filePath = this.getFileProblemDescriptionPath(titleSlug);

    return fs.existsSync(filePath);
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
      passThrough.on("error", (err) =>
        reject("Error creating compressed buffer: " + err)
      );
    });
  }

  private getContentStrategy(entry: BufferEntry): ContentStrategy {
    return entry.type === "fileContent"
      ? new FileContentStrategy()
      : new FilePathStrategy();
  }

  async writeS3Object(objectKey: string, content: string): Promise<void> {
    const filePath = path.join(this.basePath, objectKey);

    await this.writeFile(filePath, content);
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    if (!fs.existsSync(filePath)) {
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    }

    await fs.promises.writeFile(filePath, content);
  }
}

export const fileService = new FileService();
