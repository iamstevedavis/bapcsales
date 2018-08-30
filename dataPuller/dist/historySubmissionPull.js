"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = require("bunyan");
const snoowrap = require("snoowrap");
const submission_1 = require("./models/submission");
class HistorySubmissionPull {
    constructor() {
        this.snooWrapOpts = {
            clientId: `${process.env.REDDIT_APP_CLIENT_ID}`,
            clientSecret: `${process.env.REDDIT_APP_CLIENT_SECRET}`,
            password: `${process.env.REDDIT_ACCOUNT_PASSWORD}`,
            userAgent: 'myApp',
            username: `${process.env.REDDIT_ACCOUNT_USERNAME}`,
        };
        this.log = bunyan_1.createLogger({
            name: 'HistorySubmissionPull',
            stream: process.stdout,
        });
        this.log.info('Instance of HistorySubmissionPull created');
        this.log.info('Init snoowrap');
        this.instSnoowrap = new snoowrap(this.snooWrapOpts);
    }
    fetchHotHistory() {
        this.log.info('Make call to reddit to get hot listings history');
        return this.instSnoowrap
            .getHot('bapcsalescanada', { limit: 100, show: 'all' })
            .then((listings) => {
            this.log.info(`Got ${listings.length} listings`);
            const ids = listings.map((listing) => listing.id);
            this.log.info('Find already saved listings');
            return Promise.all([listings, submission_1.Submission.aggregate([
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
            .then(([listings, existingSubmissions]) => {
            this.log.info('Filter saved listings');
            const existingSubmissionsIds = existingSubmissions.map((existingSubmission) => existingSubmission.redditId);
            return Promise.all(listings.reduce((prev, listing) => {
                if (existingSubmissionsIds.indexOf(listing.id) === -1) {
                    prev.push(listing);
                }
                return prev;
            }, []));
        })
            .then((listingsToCreate) => {
            this.log.info(`Creating ${listingsToCreate.length} new listings`);
            return Promise.all(listingsToCreate.map((listing) => {
                const submissionToCreate = new submission_1.Submission({
                    authorName: listing.author.name,
                    listingType: 'hot',
                    permalink: listing.permalink,
                    redditId: listing.id,
                    subreddit_id: listing.subreddit_id,
                    subreddit_name_prefixed: listing.subreddit_name_prefixed,
                    title: listing.title,
                });
                return submission_1.Submission.create(submissionToCreate);
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
    fetchNewHistory() {
        this.log.info('Make call to reddit to get new listings history');
        return this.instSnoowrap
            .getNew('bapcsalescanada', { limit: 100, show: 'all' })
            .then((listings) => {
            this.log.info(`Got ${listings.length} listings`);
            const ids = listings.map((listing) => listing.id);
            this.log.info('Find already saved listings');
            return Promise.all([listings, submission_1.Submission.aggregate([
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
            .then(([listings, existingSubmissions]) => {
            this.log.info('Filter saved listings');
            const existingSubmissionsIds = existingSubmissions.map((existingSubmission) => existingSubmission.redditId);
            return Promise.all(listings.reduce((prev, listing) => {
                if (existingSubmissionsIds.indexOf(listing.id) === -1) {
                    prev.push(listing);
                }
                return prev;
            }, []));
        })
            .then((listingsToCreate) => {
            this.log.info(`Creating ${listingsToCreate.length} new listings`);
            return Promise.all(listingsToCreate.map((listing) => {
                const submissionToCreate = new submission_1.Submission({
                    authorName: listing.author.name,
                    listingType: 'hot',
                    permalink: listing.permalink,
                    redditId: listing.id,
                    subreddit_id: listing.subreddit_id,
                    subreddit_name_prefixed: listing.subreddit_name_prefixed,
                    title: listing.title,
                });
                return submission_1.Submission.create(submissionToCreate);
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
exports.HistorySubmissionPull = HistorySubmissionPull;
//# sourceMappingURL=historySubmissionPull.js.map