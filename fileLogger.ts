import winston, { createLogger } from "winston";
import { debugMode } from "./env";
import { dateFormat } from "./format";
require('dotenv').config();

const plainTextFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${message}`;
})

export class FileLogger {
    winston;
    constructor(channel) {
        this.winston = createLogger({
            format: plainTextFormat,
            transports: [
                new winston.transports.File({
                    filename: 'logs/all.txt',
                }),                
                new winston.transports.File({
                    filename: `logs/${channel}.txt`,
                }),                                
                new winston.transports.File({
                    filename: `logs/${channel}.error.txt`,
                    level: 'error'
                }),                                
                new winston.transports.File({
                    filename: `logs/${channel}.warn.txt`,
                    level: 'warning'
                }),                                
                new winston.transports.File({
                    filename: `logs/${channel}.info.txt`,
                    level: 'info'
                }),
                new winston.transports.File({
                    filename: `logs/${channel}.debug.txt`,
                    level: 'debug'
                }),
            ]
          });
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