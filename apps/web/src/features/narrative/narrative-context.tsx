/**
 * Narrative Provider — Context Provider for the Scroll-Linked Narrative
 *
 * From DESIGN_SYSTEM §Architecture:
 * "Provider pattern for cross-cutting concerns."
 *
 * This module provides NarrativeProvider which wraps the app and
 * supplies the scroll-linked narrative context to all descendants.
 *
 * Architecture:
 *   - Context value is memoized — stable reference across re-renders
 *   - Registry is created once at module load (narrative.config.ts)
 *   - Provider is lightweight: no effects, no listeners, no side effects
 *   - All derived data is computed once and memoized
 *
 * Phase 5.1: Context structure and data provision.
 */

import { type ReactNode, useMemo } from 'react';
import { NARRATIVE_REGISTRY } from './narrative.config';
import { NarrativeContext } from './narrative-context-internal';
import type { NarrativeContextValue } from './narrative.types';

// ── Provider ───────────────────────────────────────────────

interface NarrativeProviderProps {
  /** Child components that consume narrative context */
  children: ReactNode;
}

/**
 * NarrativeProvider — supplies the scroll-linked narrative context.
 *
 * Wraps the app at the page level. Provides:
 * - The section registry (immutable)
 * - All sections in scroll order
 * - Enabled sections only
 * - Section count and IDs
 *
 * From DESIGN_SYSTEM §Performance:
 * "Context value must be memoized to prevent unnecessary re-renders."
 *
 * The context value is derived once from the singleton registry
 * and memoized — it never changes across the app lifetime.
 */
export function NarrativeProvider({ children }: NarrativeProviderProps) {
  /* Derive all context values from the singleton registry */
  const value = useMemo<NarrativeContextValue>(() => {
    const sections = NARRATIVE_REGISTRY.getAll();
    const enabledSections = NARRATIVE_REGISTRY.getEnabled();
    return {
      registry: NARRATIVE_REGISTRY,
      sections,
      enabledSections,
      sectionCount: enabledSections.length,
      sectionIds: sections.map((s) => s.id),
      enabledSectionIds: enabledSections.map((s) => s.id),
    };
  }, []);

  return (
    <NarrativeContext.Provider value={value}>
      {children}
    </NarrativeContext.Provider>
  );
}

export type { NarrativeProviderProps };
