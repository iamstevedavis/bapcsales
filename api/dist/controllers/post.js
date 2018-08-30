"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const submission_1 = require("../models/submission");
class Post {
    static getPostByRedditId(redditId) {
        return submission_1.Submission.findOne({ redditId });
    }
}
exports.Post = Post;
//# sourceMappingURL=post.js.map