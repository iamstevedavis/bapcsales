import { createLogger, stdSerializers } from 'bunyan';
import mongoose from 'mongoose';
import * as restify from 'restify';
import { api, db } from './config';
import { getAllSubmissions, getSubmissionByRedditId } from './controllers/submission';
import setupReddit from './dataPuller/dataPuller';

const log = createLogger({
  name: 'api',
  serializers: {
    req: stdSerializers.req,
  },
});

(async () => {
  log.info('Connecting to mongo');
  try {
    await mongoose.connect(
      `mongodb://${db.username}:${db.password}@${db.host}:${db.port}/${db.scope}`,
      {
        useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true,
      },
    );
  } catch (error) {
    log.error('Could not connect to mongo', error);
    process.exit(22);
  }
  log.info('Connected to mongo');

  try {
    await setupReddit();
  } catch (error) {
    log.error('Unable to communicate with reddit', error);
  }
})();

const server = restify.createServer({
  name: 'bapcsalesserver',
  log,
});

/**
 * Initialize Restify server
 */
server.pre((request, response, next) => {
  request.log.info({ req: request }, 'REQUEST');
  next();
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

/**
 * Set up Restify server end-points
 */
server.get('/bapcsales/posts', (req, res, next) => getAllSubmissions()
  .then((submissions) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.send(submissions);
    return next();
  }));

server.get('/bapcsales/posts/:redditId', (req, res, next) => {
  const redditId = (req.params && req.params.redditId);
  if (!redditId) {
    res.send(400, {
      error: 'invalidParams',
      message: 'You have not entered valid parameters for this route.',
    });
  }

  return getSubmissionByRedditId(redditId)
    .then((submission) => {
      res.send(200, submission);
      return next();
    });
});

/**
 * Start the service
 */
log.info(`Listening on port ${api.port}`);
server.listen(api.port);
