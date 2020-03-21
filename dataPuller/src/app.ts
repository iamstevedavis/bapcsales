
import { createLogger } from 'bunyan';
import * as mongoose from 'mongoose';
import * as snoostorm from 'snoostorm';
import * as snoowrap from 'snoowrap';
import config from './config.js';
import { HistorySubmissionPull } from './historySubmissionPull';
import { ISnooSubmission, Submission } from './models/submission';

const log = createLogger({
  name: 'app',
  stream: process.stdout,
});

log.info('App started');
log.info('Connecting to mongo');
mongoose.connect(
  `mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.scope}`,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);
log.info('Connected to mongo');

const snooWrapOpts: snoowrap.SnoowrapOptions = {
  clientId: config.reddit.clientId,
  clientSecret: config.reddit.clientSecret,
  userAgent: config.reddit.userAgent,
  refreshToken: config.reddit.refreshToken
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
