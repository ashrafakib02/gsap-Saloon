/**
 * useRevealVisibility — Reveal Visibility Hook
 *
 * Returns the viewport-relative visibility for a single item by ID,
 * re-rendering only when that item's visibility changes.
 *
 * Distinct from reveal state: visibility describes where the item is
 * relative to the viewport (hidden/entering/visible/leaving), while
 * reveal state describes its lifecycle. Consumers use this to decide
 * WHEN to trigger a reveal.
 *
 * Read-only: this hook selects from the reveal snapshot. To update an
 * item's visibility, use the manager API (setVisibility) directly.
 *
 * Phase 5.6: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function LazyMedia({ id }: { id: string }) {
 *   const visibility = useRevealVisibility(id);
 *   const inView = visibility === 'visible' || visibility === 'entering';
 *   return inView ? <img src="..." /> : <div className="placeholder" />;
 * }
 * ```
 */

import { useCallback } from 'react';

import { useProgressiveReveal } from './use-progressive-reveal';

import type {
  ProgressiveRevealSnapshot,
  RevealVisibility,
} from '../progressive-reveal.types';

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns the viewport-relative visibility for a single item.
 *
 * Returns `'hidden'` when the item is not registered — a safe default
 * that keeps content out of any reveal until it is known.
 *
 * @param id - The reveal item ID
 * @returns The item's current visibility state
 */
export function useRevealVisibility(id: string): RevealVisibility {
  const selector = useCallback(
    (snapshot: ProgressiveRevealSnapshot): RevealVisibility =>
      snapshot.items.get(id)?.visibility ?? 'hidden',
    [id],
  );

  return useProgressiveReveal(selector);
}
