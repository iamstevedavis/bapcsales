import { Document, Model, model, Schema } from 'mongoose';

export const ListingTypeValues = ['hot', 'new'];
export type ListingType = 'hot' | 'new';

export interface ISnooSubmission {
  id: string;
  author: { name: string };
  title: string;
  permalink: string;
  subreddit_id: string;
  subreddit_name_prefixed: string;
}

export interface ISubmissionModel extends Document {
  authorName: string;
  dealType: string;
  permalink: string;
  redditId: string;
  subreddit_id: string;
  subreddit_name_prefixed: string;
  title: string;
  listingType: ListingType;
  link(): string;
}

export const SubmissionSchema: Schema = new Schema({
  authorName: String,
  dealType: String,
  listingType: String,
  permalink: String,
  redditId: String,
  subreddit_id: String,
  subreddit_name_prefixed: String,
  title: String,
}).pre('save', function(this: ISubmissionModel, next) {
  if (this) {
    const matches = this.title.match(/\[(.*?)\]/);
    if (matches) {
      this.dealType = matches[1].toLowerCase();
    } else {
      this.dealType = '';
    }
  }
  next();
});

SubmissionSchema.methods.link = (): string => {
  return (`https://www.reddit.com${this.permalink}`);
};

export const Submission: Model<ISubmissionModel> = model<ISubmissionModel>('Submission', SubmissionSchema, 'submissions', true);

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
