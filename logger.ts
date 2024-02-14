import winston from "winston";
import { debugMode } from "./env";
import { dateFormat } from "./format";
import FileLogger from "./fileLogger";
require('dotenv').config(); 

export class Logger {
    debugMode;
    fileLogger;
    channel: string;
    constructor(channel: string = 'nochannel') {
      this.debugMode = debugMode;
      this.fileLogger = new FileLogger(channel);
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
            `[${dateFormat(Date.now())}]`,
            `[${type}]`
        );
        return messages;
    }
  }

export const logger = new Logger();

export default logger;