/**
 * Typography Tokens
 *
 * From DESIGN_SYSTEM §4 (Typography System):
 * "Two typeface families maximum. No exceptions."
 *   - Serif: Cormorant Garamond — headlines, emotional moments, pull quotes
 *   - Sans-serif: DM Sans — body copy, navigation, UI elements, metadata
 *
 * Six-level type scale:
 *   Display → Heading → Subheading → Body → Caption → Micro
 *
 * From DESIGN_SYSTEM_DECISIONS §TYPOGRAPHY:
 *   T4: Weight decreases with size
 *   T5: Line-height increases as size decreases
 *   T6: Letter-spacing increases as size decreases
 *   T8: Body copy minimum font size is 16px at any viewport
 *
 * These tokens mirror the CSS custom properties in tailwind.css.
 * CSS variables are the source of truth for rendering.
 * Responsive overrides are in tailwind.css @media queries.
 */

// ── Font Families ────────────────────────────────────────

export const FONT_FAMILY = {
  /** Serif — warm, editorial, magazine-like authority */
  serif: "'Cormorant Garamond', 'Georgia', serif",

  /** Sans-serif — neutral but warm, humanist, highly legible */
  sans: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
} as const;

// ── Type Scale (Desktop Baseline) ────────────────────────

/**
 * Mobile-first values. Desktop overrides are applied via
 * CSS media queries in tailwind.css.
 */
export const TYPE_SCALE = {
  /** Hero headlines, section-openers — semi-bold/bold, tight leading */
  display: {
    size: '3.5rem',
    leading: 1.05,
    tracking: '-0.01em',
    weight: 600,
    family: 'serif' as const,
  },

  /** Section titles, service names — regular/semi-bold */
  heading: {
    size: '2.25rem',
    leading: 1.15,
    tracking: '0em',
    weight: 500,
    family: 'serif' as const,
  },

  /** Descriptions, introductions — light/regular */
  subheading: {
    size: '1.5rem',
    leading: 1.35,
    tracking: '0em',
    weight: 400,
    family: 'sans' as const,
  },

  /** Primary content, narratives — regular */
  body: {
    size: '1rem',
    leading: 1.7,
    tracking: '0em',
    weight: 400,
    family: 'sans' as const,
  },

  /** Image labels, service details, metadata — light/regular */
  caption: {
    size: '0.875rem',
    leading: 1.45,
    tracking: '0.01em',
    weight: 400,
    family: 'sans' as const,
  },

  /** Timestamps, legal text, fine print — light */
  micro: {
    size: '0.75rem',
    leading: 1.35,
    tracking: '0.02em',
    weight: 300,
    family: 'sans' as const,
  },
} as const;

// ── Responsive Breakpoints ───────────────────────────────

/**
 * Desktop type scale overrides.
 * From tailwind.css responsive media queries.
 */
export const TYPE_SCALE_TABLET = {
  display: { size: '4.5rem' },
  heading: { size: '3rem' },
  subheading: { size: '1.75rem' },
} as const;

export const TYPE_SCALE_DESKTOP = {
  display: { size: '5.5rem' },
  heading: { size: '3.5rem' },
  subheading: { size: '2rem' },
} as const;

// ── Types ────────────────────────────────────────────────

export type TypeLevel = keyof typeof TYPE_SCALE;
export type FontFamilyKey = keyof typeof FONT_FAMILY;
