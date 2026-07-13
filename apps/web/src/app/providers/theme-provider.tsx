import type { ReactNode } from 'react';
import { useReducedMotion } from '@/shared/hooks/ui/use-reduced-motion';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider that synchronizes OS-level preferences with application state.
 *
 * Currently handles:
 * - prefers-reduced-motion detection → Redux sync
 * - (Future: color scheme preference, contrast preference)
 *
 * From TECHNICAL_ARCHITECTURE §16.6:
 * "When prefers-reduced-motion: reduce is active, all GSAP animations
 *  set to duration: 0, Lenis smooth scroll is disabled."
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize reduced motion detection and Redux sync
  useReducedMotion();

  return <>{children}</>;
}
