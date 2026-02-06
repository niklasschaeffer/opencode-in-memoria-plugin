/**
 * Logging utility for In-Memoria OpenCode Plugin
 * Provides consistent logging with configurable levels
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
export class Logger {
    static level = LogLevel.INFO;
    static setLevel(level) {
        this.level = level;
    }
    static debug(message, ...args) {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(`[In-Memoria] 🔍 ${message}`, ...args);
        }
    }
    static info(message, ...args) {
        if (this.level <= LogLevel.INFO) {
            console.log(`[In-Memoria] ℹ️  ${message}`, ...args);
        }
    }
    static warn(message, ...args) {
        if (this.level <= LogLevel.WARN) {
            console.warn(`[In-Memoria] ⚠️  ${message}`, ...args);
        }
    }
    static error(message, ...args) {
        if (this.level <= LogLevel.ERROR) {
            console.error(`[In-Memoria] ❌ ${message}`, ...args);
        }
    }
    static success(message, ...args) {
        if (this.level <= LogLevel.INFO) {
            console.log(`[In-Memoria] ✅ ${message}`, ...args);
        }
    }
}
export { Logger as default };
//# sourceMappingURL=logger.js.map