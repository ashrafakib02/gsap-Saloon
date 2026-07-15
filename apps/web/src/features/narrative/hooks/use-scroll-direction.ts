/**
 * useScrollDirection — Scroll Direction Hook
 *
 * Returns the current scroll direction and velocity information.
 * Useful for navigation behavior (hide-on-scroll-down, show-on-scroll-up),
 * analytics direction tracking, and animation direction decisions.
 *
 * From DESIGN_SYSTEM §14 Law 5:
 * "When the visitor scrolls backward, previously-revealed
 *  content remains revealed."
 *
 * Phase 5.5: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function Navigation() {
 *   const { direction, isForward, isBackward } = useScrollDirection();
 *
 *   return (
 *     <nav className={direction === 'down' ? 'nav-hidden' : 'nav-visible'}>
 *       ...
 *     </nav>
 *   );
 * }
 * ```
 */

import { useScrollState } from './use-scroll-state';

import type { ScrollState } from '../scroll-state.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useScrollDirection.
 */
export interface UseScrollDirectionReturn {
  /** Current scroll direction */
  readonly direction: import('../scroll-state.types').ScrollDirection;
  /** Whether the page is currently scrolling */
  readonly isScrolling: boolean;
  /** Whether scrolling forward (down) */
  readonly isForward: boolean;
  /** Whether scrolling backward (up) */
  readonly isBackward: boolean;
}

// ── Selector ───────────────────────────────────────────────

/**
 * Extracts direction-relevant fields from the scroll state.
 */
function directionSelector(state: ScrollState): UseScrollDirectionReturn {
  return {
    direction: state.direction,
    isScrolling: state.isScrolling,
    isForward: state.direction === 'down',
    isBackward: state.direction === 'up',
  };
}

/**
 * Equality function for the direction selector.
 */
function directionEquality(
  prev: UseScrollDirectionReturn,
  next: UseScrollDirectionReturn,
): boolean {
  return (
    prev.direction === next.direction &&
    prev.isScrolling === next.isScrolling
  );
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns the current scroll direction and related state.
 *
 * Direction changes are tracked with a configurable pixel
 * threshold (from scroll-state.config) to prevent jitter.
 *
 * @returns Direction state for navigation and animation decisions
 */
export function useScrollDirection(): UseScrollDirectionReturn {
  return useScrollState(directionSelector, directionEquality);
}
