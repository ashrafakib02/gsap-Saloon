/**
 * useTimelineRegistry Hook
 *
 * Provides access to the immutable timeline registry.
 * Pure data access — no effects, no listeners, no side effects.
 *
 * Phase 5.3: Registry access.
 */

import { useMemo } from 'react';
import { TIMELINE_REGISTRY } from '../narrative-timeline.config';
import type { TimelineRegistry } from '../narrative-timeline.types';

/**
 * Access the global timeline registry.
 *
 * Returns the same frozen registry instance on every render.
 */
export function useTimelineRegistry(): TimelineRegistry {
  return useMemo(() => TIMELINE_REGISTRY, []);
}
