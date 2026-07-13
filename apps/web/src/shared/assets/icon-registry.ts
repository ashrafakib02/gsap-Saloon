/**
 * Icon Registry — Line-based, single-color icon tracking
 *
 * Manages SVG icon definitions following the design system rules:
 *   - Line-based (not filled), geometric, single-color
 *   - Minimum 24×24px, consistent stroke width
 *   - CSS class prefix: `sovereign-icon`
 *
 * Icons are registered as `IconDefinition` objects containing the raw
 * SVG path data. Components render them with configurable size and color.
 *
 * @example
 * ```ts
 * import { globalIconRegistry, ICON_SIZES, ICON_NAMESPACE } from '@/shared/assets';
 *
 * // Register an icon
 * globalIconRegistry.register({
 *   name: 'arrow-right',
 *   viewBox: '0 0 24 24',
 *   paths: ['M5 12h14M12 5l7 7-7 7'],
 *   defaultSize: 24,
 *   strokeWidth: 1.5,
 * });
 *
 * // Retrieve for rendering
 * const icon = globalIconRegistry.get('arrow-right');
 * // → { name: 'arrow-right', viewBox: '0 0 24 24', paths: [...], ... }
 *
 * // Use size token
 * const size = ICON_SIZES.large; // 32
 * ```
 */

// ── Types ─────────────────────────────────────────────────

/** Supported icon sizes in pixels. Must be >= 24px per design rules. */
export type IconSize = 16 | 20 | 24 | 32 | 40 | 48;

/**
 * Visual variant for icons (determines color treatment).
 *
 * - `'default'`: Inherits current text color
 * - `'accent'`: Uses the accent gold color
 */
export type IconVariant = 'default' | 'accent';

/**
 * Complete definition for a single line-based icon.
 */
export interface IconDefinition {
  /** Unique name identifier (kebab-case, e.g., 'arrow-right') */
  name: string;
  /** SVG viewBox attribute (e.g., '0 0 24 24') */
  viewBox: string;
  /** Array of SVG path `d` attribute strings */
  paths: string[];
  /** Recommended default size in pixels */
  defaultSize: IconSize;
  /** Stroke width for the line-based rendering (typically 1.5) */
  strokeWidth: number;
}

/** The interface returned by {@link createIconRegistry}. */
export interface IconRegistry {
  /** Register a new icon definition (or overwrite with the same name) */
  register(icon: IconDefinition): void;
  /** Retrieve an icon by name, or undefined if not found */
  get(name: string): IconDefinition | undefined;
  /** Get all registered icons */
  getAll(): IconDefinition[];
  /** Check whether an icon with the given name exists */
  has(name: string): boolean;
}

// ── Size Tokens ───────────────────────────────────────────

/**
 * Named size tokens mapped to pixel values.
 *
 * From DESIGN_SYSTEM: minimum icon size is 24px for functional use.
 * `small` (16px) is reserved for inline text icons only.
 */
export const ICON_SIZES: Record<string, IconSize> = {
  small: 16,
  medium: 24,
  large: 32,
  xlarge: 40,
  hero: 48,
} as const;

// ── Namespace ─────────────────────────────────────────────

/**
 * CSS class namespace prefix for icon components.
 *
 * All icon-related classes should be prefixed with this string
 * to avoid collisions (e.g., `sovereign-icon`, `sovereign-icon--accent`).
 */
export const ICON_NAMESPACE: string = 'sovereign-icon';

// ── Factory ───────────────────────────────────────────────

/**
 * Create a new icon registry instance.
 *
 * Each instance maintains its own isolated collection of {@link IconDefinition} objects.
 *
 * @returns A fully-typed {@link IconRegistry}.
 */
export function createIconRegistry(): IconRegistry {
  const store = new Map<string, IconDefinition>();

  return {
    register(icon: IconDefinition): void {
      store.set(icon.name, { ...icon });
    },

    get(name: string): IconDefinition | undefined {
      const icon = store.get(name);
      return icon ? { ...icon } : undefined;
    },

    getAll(): IconDefinition[] {
      return Array.from(store.values()).map((icon) => ({ ...icon }));
    },

    has(name: string): boolean {
      return store.has(name);
    },
  };
}

// ── Global Singleton ──────────────────────────────────────

/**
 * Global singleton icon registry instance.
 *
 * Use this for app-wide icon registration and lookup.
 */
export const globalIconRegistry: IconRegistry = createIconRegistry();
