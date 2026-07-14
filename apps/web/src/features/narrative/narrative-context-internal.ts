/**
 * Narrative Context — Internal Context Creation and Access
 *
 * From shared/providers/context-utilities.ts:
 * "Creates a React context and a type-safe hook that throws a
 *  descriptive error when used outside the provider."
 *
 * This module creates the React context and provides the internal
 * useNarrativeContext() hook. It is separated from the provider
 * component to satisfy react-refresh/only-export-components (files
 * with JSX should only export components).
 *
 * Phase 5.1: Context structure and data provision.
 */

import { createContext, useContext } from 'react';
import type { NarrativeContextValue } from './narrative.types';

// ── Context ────────────────────────────────────────────────

const NarrativeContext = createContext<NarrativeContextValue | null>(null);
NarrativeContext.displayName = 'NarrativeContext';

// ── Internal Hook ──────────────────────────────────────────

/**
 * Access the narrative context value.
 *
 * Throws a descriptive error if used outside NarrativeProvider.
 * This is the internal hook — components should use useNarrative() instead.
 *
 * @returns The narrative context value
 */
function useNarrativeContext(): NarrativeContextValue {
  const value = useContext(NarrativeContext);
  if (value === null || value === undefined) {
    throw new Error(
      '[Narrative] useNarrativeContext was used outside of NarrativeProvider. ' +
        'Ensure <NarrativeProvider> exists in the component tree above.',
    );
  }
  return value;
}

// ── Exports ────────────────────────────────────────────────

export { NarrativeContext, useNarrativeContext };
