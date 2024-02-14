Separate log file for each channel and log levels + aggregated log on the console

"channel" being just an arbitrary/relative grouping of logs that you use (e.g. each promise groups)

Usage:
```
const object = {x: 1 , y: 2}
const logger = new Logger('api_fetches');
logger.log("Log");
logger.warn("Warning", object.x);
logger.error("Error!", object);

const emailAddress = 'not+real@gmail.cc';
const emailLogger = new Logger('emails');
emailLogger.debug("Email successfully sent to ", emailAddress);
```
