"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = require("bunyan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");
const submission_1 = require("./controllers/submission");
const log = bunyan_1.createLogger({
    name: 'api',
    serializers: {
        req: bunyan_1.stdSerializers.req
    }
});
dotenv.config();
// const log = createLogger({
//   name: 'api',
//   stream: process.stdout,
// });
log.info('Connecting to mongo');
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SCOPE}`);
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
    preflightMaxAge: 5,
    origins: ['http://localhost:3002'],
    allowHeaders: ['API-Token'],
    exposeHeaders: ['API-Token-Expiry']
});
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
/************************************
 * Set up Restify server end-points *
 ************************************/
server.get('/bapcsales/posts', (req, res, next) => {
    return submission_1.SubmissionController.getAllSubmissions()
        .then((submissions) => {
        res.send(200, submissions);
        return next();
    })
        .catch((err) => {
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
    return submission_1.SubmissionController.getSubmissionByRedditId(redditId)
        .then((submission) => {
        res.send(200, submission);
        return next();
    })
        .catch((err) => {
    });
});
/*********************
 * Start the service *
 *********************/
server.listen(process.env.API_PORT);
// http://restify.com/docs/plugins-api/#requestlogger
// server.use(restify.requestLogger());
// server.on('after', restify.plugins.auditLogger({
//   log: createLogger({
//     name: 'audit',
//     stream: process.stdout
//   }),
//   event: 'after',
//   server: server,
//   // logMetrics: logBuffer,
//   printLog: true
// }));
//# sourceMappingURL=app.js.map