/**
 * useRevealGroup — Reveal Group Hook
 *
 * Returns the runtime reveal state for a group by ID, re-rendering
 * only when the group's aggregate state changes.
 *
 * Read-only: this hook selects from the reveal snapshot. To register
 * or drive a group, use the manager API directly.
 *
 * Phase 5.6: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function GalleryReveal() {
 *   const group = useRevealGroup('artisan-portraits');
 *   return <span>{group?.revealedCount} / {group?.totalCount}</span>;
 * }
 * ```
 */

import { useCallback } from 'react';

import { useProgressiveReveal } from './use-progressive-reveal';

import type {
  ProgressiveRevealSnapshot,
  RevealGroupState,
} from '../progressive-reveal.types';

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns the reveal state for a group, or `undefined` if the group
 * is not registered.
 *
 * @param id - The reveal group ID
 * @returns The group's runtime state, or undefined
 */
export function useRevealGroup(id: string): RevealGroupState | undefined {
  const selector = useCallback(
    (snapshot: ProgressiveRevealSnapshot) => snapshot.groups.get(id),
    [id],
  );

  const equality = useCallback(
    (a: RevealGroupState | undefined, b: RevealGroupState | undefined): boolean =>
      a?.state === b?.state &&
      a?.revealedCount === b?.revealedCount &&
      a?.totalCount === b?.totalCount &&
      a?.progress === b?.progress,
    [],
  );

  return useProgressiveReveal(selector, equality);
}
