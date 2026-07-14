/**
 * HeroSection — The Cinematic Experience Architecture
 *
 * From EXPERIENCE_STORYBOARD SCENE 1 (Threshold):
 * "Stop the scroll. Create awe. Communicate the brand's entire identity
 *  in a single, wordless frame."
 *
 * From EXPERIENCE_STORYBOARD SCENE 0 (Loading Moment):
 * "Create a designed threshold between the noise of the internet
 *  and the sanctuary of the experience."
 *
 * From DESIGN_SYSTEM §1 (P7: Peak-End Rule):
 * "The hero section and the closing section must be the most considered,
 *  most beautiful, most emotionally resonant parts of the entire experience."
 *
 * From DESIGN_SYSTEM §6 (Grid):
 * "Center alignment for hero moments, single-focus statements.
 *  Communicates formality, importance, and singular focus."
 *
 * This is the COMPOSITION layer — it composes all sub-components
 * into the complete hero experience. It owns no styling itself;
 * each sub-component handles its own visual treatment.
 *
 * Architecture:
 * 1. Error boundary wraps the entire hero (section-level isolation)
 * 2. Full viewport height (100svh) with semantic <section> landmark
 * 3. Background layer (ambient canvas)
 * 4. Media layer (hero image with progressive loading)
 * 5. 3D mounting point (optional atmospheric effects)
 * 6. Overlay layer (composited atmospheric treatments)
 * 7. Content layer (brand name, tagline, CTAs)
 * 8. Loading threshold (branded loading state)
 * 9. All state managed by hooks (no local state in composition)
 *
 * DO NOT modify this composition in future phases without
 * understanding the complete component tree:
 *
 * HeroErrorBoundary
 * └── section[role="banner"] (full viewport)
 *     ├── HeroBackground (z:0) — ambient canvas
 *     ├── HeroMedia (z:1) — image + placeholder + error fallback
 *     ├── Hero3DMount (z:1) — optional R3F scene
 *     ├── HeroOverlay (z:2) — atmospheric layers
 *     ├── HeroContent (z:10) — text + CTAs
 *     └── HeroLoading (z:100) — loading threshold
 */

import { useEffect } from 'react';
import { HeroErrorBoundary } from './hero-error-boundary';
import { HeroBackground } from './hero-background';
import { HeroMedia } from './hero-media';
import { HeroOverlay } from './hero-overlay';
import { HeroContent } from './hero-content';
import { HeroLoading } from './hero-loading';
import { Hero3DMount } from './hero-3d-mount';
import { useHeroState } from './hooks/use-hero-state';
import { useHeroViewport } from './hooks/use-hero-viewport';
import { useHeroAnimation } from './hooks/use-hero-animation';
import { useHeroAssets } from './hooks/use-hero-assets';
import { HERO_DEFAULT_CONFIG, HERO_LAYOUT } from './hero.config';
import { HERO_COPY_EN } from './hero.copy';
import type { HeroSectionProps } from './hero.types';

// ── Component ─────────────────────────────────────────────

/**
 * The Hero Section — Scene 1 of the Cinematic Experience.
 *
 * From EXPERIENCE_STORYBOARD:
 * "The hero is the entrance. Everything else is discovered."
 *
 * This component composes the complete hero experience:
 * background → media → 3D → overlay → content → loading.
 *
 * The visual result:
 * - Full viewport height (100svh)
 * - Warm background with subtle radial gradient
 * - Hero image (or warm placeholder while loading)
 * - Atmospheric overlay layers
 * - Centered brand name + tagline + CTAs
 * - Branded loading threshold during initial load
 *
 * Even without animations, this composition communicates:
 * - LUXURY: generous whitespace, editorial typography, restraint
 * - WARMTH: warm palette, soft gradients, golden undertones
 * - CRAFT: precise typography, considered spacing, no clutter
 * - MODERN ELEGANCE: clean lines, minimal elements, premium feel
 * - CALM: centered composition, gentle colors, unhurried pacing
 */
