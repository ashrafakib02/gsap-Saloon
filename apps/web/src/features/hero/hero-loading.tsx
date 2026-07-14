/**
 * HeroLoading — Loading Threshold State
 *
 * From EXPERIENCE_STORYBOARD SCENE 0 (Loading Moment):
 * "Create a designed threshold between the noise of the internet
 *  and the sanctuary of the experience. This is the 'door closing
 *  behind you' moment."
 *
 * From DESIGN_SYSTEM §14 Law 3:
 * "Most visitors should not consciously notice the motion.
 *  They should notice the feeling."
 *
 * From VISUAL_RULES N23:
 * "Never use skeleton loading screens with shimmer effects.
 *  Our loading states are either instant (content appears) or
 *  branded (our signature animation)."
 *
 * Architecture:
 * - The loading state IS the threshold moment
 * - Uses the branded warm gold pulse (LoadingIndicator)
 * - Covers full viewport during load
 * - Gracefully fades out when hero is ready
 * - Reduced motion: instant appearance/disappearance
 * - All copy from hero.copy.ts — zero hardcoded text
 */

import { LoadingIndicator } from '@/shared/feedback/loading-indicator';
import { HERO_COPY_EN } from './hero.copy';
import type { HeroLoadingProps } from './hero.types';

// ── Component ─────────────────────────────────────────────

/**
 * The hero's loading threshold — the designed entrance moment.
 *
 * This is NOT a generic loading spinner. This IS the brand's
 * first impression — a designed moment of anticipation.
 *
 * From EXPERIENCE_STORYBOARD SCENE 0:
 * "A single atmospheric element against the warm background —
 *  a subtle particle of light, a gentle bloom of warmth, or the
 *  brand mark emerging from softness."
 *
 * Copy sourced from HERO_COPY_EN.state — the single source of truth.
 * Phase 9 will enhance this with the full threshold animation.
 *
 * Design decisions:
 * 1. Full-viewport coverage — the visitor enters our world
 * 2. Warm surface background — consistent with the brand palette
 * 3. Branded gold pulse — NOT a generic spinner (N23, M13)
 * 4. Smooth fade-out transition when hero is ready
 * 5. z-index above everything during load, then below content
 */
export function HeroLoading({ isVisible }: HeroLoadingProps) {
  return (
    <div
      className="hero-loading absolute inset-0 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={HERO_COPY_EN.state.loadingAriaLabel}
      style={{
        backgroundColor: 'var(--color-surface)',
        /* Above all hero layers during load */
        zIndex: 100,
        /* Graceful fade-out when hero is ready */
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <LoadingIndicator
        label={HERO_COPY_EN.state.loadingMessage}
      />
    </div>
  );
}
