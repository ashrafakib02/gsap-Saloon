/**
 * HeroContent — Text and CTA region
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "There is no text to read, no button to click, no navigation to parse.
 *  Just the image. Just the feeling. Just the space."
 *
 * From EXPERIENCE_STORYBOARD SCENE 2 (Whisper):
 * "Typography. Pure, beautiful typography — centered in the viewport,
 *  surrounded by generous whitespace."
 *
 * Layout decisions:
 * - Center-aligned per DESIGN_SYSTEM §6: "Center alignment for hero moments"
 * - Brand name as h1 per VISUAL_RULES AC15: "One <h1> per page"
 * - Tagline in sans-serif (DM Sans) per DESIGN_SYSTEM §4
 * - CTA in sentence case per VISUAL_RULES B2
 * - No exclamation marks per VISUAL_RULES B10 and L7
 *
 * Phase 4.1 builds the ARCHITECTURE. The warm reveal animation
 * (word-by-word stagger, opacity transitions) is implemented in Phase 9.
 * Components receive `isReady` to know when content should be visible.
 */

import type { HeroContentProps } from './hero.types';
import { HERO_LAYOUT } from './hero.config';

// ── Component ─────────────────────────────────────────────

/**
 * The hero's text and CTA region.
 *
 * Contains:
 * 1. Brand name (h1) — the page's single heading
 * 2. Tagline — the brand thesis
 * 3. Primary CTA — "Book your experience"
 * 4. Secondary CTA — "Explore our craft"
 *
 * From DESIGN_SYSTEM §1 (P1: Subtraction Over Addition):
 * "Every element must earn its place."
 *
 * Each element is intentionally minimal. The whitespace does the work.
 */
export function HeroContent({
  brandName,
  tagline,
  cta,
  secondaryCta,
  isReady,
}: HeroContentProps) {
  return (
    <div
      className="hero-content relative z-10 flex flex-col items-center text-center"
      style={{
        maxWidth: HERO_LAYOUT.maxContentWidth,
        paddingLeft: HERO_LAYOUT.paddingX.mobile,
        paddingRight: HERO_LAYOUT.paddingX.mobile,
      }}
    >
      {/* ── Brand Name (h1) ──────────────────────────────
       * One h1 per page (VISUAL_RULES AC15).
       * Serif typeface — Cormorant Garamond (DESIGN_SYSTEM §4).
       * Title case per VISUAL_RULES T9.
       *
       * TODO Phase 4.2: Final copy may refine this text.
       * TODO Phase 9: Word-by-word stagger reveal animation.
       */}
      <h1
        className="hero-brand-name"
        style={{
          fontFamily: "var(--font-family-serif)",
          fontSize: 'var(--type-size-display)',
          lineHeight: 'var(--type-leading-display)',
          letterSpacing: 'var(--type-tracking-display)',
          fontWeight: brandName.weight,
          color: 'var(--color-text)',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {brandName.text}
      </h1>

      {/* ── Tagline ───────────────────────────────────────
       * Sans-serif — DM Sans (DESIGN_SYSTEM §4).
       * Sentence case per VISUAL_RULES T10.
       * Light weight to contrast with the heavier h1.
       *
       * TODO Phase 4.2: Final copy.
       * TODO Phase 9: Fade-in after brand name completes.
       */}
      <p
        className="hero-tagline"
        style={{
          fontFamily: "var(--font-family-sans)",
          fontSize: 'var(--type-size-subheading)',
          lineHeight: 'var(--type-leading-subheading)',
          letterSpacing: 'var(--type-tracking-subheading)',
          fontWeight: tagline.weight,
          color: 'var(--color-text-secondary)',
          marginTop: 'var(--spacing-personal)',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
        }}
      >
        {tagline.text}
      </p>

      {/* ── CTA Region ────────────────────────────────────
       * Primary CTA: Gold accent, sentence case (B2, B3, B10).
       * Ghost CTA: Secondary, less prominent.
       * Both meet 44×44px touch target minimum (VISUAL_RULES A9, AC12).
       *
       * TODO Phase 4.4: Hero Interactions (hover states, focus management).
       * TODO Phase 9: CTA fade-in after tagline.
       */}
      <div
        className="hero-cta-group"
        style={{
          marginTop: 'var(--spacing-social)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-personal)',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
        }}
      >
        {/* Primary CTA — Book your experience */}
        <a
          href={cta.href}
          className="hero-cta-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '48px',
            padding: '14px 36px',
            fontFamily: 'var(--font-family-sans)',
            fontSize: 'var(--type-size-body)',
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: 'var(--color-surface)',
            backgroundColor: 'var(--color-accent)',
            borderRadius: 'var(--radius-small)',
            textDecoration: 'none',
            cursor: 'pointer',
            border: 'none',
            transition: 'background-color 200ms cubic-bezier(0.65, 0, 0.35, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)';
          }}
        >
          {cta.label}
        </a>

        {/* Secondary CTA — Explore our craft */}
        <a
          href={secondaryCta.href}
          className="hero-cta-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            padding: '10px 24px',
            fontFamily: 'var(--font-family-sans)',
            fontSize: 'var(--type-size-body)',
            fontWeight: 400,
            letterSpacing: '0.01em',
            color: 'var(--color-text-secondary)',
            backgroundColor: 'transparent',
            borderRadius: 'var(--radius-small)',
            textDecoration: 'none',
            cursor: 'pointer',
            border: 'none',
            transition: 'color 200ms cubic-bezier(0.65, 0, 0.35, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          {secondaryCta.label}
        </a>
      </div>
    </div>
  );
}
