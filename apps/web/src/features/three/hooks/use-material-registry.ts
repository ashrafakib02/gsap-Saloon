/**
 * useMaterialRegistry — Read-Only Material Registry Access
 *
 * Provides read-only query methods over the material registries.
 * All methods are derived from the snapshot — they are pure lookups.
 *
 * Phase 6.5: Materials architecture — infrastructure only, no materials.
 */

import { useMemo } from 'react';

import { materialsManager } from '../materials-manager';
import { useMaterialsContext } from '../materials-provider';

/**
 * Return type — all read-only registry query methods.
 */
export interface UseMaterialRegistryReturn {
  /** Get a preset's runtime state by ID. */
  readonly getPreset: ReturnType<typeof materialsManager.getRegistry>['getPreset'];
  /** Get a category's runtime state by ID. */
  readonly getCategory: ReturnType<typeof materialsManager.getRegistry>['getCategory'];
  /** Get a group's runtime state by ID. */
  readonly getGroup: ReturnType<typeof materialsManager.getRegistry>['getGroup'];
  /** All registered preset IDs. */
  readonly getPresetIds: ReturnType<typeof materialsManager.getRegistry>['getPresetIds'];
  /** All registered category IDs. */
  readonly getCategoryIds: ReturnType<typeof materialsManager.getRegistry>['getCategoryIds'];
  /** All registered group IDs. */
  readonly getGroupIds: ReturnType<typeof materialsManager.getRegistry>['getGroupIds'];
  /** Whether a preset is registered. */
  readonly hasPreset: ReturnType<typeof materialsManager.getRegistry>['hasPreset'];
  /** Whether a category is registered. */
  readonly hasCategory: ReturnType<typeof materialsManager.getRegistry>['hasCategory'];
  /** Whether a group is registered. */
  readonly hasGroup: ReturnType<typeof materialsManager.getRegistry>['hasGroup'];
  /** Total registered preset count. */
  readonly presetCount: ReturnType<typeof materialsManager.getRegistry>['presetCount'];
  /** Total registered category count. */
  readonly categoryCount: ReturnType<typeof materialsManager.getRegistry>['categoryCount'];
  /** Total registered group count. */
  readonly groupCount: ReturnType<typeof materialsManager.getRegistry>['groupCount'];
  /** Get all enabled presets. */
  readonly getEnabledPresets: ReturnType<typeof materialsManager.getRegistry>['getEnabledPresets'];
  /** Get all enabled categories. */
  readonly getEnabledCategories: ReturnType<typeof materialsManager.getRegistry>['getEnabledCategories'];
  /** Get all enabled groups. */
  readonly getEnabledGroups: ReturnType<typeof materialsManager.getRegistry>['getEnabledGroups'];
}

/**
 * Access the read-only material registry.
 *
 * Returns memoized query methods derived from the materials-manager's
 * registry. All methods are stable — they never change identity.
 *
 * Must be used within a {@link MaterialsRoot}.
 *
 * @example
 * ```tsx
 * function MaterialCount() {
 *   const registry = useMaterialRegistry();
 *   return <span>Presets: {registry.presetCount()}</span>;
 * }
 * ```
 */
export function useMaterialRegistry(): UseMaterialRegistryReturn {
  /* Confirm the provider is mounted. */
  useMaterialsContext();

  const registry = materialsManager.getRegistry();

  return useMemo<UseMaterialRegistryReturn>(
    () => ({
      getPreset: registry.getPreset,
      getCategory: registry.getCategory,
      getGroup: registry.getGroup,
      getPresetIds: registry.getPresetIds,
      getCategoryIds: registry.getCategoryIds,
      getGroupIds: registry.getGroupIds,
      hasPreset: registry.hasPreset,
      hasCategory: registry.hasCategory,
      hasGroup: registry.hasGroup,
      presetCount: registry.presetCount,
      categoryCount: registry.categoryCount,
      groupCount: registry.groupCount,
      getEnabledPresets: registry.getEnabledPresets,
      getEnabledCategories: registry.getEnabledCategories,
      getEnabledGroups: registry.getEnabledGroups,
    }),
    [registry],
  );
}
