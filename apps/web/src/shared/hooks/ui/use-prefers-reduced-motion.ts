import { useMediaQuery } from '@/shared/hooks/ui/use-media-query';

/**
 * Detects whether the user prefers reduced motion.
 *
 * From DESIGN_SYSTEM §15 (AC5):
 * "prefers-reduced-motion is always respected. When active:
 * all scroll-linked reveals become instant, all hover transitions
 * become instant, all page transitions become instant."
 *
 * From TECHNICAL_ARCHITECTURE §8.9:
 * "Every animation system must respect prefers-reduced-motion"
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion();
 *
 * const duration = prefersReducedMotion ? 0 : 500;
 * gsap.to(element, { opacity: 1, duration });
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
