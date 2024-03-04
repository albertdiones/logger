import FileLogger from "../fileLogger";
import { Logger } from "../logger";

const object = {x: 1 , y: 2}
FileLogger.defaultMaxSize = 10;
const logger = new Logger('api_fetches', { debugMode: true });
logger.log("Log");
logger.warn("Warning", object.x);
logger.error("Error!", object);

const emailAddress = 'not+real@gmail.cc';
const emailLogger = new Logger('emails', {debugMode: true});
emailLogger.debug("Email successfully sent to ", emailAddress);