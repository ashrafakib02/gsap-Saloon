/**
 * Materials Constants — Default Configuration, Descriptions, and Ordering
 *
 * Provides default values, description records, ordering records,
 * preset defaults, and the initial snapshot for the materials system.
 *
 * Phase 6.5: Constants — no React, no 3D objects, no materials.
 */

import type {
  MaterialPreset,
  MaterialPresetId,
  MaterialCategory,
  MaterialGroupId,
  MaterialGroup,
  MaterialLayer,
  MaterialSurface,
  MaterialPriority,
  MaterialQualityProfile,
  MaterialConstraints,
  MaterialSnapshot,
} from './materials.types';

// ── Re-exports ────────────────────────────────────────────

export {
  MATERIAL_PRESETS,
  MATERIAL_CATEGORIES,
  MATERIAL_GROUPS,
  MATERIAL_LAYERS,
  MATERIAL_SURFACES,
  MATERIAL_PRIORITIES,
  MATERIAL_LIFECYCLE_STATES,
} from './materials.types';

// ── Preset Descriptions ───────────────────────────────────

/** Human-readable descriptions for each material preset. */
export const MATERIAL_PRESET_DESCRIPTIONS: Record<MaterialPreset, string> = {
  hero: 'Hero scene — premium materials, full feature set',
  narrative: 'Narrative sections — balanced documentary materials',
  services: 'Services showcase — product-focused material quality',
  gallery: 'Gallery — high-fidelity detail materials',
  transformation: 'Transformation before/after — dramatic material transitions',
  booking: 'Booking overlay — stable, accessible materials',
  footer: 'Footer — distant, low-detail materials',
  mobile: 'Mobile-optimized — simplified, low-cost materials',
  performance: 'Performance preset — minimal shader complexity',
  'reduced-motion': 'Reduced motion preset — static, simple materials',
  debug: 'Debug preset — wireframe / flat-color helpers',
};

// ── Category Descriptions ─────────────────────────────────

/** Human-readable descriptions for each material category. */
export const MATERIAL_CATEGORY_DESCRIPTIONS: Record<MaterialCategory, string> = {
  fabric: 'Fabric — cloth, textile, upholstery',
  wood: 'Wood — timber, lacquer, veneer',
  stone: 'Stone — granite, sandstone, slate',
  marble: 'Marble — polished, veined, Carrara',
  metal: 'Metal — brushed, polished, anodized',
  glass: 'Glass — clear, frosted, tinted',
  ceramic: 'Ceramic — porcelain, glazed, matte',
  leather: 'Leather — genuine, synthetic, suede',
  skin: 'Skin — human skin subsurface',
  hair: 'Hair — strand-based, anisotropic',
  liquid: 'Liquid — water, oil, cream',
  procedural: 'Procedural — shader-generated, no texture',
  ui: 'UI — interface overlays, HTML3D',
  debug: 'Debug — wireframe, flat-color, helpers',
};

// ── Group Descriptions ────────────────────────────────────

/** Human-readable descriptions for each material group. */
export const MATERIAL_GROUP_DESCRIPTIONS: Record<MaterialGroup, string> = {
  architectural: 'Architectural — stone, marble, wood, ceramic',
  surface: 'Surface — fabric, leather, skin',
  reflective: 'Reflective — glass, metal, liquid',
  organic: 'Organic — hair, skin, liquid',
  technical: 'Technical — procedural, ui, debug',
};

// ── Layer Descriptions ────────────────────────────────────

/** Human-readable descriptions for each material layer. */
export const MATERIAL_LAYER_DESCRIPTIONS: Record<MaterialLayer, string> = {
  'base-color': 'Base color / albedo',
  normal: 'Normal map',
  roughness: 'Roughness / glossiness',
  metallic: 'Metallic',
  'ambient-occlusion': 'Ambient occlusion',
  emissive: 'Emissive',
  displacement: 'Displacement / height',
  clearcoat: 'Clearcoat',
  transmission: 'Transmission',
  subsurface: 'Subsurface scattering',
  anisotropy: 'Anisotropy',
};

