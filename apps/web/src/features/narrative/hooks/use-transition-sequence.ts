/**
 * useTransitionSequence Hook
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Vertical scrolling is a storytelling device."
 *
 * Provides the full ordered transition sequence and sequence utilities.
 * Pure data access — no effects, no listeners, no side effects.
 *
 * Phase 5.2: Sequence access hooks.
 */

import { useMemo } from 'react';
import { useTransitionRegistry } from './use-transition-registry';
import type { TransitionMetadata } from '../narrative-transitions.types';
import type { SectionId } from '../narrative.types';

export interface UseTransitionSequenceResult {
  /** All transitions in scroll order */
  readonly sequence: readonly TransitionMetadata[];
  /** Total number of transitions */
  readonly count: number;
  /** Whether the sequence is empty */
  readonly isEmpty: boolean;
}

/**
 * Get the complete transition sequence in scroll order.
 *
 * @returns Sequence data with convenience fields
 */
export function useTransitionSequence(): UseTransitionSequenceResult {
  const registry = useTransitionRegistry();

  const sequence = useMemo(() => registry.getSequence(), [registry]);

  return useMemo(
    () => ({
      sequence,
      count: sequence.length,
      isEmpty: sequence.length === 0,
    }),
    [sequence],
  );
}

/**
 * Get the full transition definition (metadata + boundaries) for a section pair.
 *
 * @param from - Source section ID
 * @param to - Destination section ID
 * @returns TransitionDefinition or undefined
 */
export function useTransitionDefinition(
  from: SectionId,
  to: SectionId,
) {
  const registry = useTransitionRegistry();

  return useMemo(
    () => registry.getDefinition(from, to),
    [registry, from, to],
  );
}
