import tar from "tar-stream";
import zlib from "zlib";
import fs from "fs";
import stream from "stream";

import { getFileExtByLanguage } from "../utils";
import type { Language } from "../utils";

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

class FileService {
  getFileProblemDescriptionPath(problemID: string): string {
    return `./problems/${problemID}/description.txt`;
  }

  getFileTestCasePath(problemID: string): string {
    return `./problems/${problemID}/test-case.txt`;
  }

  getFileCodeTemplatePath(problemID: string, language: Language): string {
    const ext = getFileExtByLanguage[language];

    return `./problems/${problemID}/code_template.${ext}`;
  }

  getFileContent(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8");
  }

  async createTarBuffer(entries: BufferEntry[]): Promise<Buffer> {
    try {
      return new Promise((resolve, reject) => {
        const pack = tar.pack();

        entries.forEach((entry) => {
          const buffer = this.getContentStrategy(entry).getContent(entry);

          pack.entry({ name: entry.fileName }, buffer, (err) => {
            if (err) throw err;
          });
        });

        pack.finalize();

        const passThrough = new stream.PassThrough();

        // Pipe the tar stream through gzip and then to the PassThrough
        pack.pipe(zlib.createGzip()).pipe(passThrough);

        // Collect the compressed data in a buffer
        const chunks: Buffer[] = [];

        passThrough.on("data", (chunk) => chunks.push(chunk));

        passThrough.on("end", () => resolve(Buffer.concat(chunks)));

        passThrough.on("error", (err) =>
          reject("Error creating compressed buffer: " + err)
        );
      });
    } catch (error) {
      console.error("Error creating tar buffer:", error);
      throw error;
    }
  }

  private getContentStrategy(entry: BufferEntry): ContentStrategy {
    return entry.type === "fileContent"
      ? new FileContentStrategy()
      : new FilePathStrategy();
  }
}

export const fileService = new FileService();
