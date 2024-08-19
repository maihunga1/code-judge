import { Request, Response } from "express";
import { containerService } from "../services/docker.service";
import { BufferEntry, fileService } from "../services";
import {
  dockerImageByLanguage,
  getExecCommandByLanguage,
  getFileExtByLanguage,
  isLanguage,
} from "../utils";
import { ISortAndFilterParams } from "@codingsnack/leetcode-api/lib/models/ISortAndFilterParams";
import { Leetcode } from "@codingsnack/leetcode-api";

// csrfToken after you've logged in
const csrfToken =
  "mB8j4j3DeH1JG3NftAED54DYGiOpYy2pfBEoAmDuB7l60dLZCsHTDJ0N3FoUgJJH";
// LEETCODE_SESSION after you've logged in
const session =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMTEzMDc1ODgiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJhbGxhdXRoLmFjY291bnQuYXV0aF9iYWNrZW5kcy5BdXRoZW50aWNhdGlvbkJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI0ZWFkM2YzNzUxODNjYzYwOTk2Yzk2MTdlOTg5YTFhZDEwNjFjYzVkYmFkNmMyMWY1MDEyZjRlMmQwNmVlYWVlIiwiaWQiOjExMzA3NTg4LCJlbWFpbCI6Im1haWh1bmdhMkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Im1haWh1bmdfYWkiLCJ1c2VyX3NsdWciOiJtYWlodW5nX2FpIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2F2YXRhcnMvYXZhdGFyXzE2OTg4MzIwMjEucG5nIiwicmVmcmVzaGVkX2F0IjoxNzIzMjcwOTA1LCJpcCI6IjIwMDE6ODAwMzplYzczOjIwMTo1MDk1OjkyZTM6ODBjYjo4YjE0IiwiaWRlbnRpdHkiOiIzNjJkN2ZlM2Q4YjI1ODFiZmZhMzU5ZjBlZWRhNzEwNiIsInNlc3Npb25faWQiOjY3MTkzMjQ4LCJkZXZpY2Vfd2l0aF9pcCI6WyI2ZWJjNWI0MWU3YTNhNDQ5NGU3Mjc3ZDEzZDA2ZjZkNSIsIjIwMDE6ODAwMzplYzczOjIwMTo1MDk1OjkyZTM6ODBjYjo4YjE0Il19.NCmqzBfhSzwg8iAMlppS_JGvvdKvVuGZNvbimJs540U";

const lc = new Leetcode({ csrfToken, session });

const testCaseFilePath = "test-case.txt";

export class CodeJudgeController {
  public async getAllProblems(req: Request, res: Response) {
    try {
      const params: ISortAndFilterParams = {
        categorySlug: "",
        skip: 0,
        limit: 10,
        filters: {
          premiumOnly: false,
          orderBy: "FRONTEND_ID",
          sortOrder: "ASCENDING",
        },
      };
      const problems = await lc.getProblems(params);
      return res.json(problems);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public getProblemDescription = async (req: Request, res: Response) => {
    try {
      const problemTitleSlug = req.params.titleSlug;
      const problem = await lc.getProblem(problemTitleSlug);
      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }
      return res.json(problem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

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
