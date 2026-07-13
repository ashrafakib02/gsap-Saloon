import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux-store';
import { initLenis, destroyLenis, getLenis } from '@/lib/lenis-config';
import type Lenis from 'lenis';
import { AnimationContext } from './animation-context';
import '@/lib/gsap-config';

// ── Provider ──────────────────────────────────────────────

interface AnimationProviderProps {
  children: ReactNode;
}

/**
 * Initializes GSAP + Lenis smooth scroll infrastructure.
 *
 * From TECHNICAL_ARCHITECTURE §8:
 * "GSAP ScrollTrigger + Lenis smooth scroll form the animation backbone."
 *
 * Behavior:
 * - Registers GSAP plugins (via gsap-config import)
 * - Creates Lenis instance and connects it to GSAP ScrollTrigger
 * - Disables Lenis when prefers-reduced-motion is active
 * - Provides Lenis instance via context for programmatic access
 * - Cleans up on unmount (kills Lenis, disconnects ScrollTrigger)
 */
export function AnimationProvider({ children }: AnimationProviderProps) {
  const isReducedMotion = useSelector((state: RootState) => state.ui.isReducedMotion);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (isReducedMotion) {
      // Disable Lenis when reduced motion is preferred — native scroll restored
      destroyLenis();
      lenisRef.current = null;
      return;
    }

    // Initialize Lenis smooth scroll
    lenisRef.current = initLenis();

    return () => {
      destroyLenis();
      lenisRef.current = null;
    };
  }, [isReducedMotion]);

  const value = {
    lenis: lenisRef.current ?? getLenis(),
  };

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}