export function HeroSection({
  config: configOverrides,
  className = '',
}: HeroSectionProps) {
  /* Merge config with defaults */
  const config = {
    brandName: { ...HERO_DEFAULT_CONFIG.brandName, ...configOverrides?.brandName },
    tagline: { ...HERO_DEFAULT_CONFIG.tagline, ...configOverrides?.tagline },
    cta: { ...HERO_DEFAULT_CONFIG.cta, ...configOverrides?.cta },
    secondaryCta: { ...HERO_DEFAULT_CONFIG.secondaryCta, ...configOverrides?.secondaryCta },
  };

  /* ── Hooks ────────────────────────────────────────────── */
  const heroState = useHeroState();
  const viewport = useHeroViewport();
  const animation = useHeroAnimation(viewport.prefersReducedMotion);
  const assets = useHeroAssets();

  /* ── Lifecycle ────────────────────────────────────────── */

  /* Start loading assets on mount */
  useEffect(() => {
    heroState.startLoading();
    assets.startLoading();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* When assets report loaded, update hero state */
  useEffect(() => {
    if (assets.loadState === 'loaded') {
      heroState.markLoaded();
      /* Start the Warm Unveiling animation */
      animation.startReveal();
    } else if (assets.loadState === 'error') {
      heroState.markError(new Error('Hero assets failed to load'));
    }
  }, [assets.loadState]); // eslint-disable-line react-hooks/exhaustive-deps

  /* When animation completes, mark hero as revealed */
  useEffect(() => {
    if (animation.animationState === 'revealed') {
      heroState.markRevealed();
    }
  }, [animation.animationState]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Render ───────────────────────────────────────────── */

  return (
    <HeroErrorBoundary>
      <section
        id="hero"
        aria-label={HERO_COPY_EN.a11y.sectionAriaLabel}
        className={`hero-section relative overflow-hidden ${className}`}
        style={{
          /* Full viewport height — the hero IS the viewport.
           * Using 100svh for mobile address bar compensation. */
          height: HERO_LAYOUT.height,
          /* Prevent horizontal overflow from any layer */
          width: '100%',
          /* Ensure the hero sits above the page surface */
          backgroundColor: 'var(--color-surface)',
        }}
      >
        {/* ── Layer 0: Ambient Background ─────────────────
         * The warm canvas behind everything.
         * Always visible — the hero's safety net. */}
        <HeroBackground
          prefersReducedMotion={viewport.prefersReducedMotion}
        />

        {/* ── Layer 1: Hero Image / Media ─────────────────
         * Full-viewport editorial image.
         * Shows warm placeholder while loading. */}
        <HeroMedia
          loadState={heroState.loadState}
          onImageLoad={() => assets.startLoading()}
          onImageError={(err) => heroState.markError(err)}
        />

        {/* ── Layer 1.5: 3D Mounting Point ────────────────
         * Optional atmospheric effects (Phase 6).
         * Invisible when disabled — zero visual impact. */}
        <Hero3DMount
          is3DEnabled={false} /* Phase 6: connect to feature flag */
          hasWebGL={viewport.maySupportWebGL}
        />

        {/* ── Layer 2: Atmospheric Overlays ────────────────
         * Composited warm treatments.
         * Functional (legibility) not decorative (N30). */}
        <HeroOverlay />

        {/* ── Layer 10: Content ────────────────────────────
         * Brand name (h1), tagline, CTAs.
         * Centered per DESIGN_SYSTEM §6. */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 10 }}
        >
          <HeroContent
            brandName={config.brandName}
            tagline={config.tagline}
            cta={config.cta}
            secondaryCta={config.secondaryCta}
            isReady={heroState.isReady}
          />
        </div>

        {/* ── Layer 100: Loading Threshold ─────────────────
         * The designed entrance moment.
         * Fades out when hero is ready. */}
        <HeroLoading isVisible={heroState.isLoading} />

        {/* ── Scroll Indicator ─────────────────────────────
         * A subtle downward chevron indicating scroll.
         * Communicates: "There is more to discover."
         * Hidden when hero is loading, visible when ready.
         *
         * From DESIGN_SYSTEM §14 Law 3:
         * "Most visitors should not consciously notice the motion."
         *
         * This is a gentle static cue, not an animation.
         * Phase 9 may add a subtle bob animation. */}
        {heroState.isReady && !viewport.prefersReducedMotion && (
          <div
            className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2"
            style={{
              zIndex: 10,
              opacity: 0.5,
              transition: 'opacity 0.6s ease-out',
            }}
            aria-hidden="true"
            title={HERO_COPY_EN.a11y.scrollIndicatorLabel}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        )}
      </section>
    </HeroErrorBoundary>
  );
}
