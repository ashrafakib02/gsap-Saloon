/**
 * Asset Types — Core Type System for Asset Pipeline Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module defines the complete type system for the asset pipeline —
 * the infrastructure that manages asset registration, lifecycle tracking,
 * dependency graphs, cache metadata, and bundle coordination. It stores
 * metadata and orchestrates asset STATE only; it never loads, decodes,
 * fetches, or parses any assets.
 *
 * Architecture:
 *   AssetOptions (consumer input) → AssetDefinition (resolved)
 *   → AssetState (runtime) → AssetSnapshot (immutable)
 *   → AssetManager (registration + lifecycle)
 *   → AssetRegistry (read-only queries)
 *
 * Consumers (future): Scene assets, camera textures, lighting HDRIs,
 * materials textures, environment maps, post-processing LUTs, audio.
 *
 * Phase 6.7: Asset Pipeline — infrastructure only, no loading.
 */

import type { QualityPreset } from './three.types';

// ── Asset State ───────────────────────────────────────────

/**
 * Lifecycle states for an asset definition.
 *
 * Tracks registration through disposal. The manager validates transitions.
 * No runtime transitions are implemented yet — states are set during
 * registration only.
 */
export const ASSET_STATES = [
  /** Registered, awaiting future loading */
  'registered',
  /** Queued for loading (future) */
  'queued',
  /** Currently loading (future) */
  'loading',
  /** Loaded but not yet ready for use */
  'loaded',
  /** Ready for consumption by downstream systems */
  'ready',
  /** Loading failed (future) */
  'failed',
  /** Disposed, no longer tracked */
  'disposed',
] as const;

/** Type-safe union of asset states. */
export type AssetState = (typeof ASSET_STATES)[number];

// ── Asset Category ────────────────────────────────────────

/**
 * Asset categories define the broad class of an asset.
 *
 * Each category represents a type of asset that may be loaded
 * in a future phase. Only metadata is stored here — no actual
 * assets are loaded.
 */
export const ASSET_CATEGORIES = [
  /** 3D models (GLTF, GLB, OBJ) */
  'models',
  /** Image textures (PNG, JPG, AVIF, WebP) */
  'textures',
  /** Material definitions */
  'materials',
  /** Environment maps (HDR, EXR) */
  'environment',
  /** Audio files */
  'audio',
  /** Animation clips */
  'animations',
  /** Font files (woff2, woff) */
  'fonts',
  /** Video files */
  'videos',
  /** UI assets (icons, overlays) */
  'ui',
  /** Icon assets (SVG, icon fonts) */
  'icons',
  /** Debug helpers (wireframe, axes, grid) */
  'debug',
  /** Future custom asset types */
  'future-custom',
] as const;

/** Type-safe union of asset categories. */
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

// ── Asset Category ID ─────────────────────────────────────

/**
 * Type-safe asset category identifier for Map keys.
 */
export type AssetCategoryId = AssetCategory;

// ── Asset Priority ────────────────────────────────────────

/**
 * Asset priority levels for resource allocation and loading order.
 *
 * Higher priority assets receive bandwidth and memory first.
 */
export const ASSET_PRIORITIES = [
  /** Critical — must load before any rendering */
  'critical',
  /** High — should load quickly, needed soon */
  'high',
  /** Normal — standard loading priority */
  'normal',
  /** Low — can wait, background loading */
  'low',
  /** Background — load when idle, no urgency */
  'background',
  /** Idle — load only when nothing else needs loading */
  'idle',
] as const;

/** Type-safe union of asset priorities. */
export type AssetPriority = (typeof ASSET_PRIORITIES)[number];

// ── Asset Group ID ────────────────────────────────────────

/**
 * Asset group identifiers for bundle organization.
 *
 * Groups correspond to narrative sections and global asset bundles.
 */
export const ASSET_GROUP_IDS = [
  /** Hero scene assets */
  'hero',
  /** Intro/prologue assets */
  'intro',
  /** Services section assets */
  'services',
  /** Gallery section assets */
  'gallery',
  /** Booking section assets */
  'booking',
  /** Footer section assets */
  'footer',
  /** Global/shared assets (always loaded) */
  'global',
  /** Debug/development assets */
  'debug',
] as const;

