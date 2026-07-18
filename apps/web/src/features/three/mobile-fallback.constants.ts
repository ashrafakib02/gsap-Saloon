/**
 * Mobile Fallback Constants — Default Values, Profiles, and Configuration
 *
 * Centralizes all mobile fallback metadata: descriptions, ordering,
 * tier profiles, rules, feature flags, compatibility entries, and
 * the default snapshot. All values are frozen and immutable.
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import {
  MOBILE_PROFILES,
  MOBILE_CAPABILITY_CATEGORIES,
  MOBILE_FALLBACK_STRATEGIES,
} from './mobile-fallback.types';

import type {
  MobileProfile,
  MobileCapabilityCategory,
  MobileFallbackStrategy,
  MobileCapabilityProfile,
  MobileFallbackRule,
  MobileFeatureFlag,
  MobileCompatibilityEntry,
  MobileFallbackSnapshot,
} from './mobile-fallback.types';

// ── Re-exports ──────────────────────────────────────────────

export { MOBILE_PROFILES, MOBILE_CAPABILITY_CATEGORIES, MOBILE_FALLBACK_STRATEGIES };

// ── Description Records ─────────────────────────────────────

/** Human-readable descriptions for each mobile profile. */
export const MOBILE_PROFILE_DESCRIPTIONS: Readonly<Record<MobileProfile, string>> = Object.freeze({
  ultra: 'Flagship devices — full feature set, all effects, no compromise',
  high: 'High-end devices — most features enabled, slight optimization',
  medium: 'Mainstream devices — balanced feature set, selective simplification',
  low: 'Low-power devices — reduced feature set, significant simplification',
  minimal: 'Minimum viable devices — essential features only, maximum fallback',
  unknown: 'Unknown capability — conservative defaults, safe degradation',
});

/** Human-readable descriptions for each capability category. */
export const MOBILE_CAPABILITY_CATEGORY_DESCRIPTIONS: Readonly<Record<MobileCapabilityCategory, string>> = Object.freeze({
  camera: 'Camera presets, movement, viewport adaptation',
  lighting: 'Light count, shadow resolution, environment maps',
  materials: 'Texture size, shader complexity, material layers',
  environment: 'HDR resolution, fog, sky, IBL, atmosphere',
  assets: 'Asset loading, compression, concurrency',
  particles: 'Particle count, spawn rate, lifetime',
  animations: 'Scroll-linked animations, GSAP timelines, stagger',
  postprocessing: 'Bloom, SSAO, tone mapping, anti-aliasing',
  shadows: 'Shadow map resolution, shadow count, shadow type',
  audio: 'Spatial audio, ambient sound, music layers',
  physics: 'Physics simulation, collision detection',
  interactions: 'Pointer, touch, scroll, gesture interactions',
  helpers: 'Debug overlays, axes helpers, wireframe',
  debug: 'Debug mode, verbose logging, performance stats',
  memory: 'Texture memory, geometry memory, disposal',
  gpu: 'GPU render budget, draw calls, triangles',
  cpu: 'CPU compute budget, main thread work',
  network: 'Network request budget, prefetch limits',
  battery: 'Battery impact classification',
});

/** Human-readable descriptions for each fallback strategy. */
export const MOBILE_FALLBACK_STRATEGY_DESCRIPTIONS: Readonly<Record<MobileFallbackStrategy, string>> = Object.freeze({
  enabled: 'Feature operates at full fidelity — no degradation',
  disabled: 'Feature is completely disabled on this tier',
  simplified: 'Feature operates with reduced complexity',
  reduced: 'Feature operates with reduced resource budget',
  deferred: 'Feature is deferred until idle / after critical path',
  placeholder: 'Feature is replaced with a static or non-3D alternative',
  minimal: 'Feature operates at absolute minimum viable level',
});

// ── Ordering Records ────────────────────────────────────────

/** Ordered mobile profiles (highest to lowest capability). */
export const MOBILE_PROFILE_ORDER: readonly MobileProfile[] = Object.freeze([
  'ultra', 'high', 'medium', 'low', 'minimal', 'unknown',
]);

/** Ordered capability categories. */
export const MOBILE_CAPABILITY_CATEGORY_ORDER: readonly MobileCapabilityCategory[] = Object.freeze([
  'camera', 'lighting', 'materials', 'environment', 'assets',
  'particles', 'animations', 'postprocessing', 'shadows', 'audio',
  'physics', 'interactions', 'helpers', 'debug', 'memory',
  'gpu', 'cpu', 'network', 'battery',
]);

