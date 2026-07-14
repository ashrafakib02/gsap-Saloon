/**
 * HeroMedia — Image/Background Region
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "One image. Full viewport. The composition is cinematic — wide enough
 *  to show the space and the atmosphere, close enough to feel intimate."
 *
 * From DESIGN_SYSTEM §12 (Imagery Rules):
 * I3: Hero images are 16:9 or wider
 * I7: Hero images are never cropped tight — generous headroom
 * I11: No hero image carousels — one image, composed perfectly
 * I13: Image loading is progressive — lightweight placeholder first
 *
 * From VISUAL_RULES N23:
 * "Never use skeleton loading screens with shimmer effects.
 *  Our loading states are either instant or branded."
 *
 * This component handles:
 * - Hero image with progressive loading
 * - Warm solid-color placeholder (NOT shimmer)
 * - Dimension reservation for CLS prevention
 * - Aspect ratio enforcement
 * - Error state with graceful fallback
 *
 * Phase 4.5: Responsive object-position is handled by CSS
 * (hero-responsive.css) — not inline styles. This enables
 * responsive crop behavior without component-level breakpoint logic.
 *
 * Phase 4.1 builds the ARCHITECTURE.
 * Phase 4.7 handles performance optimization (srcset, format detection).
 * Phase 9 handles the Warm Unveiling animation on this element.
 */

import { memo } from 'react';
import { HERO_IMAGE, HERO_A11Y_CONFIG } from './hero.config';
import { HERO_ASSETS } from './hero-perf.config';
import type { HeroMediaProps } from './hero.types';

// ── Component ─────────────────────────────────────────────

/**
 * The hero's media region — full-viewport editorial image.
 *
 * Wrapped in React.memo — props (loadState, onImageLoad, onImageImage)
 * change infrequently (loadState transitions once, callbacks are stable
 * from useCallback). Prevents re-renders when parent hero state
 * transitions do not affect media props.
 *
 * Architecture decisions:
 * 1. Uses CSS `aspect-ratio` for dimension reservation (CLS prevention)
 * 2. Placeholder is a warm solid color — NOT shimmer skeleton (N23)
 * 3. Image loads eagerly with high fetch priority (above the fold)
 * 4. object-position handled by CSS for responsive crop (Phase 4.5)
 * 5. Error state shows a warm gradient — NOT an error message
 *    (the hero should never feel "broken")
 *
 * TODO Phase 4.7: Add srcset for responsive image loading
 * TODO Phase 4.7: Add AVIF/WebP format detection
 * TODO Phase 4.7: Add blur-up LQIP placeholder
 * TODO Phase 9: Warm Reveal animation (opacity 0.85 → 1, 1200ms)
 */
export const HeroMedia = memo(function HeroMedia({
  loadState,
  onImageLoad,
  onImageError,
}: HeroMediaProps) {
  return (
    <div
      className="hero-media absolute inset-0"
      style={{
        /* Dimension reservation prevents CLS (P2) */
        aspectRatio: HERO_IMAGE.aspectRatio,
        overflow: 'hidden',
      }}
    >
      {/* ── Placeholder Layer ──────────────────────────────
       * Always visible behind the image.
       * Warm solid color — never shimmer (N23), never generic (M13).
       * This IS the hero's fallback state — it must look intentional.
       */}
      <div
        className="hero-placeholder absolute inset-0"
        style={{
          backgroundColor: 'var(--color-surface-secondary)',
          /* Subtle warm gradient for depth — NOT a gradient design element (N30).
           * This is a functional layer behind the image, not a visible gradient. */
          background: `
            linear-gradient(
              180deg,
              var(--color-surface) 0%,
              var(--color-surface-secondary) 50%,
              color-mix(in srgb, var(--color-accent) 8%, var(--color-surface-secondary)) 100%
            )
          `,
        }}
        aria-hidden="true"
      />

      {/* ── Hero Image ─────────────────────────────────────
       * Full-viewport editorial photograph.
       *
       * From DESIGN_SYSTEM §12:
       * "Photography is the primary content of our design.
       *  It carries more emotional weight than any headline."
       *
       * From DESIGN_SYSTEM §Performance P5:
       * "Images served in modern formats (WebP/AVIF) with fallbacks"
       *
       * Uses <picture> for format negotiation:
       * - AVIF: smallest file size, best compression (where supported)
       * - WebP: good compression, wide support
       * - JPEG: universal fallback
       *
       * Browser evaluates <source> elements top-to-bottom and uses
       * the first format it supports. The <img> is the fallback.
       *
       * Phase 4.5: object-position is handled by CSS
       * (hero-responsive.css) for responsive crop behavior:
       * - Desktop: center 30% — generous headroom (default)
       * - Tablet: center 35% — transitional
       * - Mobile portrait: center 40% — subject visibility
       * - Mobile landscape: center 45% — wider view
       *
       * TODO Phase 11.6: Generate actual srcset images at breakpoints
       * TODO Phase 11.6: Add blur-up LQIP placeholder
       * TODO Phase 9: Transform-based animation for GPU acceleration (P10)
       */}
      {loadState === 'loaded' && (
        <picture
          className="hero-image absolute inset-0 h-full w-full"
          style={{
            objectFit: HERO_IMAGE.objectFit,
          }}
        >
          {/* ── Format Sources ────────────────────────────────
           * Each source provides the image in a modern format.
           * The browser picks the first supported format.
           * Phase 11.6 will generate actual files at these paths. */}
          {HERO_ASSETS.formatPriority.map((format) => (
            <source
              key={format}
              /* TODO Phase 11.6: Replace with actual srcset paths
               * e.g. "/images/hero/hero-main-1920.avif 1920w, ..."
               * For now, use the single WebP path as a placeholder. */
              srcSet={`/images/hero/hero-main.${format === 'jpeg' ? 'jpg' : format}`}
              type={`image/${format}`}
            />
          ))}

          {/* ── Fallback <img> ───────────────────────────────
           * The <img> serves as both the format fallback and the
           * element that triggers onLoad/onError callbacks.
           * CLS prevention — explicit width/height reserve dimensions.
           * Above the fold — load eagerly with high fetch priority. */}
          <img
            src={HERO_ASSETS.image.src}
            alt={HERO_A11Y_CONFIG.imageAlt}
            className="hero-image absolute inset-0 h-full w-full"
            style={{
              objectFit: HERO_IMAGE.objectFit,
            }}
            /* CLS prevention — reserve dimensions */
            width={HERO_ASSETS.image.width}
            height={HERO_ASSETS.image.height}
            /* Above the fold — load immediately */
            loading={HERO_IMAGE.loading}
            fetchPriority={HERO_IMAGE.fetchPriority}
            onLoad={() => onImageLoad()}
            onError={() =>
              onImageError(new Error('Hero image failed to load'))
            }
          />
        </picture>
      )}

      {/* ── Error State ────────────────────────────────────
       * If the image fails to load, show a warm atmospheric gradient.
       * The hero should NEVER feel "broken" — the fallback IS the design.
       * This is intentional, not a bug.
       */}
      {loadState === 'error' && (
        <div
          className="hero-error-fallback absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse at 50% 40%,
                color-mix(in srgb, var(--color-accent) 12%, var(--color-surface)) 0%,
                var(--color-surface-secondary) 60%,
                var(--color-surface) 100%
              )
            `,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
});
