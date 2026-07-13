/**
 * Shadow Tokens
 *
 * From DESIGN_SYSTEM §9 (Elevation & Shadows):
 * "Our shadows are warm-toned, reflecting our palette's commitment to warmth.
 *  Cold, blue-grey shadows (the default of most design systems) would
 *  contradict our brand identity."
 *
 * Shadow Rules (S1-S5):
 *   S1: All shadows warm-toned — brown-grey, not blue-grey
 *   S2: Shadows are the primary method of communicating elevation
 *   S3: Interactive elements use shadow changes (not border changes)
 *   S4: Shadows never compete with content
 *   S5: On mobile, shadows may be reduced or eliminated
 *
 * From DESIGN_SYSTEM §16 (Dark Mode, DM4):
 *   "Shadows are replaced with subtle warm glow effects or border treatments
 *    in dark mode. Shadows on dark surfaces are invisible."
 *
 * These tokens mirror the CSS custom properties in tailwind.css.
 */

// ── Light Mode Shadows ───────────────────────────────────

export const SHADOWS_LIGHT = {
  /** No shadow — flat elements, full-bleed sections */
  none: 'none',

  /** Barely perceptible warm shadow — cards at rest, form fields */
  subtle: '0 1px 3px rgba(92, 79, 69, 0.08)',

  /** Noticeable warm shadow — cards on hover, dropdowns */
  medium: '0 4px 12px rgba(92, 79, 69, 0.12)',

  /** Prominent warm shadow — modals, popovers, sticky elements */
  elevated: '0 8px 24px rgba(92, 79, 69, 0.16)',
} as const;

// ── Dark Mode Shadows (Warm Glow) ───────────────────────

/**
 * Dark mode replaces shadows with warm glow effects (DM4).
 * Glow uses the accent gold at low opacity for a candlelit warmth.
 */
export const SHADOWS_DARK = {
  /** No shadow/glow */
  none: 'none',

  /** Subtle warm glow — cards at rest */
  subtle: '0 0 8px rgba(184, 150, 90, 0.06)',

  /** Noticeable warm glow — cards on hover, dropdowns */
  medium: '0 0 16px rgba(184, 150, 90, 0.10)',

  /** Prominent warm glow — modals, popovers */
  elevated: '0 0 32px rgba(184, 150, 90, 0.14)',
} as const;

// ── Types ────────────────────────────────────────────────

export type ShadowLevel = keyof typeof SHADOWS_LIGHT;

/**
 * Shadow token values — a string value for each elevation level.
 * Used as the return type for getShadowTokens() to accommodate both
 * light and dark mode token sets.
 */
export type ShadowTokens = Record<string, string>;

/**
 * Get shadow tokens for a given resolved theme.
 */
export function getShadowTokens(resolvedTheme: 'light' | 'dark'): ShadowTokens {
  return resolvedTheme === 'dark' ? SHADOWS_DARK : SHADOWS_LIGHT;
}
