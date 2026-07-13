/**
 * Infrastructure — Barrel Export
 *
 * Logger and application event system.
 */

export { logger, setLogLevel, getLogHistory, clearLogHistory } from './logger';
export type { LogLevel, LogEntry } from './logger';

export { eventBus } from './event-system';
export type { EventMap, EventKey } from './event-system';
