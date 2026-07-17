/**
 * Asset Constants — Defaults, Descriptions, and Quality Profiles
 *
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Quality scales with the device. Never ship a single fixed budget."
 *
 * This module declares the static tables that the asset pipeline
 * derives from: default snapshots, quality profiles, constraints,
 * and human-readable descriptions. All values are frozen — nothing
 * here mutates at runtime.
 *
 * Phase 6.7: Asset Pipeline — infrastructure only.
 */

import type {
  AssetState,
  AssetCategory,
  AssetPriority,
  AssetGroupId,
  AssetCategoryId,
  AssetQualityProfile,
  AssetConstraints,
  AssetSnapshot,
  AssetDependencyGraph,
} from './asset.types';

import {
  ASSET_STATES,
  ASSET_CATEGORIES,
  ASSET_PRIORITIES,
} from './asset.types';

import type { QualityPreset } from './three.types';

/* -------------------------------------------------------------------------- */
/*                            Description Records                             */
/* -------------------------------------------------------------------------- */

/** Human-readable descriptions for each asset state. */
export const ASSET_STATE_DESCRIPTIONS: Record<AssetState, string> = {
  registered: 'Registered, awaiting future loading',
  queued: 'Queued for loading',
  loading: 'Currently loading',
  loaded: 'Loaded but not yet ready for use',
  ready: 'Ready for consumption by downstream systems',
  failed: 'Loading failed',
  disposed: 'Disposed, no longer tracked',
};

/** Human-readable descriptions for each asset category. */
export const ASSET_CATEGORY_DESCRIPTIONS: Record<AssetCategory, string> = {
  models: '3D models (GLTF, GLB, OBJ)',
  textures: 'Image textures (PNG, JPG, AVIF, WebP)',
  materials: 'Material definitions',
  environment: 'Environment maps (HDR, EXR)',
  audio: 'Audio files',
  animations: 'Animation clips',
  fonts: 'Font files (woff2, woff)',
  videos: 'Video files',
  ui: 'UI assets (icons, overlays)',
  icons: 'Icon assets (SVG, icon fonts)',
  debug: 'Debug helpers (wireframe, axes, grid)',
  'future-custom': 'Future custom asset types',
};

/** Human-readable descriptions for each asset priority. */
export const ASSET_PRIORITY_DESCRIPTIONS: Record<AssetPriority, string> = {
  critical: 'Must load before any rendering',
  high: 'Should load quickly, needed soon',
  normal: 'Standard loading priority',
  low: 'Can wait, background loading',
  background: 'Load when idle, no urgency',
  idle: 'Load only when nothing else needs loading',
};

/** Human-readable descriptions for each asset group. */
export const ASSET_GROUP_DESCRIPTIONS: Record<AssetGroupId, string> = {
  hero: 'Hero scene assets',
  intro: 'Intro/prologue assets',
  services: 'Services section assets',
  gallery: 'Gallery section assets',
  booking: 'Booking section assets',
  footer: 'Footer section assets',
  global: 'Global/shared assets (always loaded)',
  debug: 'Debug/development assets',
};

/* -------------------------------------------------------------------------- */
/*                              Ordering Records                              */
/* -------------------------------------------------------------------------- */

/** Ordinal ranking of asset states. */
export const ASSET_STATE_ORDER: Record<AssetState, number> =
  ASSET_STATES.reduce(
    (acc, state, index) => {
      acc[state] = index;
      return acc;
    },
    {} as Record<AssetState, number>,
  );

/** Ordinal ranking of asset categories. */
export const ASSET_CATEGORY_ORDER: Record<AssetCategory, number> =
  ASSET_CATEGORIES.reduce(
    (acc, category, index) => {
      acc[category] = index;
      return acc;
    },
    {} as Record<AssetCategory, number>,
  );

/** Ordinal ranking of asset priorities. */
export const ASSET_PRIORITY_ORDER: Record<AssetPriority, number> =
  ASSET_PRIORITIES.reduce(
    (acc, priority, index) => {
      acc[priority] = index;
      return acc;
    },
    {} as Record<AssetPriority, number>,
  );

/* -------------------------------------------------------------------------- */
/*                        Per-Preset Quality Profiles                         */
/* -------------------------------------------------------------------------- */

/** Quality-adapted asset settings per quality preset. */
export const ASSET_QUALITY_PROFILES: Record<QualityPreset, AssetQualityProfile> = {
  ultra: Object.freeze({
    preset: 'ultra',
    maxTextureSize: 4096,
    maxPolygonCount: 2_000_000,
    maxConcurrentLoads: 8,
    maxTotalMemoryMB: 512,
    highResTexturesEnabled: true,
    animationsEnabled: true,
    audioEnabled: true,
    videoEnabled: true,
    debugAssetsEnabled: true,
  }),
  high: Object.freeze({
    preset: 'high',
    maxTextureSize: 2048,
    maxPolygonCount: 1_000_000,
    maxConcurrentLoads: 6,
    maxTotalMemoryMB: 256,
    highResTexturesEnabled: true,
    animationsEnabled: true,
    audioEnabled: true,
    videoEnabled: true,
    debugAssetsEnabled: true,
  }),
  medium: Object.freeze({
    preset: 'medium',
    maxTextureSize: 1024,
    maxPolygonCount: 500_000,
    maxConcurrentLoads: 4,
    maxTotalMemoryMB: 128,
    highResTexturesEnabled: false,
    animationsEnabled: true,
    audioEnabled: true,
    videoEnabled: false,
    debugAssetsEnabled: false,
  }),
  low: Object.freeze({
    preset: 'low',
    maxTextureSize: 512,
    maxPolygonCount: 200_000,
    maxConcurrentLoads: 2,
    maxTotalMemoryMB: 64,
    highResTexturesEnabled: false,
    animationsEnabled: false,
    audioEnabled: false,
    videoEnabled: false,
    debugAssetsEnabled: false,
  }),
  minimal: Object.freeze({
    preset: 'minimal',
    maxTextureSize: 256,
    maxPolygonCount: 50_000,
    maxConcurrentLoads: 1,
    maxTotalMemoryMB: 32,
    highResTexturesEnabled: false,
    animationsEnabled: false,
    audioEnabled: false,
    videoEnabled: false,
    debugAssetsEnabled: false,
  }),
};

