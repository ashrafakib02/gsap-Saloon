/**
 * Returns a promise that resolves after the specified duration.
 *
 * Useful for:
 * - Adding deliberate delays for animation sequencing
 * - Debouncing async operations
 * - Waiting for DOM updates
 *
 * @param ms - Duration in milliseconds
 * @returns A promise that resolves after the delay
 *
 * @example
 * ```ts
 * await sleep(300); // Wait 300ms
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
