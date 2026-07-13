/**
 * Monitoring abstraction — error tracking and performance monitoring.
 * Provides a unified interface for capturing errors, messages, and breadcrumbs
 * across different monitoring providers.
 *
 * @module monitoring-abstraction
 */

/**
 * Interface that all monitoring providers must implement.
 */
interface MonitoringProvider {
  /** Capture an error with optional context. */
  captureError(error: Error, context?: Record<string, unknown>): void;
  /** Capture a log message at a given severity level. */
  captureMessage(message: string, level: 'info' | 'warning' | 'error'): void;
  /** Add a navigation/action breadcrumb for debugging trails. */
  addBreadcrumb(category: string, message: string, data?: Record<string, unknown>): void;
  /** Set a tag for all subsequent events (e.g., 'userId', 'environment'). */
  setTag(key: string, value: string): void;
}

/**
 * Configuration for the monitoring provider.
 */
interface MonitoringConfig {
  /** DSN (Data Source Name) for the error tracking service. */
  dsn?: string;
  /** Current environment. */
  environment: 'development' | 'staging' | 'production';
  /** Sample rate for performance events (0.0 to 1.0). */
  sampleRate: number;
  /** Maximum number of breadcrumbs to retain. */
  maxBreadcrumbs: number;
}

/**
 * No-op monitoring provider for SSR and testing.
 * All methods silently do nothing.
 */
const NoopMonitoringProvider: MonitoringProvider = {
  captureError(): void {
    // No-op — SSR or testing
  },
  captureMessage(): void {
    // No-op
  },
  addBreadcrumb(): void {
    // No-op
  },
  setTag(): void {
    // No-op
  },
};

/**
 * Console-based monitoring provider for development.
 * Logs all monitoring events to the browser console with formatting.
 */
const ConsoleMonitoringProvider: MonitoringProvider = {
  captureError(error: Error, context?: Record<string, unknown>): void {
    console.error(
      '%c[monitoring:error]',
      'color: #ef4444; font-weight: bold;',
      error.message,
      error.stack,
      context ?? {},
    );
  },

  captureMessage(message: string, level: 'info' | 'warning' | 'error'): void {
    const style =
      level === 'error'
        ? 'color: #ef4444; font-weight: bold;'
        : level === 'warning'
          ? 'color: #f59e0b; font-weight: bold;'
          : 'color: #3b82f6; font-weight: bold;';

    console.log(`%c[monitoring:${level}]`, style, message);
  },

  addBreadcrumb(category: string, message: string, data?: Record<string, unknown>): void {
    console.log(
      `%c[breadcrumb:${category}]`,
      'color: #6b7280; font-style: italic;',
      message,
      data ?? {},
    );
  },

  setTag(key: string, value: string): void {
    console.log(
      '%c[tag]',
      'color: #8b5cf6; font-weight: bold;',
      `${key}=${value}`,
    );
  },
};

/**
 * Default monitoring configuration.
 * Uses environment variables from Vite's `import.meta.env`.
 */
const DEFAULT_MONITORING_CONFIG: Readonly<MonitoringConfig> = Object.freeze({
  dsn: undefined,
  environment: (import.meta.env.MODE as MonitoringConfig['environment']) ?? 'development',
  sampleRate: 1.0,
  maxBreadcrumbs: 50,
});

/**
 * Creates a monitoring provider appropriate for the current environment.
 *
 * - Server (SSR): NoopMonitoringProvider
 * - Development: ConsoleMonitoringProvider
 * - Production: Would return SentryProvider or similar (Phase 10)
 *
 * @returns The appropriate monitoring provider instance.
 */
function createMonitoringProvider(): MonitoringProvider {
  if (typeof window === 'undefined') {
    return NoopMonitoringProvider;
  }

  if (import.meta.env.DEV) {
    return ConsoleMonitoringProvider;
  }

  // Production: Phase 10 will integrate with Sentry or similar
  // return SentryMonitoringProvider(config);
  return ConsoleMonitoringProvider;
}

/**
 * Default monitoring provider singleton.
 * Lazily initialized on first access.
 */
let _monitoring: MonitoringProvider | null = null;

const monitoring: MonitoringProvider = {
  captureError(error: Error, context?: Record<string, unknown>): void {
    _monitoring ??= createMonitoringProvider();
    _monitoring.captureError(error, context);
  },
  captureMessage(message: string, level: 'info' | 'warning' | 'error'): void {
    _monitoring ??= createMonitoringProvider();
    _monitoring.captureMessage(message, level);
  },
  addBreadcrumb(category: string, message: string, data?: Record<string, unknown>): void {
    _monitoring ??= createMonitoringProvider();
    _monitoring.addBreadcrumb(category, message, data);
  },
  setTag(key: string, value: string): void {
    _monitoring ??= createMonitoringProvider();
    _monitoring.setTag(key, value);
  },
};

/**
 * Convenience wrapper to capture an error with optional context.
 *
 * @example
 * ```ts
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   captureError(error as Error, { source: 'booking-flow' });
 * }
 * ```
 *
 * @param error - The error to capture.
 * @param context - Optional additional context.
 */
function captureError(error: Error, context?: Record<string, unknown>): void {
  monitoring.captureError(error, context);
}

/**
 * Convenience wrapper to capture a log message.
 *
 * @example
 * ```ts
 * captureMessage('Booking flow started', 'info');
 * captureMessage('Rate limit approaching', 'warning');
 * ```
 *
 * @param message - The message to log.
 * @param level - Severity level (default 'info').
 */
function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
): void {
  monitoring.captureMessage(message, level);
}

/**
 * Convenience wrapper to add a breadcrumb for debugging trails.
 *
 * @example
 * ```ts
 * addBreadcrumb('navigation', 'User navigated to /services');
 * addBreadcrumb('booking', 'Service selected', { serviceId: 'cut-1' });
 * ```
 *
 * @param category - Breadcrumb category.
 * @param message - Breadcrumb message.
 * @param data - Optional additional data.
 */
function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>,
): void {
  monitoring.addBreadcrumb(category, message, data);
}

export type { MonitoringProvider, MonitoringConfig };
export {
  NoopMonitoringProvider,
  ConsoleMonitoringProvider,
  DEFAULT_MONITORING_CONFIG,
  createMonitoringProvider,
  monitoring,
  captureError,
  captureMessage,
  addBreadcrumb,
};
