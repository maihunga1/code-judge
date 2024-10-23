export const SUPPORTED_LANGUAGES = ["go", "javascript", "python"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export function isLanguage(value: string): value is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export type languageExt = "go" | "js" | "py";

export const getFileExtByLanguage: Record<Language, languageExt> = {
  go: "go",
  javascript: "js",
  python: "py",
};
