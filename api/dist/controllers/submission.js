"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const submission_1 = require("../models/submission");
class SubmissionController {
    static getSubmissionByRedditId(redditId) {
        return submission_1.Submission.findOne({ redditId });
    }
    static getAllSubmissions() {
        return submission_1.Submission.find();
    }
}
exports.SubmissionController = SubmissionController;
//# sourceMappingURL=submission.js.map