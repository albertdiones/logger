import FileLogger from "./fileLogger";

interface DbModel {
    create(paths: {channel: string,level: string,message: any[]}): void;
}

export interface LoggerInterface {
    log(...messages: any[]): void;
    error(...messages: any[]): void;
    warn(...messages: any[]): void;
    info(...messages: any[]): void;
    debug(...messages: any[]): void;
}

export interface LogFormatterInterface {
    format(messages: any[], level: logLevel): any[]
}

export interface PersistingLoggerInterface extends LoggerInterface {
    persistLog(level: logLevel, messages: any[]): void;
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
    fileLogger: FileLogger | null = null;
    dbModel: DbModel | null;
    channel: string;

    constructor(
        channel: string = 'nochannel',
        options: {
            debugMode?: boolean;
            logDirectory?: string;
            dbModel?: DbModel;
            logOnFile?: boolean;
        } = {}
    ) {

      this.debugMode = options.debugMode ?? Logger.defaultDebugMode;
      this.dbModel = options.dbModel ?? Logger.defaultDbModel;
      this.logOnFile = options.logOnFile ?? Logger.defaultLogOnFile ?? true;

      if (this.logOnFile) {
        this.fileLogger = new FileLogger(channel, { logDirectory: options.logDirectory ?? null });
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


    persistLog(level: logLevel, messages: any[]): void {           

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

    format(messages: any[], level: logLevel): any[] {
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
    loggers: (PersistingLoggerInterface & LogFormatterInterface)[],
    messages: any[]
) {
    const firstLogger = [...loggers].shift();

    if (!firstLogger) {
        throw "No loggers supplied to multiLog";
    }

    firstLogger[level](...messages);

    loggers.forEach(
        logger => logger.persistLog(level, logger.format(messages, level))
    );
}

export function multiLog(...loggers: (PersistingLoggerInterface & LogFormatterInterface)[]): PersistingLoggerInterface & LogFormatterInterface {
    return {
        log: (...messages) => _multiLog(logLevel.log, loggers, messages),

        error: (...messages) => _multiLog(logLevel.error, loggers, messages),
        warn: (...messages) => _multiLog(logLevel.warn, loggers, messages),
        info: (...messages) => _multiLog(logLevel.info, loggers, messages),
        debug: (...messages) => _multiLog(logLevel.debug, loggers, messages),
        format: (messages: any[], level: logLevel): any[] => loggers[0].format(messages, level),
        persistLog: (level: logLevel, messages: any[]): void => loggers.forEach(
            logger => logger.persistLog(level, logger.format(messages, level))
        )
    }

}

export default Logger;
