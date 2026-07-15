/**
 * useRevealSequence — Reveal Sequence Hook
 *
 * Returns the runtime state for an ordered reveal sequence by ID,
 * re-rendering only when the sequence progresses.
 *
 * Read-only: this hook selects from the reveal snapshot. To advance
 * a sequence, use the manager API (advanceSequence) directly.
 *
 * Phase 5.6: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function IntroSequence() {
 *   const seq = useRevealSequence('hero-intro');
 *   return <span>Step {seq?.completedCount} / {seq?.totalSteps}</span>;
 * }
 * ```
 */

import { useCallback } from 'react';

import { useProgressiveReveal } from './use-progressive-reveal';

import type {
  ProgressiveRevealSnapshot,
  RevealSequenceState,
} from '../progressive-reveal.types';

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns the runtime state for a sequence, or `undefined` if the
 * sequence is not registered.
 *
 * @param id - The reveal sequence ID
 * @returns The sequence's runtime state, or undefined
 */
export function useRevealSequence(
  id: string,
): RevealSequenceState | undefined {
  const selector = useCallback(
    (snapshot: ProgressiveRevealSnapshot) => snapshot.sequences.get(id),
    [id],
  );

  const equality = useCallback(
    (
      a: RevealSequenceState | undefined,
      b: RevealSequenceState | undefined,
    ): boolean =>
      a?.state === b?.state &&
      a?.activeStepIndex === b?.activeStepIndex &&
      a?.completedCount === b?.completedCount &&
      a?.isComplete === b?.isComplete,
    [],
  );

  return useProgressiveReveal(selector, equality);
}
