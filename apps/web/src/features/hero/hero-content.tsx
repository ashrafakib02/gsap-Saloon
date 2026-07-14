/**
 * HeroContent — Text and CTA Region
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
 * Responsive layout (Phase 4.3):
 * - Uses HeroVariant to drive spacing, CTA layout, and padding
 * - Mobile: stacked CTAs, compact spacing, full-width buttons
 * - Tablet: horizontal CTAs, moderate spacing
 * - Desktop: horizontal CTAs, generous spacing, 65ch max-width
 *
 * Typography scaling is handled by global CSS custom properties:
 * - Mobile: --text-display: 3.5rem
 * - Tablet: --text-display: 4.5rem
 * - Desktop: --text-display: 5.5rem
 * This component uses the tokens, not hardcoded sizes.
 *
 * Phase 4.1 builds the ARCHITECTURE. The warm reveal animation
 * (word-by-word stagger, opacity transitions) is implemented in Phase 9.
 * Components receive `isReady` to know when content should be visible.
 */

import type { HeroContentProps } from './hero.types';
import { HERO_LAYOUT } from './hero.config';

// ── Component ─────────────────────────────────────────────

/**
 * The hero's text and CTA region — responsive composition.
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
 *
 * Responsive behavior:
 * - Headline typography scales via CSS custom properties (tailwind.css)
 * - Spacing between elements increases with viewport width
 * - CTA layout switches from vertical (mobile) to horizontal (tablet+)
 * - Horizontal padding prevents edge-touching at all widths
 */
export function HeroContent({
  brandName,
  tagline,
  cta,
  secondaryCta,
  isReady,
  variant,
}: HeroContentProps) {
  /* ── Responsive Values ──────────────────────────────── */
  const padding = HERO_LAYOUT.paddingX[variant];
  const headlineToTaglineGap = HERO_LAYOUT.spacing.headlineToTagline[variant];
  const taglineToCtaGap = HERO_LAYOUT.spacing.taglineToCta[variant];
  const ctaDirection = HERO_LAYOUT.ctaLayout[variant] === 'vertical'
    ? 'column' as const
    : 'row' as const;
  const ctaGap = HERO_LAYOUT.ctaGap[variant];
  const ctaMinWidth = HERO_LAYOUT.ctaMinWidth[variant];

  return (
    <div
      className="hero-content relative z-10 flex flex-col items-center text-center"
      style={{
        maxWidth: HERO_LAYOUT.maxContentWidth,
        paddingLeft: padding,
        paddingRight: padding,
      }}
    >
      {/* ── Brand Name (h1) ──────────────────────────────
       * One h1 per page (VISUAL_RULES AC15).
       * Serif typeface — Cormorant Garamond (DESIGN_SYSTEM §4).
       * Title case per VISUAL_RULES T9.
       *
       * Typography scales via CSS custom properties:
       * Mobile: 3.5rem, Tablet: 4.5rem, Desktop: 5.5rem
       *
       * TODO Phase 9: Word-by-word stagger reveal animation.
       */}
      <h1
        className="hero-brand-name"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-display)',
          lineHeight: 'var(--leading-display)',
          letterSpacing: 'var(--tracking-display)',
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
       * Spacing from headline adapts per breakpoint:
       * Mobile: personal (1rem), Tablet/Desktop: social (1.5rem)
       *
       * TODO Phase 9: Fade-in after brand name completes.
       */}
      <p
        className="hero-tagline"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-subheading)',
          lineHeight: 'var(--leading-subheading)',
          letterSpacing: 'var(--tracking-subheading)',
          fontWeight: tagline.weight,
          color: 'var(--color-text-secondary)',
          marginTop: headlineToTaglineGap,
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
       * Responsive layout:
       * Mobile: Vertical stack — full-width buttons, thumb-friendly.
       * Tablet/Desktop: Horizontal row — side-by-side, visual hierarchy.
       *
       * TODO Phase 4.4: Hero Interactions (hover states, focus management).
       * TODO Phase 9: CTA fade-in after tagline.
       */}
      <div
        className="hero-cta-group"
        style={{
          marginTop: taglineToCtaGap,
          display: 'flex',
          flexDirection: ctaDirection,
          alignItems: 'center',
          justifyContent: 'center',
          gap: ctaGap,
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
            minWidth: ctaMinWidth,
            padding: '14px 36px',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body)',
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
            minWidth: ctaMinWidth,
            padding: '10px 24px',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body)',
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
