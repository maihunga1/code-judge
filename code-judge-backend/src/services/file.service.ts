import tar from "tar-stream";
import zlib from "zlib";
import fs from "fs";
import stream from "stream";
import { getFileExtByLanguage, dockerImageByLanguage, getExecCommandByLanguage, isLanguage, Language } from "../utils";
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

  getFileCodeTemplatePath(titleSlug: string, language: Language): string {
    const ext = getFileExtByLanguage[language];
    return `./problems/${titleSlug}/sample.${ext}`;
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

  // Docker operations moved from Controller
  async createSubmission(titleSlug: string, codeFileContent: string, lang: string): Promise<{ result: string; message?: string }> {
    if (!isLanguage(lang)) throw new Error(`Invalid or unsupported language: ${lang}`);

    const codeFileBufferEntry: BufferEntry = {
      fileName: `main.${getFileExtByLanguage[lang]}`,
      content: codeFileContent,
      type: "fileContent",
    };

    const testFileBufferEntry: BufferEntry = {
      fileName: "test-case.txt",
      content: this.getFileTestCasePath(titleSlug),
      type: "filePath",
    };

    const tarBuffer = await this.createTarBuffer([codeFileBufferEntry, testFileBufferEntry]);

    const containerID = await containerService.createContainer(dockerImageByLanguage[lang]);
    await containerService.startContainer(containerID);
    await containerService.copyFileToContainer(containerID, tarBuffer);

    const execResponse = await containerService.execCommand(containerID, getExecCommandByLanguage[lang]);

    containerService.killAndRemoveContainer(containerID); // Cleanup container after execution

    return execResponse
      ? { result: "failed", message: execResponse }
      : { result: "passed" };
  }

  // Getting all problems
  async getAllProblems(): Promise<{ titleSlug: string; description: string }[]> {
    const problemsDir = "./problems";
    const titleSlugs = await fs.promises.readdir(problemsDir);

    return Promise.all(
      titleSlugs.map(async (titleSlug) => {
        const descriptionPath = `${problemsDir}/${titleSlug}/description.txt`;
        try {
          const description = await fs.promises.readFile(descriptionPath, "utf8");
          return { titleSlug, description };
        } catch (err) {
          return { titleSlug, description: "Failed to read description" };
        }
      })
    );
  }

  // Getting problem description
  async getProblemDescription(titleSlug: string): Promise<string> {
    const filePath = this.getFileProblemDescriptionPath(titleSlug);
    return this.getFileContent(filePath);
  }

  // Getting code sample
  async getSample(titleSlug: string, language: Language): Promise<string> {
    const filePath = this.getFileCodeTemplatePath(titleSlug, language);
    return this.getFileContent(filePath);
  }
}

export const fileService = new FileService();
