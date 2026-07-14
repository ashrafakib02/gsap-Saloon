/**
 * useHeroAssets — Hero Asset Loading Hook Placeholder
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
 * This hook is a PLACEHOLDER for Phase 4.7 (Hero Performance).
 * It defines the interface that the hero composition expects.
 *
 * Architecture:
 * - Preloads critical hero assets (image, fonts)
 * - Reports loading progress for the loading threshold
 * - Handles error recovery
 * - Uses AbortController for cancellation on unmount
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { HeroLoadState } from '../hero.types';

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

// ── Configuration ─────────────────────────────────────────

/**
 * Critical hero assets to preload.
 * Phase 4.7 will replace these with actual asset paths.
 *
 * TODO Phase 4.7: Define asset constants for image paths and font families.
 * Currently the hook simulates loading without referencing specific assets.
 */

// ── Hook ──────────────────────────────────────────────────

/**
 * Manages loading of critical hero assets.
 *
 * Phase 4.1: Stub implementation — basic load state tracking.
 * Phase 4.7: Full implementation with format detection, srcset,
 *            preloading, and CLS prevention.
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "Hero image preloading: <link rel='preload'>, fetchpriority='high',
 *  explicit dimensions"
 *
 * TODO Phase 4.7: Implement hero image preloading
 * TODO Phase 4.7: Implement font preloading with font-display: swap
 * TODO Phase 4.7: Implement format detection (AVIF → WebP → JPEG)
 * TODO Phase 4.7: Implement responsive srcset generation
 * TODO Phase 4.7: Implement blur-up LQIP placeholder
 */
export function useHeroAssets(): UseHeroAssetsReturn {
  const [loadState, setLoadState] = useState<HeroLoadState>('idle');
  const [fontsReady, setFontsReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const startLoading = useCallback(() => {
    setLoadState('loading');

    /* Phase 4.7 will implement:
     *
     * // Preload hero image
     * const img = new Image();
     * img.src = HERO_ASSETS.image;
     * img.onload = () => setImageLoaded(true);
     * img.onerror = () => setLoadState('error');
     *
     * // Check font loading
     * if (document.fonts) {
     *   Promise.all(
     *     HERO_ASSETS.fonts.map(font => document.fonts.load(`1em "${font}"`))
     *   ).then(() => setFontsReady(true));
     * }
     */

    /* Placeholder: simulate loading */
    const timeout = setTimeout(() => {
      setFontsReady(true);
      setImageLoaded(true);
      setLoadState('loaded');
    }, 100);

    abortRef.current = new AbortController();
    abortRef.current.signal.addEventListener('abort', () => {
      clearTimeout(timeout);
    });
  }, []);

  const retry = useCallback(() => {
    abortRef.current?.abort();
    setLoadState('idle');
    setImageLoaded(false);
    setFontsReady(false);
    /* Small delay before retry to allow state reset */
    setTimeout(() => startLoading(), 50);
  }, [startLoading]);

  /* Cleanup on unmount */
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
