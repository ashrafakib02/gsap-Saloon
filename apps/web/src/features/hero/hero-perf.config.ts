/**
 * Hero Feature — Performance Configuration
 *
 * From DESIGN_SYSTEM §Performance:
 * P1: "LCP under 2.5 seconds — hero image visible within 2.5s"
 * P2: "CLS under 0.1 — no layout shifts after initial render"
 * P4: "Total page weight under 1MB"
 * P5: "Images served in modern formats (WebP/AVIF) with fallbacks"
 * P7: "Fonts load without blocking text rendering (font-display: swap)"
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "Hero image preloading: <link rel='preload'>, fetchpriority='high',
 *  explicit dimensions"
 *
 * This file defines performance-related constants, asset paths,
 * and optimization parameters for the hero section.
 *
 * Architecture:
 * - HERO_PERF_BUDGET — Core Web Vitals targets
 * - HERO_ASSETS — Asset paths and preload configuration
 * - HERO_LAZY — Lazy loading thresholds and IntersectionObserver config
 * - HERO_FONT_CONFIG — Font loading strategy and validation
 *
 * DO NOT import this file from outside the hero feature.
 * Components consume these values through hooks and props.
 */

import type { HeroVariant } from './hero.types';

// ── Performance Budget ─────────────────────────────────────

/**
 * Core Web Vitals targets for the hero section.
 *
 * These are PREPARATION constants — the actual measurement
 * infrastructure is in use-hero-performance.ts.
 *
 * From DESIGN_SYSTEM §Performance:
 * - LCP < 2.5s (hero image must be visible within 2.5s)
 * - CLS < 0.05 (hero contributes near-zero layout shift)
 * - INP < 200ms (hero interactions respond within budget)
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "Performance budgets are enforced at build time via
 *  bundle analysis and at runtime via PerformanceObserver."
 */
export const HERO_PERF_BUDGET = {
  /** Maximum LCP target for hero image (ms) */
  lcpTarget: 2_500,
  /** Maximum CLS contribution from hero layout */
  clsBudget: 0.05,
  /** Maximum INP for hero interactions (ms) */
  inpTarget: 200,
  /** Maximum TTFB target (ms) */
  ttfbTarget: 800,
  /** Maximum hero total weight (bytes) — image + fonts + scripts */
  maxTotalWeight: 600_000,
  /** Maximum hero image file size (bytes) — 400KB for hero-quality WebP */
  maxImageSize: 400_000,
  /** Maximum font weight files to preload */
  maxFontPreloads: 4,
} as const;

// ── Asset Configuration ────────────────────────────────────

/**
 * Hero asset paths and loading strategy.
 *
 * From DESIGN_SYSTEM §12 (Imagery):
 * I3: "Hero images are 16:9 or wider"
 * I7: "Hero images are never cropped tight — generous headroom"
 * I13: "Image loading is progressive on mobile"
 *
 * From VISUAL_RULES N23:
 * "Never use skeleton loading screens with shimmer effects.
 *  Our loading states are either instant or branded."
 *
 * Phase 4.7 implements the ARCHITECTURE for asset loading.
 * Actual image optimization (AVIF, srcset, blur-up) is Phase 11.6.
 */
