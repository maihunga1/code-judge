import { dockerImage } from "../services/docker.service";
import { configService } from "../services";

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

export function getDockerImageByLanguage(language: Language): dockerImage {
  const imageString = configService.get(`/n11744260/docker-images/${language}`);
  return parseDockerImage(imageString);
}

function parseDockerImage(imageString: string | undefined): dockerImage {
  if (!imageString) throw new Error(`Docker image is undefined for language`);

  const [name, tag] = imageString.split(":");
  return { name, tag };
}

export const getExecCommandByLanguage: Record<Language, string[]> = {
  go: ["go", "run", "main.go"],
  javascript: ["node", "main.js"],
  python: ["python", "main.py"],
};
