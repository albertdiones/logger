import FileLogger from "../fileLogger";
import { Logger } from "../";

import * as mongoose from "mongoose";
await mongoose.connect('mongodb://localhost:27017/test');

const logSchema = new mongoose.Schema(
    {
      channel: { type: String, required: true},
      level: { type: String, required: true },
      message: { type: mongoose.Schema.Types.Mixed, required: true }
    }
  );
const Log = mongoose.model('Log', logSchema);



const object = {x: 1 , y: 2}
Logger.defaultLogOnFile = false;
Logger.defaultDbModel = Log;

const logger = new Logger('api_fetches', { debugMode: true });
logger.log("Log");
logger.warn("Warning", object.x);
logger.error("Error!", object);

const emailAddress = 'not+real@gmail.cc';
const emailLogger = new Logger('emails', {debugMode: true});
emailLogger.debug("Email successfully sent to ", emailAddress);