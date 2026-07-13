/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param value - The value to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped value
 *
 * @example
 * ```ts
 * clamp(150, 0, 100);  // → 100
 * clamp(-5, 0, 100);   // → 0
 * clamp(50, 0, 100);   // → 50
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linearly interpolates between two values.
 *
 * @param start - The start value (returned when t = 0)
 * @param end - The end value (returned when t = 1)
 * @param t - Interpolation factor (0–1, but not clamped)
 * @returns The interpolated value
 *
 * @example
 * ```ts
 * lerp(0, 100, 0.5);  // → 50
 * lerp(10, 20, 0.75); // → 17.5
 * ```
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Maps a value from one range to another.
 *
 * @param value - The input value
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns The mapped value (not clamped to output range)
 *
 * @example
 * ```ts
 * // Map scroll position (0–1000) to opacity (0–1)
 * mapRange(500, 0, 1000, 0, 1); // → 0.5
 *
 * // Map percentage (0–100) to viewport pixels
 * mapRange(25, 0, 100, 0, 30);  // → 7.5
 * ```
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
