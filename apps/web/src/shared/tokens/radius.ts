/**
 * Radius Tokens
 *
 * From DESIGN_SYSTEM §8 (Radius System):
 * "A rounded corner communicates warmth, approachability, and organic form."
 *
 * Radius Rules (R1-R6):
 *   R1: Values limited to the defined scale — no custom values
 *   R2: Cards and containers use radius-medium
 *   R3: Buttons use radius-small or radius-medium
 *   R4: Form fields use radius-small
 *   R5: Full-bleed sections use radius-none
 *   R6: Radius never exceeds 16px (except radius-full for circular)
 *
 * These tokens mirror the CSS custom properties in tailwind.css.
 */

export const RADIUS = {
  /** Full-bleed elements, sections — no rounding (R5) */
  none: '0px',

  /** Form fields, small interactive elements — subtle softening (R4) */
  small: '4px',

  /** Cards, buttons, containers — warmth without playfulness (R2, R3) */
  medium: '8px',

  /** Large containers, modal dialogs, featured elements */
  large: '16px',

  /** Circular elements only — avatars, round buttons, tags */
  full: '9999px',
} as const;

// ── Types ────────────────────────────────────────────────

export type RadiusToken = typeof RADIUS[keyof typeof RADIUS];
export type RadiusLevel = keyof typeof RADIUS;
