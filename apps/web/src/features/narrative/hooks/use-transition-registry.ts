/**
 * useTransitionRegistry Hook
 *
 * Provides access to the immutable transition registry.
 * Pure data access — no effects, no listeners, no side effects.
 *
 * Phase 5.2: Registry access.
 */

import { useMemo } from 'react';
import { TRANSITION_REGISTRY } from '../narrative-transitions.config';
import type { TransitionRegistry } from '../narrative-transitions.types';

/**
 * Access the global transition registry.
 *
 * Returns the same frozen registry instance on every render.
 */
export function useTransitionRegistry(): TransitionRegistry {
  return useMemo(() => TRANSITION_REGISTRY, []);
}
