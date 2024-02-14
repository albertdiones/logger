import winston from "winston";
import FileLogger from "./fileLogger";

export class Logger {
    static defaultDebugMode: Boolean;
    debugMode: Boolean;
    fileLogger: FileLogger;
    channel: string;
    constructor(channel: string = 'nochannel', {debugMode=false, logDirectory = null} = {}) {
      this.debugMode = debugMode ?? Logger.defaultDebugMode;
      this.fileLogger = new FileLogger(channel, {logDirectory: logDirectory});
      this.channel = channel;
    }
  
    log(...messages) {
        const formattedMessages = this.format(messages,'log');
        console.log(...formattedMessages);
        this.fileLogger.info(...formattedMessages);
    }
  
    debug(...messages) {
        const formattedMessages = this.format(messages,'debug');
        if (this.debugMode) {
            console.debug(...formattedMessages)
        }
        this.fileLogger.debug(...formattedMessages);
    }
  
    info(...messages) {        
        const formattedMessages = this.format(messages,'info');
        if (this.debugMode) {
            console.info(...formattedMessages);
        }
        this.fileLogger.info(...formattedMessages);      
    }
  
    warn(...messages) {        
        const formattedMessages = this.format(messages,'warning');
        if (this.debugMode) {
            console.warn(...formattedMessages)
        }
        this.fileLogger.warn(...formattedMessages);
    }
  
    error(...messages) {
        const formattedMessages = this.format(messages,'error');
        console.error(...formattedMessages)
        this.fileLogger.error(...formattedMessages);
    }

    format(messages: Array<any>,type) {
        messages.unshift(
            `[${Date.now().toLocaleString()}]`,
            `[${type}]`
        );
        return messages;
    }
  }

export const logger = new Logger();

export default logger;