export const HERO_ASSETS = {
  /** Hero image paths by format preference */
  image: {
    /** Primary image path (WebP) */
    src: '/images/hero/hero-main.webp',
    /** Placeholder — warm solid color (NOT shimmer per N23) */
    placeholder: '/images/hero/hero-placeholder.webp',
    /** Explicit dimensions for CLS prevention */
    width: 1920,
    height: 1080,
    /** Aspect ratio string for CSS */
    aspectRatio: '16 / 9',
    /** Alt text sourced from copy module */
    alt: '' as string, /* Populated at usage from HERO_COPY_EN */
    /** Loading strategy — eager for above-the-fold hero */
    loading: 'eager' as const,
    /** Fetch priority — high for hero image */
    fetchPriority: 'high' as const,
  },

  /**
   * Responsive image breakpoints for future srcset implementation.
   *
   * From DESIGN_SYSTEM §7 (Breakpoints):
   * Mobile: 0–767px, Tablet: 768–1023px, Desktop: 1024–1439px, Wide: 1440px+
   *
   * Phase 11.6 will generate actual srcset from these breakpoints.
   * Phase 4.7 defines the ARCHITECTURE only.
   */
  responsiveBreakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
    wide: 2560,
  } as Record<HeroVariant | 'wide', number>,

  /**
   * Format negotiation order for future AVIF/WebP detection.
   *
   * From DESIGN_SYSTEM §Performance P5:
   * "Images served in modern formats (WebP/AVIF) with fallbacks"
   *
   * Phase 11.6 will implement <picture> with source elements.
   * Phase 4.7 defines the architecture.
   */
  formatPriority: ['avif', 'webp', 'jpeg'] as const,

  /** Preload hints for critical hero assets */
  preload: {
    /** Whether to inject <link rel="preload"> for the hero image */
    image: true,
    /** Whether to preload critical font subsets */
    fonts: true,
    /** DNS prefetch for external asset domains */
    dnsPrefetch: [] as string[],
    /** Preconnect for external asset origins */
    preconnect: [] as string[],
  },
} as const;

// ── Lazy Loading Configuration ─────────────────────────────

/**
 * IntersectionObserver and lazy loading thresholds.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Load what the visitor needs, when they need it."
 *
 * The hero itself is NOT lazy — it's above the fold.
 * This config prepares lazy boundaries for:
 * - 3D scene (below the fold, heavy)
 * - Future below-fold sections
 * - Deferred script loading
 */
export const HERO_LAZY = {
  /**
   * IntersectionObserver rootMargin for prefetching.
   * Start loading 200px before the element enters the viewport.
   */
  prefetchMargin: '200px',

  /**
   * IntersectionObserver rootMargin for lazy 3D mount.
   * Only mount the 3D scene when the hero is approaching viewport.
   * Since the hero IS the viewport, this triggers immediately.
   * For future: when hero scrolls out of view, pause 3D.
   */
  mountMargin: '0px',

  /**
   * IntersectionObserver threshold for visibility detection.
   * 0.1 = trigger when 10% visible.
   */
  visibilityThreshold: 0.1,

  /**
   * Delay before lazy-loading non-critical scripts (ms).
   * Uses requestIdleCallback or setTimeout fallback.
   */
  deferredScriptDelay: 1_000,

  /**
   * Whether to use content-visibility: auto for below-fold sections.
   * This is a CSS-level optimization — components opt in via className.
   */
  contentVisibility: true,
} as const;

// ── Font Configuration ─────────────────────────────────────

/**
 * Font loading strategy for hero typography.
 *
 * From DESIGN_SYSTEM §4:
 * "Two font families: Cormorant Garamond (serif) and DM Sans (sans-serif)."
 *
 * From DESIGN_SYSTEM §Performance P7:
 * "Fonts load without blocking text rendering (font-display: swap)"
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "Font loading: font-display: swap, preconnect to font source,
 *  preload critical subsets"
 */
export const HERO_FONT_CONFIG = {
  /**
   * Critical fonts that must load for the hero.
   * These are preloaded to prevent FOUT (Flash of Unstyled Text).
   */
  critical: [
    {
      family: 'Cormorant Garamond',
      weight: 600,
      /** Subset for Latin characters — covers hero headline */
      subset: 'latin',
      /** CSS variable name for runtime access */
      cssVar: '--font-serif',
      /** Whether to preload this font */
      preload: true,
    },
    {
      family: 'DM Sans',
      weight: 300,
      subset: 'latin',
      cssVar: '--font-sans',
      preload: true,
    },
  ] as const,

  /**
   * Font loading timeout (ms).
   * If fonts don't load within this time, proceed with fallback.
   * From DESIGN_SYSTEM §Performance: "Fonts degrade gracefully."
   */
  loadTimeout: 3_000,

  /**
   * Whether to use the Font Loading API for load detection.
   * document.fonts.ready is the primary mechanism.
   */
  useFontLoadingAPI: true,

  /**
   * font-display value used in @font-face declarations.
   * 'swap' ensures text is visible immediately with fallback,
   * then swaps to the web font when loaded.
   */
  fontDisplay: 'swap',
} as const;

