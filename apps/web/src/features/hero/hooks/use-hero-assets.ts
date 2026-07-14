/**
 * useHeroAssets — Hero Asset Loading Hook
 *
 * From PROJECT_BLUEPRINT §Asset Infrastructure:
 * "Asset Loader Utilities — loadImage, loadFont, preloadImages,
 *  preloadFonts, getImageDimensions, createImageLoader with AbortController"
 *
 * From DESIGN_SYSTEM §12 (Imagery):
 * I13: "Image loading is progressive on mobile. A lightweight placeholder
 *  appears instantly; the full-resolution image replaces it."
 *
 * From DESIGN_SYSTEM §Performance:
 * P1: "LCP under 2.5 seconds — hero image visible within 2.5s"
 * P5: "Images served in modern formats (WebP/AVIF) with fallbacks"
 * P7: "Fonts load without blocking text rendering (font-display: swap)"
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "Hero image preloading: <link rel='preload'>, fetchpriority='high',
 *  explicit dimensions"
 *
 * This hook manages loading of critical hero assets:
 * 1. Hero image — preloads via <link rel="preload"> and monitors load
 * 2. Hero fonts — validates font loading via Font Loading API
 * 3. Error recovery — AbortController for cleanup on unmount
 *
 * Architecture:
 * - AbortController for cancellation on unmount
 * - Font Loading API (document.fonts) for font load detection
 * - Image preload via <link rel="preload"> injection
 * - Timeout fallback for font loading (graceful degradation)
 * - SSR-safe (no DOM manipulation on server)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { HeroLoadState } from '../hero.types';
import { HERO_ASSETS, HERO_FONT_CONFIG, HERO_CLS_PREVENTION } from '../hero-perf.config';

// ── Return Type ───────────────────────────────────────────

export interface UseHeroAssetsReturn {
  /** Current load state of hero assets */
  loadState: HeroLoadState;
  /** Whether fonts are loaded */
  fontsReady: boolean;
  /** Whether the hero image is loaded */
  imageLoaded: boolean;
  /** Start loading hero assets */
  startLoading: () => void;
  /** Retry loading after error */
  retry: () => void;
}

// ── Preload Injection Helpers ──────────────────────────────

/**
 * Inject a <link rel="preload"> tag into the document head.
 * SSR-safe — no-op if document is not available.
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "Preload hints tell the browser to start fetching critical
 *  resources early, before the parser encounters them."
 */
function injectPreloadLink(
  href: string,
  as: string,
  type?: string,
  crossOrigin?: string,
): HTMLLinkElement | null {
  if (typeof document === 'undefined') return null;

  /* Check if preload already exists (avoid duplicates) */
  const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
  if (existing) return existing as HTMLLinkElement;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  if (crossOrigin) link.crossOrigin = crossOrigin;
  document.head.appendChild(link);
  return link;
}

// ── Font Loading Helper ────────────────────────────────────

/**
 * Validate that critical fonts are loaded via the Font Loading API.
 * Returns a Promise that resolves when fonts are ready, or rejects
 * after the timeout.
 *
 * From DESIGN_SYSTEM §Performance P7:
 * "Fonts load without blocking text rendering (font-display: swap)"
 *
 * The Font Loading API provides precise font load status:
 * - document.fonts.ready — resolves when all fonts are loaded
 * - document.fonts.load() — triggers load of a specific font face
 */
function validateFontLoading(
  fonts: typeof HERO_FONT_CONFIG.critical,
  timeout: number,
  signal: AbortSignal,
): Promise<boolean> {
  if (typeof document === 'undefined' || !document.fonts) {
    return Promise.resolve(true);
  }

  return new Promise<boolean>((resolve) => {
    let resolved = false;

    const onResolve = (result: boolean) => {
      if (resolved) return;
      resolved = true;
      resolve(result);
    };

    /* Abort signal handler */
    const onAbort = () => {
      onResolve(false);
    };
    signal.addEventListener('abort', onAbort, { once: true });

    /* Timeout fallback — proceed with system fonts if web fonts don't load */
    const timer = setTimeout(() => {
      onResolve(false);
    }, timeout);

    /* Request font loading for each critical font */
    const loadPromises = fonts
      .filter((f) => f.preload)
      .map((f) => {
        try {
          return document.fonts.load(`${f.weight} 1em "${f.family}"`);
        } catch {
          /* Font loading API not available or font not registered */
          return Promise.resolve();
        }
      });

    /* Wait for all font loads or timeout */
    Promise.allSettled(loadPromises)
      .then(() => {
        clearTimeout(timer);
        signal.removeEventListener('abort', onAbort);
        onResolve(true);
      })
      .catch(() => {
        clearTimeout(timer);
        signal.removeEventListener('abort', onAbort);
        onResolve(false);
      });
  });
}

