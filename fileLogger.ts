import winston, { createLogger, Logger } from "winston";
import * as fs from 'fs';
import * as path from 'path';
import {LoggerInterface} from '.'

const plainTextFormat = winston.format.printf(({ 
    level: _level, // remove unused warning with underscore
    message, 
    label: _label,
    timestamp: _timestamp
}) => {
    return `${message}`;
})

interface FileLoggerOptions {
    logDirectory: string | null;
    maxFileSize?: number;
}

export class FileLogger implements LoggerInterface {
    winston: Logger;
    logDirectory: string;
    maxFileSize: number;
    static levels = ['error', 'warn', 'info', 'debug'];
    static defaultLogDirectory: string = './logs';
    static defaultMaxSize:number = 1073741824; // 1gb?
    
    constructor(channel: string, { logDirectory, maxFileSize }: FileLoggerOptions) {
        this.logDirectory = logDirectory ?? FileLogger.defaultLogDirectory;
        this.maxFileSize = maxFileSize ?? FileLogger.defaultMaxSize; 
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
        const baseName = `./${this.logDirectory}/${channel}.${level}`;
        const ext = '.txt';
        const filePath = `./${baseName}${ext}`;
        try {
            const stats = fs.statSync(filePath);
            if (stats.size >= this.maxFileSize) {
                const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
                const newName = `${baseName}.${timestamp}${ext}`;
                fs.renameSync(filePath, newName);
                return filePath; // Return the original path
            }
        }
        catch(e) {
            // -2 = file doesn't exist
        }
        return filePath; // Return the original path
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