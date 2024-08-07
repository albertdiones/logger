import winston, { createLogger } from "winston";
import * as fs from 'fs';
const plainTextFormat = winston.format.printf(({ level: _level, // remove unused warning with underscore
message, label: _label, timestamp: _timestamp }) => {
    return `${message}`;
});
export class FileLogger {
    constructor(channel, { logDirectory, maxFileSize }) {
        this.logDirectory = logDirectory !== null && logDirectory !== void 0 ? logDirectory : FileLogger.defaultLogDirectory;
        this.maxFileSize = maxFileSize !== null && maxFileSize !== void 0 ? maxFileSize : FileLogger.defaultMaxSize;
        this.winston = createLogger({
            format: plainTextFormat,
            transports: [
                ...FileLogger.levels.map(level => new winston.transports.File({
                    filename: this._loggerFile('all', level),
                    level
                })),
                ...FileLogger.levels.map(level => new winston.transports.File({
                    filename: this._loggerFile(channel, level),
                    level
                })),
            ]
        });
    }
    _loggerFile(channel, level) {
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
        catch (e) {
            // -2 = file doesn't exist
        }
        return filePath; // Return the original path
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
    format(messages) {
        return messages.map(this._formatSingle).join(' ');
    }
    _formatSingle(message) {
        if (typeof message === 'object') {
            return JSON.stringify(message);
        }
        return message;
    }
}
FileLogger.levels = ['error', 'warn', 'info', 'debug'];
FileLogger.defaultLogDirectory = './logs';
FileLogger.defaultMaxSize = 1073741824; // 1gb?
export default FileLogger;
