/**
 * Image Registry — Aspect-ratio-aware image tracking
 *
 * Manages image definitions organized by category, each with enforced
 * aspect ratios per the design system rules:
 *
 *   - Hero:       16:9
 *   - Service:    4:3
 *   - Portrait:   3:4
 *   - Detail:     1:1
 *   - Background: 16:9
 *
 * Images are registered with priority levels that inform loading strategy
 * (high = eager, medium = viewport-based, low = lazy).
 *
 * @example
 * ```ts
 * import { globalImageRegistry, IMAGE_CATEGORY_ASPECTS } from '@/shared/assets';
 *
 * // Register a hero image
 * globalImageRegistry.register({
 *   id: 'hero-salon-interior',
 *   category: 'hero',
 *   aspectRatio: IMAGE_CATEGORY_ASPECTS.hero,
 *   src: '/images/hero/salon-interior.webp',
 *   alt: 'Elegant salon interior with warm lighting',
 *   width: 1920,
 *   height: 1080,
 *   priority: 'high',
 * });
 *
 * // Get all service images
 * const services = globalImageRegistry.getByCategory('service');
 * ```
 */

// ── Types ─────────────────────────────────────────────────

/** Image categories aligned with the design system's aspect ratio rules. */
export type ImageCategory = 'hero' | 'service' | 'portrait' | 'detail' | 'background';

/**
 * Complete definition for a registered image.
 */
export interface ImageDefinition {
  /** Unique identifier for this image */
  id: string;
  /** Category that determines its aspect ratio and loading priority */
  category: ImageCategory;
  /** CSS aspect-ratio value (e.g., '16/9', '4/3') */
  aspectRatio: string;
  /** Image source URL or path */
  src: string;
  /** Accessible alt text */
  alt: string;
  /** Natural width in pixels */
  width: number;
  /** Natural height in pixels */
  height: number;
  /** Loading priority: 'high' (eager), 'medium' (viewport), 'low' (lazy) */
  priority: 'high' | 'medium' | 'low';
  /** Optional base64 or URL placeholder shown during loading */
  placeholder?: string;
}

/** The interface returned by {@link createImageRegistry}. */
export interface ImageRegistry {
  /** Register a new image definition (or overwrite with the same id) */
  register(image: ImageDefinition): void;
  /** Get all images belonging to a specific category */
  getByCategory(category: ImageCategory): ImageDefinition[];
  /** Retrieve a single image by its id */
  getById(id: string): ImageDefinition | undefined;
  /** Preload all images in a category */
  preloadCategory(category: ImageCategory): Promise<void>;
  /** Get all registered images */
  getAll(): ImageDefinition[];
}

// ── Aspect Ratio Constants ────────────────────────────────

/**
 * Canonical aspect ratios per image category.
 *
 * These values are the source of truth and should be used when
 * creating image containers to ensure consistent layouts.
 */
export const IMAGE_CATEGORY_ASPECTS: Record<ImageCategory, string> = {
  hero: '16/9',
  service: '4/3',
  portrait: '3/4',
  detail: '1/1',
  background: '16/9',
};

// ── Factory ───────────────────────────────────────────────

/**
 * Create a new image registry instance.
 *
 * Each instance maintains its own isolated collection of {@link ImageDefinition} objects,
 * indexed by both id and category for fast lookups.
 *
 * @returns A fully-typed {@link ImageRegistry}.
 */
export function createImageRegistry(): ImageRegistry {
  const byId = new Map<string, ImageDefinition>();
  const byCategory = new Map<ImageCategory, ImageDefinition[]>();

  function addToCategory(image: ImageDefinition): void {
    const existing = byCategory.get(image.category) ?? [];
    existing.push(image);
    byCategory.set(image.category, existing);
  }

  function removeFromCategory(image: ImageDefinition): void {
    const existing = byCategory.get(image.category);
    if (!existing) return;
    const idx = existing.findIndex((img) => img.id === image.id);
    if (idx !== -1) existing.splice(idx, 1);
  }

  return {
    register(image: ImageDefinition): void {
      // Remove old entry if overwriting
      const existing = byId.get(image.id);
      if (existing) {
        removeFromCategory(existing);
      }

      byId.set(image.id, { ...image });
      addToCategory(image);
    },

    getByCategory(category: ImageCategory): ImageDefinition[] {
      return (byCategory.get(category) ?? []).map((img) => ({ ...img }));
    },

    getById(id: string): ImageDefinition | undefined {
      const entry = byId.get(id);
      return entry ? { ...entry } : undefined;
    },

    async preloadCategory(category: ImageCategory): Promise<void> {
      if (typeof document === 'undefined') return;

      const images = byCategory.get(category) ?? [];
      const loadPromises = images
        .filter((img) => img.priority === 'high' || img.priority === 'medium')
        .map(
          (img) =>
            new Promise<void>((resolve) => {
              const el = new Image();
              el.onload = () => resolve();
              el.onerror = () => resolve(); // Don't block on failures
              el.src = img.src;
            }),
        );

      await Promise.allSettled(loadPromises);
    },

    getAll(): ImageDefinition[] {
      return Array.from(byId.values()).map((img) => ({ ...img }));
    },
  };
}

// ── Global Singleton ──────────────────────────────────────

/**
 * Global singleton image registry instance.
 *
 * Use this for app-wide image tracking. For isolated contexts
 * (e.g., a feature module), create a fresh instance via {@link createImageRegistry}.
 */
export const globalImageRegistry: ImageRegistry = createImageRegistry();
