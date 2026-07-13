/**
 * Client-side feature flag system.
 *
 * Flags are persisted in `localStorage` and merged with hardcoded defaults
 * so every visitor gets sane behaviour out of the box while the team can
 * toggle features remotely via the browser console.
 *
 * @module shared/config/feature-flags
 */

import { isBrowser, isDev } from '@/shared/config/env';

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

/**
 * Union of every feature flag supported by the application.
 *
 * Add new flags here first — the compiler will guide you through all the
 * places that need updating (defaults, localStorage parsing, etc.).
 */
export type FeatureFlag =
  | 'hero_3d'
  | 'booking_v2'
  | 'gallery_masonry'
  | 'dark_mode'
  | 'analytics'
  | 'smooth_scroll'
  | 'reduced_motion_override'
  | 'debug_overlays';

/** Fully-resolved flag state (all keys required). */
export type FeatureFlags = Record<FeatureFlag, boolean>;

/* -------------------------------------------------------------------------- */
/*                                Defaults                                    */
/* -------------------------------------------------------------------------- */

/** localStorage key used to persist flag overrides. */
const STORAGE_KEY = 'sovereign-feature-flags' as const;

/**
 * Default flag values.
 *
 * Only `smooth_scroll` and `analytics` are enabled for every visitor.
 * All other features are opt-in for now.
 */
export const DEFAULT_FLAGS: Readonly<FeatureFlags> = {
  hero_3d: false,
  booking_v2: false,
  gallery_masonry: false,
  dark_mode: false,
  analytics: true,
  smooth_scroll: true,
  reduced_motion_override: false,
  debug_overlays: isDev,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Internal helpers                                 */
/* -------------------------------------------------------------------------- */

/**
 * Parse the raw localStorage JSON into a partial flag map.
 * Malformed / missing keys are silently ignored.
 */
function readStoredFlags(): Partial<FeatureFlags> {
  if (!isBrowser) return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};

    // Only keep keys that are valid feature flags.
    const flags: Partial<FeatureFlags> = {};
    for (const key of Object.keys(DEFAULT_FLAGS) as FeatureFlag[]) {
      if (key in (parsed as Record<string, unknown>)) {
        flags[key] = Boolean((parsed as Record<string, unknown>)[key]);
      }
    }
    return flags;
  } catch {
    // Corrupted data — ignore and fall back to defaults.
    return {};
  }
}

/**
 * Persist the full flag state to localStorage.
 */
function writeStoredFlags(flags: FeatureFlags): void {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  } catch {
    // Storage full or blocked — fail silently.
  }
}

/* -------------------------------------------------------------------------- */
/*                                  API                                       */
/* -------------------------------------------------------------------------- */

/**
 * Return the merged feature-flag state (stored overrides × defaults).
 *
 * @returns A new object with every {@link FeatureFlag} set.
 *
 * @example
 * ```ts
 * const flags = getFeatureFlags();
 * if (flags.hero_3d) { ... }
 * ```
 */
export function getFeatureFlags(): FeatureFlags {
  return { ...DEFAULT_FLAGS, ...readStoredFlags() };
}

/**
 * Toggle a single feature flag and persist the change.
 *
 * @param flag    - The flag to update.
 * @param enabled - `true` to enable, `false` to disable.
 *
 * @example
 * ```ts
 * setFeatureFlag('hero_3d', true);
 * ```
 */
export function setFeatureFlag(flag: FeatureFlag, enabled: boolean): void {
  const current = getFeatureFlags();
  current[flag] = enabled;
  writeStoredFlags(current);
}

/**
 * Check whether a single feature flag is currently enabled.
 *
 * @param flag - The flag to test.
 * @returns `true` when the flag is on.
 *
 * @example
 * ```ts
 * if (isFeatureEnabled('booking_v2')) { ... }
 * ```
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return getFeatureFlags()[flag];
}

/**
 * Wipe all stored overrides so every flag reverts to its default.
 */
export function resetFeatureFlags(): void {
  if (!isBrowser) return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}
