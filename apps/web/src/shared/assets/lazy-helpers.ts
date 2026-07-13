/**
 * Lazy Asset Loading Helpers
 *
 * Pure, tree-shakeable utilities for deferred and batched asset loading.
 * All functions are SSR-safe and create no side effects at import time.
 *
 * @example
 * ```ts
 * import {
 *   lazyImage,
 *   createLazyLoader,
 *   createAssetPreloader,
 *   deferredImport,
 * } from '@/shared/assets';
 *
 * // Simple image config for components to consume
 * const heroImage = lazyImage('/images/hero.webp', '/images/hero-placeholder.webp');
 *
 * // Wrap any async loader with memoization
 * const loadThree = createLazyLoader(() => import('three'));
 * loadThree.preload(); // Start loading immediately
 * const THREE = await loadThree.load(); // Returns cached instance
 *
 * // Batch preload critical assets
 * const preloader = createAssetPreloader();
 * preloader.add('fonts', () => preloadFonts(fonts));
 * preloader.add('hero', () => loadImage('/hero.webp'));
 * await preloader.preloadAll();
 *
 * // Cache a dynamic import
 * const loadGsap = deferredImport(() => import('gsap'));
 * const gsap = await loadGsap(); // First call: loads
 * const gsap2 = await loadGsap(); // Second call: cached
 * ```
 */

// ── Types ─────────────────────────────────────────────────

/**
 * Configuration object returned by {@link lazyImage}.
 * Consumed by image components that handle loading state.
 */
export interface LazyImageConfig {
  /** Image source URL or path */
  src: string;
  /** Placeholder URL or base64 string shown during loading */
  placeholder: string;
  /** Whether the full image has been loaded (always starts as `false`) */
  loaded: boolean;
}

/**
 * Handle returned by {@link createLazyLoader}.
 * Wraps any async loader with memoization and preload capability.
 */
export interface LazyLoader<T> {
  /** Load the asset (returns cached result if already loaded) */
  load: () => Promise<T>;
  /** Start preloading in the background without waiting for the result */
  preload: () => void;
  /** Whether the asset has been loaded at least once */
  isLoaded: boolean;
  /** Clear the cached result, forcing a fresh load on next call */
  reset: () => void;
}

/**
 * Handle returned by {@link createAssetPreloader}.
 * Manages a batch of named asset loaders.
 */
export interface AssetPreloader {
  /** Register a named asset loader */
  add(id: string, loader: () => Promise<unknown>): void;
  /** Load all registered assets and return their results */
  preloadAll(): Promise<Map<string, unknown>>;
  /** Load only the specified assets by id */
  preload(ids: string[]): Promise<Map<string, unknown>>;
  /** Check whether a specific asset has been preloaded */
  isPreloaded(id: string): boolean;
}

// ── lazyImage ─────────────────────────────────────────────

/**
 * Create a lazy image configuration object for use by image components.
 *
 * Returns a plain config object (not a Promise) with `src`, `placeholder`,
 * and `loaded` fields. Components can use this to render a `<img>` with
 * placeholder → full image swap logic.
 *
 * @param src - The full image source URL.
 * @param placeholder - Base64 or URL for the placeholder. Defaults to empty string.
 * @returns A {@link LazyImageConfig} with `loaded: false`.
 */
export function lazyImage(
  src: string,
  placeholder: string = '',
): LazyImageConfig {
  return {
    src,
    placeholder,
    loaded: false,
  };
}

// ── createLazyLoader ──────────────────────────────────────

/**
 * Wrap any async loader with memoization and background preload.
 *
 * The loader function is called at most once. Subsequent `load()` calls
 * return the cached result. `reset()` clears the cache for re-loading.
 *
 * @typeParam T - The type returned by the loader.
 * @param loader - Async factory function to load the asset.
 * @returns A {@link LazyLoader} handle.
 */
export function createLazyLoader<T>(loader: () => Promise<T>): LazyLoader<T> {
  let cache: T | undefined;
  let pending: Promise<T> | undefined;
  let loaded = false;

  function doLoad(): Promise<T> {
    if (cache !== undefined) return Promise.resolve(cache);
    if (pending !== undefined) return pending;

    pending = loader()
      .then((result) => {
        cache = result;
        loaded = true;
        pending = undefined;
        return result;
      })
      .catch((err) => {
        pending = undefined;
        throw err;
      });

    return pending;
  }

  return {
    load: doLoad,
    preload: (): void => {
      void doLoad();
    },
    get isLoaded(): boolean {
      return loaded;
    },
    reset(): void {
      cache = undefined;
      pending = undefined;
      loaded = false;
    },
  };
}

// ── createAssetPreloader ──────────────────────────────────

/**
 * Create a batch preloading utility for named assets.
 *
 * Register loaders by id, then preload all at once or a subset by id.
 * Results are cached per-id so repeated preload calls are no-ops.
 *
 * @returns An {@link AssetPreloader} handle.
 */
export function createAssetPreloader(): AssetPreloader {
  const loaders = new Map<string, () => Promise<unknown>>();
  const results = new Map<string, unknown>();
  const inFlight = new Map<string, Promise<unknown>>();

  async function loadOne(id: string): Promise<unknown> {
    // Return cached result
    if (results.has(id)) return results.get(id);

    // Deduplicate in-flight requests
    if (inFlight.has(id)) return inFlight.get(id);

    const loaderFn = loaders.get(id);
    if (!loaderFn) {
      return Promise.reject(new Error(`No loader registered for asset: ${id}`));
    }

    const promise = loaderFn()
      .then((result) => {
        results.set(id, result);
        inFlight.delete(id);
        return result;
      })
      .catch((err) => {
        inFlight.delete(id);
        throw err;
      });

    inFlight.set(id, promise);
    return promise;
  }

  return {
    add(id: string, loader: () => Promise<unknown>): void {
      loaders.set(id, loader);
    },

    async preloadAll(): Promise<Map<string, unknown>> {
      const ids = Array.from(loaders.keys());
      await Promise.allSettled(ids.map((id) => loadOne(id)));
      return new Map(results);
    },

    async preload(ids: string[]): Promise<Map<string, unknown>> {
      await Promise.allSettled(ids.map((id) => loadOne(id)));
      return new Map(results);
    },

    isPreloaded(id: string): boolean {
      return results.has(id);
    },
  };
}

// ── deferredImport ────────────────────────────────────────

/**
 * Wrap a dynamic `import()` with caching.
 *
 * The module is loaded once on first call; subsequent calls return the
 * cached module. Useful for code-split chunks that are needed multiple times.
 *
 * @typeParam T - The type of the dynamically imported module.
 * @param importFn - A function returning a dynamic import (e.g., `() => import('./heavy')`).
 * @returns A function that returns the cached module promise.
 */
export function deferredImport<T>(importFn: () => Promise<T>): () => Promise<T> {
  let cached: T | undefined;
  let pending: Promise<T> | undefined;

  return (): Promise<T> => {
    if (cached !== undefined) return Promise.resolve(cached);
    if (pending !== undefined) return pending;

    pending = importFn()
      .then((module) => {
        cached = module;
        pending = undefined;
        return module;
      })
      .catch((err) => {
        pending = undefined;
        throw err;
      });

    return pending;
  };
}