// ── CLS Prevention ─────────────────────────────────────────

/**
 * Cumulative Layout Shift prevention configuration.
 *
 * From DESIGN_SYSTEM §Performance P2:
 * "CLS under 0.1 — no layout shifts after initial render"
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "CLS prevention: explicit dimensions, aspect-ratio, size-adjust"
 *
 * The hero MUST have zero layout shift — it's the first thing
 * the visitor sees. Any shift breaks the "entrance" moment.
 */
export const HERO_CLS_PREVENTION = {
  /** Reserve dimensions for the hero image */
  image: {
    width: 1920,
    height: 1080,
    aspectRatio: '16 / 9',
  },

  /**
   * Content stability — minimum height for the content wrapper.
   * Prevents shift when fonts load (swap causes size change).
   */
  contentMinHeight: {
    mobile: '200px',
    tablet: '280px',
    desktop: '320px',
  } as Record<HeroVariant, string>,

  /**
   * Font metric adjustment for CLS prevention.
   * When web fonts swap in, they may have different metrics than
   * system fallbacks. size-adjust and ascent-dercent help align
   * the fallback with the web font to minimize shift.
   *
   * Phase 11.7 will implement actual size-adjust values.
   * Phase 4.7 defines the architecture.
   */
  fontMetricAdjustment: {
    enabled: false, /* Enable in Phase 11.7 after measuring font metrics */
    /** Placeholder for size-adjust value */
    cormorantGaramond: '100% 100%',
    /** Placeholder for size-adjust value */
    dmSans: '100% 100%',
  },

  /** Reserved space for the loading indicator to prevent shift */
  loadingHeight: '100svh',
} as const;

// ── GSAP Lazy Initialization ───────────────────────────────

/**
 * GSAP lazy initialization configuration.
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "The only time-linked animation is the hero reveal on initial page load."
 *
 * GSAP should NOT block initial render. It should be loaded
 * asynchronously after the hero content is visible.
 *
 * Architecture:
 * - Phase 4.7: Define the lazy loading strategy
 * - Phase 9: Implement the actual GSAP timeline
 * - GSAP is loaded via dynamic import (code-split)
 * - ScrollTrigger is loaded only when scroll animations are needed
 */
export const HERO_GSAP_CONFIG = {
  /** Whether to preload GSAP during idle time */
  preloadDuringIdle: true,

  /** Whether to preload GSAP during the hero loading threshold */
  preloadDuringLoad: true,

  /** Delay before idle preload (ms) — after hero is revealed */
  idlePreloadDelay: 2_000,

  /** Dynamic import path for GSAP */
  gsapModulePath: 'gsap',

  /** Dynamic import path for ScrollTrigger (only needed for Phase 5+) */
  scrollTriggerModulePath: 'gsap/ScrollTrigger',

  /**
   * Whether GSAP should initialize on first use or eagerly.
   * 'lazy' = dynamic import on first animation start
   * 'eager' = import during hero loading threshold
   */
  initStrategy: 'eager' as 'lazy' | 'eager',
} as const;

// ── Memory Management ──────────────────────────────────────

/**
 * Memory cleanup and lifecycle configuration.
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "Memory cleanup: AbortController for fetch, cleanup functions for
 *  useEffect, WeakRef for DOM references"
 *
 * The hero section must not leak memory when:
 * - The component unmounts
 * - The page transitions
 * - The user navigates away
 */
export const HERO_MEMORY_CONFIG = {
  /** Whether to use AbortController for all fetch operations */
  useAbortController: true,

  /** Maximum number of event listeners per component */
  maxEventListeners: 10,

  /** Whether to log memory warnings in development */
  logMemoryWarnings: true,

  /** Interval for memory monitoring in development (ms) */
  memoryCheckInterval: 10_000,
} as const;
