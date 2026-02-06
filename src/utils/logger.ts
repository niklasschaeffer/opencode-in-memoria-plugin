/**
 * Logging utility for In-Memoria OpenCode Plugin
 * Provides consistent logging with configurable levels
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private static level: LogLevel = LogLevel.INFO

  static setLevel(level: LogLevel): void {
    this.level = level
  }

  static debug(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[In-Memoria] 🔍 ${message}`, ...args)
    }
  }

  static info(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`[In-Memoria] ℹ️  ${message}`, ...args)
    }
  }

  static warn(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[In-Memoria] ⚠️  ${message}`, ...args)
    }
  }

  static error(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[In-Memoria] ❌ ${message}`, ...args)
    }
  }

  static success(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`[In-Memoria] ✅ ${message}`, ...args)
    }
  }
}

export { Logger as default }
