import { RowDataPacket } from "mysql2";
import { Language } from "../../utils";

enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface Problem extends RowDataPacket {
  problemID: string;
  titleSlug: string;
  difficulty: Difficulty;
  likes: number;
  dislikes: number;
  tags: string;
}

export class ProblemModel {
  problemID: string;
  titleSlug: string;
  difficulty: Difficulty;
  likes: number;
  dislikes: number;
  tags: string[];
  sampleCode?: Record<Language, string>;
  problemDescription?: string;

  constructor(data: Problem) {
    this.problemID = data.problemID;
    this.titleSlug = data.title_slug;
    this.difficulty = data.difficulty;
    this.likes = data.likes;
    this.dislikes = data.dislikes;
    this.tags = data.tags.split(",");
  }
}
