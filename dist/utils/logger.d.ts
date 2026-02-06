/**
 * Logging utility for In-Memoria OpenCode Plugin
 * Provides consistent logging with configurable levels
 */
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export declare class Logger {
    private static level;
    static setLevel(level: LogLevel): void;
    static debug(message: string, ...args: unknown[]): void;
    static info(message: string, ...args: unknown[]): void;
    static warn(message: string, ...args: unknown[]): void;
    static error(message: string, ...args: unknown[]): void;
    static success(message: string, ...args: unknown[]): void;
}
export { Logger as default };
//# sourceMappingURL=logger.d.ts.map