// ── Image Loading Helper ───────────────────────────────────

/**
 * Load the hero image and track completion.
 * Uses the Image constructor for preloading — the browser fetches
 * and decodes the image in the background.
 *
 * From DESIGN_SYSTEM §12 I13:
 * "Image loading is progressive — lightweight placeholder first"
 *
 * The actual <img> element is rendered by HeroMedia.
 * This function preloads the image data so when the <img> renders,
 * the browser already has the decoded pixels (fast LCP).
 */
function preloadHeroImage(
  src: string,
  signal: AbortSignal,
): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  return new Promise<boolean>((resolve) => {
    let resolved = false;

    const onResolve = (result: boolean) => {
      if (resolved) return;
      resolved = true;
      resolve(result);
    };

    /* Abort signal handler */
    const onAbort = () => {
      img.onload = null;
      img.onerror = null;
      onResolve(false);
    };
    signal.addEventListener('abort', onAbort, { once: true });

    const img = new Image();

    img.onload = () => {
      signal.removeEventListener('abort', onAbort);
      onResolve(true);
    };

    img.onerror = () => {
      signal.removeEventListener('abort', onAbort);
      onResolve(false);
    };

    /* Set fetch priority hint if supported */
    if ('fetchPriority' in img) {
      (img as HTMLImageElement & { fetchPriority: string }).fetchPriority = 'high';
    }

    img.src = src;
  });
}

// ── Hook ──────────────────────────────────────────────────

/**
 * Manages loading of critical hero assets.
 *
 * Phase 4.1: Stub implementation — basic load state tracking.
 * Phase 4.7: Full implementation with preload injection,
 *            font validation, and CLS prevention.
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "Hero image preloading: <link rel='preload'>, fetchpriority='high',
 *  explicit dimensions"
 *
 * The hook coordinates three parallel loading activities:
 * 1. Image preload — <link rel="preload"> + Image() constructor
 * 2. Font validation — Font Loading API
 * 3. Error recovery — AbortController cleanup
 */
export function useHeroAssets(): UseHeroAssetsReturn {
  const [loadState, setLoadState] = useState<HeroLoadState>('idle');
  const [fontsReady, setFontsReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const startLoading = useCallback(() => {
    setLoadState('loading');

    /* Create a new AbortController for this loading session */
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    /* ── 1. Inject preload hint for hero image ────────────
     * The browser begins fetching the image immediately,
     * before the <img> element is rendered. This is critical
     * for LCP — the image must be decoded before it can paint. */
    injectPreloadLink(
      HERO_ASSETS.image.src,
      'image',
      'image/webp',
      'anonymous',
    );

    /* ── 2. Preload hero image via Image constructor ──────
     * This triggers the browser to fetch and decode the image
     * in the background. When HeroMedia renders the <img>,
     * the browser already has the decoded pixels. */
    const imagePromise = preloadHeroImage(HERO_ASSETS.image.src, signal);

    /* ── 3. Validate font loading ─────────────────────────
     * Request critical font faces via the Font Loading API.
     * This ensures fonts are loaded (or at least attempted)
     * before the hero content becomes visible. */
    const fontsPromise = validateFontLoading(
      HERO_FONT_CONFIG.critical,
      HERO_FONT_CONFIG.loadTimeout,
      signal,
    );

    /* ── 4. Coordinate results ────────────────────────────
     * Wait for both image and fonts to complete.
     * If either fails, we still mark as loaded (graceful degradation).
     * The hero should NEVER be stuck in a loading state. */
    Promise.allSettled([imagePromise, fontsPromise])
      .then((results) => {
        if (signal.aborted) return;

        const [imageResult, fontsResult] = results;

        /* Image loaded successfully */
        if (imageResult.status === 'fulfilled' && imageResult.value) {
          setImageLoaded(true);
        }

        /* Fonts loaded successfully */
        if (fontsResult.status === 'fulfilled' && fontsResult.value) {
          setFontsReady(true);
        }

        /* Mark as loaded regardless — graceful degradation.
         * The hero shows a warm placeholder if the image fails.
         * The hero uses system fonts if web fonts fail. */
        setLoadState('loaded');
      })
      .catch(() => {
        /* Should not happen — Promise.allSettled doesn't reject */
        if (!signal.aborted) {
          setLoadState('loaded');
        }
      });
  }, []);

  const retry = useCallback(() => {
    /* Cancel any in-flight loading */
    abortRef.current?.abort();
    setLoadState('idle');
    setImageLoaded(false);
    setFontsReady(false);
    /* Small delay before retry to allow state reset */
    setTimeout(() => startLoading(), 50);
  }, [startLoading]);

  /* Cleanup on unmount — cancel all in-flight operations */
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return {
    loadState,
    fontsReady,
    imageLoaded,
    startLoading,
    retry,
  };
}
