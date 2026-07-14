/**
 * useNarrativeOrder — Ordered Sections Access Hook
 *
 * From DESIGN_SYSTEM §Architecture:
 * "Hooks are pure data access — no side effects, no listeners."
 *
 * This hook provides ordered section access for:
 * - Navigation rendering (section list in order)
 * - Scroll progress calculation (known total count)
 * - Section sequencing (previous/next)
 * - Active section detection preparation (Phase 8)
 *
 * Architecture:
 *   - Pure data access hook — no effects, no state, no side effects
 *   - Returns derived arrays from context (memoized at provider level)
 *   - Must be used within NarrativeProvider
 *
 * Usage:
 *   const { orderedIds, getNext, getPrevious, getIndex } = useNarrativeOrder();
 *
 * Phase 5.1: Data access only. Phase 8: scroll position integration.
 */

import { useCallback } from 'react';
import { useNarrativeContext } from '../narrative-context-internal';
import type { SectionId } from '../narrative.types';

/**
 * Return type for useNarrativeOrder.
 */
export interface NarrativeOrderAPI {
  /** All section IDs in scroll order */
  readonly orderedIds: readonly SectionId[];
  /** Only enabled section IDs in scroll order */
  readonly enabledIds: readonly SectionId[];
  /** Total number of sections */
  readonly total: number;
  /** Total number of enabled sections */
  readonly enabledTotal: number;
  /** Get the index of a section (0-based, -1 if not found) */
  getIndex(id: SectionId): number;
  /** Get the next section ID after the given one (null if last) */
  getNext(id: SectionId): SectionId | null;
  /** Get the previous section ID before the given one (null if first) */
  getPrevious(id: SectionId): SectionId | null;
}

/**
 * Access ordered section data for sequencing and navigation.
 *
 * Provides section ordering, navigation helpers (next/previous),
 * and index lookup — all pure data access with no side effects.
 *
 * Must be used within a NarrativeProvider.
 *
 * @returns The narrative order API
 *
 * @example
 * ```tsx
 * function SectionNav({ currentId }: { currentId: SectionId }) {
 *   const { getNext, getPrevious, enabledTotal, getIndex } = useNarrativeOrder();
 *   const next = getNext(currentId);
 *   const prev = getPrevious(currentId);
 *   const position = getIndex(currentId);
 *   return (
 *     <nav aria-label={`Section ${position + 1} of ${enabledTotal}`}>
 *       {prev && <a href={`#${prev}`}>Previous</a>}
 *       {next && <a href={`#${next}`}>Next</a>}
 *     </nav>
 *   );
 * }
 * ```
 */
export function useNarrativeOrder(): NarrativeOrderAPI {
  const { sectionIds, enabledSectionIds } = useNarrativeContext();

  const getIndex = useCallback(
    (id: SectionId): number => {
      return sectionIds.indexOf(id);
    },
    [sectionIds],
  );

  const getNext = useCallback(
    (id: SectionId): SectionId | null => {
      const index = enabledSectionIds.indexOf(id);
      if (index === -1 || index >= enabledSectionIds.length - 1) {
        return null;
      }
      return enabledSectionIds[index + 1];
    },
    [enabledSectionIds],
  );

  const getPrevious = useCallback(
    (id: SectionId): SectionId | null => {
      const index = enabledSectionIds.indexOf(id);
      if (index <= 0) {
        return null;
      }
      return enabledSectionIds[index - 1];
    },
    [enabledSectionIds],
  );

  return {
    orderedIds: sectionIds,
    enabledIds: enabledSectionIds,
    total: sectionIds.length,
    enabledTotal: enabledSectionIds.length,
    getIndex,
    getNext,
    getPrevious,
  };
}
