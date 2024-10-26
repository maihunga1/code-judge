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

  async getFileTestCase(titleSlug: string): Promise<string> {
    const response = await fetch(`https://example.com/api/problems/${titleSlug}/test-case`);
    if (!response.ok) {
      throw new Error('Failed to retrieve test case content');
    }
    const data = await response.text();
    return data;
  }

  checkProblemExists = async (titleSlug: string): Promise<boolean> => {
    const filePath = await this.getFileTestCase(titleSlug);

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
}

export const fileService = new FileService();
