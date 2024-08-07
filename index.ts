import FileLogger from "./fileLogger";

interface DbModel {
    create(paths: {channel: string,level: string,message: any[]}): Promise<DbModel>;
}

export interface LoggerInterface {
    log(...messages: any[]): void;
    error(...messages: any[]): void;
    warn(...messages: any[]): void;
    info(...messages: any[]): void;
    debug(...messages: any[]): void;
}

enum logLevel {
    log = 'log',
    error = 'error',
    warn = 'warn',
    info = 'info',
    debug = 'debug'
}

export class Logger implements LoggerInterface {
    static defaultDebugMode: boolean = false;
    static defaultDbModel:DbModel | null = null;
    static defaultLogOnFile: boolean | null = null;
    debugMode: boolean;
    logOnFile: boolean;
    fileLogger: FileLogger;
    dbModel: DbModel | null;
    channel: string;

    constructor(channel: string = 'nochannel', { debugMode=null, logDirectory = null, dbModel = null, logOnFile = null} = {}) {
      this.debugMode = debugMode ?? Logger.defaultDebugMode;
      this.dbModel = dbModel ?? Logger.defaultDbModel;
      this.logOnFile = logOnFile ?? Logger.defaultLogOnFile ?? true;

      if (this.logOnFile) {
        this.fileLogger = new FileLogger(channel, { logDirectory: logDirectory });
      }

      this.channel = channel;
    }

    _log(level: logLevel, messages: any[]) {        
        const formattedMessages = this.format(messages,level);

        if (
            this.debugMode 
            || [logLevel.log, logLevel.error].includes(level)
        ) {
            console[level](...formattedMessages);
        }
        this.persistLog(level, formattedMessages);
    }


    persistLog(level: logLevel, messages: any[]) {           

        this.fileLogger && this.fileLogger[level](...messages);
        this.dbModel?.create({
            channel: this.channel,
            level: level,
            message: messages
        });
    }
  
    log(...messages: any[]) {
        return this._log(logLevel.log, messages);
    }
  
    debug(...messages: any[]) {
        return this._log(logLevel.debug, messages);
    }
  
  
    info(...messages: any[]) {
        return this._log(logLevel.info, messages);
    }
  
    warn(...messages: any[]) {
        return this._log(logLevel.warn, messages);
    }
  
    error(...messages: any[]) {
        return this._log(logLevel.error, messages);
    }

    format(messages: any[], level: logLevel) {
        messages.unshift(
            `[${new Date().toLocaleString()}]`,
            `[${this.channel}]`,
            `[${level}]`
        );
        return messages;
    }
}

function _multiLog(
    level: logLevel,
    loggers: Logger[],
    messages: any[]
) {
    const firstLogger = loggers.shift();
    firstLogger && firstLogger[level](...messages);

    loggers.forEach(
        logger => logger.persistLog(level, logger.format(messages, level))
    );
}

export function multiLog(...loggers: Logger[]): LoggerInterface {
    return {
        log: (...messages) => _multiLog(logLevel.log, loggers, messages),

        error: (...messages) => _multiLog(logLevel.error, loggers, messages),
        warn: (...messages) => _multiLog(logLevel.warn, loggers, messages),
        info: (...messages) => _multiLog(logLevel.info, loggers, messages),
        debug: (...messages) => _multiLog(logLevel.debug, loggers, messages),
    }

}

export default Logger;
