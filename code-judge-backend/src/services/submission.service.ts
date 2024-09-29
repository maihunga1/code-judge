import { BufferEntry, fileService } from "./file.service";
import { containerService } from "./docker.service";
import {
  getDockerImageByLanguage,
  getExecCommandByLanguage,
  getFileExtByLanguage,
  isLanguage,
  Language,
} from "../utils";
import { submissionDB } from "../db/submission.db";
import { SubmissionModel } from "../db/models/submission.model";

class SubmissionService {
  async createSubmission(
    titleSlug: string,
    codeFileContent: string,
    lang: string
  ): Promise<{ result: string; message?: string }> {
    // Validate inputs
    if (
      typeof titleSlug !== "string" ||
      typeof codeFileContent !== "string" ||
      typeof lang !== "string" ||
      !isLanguage(lang)
    ) {
      throw new Error("Invalid submission parameters");
    }

    // Prepare code file entry
    const codeFileBufferEntry: BufferEntry = {
      fileName: `main.${getFileExtByLanguage[lang]}`,
      content: codeFileContent,
      type: "fileContent",
    };

    // Prepare test case file entry
    const testFileBufferEntry: BufferEntry = {
      fileName: "test-case.txt",
      content: fileService.getFileTestCasePath(titleSlug),
      type: "filePath",
    };

    // Create tar buffer
    const tarBuffer = await fileService.createTarBuffer([
      codeFileBufferEntry,
      testFileBufferEntry,
    ]);

    // Docker container management
    const containerID = await containerService.createContainer(
      getDockerImageByLanguage(lang)
    );
    await containerService.startContainer(containerID);
    await containerService.copyFileToContainer(containerID, tarBuffer);

    // Execute command
    const execResponse = await containerService.execCommand(
      containerID,
      getExecCommandByLanguage[lang]
    );

    // Clean up container
    containerService.killAndRemoveContainer(containerID);

    // TODO: Save submission to database using submissionService (which calls submissionDB)

    // Handle response
    if (!execResponse) {
      return { result: "passed" };
    } else {
      return { result: "failed", message: execResponse };
    }
  }

  async listSubmissionsByUserID(userID: string): Promise<SubmissionModel[]> {
    return submissionDB.listSubmissionsByUserID(userID);
  }
}

export const submissionService = new SubmissionService();
