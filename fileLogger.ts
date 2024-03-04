import winston, { createLogger, Logger } from "winston";

const plainTextFormat = winston.format.printf(({ 
    level: _level, // remove unused warning with underscore
    message, 
    label: _label,
    timestamp: _timestamp
}) => {
    return `${message}`;
})

interface FileLoggerOptions {
    logDirectory: string | null
}

export class FileLogger {
    static defaultLogDirectory: string = './logs';
    winston: Logger;
    logDirectory: string;
    static levels = ['error','warn','info','debug'];
    
    constructor(channel: string, { logDirectory }: FileLoggerOptions) {
        this.logDirectory = logDirectory ?? FileLogger.defaultLogDirectory;
        this.winston = createLogger({
            format: plainTextFormat,
            transports: [
                ...FileLogger.levels.map(level => new winston.transports.File({
                        filename: this._loggerFile('all', level),
                        level
                    })
                ),
                ...FileLogger.levels.map(level => new winston.transports.File({
                        filename: this._loggerFile(channel, level),
                        level
                    })
                ),
            ]
          });
    }

    _loggerFile(channel: string, level: string): string {
        return `./${this.logDirectory}/${channel}.${level}.txt`;
    }
  
    log(...messages: any[]) {
        this.winston.info(this.format(messages));
    }
  
    debug(...messages: any[]) {
        this.winston.debug(this.format(messages));
    }
  
    info(...messages: any[]) {
        this.winston.info(this.format(messages));
    }
  
    warn(...messages: any[]) {
        this.winston.warn(this.format(messages));
    }
  
    error(...messages: any[]) {
        this.winston.error(this.format(messages));
    }

    format(messages: any[]) {
        return messages.map(this._formatSingle).join(' ');
    }

    _formatSingle(message: object | string | Record<any, any>) {
        if (typeof message === 'object') {
            return JSON.stringify(message);
        }
        return message;
    }

}

export default FileLogger;