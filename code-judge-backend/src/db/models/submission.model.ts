interface Submission {
  submission_id: string;
  user_id: string;
  title_slug: string;
  code_file_url: string;
  language: string;
  result: string;
  message: string;
  created: Date;
}

export class SubmissionModel {
  submissionID: string;
  userID: string;
  titleSlug: string;
  codeFileURL: string;
  language: string;
  result: string;
  message: string;
  created: Date;

  constructor(data: Submission) {
    this.submissionID = data.submission_id;
    this.userID = data.user_id;
    this.titleSlug = data.title_slug;
    this.codeFileURL = data.code_file_url;
    this.language = data.language;
    this.result = data.result;
    this.message = data.message;
    this.created = data.created;
  }
}
