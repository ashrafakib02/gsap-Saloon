/**
 * Resource preloading utilities for critical assets.
 * All functions are SSR-safe and check for `typeof document` before DOM manipulation.
 *
 * @module resource-preloading
 */

/** Tag used to identify preloaded resources in the DOM. */
const PRELOAD_DATA_ATTR = 'data-preloaded';

/**
 * Adds a `<link rel="preload" as="image">` to the document head.
 *
 * @example
 * ```ts
 * preloadImage('/images/hero-salon.webp');
 * ```
 *
 * @param src - The image URL to preload.
 * @param _as - The resource type (default 'image').
 */
function preloadImage(src: string, _as: 'image' = 'image'): void {
  if (typeof document === 'undefined') return;
  if (isPreloaded(src)) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.setAttribute(PRELOAD_DATA_ATTR, 'true');
  document.head.appendChild(link);
}

/**
 * Adds a `<link rel="preload" as="font" type="font/woff2" crossorigin>` to preload a font.
 *
 * @example
 * ```ts
 * preloadFont('/fonts/cormorant-garamond.woff2', 'Cormorant Garamond', '400');
 * ```
 *
 * @param src - The font file URL.
 * @param _family - The font family name (for documentation/debugging).
 * @param _weight - The font weight (for documentation/debugging).
 */
function preloadFont(src: string, _family: string, _weight?: string): void {
  if (typeof document === 'undefined') return;
  if (isPreloaded(src)) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = 'font/woff2';
  link.href = src;
  link.crossOrigin = 'anonymous';
  link.setAttribute(PRELOAD_DATA_ATTR, 'true');
  document.head.appendChild(link);
}

/**
 * Adds a `<link rel="preload" as="script">` to preload a script.
 *
 * @example
 * ```ts
 * preloadScript('/scripts/analytics.js');
 * ```
 *
 * @param src - The script URL to preload.
 */
function preloadScript(src: string): void {
  if (typeof document === 'undefined') return;
  if (isPreloaded(src)) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = src;
  link.setAttribute(PRELOAD_DATA_ATTR, 'true');
  document.head.appendChild(link);
}

/**
 * Adds a `<link rel="preload" as="style">` to preload a stylesheet.
 *
 * @example
 * ```ts
 * preloadStylesheet('/styles/critical.css');
 * ```
 *
 * @param src - The stylesheet URL to preload.
 */
function preloadStylesheet(src: string): void {
  if (typeof document === 'undefined') return;
  if (isPreloaded(src)) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = src;
  link.setAttribute(PRELOAD_DATA_ATTR, 'true');
  document.head.appendChild(link);
}

/**
 * Adds a `<link rel="prefetch">` hint for route preloading.
 * Prefetches are low-priority; the browser decides when to fetch.
 *
 * @example
 * ```ts
 * prefetchRoute('/booking');
 * ```
 *
 * @param path - The route URL to prefetch.
 */
function prefetchRoute(path: string): void {
  if (typeof document === 'undefined') return;
  if (isPreloaded(path)) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  link.setAttribute(PRELOAD_DATA_ATTR, 'true');
  document.head.appendChild(link);
}

/**
 * Adds a `<link rel="dns-prefetch">` to resolve a domain's DNS early.
 *
 * @example
 * ```ts
 * dnsPrefetch('https://fonts.googleapis.com');
 * ```
 *
 * @param host - The hostname to prefetch DNS for.
 */
function dnsPrefetch(host: string): void {
  if (typeof document === 'undefined') return;
  if (isPreloaded(host)) return;

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = host;
  link.setAttribute(PRELOAD_DATA_ATTR, 'true');
  document.head.appendChild(link);
}

/**
 * Adds a `<link rel="preconnect">` to establish an early connection to a host.
 *
 * @example
 * ```ts
 * preconnect('https://fonts.gstatic.com');
 * ```
 *
 * @param host - The hostname to preconnect to.
 */
function preconnect(host: string): void {
  if (typeof document === 'undefined') return;
  if (isPreloaded(host)) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = host;
  link.crossOrigin = 'anonymous';
  link.setAttribute(PRELOAD_DATA_ATTR, 'true');
  document.head.appendChild(link);
}

/**
 * Removes a preload link from the document head by its href.
 *
 * @example
 * ```ts
 * removePreload('/images/hero-salon.webp');
 * ```
 *
 * @param href - The href of the preload link to remove.
 */
function removePreload(href: string): void {
  if (typeof document === 'undefined') return;

  const links = document.querySelectorAll<HTMLLinkElement>(
    `link[data-preloaded][href="${href}"]`,
  );
  links.forEach((link) => link.remove());
}

/**
 * Returns a list of all currently preloaded resource hrefs.
 *
 * @example
 * ```ts
 * const resources = getPreloadedResources();
 * console.log(resources); // ['/fonts/cormorant.woff2', '/images/hero.webp']
 * ```
 *
 * @returns Array of preloaded resource hrefs.
 */
function getPreloadedResources(): string[] {
  if (typeof document === 'undefined') return [];

  const links = document.querySelectorAll<HTMLLinkElement>(
    `link[data-preloaded]`,
  );
  return Array.from(links).map((link) => link.href);
}

/**
 * Checks if a resource with the given href has already been preloaded.
 *
 * @param href - The resource href to check.
 * @returns Whether the resource is already preloaded.
 */
function isPreloaded(href: string): boolean {
  if (typeof document === 'undefined') return false;

  return document.querySelector(`link[href="${href}"]`) !== null;
}

export {
  preloadImage,
  preloadFont,
  preloadScript,
  preloadStylesheet,
  prefetchRoute,
  dnsPrefetch,
  preconnect,
  removePreload,
  getPreloadedResources,
  isPreloaded,
};
