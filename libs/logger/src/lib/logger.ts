import { reactive, ref } from 'vue';

export const useLogger = () => LoggerSingleton.getInstance();

export class LoggerSingleton {
  public static instance: Logger;

  public static getInstance() {
    if (!LoggerSingleton.instance) {
      LoggerSingleton.instance = new Logger();
    }

    return LoggerSingleton.instance;
  }
}

// TODO Allow to pass trace
export class Logger {
  private readonly _stream = reactive([] as Msg[]);

  get stream() {
    return this._stream;
  }

  private logFunctions: Record<LogLevel, (...data: any[]) => void> = {
    [LogLevel.Trace]: console.log,
    [LogLevel.Info]: console.info,
    [LogLevel.Warn]: console.warn,
    [LogLevel.Error]: console.error,
  };

  private _log(
    { level, scope }: { level: LogLevel; scope: string },
    ...args: any[]
  ) {
    const logFunction = this.logFunctions[level];
    const msg = {
      time: new Date(),
      level,
      scope,
      parts: args,
      toString() {
        return `[${this.scope}]` + this.parts.join('');
      },
    };
    logFunction(`[${scope}]`, ...args);
    this._stream.push(msg);
  }

  public trace(scope: string, ...args: any[]) {
    this._log(
      {
        level: LogLevel.Trace,
        scope,
      },
      ...args
    );
  }

  public info(scope: string, ...args: any[]) {
    this._log(
      {
        level: LogLevel.Info,
        scope,
      },
      ...args
    );
  }

  public warn(scope: string, ...args: any[]) {
    this._log(
      {
        level: LogLevel.Warn,
        scope,
      },
      ...args
    );
  }

  public error(scope: string, ...args: any[]) {
    this._log(
      {
        level: LogLevel.Error,
        scope,
      },
      ...args
    );
  }
}

export enum LogLevel {
  Trace,
  Info,
  Warn,
  Error,
}

// TODO Make this string | string[], more comfortable and allows more deep scopes
export type LogScope = `${string}:${string}` | string;

export type Msg = {
  time: Date;
  level: LogLevel;
  scope: LogScope;
  parts: any[];
  toString: () => string;
};
