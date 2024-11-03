import { env } from "~/env.mjs"

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  SILENT = 5,
}
export type LogLevelString = keyof typeof LogLevel
export const parseLogLevel = (level: string): LogLevel => {
  switch (level.toUpperCase()) {
    case 'TRACE':
      return LogLevel.TRACE
    case 'DEBUG':
      return LogLevel.DEBUG
    case 'INFO':
    case 'NOTICE':
      return LogLevel.INFO
    case 'WARN':
      return LogLevel.WARN
    case 'ERROR':
    case 'CRITICAL':
    case 'ALERT':
    case 'EMERGENCY':
      return LogLevel.ERROR
    default:
      return LogLevel.SILENT
  }
}

class Logger {
  private level: LogLevel

  constructor(level: LogLevel) {
    this.level = level
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }

  private logMessage = (
    level: LogLevel,
    message?: unknown,
    ...optionalParams: unknown[]
  ): void => {
    if (level >= this.level) {
      const method = LogLevel[level].toLowerCase() as Exclude<
        Lowercase<LogLevelString>,
        'silent'
      >
      console[method](message, ...optionalParams)
    }
  }

  info(message?: unknown, ...optionalParams: unknown[]): void {
    this.logMessage(LogLevel.INFO, message, ...optionalParams)
  }

  error(message?: unknown, ...optionalParams: unknown[]): void {
    this.logMessage(LogLevel.ERROR, message, ...optionalParams)
  }

  warn(message?: unknown, ...optionalParams: unknown[]): void {
    this.logMessage(LogLevel.WARN, message, ...optionalParams)
  }

  debug(message?: unknown, ...optionalParams: unknown[]): void {
    this.logMessage(LogLevel.DEBUG, message, ...optionalParams)
  }

  trace(message?: unknown, ...optionalParams: unknown[]): void {
    this.logMessage(LogLevel.TRACE, message, ...optionalParams)
  }

  log(message?: unknown, ...optionalParams: unknown[]): void {
    this.logMessage(LogLevel.INFO, message, ...optionalParams)
  }
}
const baseLogLevel = env.NEXT_PUBLIC_ENV === "development" ? 'debug' : 'silent'
const logLevel = parseLogLevel(baseLogLevel)
export const logger = new Logger(logLevel)