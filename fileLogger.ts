import winston, { createLogger } from "winston";

const plainTextFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${message}`;
})

export class FileLogger {
    static defaultLogDirectory: String = './logs';
    winston;
    logDirectory: String;
    static levels = ['error','warn','info','debug'];
    constructor(channel, {logDirectory}) {
        this.logDirectory = logDirectory ?? FileLogger.defaultLogDirectory;
        this.winston = createLogger({
            format: plainTextFormat,
            transports: [
                ...FileLogger.levels.map( (level) => new winston.transports.File({
                        filename: this._loggerFile('all', level),
                        level
                    })
                ),
                ...FileLogger.levels.map( (level) => new winston.transports.File({
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
  
    log(...messages) {
        this.winston.info(this.format(messages));
    }
  
    debug(...messages) {
        this.winston.debug(this.format(messages));
    }
  
    info(...messages) {
        this.winston.info(this.format(messages));
    }
  
    warn(...messages) {
        this.winston.warn(this.format(messages));
    }
  
    error(...messages) {
        this.winston.error(this.format(messages));
    }

    format(messages: Array<any>) {
        return messages.map(this._formatSingle).join(' ');
    }

    _formatSingle(message) {
        if (typeof message === 'object') {
            return JSON.stringify(message);
        }
        return message;
    }

}

export default FileLogger;