/* -------------------------------------------------------------------------- */
/*                            Default Constraints                             */
/* -------------------------------------------------------------------------- */

/** Default asset pipeline constraints. */
export const DEFAULT_ASSET_CONSTRAINTS: AssetConstraints = Object.freeze({
  maxAssets: 500,
  maxMemoryBudgetMB: 512,
  maxSingleAssetSizeMB: 64,
  maxDependencyDepth: 5,
  maxAssetsPerBundle: 50,
  maxBundles: 20,
});

/* -------------------------------------------------------------------------- */
/*                          Reduced-Motion Constraints                        */
/* -------------------------------------------------------------------------- */

/** Tightened constraints when reduced motion is active. */
export const REDUCED_MOTION_ASSET_CONSTRAINTS: AssetConstraints = Object.freeze({
  maxAssets: 256,
  maxMemoryBudgetMB: 128,
  maxSingleAssetSizeMB: 32,
  maxDependencyDepth: 3,
  maxAssetsPerBundle: 30,
  maxBundles: 12,
});

/* -------------------------------------------------------------------------- */
/*                        Default Category Definitions                        */
/* -------------------------------------------------------------------------- */

/** Default asset category definitions — one per {@link ASSET_CATEGORIES}. */
const DEFAULT_CATEGORIES: ReadonlyArray<{
  readonly id: AssetCategoryId;
  readonly enabled: boolean;
}> = [
  { id: 'models', enabled: true },
  { id: 'textures', enabled: true },
  { id: 'materials', enabled: true },
  { id: 'environment', enabled: true },
  { id: 'audio', enabled: true },
  { id: 'animations', enabled: true },
  { id: 'fonts', enabled: true },
  { id: 'videos', enabled: true },
  { id: 'ui', enabled: true },
  { id: 'icons', enabled: true },
  { id: 'debug', enabled: true },
  { id: 'future-custom', enabled: true },
];

export { DEFAULT_CATEGORIES as ASSET_DEFAULT_CATEGORIES };

/* -------------------------------------------------------------------------- */
/*                       Default Bundle Definitions                           */
/* -------------------------------------------------------------------------- */

/** Default asset bundle definitions — one per {@link ASSET_GROUP_IDS}. */
const DEFAULT_BUNDLES: ReadonlyArray<{
  readonly id: AssetGroupId;
  readonly enabled: boolean;
  readonly isPriority: boolean;
  readonly maxConcurrent: number;
}> = [
  { id: 'hero', enabled: true, isPriority: true, maxConcurrent: 4 },
  { id: 'intro', enabled: true, isPriority: true, maxConcurrent: 2 },
  { id: 'services', enabled: true, isPriority: false, maxConcurrent: 3 },
  { id: 'gallery', enabled: true, isPriority: false, maxConcurrent: 4 },
  { id: 'booking', enabled: true, isPriority: false, maxConcurrent: 2 },
  { id: 'footer', enabled: true, isPriority: false, maxConcurrent: 2 },
  { id: 'global', enabled: true, isPriority: true, maxConcurrent: 4 },
  { id: 'debug', enabled: false, isPriority: false, maxConcurrent: 1 },
];

export { DEFAULT_BUNDLES as ASSET_DEFAULT_BUNDLES };

/* -------------------------------------------------------------------------- */
/*                       Default Quality Profile                              */
/* -------------------------------------------------------------------------- */

/** Default quality profile (medium preset). */
export const DEFAULT_ASSET_QUALITY_PROFILE: AssetQualityProfile =
  ASSET_QUALITY_PROFILES.medium;

/* -------------------------------------------------------------------------- */
/*                        Default Dependency Graph                            */
/* -------------------------------------------------------------------------- */

/** The empty dependency graph (no assets registered). */
export const DEFAULT_DEPENDENCY_GRAPH: AssetDependencyGraph = Object.freeze({
  nodes: new Map(),
  hasCircularDependencies: false,
  sortedOrder: Object.freeze([]),
  timestamp: 0,
});

/* -------------------------------------------------------------------------- */
/*                         Default Snapshot                                   */
/* -------------------------------------------------------------------------- */

/**
 * The uninitialized asset snapshot.
 *
 * Returned by the asset manager before `init()` and after `destroy()`.
 */
export const DEFAULT_ASSET_SNAPSHOT: AssetSnapshot = Object.freeze({
  assets: new Map(),
  bundles: new Map(),
  categories: new Map(),
  dependencyGraph: DEFAULT_DEPENDENCY_GRAPH,
  cacheEntries: new Map(),
  qualityProfile: DEFAULT_ASSET_QUALITY_PROFILE,
  constraints: DEFAULT_ASSET_CONSTRAINTS,
  isReducedMotion: false,
  qualityPreset: 'medium',
  assetCount: 0,
  bundleCount: 0,
  loadedCount: 0,
  loadingCount: 0,
  failedCount: 0,
  totalEstimatedMemory: 0,
  revision: 0,
  timestamp: 0,
});
