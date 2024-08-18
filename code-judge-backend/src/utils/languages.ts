import { dockerImage } from "../services/docker.service";

const SUPPORTED_LANGUAGES = ["go", "javascript", "python"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export function isLanguage(value: string): value is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

type languageExt = "go" | "js" | "py";

export const getFileExtByLanguage: Record<Language, languageExt> = {
  go: "go",
  javascript: "js",
  python: "py",
};

export const dockerImageByLanguage: { [key in Language]: dockerImage } = {
  go: { name: "golang", tag: "alpine3.20" },
  javascript: { name: "node", tag: "boookworm" },
  python: { name: "python", tag: "3.9-bullseye" },
};

export const getExecCommandByLanguage: Record<Language, string[]> = {
  go: ["go", "run", "main.go"],
  javascript: ["node", "main.js"],
  python: ["python", "main.py"],
};