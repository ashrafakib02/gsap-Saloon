/**
 * Design Tokens — Barrel Export
 *
 * All tokens are derived from DESIGN_SYSTEM.md and VISUAL_RULES.md.
 * CSS custom properties in tailwind.css are the source of truth for rendering.
 * These TypeScript values are for programmatic access (animations, utilities, validation).
 *
 * Token hierarchy (from DESIGN_SYSTEM §2):
 *   Primitive tokens → Semantic tokens → Component tokens
 *
 * Components reference semantic tokens, never primitives.
 */

// Color tokens (light + dark mode)
export { COLORS_LIGHT, COLORS_DARK, getColorTokens } from './color';
export type { ColorTokens, ColorTokenKey } from './color';

// Typography tokens
export { FONT_FAMILY, TYPE_SCALE, TYPE_SCALE_TABLET, TYPE_SCALE_DESKTOP } from './typography';
export type { TypeLevel, FontFamilyKey } from './typography';

// Radius tokens
export { RADIUS } from './radius';
export type { RadiusToken, RadiusLevel } from './radius';

// Shadow tokens (light + dark mode)
export { SHADOWS_LIGHT, SHADOWS_DARK, getShadowTokens } from './shadow';
export type { ShadowLevel, ShadowTokens } from './shadow';

// Motion tokens
export { DURATION, EASING, MOTION_LIMITS, MOTION } from './motion';
export type { DurationToken, EasingToken } from './motion';

// Z-index layer tokens
export { Z_INDEX } from './z-index';
export type { ZIndexToken } from './z-index';
