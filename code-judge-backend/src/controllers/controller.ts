import { Request, Response } from "express";
import { containerService } from "../services/docker.service";
import { BufferEntry, fileService } from "../services";
import {
  dockerImageByLanguage,
  getExecCommandByLanguage,
  getFileExtByLanguage,
  isLanguage,
} from "../utils";

const testCaseFilePath = "test-case.txt";

export class CodeJudgeController {
  public async getAllProblems(req: Request, res: Response): Promise<void> {
    res.send("List of all problems");
  }

  public getProblemDescription(req: Request, res: Response): void {
    const { problemID } = req.params;
    res.send(`Description for problem ${problemID}`);
  }

  public async createSubmission(req: Request, res: Response): Promise<void> {
    const { problemID, codeFileContent, language: lang } = req.body;

    // TODO: move validation logic to a separate function
    if (typeof problemID !== "string") {
      res.status(400).send("problemID must be a string");
      return;
    }

    if (typeof codeFileContent !== "string") {
      res.status(400).send("codeFileContent must be a string");
      return;
    }

    if (typeof lang !== "string") {
      res.status(400).send("language must be a string");
      return;
    }

    if (!isLanguage(lang)) {
      res.status(400).send(`Invalid or unsupported language: ${lang}`);
      return;
    }

    const codeFileBufferEntry: BufferEntry = {
      fileName: `main.${getFileExtByLanguage[lang]}`,
      content: codeFileContent,
      type: "fileContent",
    };

    const testFileBufferEntry: BufferEntry = {
      fileName: testCaseFilePath,
      content: fileService.getFileTestCasePath(problemID),
      type: "filePath",
    };

    const tarBuffer = await fileService.createTarBuffer([
      codeFileBufferEntry,
      testFileBufferEntry,
    ]);

    const containerID = await containerService.createContainer(
      dockerImageByLanguage[lang]
    );

    await containerService.startContainer(containerID);

    await containerService.copyFileToContainer(containerID, tarBuffer);

    const execResponse = await containerService.execCommand(
      containerID,
      getExecCommandByLanguage[lang]
    );

    // no need to await for the container to be killed and removed
    containerService.killAndRemoveContainer(containerID);

    res.status(200);

    if (!execResponse) {
      res.send({
        result: "passed",
      });
    } else {
      res.send({
        result: "failed",
        message: execResponse,
      });
    }
  }
}

export const codeJudgeController = new CodeJudgeController();
