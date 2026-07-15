/**
 * useScrollVelocity — Scroll Velocity Hook
 *
 * Returns scroll velocity information including instantaneous
 * speed, smoothed velocity, and fast-scroll detection.
 *
 * Velocity is computed from scroll position deltas over time
 * and smoothed over recent frames for stability.
 *
 * Phase 5.5: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function VelocityIndicator() {
 *   const { velocity, isFastScrolling } = useScrollVelocity();
 *
 *   return (
 *     <div className={isFastScrolling ? 'fast' : 'normal'}>
 *       Speed: {Math.round(velocity)}px/s
 *     </div>
 *   );
 * }
 * ```
 */

import { useScrollState } from './use-scroll-state';

import type { ScrollState } from '../scroll-state.types';
import { VELOCITY_THRESHOLDS } from '../scroll-state.constants';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useScrollVelocity.
 */
export interface UseScrollVelocityReturn {
  /** Current scroll velocity (pixels/second) */
  readonly velocity: number;
  /** Smoothed velocity (averaged over recent frames) */
  readonly smoothedVelocity: number;
  /** Absolute velocity value */
  readonly speed: number;
  /** Whether velocity exceeds fast-scroll threshold */
  readonly isFastScrolling: boolean;
}

// ── Selector ───────────────────────────────────────────────

/**
 * Extracts velocity-relevant fields from the scroll state.
 */
function velocitySelector(state: ScrollState): UseScrollVelocityReturn {
  const speed = Math.abs(state.velocity);
  return {
    velocity: state.velocity,
    smoothedVelocity: state.smoothedVelocity,
    speed,
    isFastScrolling: speed > VELOCITY_THRESHOLDS.fast,
  };
}

/**
 * Equality function for the velocity selector.
 */
function velocityEquality(
  prev: UseScrollVelocityReturn,
  next: UseScrollVelocityReturn,
): boolean {
  return (
    prev.velocity === next.velocity &&
    prev.smoothedVelocity === next.smoothedVelocity
  );
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns scroll velocity and speed information.
 *
 * Velocity is computed from position deltas over time and
 * smoothed over recent frames for stability.
 *
 * @returns Velocity state for speed-aware behaviors
 */
export function useScrollVelocity(): UseScrollVelocityReturn {
  return useScrollState(velocitySelector, velocityEquality);
}