/** Type-safe union of asset group IDs. */
export type AssetGroupId = (typeof ASSET_GROUP_IDS)[number];

// ── Asset ID ──────────────────────────────────────────────

/**
 * Type-safe asset identifier for Map keys.
 * Assets are identified by unique string IDs.
 */
export type AssetId = string;

// ── Asset Format ──────────────────────────────────────────

/**
 * Future asset format identifiers for loader selection.
 */
export type AssetFormat = string;

// ── Compression Type ──────────────────────────────────────

/**
 * Compression types for cache metadata.
 */
export const COMPRESSION_TYPES = [
  /** No compression */
  'none',
  /** Draco mesh compression */
  'draco',
  /** KTX2 texture compression */
  'ktx2',
  /** Meshopt compression */
  'meshopt',
  /** Basis Universal texture compression */
  'basis',
  /** gzip */
  'gzip',
  /** brotli */
  'brotli',
] as const;

/** Type-safe union of compression types. */
export type CompressionType = (typeof COMPRESSION_TYPES)[number];

// ── Options (Consumer Input) ──────────────────────────────

/**
 * Consumer-facing options for registering an asset.
 *
 * All fields except `id` are optional — sensible defaults come from
 * the asset constants and the active quality preset.
 */
export interface AssetOptions {
  /** Unique asset identifier. */
  readonly id: AssetId;
  /** Human-readable label. */
  readonly label?: string;
  /** Asset source path or URL (metadata only, no loading). */
  readonly src?: string;
  /** Asset category. */
  readonly category?: AssetCategory;
  /** Asset priority level. */
  readonly priority?: AssetPriority;
  /** Asset group. */
  readonly group?: AssetGroupId;
  /** Estimated file size in bytes. */
  readonly estimatedSize?: number;
  /** Estimated memory footprint in bytes after decode. */
  readonly estimatedMemory?: number;
  /** Asset format (file extension or MIME type). */
  readonly format?: AssetFormat;
  /** Width in pixels (for images/textures). */
  readonly width?: number;
  /** Height in pixels (for images/textures). */
  readonly height?: number;
  /** Whether the asset is initially enabled. */
  readonly enabled?: boolean;
  /** Dependencies on other asset IDs. */
  readonly dependencies?: readonly AssetId[];
  /** Bundle IDs this asset belongs to. */
  readonly bundles?: readonly AssetGroupId[];
  /** Scene IDs this asset is associated with. */
  readonly scenes?: readonly string[];
  /** Camera preset IDs this asset is associated with. */
  readonly cameras?: readonly string[];
  /** Environment preset IDs this asset is associated with. */
  readonly environments?: readonly string[];
  /** Loader hint for future loading phase. */
  readonly loaderHint?: string;
  /** Custom metadata for future systems. */
  readonly metadata?: Readonly<Record<string, unknown>>;
}

// ── Definition (Resolved) ─────────────────────────────────

/**
 * Complete internal definition of an asset.
 *
 * Derived from {@link AssetOptions} with all defaults resolved.
 * Immutable — the manager replaces this on re-registration.
 */
export interface AssetDefinition {
  /** Unique asset identifier. */
  readonly id: AssetId;
  /** Human-readable label. */
  readonly label: string;
  /** Asset source path or URL. */
  readonly src: string;
  /** Asset category. */
  readonly category: AssetCategory;
  /** Asset priority level. */
  readonly priority: AssetPriority;
  /** Asset group. */
  readonly group: AssetGroupId;
  /** Estimated file size in bytes. */
  readonly estimatedSize: number;
  /** Estimated memory footprint in bytes after decode. */
  readonly estimatedMemory: number;
  /** Asset format. */
  readonly format: AssetFormat;
  /** Width in pixels. */
  readonly width: number;
  /** Height in pixels. */
  readonly height: number;
  /** Whether the asset is enabled. */
  readonly enabled: boolean;
  /** Dependencies on other asset IDs. */
  readonly dependencies: readonly AssetId[];
  /** Bundle IDs this asset belongs to. */
  readonly bundles: readonly AssetGroupId[];
  /** Scene IDs this asset is associated with. */
  readonly scenes: readonly string[];
  /** Camera preset IDs this asset is associated with. */
  readonly cameras: readonly string[];
  /** Environment preset IDs this asset is associated with. */
  readonly environments: readonly string[];
  /** Loader hint for future loading phase. */
  readonly loaderHint: string;
  /** Custom metadata. */
  readonly metadata: Readonly<Record<string, unknown>>;
}

