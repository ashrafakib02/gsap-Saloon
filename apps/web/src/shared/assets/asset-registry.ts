/**
 * Asset Registry — Central tracking for all project assets
 *
 * Provides a generic, type-safe registry for tracking assets across
 * images, fonts, icons, videos, and 3D models. Each registry instance
 * maintains its own isolated Map of AssetEntry objects.
 *
 * @example
 * ```ts
 * // Register a font entry
 * globalAssetRegistry.register({
 *   id: 'cormorant-regular',
 *   type: 'font',
 *   src: '/fonts/cormorant-garamond-regular.woff2',
 *   metadata: { weight: 400, style: 'normal' },
 * });
 *
 * // Check if loaded
 * const entry = globalAssetRegistry.get('cormorant-regular');
 *
 * // Preload specific assets
 * await globalAssetRegistry.preload(['cormorant-regular', 'dm-sans-regular']);
 * ```
 */

// ── Types ─────────────────────────────────────────────────

/** Supported asset categories in the design system. */
export type AssetType = 'image' | 'font' | 'icon' | 'video' | '3d';

/**
 * A single tracked asset entry in the registry.
 *
 * @typeParam T - Shape of the optional metadata object.
 */
export interface AssetEntry<T = Record<string, unknown>> {
  /** Unique identifier for this asset (e.g., 'hero-main', 'cormorant-regular') */
  id: string;
  /** Category of the asset */
  type: AssetType;
  /** Source path or URL */
  src: string;
  /** Arbitrary metadata (weight, dimensions, description, etc.) */
  metadata?: T;
  /** Whether the asset has been fully loaded into the browser */
  loaded?: boolean;
}

/** The interface returned by {@link createAssetRegistry}. */
export interface AssetRegistry<T = Record<string, unknown>> {
  /** Register a new asset entry (or overwrite an existing one with the same id) */
  register(entry: AssetEntry<T>): void;
  /** Retrieve an entry by its id, or undefined if not found */
  get(id: string): AssetEntry<T> | undefined;
  /** Get all entries, optionally filtered by asset type */
  getAll(type?: AssetType): AssetEntry<T>[];
  /** Remove an entry by id. Returns true if removed, false if not found */
  remove(id: string): boolean;
  /** Check whether an entry with the given id exists */
  has(id: string): boolean;
  /** Preload multiple assets by id (marks them as loaded on completion) */
  preload(ids: string[]): Promise<void>;
  /** Remove all entries from the registry */
  clear(): void;
}

// ── Factory ───────────────────────────────────────────────

/**
 * Create a new asset registry instance.
 *
 * Each instance maintains its own isolated `Map<string, AssetEntry>`.
 * The generic parameter `T` controls the shape of the `metadata` field.
 *
 * @typeParam T - Shape of the optional metadata object (default: `Record<string, unknown>`).
 * @returns A fully-typed {@link AssetRegistry}.
 */
export function createAssetRegistry<T = Record<string, unknown>>(): AssetRegistry<T> {
  const store = new Map<string, AssetEntry<T>>();

  return {
    register(entry: AssetEntry<T>): void {
      store.set(entry.id, { ...entry });
    },

    get(id: string): AssetEntry<T> | undefined {
      const entry = store.get(id);
      return entry ? { ...entry } : undefined;
    },

    getAll(type?: AssetType): AssetEntry<T>[] {
      const entries = Array.from(store.values());
      if (type === undefined) return entries;
      return entries.filter((e) => e.type === type);
    },

    remove(id: string): boolean {
      return store.delete(id);
    },

    has(id: string): boolean {
      return store.has(id);
    },

    async preload(ids: string[]): Promise<void> {
      if (typeof document === 'undefined') return;

      const loaders = ids
        .map((id) => store.get(id))
        .filter((entry): entry is AssetEntry<T> => entry !== undefined)
        .map(async (entry) => {
          try {
            if (entry.type === 'image') {
              const img = new Image();
              await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error(`Failed to load image: ${entry.src}`));
                img.src = entry.src;
              });
            } else if (entry.type === 'font' && 'fonts' in document) {
              const response = await fetch(entry.src);
              const buffer = await response.arrayBuffer();
              const fontFace = new FontFace(entry.id, buffer);
              await fontFace.load();
              document.fonts.add(fontFace);
            }
            entry.loaded = true;
          } catch {
            // Silently skip failed preloads — don't block other assets
          }
        });

      await Promise.allSettled(loaders);
    },

    clear(): void {
      store.clear();
    },
  };
}

// ── Global Singleton ──────────────────────────────────────

/**
 * Global singleton asset registry instance.
 *
 * Use this for app-wide asset tracking. For isolated contexts
 * (e.g., a feature module), create a fresh instance via {@link createAssetRegistry}.
 */
export const globalAssetRegistry: AssetRegistry = createAssetRegistry();
