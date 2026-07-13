import { z } from 'zod';

/**
 * Runtime assertion that throws with a descriptive error message.
 * Use to enforce invariants that should never be violated.
 *
 * @param condition - The condition to assert
 * @param message - Error message (shown in development)
 *
 * @example
 * ```ts
 * function processBooking(booking: Booking | null) {
 *   invariant(booking, 'Booking must not be null before processing');
 *   // booking is narrowed to Booking
 * }
 * ```
 */
export function invariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(`[Invariant] ${message}`);
  }
}

/**
 * Exhaustiveness check for discriminated unions / switch statements.
 * If all cases are handled, this function should never be called.
 *
 * @param value - The unhandled value (should be `never`)
 * @param message - Optional custom error message
 *
 * @example
 * ```ts
 * type Status = 'pending' | 'confirmed' | 'cancelled';
 *
 * function getStatusColor(status: Status): string {
 *   switch (status) {
 *     case 'pending': return '#B8965A';
 *     case 'confirmed': return '#4CAF50';
 *     case 'cancelled': return '#999';
 *     default: return assertNever(status);
 *   }
 * }
 * ```
 */
export function assertNever(value: never, message?: string): never {
  throw new Error(
    message ?? `Unexpected value: ${JSON.stringify(value)}`,
  );
}

/**
 * Safely parse a value through a Zod schema.
 * Returns a discriminated result instead of throwing.
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns A result object with success/error discriminant
 *
 * @example
 * ```ts
 * import { z } from 'zod';
 *
 * const BookingSchema = z.object({
 *   serviceId: z.string(),
 *   date: z.string(),
 * });
 *
 * const result = safeParse(BookingSchema, input);
 * if (result.success) {
 *   // result.data is typed as { serviceId: string; date: string }
 * } else {
 *   // result.error is a ZodError
 * }
 * ```
 */
export function safeParse<T extends z.ZodType>(
  schema: T,
  data: unknown,
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  return schema.safeParse(data);
}
