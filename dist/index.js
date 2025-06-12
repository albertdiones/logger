import FileLogger from "./fileLogger";
var logLevel;
(function (logLevel) {
    logLevel["log"] = "log";
    logLevel["error"] = "error";
    logLevel["warn"] = "warn";
    logLevel["info"] = "info";
    logLevel["debug"] = "debug";
})(logLevel || (logLevel = {}));
export class Logger {
    constructor(channel = 'nochannel', options = {}) {
        var _a, _b, _c, _d, _e;
        this.fileLogger = null;
        this.debugMode = (_a = options.debugMode) !== null && _a !== void 0 ? _a : Logger.defaultDebugMode;
        this.dbModel = (_b = options.dbModel) !== null && _b !== void 0 ? _b : Logger.defaultDbModel;
        this.logOnFile = (_d = (_c = options.logOnFile) !== null && _c !== void 0 ? _c : Logger.defaultLogOnFile) !== null && _d !== void 0 ? _d : true;
        if (this.logOnFile) {
            this.fileLogger = new FileLogger(channel, { logDirectory: (_e = options.logDirectory) !== null && _e !== void 0 ? _e : null });
        }
        this.channel = channel;
    }
    _log(level, messages) {
        const formattedMessages = this.format(messages, level);
        if (this.debugMode
            || [logLevel.log, logLevel.error].includes(level)) {
            console[level](...formattedMessages);
        }
        this.persistLog(level, formattedMessages);
    }
    persistLog(level, messages) {
        var _a;
        this.fileLogger && this.fileLogger[level](...messages);
        (_a = this.dbModel) === null || _a === void 0 ? void 0 : _a.create({
            channel: this.channel,
            level: level,
            message: messages
        });
    }
    log(...messages) {
        return this._log(logLevel.log, messages);
    }
    debug(...messages) {
        return this._log(logLevel.debug, messages);
    }
    info(...messages) {
        return this._log(logLevel.info, messages);
    }
    warn(...messages) {
        return this._log(logLevel.warn, messages);
    }
    error(...messages) {
        return this._log(logLevel.error, messages);
    }
    format(messages, level) {
        messages.unshift(`[${new Date().toLocaleString()}]`, `[${this.channel}]`, `[${level}]`);
        return messages;
    }
}
Logger.defaultDebugMode = false;
Logger.defaultDbModel = null;
Logger.defaultLogOnFile = null;
function _multiLog(level, loggers, messages) {
    const subLoggers = [...loggers];
    const firstLogger = loggers[0];
    if (!firstLogger) {
        throw "No loggers supplied to multiLog";
    }
    firstLogger[level](...messages);
    loggers.forEach(logger => logger.persistLog(level, logger.format(messages, level)));
}
export function multiLog(...loggers) {
    return {
        log: (...messages) => _multiLog(logLevel.log, loggers, messages),
        error: (...messages) => _multiLog(logLevel.error, loggers, messages),
        warn: (...messages) => _multiLog(logLevel.warn, loggers, messages),
        info: (...messages) => _multiLog(logLevel.info, loggers, messages),
        debug: (...messages) => _multiLog(logLevel.debug, loggers, messages),
    };
}
export default Logger;
