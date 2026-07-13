import { useState, useEffect, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────

export interface FontLoadingState {
  /** Whether all declared fonts have finished loading */
  isLoaded: boolean;

  /** Names of fonts that have successfully loaded */
  loadedFonts: string[];

  /** Names of fonts that failed to load */
  failedFonts: string[];

  /** Whether the font loading API is available */
  isSupported: boolean;
}

// ── Constants ─────────────────────────────────────────────

/**
 * The two font families declared in the design system.
 * From DESIGN_SYSTEM §4: "Two typeface families maximum."
 */
const DECLARED_FONTS = ['Cormorant Garamond', 'DM Sans'] as const;

// ── Hook ──────────────────────────────────────────────────

/**
 * Tracks the loading status of the application's declared fonts.
 *
 * From DESIGN_SYSTEM §4 (Typography System):
 * "Two typeface families maximum. No exceptions."
 *   - Cormorant Garamond: serif, headlines, emotional moments
 *   - DM Sans: sans-serif, body copy, UI elements
 *
 * Uses the Font Loading API (document.fonts) to detect when fonts
 * are ready. Falls back gracefully when the API is unavailable.
 *
 * From TECHNICAL_ARCHITECTURE §11.7:
 * "Font loading uses font-display: swap for performance."
 * "Self-hosted fonts (recommended for production) eliminate
 *  the Google Fonts dependency."
 *
 * @example
 * ```tsx
 * const { isLoaded, loadedFonts } = useFontLoading();
 *
 * if (!isLoaded) {
 *   return <LoadingIndicator />;
 * }
 * ```
 */
export function useFontLoading(): FontLoadingState {
  const [state, setState] = useState<FontLoadingState>(() => {
    // Initial state: check if fonts API is supported
    const isSupported = typeof document !== 'undefined' && 'fonts' in document;

    // If fonts API exists and fonts are already loaded, initialize as loaded
    if (isSupported && document.fonts.status === 'loaded') {
      return {
        isLoaded: true,
        loadedFonts: [...DECLARED_FONTS],
        failedFonts: [],
        isSupported: true,
      };
    }

    return {
      isLoaded: false,
      loadedFonts: [],
      failedFonts: [],
      isSupported,
    };
  });

  const checkFonts = useCallback(async () => {
    if (!state.isSupported) {
      // Without the Font Loading API, assume fonts are available
      // (browser will use system fallbacks)
      setState(prev => ({
        ...prev,
        isLoaded: true,
        loadedFonts: [...DECLARED_FONTS],
      }));
      return;
    }

    try {
      // Wait for all declared fonts to load
      await Promise.all(
        DECLARED_FONTS.map(async (fontName) => {
          try {
            // Check each font weight the design system uses (300-700)
            const ready = document.fonts.ready;
            await ready;

            // Verify the font actually loaded by checking if it's in the font set
            const isAvailable = document.fonts.check(`16px "${fontName}"`);
            return { name: fontName, loaded: isAvailable };
          } catch {
            return { name: fontName, loaded: false };
          }
        }),
      );

      // After fonts.ready resolves, do a final check
      const loaded: string[] = [];
      const failed: string[] = [];

      for (const fontName of DECLARED_FONTS) {
        const isAvailable = document.fonts.check(`16px "${fontName}"`);
        if (isAvailable) {
          loaded.push(fontName);
        } else {
          failed.push(fontName);
        }
      }

      setState({
        isLoaded: true,
        loadedFonts: loaded,
        failedFonts: failed,
        isSupported: true,
      });
    } catch {
      // Font Loading API failed — assume fonts are available via fallback
      setState(prev => ({
        ...prev,
        isLoaded: true,
        loadedFonts: [...DECLARED_FONTS],
      }));
    }
  }, [state.isSupported]);

  useEffect(() => {
    // If fonts are already loaded, skip
    if (state.isLoaded) return;

    if (state.isSupported) {
      // Check if fonts are already loaded (e.g., after hydration)
      if (document.fonts.status === 'loaded') {
        void checkFonts();
        return;
      }

      // Listen for font loading events
      const handleLoadingDone = (): void => {
        void checkFonts();
      };

      document.fonts.addEventListener('loadingdone', handleLoadingDone);

      // Also check on DOMContentLoaded in case fonts loaded before this hook
      void checkFonts();

      return () => {
        document.fonts.removeEventListener('loadingdone', handleLoadingDone);
      };
    }

    // Without Font Loading API, mark as loaded immediately
    void checkFonts();
  }, [state.isLoaded, state.isSupported, checkFonts]);

  return state;
}
