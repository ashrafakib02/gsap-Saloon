/**
 * useRevealItem — Single Reveal Item Hook
 *
 * Returns the runtime reveal state for a single item by ID,
 * re-rendering only when that item's state changes.
 *
 * Read-only: this hook selects from the reveal snapshot. To drive
 * reveals, use the manager API directly (reveal, beginReveal, reset).
 *
 * Phase 5.6: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function FadeInBlock({ id }: { id: string }) {
 *   const item = useRevealItem(id);
 *   const revealed = item?.state === 'revealed';
 *   return <div data-revealed={revealed}>...</div>;
 * }
 * ```
 */

import { useCallback } from 'react';

import { useProgressiveReveal } from './use-progressive-reveal';

import type {
  ProgressiveRevealSnapshot,
  RevealItemState,
} from '../progressive-reveal.types';

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns the reveal state for a single item, or `undefined` if the
 * item is not registered.
 *
 * @param id - The reveal item ID
 * @returns The item's runtime state, or undefined
 */
export function useRevealItem(id: string): RevealItemState | undefined {
  const selector = useCallback(
    (snapshot: ProgressiveRevealSnapshot) => snapshot.items.get(id),
    [id],
  );

  const equality = useCallback(
    (a: RevealItemState | undefined, b: RevealItemState | undefined): boolean =>
      a?.state === b?.state &&
      a?.visibility === b?.visibility &&
      a?.progress === b?.progress &&
      a?.dependenciesMet === b?.dependenciesMet,
    [],
  );

  return useProgressiveReveal(selector, equality);
}
