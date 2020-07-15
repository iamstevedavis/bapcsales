import { createLogger } from 'bunyan';
import { SubmissionStream } from 'snoostorm';
import Snoowrap from 'snoowrap';
import { reddit } from '../config';
import { Submission } from '../models/submission';
import { fetchHotHistory, fetchNewHistory } from './historySubmissionPull';

const log = createLogger({
  name: 'reddit-poller',
  stream: process.stdout,
});
const snooWrapOpts = {
  clientId: reddit.clientId,
  clientSecret: reddit.clientSecret,
  password: reddit.password,
  userAgent: reddit.userAgent,
  username: reddit.username,
};
const client = new Snoowrap(snooWrapOpts);
const submissions = new SubmissionStream(client, {
  subreddit: 'bapcsalescanada',
  limit: 10,
  pollTime: 2000,
});

const setupReddit = async () => {
  log.info('Update HOT submission history');
  await fetchHotHistory(client);

  log.info('Update NEW submission history');
  await fetchNewHistory(client);

  log.info('Poll for new submissions');
  submissions.on('item', async (post) => {
    log.info('Got new submission');
    const newSubmission = new Submission({
      authorName: post.author.name,
      permalink: post.permalink,
      redditId: post.id,
      subreddit_id: post.subreddit_id,
      subreddit_name_prefixed: post.subreddit_name_prefixed,
      title: post.title,
    });

    log.info('Saving submission to database', newSubmission);
    await Submission.findOneAndUpdate(
      { redditId: newSubmission.redditId },
      {
        authorName: post.author.name,
        permalink: post.permalink,
        subreddit_id: post.subreddit_id,
        subreddit_name_prefixed: post.subreddit_name_prefixed,
        title: post.title,
      },
      { upsert: true },
    );
  });
};

export { setupReddit as default };
