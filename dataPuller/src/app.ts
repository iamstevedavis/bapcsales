
import { createLogger } from 'bunyan';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import * as snoostorm from 'snoostorm';
import * as snoowrap from 'snoowrap';
import { HistorySubmissionPull } from './historySubmissionPull';
import { ISnooSubmission, Submission } from './models/submission';

dotenv.config();
const log = createLogger({
  name: 'app',
  stream: process.stdout,
});

log.info('App started');
log.info('Connecting to mongo');
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SCOPE}`);
log.info('Connected to mongo');

const snooWrapOpts: snoowrap.SnoowrapOptions = {
  clientId: `${process.env.REDDIT_APP_CLIENT_ID}`,
  clientSecret: `${process.env.REDDIT_APP_CLIENT_SECRET}`,
  password: `${process.env.REDDIT_ACCOUNT_PASSWORD}`,
  userAgent: 'myApp',
  username: `${process.env.REDDIT_ACCOUNT_USERNAME}`,
};
const client = new snoostorm(new snoowrap(snooWrapOpts));
const submissionStream = client.SubmissionStream({ subreddit: 'bapcsalescanada' });
const historySubmissionPuller = new HistorySubmissionPull();

log.info('Update submission history');
historySubmissionPuller.fetchHotHistory()
  .then(() => historySubmissionPuller.fetchNewHistory())
  .then(() => {
    log.info('Submission history updated');
    log.info('Begin polling');
    submissionStream.on('submission', (post: ISnooSubmission) => {
      log.info('Got new submission');
      const newSubmission = new Submission({
        authorName: post.author.name,
        permalink: post.permalink,
        redditId: post.id,
        subreddit_id: post.subreddit_id,
        subreddit_name_prefixed: post.subreddit_name_prefixed,
        title: post.title,
      });
      log.info('Saving new submission to database');
      Submission.create(newSubmission);
    });
  })
  .catch((err) => {
    log.error(err);
  });
