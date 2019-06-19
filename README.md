# BAPCSALES

### Introduction

I enjoy browsing the subreddit bapcsalescanada for deals but wish there was a way I could watch for and be notified of deals that appear in the feed. This app (not yet complete) was the answer to that problem.

##### Web
The web portion of this will be a live feed of the current deals being posted. You will be able to see the item, a link to the post, and the price. You will also be able to see what item type it is and watch for that item time to be notified if a new item appears of that type.

##### DataPuller
This portion of the app will be a lambda (or some other timed process) that will run and get the latest posts from new and hot. It will account for duplicates and then save these to the database.

##### Api
Simply returns the current list of posts via a rest api.

### Next Steps

- Add sockets for real time web updates
- Add authentication
- Show a list of components that a user can subscribe to updates for and unsubscribe
- Profit?

