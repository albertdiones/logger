import FileLogger from "../fileLogger";
import { Logger } from "../";

const object = {x: 1 , y: 2}
Logger.defaultLogOnFile = false;
const logger = new Logger('api_fetches', { debugMode: true });
logger.log("Log");
logger.warn("Warning", object.x);
logger.error("Error!", object);

const emailAddress = 'not+real@gmail.cc';
const emailLogger = new Logger('emails', {debugMode: true});
emailLogger.debug("Email successfully sent to ", emailAddress);