/** Ordered fallback strategies (highest to lowest fidelity). */
export const MOBILE_FALLBACK_STRATEGY_ORDER: readonly MobileFallbackStrategy[] = Object.freeze([
  'enabled', 'simplified', 'reduced', 'deferred', 'placeholder', 'minimal', 'disabled',
]);

// ── Default Profiles Per Tier ────────────────────────────────

/**
 * Creates a frozen capability profile for a given tier.
 *
 * Each tier maps all 19 capability categories to a fallback strategy.
 * These are the architectural defaults — future implementation phases
 * consume these to make actual runtime decisions.
 */
function createTierProfile(
  tier: MobileProfile,
  label: string,
  isConstrained: boolean,
  enables3D: boolean,
  enablesPostProcessing: boolean,
  enablesShadows: boolean,
  capabilities: ReadonlyArray<readonly [MobileCapabilityCategory, MobileFallbackStrategy]>,
  budgets: {
    readonly maxParticles: number;
    readonly maxLights: number;
    readonly maxTextureResolution: number;
    readonly maxPolygons: number;
    readonly maxDrawCalls: number;
    readonly maxAnimations: number;
    readonly maxAudioChannels: number;
    readonly maxPhysicsBodies: number;
    readonly maxPrefetchRequests: number;
  },
): MobileCapabilityProfile {
  return Object.freeze({
    tier,
    label,
    isConstrained,
    enables3D,
    enablesPostProcessing,
    enablesShadows,
    ...budgets,
    capabilities: Object.freeze(new Map(capabilities)),
  });
}

/** Ultra tier — flagship devices, full feature set. */
export const ULTRA_TIER_PROFILE: MobileCapabilityProfile = createTierProfile(
  'ultra',
  'Flagship',
  false,
  true,
  true,
  true,
  [
    ['camera', 'enabled'],
    ['lighting', 'enabled'],
    ['materials', 'enabled'],
    ['environment', 'enabled'],
    ['assets', 'enabled'],
    ['particles', 'enabled'],
    ['animations', 'enabled'],
    ['postprocessing', 'enabled'],
    ['shadows', 'enabled'],
    ['audio', 'enabled'],
    ['physics', 'enabled'],
    ['interactions', 'enabled'],
    ['helpers', 'disabled'],
    ['debug', 'disabled'],
    ['memory', 'enabled'],
    ['gpu', 'enabled'],
    ['cpu', 'enabled'],
    ['network', 'enabled'],
    ['battery', 'enabled'],
  ],
  {
    maxParticles: 1000,
    maxLights: 16,
    maxTextureResolution: 4096,
    maxPolygons: 500000,
    maxDrawCalls: 100,
    maxAnimations: 32,
    maxAudioChannels: 8,
    maxPhysicsBodies: 64,
    maxPrefetchRequests: 20,
  },
);

/** High tier — high-end devices, slight optimization. */
export const HIGH_TIER_PROFILE: MobileCapabilityProfile = createTierProfile(
  'high',
  'High-End',
  false,
  true,
  true,
  true,
  [
    ['camera', 'enabled'],
    ['lighting', 'enabled'],
    ['materials', 'enabled'],
    ['environment', 'enabled'],
    ['assets', 'enabled'],
    ['particles', 'enabled'],
    ['animations', 'enabled'],
    ['postprocessing', 'enabled'],
    ['shadows', 'enabled'],
    ['audio', 'enabled'],
    ['physics', 'simplified'],
    ['interactions', 'enabled'],
    ['helpers', 'disabled'],
    ['debug', 'disabled'],
    ['memory', 'enabled'],
    ['gpu', 'enabled'],
    ['cpu', 'enabled'],
    ['network', 'enabled'],
    ['battery', 'enabled'],
  ],
  {
    maxParticles: 500,
    maxLights: 12,
    maxTextureResolution: 2048,
    maxPolygons: 300000,
    maxDrawCalls: 80,
    maxAnimations: 24,
    maxAudioChannels: 6,
    maxPhysicsBodies: 32,
    maxPrefetchRequests: 16,
  },
);

