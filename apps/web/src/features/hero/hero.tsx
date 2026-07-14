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
 *
 * Phase 4.5: Responsive behavior is handled by:
 * - hero-responsive.css — CSS media queries for edge cases
 * - use-hero-viewport — extended viewport detection
 * - hero.config.ts — centralized responsive values
 * Components do NOT hardcode breakpoint logic.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { HeroErrorBoundary } from './hero-error-boundary';
import { HeroBackground } from './hero-background';
import { HeroMedia } from './hero-media';
import { HeroOverlay } from './hero-overlay';
import { HeroContent } from './hero-content';
import { HeroLoading } from './hero-loading';
import { Hero3DMount } from './hero-3d-mount';
import { HeroInteractionProvider } from './hero-interaction-context';
import { HeroScrollIndicator } from './hero-scroll-indicator';
import { useHeroState } from './hooks/use-hero-state';
import { useHeroViewport } from './hooks/use-hero-viewport';
import { useHeroAnimation } from './hooks/use-hero-animation';
import { useHeroAssets } from './hooks/use-hero-assets';
import { useHeroA11y } from './hooks/use-hero-a11y';
import { HERO_DEFAULT_CONFIG, HERO_LAYOUT } from './hero.config';
import { HERO_COPY_EN } from './hero.copy';
import type { HeroSectionProps } from './hero.types';
import type { HeroAnnouncement } from './hooks/use-hero-a11y';

/* ── Responsive Styles (Phase 4.5) ─────────────────────────
 * Import the centralized responsive CSS.
 * This file handles:
 * - Overflow prevention (A10)
 * - Safe-area refinements (A9)
 * - Small-height viewport handling (Item 9)
 * - Orientation-aware adjustments (Item 19)
 * - Ultra-wide layout constraints (Item 8)
 * - CTA responsive behavior (Item 13)
 * - Fluid typography refinement (Item 11)
 * - Responsive spacing refinement (Item 12)
 * - Scroll indicator responsive (Item 16)
 * - Hero media responsive (Item 15)
 * - 200% text zoom reflow (A10)
 * - Reduced motion CSS layer (AC5)
 */
import './hero-responsive.css';
/* ── Accessibility Styles (Phase 4.6) ───────────────────────
 * Centralized accessibility CSS for the hero:
 * - Focus-visible styles (AC4, A6)
 * - Touch target validation (AC12, A9)
 * - High contrast mode (forced-colors)
 * - Reduced-motion CSS refinements (AC5)
 * - Screen reader utilities
 * - Skip link target styles
 * - Prefers-contrast enhancement (AC2) */
import './hero-accessibility.css';

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
  /* Merge config with defaults — memoized to prevent child re-renders.
   * Only depends on configOverrides which changes rarely (once from parent). */
  const config = useMemo(() => ({
    brandName: { ...HERO_DEFAULT_CONFIG.brandName, ...configOverrides?.brandName },
    tagline: { ...HERO_DEFAULT_CONFIG.tagline, ...configOverrides?.tagline },
    cta: { ...HERO_DEFAULT_CONFIG.cta, ...configOverrides?.cta },
    secondaryCta: { ...HERO_DEFAULT_CONFIG.secondaryCta, ...configOverrides?.secondaryCta },
  }), [configOverrides]);

  /* ── Hooks ────────────────────────────────────────────── */
  const heroState = useHeroState();
  const viewport = useHeroViewport();
  const animation = useHeroAnimation(viewport.prefersReducedMotion);
  const assets = useHeroAssets();

  /* ── Accessibility State (Phase 4.6) ────────────────────
   * Maps hero state to screen reader announcements.
   * Live region announces loading/loaded/error transitions. */
  const announcement: HeroAnnouncement = useMemo(() => {
    if (heroState.loadState === 'loading') return 'loading';
    if (heroState.loadState === 'loaded' && heroState.isReady) return 'loaded';
    if (heroState.loadState === 'error') return 'error';
    return null;
  }, [heroState.loadState, heroState.isReady]);

  const { liveRegionRef } = useHeroA11y({ announce: announcement });

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

  /* ── Stable Callbacks ────────────────────────────────────
   * Wrapped in useCallback to prevent unnecessary re-renders
   * of HeroMedia, which is memoized. These callbacks depend on
   * refs and stable functions, so they never change after mount. */
  const handleImageLoad = useCallback(() => {
    assets.startLoading();
  }, [assets]);

  const handleImageError = useCallback((err: Error) => {
    heroState.markError(err);
  }, [heroState]);

  /* ── Render ───────────────────────────────────────────── */

  return (
    <HeroErrorBoundary>
      <HeroInteractionProvider
        prefersReducedMotion={viewport.prefersReducedMotion}
      >
        <section
          id="hero"
          role="banner"
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
            /* Safe-area support for notched/rounded-corner devices.
             * env() returns 0px when not applicable — zero visual impact. */
            paddingBottom: HERO_LAYOUT.safeArea.bottom,
            paddingLeft: HERO_LAYOUT.safeArea.left,
            paddingRight: HERO_LAYOUT.safeArea.right,
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
           * Shows warm placeholder while loading.
           *
           * Phase 4.5: Responsive object-position is handled by
           * hero-responsive.css media queries, not inline styles.
           * This keeps the component simple and the responsive
           * logic centralized in CSS. */}
          <HeroMedia
            loadState={heroState.loadState}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
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
           * Centered per DESIGN_SYSTEM §6.
           *
           * Phase 4.3: Responsive vertical positioning.
           * Desktop: Extra bottom padding pushes content above center
           * to ~42% from top (golden-section composition).
           * Mobile/Tablet: Content centers at mathematical 50%.
           *
           * Phase 4.5: Padding moved to CSS classes (hero-responsive.css).
           * CSS handles edge cases (small-height, landscape) without
           * component-level breakpoint logic. */}
          <div
            className={`hero-content-wrapper absolute inset-0 flex items-center justify-center hero-content-wrapper--${viewport.variant}`}
          >
            <HeroContent
              brandName={config.brandName}
              tagline={config.tagline}
              cta={config.cta}
              secondaryCta={config.secondaryCta}
              isReady={heroState.isReady}
              variant={viewport.variant}
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
           * Phase 4.6 (AC5): The scroll indicator is visible even
           * when prefers-reduced-motion is active. It communicates
           * "there is more content below" — a navigational cue that
           * must not be removed. Animation is suppressed by CSS
           * (hero-accessibility.css), but the element remains visible.
           *
           * From DESIGN_SYSTEM §14 Law 3:
           * "Most visitors should not consciously notice the motion."
           *
           * Phase 4.4: Now uses HeroScrollIndicator component
           * with hover intent and GSAP registration. */}
          <HeroScrollIndicator
            label={HERO_COPY_EN.a11y.scrollIndicatorLabel}
            bottom={HERO_LAYOUT.scrollIndicator[viewport.variant].bottom}
            isVisible={heroState.isReady}
            targetId="services"
          />

          {/* ── Live Region (Phase 4.6) ─────────────────────
           * Announces dynamic state changes to screen readers.
           * From VISUAL_RULES AC1: "WCAG 2.1 Level AA minimum."
           *
           * This div is visually hidden (hero-live-region class)
           * but announced by screen readers via aria-live="polite".
           * Content is managed by useHeroA11y hook. */}
          <div
            ref={liveRegionRef}
            className="hero-live-region"
            aria-live="polite"
            aria-atomic="true"
          />
        </section>
      </HeroInteractionProvider>
    </HeroErrorBoundary>
  );
}
