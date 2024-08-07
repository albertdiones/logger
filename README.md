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

Then it will create these logs:
```
ls -1 logs/
--- all.debug.txt
--- all.error.txt
--- all.info.txt
--- all.warn.txt
--- api_fetches.debug.txt
--- api_fetches.error.txt
--- api_fetches.info.txt
--- api_fetches.warn.txt
--- emails.debug.txt
--- emails.error.txt
--- emails.info.txt
--- emails.warn.txt
--- nochannel.debug.txt
--- nochannel.error.txt
--- nochannel.info.txt
--- nochannel.warn.txt
```

new feature:
multiLog: Log on multiple channels at once, to enable cross-channel debugging

```
const logger2 = new Logger('btcusdt', {debugMode: true});

// what if, growing candle on btcusdt? I want to log the same message
// for both channel
// option 2 - less characters
multiLog(logger1, logger2).info("Growing candles on BTCUSDT");
```