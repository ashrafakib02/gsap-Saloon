/**
 * Global application configuration.
 *
 * Centralised, frozen config object consumed throughout the app.
 * Import individual keys or the whole object — both are tree-shakeable.
 *
 * @module shared/config/app-config
 */

import {
  getFeatureFlags,
  type FeatureFlag,
} from '@/shared/config/feature-flags';

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

/** Social-media platform keys supported by the app. */
type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'pinterest';

/** URL configuration exposed to runtime. */
interface AppUrls {
  /** Base path for backend API calls. */
  api: string;
  /** Path to the booking flow. */
  booking: string;
  /** Social media profile URLs keyed by platform. */
  social: Record<SocialPlatform, string>;
}

/** Web Vitals / performance budget thresholds. */
interface PerformanceBudget {
  /** Largest Contentful Paint target (ms). */
  lcp: number;
  /** Interaction to Next Paint target (ms). */
  inp: number;
  /** Cumulative Layout Shift target. */
  cls: number;
  /** Maximum uncompressed JS bundle size (bytes). */
  maxBundleSize: number;
  /** Maximum total initial page-load transfer (bytes). */
  maxInitialLoad: number;
}

/** Top-level shape of the frozen config. */
export interface AppConfig {
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly urls: Readonly<AppUrls>;
  readonly featureFlags: Readonly<Record<FeatureFlag, boolean>>;
  readonly performance: Readonly<PerformanceBudget>;
}

/* -------------------------------------------------------------------------- */
/*                               Configuration                                */
/* -------------------------------------------------------------------------- */

/**
 * The application name as it appears in the browser tab and meta tags.
 */
export const APP_NAME = 'The Sovereign Artisor' as const;

/**
 * Tagline used in `<meta name="description">` and elsewhere.
 */
export const APP_DESCRIPTION = 'Where artistry meets intention' as const;

/**
 * Semantic version — keep in sync with `package.json`.
 */
export const APP_VERSION = '0.1.0' as const;

/**
 * Immutable runtime configuration for The Sovereign Artisor.
 *
 * @example
 * ```ts
 * import { APP_CONFIG } from '@/shared/config/app-config';
 *
 * fetch(`${APP_CONFIG.urls.api}/services`);
 * if (APP_CONFIG.featureFlags.hero_3d) { ... }
 * ```
 */
export const APP_CONFIG: AppConfig = Object.freeze({
  name: APP_NAME,
  description: APP_DESCRIPTION,
  version: APP_VERSION,

  urls: Object.freeze({
    api: '/api',
    booking: '/booking',
    social: Object.freeze({
      instagram: 'https://instagram.com/thesovereignartisor',
      facebook: 'https://facebook.com/thesovereignartisor',
      tiktok: '',
      youtube: '',
      pinterest: '',
    }) as Readonly<Record<SocialPlatform, string>>,
  }) as Readonly<AppUrls>,

  /** Feature flags are read lazily so the module stays side-effect free. */
  get featureFlags(): Readonly<Record<FeatureFlag, boolean>> {
    return Object.freeze(getFeatureFlags());
  },

  performance: Object.freeze({
    /** LCP target — 2 500 ms (Good). */
    lcp: 2500,
    /** INP target — 200 ms (Good). */
    inp: 200,
    /** CLS target — 0.1 (Good). */
    cls: 0.1,
    /** Max single bundle size — 300 KB uncompressed. */
    maxBundleSize: 300_000,
    /** Max total initial transfer — 1 MB. */
    maxInitialLoad: 1_000_000,
  }) as Readonly<PerformanceBudget>,
}) as AppConfig;
