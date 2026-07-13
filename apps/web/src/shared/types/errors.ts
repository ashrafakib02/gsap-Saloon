/**
 * Shared error types, the {@link AppError} class, and API response shapes.
 *
 * All error handling throughout the app should flow through these types so
 * we get a consistent wire format and can feed errors into monitoring later.
 *
 * @module shared/types/errors
 */

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

/**
 * Error severity levels.
 *
 * Mirrors the severity taxonomy defined in TECHNICAL_ARCHITECTURE §12.
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Domain-specific error categories.
 *
 * Used to route errors to the right monitoring channel / UI fallback.
 */
export type ErrorCategory =
  | 'network'
  | 'validation'
  | 'auth'
  | 'permission'
  | 'not-found'
  | 'server'
  | 'client'
  | 'animation'
  | '3d'
  | 'booking';

/* -------------------------------------------------------------------------- */
/*                              AppError class                                */
/* -------------------------------------------------------------------------- */

/** Constructor parameters for {@link AppError}. */
export interface AppErrorParams {
  message: string;
  code?: string;
  severity?: ErrorSeverity;
  category?: ErrorCategory;
  context?: Record<string, unknown>;
  cause?: unknown;
}

/**
 * Application-wide error class.
 *
 * Extends the native `Error` with a structured code, severity, category
 * and optional context payload. The `cause` chain is preserved when using
 * `new AppError({ …, cause })`.
 *
 * @example
 * ```ts
 * throw new AppError({
 *   message: 'Booking slot unavailable',
 *   code: 'BOOKING_CONFLICT',
 *   severity: 'medium',
 *   category: 'booking',
 *   context: { slotId: 's_123' },
 * });
 * ```
 */
export class AppError extends Error {
  /** Machine-readable error code (e.g. `'BOOKING_CONFLICT'`). */
  readonly code: string;

  /** How urgent this error is. */
  readonly severity: ErrorSeverity;

  /** Which domain the error belongs to. */
  readonly category: ErrorCategory;

  /** Arbitrary context attached at throw-time. */
  readonly context?: Record<string, unknown>;

  /** Epoch-ms when the error was created. */
  readonly timestamp: number;

  constructor(params: AppErrorParams) {
    super(params.message, { cause: params.cause });
    this.name = 'AppError';
    this.code = params.code ?? 'UNKNOWN';
    this.severity = params.severity ?? 'medium';
    this.category = params.category ?? 'client';
    this.context = params.context;
    this.timestamp = Date.now();

    // Fix the prototype chain so `instanceof AppError` works in all targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/* -------------------------------------------------------------------------- */
/*                           API response shapes                              */
/* -------------------------------------------------------------------------- */

/**
 * Error response returned by the API.
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/**
 * Success response wrapper for the API.
 *
 * @typeParam T - The shape of the payload inside `data`.
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Discriminated union covering both success and error API responses.
 *
 * Narrow with `if (response.success)` to get the correct type.
 *
 * @typeParam T - The shape of the success payload.
 *
 * @example
 * ```ts
 * const res: ApiResponse<User> = await fetchUser(id);
 * if (res.success) {
 *   // res.data is User
 * } else {
 *   // res.error.code / res.error.message
 * }
 * ```
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