// ── Bundle Definition ─────────────────────────────────────

/**
 * A bundle groups related assets that should be loaded together.
 *
 * Bundles correspond to narrative sections (hero, services, gallery, etc.)
 * or global/shared assets.
 */
export interface AssetBundleOptions {
  /** Unique bundle identifier. */
  readonly id: AssetGroupId;
  /** Human-readable label. */
  readonly label?: string;
  /** Whether the bundle is initially enabled. */
  readonly enabled?: boolean;
  /** Maximum allowed concurrent loads within this bundle. */
  readonly maxConcurrent?: number;
  /** Whether this bundle is a priority bundle (loads regardless of scroll position). */
  readonly isPriority?: boolean;
}

/**
 * Complete internal definition of an asset bundle.
 */
export interface AssetBundleDefinition {
  /** Unique bundle identifier. */
  readonly id: AssetGroupId;
  /** Human-readable label. */
  readonly label: string;
  /** Whether the bundle is enabled. */
  readonly enabled: boolean;
  /** Maximum allowed concurrent loads within this bundle. */
  readonly maxConcurrent: number;
  /** Whether this bundle is a priority bundle. */
  readonly isPriority: boolean;
  /** Asset IDs in this bundle (derived from asset definitions). */
  readonly assetIds: readonly AssetId[];
}

// ── Bundle State (Runtime) ────────────────────────────────

/**
 * Runtime state for an asset bundle.
 */
export interface AssetBundleState {
  /** Bundle identifier. */
  readonly id: AssetGroupId;
  /** Whether the bundle is enabled. */
  readonly enabled: boolean;
  /** Whether this bundle is a priority bundle. */
  readonly isPriority: boolean;
  /** Total assets in this bundle. */
  readonly totalAssets: number;
  /** Assets that have been loaded. */
  readonly loadedCount: number;
  /** Assets currently loading. */
  readonly loadingCount: number;
  /** Assets that failed to load. */
  readonly failedCount: number;
  /** Overall bundle progress (0-1). */
  readonly progress: number;
}

// ── Asset State (Runtime) ─────────────────────────────────

/**
 * Runtime state for a single asset definition.
 *
 * Immutable per snapshot — the manager replaces the object on change.
 */
export interface AssetRuntimeState {
  /** Asset identifier. */
  readonly id: AssetId;
  /** Current lifecycle state. */
  readonly state: AssetState;
  /** Whether this asset is enabled. */
  readonly enabled: boolean;
  /** Whether this asset has been registered. */
  readonly isRegistered: boolean;
  /** Loading progress (0-1). */
  readonly progress: number;
  /** Number of dependents (assets that depend on this one). */
  readonly dependentsCount: number;
  /** Whether all dependencies are met. */
  readonly dependenciesMet: boolean;
  /** Timestamp of last state change. */
  readonly lastChange: number;
  /** Error message if state is 'failed'. */
  readonly error: string | null;
}

// ── Dependency Node ───────────────────────────────────────

/**
 * A node in the asset dependency graph.
 */
export interface AssetDependencyNode {
  /** The asset this node represents. */
  readonly assetId: AssetId;
  /** Assets this asset depends on (must load first). */
  readonly dependsOn: readonly AssetId[];
  /** Assets that depend on this asset. */
  readonly dependedOnBy: readonly AssetId[];
}

// ── Dependency Graph ──────────────────────────────────────

