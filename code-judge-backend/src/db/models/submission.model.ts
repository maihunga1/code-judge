interface Submission {
  "qut-username": string;
  submission_id: string;
  user_id: string;
  title_slug: string;
  language: string;
  result: string;
  message: string;
  created: Date;
}

export class SubmissionModel {
  "qut-username": string;
  submissionID: string;
  userID: string;
  titleSlug: string;
  language: string;
  result: string;
  message: string;
  created: Date;

  constructor(data: Submission) {
    this["qut-username"] = data["qut-username"];
    this.submissionID = data.submission_id;
    this.userID = data.user_id;
    this.titleSlug = data.title_slug;
    this.language = data.language;
    this.result = data.result;
    this.message = data.message;
    this.created = data.created;
  }
}
