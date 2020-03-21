
import { createLogger } from 'bunyan';
import * as snoowrap from 'snoowrap';
import config from './config.js';
import { ISnooSubmission, ISubmissionModel, Submission } from './models/submission';

export class HistorySubmissionPull {
  private instSnoowrap;
  private snooWrapOpts: snoowrap.SnoowrapOptions = {
    clientId: config.reddit.clientId,
    clientSecret: config.reddit.clientSecret,
    userAgent: config.reddit.userAgent,
    refreshToken: config.reddit.refreshToken
  };
  private log;

  constructor() {
    this.log = createLogger({
      name: 'HistorySubmissionPull',
      stream: process.stdout,
    });
    this.log.info('Instance of HistorySubmissionPull created');
    this.log.info('Init snoowrap');
    this.instSnoowrap = new snoowrap(this.snooWrapOpts);
  }

  public fetchHotHistory() {
    this.log.info('Make call to reddit to get hot listings history');
    return this.instSnoowrap
      .getHot('bapcsalescanada', { limit: 100, show: 'all' })
      .then((listings: ISnooSubmission[]) => {
        this.log.info(`Got ${listings.length} listings`);
        const ids: string[] = listings.map((listing: ISnooSubmission): string => listing.id);
        this.log.info('Find already saved listings');
        return Promise.all([listings, Submission.aggregate([
          {
            $match: {
              redditId: { $in: ids },
            },
          },
          {
            $project: {
              _id: 0,
              redditId: 1,
            },
          },
        ])]);
      })
      .then(([listings, existingSubmissions]: [ISnooSubmission[], Array<{ redditId: string }>]) => {
        this.log.info('Filter saved listings');
        const existingSubmissionsIds: string[] = existingSubmissions.map((existingSubmission): string => existingSubmission.redditId);
        return Promise.all(listings.reduce((prev: ISnooSubmission[], listing: ISnooSubmission): ISnooSubmission[] => {
          if (existingSubmissionsIds.indexOf(listing.id) === -1) {
            prev.push(listing);
          }
          return prev;
        }, []));
      })
      .then((listingsToCreate: ISnooSubmission[]) => {
        this.log.info(`Creating ${listingsToCreate.length} new listings`);
        return Promise.all(listingsToCreate.map((listing: ISnooSubmission): Promise<ISubmissionModel> => {
          const submissionToCreate: ISubmissionModel = new Submission({
            authorName: listing.author.name,
            listingType: 'hot',
            permalink: listing.permalink,
            redditId: listing.id,
            subreddit_id: listing.subreddit_id,
            subreddit_name_prefixed: listing.subreddit_name_prefixed,
            title: listing.title,
          });
          return Submission.create(submissionToCreate);
        }));
      })
      .catch((err) => {
        this.log.error(err);
        throw err;
      })
      .then(() => {
        this.log.info('Done history fetch');
        return Promise.resolve();
      });
  }

  public fetchNewHistory() {
    this.log.info('Make call to reddit to get new listings history');
    return this.instSnoowrap
      .getNew('bapcsalescanada', { limit: 100, show: 'all' })
      .then((listings: ISnooSubmission[]) => {
        this.log.info(`Got ${listings.length} listings`);
        const ids: string[] = listings.map((listing: ISnooSubmission): string => listing.id);
        this.log.info('Find already saved listings');
        return Promise.all([listings, Submission.aggregate([
          {
            $match: {
              redditId: { $in: ids },
            },
          },
          {
            $project: {
              _id: 0,
              redditId: 1,
            },
          },
        ])]);
      })
      .then(([listings, existingSubmissions]: [ISnooSubmission[], Array<{ redditId: string }>]) => {
        this.log.info('Filter saved listings');
        const existingSubmissionsIds: string[] = existingSubmissions.map((existingSubmission): string => existingSubmission.redditId);
        return Promise.all(listings.reduce((prev: ISnooSubmission[], listing: ISnooSubmission): ISnooSubmission[] => {
          if (existingSubmissionsIds.indexOf(listing.id) === -1) {
            prev.push(listing);
          }
          return prev;
        }, []));
      })
      .then((listingsToCreate: ISnooSubmission[]) => {
        this.log.info(`Creating ${listingsToCreate.length} new listings`);
        return Promise.all(listingsToCreate.map((listing: ISnooSubmission): Promise<ISubmissionModel> => {
          const submissionToCreate: ISubmissionModel = new Submission({
            authorName: listing.author.name,
            listingType: 'hot',
            permalink: listing.permalink,
            redditId: listing.id,
            subreddit_id: listing.subreddit_id,
            subreddit_name_prefixed: listing.subreddit_name_prefixed,
            title: listing.title,
          });
          return Submission.create(submissionToCreate);
        }));
      })
      .catch((err) => {
        this.log.error(err);
        throw err;
      })
      .then(() => {
        this.log.info('Done history fetch');
        return Promise.resolve();
      });
  }
}