/**
 * The complete asset dependency graph.
 *
 * Metadata only — no resolution or loading occurs.
 */
export interface AssetDependencyGraph {
  /** All dependency nodes, keyed by asset ID. */
  readonly nodes: ReadonlyMap<AssetId, AssetDependencyNode>;
  /** Whether any circular dependencies exist. */
  readonly hasCircularDependencies: boolean;
  /** Topologically sorted asset IDs (respecting dependencies). */
  readonly sortedOrder: readonly AssetId[];
  /** Timestamp of last graph computation. */
  readonly timestamp: number;
}

// ── Cache Entry ───────────────────────────────────────────

/**
 * Cache metadata for a loaded asset.
 *
 * Metadata only — no browser cache, no IndexedDB, no Service Worker.
 */
export interface AssetCacheEntry {
  /** Asset identifier. */
  readonly assetId: AssetId;
  /** Cache key (unique identifier for the cached version). */
  readonly cacheKey: string;
  /** Version string for cache invalidation. */
  readonly version: string;
  /** Content hash for integrity checking. */
  readonly hash: string;
  /** Estimated memory footprint in bytes. */
  readonly memoryEstimate: number;
  /** Compression type used. */
  readonly compression: CompressionType;
  /** Whether this asset should remain in memory (not evictable). */
  readonly resident: boolean;
  /** Timestamp of last access. */
  readonly lastAccess: number;
  /** Number of active references to this cache entry. */
  readonly referenceCount: number;
}

// ── Quality Profile ───────────────────────────────────────

/**
 * Quality-adapted asset settings.
 *
 * Derived from the active quality preset. Determines maximum
 * asset resolution, concurrent load limits, and feature availability.
 */
export interface AssetQualityProfile {
  /** Active quality preset. */
  readonly preset: QualityPreset;
  /** Maximum texture resolution in pixels (longest edge). */
  readonly maxTextureSize: number;
  /** Maximum model polygon count. */
  readonly maxPolygonCount: number;
  /** Maximum simultaneous asset loads. */
  readonly maxConcurrentLoads: number;
  /** Maximum total asset memory in megabytes. */
  readonly maxTotalMemoryMB: number;
  /** Whether high-resolution textures are enabled. */
  readonly highResTexturesEnabled: boolean;
  /** Whether animation clips are loaded. */
  readonly animationsEnabled: boolean;
  /** Whether audio assets are loaded. */
  readonly audioEnabled: boolean;
  /** Whether video assets are loaded. */
  readonly videoEnabled: boolean;
  /** Whether debug assets are loaded. */
  readonly debugAssetsEnabled: boolean;
}

// ── Constraints ───────────────────────────────────────────

/**
 * Boundary constraints for asset pipeline configuration.
 */
export interface AssetConstraints {
  /** Maximum number of registered assets. */
  readonly maxAssets: number;
  /** Maximum total memory budget in megabytes. */
  readonly maxMemoryBudgetMB: number;
  /** Maximum single asset size in megabytes. */
  readonly maxSingleAssetSizeMB: number;
  /** Maximum dependency depth (chains of dependencies). */
  readonly maxDependencyDepth: number;
  /** Maximum assets in a single bundle. */
  readonly maxAssetsPerBundle: number;
  /** Maximum number of bundles. */
  readonly maxBundles: number;
}

// ── Snapshot ──────────────────────────────────────────────

/**
 * The complete immutable snapshot of asset pipeline state.
 *
 * This is the single source of truth consumed by all asset hooks.
 * The manager replaces this object wholesale on every change so that
 * `Object.is` reference checks detect updates cheaply.
 */
