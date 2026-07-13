/**
 * Color Tokens
 *
 * From DESIGN_SYSTEM §3 (Color System):
 * "The palette has exactly three chromatic roles. No fourth role exists."
 *   - Surface: warm off-white (unbleached linen)
 *   - Text: warm charcoal (wet earth, espresso)
 *   - Accent: muted gold (late afternoon sunlight on brass)
 *
 * From DESIGN_SYSTEM §3 Color Rules:
 *   C1: All colors carry warm undertones
 *   C2: Accent gold used with extreme scarcity
 *   C3: Text contrast 7:1+ (AAA level)
 *   C4: No color outside the approved palette
 *   C5: Shadows are warm-toned (brown-grey, not blue-grey)
 *   C6: Hover shifts are luminosity changes, not hue changes
 *   C7: All interactive accents use muted gold
 *
 * From DESIGN_SYSTEM §16 (Dark Mode):
 *   - Deep warm charcoal surface (brown-shifted, never blue-grey)
 *   - Warm off-white text (not pure white)
 *   - Brighter, warmer gold accent for dark mode contrast
 *   - Shadows replaced with warm glow effects
 *
 * These tokens mirror the CSS custom properties in tailwind.css.
 * CSS variables are the source of truth for rendering;
 * these TypeScript values are for programmatic access.
 */

// ── Light Mode (Default) ─────────────────────────────────

export const COLORS_LIGHT = {
  /** Warm off-white — creamy white, unbleached linen. NOT pure white (#FFFFFF). */
  surface: '#F5F0EB',

  /** Slightly darker surface — card backgrounds, elevated groups */
  surfaceSecondary: '#EDE6DD',

  /** Elevated surface — modals, popovers, floating elements */
  surfaceElevated: '#FAF7F4',

  /** Warm charcoal — deep, warm, NOT pure black (#000000) */
  text: '#2C2420',

  /** Secondary text — descriptions, supporting copy */
  textSecondary: '#5C4F45',

  /** Muted text — captions, metadata, timestamps */
  textMuted: '#8A7D72',

  /** Muted gold — late afternoon sunlight on brass hardware */
  accent: '#B8965A',

  /** Accent hover — luminosity shift, NOT hue change (C6) */
  accentHover: '#C9A86E',

  /** Accent active — slightly darker for press state */
  accentActive: '#A68448',

  /** Warm error — warm red-brown, NOT harsh red (ST1) */
  error: '#B85450',

  /** Warm success — warm green-gold, NOT clinical green (ST1) */
  success: '#7A8C5A',

  /** Warm border — for form fields, functional borders only (B3, B6) */
  border: '#D4C9BC',

  /** Warm shadow base — derived from surface palette, shifted warm (C5, S1) */
  shadowBase: 'rgba(92, 79, 69, 1)',
} as const;

// ── Dark Mode ────────────────────────────────────────────

/**
 * Dark mode colors per DESIGN_SYSTEM §16:
 * "The dark mode is not 'dark' in the way a nightclub is dark.
 *  It is 'dark' in the way a candlelit room is dark — warm, intimate, enveloping."
 *
 * DM1: Dark background is warm charcoal — shifted toward brown, never blue
 * DM2: Text is warm off-white — not pure white (#FFFFFF)
 * DM3: Gold accent becomes slightly brighter and warmer
 * DM4: Shadows replaced with warm glow effects
 */
export const COLORS_DARK = {
  /** Deep warm charcoal surface — brown-shifted, never blue-grey (DM1) */
  surface: '#1C1816',

  /** Slightly lighter surface — card backgrounds */
  surfaceSecondary: '#252019',

  /** Elevated surface — modals, popovers */
  surfaceElevated: '#2E2720',

  /** Warm off-white text — not pure white (DM2) */
  text: '#EDE6DD',

  /** Secondary text — slightly dimmer */
  textSecondary: '#BFB5A8',

  /** Muted text — captions, metadata */
  textMuted: '#8A7D72',

  /** Brighter, warmer gold — increased luminosity for dark contrast (DM3) */
  accent: '#D4AF6A',

  /** Accent hover — even brighter */
  accentHover: '#E0C07E',

  /** Accent active — slightly dimmer */
  accentActive: '#C09A54',

  /** Warm error — same warmth, adjusted for dark background */
  error: '#D4706C',

  /** Warm success — same warmth, adjusted for dark background */
  success: '#96A872',

  /** Warm border — for form fields on dark backgrounds */
  border: '#3D342C',

  /** Warm glow base — replaces shadows in dark mode (DM4) */
  shadowBase: 'rgba(184, 150, 90, 1)',
} as const;

// ── Combined Color Type ──────────────────────────────────

/**
 * Color token values — a string value for each semantic color role.
 * Used as the return type for getColorTokens() to accommodate both
 * light and dark mode token sets (which have different literal strings).
 */
export type ColorTokens = Record<string, string>;
export type ColorTokenKey = keyof typeof COLORS_LIGHT;

/**
 * Get the color tokens for a given resolved theme.
 * Use this for programmatic access to color values.
 */
export function getColorTokens(resolvedTheme: 'light' | 'dark'): ColorTokens {
  return resolvedTheme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
}
