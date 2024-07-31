import { Logger, multiLog } from "../";

const object = {x: 1 , y: 2}

const logger1 = new Logger('growing_candle', { debugMode: true });
logger1.log("Log");
logger1.warn("Warning", object.x);
logger1.error("Error!", object);


const logger2 = new Logger('btcusdt', {debugMode: true});

// what if, growing candle on btcusdt? I want to log the same message
// for both channel
// option 2 - less characters
multiLog(logger1, logger2).info("Growing candles on BTCUSDT");