export interface AssetSnapshot {
  /** Asset runtime state, keyed by asset ID. */
  readonly assets: ReadonlyMap<AssetId, AssetRuntimeState>;
  /** Bundle runtime state, keyed by bundle ID. */
  readonly bundles: ReadonlyMap<AssetGroupId, AssetBundleState>;
  /** Category state — asset counts per category. */
  readonly categories: ReadonlyMap<AssetCategoryId, AssetCategoryState>;
  /** The dependency graph. */
  readonly dependencyGraph: AssetDependencyGraph;
  /** Cache entries, keyed by asset ID. */
  readonly cacheEntries: ReadonlyMap<AssetId, AssetCacheEntry>;
  /** Quality-adapted asset settings. */
  readonly qualityProfile: AssetQualityProfile;
  /** Asset constraints. */
  readonly constraints: AssetConstraints;
  /** Whether reduced motion is active. */
  readonly isReducedMotion: boolean;
  /** Active quality preset (mirrors ThreeContext). */
  readonly qualityPreset: QualityPreset;
  /** Total registered asset count. */
  readonly assetCount: number;
  /** Total registered bundle count. */
  readonly bundleCount: number;
  /** Total loaded asset count. */
  readonly loadedCount: number;
  /** Total loading asset count. */
  readonly loadingCount: number;
  /** Total failed asset count. */
  readonly failedCount: number;
  /** Total estimated memory in bytes. */
  readonly totalEstimatedMemory: number;
  /** Monotonic revision counter — increments on every change. */
  readonly revision: number;
  /** Timestamp of the last snapshot update. */
  readonly timestamp: number;
}

// ── Category State ────────────────────────────────────────

/**
 * Runtime state for a single asset category.
 *
 * Tracks the number of assets registered in each category.
 */
export interface AssetCategoryState {
  /** Category identifier. */
  readonly id: AssetCategoryId;
  /** Whether the category is enabled. */
  readonly enabled: boolean;
  /** Number of assets registered in this category. */
  readonly assetCount: number;
}

// ── Registry ──────────────────────────────────────────────

/**
 * Read-only query interface over the asset registries.
 *
 * Mirrors the scene/camera/lighting/materials/environment registry pattern
 * — pure lookups, no mutation.
 */
export interface AssetRegistry {
  /** Get an asset's runtime state by ID. */
  readonly getAsset: (id: AssetId) => AssetRuntimeState | undefined;
  /** Get a bundle's runtime state by ID. */
  readonly getBundle: (id: AssetGroupId) => AssetBundleState | undefined;
  /** Get a category's state by ID. */
  readonly getCategory: (id: AssetCategoryId) => AssetCategoryState | undefined;
  /** All registered asset IDs. */
  readonly getAssetIds: () => readonly AssetId[];
  /** All registered bundle IDs. */
  readonly getBundleIds: () => readonly AssetGroupId[];
  /** All registered category IDs. */
  readonly getCategoryIds: () => readonly AssetCategoryId[];
  /** Whether an asset is registered. */
  readonly hasAsset: (id: AssetId) => boolean;
  /** Whether a bundle is registered. */
  readonly hasBundle: (id: AssetGroupId) => boolean;
  /** Whether a category is registered. */
  readonly hasCategory: (id: AssetCategoryId) => boolean;
  /** Total registered asset count. */
  readonly assetCount: () => number;
  /** Total registered bundle count. */
  readonly bundleCount: () => number;
  /** Total registered category count. */
  readonly categoryCount: () => number;
  /** Get all enabled assets. */
  readonly getEnabledAssets: () => readonly AssetId[];
  /** Get all assets in a bundle. */
  readonly getAssetsInBundle: (bundleId: AssetGroupId) => readonly AssetId[];
  /** Get all assets of a category. */
  readonly getAssetsByCategory: (category: AssetCategoryId) => readonly AssetId[];
  /** Get all assets of a priority. */
  readonly getAssetsByPriority: (priority: AssetPriority) => readonly AssetId[];
  /** Get all assets for a scene. */
  readonly getAssetsForScene: (sceneId: string) => readonly AssetId[];
  /** Get the dependency graph. */
  readonly getDependencyGraph: () => AssetDependencyGraph;
  /** Get all cache entries. */
  readonly getCacheEntries: () => readonly AssetCacheEntry[];
}

// ── Subscription Types ────────────────────────────────────

/** Selector that extracts a slice of the asset snapshot. */
export type AssetSelector<T> = (snapshot: AssetSnapshot) => T;

