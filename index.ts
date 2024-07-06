import FileLogger from "./fileLogger";

interface DbModel {
    create(paths: {channel: string,level: string,message: any[]}): Promise<DbModel>;
}

export class Logger {
    static defaultDebugMode: boolean = false;
    static defaultDbModel:DbModel | null = null;
    static defaultLogOnFile: boolean | null = null;
    debugMode: boolean;
    logOnFile: boolean;
    fileLogger: FileLogger;
    dbModel: DbModel | null;
    channel: string;

    constructor(channel: string = 'nochannel', { debugMode=null, logDirectory = null, dbModel = null, logOnFile = null} = {}) {
      this.debugMode = debugMode ?? Logger.defaultDebugMode;
      this.dbModel = dbModel ?? Logger.defaultDbModel;
      this.logOnFile = logOnFile ?? Logger.defaultLogOnFile ?? true;

      console.log(this.logOnFile);

      if (this.logOnFile) {
        this.fileLogger = new FileLogger(channel, { logDirectory: logDirectory });
      }

      this.channel = channel;
    }
  
    log(...messages: any[]) {
        const formattedMessages = this.format(messages,'log');
        console.log(...formattedMessages);
        this.fileLogger?.info(...formattedMessages);
        this.dbModel?.create({channel: this.channel, level: 'log', message: messages});
    }
  
    debug(...messages: any[]) {
        const formattedMessages = this.format(messages,'debug');
        if (this.debugMode) {
            console.debug(...formattedMessages)
        }
        this.fileLogger?.debug(...formattedMessages);
        this.dbModel?.create({channel: this.channel, level: 'debug', message: messages});
    }
  
    info(...messages: any[]) {        
        const formattedMessages = this.format(messages,'info');
        if (this.debugMode) {
            console.info(...formattedMessages);
        }
        this.fileLogger?.info(...formattedMessages);
        this.dbModel?.create({channel: this.channel, level: 'info', message: messages});
    }
  
    warn(...messages: any[]) {        
        const formattedMessages = this.format(messages,'warning');
        if (this.debugMode) {
            console.warn(...formattedMessages)
        }
        this.fileLogger?.warn(...formattedMessages);
        this.dbModel?.create({channel: this.channel, level: 'warning', message: messages});
    }
  
    error(...messages: any[]) {
        const formattedMessages = this.format(messages,'error');
        console.error(...formattedMessages)
        this.fileLogger?.error(...formattedMessages);
        this.dbModel?.create({channel: this.channel, level: 'error', message: messages});
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

export default Logger;
