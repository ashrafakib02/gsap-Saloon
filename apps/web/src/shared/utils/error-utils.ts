/**
 * Error utility functions.
 *
 * Helpers for inspecting, wrapping, logging and categorising errors that
 * originate anywhere in the app.
 *
 * @module shared/utils/error-utils
 */

import { isDev } from '@/shared/config/env';
import {
  AppError,
  type AppErrorParams,
  type ErrorCategory,
  type ErrorSeverity,
} from '@/shared/types/errors';

/* -------------------------------------------------------------------------- */
/*                              Type guards                                   */
/* -------------------------------------------------------------------------- */

/**
 * Type-guard: returns `true` when `error` is an {@link AppError} instance.
 *
 * @example
 * ```ts
 * try { … } catch (e) {
 *   if (isAppError(e)) {
 *     console.log(e.code);
 *   }
 * }
 * ```
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/* -------------------------------------------------------------------------- */
/*                             Conversion helpers                             */
/* -------------------------------------------------------------------------- */

/**
 * Wrap any value into an {@link AppError}.
 *
 * If `error` is already an `AppError` it is returned as-is (with any
 * `defaults` merged for keys that are still at their default value).
 *
 * @param error    - The value to wrap.
 * @param defaults - Optional default params applied when the input has no
 *                   explicit values for those fields.
 * @returns An `AppError` instance.
 *
 * @example
 * ```ts
 * const appErr = toAppError(new Error('oops'), { category: 'network' });
 * ```
 */
export function toAppError(
  error: unknown,
  defaults?: Partial<AppErrorParams>,
): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError({
      message: error.message,
      cause: error,
      ...defaults,
    });
  }

  // Handle non-Error throwables (strings, numbers, objects).
  const message =
    typeof error === 'string'
      ? error
      : error instanceof Object
        ? JSON.stringify(error)
        : String(error);

  return new AppError({
    message,
    cause: error,
    ...defaults,
  });
}

/**
 * Extract a human-readable message from any thrown value.
 *
 * @param error - The value to inspect.
 * @returns A non-empty string suitable for display / logging.
 *
 * @example
 * ```ts
 * const msg = getErrorMessage(caught);
 * showToast(msg);
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (typeof error === 'number') return String(error);

  try {
    return JSON.stringify(error);
  } catch {
    return 'An unknown error occurred';
  }
}

/**
 * Return the severity of an error, defaulting to `'medium'`.
 *
 * @param error - The value to inspect.
 * @returns An {@link ErrorSeverity} level.
 */
export function getErrorSeverity(error: unknown): ErrorSeverity {
  if (isAppError(error)) return error.severity;
  return 'medium';
}

/* -------------------------------------------------------------------------- */
/*                                  Logging                                   */
/* -------------------------------------------------------------------------- */

/**
 * Log an error to the console (in dev) or forward it to a monitoring
 * service (in prod — placeholder for a future integration).
 *
 * @param error   - The error to log.
 * @param context - Optional extra context attached to the entry.
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  const appError = toAppError(error);

  if (isDev) {
    console.error(`[Sovereign] ${appError.category.toUpperCase()}:`, {
      message: appError.message,
      code: appError.code,
      severity: appError.severity,
      context: { ...appError.context, ...context },
      cause: appError.cause,
      stack: appError.stack,
    });
    return;
  }

  // TODO: Replace with a real monitoring integration (Sentry, LogRocket, etc.)
  // eslint-disable-next-line no-console
  console.error(`[Sovereign] ${appError.code}: ${appError.message}`);
}

/* -------------------------------------------------------------------------- */
/*                                Factory                                     */
/* -------------------------------------------------------------------------- */

/**
 * Create a category-bound error handler.
 *
 * The returned function wraps any caught value into an {@link AppError}
 * pre-filled with the given `category` and optional defaults.
 *
 * @param category - Error category to attach to every wrapped error.
 * @param defaults - Optional default params merged into every wrapped error.
 * @returns A `(error: unknown) => AppError` handler.
 *
 * @example
 * ```ts
 * const handleBookingError = createErrorHandler('booking', {
 *   severity: 'high',
 *   code: 'BOOKING_ERROR',
 * });
 *
 * try { await reserveSlot(id); }
 * catch (e) { report(handleBookingError(e)); }
 * ```
 */
export function createErrorHandler(
  category: ErrorCategory,
  defaults?: Partial<AppErrorParams>,
): (error: unknown) => AppError {
  return (error: unknown): AppError => {
    const appError = toAppError(error, { category, ...defaults });
    logError(appError);
    return appError;
  };
}