/** Equality comparator for a selected asset value. */
export type AssetEquality<T> = (a: T, b: T) => boolean;

/** Subscriber callback fired on relevant asset state changes. */
export type AssetCallback = () => void;

/** Unsubscribe handle returned by subscription methods. */
export type AssetUnsubscribe = () => void;

// ── Manager ───────────────────────────────────────────────

/**
 * The singleton asset pipeline manager interface.
 *
 * This is the single owner of all asset state. All hooks and future
 * consumers read from this instance. It contains no React.
 */
export interface AssetManager {
  /** Get the current immutable snapshot. */
  readonly getSnapshot: () => AssetSnapshot;
  /** Subscribe to all asset state changes. */
  readonly subscribe: (callback: AssetCallback) => AssetUnsubscribe;
  /** Subscribe to a specific slice of asset state. */
  readonly subscribeSelector: <T>(
    selector: AssetSelector<T>,
    callback: AssetCallback,
    equalityFn?: AssetEquality<T>,
  ) => AssetUnsubscribe;
  /** Whether the manager has been initialized. */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — registers default categories, groups, and bundles. */
  readonly init: () => void;
  /** Destroy the manager — clears everything, resets state. */
  readonly destroy: () => void;

  /* ── Asset management ── */
  /** Register an asset (idempotent by ID). */
  readonly registerAsset: (options: AssetOptions) => void;
  /** Unregister an asset. */
  readonly unregisterAsset: (id: AssetId) => void;
  /** Get an asset definition by ID. */
  readonly getAssetDefinition: (id: AssetId) => AssetDefinition | undefined;
  /** Get all asset definitions. */
  readonly getAllAssetDefinitions: () => readonly AssetDefinition[];
  /** Whether an asset is registered. */
  readonly hasAsset: (id: AssetId) => boolean;
  /** Set the state of an asset. */
  readonly setAssetState: (id: AssetId, state: AssetState) => void;
  /** Set the loading progress of an asset. */
  readonly setAssetProgress: (id: AssetId, progress: number) => void;
  /** Mark an asset as failed with an error message. */
  readonly setAssetError: (id: AssetId, error: string) => void;

  /* ── Bundle management ── */
  /** Register a bundle (idempotent by ID). */
  readonly registerBundle: (options: AssetBundleOptions) => void;
  /** Unregister a bundle. */
  readonly unregisterBundle: (id: AssetGroupId) => void;
  /** Get a bundle definition by ID. */
  readonly getBundleDefinition: (id: AssetGroupId) => AssetBundleDefinition | undefined;
  /** Whether a bundle is registered. */
  readonly hasBundle: (id: AssetGroupId) => boolean;

  /* ── Category management ── */
  /** Whether a category is registered. */
  readonly hasCategory: (id: AssetCategoryId) => boolean;

  /* ── Dependency graph ── */
  /** Get the dependency graph. */
  readonly getDependencyGraph: () => AssetDependencyGraph;
  /** Get dependencies for an asset. */
  readonly getDependencies: (id: AssetId) => readonly AssetId[];
  /** Get dependents for an asset (assets that depend on it). */
  readonly getDependents: (id: AssetId) => readonly AssetId[];

  /* ── Cache ── */
  /** Get a cache entry for an asset. */
  readonly getCacheEntry: (id: AssetId) => AssetCacheEntry | undefined;
  /** Set a cache entry for an asset. */
  readonly setCacheEntry: (id: AssetId, entry: AssetCacheEntry) => void;
  /** Remove a cache entry for an asset. */
  readonly removeCacheEntry: (id: AssetId) => void;

  /* ── Quality / Reduced Motion ── */
  /** Update the quality preset. */
  readonly setQualityPreset: (preset: QualityPreset) => void;
  /** Update reduced-motion state. */
  readonly setReducedMotion: (reduced: boolean) => void;

  /* ── Query ── */
  /** Get the read-only registry query interface. */
  readonly getRegistry: () => AssetRegistry;
}
