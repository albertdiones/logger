import FileLogger from "./fileLogger";

export class Logger {
    static defaultDebugMode: boolean = false;
    debugMode: boolean;
    fileLogger: FileLogger;
    channel: string;

    constructor(channel: string = 'nochannel', { debugMode=null, logDirectory = null } = {}) {
      this.debugMode = debugMode ?? Logger.defaultDebugMode;
      this.fileLogger = new FileLogger(channel, { logDirectory: logDirectory });
      this.channel = channel;
    }
  
    log(...messages: any[]) {
        const formattedMessages = this.format(messages,'log');
        console.log(...formattedMessages);
        this.fileLogger.info(...formattedMessages);
    }
  
    debug(...messages: any[]) {
        const formattedMessages = this.format(messages,'debug');
        if (this.debugMode) {
            console.debug(...formattedMessages)
        }
        this.fileLogger.debug(...formattedMessages);
    }
  
    info(...messages: any[]) {        
        const formattedMessages = this.format(messages,'info');
        if (this.debugMode) {
            console.info(...formattedMessages);
        }
        this.fileLogger.info(...formattedMessages);      
    }
  
    warn(...messages: any[]) {        
        const formattedMessages = this.format(messages,'warning');
        if (this.debugMode) {
            console.warn(...formattedMessages)
        }
        this.fileLogger.warn(...formattedMessages);
    }
  
    error(...messages: any[]) {
        const formattedMessages = this.format(messages,'error');
        console.error(...formattedMessages)
        this.fileLogger.error(...formattedMessages);
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

export default new Logger();
