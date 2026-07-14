/**
 * useSectionTransition Hook
 *
 * From DESIGN_SYSTEM §14:
 * "Section-to-section relationships follow an enter-stay-exit lifecycle."
 *
 * Returns transition metadata for a specific section pair.
 * Pure data access — no effects, no listeners, no side effects.
 *
 * Phase 5.2: Transition data access.
 */

import { useMemo } from 'react';
import { useTransitionRegistry } from './use-transition-registry';
import type { TransitionMetadata } from '../narrative-transitions.types';
import type { SectionId } from '../narrative.types';

export interface UseSectionTransitionResult {
  /** The transition metadata, or undefined if not found */
  readonly transition: TransitionMetadata | undefined;
  /** Whether this transition exists in the registry */
  readonly exists: boolean;
  /** Whether this transition is enabled */
  readonly isEnabled: boolean;
}

/**
 * Get transition metadata between two sections.
 *
 * @param from - Source section ID
 * @param to - Destination section ID
 * @returns Transition data with convenience flags
 */
export function useSectionTransition(
  from: SectionId,
  to: SectionId,
): UseSectionTransitionResult {
  const registry = useTransitionRegistry();

  const transition = useMemo(
    () => registry.getBetween(from, to),
    [registry, from, to],
  );

  return useMemo(
    () => ({
      transition,
      exists: transition !== undefined,
      isEnabled: transition?.enabled ?? false,
    }),
    [transition],
  );
}

/**
 * Get the transition that enters a specific section.
 *
 * @param sectionId - The section to get the entry transition for
 * @returns Transition data with convenience flags
 */
export function useEntryTransition(
  sectionId: SectionId,
): UseSectionTransitionResult {
  const registry = useTransitionRegistry();

  const transition = useMemo(
    () => registry.getEntry(sectionId),
    [registry, sectionId],
  );

  return useMemo(
    () => ({
      transition,
      exists: transition !== undefined,
      isEnabled: transition?.enabled ?? false,
    }),
    [transition],
  );
}

/**
 * Get the transition that exits a specific section.
 *
 * @param sectionId - The section to get the exit transition for
 * @returns Transition data with convenience flags
 */
export function useExitTransition(
  sectionId: SectionId,
): UseSectionTransitionResult {
  const registry = useTransitionRegistry();

  const transition = useMemo(
    () => registry.getExit(sectionId),
    [registry, sectionId],
  );

  return useMemo(
    () => ({
      transition,
      exists: transition !== undefined,
      isEnabled: transition?.enabled ?? false,
    }),
    [transition],
  );
}
