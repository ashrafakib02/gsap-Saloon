import { createContext, useContext } from 'react';
import type Lenis from 'lenis';

// ── Types ─────────────────────────────────────────────────

export interface AnimationContextValue {
  lenis: Lenis | null;
}

// ── Context ───────────────────────────────────────────────

export const AnimationContext = createContext<AnimationContextValue>({ lenis: null });

/**
 * Access the Lenis smooth scroll instance from any descendant component.
 * Useful for programmatic scrolling (scroll-to-section, scroll restoration).
 */
export function useAnimationContext(): AnimationContextValue {
  return useContext(AnimationContext);
}
