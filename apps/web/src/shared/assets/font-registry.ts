/**
 * Font Registry — Two-family type system for the salon
 *
 * Manages the two font families used across the site:
 *   - **Serif** (voice): Cormorant Garamond — for headings, display, editorial copy
 *   - **Sans-serif** (function): DM Sans — for body, UI, navigation, form labels
 *
 * Each family defines five weight variants (300–700) with woff2 source paths.
 * CSS custom properties (`--font-serif`, `--font-sans`) are the rendering
 * source of truth; these TypeScript values provide programmatic access.
 *
 * @example
 * ```ts
 * import { getFontFamily, getAllFontSources, FONT_CSS_VAR_MAP } from '@/shared/assets';
 *
 * // Get a font definition
 * const serif = getFontFamily('serif');
 * console.log(serif.family); // 'Cormorant Garamond'
 *
 * // Get all sources for preloading
 * const sources = getAllFontSources();
 * // → [{ family: 'Cormorant Garamond', source: '...300.woff2', weight: '300' }, ...]
 *
 * // Use CSS variable in a component
 * const style = { fontFamily: FONT_CSS_VAR_MAP['sans-serif'] };
 * ```
 */

// ── Types ─────────────────────────────────────────────────

/** The two font family roles in the design system. */
export type FontFamily = 'serif' | 'sans-serif';

/** Available weight variants for each family. */
export type FontWeight = 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold';

/**
 * Complete definition for a single font family.
 */
export interface FontDefinition {
  /** Human-readable family name (e.g., 'Cormorant Garamond') */
  family: string;
  /** Role in the type system: `'serif'` (voice) or `'sans-serif'` (function) */
  familyName: FontFamily;
  /** Map of weight variants to their source file paths */
  sources: Record<FontWeight, string>;
  /** CSS font-display strategy */
  display: 'swap' | 'optional' | 'fallback';
}

/**
 * A single preloadable font source entry.
 */
export interface FontSourceEntry {
  /** Font family name */
  family: string;
  /** URL or path to the font file */
  source: string;
  /** Weight value as a numeric string (e.g., '300', '700') */
  weight: string;
}

// ── Weight Mapping ────────────────────────────────────────

/** Maps logical weight names to CSS numeric values. */
const WEIGHT_VALUES: Record<FontWeight, string> = {
  light: '300',
  regular: '400',
  medium: '500',
  'semi-bold': '600',
  bold: '700',
};

// ── Font Definitions ──────────────────────────────────────

/**
 * Complete font definitions for both families.
 *
 * Source paths follow the pattern `/fonts/{name}-{weight}.woff2`.
 * Uses `display: 'swap'` so text is visible immediately with a fallback font.
 */
export const FONT_DEFINITIONS: Record<FontFamily, FontDefinition> = {
  serif: {
    family: 'Cormorant Garamond',
    familyName: 'serif',
    sources: {
      light: '/fonts/cormorant-garamond-300.woff2',
      regular: '/fonts/cormorant-garamond-400.woff2',
      medium: '/fonts/cormorant-garamond-500.woff2',
      'semi-bold': '/fonts/cormorant-garamond-600.woff2',
      bold: '/fonts/cormorant-garamond-700.woff2',
    },
    display: 'swap',
  },
  'sans-serif': {
    family: 'DM Sans',
    familyName: 'sans-serif',
    sources: {
      light: '/fonts/dm-sans-300.woff2',
      regular: '/fonts/dm-sans-400.woff2',
      medium: '/fonts/dm-sans-500.woff2',
      'semi-bold': '/fonts/dm-sans-600.woff2',
      bold: '/fonts/dm-sans-700.woff2',
    },
    display: 'swap',
  },
};

// ── Utilities ─────────────────────────────────────────────

/**
 * Get the font definition for a given role.
 *
 * @param role - `'serif'` for voice/display, `'sans-serif'` for function/body.
 * @returns The {@link FontDefinition} for the requested family.
 */
export function getFontFamily(role: FontFamily): FontDefinition {
  return FONT_DEFINITIONS[role];
}

/**
 * Get a flat list of all font sources across both families.
 *
 * Useful for batch preloading at app startup.
 *
 * @returns Array of {@link FontSourceEntry} objects, one per weight per family.
 */
export function getAllFontSources(): FontSourceEntry[] {
  const entries: FontSourceEntry[] = [];

  for (const definition of Object.values(FONT_DEFINITIONS)) {
    for (const [weight, source] of Object.entries(definition.sources)) {
      entries.push({
        family: definition.family,
        source,
        weight: WEIGHT_VALUES[weight as FontWeight],
      });
    }
  }

  return entries;
}

/**
 * CSS custom property names for each font family.
 *
 * These match the variables defined in `tailwind.css` and are used
 * for programmatic style injection.
 *
 * @example
 * ```ts
 * element.style.fontFamily = FONT_CSS_VAR_MAP['serif'];
 * // → "var(--font-serif)"
 * ```
 */
export const FONT_CSS_VAR_MAP: Record<FontFamily, string> = {
  serif: 'var(--font-serif)',
  'sans-serif': 'var(--font-sans)',
};
