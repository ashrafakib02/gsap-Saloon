/**
 * useNarrative — Main Narrative Hook
 *
 * From DESIGN_SYSTEM §Architecture:
 * "Hooks are pure data access — no side effects, no listeners."
 *
 * This hook provides the narrative context value:
 * - The section registry (for direct lookups)
 * - All sections in scroll order
 * - Only enabled sections
 * - Section count and IDs
 *
 * Architecture:
 *   - Pure data access hook — no effects, no state, no side effects
 *   - Returns memoized context value (stable reference)
 *   - Must be used within NarrativeProvider
 *
 * Usage:
 *   const { sections, registry, enabledSections } = useNarrative();
 *
 * Phase 5.1: Data access only. Phase 8: scroll state added.
 */

import { useNarrativeContext } from '../narrative-context-internal';
import type { NarrativeContextValue } from '../narrative.types';

/**
 * Access the narrative context.
 *
 * Provides the section registry, all sections in scroll order,
 * enabled sections, and derived data.
 *
 * Must be used within a NarrativeProvider.
 *
 * @returns The narrative context value
 *
 * @example
 * ```tsx
 * function SectionList() {
 *   const { sections, sectionCount } = useNarrative();
 *   return (
 *     <nav>
 *       {sections.map(s => <li key={s.id}>{s.title}</li>)}
 *     </nav>
 *   );
 * }
 * ```
 */
export function useNarrative(): NarrativeContextValue {
  return useNarrativeContext();
}

export type { NarrativeContextValue };
