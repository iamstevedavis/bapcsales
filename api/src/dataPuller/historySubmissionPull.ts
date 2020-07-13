import { createLogger } from 'bunyan';
import { ISnooSubmission, ISubmissionModel, Submission } from '../models/submission';

const log = createLogger({
  name: 'HistorySubmissionPull',
  stream: process.stdout,
});

export async function fetchHotHistory(client) {
  log.info('Get HOT history');
  const listings: ISnooSubmission[] = await client.getHot('bapcsalescanada', { limit: 10 });
  log.info(`Got ${listings.length} HOT listings`);
  const ids: string[] = listings.map((listing: ISnooSubmission): string => listing.id);
  const existingSubmissions: Array<{ redditId: string }> = await Submission.aggregate([
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
  ]);
  const existingSubmissionsIds: string[] = existingSubmissions.map((existingSubmission): string => existingSubmission.redditId);
  const listingsToCreate: ISnooSubmission[] = listings.reduce((prev: ISnooSubmission[], listing: ISnooSubmission): ISnooSubmission[] => {
    if (existingSubmissionsIds.indexOf(listing.id) === -1) {
      prev.push(listing);
    }
    return prev;
  }, []);
  log.info(`Filtered out existing HOT listings. Creating ${listingsToCreate.length} HOT listings`);
  await Promise.all(listingsToCreate.map((listing: ISnooSubmission): Promise<ISubmissionModel> => {
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
}

export async function fetchNewHistory(client) {
  log.info('Get NEW history');
  const listings: ISnooSubmission[] = await client.getNew('bapcsalescanada', { limit: 10 });
  log.info(`Got ${listings.length} NEW listings`);
  const ids: string[] = listings.map((listing: ISnooSubmission): string => listing.id);
  const existingSubmissions: Array<{ redditId: string }> = await Submission.aggregate([
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
  ]);
  const existingSubmissionsIds: string[] = existingSubmissions.map((existingSubmission): string => existingSubmission.redditId);
  const listingsToCreate: ISnooSubmission[] = listings.reduce((prev: ISnooSubmission[], listing: ISnooSubmission): ISnooSubmission[] => {
    if (existingSubmissionsIds.indexOf(listing.id) === -1) {
      prev.push(listing);
    }
    return prev;
  }, []);
  log.info(`Filtered out existing NEW listings. Creating ${listingsToCreate.length} NEW listings`);
  await Promise.all(listingsToCreate.map((listing: ISnooSubmission): Promise<ISubmissionModel> => {
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
}
