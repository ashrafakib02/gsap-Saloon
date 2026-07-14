/**
 * useTransitionMetadata Hook
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The scroll is a narrative timeline."
 *
 * Convenience hooks for querying transition metadata
 * by type, mood, or priority.
 * Pure data access — no effects, no listeners, no side effects.
 *
 * Phase 5.2: Metadata query hooks.
 */

import { useMemo } from 'react';
import { useTransitionRegistry } from './use-transition-registry';
import type {
  TransitionMetadata,
  TransitionType,
  TransitionMood,
  TransitionPriority,
} from '../narrative-transitions.types';

/**
 * Get all transitions of a specific type.
 *
 * @param type - The transition type to filter by
 * @returns Array of matching transitions
 */
export function useTransitionsByType(
  type: TransitionType,
): readonly TransitionMetadata[] {
  const registry = useTransitionRegistry();

  return useMemo(() => registry.getByType(type), [registry, type]);
}

/**
 * Get all transitions of a specific mood.
 *
 * @param mood - The transition mood to filter by
 * @returns Array of matching transitions
 */
export function useTransitionsByMood(
  mood: TransitionMood,
): readonly TransitionMetadata[] {
  const registry = useTransitionRegistry();

  return useMemo(() => registry.getByMood(mood), [registry, mood]);
}

/**
 * Get all transitions of a specific priority.
 *
 * @param priority - The transition priority to filter by
 * @returns Array of matching transitions
 */
export function useTransitionsByPriority(
  priority: TransitionPriority,
): readonly TransitionMetadata[] {
  const registry = useTransitionRegistry();

  return useMemo(() => registry.getByPriority(priority), [registry, priority]);
}

/**
 * Get only enabled transitions.
 *
 * @returns Array of enabled transitions
 */
export function useEnabledTransitions(): readonly TransitionMetadata[] {
  const registry = useTransitionRegistry();

  return useMemo(() => registry.getEnabled(), [registry]);
}

/**
 * Get transitions that cross act boundaries.
 *
 * @returns Array of act-level transitions
 */
export function useActTransitions(): readonly TransitionMetadata[] {
  const registry = useTransitionRegistry();

  return useMemo(() => registry.getActTransitions(), [registry]);
}