/** Medium tier — mainstream devices, selective simplification. */
export const MEDIUM_TIER_PROFILE: MobileCapabilityProfile = createTierProfile(
  'medium',
  'Mainstream',
  true,
  true,
  false,
  true,
  [
    ['camera', 'simplified'],
    ['lighting', 'simplified'],
    ['materials', 'simplified'],
    ['environment', 'simplified'],
    ['assets', 'enabled'],
    ['particles', 'reduced'],
    ['animations', 'enabled'],
    ['postprocessing', 'disabled'],
    ['shadows', 'simplified'],
    ['audio', 'enabled'],
    ['physics', 'disabled'],
    ['interactions', 'enabled'],
    ['helpers', 'disabled'],
    ['debug', 'disabled'],
    ['memory', 'reduced'],
    ['gpu', 'reduced'],
    ['cpu', 'enabled'],
    ['network', 'enabled'],
    ['battery', 'enabled'],
  ],
  {
    maxParticles: 200,
    maxLights: 8,
    maxTextureResolution: 1024,
    maxPolygons: 150000,
    maxDrawCalls: 50,
    maxAnimations: 16,
    maxAudioChannels: 4,
    maxPhysicsBodies: 0,
    maxPrefetchRequests: 12,
  },
);

/** Low tier — low-power devices, significant simplification. */
export const LOW_TIER_PROFILE: MobileCapabilityProfile = createTierProfile(
  'low',
  'Low-Power',
  true,
  true,
  false,
  false,
  [
    ['camera', 'simplified'],
    ['lighting', 'reduced'],
    ['materials', 'reduced'],
    ['environment', 'reduced'],
    ['assets', 'reduced'],
    ['particles', 'minimal'],
    ['animations', 'simplified'],
    ['postprocessing', 'disabled'],
    ['shadows', 'disabled'],
    ['audio', 'simplified'],
    ['physics', 'disabled'],
    ['interactions', 'simplified'],
    ['helpers', 'disabled'],
    ['debug', 'disabled'],
    ['memory', 'reduced'],
    ['gpu', 'reduced'],
    ['cpu', 'reduced'],
    ['network', 'reduced'],
    ['battery', 'reduced'],
  ],
  {
    maxParticles: 50,
    maxLights: 4,
    maxTextureResolution: 512,
    maxPolygons: 50000,
    maxDrawCalls: 25,
    maxAnimations: 8,
    maxAudioChannels: 2,
    maxPhysicsBodies: 0,
    maxPrefetchRequests: 8,
  },
);

/** Minimal tier — minimum viable, maximum fallback. */
export const MINIMAL_TIER_PROFILE: MobileCapabilityProfile = createTierProfile(
  'minimal',
  'Minimum',
  true,
  false,
  false,
  false,
  [
    ['camera', 'placeholder'],
    ['lighting', 'minimal'],
    ['materials', 'minimal'],
    ['environment', 'placeholder'],
    ['assets', 'minimal'],
    ['particles', 'disabled'],
    ['animations', 'disabled'],
    ['postprocessing', 'disabled'],
    ['shadows', 'disabled'],
    ['audio', 'disabled'],
    ['physics', 'disabled'],
    ['interactions', 'minimal'],
    ['helpers', 'disabled'],
    ['debug', 'disabled'],
    ['memory', 'minimal'],
    ['gpu', 'minimal'],
    ['cpu', 'minimal'],
    ['network', 'minimal'],
    ['battery', 'minimal'],
  ],
  {
    maxParticles: 0,
    maxLights: 2,
    maxTextureResolution: 256,
    maxPolygons: 10000,
    maxDrawCalls: 10,
    maxAnimations: 2,
    maxAudioChannels: 1,
    maxPhysicsBodies: 0,
    maxPrefetchRequests: 4,
  },
);

/** Unknown tier — conservative defaults, safe degradation. */
export const UNKNOWN_TIER_PROFILE: MobileCapabilityProfile = createTierProfile(
  'unknown',
  'Unknown',
  true,
  false,
  false,
  false,
  [
    ['camera', 'placeholder'],
    ['lighting', 'minimal'],
    ['materials', 'minimal'],
    ['environment', 'placeholder'],
    ['assets', 'minimal'],
    ['particles', 'disabled'],
    ['animations', 'disabled'],
    ['postprocessing', 'disabled'],
    ['shadows', 'disabled'],
    ['audio', 'disabled'],
    ['physics', 'disabled'],
    ['interactions', 'minimal'],
    ['helpers', 'disabled'],
    ['debug', 'disabled'],
    ['memory', 'minimal'],
    ['gpu', 'minimal'],
    ['cpu', 'minimal'],
    ['network', 'minimal'],
    ['battery', 'minimal'],
  ],
  {
    maxParticles: 0,
    maxLights: 2,
    maxTextureResolution: 256,
    maxPolygons: 10000,
    maxDrawCalls: 10,
    maxAnimations: 2,
    maxAudioChannels: 1,
    maxPhysicsBodies: 0,
    maxPrefetchRequests: 4,
  },
);

