
import { Submission } from '../models/submission';

export class SubmissionController {
  static getSubmissionByRedditId(redditId: string) {
    return Submission.findOne({ redditId });
  }

  static getAllSubmissions() {
    return Submission.find();
  }
}
