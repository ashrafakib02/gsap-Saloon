/**
 * Asset Loading Utilities
 *
 * SSR-safe functions for loading images and fonts in the browser.
 * All DOM-touching functions return safe defaults when `document` is unavailable.
 *
 * @example
 * ```ts
 * // Load a single image with timeout
 * const img = await loadImage('/images/hero.webp', {
 *   onLoad: () => console.log('Hero image ready'),
 *   onError: (err) => console.error(err),
 *   timeout: 5000,
 * });
 *
 * // Preload critical fonts
 * await preloadFonts([
 *   { family: 'Cormorant Garamond', source: '/fonts/cormorant-garamond-regular.woff2' },
 *   { family: 'DM Sans', source: '/fonts/dm-sans-regular.woff2' },
 * ]);
 * ```
 */

// ── Options Types ─────────────────────────────────────────

/** Options for {@link loadImage}. */
export interface LoadImageOptions {
  /** Callback fired when the image loads successfully */
  onLoad?: () => void;
  /** Callback fired when the image fails to load */
  onError?: (e: Error) => void;
  /** Maximum time in ms to wait before rejecting. Default: 10000 */
  timeout?: number;
}

/** Options for {@link loadFont}. */
export interface LoadFontOptions {
  /** Font weight string (e.g., '400', '700'). Default: '400' */
  weight?: string;
  /** Font style (e.g., 'normal', 'italic'). Default: 'normal' */
  style?: string;
}

/** A preloadable font descriptor. */
export interface FontPreloadDescriptor {
  /** Font family name (e.g., 'Cormorant Garamond') */
  family: string;
  /** URL or path to the font file */
  source: string;
}

/** Result of {@link getImageDimensions}. */
export interface ImageDimensions {
  /** Natural width of the image in pixels */
  width: number;
  /** Natural height of the image in pixels */
  height: number;
}

/** Handle returned by {@link createImageLoader}. */
export interface ImageLoaderHandle {
  /** Promise that resolves with the loaded HTMLImageElement */
  promise: Promise<HTMLImageElement>;
  /** Cancel the in-flight request */
  abort: () => void;
}

// ── Constants ─────────────────────────────────────────────

/** Default timeout for image loading (10 seconds). */
const DEFAULT_IMAGE_TIMEOUT = 10_000;

// ── Image Loading ─────────────────────────────────────────

/**
 * Load a single image element from a source URL.
 *
 * Returns a Promise that resolves with the loaded `HTMLImageElement`
 * or rejects on error / timeout.
 *
 * @param src - The image source URL or path.
 * @param options - Optional callbacks and timeout.
 * @returns The loaded `HTMLImageElement`.
 * @throws On timeout or load failure.
 */
export function loadImage(
  src: string,
  options: LoadImageOptions = {},
): Promise<HTMLImageElement> {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('loadImage is not available in SSR'));
  }

  const { onLoad, onError, timeout = DEFAULT_IMAGE_TIMEOUT } = options;

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    const timer = setTimeout(() => {
      img.src = '';
      reject(new Error(`Image load timed out after ${timeout}ms: ${src}`));
    }, timeout);

    img.onload = () => {
      clearTimeout(timer);
      onLoad?.();
      resolve(img);
    };

    img.onerror = () => {
      clearTimeout(timer);
      const error = new Error(`Failed to load image: ${src}`);
      onError?.(error);
      reject(error);
    };

    img.src = src;
  });
}

/**
 * Preload multiple images in parallel.
 *
 * @param srcs - Array of image source URLs.
 * @returns Array of loaded `HTMLImageElement` objects (in the same order as inputs).
 */
export function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map((src) => loadImage(src)));
}

/**
 * Get the natural dimensions of an image without rendering it.
 *
 * @param src - The image source URL or path.
 * @returns Object with `width` and `height` in pixels.
 */
export function getImageDimensions(src: string): Promise<ImageDimensions> {
  return loadImage(src).then((img) => ({
    width: img.naturalWidth,
    height: img.naturalHeight,
  }));
}

/**
 * Create an abortable image loader using `AbortController`.
 *
 * Useful for speculative loading that may be cancelled (e.g., on route change).
 *
 * @param src - The image source URL or path.
 * @returns An object with the loading `promise` and an `abort` function.
 *
 * @example
 * ```ts
 * const { promise, abort } = createImageLoader('/images/large-photo.webp');
 *
 * // Cancel if the user navigates away
 * onRouteChange(() => abort());
 *
 * const img = await promise;
 * ```
 */
export function createImageLoader(src: string): ImageLoaderHandle {
  if (typeof document === 'undefined') {
    const noop = (): void => {};
    return {
      promise: Promise.reject(new Error('createImageLoader is not available in SSR')),
      abort: noop,
    };
  }

  let aborted = false;
  let abortFn: () => void = () => {
    aborted = true;
  };

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    abortFn = () => {
      aborted = true;
      img.src = '';
      reject(new Error(`Image load aborted: ${src}`));
    };

    img.onload = () => {
      if (!aborted) resolve(img);
    };

    img.onerror = () => {
      if (!aborted) reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });

  return { promise, abort: abortFn };
}

// ── Font Loading ──────────────────────────────────────────

/**
 * Load a single font using the Font Loading API.
 *
 * @param family - Font family name (e.g., 'Cormorant Garamond').
 * @param source - URL or path to the font file.
 * @param options - Optional weight and style.
 * @returns The loaded `FontFace` object.
 * @throws If the Font Loading API is unavailable or the font fails to load.
 */
export function loadFont(
  family: string,
  source: string,
  options: LoadFontOptions = {},
): Promise<FontFace> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return Promise.reject(
      new Error('Font Loading API is not available in this environment'),
    );
  }

  const { weight = '400', style = 'normal' } = options;

  const fontFace = new FontFace(family, `url(${source})`, {
    weight,
    style,
    display: 'swap',
  });

  return fontFace.load().then((loaded) => {
    document.fonts.add(loaded);
    return loaded;
  });
}

/**
 * Preload multiple fonts in parallel.
 *
 * @param fonts - Array of font descriptors with `family` and `source`.
 * @returns Array of loaded `FontFace` objects.
 */
export function preloadFonts(fonts: FontPreloadDescriptor[]): Promise<FontFace[]> {
  return Promise.all(
    fonts.map((f) => loadFont(f.family, f.source)),
  );
}
