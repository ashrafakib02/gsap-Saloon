/**
 * Lightweight logger with level filtering and in-memory history.
 *
 * In development all four levels are emitted; in production only `warn`
 * and `error` reach the console. The last 100 entries are kept in a
 * circular buffer accessible via {@link getLogHistory}.
 *
 * @module shared/infra/logger
 */

import { isDev } from '@/shared/config/env';

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

/** Supported log levels ordered by severity (lowest → highest). */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** A single log entry stored in the history buffer. */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/*                               Internal state                               */
/* -------------------------------------------------------------------------- */

/** Maximum entries retained in the circular history buffer. */
const MAX_HISTORY = 100;

/** Numeric ordering used for level comparison. */
const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/** Current minimum level — messages below this are discarded. */
let currentLevel: LogLevel = isDev ? 'debug' : 'warn';

/** Circular buffer of recent log entries. */
const history: LogEntry[] = [];

/* -------------------------------------------------------------------------- */
/*                              Console mapping                               */
/* -------------------------------------------------------------------------- */

const CONSOLE_METHODS: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

/* -------------------------------------------------------------------------- */
/*                                Internal                                    */
/* -------------------------------------------------------------------------- */

const PREFIX = '[Sovereign]';

/**
 * Core logging implementation.
 */
function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
): void {
  // Filter by current minimum level.
  if (LEVEL_ORDER[level] < LEVEL_ORDER[currentLevel]) {
    return;
  }

  const entry: LogEntry = {
    level,
    message,
    timestamp: Date.now(),
    context,
  };

  // Push to history (drop oldest when at capacity).
  if (history.length >= MAX_HISTORY) {
    history.shift();
  }
  history.push(entry);

  // Emit to the browser / Node console.
  const consoleFn = CONSOLE_METHODS[level];
  if (context && Object.keys(context).length > 0) {
    consoleFn(`${PREFIX} ${message}`, context);
  } else {
    consoleFn(`${PREFIX} ${message}`);
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Logger                                    */
/* -------------------------------------------------------------------------- */

/**
 * Application logger instance.
 *
 * Each method accepts a human-readable `message` and an optional `context`
 * object that will be attached to the console output and the history entry.
 *
 * @example
 * ```ts
 * import { logger } from '@/shared/infra/logger';
 *
 * logger.info('Page loaded', { route: '/home', duration: 320 });
 * logger.error('API call failed', { endpoint: '/services', status: 500 });
 * ```
 */
export const logger = {
  /**
   * Emit a debug-level message. Stripped in production.
   *
   * @param message - Description of the event.
   * @param context - Arbitrary key-value metadata.
   */
  debug(message: string, context?: Record<string, unknown>): void {
    log('debug', message, context);
  },

  /**
   * Emit an info-level message. Stripped in production.
   *
   * @param message - Description of the event.
   * @param context - Arbitrary key-value metadata.
   */
  info(message: string, context?: Record<string, unknown>): void {
    log('info', message, context);
  },

  /**
   * Emit a warning. Always visible regardless of mode.
   *
   * @param message - Description of the warning.
   * @param context - Arbitrary key-value metadata.
   */
  warn(message: string, context?: Record<string, unknown>): void {
    log('warn', message, context);
  },

  /**
   * Emit an error. Always visible regardless of mode.
   *
   * @param message - Description of the error.
   * @param context - Arbitrary key-value metadata.
   */
  error(message: string, context?: Record<string, unknown>): void {
    log('error', message, context);
  },
};

/* -------------------------------------------------------------------------- */
/*                             Configuration API                              */
/* -------------------------------------------------------------------------- */

/**
 * Override the minimum log level at runtime.
 *
 * In production the default is `'warn'`; in development it is `'debug'`.
 *
 * @param level - New minimum level.
 *
 * @example
 * ```ts
 * import { setLogLevel } from '@/shared/infra/logger';
 *
 * // Quiet mode — only warnings and errors.
 * setLogLevel('warn');
 * ```
 */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

/**
 * Return a shallow copy of the last {@link MAX_HISTORY} log entries.
 *
 * @returns Array of {@link LogEntry} objects (oldest first).
 */
export function getLogHistory(): LogEntry[] {
  return [...history];
}

/**
 * Flush the in-memory log history.
 */
export function clearLogHistory(): void {
  history.length = 0;
}
