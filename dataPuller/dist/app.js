"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = require("bunyan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const snoostorm = require("snoostorm");
const snoowrap = require("snoowrap");
const historySubmissionPull_1 = require("./historySubmissionPull");
const submission_1 = require("./models/submission");
dotenv.config();
const log = bunyan_1.createLogger({
    name: 'app',
    stream: process.stdout,
});
log.info('App started');
log.info('Connecting to mongo');
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SCOPE}`);
log.info('Connected to mongo');
const snooWrapOpts = {
    clientId: `${process.env.REDDIT_APP_CLIENT_ID}`,
    clientSecret: `${process.env.REDDIT_APP_CLIENT_SECRET}`,
    password: `${process.env.REDDIT_ACCOUNT_PASSWORD}`,
    userAgent: 'myApp',
    username: `${process.env.REDDIT_ACCOUNT_USERNAME}`,
};
const client = new snoostorm(new snoowrap(snooWrapOpts));
const submissionStream = client.SubmissionStream({ subreddit: 'bapcsalescanada' });
const historySubmissionPuller = new historySubmissionPull_1.HistorySubmissionPull();
log.info('Update submission history');
historySubmissionPuller.fetchHotHistory()
    .then(() => historySubmissionPuller.fetchNewHistory())
    .then(() => {
    log.info('Submission history updated');
    log.info('Begin polling');
    submissionStream.on('submission', (post) => {
        log.info('Got new submission');
        const newSubmission = new submission_1.Submission({
            authorName: post.author.name,
            permalink: post.permalink,
            redditId: post.id,
            subreddit_id: post.subreddit_id,
            subreddit_name_prefixed: post.subreddit_name_prefixed,
            title: post.title,
        });
        log.info('Saving new submission to database');
        submission_1.Submission.create(newSubmission);
    });
})
    .catch((err) => {
    log.error(err);
});
//# sourceMappingURL=app.js.map