"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dealType_1 = require("./dealType");
exports.ListingTypeValues = ['hot', 'new'];
exports.SubmissionSchema = new mongoose_1.Schema({
    authorName: String,
    dealType: String,
    listingType: String,
    permalink: String,
    redditId: String,
    subreddit_id: String,
    subreddit_name_prefixed: String,
    title: String,
}).pre('save', function (next) {
    if (this) {
        let dType = 'unknown';
        dealType_1.DealTypeValues.some((element) => {
            if (this.title.toLowerCase().search(element) !== -1) {
                dType = element;
                return true;
            }
        });
        if (dType === 'unknown') {
            // console.log(`Could not match deal type: ${this.title.toLowerCase()}`)
        }
        this.dealType = dType;
    }
    next();
});
exports.SubmissionSchema.methods.link = () => {
    return (`https://www.reddit.com${this.permalink}`);
};
exports.Submission = mongoose_1.model('Submission', exports.SubmissionSchema, 'submissions', true);
//# sourceMappingURL=submission.js.map