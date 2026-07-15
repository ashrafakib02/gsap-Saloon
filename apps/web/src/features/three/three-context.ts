/**
 * Three Context — React Context Object and Internal Accessor
 *
 * Split from the provider component so this module exports only non-component
 * values. That keeps `three-provider.tsx` a pure component module and satisfies
 * the `react-refresh/only-export-components` lint rule (Fast Refresh cannot mix
 * component and non-component exports in one file).
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import { createContext, useContext } from 'react';

import type { ThreeContextValue } from './three.types';

/**
 * The Three context. `null` until a {@link ThreeProvider} is mounted, so the
 * accessor can throw a clear error when used outside the provider.
 */
export const ThreeContext = createContext<ThreeContextValue | null>(null);

ThreeContext.displayName = 'ThreeContext';

/**
 * Internal accessor for the Three context.
 *
 * Throws when used outside a {@link ThreeProvider}. Public hooks
 * (`useThree`, `useThreePerformance`, …) wrap this — components never call it
 * directly.
 */
export function useThreeContext(): ThreeContextValue {
  const ctx = useContext(ThreeContext);
  if (ctx === null) {
    throw new Error(
      'Three hooks must be used within a <ThreeProvider>. ' +
        'Wrap the subtree (or the app root) in <ThreeProvider> before ' +
        'calling useThree / useThreePerformance / useThreeQuality.',
    );
  }
  return ctx;
}