/** All tier profiles indexed by tier. */
export const MOBILE_TIER_PROFILES: ReadonlyMap<MobileProfile, MobileCapabilityProfile> = new Map<MobileProfile, MobileCapabilityProfile>([
  ['ultra', ULTRA_TIER_PROFILE],
  ['high', HIGH_TIER_PROFILE],
  ['medium', MEDIUM_TIER_PROFILE],
  ['low', LOW_TIER_PROFILE],
  ['minimal', MINIMAL_TIER_PROFILE],
  ['unknown', UNKNOWN_TIER_PROFILE],
]);

// ── Default Rules ────────────────────────────────────────────

/** Default fallback rules — one per category per constrained tier. */
export const DEFAULT_FALLBACK_RULES: readonly MobileFallbackRule[] = Object.freeze([
  Object.freeze({
    id: 'shadows-disabled-low',
    category: 'shadows',
    tier: 'low',
    strategy: 'disabled',
    description: 'Shadows disabled on low-power devices to reduce GPU load',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'shadows-disabled-minimal',
    category: 'shadows',
    tier: 'minimal',
    strategy: 'disabled',
    description: 'Shadows disabled on minimal devices',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'postprocessing-disabled-medium',
    category: 'postprocessing',
    tier: 'medium',
    strategy: 'disabled',
    description: 'Post-processing disabled on mainstream devices',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'physics-disabled-medium',
    category: 'physics',
    tier: 'medium',
    strategy: 'disabled',
    description: 'Physics simulation disabled on mainstream devices',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'particles-reduced-medium',
    category: 'particles',
    tier: 'medium',
    strategy: 'reduced',
    description: 'Particle count reduced on mainstream devices',
    priority: 8,
    enabled: true,
  }),
  Object.freeze({
    id: 'animations-simplified-low',
    category: 'animations',
    tier: 'low',
    strategy: 'simplified',
    description: 'Animations simplified on low-power devices',
    priority: 8,
    enabled: true,
  }),
  Object.freeze({
    id: 'animations-disabled-minimal',
    category: 'animations',
    tier: 'minimal',
    strategy: 'disabled',
    description: 'Animations disabled on minimal devices',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'helpers-disabled-all',
    category: 'helpers',
    tier: 'medium',
    strategy: 'disabled',
    description: 'Debug helpers disabled on constrained devices',
    priority: 5,
    enabled: true,
  }),
  Object.freeze({
    id: 'debug-disabled-all',
    category: 'debug',
    tier: 'medium',
    strategy: 'disabled',
    description: 'Debug mode disabled on constrained devices',
    priority: 5,
    enabled: true,
  }),
  Object.freeze({
    id: 'camera-simplified-medium',
    category: 'camera',
    tier: 'medium',
    strategy: 'simplified',
    description: 'Camera simplified on mainstream devices',
    priority: 6,
    enabled: true,
  }),
  Object.freeze({
    id: 'lighting-reduced-low',
    category: 'lighting',
    tier: 'low',
    strategy: 'reduced',
    description: 'Lighting reduced on low-power devices',
    priority: 8,
    enabled: true,
  }),
  Object.freeze({
    id: 'materials-reduced-low',
    category: 'materials',
    tier: 'low',
    strategy: 'reduced',
    description: 'Materials reduced on low-power devices',
    priority: 8,
    enabled: true,
  }),
  Object.freeze({
    id: 'environment-reduced-low',
    category: 'environment',
    tier: 'low',
    strategy: 'reduced',
    description: 'Environment reduced on low-power devices',
    priority: 8,
    enabled: true,
  }),
  Object.freeze({
    id: 'audio-disabled-minimal',
    category: 'audio',
    tier: 'minimal',
    strategy: 'disabled',
    description: 'Audio disabled on minimal devices',
    priority: 7,
    enabled: true,
  }),
  Object.freeze({
    id: 'network-reduced-low',
    category: 'network',
    tier: 'low',
    strategy: 'reduced',
    description: 'Network requests reduced on low-power devices',
    priority: 6,
    enabled: true,
  }),
]);

// ── Default Feature Flags ────────────────────────────────────

