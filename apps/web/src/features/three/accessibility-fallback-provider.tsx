/**
 * Accessibility Fallback Provider — Context Creation (Fast Refresh Compliant)
 *
 * Creates the AccessibilityFallbackContext and provider component. The context
 * is created here (no JSX) for Fast Refresh compatibility. The actual provider
 * component lives in accessibility-fallback-root.tsx.
 *
 * Architecture:
 *   - Context creation here (no JSX — Fast Refresh safe)
 *   - Provider component in accessibility-fallback-root.tsx (JSX)
 *   - Consumer hook: useAccessibilityFallbackContext()
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import { createContext, useContext } from 'react';

import type { AccessibilityFallbackManager } from './accessibility-fallback.types';
import type { AccessibilitySnapshot } from './accessibility-fallback.types';

// ── Context Value ────────────────────────────────────────────

/**
 * Value provided by AccessibilityFallbackContext.
 */
export interface AccessibilityFallbackContextValue {
  /** The accessibility fallback manager singleton. */
  readonly manager: AccessibilityFallbackManager;
  /** The current accessibility fallback snapshot. */
  readonly snapshot: AccessibilitySnapshot;
  /** Whether 3D rendering is enabled. */
  readonly isEnabled: boolean;
  /** Whether reduced-motion is active. */
  readonly isReducedMotion: boolean;
  /** Whether high-contrast mode is active. */
  readonly isHighContrast: boolean;
}

// ── Context ──────────────────────────────────────────────────

/**
 * React context for the accessibility fallback subsystem.
 *
 * Undefined default — must be provided by AccessibilityFallbackRoot.
 */
export const AccessibilityFallbackContext = createContext<AccessibilityFallbackContextValue | undefined>(undefined);

// ── Consumer Hook ────────────────────────────────────────────

/**
 * Hook to access the accessibility fallback context.
 *
 * @throws {Error} If used outside of AccessibilityFallbackRoot.
 */
export function useAccessibilityFallbackContext(): AccessibilityFallbackContextValue {
  const context = useContext(AccessibilityFallbackContext);

  if (context === undefined) {
    throw new Error(
      'useAccessibilityFallbackContext must be used within AccessibilityFallbackRoot. '
      + 'Wrap your component tree with <AccessibilityFallbackRoot>.',
    );
  }

  return context;
}
