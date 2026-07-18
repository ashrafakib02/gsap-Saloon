/**
 * Mobile Fallback Provider — Context for Mobile Fallback Access
 *
 * This module creates the MobileFallbackContext and provides the
 * useMobileFallbackContext accessor. It follows the Fast Refresh
 * compliant pattern — context creation is split from provider JSX
 * so Fast Refresh works.
 *
 * Architecture:
 *   - createContext + useMobileFallbackContext accessor (no JSX in this file)
 *   - MobileFallbackContextValue interface with manager, snapshot, isEnabled
 *   - Provider component lives in mobile-fallback-root.tsx
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import { createContext, useContext } from 'react';

import type { MobileFallbackManager, MobileFallbackSnapshot } from './mobile-fallback.types';

// ── Context Value ────────────────────────────────────────────

/**
 * The shape of the mobile fallback context value.
 *
 * Exposes the singleton manager, the current snapshot, and
 * whether the mobile fallback system is enabled.
 */
export interface MobileFallbackContextValue {
  /** The singleton mobile fallback manager. */
  readonly manager: MobileFallbackManager;
  /** The current immutable mobile fallback snapshot. */
  readonly snapshot: MobileFallbackSnapshot;
  /** Whether the mobile fallback system is enabled. */
  readonly isEnabled: boolean;
  /** Whether reduced-motion is active. */
  readonly isReducedMotion: boolean;
}

// ── Context Creation ─────────────────────────────────────────

/**
 * The raw React context for mobile fallback state.
 *
 * Defaults to undefined — the provider in mobile-fallback-root.tsx
 * supplies the real value. Consumer hooks use useMobileFallbackContext()
 * to access it.
 */
export const MobileFallbackContext = createContext<MobileFallbackContextValue | undefined>(
  undefined,
);

/**
 * Accessor for the mobile fallback context value.
 *
 * Throws if called outside the MobileFallbackRoot provider. All mobile
 * fallback hooks must call this to confirm the provider is mounted.
 */
export function useMobileFallbackContext(): MobileFallbackContextValue {
  const context = useContext(MobileFallbackContext);
  if (context === undefined) {
    throw new Error(
      'useMobileFallbackContext must be used within a MobileFallbackRoot provider. '
      + 'Ensure MobileFallbackRoot is mounted in the component tree.',
    );
  }
  return context;
}
