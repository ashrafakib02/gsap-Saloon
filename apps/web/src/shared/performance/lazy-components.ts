import { lazy, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';

/**
 * Options for {@link lazyComponent}.
 */
interface LazyComponentOptions {
  /** Display name for the lazy component (used in React DevTools). */
  displayName?: string;
  /** Fallback element to show while the component loads (for use with SuspenseWrapper). */
  fallback?: ReactNode;
}

/**
 * Creates a lazy-loaded component with optional error boundary integration,
 * displayName, and custom fallback support.
 *
 * The returned component can be used inside a {@link SuspenseWrapper} which
 * will display the specified fallback while loading.
 *
 * @example
 * ```tsx
 * const LazyGallery = lazyComponent(
 *   () => import('./sections/Gallery'),
 *   {
 *     displayName: 'Gallery',
 *     fallback: <SectionSkeleton />,
 *   },
 * );
 *
 * // Use with SectionSuspense:
 * <SectionSuspense name="Gallery">
 *   <LazyGallery />
 * </SectionSuspense>
 * ```
 *
 * @param importFn - Function returning a dynamic import with a default export.
 * @param options - Optional display name and fallback.
 * @returns A lazy-exotic component.
 */
function lazyComponent<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  options?: LazyComponentOptions,
): LazyExoticComponent<T> {
  const LazyLoaded = lazy(importFn);

  if (options?.displayName) {
    // LazyExoticComponent has a $typeof symbol, but displayName is set via
    // Object.defineProperty for custom lazy components
    Object.defineProperty(LazyLoaded, 'displayName', {
      value: options.displayName,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }

  return LazyLoaded;
}

/**
 * Convenience wrapper for lazy-loading page sections.
 * Automatically sets a section-level display name and wraps in Suspense.
 *
 * @example
 * ```tsx
 * const LazyServicesSection = lazySection(
 *   () => import('./sections/Services'),
 *   'Services',
 * );
 * ```
 *
 * @param importFn - Function returning a dynamic import with a default export.
 * @param sectionName - Human-readable section name for debugging.
 * @returns A lazy-exotic component.
 */
function lazySection(
  importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>,
  sectionName: string,
): LazyExoticComponent<ComponentType<Record<string, unknown>>> {
  return lazyComponent(importFn, {
    displayName: `LazySection:${sectionName}`,
  });
}

/**
 * Convenience wrapper for lazy-loading interactive features
 * (booking overlay, 3D scene, gallery lightbox, etc.).
 *
 * @example
 * ```tsx
 * const LazyBookingOverlay = lazyFeature(
 *   () => import('./features/BookingOverlay'),
 *   'BookingOverlay',
 * );
 * ```
 *
 * @param importFn - Function returning a dynamic import with a default export.
 * @param featureName - Human-readable feature name for debugging.
 * @returns A lazy-exotic component.
 */
function lazyFeature(
  importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>,
  featureName: string,
): LazyExoticComponent<ComponentType<Record<string, unknown>>> {
  return lazyComponent(importFn, {
    displayName: `LazyFeature:${featureName}`,
  });
}

/**
 * Triggers the dynamic import to preload a component's bundle.
 * The component itself is not rendered — only the JavaScript chunk is fetched.
 *
 * @example
 * ```ts
 * preloadComponent(() => import('./features/BookingOverlay'));
 * ```
 *
 * @param importFn - Function returning a dynamic import promise.
 */
function preloadComponent(importFn: () => Promise<unknown>): void {
  if (typeof document === 'undefined') return;

  // Fire and forget — browser caches the chunk for later use
  importFn().catch(() => {
    // Preloading is best-effort; swallow errors
  });
}

export type { LazyComponentOptions };
export {
  lazyComponent,
  lazySection,
  lazyFeature,
  preloadComponent,
};
