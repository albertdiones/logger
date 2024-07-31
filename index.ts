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
    static defaultLogOnFile: boolean | null = null;Z
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

        this.fileLogger && this.fileLogger[level](...formattedMessages);
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

    format(messages: any[], type: string) {
        messages.unshift(
            `[${new Date().toLocaleString()}]`,
            `[${this.channel}]`,
            `[${type}]`
        );
        return messages;
    }
}

export function multiLog(...loggers: Logger[]): LoggerInterface {
    return {
        log(...messages) {
            loggers.forEach(
                logger => logger.log(...messages)
            );
        },
        error(...messages) {
            loggers.forEach(
                logger => logger.error(...messages)
            );
        },
        warn(...messages) {
            loggers.forEach(
                logger => logger.warn(...messages)
            );            
        },
        info(...messages) {
            loggers.forEach(
                logger => logger.info(...messages)
            );            
        },
        debug(...messages) {
            loggers.forEach(
                logger => logger.debug(...messages)
            );
        },
    }

}

export default Logger;
