/**
 * Asset Infrastructure — Barrel Export
 *
 * Asset registry, loaders, font/image/icon registries,
 * and lazy loading helpers.
 */

export {
  createAssetRegistry,
  globalAssetRegistry,
} from './asset-registry';
export type { AssetType, AssetEntry } from './asset-registry';

export {
  loadImage,
  loadFont,
  preloadImages,
  preloadFonts,
  getImageDimensions,
  createImageLoader,
} from './asset-loader';

export {
  FONT_DEFINITIONS,
  getFontFamily,
  getAllFontSources,
  FONT_CSS_VAR_MAP,
} from './font-registry';
export type { FontFamily, FontWeight, FontDefinition } from './font-registry';

export {
  IMAGE_CATEGORY_ASPECTS,
  createImageRegistry,
  globalImageRegistry,
} from './image-registry';
export type { ImageCategory, ImageDefinition } from './image-registry';

export {
  ICON_SIZES,
  createIconRegistry,
  globalIconRegistry,
  ICON_NAMESPACE,
} from './icon-registry';
export type { IconSize, IconVariant, IconDefinition } from './icon-registry';

export {
  createLazyLoader,
  createAssetPreloader,
  deferredImport,
} from './lazy-helpers';