/** Default feature flags — one per major capability. */
export const DEFAULT_FEATURE_FLAGS: readonly MobileFeatureFlag[] = [
  Object.freeze({
    id: '3d-rendering',
    label: '3D Rendering',
    category: 'gpu',
    tiers: new Map<MobileProfile, boolean>([
      ['ultra', true],
      ['high', true],
      ['medium', true],
      ['low', true],
      ['minimal', false],
      ['unknown', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'post-processing',
    label: 'Post-Processing',
    category: 'postprocessing',
    tiers: new Map<MobileProfile, boolean>([
      ['ultra', true],
      ['high', true],
      ['medium', false],
      ['low', false],
      ['minimal', false],
      ['unknown', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'shadow-rendering',
    label: 'Shadow Rendering',
    category: 'shadows',
    tiers: new Map<MobileProfile, boolean>([
      ['ultra', true],
      ['high', true],
      ['medium', true],
      ['low', false],
      ['minimal', false],
      ['unknown', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'particle-effects',
    label: 'Particle Effects',
    category: 'particles',
    tiers: new Map<MobileProfile, boolean>([
      ['ultra', true],
      ['high', true],
      ['medium', true],
      ['low', true],
      ['minimal', false],
      ['unknown', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'physics-simulation',
    label: 'Physics Simulation',
    category: 'physics',
    tiers: new Map<MobileProfile, boolean>([
      ['ultra', true],
      ['high', true],
      ['medium', false],
      ['low', false],
      ['minimal', false],
      ['unknown', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'spatial-audio',
    label: 'Spatial Audio',
    category: 'audio',
    tiers: new Map<MobileProfile, boolean>([
      ['ultra', true],
      ['high', true],
      ['medium', true],
      ['low', true],
      ['minimal', false],
      ['unknown', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'debug-overlays',
    label: 'Debug Overlays',
    category: 'debug',
    tiers: new Map<MobileProfile, boolean>([
      ['ultra', false],
      ['high', false],
      ['medium', false],
      ['low', false],
      ['minimal', false],
      ['unknown', false],
    ]),
    enabled: true,
  }),
];

// ── Default Compatibility Matrix ─────────────────────────────

/** Default compatibility entries — system interaction rules. */
export const DEFAULT_COMPATIBILITY_MATRIX: readonly MobileCompatibilityEntry[] = Object.freeze([
  Object.freeze({
    id: 'postprocessing-shadows-low',
    systemA: 'postprocessing',
    systemB: 'shadows',
    tier: 'low',
    isCompatible: false,
    precedence: 'shadows',
    description: 'Post-processing and shadows are incompatible on low-power devices — shadows take precedence',
  }),
  Object.freeze({
    id: 'physics-particles-medium',
    systemA: 'physics',
    systemB: 'particles',
    tier: 'medium',
    isCompatible: false,
    precedence: 'particles',
    description: 'Physics and particles are incompatible on mainstream devices — particles take precedence',
  }),
  Object.freeze({
    id: 'audio-physics-minimal',
    systemA: 'audio',
    systemB: 'physics',
    tier: 'minimal',
    isCompatible: false,
    precedence: 'audio',
    description: 'Audio and physics are incompatible on minimal devices — audio takes precedence',
  }),
  Object.freeze({
    id: 'helpers-postprocessing-low',
    systemA: 'helpers',
    systemB: 'postprocessing',
    tier: 'low',
    isCompatible: false,
    precedence: 'postprocessing',
    description: 'Debug helpers conflict with post-processing on low-power devices',
  }),
  Object.freeze({
    id: 'camera-environment-medium',
    systemA: 'camera',
    systemB: 'environment',
    tier: 'medium',
    isCompatible: true,
    description: 'Camera and environment coexist on mainstream devices with simplified settings',
  }),
]);

// ── Default Snapshot ─────────────────────────────────────────

/** The default (uninitialized) snapshot. */
export const DEFAULT_MOBILE_FALLBACK_SNAPSHOT: MobileFallbackSnapshot = Object.freeze({
  activeProfile: 'unknown',
  profile: UNKNOWN_TIER_PROFILE,
  capabilities: Object.freeze(new Map()),
  featureFlags: Object.freeze(new Map()),
  rules: Object.freeze(new Map()),
  compatibilityMatrix: Object.freeze(new Map()),
  recommendations: Object.freeze([]),
  isReducedMotion: false,
  enables3D: false,
  enablesPostProcessing: false,
  enablesShadows: false,
  activeCapabilityCount: 0,
  disabledCapabilityCount: 0,
  simplifiedCapabilityCount: 0,
  deferredCapabilityCount: 0,
  featureFlagCount: 0,
  ruleCount: 0,
  compatibilityCount: 0,
  revision: 0,
  timestamp: 0,
});
