/**
 * useHeroAnimation — Hero Animation Hook Placeholder
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "The image reveals itself through the Warm Reveal — our signature
 *  interaction. It fades in from 80-90% opacity. Duration: 800-1200ms."
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "The only time-linked animation is the hero reveal on initial page load.
 *  This is the sole exception."
 *
 * From DESIGN_SYSTEM §14 Law 2:
 * "Entry motions use ease-out (decelerate to rest).
 *  Nothing bounces. No spring physics. No overshooting."
 *
 * This hook is a PLACEHOLDER for Phase 9 (Motion Polish).
 * It defines the INTERFACE that the hero composition expects,
 * but does NOT implement the GSAP timeline.
 *
 * Architecture:
 * - Returns animation controls and status
 * - Provides start/stop/reset methods
 * - Respects reduced motion (instant reveal)
 * - Phase 9 will populate with GSAP timeline
 */

import { useCallback, useRef, useState } from 'react';
import type { HeroAnimationState } from '../hero.types';
import { HERO_ANIMATION } from '../hero.config';

// ── Return Type ───────────────────────────────────────────

export interface UseHeroAnimationReturn {
  /** Current animation state */
  animationState: HeroAnimationState;
  /** Start the Warm Unveiling animation */
  startReveal: () => void;
  /** Mark animation as complete */
  markRevealed: () => void;
  /** Kill all hero animations (for cleanup / reduced-motion) */
  killAnimations: () => void;
  /** Whether animations are currently running */
  isAnimating: boolean;
}

// ── Hook ──────────────────────────────────────────────────

/**
 * Controls the hero's animation lifecycle.
 *
 * Phase 4.1: Stub implementation — state management only.
 * Phase 9: GSAP timeline implementation with Warm Unveiling.
 *
 * The hook follows the same interface whether animated or not,
 * so the hero composition doesn't need to know about animation details.
 *
 * From VISUAL_RULES AC5:
 * "prefers-reduced-motion is always respected.
 *  When active: all scroll-linked reveals become instant."
 *
 * TODO Phase 9.1: Implement GSAP timeline for Warm Unveiling
 * TODO Phase 9.3: Implement loading sequence animation
 * TODO Phase 9: Add ScrollTrigger for hero exit parallax
 */
export function useHeroAnimation(
  prefersReducedMotion: boolean,
): UseHeroAnimationReturn {
  const [animationState, setAnimationState] =
    useState<HeroAnimationState>('waiting');
  const timelineRef = useRef<unknown>(null);

  const startReveal = useCallback(() => {
    setAnimationState('revealing');

    if (prefersReducedMotion) {
      /* Reduced motion: instant reveal, no animation (AC5) */
      setAnimationState('revealed');
      return;
    }

    /*
     * Phase 9 will implement:
     *
     * import { getGSAP } from '@/shared/animation/gsap-registration';
     *
     * const gsap = getGSAP();
     * const tl = gsap.timeline({
     *   onComplete: () => setAnimationState('revealed'),
     * });
     *
     * tl.from('.hero-media', {
     *   opacity: HERO_ANIMATION.warmReveal.startOpacity,
     *   duration: HERO_ANIMATION.warmReveal.duration / 1000,
     *   ease: HERO_ANIMATION.warmReveal.easing,
     * })
     * .from('.hero-brand-name', {
     *   opacity: 0,
     *   y: HERO_ANIMATION.warmReveal.maxTranslateY,
     *   duration: 0.8,
     *   ease: 'power2.out',
     * }, '-=0.4')
     * .from('.hero-tagline', {
     *   opacity: 0,
     *   y: 20,
     *   duration: 0.6,
     *   ease: 'power2.out',
     * }, '-=0.3')
     * .from('.hero-cta-group', {
     *   opacity: 0,
     *   y: 15,
     *   duration: 0.5,
     *   ease: 'power2.out',
     * }, '-=0.2');
     *
     * timelineRef.current = tl;
     */

    /* Placeholder: simulate animation completion after duration */
    const timeout = setTimeout(() => {
      setAnimationState('revealed');
    }, HERO_ANIMATION.warmReveal.duration);

    timelineRef.current = timeout;
  }, [prefersReducedMotion]);

  const markRevealed = useCallback(() => {
    setAnimationState('revealed');
  }, []);

  const killAnimations = useCallback(() => {
    /*
     * Phase 9 will implement:
     * import { killTimeline } from '@/shared/animation/timeline-factory';
     * if (timelineRef.current) {
     *   killTimeline(timelineRef.current as gsap.core.Timeline);
     *   timelineRef.current = null;
     * }
     */
    if (timelineRef.current && typeof timelineRef.current === 'object') {
      /* clearTimeout for the placeholder timeout */
      clearTimeout(timelineRef.current as unknown as ReturnType<typeof setTimeout>);
    }
    timelineRef.current = null;
    setAnimationState('waiting');
  }, []);

  return {
    animationState,
    startReveal,
    markRevealed,
    killAnimations,
    isAnimating: animationState === 'revealing',
  };
}
