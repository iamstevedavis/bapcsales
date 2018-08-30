"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
exports.mongoose = mongoose;
mongoose.Promise = global.Promise;
exports.connectDb = (config) => {
    const connectionString = `mongodb://${config.host}:${config.port}/${config.db}`;
    if (config.debug) {
        mongoose.set('debug', true);
    }
    return mongoose.connect(connectionString, {
        pass: config.password,
        poolSize: config.poolSize,
        promiseLibrary: Promise,
        replset: config.replicationSetName ? { rs_name: config.replicationSetName } : undefined,
        socketTimeoutMS: config.socketTimeout,
        user: config.user,
    })
        .then(() => {
        console.log('Connected to mongo', connectionString, config.debug ? config : undefined);
    }, (err) => {
        console.log('Error connecting to mongo', err);
        return Promise.reject(err);
    });
};
//# sourceMappingURL=mongo.js.map