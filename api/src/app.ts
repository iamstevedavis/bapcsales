
import { createLogger, stdSerializers } from 'bunyan';
import * as mongoose from 'mongoose';
import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';
import { SubmissionController } from './controllers/submission';

interface Config {
  api: {
    port: number;
  };
  db: {
    username: string;
    password: string;
    host: string;
    port: string;
    scope: string;
  };
};

const config: Config = require('./config.json');


const log = createLogger({
  name: 'api',
  serializers: {
    req: stdSerializers.req
  }
})

log.info('Connecting to mongo');
mongoose.connect(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.scope}`);
log.info('Connected to mongo');

const server = restify.createServer({
  name: 'bapcsalesserver',
  log
});

/*****************************
 * Initialize Restify server *
 *****************************/
server.pre((request, response, next) => {
  request.log.info({ req: request }, 'REQUEST');
  next();
});

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['http://localhost:3002'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
})
server.pre(cors.preflight)
server.use(cors.actual)

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

/************************************
 * Set up Restify server end-points *
 ************************************/

server.get('/bapcsales/posts', (req, res, next) => {
  return SubmissionController.getAllSubmissions()
    .then((submissions) => {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
      res.send(submissions);
      return next();
    });
});

server.get('/bapcsales/posts/:redditId', (req, res, next) => {
  const redditId = (req.params && req.params.redditId);
  if (!redditId) {
    res.send(400, {
      error: 'invalidParams',
      message: 'You have not entered valid parameters for this route.'
    });
  }

  return SubmissionController.getSubmissionByRedditId(redditId)
    .then((submission) => {
      res.send(200, submission);
      return next();
    });
});

/*********************
 * Start the service *
 *********************/
console.log(`Listening on port ${config.api.port}`);
server.listen(config.api.port);