// ── Surface Descriptions ──────────────────────────────────

/** Human-readable descriptions for each material surface. */
export const MATERIAL_SURFACE_DESCRIPTIONS: Record<MaterialSurface, string> = {
  matte: 'Matte — no specular highlight',
  satin: 'Satin — subtle sheen',
  glossy: 'Glossy — sharp specular',
  polished: 'Polished — mirror-like reflection',
  rough: 'Rough — diffuse micro-detail',
  brushed: 'Brushed — directional anisotropy',
  frosted: 'Frosted — scattered reflection',
  transparent: 'Transparent — full light transmission',
  translucent: 'Translucent — partial light transmission',
  metallic: 'Metallic — conductive reflection',
};

// ── Priority Descriptions ─────────────────────────────────

/** Human-readable descriptions for each material priority. */
export const MATERIAL_PRIORITY_DESCRIPTIONS: Record<MaterialPriority, string> = {
  critical: 'Critical — hero materials, must render at full quality',
  high: 'High — narrative section materials',
  normal: 'Normal — standard section materials',
  low: 'Low — ambient / background materials',
};

// ── Preset Ordering ───────────────────────────────────────

/**
 * Ordinal ranking of material presets, by importance.
 * Lower values receive priority when quality budgets are tight.
 */
export const MATERIAL_PRESET_ORDER: Record<MaterialPreset, number> = {
  hero: 0,
  narrative: 1,
  services: 2,
  gallery: 3,
  transformation: 4,
  booking: 5,
  footer: 6,
  mobile: 7,
  performance: 8,
  'reduced-motion': 9,
  debug: 10,
};

// ── Category Ordering ─────────────────────────────────────

/**
 * Ordinal ranking of material categories, by render priority.
 * Lower values render first (behind higher values).
 */
export const MATERIAL_CATEGORY_ORDER: Record<MaterialCategory, number> = {
  fabric: 0,
  wood: 1,
  stone: 2,
  marble: 3,
  metal: 4,
  glass: 5,
  ceramic: 6,
  leather: 7,
  skin: 8,
  hair: 9,
  liquid: 10,
  procedural: 11,
  ui: 12,
  debug: 13,
};

// ── Group Ordering ────────────────────────────────────────

/**
 * Ordinal ranking of material groups, by priority.
 */
export const MATERIAL_GROUP_ORDER: Record<MaterialGroup, number> = {
  architectural: 0,
  surface: 1,
  reflective: 2,
  organic: 3,
  technical: 4,
};

// ── Layer Ordering ────────────────────────────────────────

/**
 * Ordinal ranking of material layers, by render order.
 */
export const MATERIAL_LAYER_ORDER: Record<MaterialLayer, number> = {
  'base-color': 0,
  'ambient-occlusion': 1,
  normal: 2,
  roughness: 3,
  metallic: 4,
  emissive: 5,
  displacement: 6,
  clearcoat: 7,
  transmission: 8,
  subsurface: 9,
  anisotropy: 10,
};

// ── Surface Ordering ──────────────────────────────────────

/**
 * Ordinal ranking of material surfaces, by complexity.
 */
export const MATERIAL_SURFACE_ORDER: Record<MaterialSurface, number> = {
  matte: 0,
  rough: 1,
  satin: 2,
  glossy: 3,
  polished: 4,
  brushed: 5,
  frosted: 6,
  transparent: 7,
  translucent: 8,
  metallic: 9,
};

// ── Preset Defaults ───────────────────────────────────────

/**
 * Default category for each material preset.
 */
export const MATERIAL_PRESET_CATEGORY: Record<MaterialPreset, MaterialCategory> = {
  hero: 'marble',
  narrative: 'fabric',
  services: 'metal',
  gallery: 'marble',
  transformation: 'glass',
  booking: 'ceramic',
  footer: 'stone',
  mobile: 'fabric',
  performance: 'procedural',
  'reduced-motion': 'fabric',
  debug: 'debug',
};

