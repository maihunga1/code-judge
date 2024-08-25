import { Request, Response } from "express";
import { containerService } from "../services/docker.service";
import { BufferEntry, fileService } from "../services";
import {
  dockerImageByLanguage,
  getExecCommandByLanguage,
  getFileExtByLanguage,
  isLanguage,
} from "../utils";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { User } from "../model/User";


const testCaseFilePath = "test-case.txt";

const users = [
  {
    username: "admin",
    password: "admin",
  },
];

export class CodeJudgeController {
  public loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1h" }
      );
      return res.json({ message: "Successfully logged in", token });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };

  public registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({ username, password });
      await newUser.save();
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };

  public async getAllProblems(req: Request, res: Response) {
    const problemsDir = path.join(__dirname, '..', '..', "problems");

    try {
      const titleSlugs = await fs.promises.readdir(problemsDir);

      const problems = await Promise.all(
        titleSlugs.map(async (titleSlug) => {
          const descriptionPath = path.join(
            problemsDir,
            titleSlug,
            "description.txt"
          );
          try {
            const description = await fs.promises.readFile(
              descriptionPath,
              "utf8"
            );
            return { titleSlug, description };
          } catch (err) {
            console.error(`Error reading description for ${titleSlug}:`, err);
            return { titleSlug, description: "Failed to read description" };
          }
        })
      );
      res.status(200).json(problems);
    } catch (err) {
      console.error("Error reading problems directory:", err);
      res.status(500).json({ error: "Failed to fetch problems" });
    }
  }


  public getProblemDescription = async (req: Request, res: Response) => {
    const { titleSlug } = req.params;

    // Construct the file path
    const filePath = path.join(
      __dirname, '..', '..',
      `problems/${titleSlug}/description.txt`
    );

    // Read the file content
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res
          .status(500)
          .json({ error: "Failed to read problem description" });
      }

      // Send the file content as the response
      res.status(200).send(data);
    });
  };

  public async createSubmission(req: Request, res: Response): Promise<void> {
    const { titleSlug, codeFileContent, language: lang } = req.body;

    // TODO: move validation logic to a separate function
    if (typeof titleSlug !== "string") {
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
      content: fileService.getFileTestCasePath(titleSlug),
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
