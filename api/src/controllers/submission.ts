import { Submission } from '../models/submission';

const getSubmissionByRedditId = (redditId: string) => Submission.findOne({ redditId });

const getAllSubmissions = () => Submission.find();

export { getSubmissionByRedditId, getAllSubmissions };