/**
 * Default surface finish for each material preset.
 */
export const MATERIAL_PRESET_SURFACE: Record<MaterialPreset, MaterialSurface> = {
  hero: 'polished',
  narrative: 'satin',
  services: 'brushed',
  gallery: 'polished',
  transformation: 'transparent',
  booking: 'matte',
  footer: 'rough',
  mobile: 'matte',
  performance: 'matte',
  'reduced-motion': 'matte',
  debug: 'matte',
};

/**
 * Default priority for each material preset.
 */
export const MATERIAL_PRESET_PRIORITY: Record<MaterialPreset, MaterialPriority> = {
  hero: 'critical',
  narrative: 'high',
  services: 'normal',
  gallery: 'high',
  transformation: 'high',
  booking: 'normal',
  footer: 'low',
  mobile: 'normal',
  performance: 'low',
  'reduced-motion': 'low',
  debug: 'low',
};

/**
 * Default group for each material preset.
 */
export const MATERIAL_PRESET_GROUP: Record<MaterialPreset, MaterialGroupId> = {
  hero: 'architectural',
  narrative: 'surface',
  services: 'reflective',
  gallery: 'architectural',
  transformation: 'reflective',
  booking: 'architectural',
  footer: 'architectural',
  mobile: 'surface',
  performance: 'technical',
  'reduced-motion': 'surface',
  debug: 'technical',
};

// ── Category → Group Mapping ──────────────────────────────

/**
 * Maps each material category to its parent group.
 */
export const MATERIAL_CATEGORY_TO_GROUP: Record<MaterialCategory, MaterialGroupId> = {
  fabric: 'surface',
  wood: 'architectural',
  stone: 'architectural',
  marble: 'architectural',
  metal: 'reflective',
  glass: 'reflective',
  ceramic: 'architectural',
  leather: 'surface',
  skin: 'organic',
  hair: 'organic',
  liquid: 'organic',
  procedural: 'technical',
  ui: 'technical',
  debug: 'technical',
};

// ── Default Values ────────────────────────────────────────

/** Default active preset (none). */
export const DEFAULT_ACTIVE_MATERIAL_PRESET: MaterialPresetId | null = null;

// ── Default Quality Profile ───────────────────────────────

/**
 * Default quality profile — medium preset with balanced settings.
 */
export const DEFAULT_MATERIAL_QUALITY_PROFILE: MaterialQualityProfile = Object.freeze({
  preset: 'medium',
  maxTextureSize: 1024,
  normalMapsEnabled: true,
  pbrEnabled: true,
  clearcoatEnabled: false,
  transmissionEnabled: false,
  subsurfaceEnabled: false,
  anisotropyEnabled: false,
  maxSwapsPerFrame: 4,
  compressionEnabled: true,
});

// ── Default Constraints ───────────────────────────────────

/**
 * Default material constraints — balanced bounds suitable for all presets.
 */
export const DEFAULT_MATERIAL_CONSTRAINTS: MaterialConstraints = Object.freeze({
  maxActiveMaterials: 32,
  maxTextureMemoryMB: 256,
  maxTextureResolution: 2048,
  maxShaderComplexity: 80,
});

// ── Default Snapshot ──────────────────────────────────────

/**
 * The initial, empty material snapshot.
 *
 * Represents a system with no active preset, no registered presets,
 * default quality profile, and default constraints. SSR-safe.
 */
export const DEFAULT_MATERIAL_SNAPSHOT: MaterialSnapshot = Object.freeze({
  presets: new Map(),
  categories: new Map(),
  groups: new Map(),
  activePresetId: null,
  qualityProfile: DEFAULT_MATERIAL_QUALITY_PROFILE,
  constraints: DEFAULT_MATERIAL_CONSTRAINTS,
  isReducedMotion: false,
  qualityPreset: 'medium',
  presetCount: 0,
  categoryCount: 0,
  groupCount: 0,
  revision: 0,
  timestamp: 0,
});
