"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
        const matches = this.title.match(/\[(.*?)\]/);
        if (matches) {
            this.dealType = matches[1].toLowerCase();
        }
        else {
            this.dealType = '';
        }
    }
    next();
});
exports.SubmissionSchema.methods.link = () => {
    return (`https://www.reddit.com${this.permalink}`);
};
exports.Submission = mongoose_1.model('Submission', exports.SubmissionSchema, 'submissions', true);
// .pre('save', function (this: ISubmissionModel, next) {
//   if (this) {
//     let dType: DealType = 'unknown';
//     DealTypeValues.some((element: string): boolean => {
//       if (this.title.toLowerCase().search(element) !== -1) {
//         dType = element as DealType;
//         return true;
//       }
//     });
//     if (dType === 'unknown') {
//       // console.log(`Could not match deal type: ${this.title.toLowerCase()}`)
//     }
//     this.dealType = dType;
//   }
//   next();
// });
//# sourceMappingURL=submission.js.map